import type { Handler } from '@netlify/functions'
import { getTalentMapModelPreset } from '../../src/lib/talentMapModelPresets'
import {
  SUPPORTED_GENERATED_SECTION_KEYS,
  getSupportedGeneratedSectionTitle,
  isSupportedGeneratedSectionKey,
} from '../../src/lib/talentMapGeneratedSections'
import {
  buildErrorSummaryForSynthesis,
  buildProcessingAttemptUsageJson,
  jsonResponse,
  prepareTalentMapSectionInput,
  resolveFunctionOrigin,
  TALENT_MAP_SECTION_GENERATION_CORS_HEADERS,
  upsertProcessingLayerReport,
} from '../lib/talentMapSectionGeneration'
import { resolveSectionGenerationInputForPreset } from '../../src/lib/talentMapStandardSnapshotInput'
import { getTalentMapSectionDefinition } from '../../src/lib/talentMapSynthesisContract'
import { AuthError, getSupabaseAdmin, readBearerAuthorizationHeader, verifyBearerUser } from '../lib/supabaseAdmin'

type GenerateSectionPayload = {
  chart_id?: string
  section_key?: string
  model_preset_id?: string
}

const START_ENDPOINT = 'talent-map-section-generate'

function startErrorResponse(
  statusCode: number,
  params: {
    error: string
    error_kind?: 'technical' | 'audit_failed'
    stage: string
    audit?: unknown
    generation_error?: string
    report?: unknown
    extraDiagnostics?: Record<string, unknown>
  },
) {
  return jsonResponse(statusCode, {
    ok: false,
    error_kind: params.error_kind ?? 'technical',
    error: params.error,
    generation_error: params.generation_error,
    audit: params.audit,
    report: params.report,
    diagnostics: {
      stage: params.stage,
      endpoint: START_ENDPOINT,
      supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
      ...(params.extraDiagnostics ?? {}),
    },
  })
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: TALENT_MAP_SECTION_GENERATION_CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return startErrorResponse(405, {
      stage: 'method',
      error: 'Method not allowed.',
    })
  }

  const authorization = readBearerAuthorizationHeader(event.headers)

  try {
    const user = await verifyBearerUser(authorization)
    const payload = JSON.parse(event.body ?? '{}') as GenerateSectionPayload
    const chartId = payload.chart_id?.trim()
    const sectionKeyRaw = payload.section_key?.trim()
    const { preset: modelPreset, fallback_used: modelPresetFallbackUsed } = getTalentMapModelPreset(
      payload.model_preset_id,
    )

    if (!chartId) {
      return startErrorResponse(400, {
        stage: 'payload',
        error: 'chart_id is required.',
      })
    }

    if (!sectionKeyRaw) {
      return startErrorResponse(400, {
        stage: 'payload',
        error: 'section_key is required.',
      })
    }

    if (!isSupportedGeneratedSectionKey(sectionKeyRaw)) {
      return startErrorResponse(400, {
        stage: 'payload',
        error: 'Unsupported runtime-generated section_key.',
        extraDiagnostics: {
          requested_section_key: sectionKeyRaw,
          supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
        },
      })
    }

    const sectionKey = sectionKeyRaw
    const sectionTitle = getSupportedGeneratedSectionTitle(sectionKey)

    const admin = getSupabaseAdmin()

    const { data: chart, error: chartError } = await admin
      .from('hr_candidate_charts')
      .select('id, company_id, candidate_id')
      .eq('id', chartId)
      .maybeSingle()

    if (chartError) {
      throw new Error(chartError.message)
    }
    if (!chart) {
      return startErrorResponse(404, {
        stage: 'chart_lookup',
        error: 'Chart not found.',
        extraDiagnostics: { chart_id: chartId },
      })
    }

    const { data: company, error: companyError } = await admin
      .from('hr_companies')
      .select('id, owner_user_id')
      .eq('id', chart.company_id)
      .maybeSingle()

    if (companyError) {
      throw new Error(companyError.message)
    }
    if (!company || company.owner_user_id !== user.id) {
      return startErrorResponse(403, {
        stage: 'ownership',
        error: 'Chart does not belong to your company.',
        extraDiagnostics: {
          chart_id: chartId,
          company_id: chart.company_id,
        },
      })
    }

    let preparedInput: Awaited<ReturnType<typeof prepareTalentMapSectionInput>>
    try {
      preparedInput = await prepareTalentMapSectionInput(chartId, sectionKey)
    } catch (error) {
      const auditPayload = (error as Error & { auditPayload?: unknown }).auditPayload
      if (auditPayload) {
        return startErrorResponse(422, {
          stage: 'input_audit',
          error: 'Section input audit did not pass. OpenAI was not called.',
          error_kind: 'audit_failed',
          audit: auditPayload,
          extraDiagnostics: {
            section_key: sectionKey,
          },
        })
      }
      throw error
    }

    const startedAt = new Date().toISOString()
    const sectionDefinition = getTalentMapSectionDefinition(sectionKey)
    const resolvedInput = resolveSectionGenerationInputForPreset({
      sanitizedInput: preparedInput.inputBundleJson.section_input,
      sourceChips: preparedInput.sectionInput.source_chips,
      modelPreset,
      sectionGoal: sectionDefinition.section_goal,
    })
    const inputBundleJson = {
      ...preparedInput.inputBundleJson,
      section_input: resolvedInput.persistedSectionInput,
      input_bundle_mode: resolvedInput.inputBundleMode,
      model_preset_id: modelPreset.id,
      model_preset_fallback_used: modelPresetFallbackUsed,
      async_generation: true,
      started_at: startedAt,
    }

    const usageJson = buildProcessingAttemptUsageJson({
      modelPreset,
      modelPresetFallbackUsed,
      startedAt,
    })

    let processingReport: Awaited<ReturnType<typeof upsertProcessingLayerReport>>
    try {
      processingReport = await upsertProcessingLayerReport({
        companyId: chart.company_id,
        candidateId: chart.candidate_id,
        chartId: chart.id,
        sectionKey,
        sectionTitle,
        inputBundleJson,
        evidenceJson: preparedInput.evidenceJson,
        model: modelPreset.model,
        usageJson,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create processing layer report.'
      return startErrorResponse(500, {
        stage: 'processing_report_upsert',
        error: message,
        extraDiagnostics: {
          chart_id: chartId,
          section_key: sectionKey,
        },
      })
    }

    const origin = resolveFunctionOrigin(event)
    if (!origin) {
      throw new Error('Could not resolve function origin for background trigger.')
    }

    const backgroundUrl = `${origin}/.netlify/functions/talent-map-section-generate-background`

    try {
      const triggerResponse = await fetch(backgroundUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify({
          report_id: processingReport.id,
          chart_id: chart.id,
          section_key: sectionKey,
          model_preset_id: modelPreset.id,
        }),
      })

      if (!triggerResponse.ok && triggerResponse.status !== 202) {
        const triggerText = await triggerResponse.text()
        throw new Error(
          `Background generation trigger failed with status ${triggerResponse.status}: ${triggerText.slice(0, 300)}`,
        )
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Background generation trigger failed.'

      await admin
        .from('hr_candidate_layer_reports')
        .update({
          status: 'error',
          summary_for_synthesis: buildErrorSummaryForSynthesis(message),
          generation_error: message,
          quality_flags: [message],
          usage_json: {
            ...usageJson,
            finished_at: new Date().toISOString(),
          },
        })
        .eq('id', processingReport.id)

      return startErrorResponse(502, {
        stage: 'background_trigger',
        error: message,
        generation_error: message,
        report: processingReport,
        extraDiagnostics: {
          report_id: processingReport.id,
          section_key: sectionKey,
          background_url: backgroundUrl,
        },
      })
    }

    return jsonResponse(202, {
      ok: true,
      status: 'processing',
      report_id: processingReport.id,
      section_key: sectionKey,
      model_preset_id: modelPreset.id,
      report: processingReport,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return startErrorResponse(error.statusCode, {
        stage: 'auth',
        error: error.message,
      })
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected generation start error'
    return startErrorResponse(500, {
      stage: 'unexpected_catch',
      error: message,
    })
  }
}
