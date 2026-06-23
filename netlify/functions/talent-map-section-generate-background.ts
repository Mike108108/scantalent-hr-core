import type { Handler } from '@netlify/functions'
import {
  SUPPORTED_GENERATED_SECTION_KEYS,
  isSupportedGeneratedSectionKey,
} from '../../src/lib/talentMapGeneratedSections'
import {
  buildErrorSummaryForSynthesis,
  jsonResponse,
  runBackgroundSectionGeneration,
  TALENT_MAP_SECTION_GENERATION_CORS_HEADERS,
} from '../lib/talentMapSectionGeneration'
import { AuthError, getSupabaseAdmin, readBearerAuthorizationHeader, verifyBearerUser } from '../lib/supabaseAdmin'

type BackgroundPayload = {
  report_id?: string
  chart_id?: string
  section_key?: string
  model_preset_id?: string
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: TALENT_MAP_SECTION_GENERATION_CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      ok: false,
      error_kind: 'technical',
      error: 'Method not allowed.',
    })
  }

  try {
    const user = await verifyBearerUser(readBearerAuthorizationHeader(event.headers))
    const payload = JSON.parse(event.body ?? '{}') as BackgroundPayload
    const reportId = payload.report_id?.trim()
    const chartId = payload.chart_id?.trim()
    const sectionKeyRaw = payload.section_key?.trim()
    const modelPresetId = payload.model_preset_id?.trim()

    if (!reportId) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'report_id is required.',
      })
    }

    if (!chartId) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'chart_id is required.',
      })
    }

    if (!sectionKeyRaw || !isSupportedGeneratedSectionKey(sectionKeyRaw)) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'Unsupported section_key for Stage 4-F0.2.',
        diagnostics: {
          requested_section_key: sectionKeyRaw ?? null,
          supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
        },
      })
    }

    const sectionKey = sectionKeyRaw

    const admin = getSupabaseAdmin()

    const { data: report, error: reportError } = await admin
      .from('hr_candidate_layer_reports')
      .select('id, chart_id, company_id')
      .eq('id', reportId)
      .maybeSingle()

    if (reportError) {
      throw new Error(reportError.message)
    }
    if (!report) {
      return jsonResponse(404, {
        ok: false,
        error_kind: 'technical',
        error: 'Layer report not found.',
      })
    }
    if (report.chart_id !== chartId) {
      return jsonResponse(403, {
        ok: false,
        error_kind: 'technical',
        error: 'Report chart_id mismatch.',
      })
    }

    const { data: company, error: companyError } = await admin
      .from('hr_companies')
      .select('id, owner_user_id')
      .eq('id', report.company_id)
      .maybeSingle()

    if (companyError) {
      throw new Error(companyError.message)
    }
    if (!company || company.owner_user_id !== user.id) {
      return jsonResponse(403, {
        ok: false,
        error_kind: 'technical',
        error: 'Report does not belong to your company.',
      })
    }

    await runBackgroundSectionGeneration({
      reportId,
      chartId,
      sectionKey,
      modelPresetId: modelPresetId ?? 'standard',
    })

    return jsonResponse(200, {
      ok: true,
      status: 'completed',
      report_id: reportId,
      section_key: sectionKey,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, {
        ok: false,
        error_kind: 'technical',
        error: error.message,
      })
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected background generation error'

    if (payloadReportId(event.body)) {
      try {
        const admin = getSupabaseAdmin()
        await admin
          .from('hr_candidate_layer_reports')
          .update({
            status: 'error',
            summary_for_synthesis: buildErrorSummaryForSynthesis(message),
            generation_error: message,
            quality_flags: [message],
            usage_json: {
              async_generation: true,
              finished_at: new Date().toISOString(),
            },
          })
          .eq('id', payloadReportId(event.body)!)
      } catch {
        // Best effort only.
      }
    }

    const sectionKeyRaw = payloadSectionKey(event.body)

    return jsonResponse(500, {
      ok: false,
      error_kind: 'technical',
      error: message,
      diagnostics: {
        stage: 'background_unexpected_catch',
        section_key: sectionKeyRaw,
        supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
      },
    })
  }
}

function payloadReportId(body: string | null | undefined): string | null {
  try {
    const payload = JSON.parse(body ?? '{}') as BackgroundPayload
    return payload.report_id?.trim() ?? null
  } catch {
    return null
  }
}

function payloadSectionKey(body: string | null | undefined): string | null {
  try {
    const payload = JSON.parse(body ?? '{}') as BackgroundPayload
    return payload.section_key?.trim() ?? null
  } catch {
    return null
  }
}
