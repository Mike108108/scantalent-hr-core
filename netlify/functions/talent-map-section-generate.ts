import type { Handler } from '@netlify/functions'
import { buildTalentMapSynthesisInput } from '../../src/lib/buildTalentMapSynthesisInput'
import {
  renderGeneratedSectionBaseMarkdown,
  renderGeneratedSectionProMarkdown,
  type TalentMapGeneratedSection,
} from '../../src/lib/talentMapGeneratedSectionContract'
import { runTalentMapGeneratedSectionQa } from '../../src/lib/talentMapGeneratedSectionQa'
import {
  estimateOpenAiCostUsd,
  getTalentMapModelPreset,
  type TalentMapModelPreset,
} from '../../src/lib/talentMapModelPresets'
import { buildTalentMapSectionInputAudit } from '../../src/lib/talentMapSectionInputAudit'
import {
  buildSanitizedSectionInputForAi,
  extractOpenAiResponseText,
  extractOpenAiUsage,
  TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA,
  TALENT_MAP_SECTION_SYSTEM_PROMPT,
} from '../../src/lib/talentMapSectionOpenAiSchema'
import { QA_FAILURE_GENERATION_ERROR } from '../../src/lib/talentMapSectionErrors'
import { getTalentMapSectionDefinition } from '../../src/lib/talentMapSynthesisContract'
import {
  buildReferenceBundle,
  type ChartElementRow,
  type ReferenceInterpretationRow,
} from '../lib/buildReferenceBundle'
import { AuthError, getSupabaseAdmin, verifyBearerUser } from '../lib/supabaseAdmin'

type GenerateSectionPayload = {
  chart_id?: string
  section_key?: string
  model_preset_id?: string
}

const WORK_MODE_SECTION_KEY = 'work_mode_and_entry'
const WORK_MODE_SECTION_TITLE = 'Рабочий формат и вход в задачи'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

function readUsageTokenCount(usage: Record<string, unknown> | null, key: string): number | null {
  if (!usage) {
    return null
  }

  const value = usage[key]
  return typeof value === 'number' ? value : null
}

function buildUsageJson(params: {
  openAiUsage: Record<string, unknown> | null
  modelPreset: TalentMapModelPreset
  modelPresetFallbackUsed: boolean
}) {
  return {
    ...(params.openAiUsage ?? {}),
    model_preset_id: params.modelPreset.id,
    model_preset_label: params.modelPreset.ui_label,
    model_preset_fallback_used: params.modelPresetFallbackUsed,
    reasoning_effort: params.modelPreset.reasoning_effort,
    max_output_tokens: params.modelPreset.max_output_tokens,
    internal_credit_cost: params.modelPreset.internal_credit_cost,
  }
}

async function callOpenAiForSection(
  sanitizedInput: unknown,
  modelPreset: TalentMapModelPreset,
): Promise<{
  parsed: unknown
  model: string
  usage: Record<string, unknown> | null
}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const userPayloadText = JSON.stringify(sanitizedInput)

  const requestBody: Record<string, unknown> = {
    model: modelPreset.model,
    reasoning: {
      effort: modelPreset.reasoning_effort,
    },
    max_output_tokens: modelPreset.max_output_tokens,
    input: [
      {
        role: 'developer',
        content: [
          {
            type: 'input_text',
            text: TALENT_MAP_SECTION_SYSTEM_PROMPT,
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: userPayloadText,
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'talent_map_generated_section_v1_1',
        strict: true,
        schema: TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA,
      },
    },
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const payload = (await response.json()) as Record<string, unknown>

  if (!response.ok) {
    const message =
      typeof payload.error === 'object' &&
      payload.error &&
      'message' in payload.error &&
      typeof (payload.error as { message?: unknown }).message === 'string'
        ? (payload.error as { message: string }).message
        : `OpenAI request failed with status ${response.status}.`
    throw new Error(message)
  }

  const outputText = extractOpenAiResponseText(payload)
  if (!outputText) {
    throw new Error('OpenAI response did not contain JSON output.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(outputText)
  } catch {
    throw new Error('OpenAI response JSON could not be parsed.')
  }

  return {
    parsed,
    model: modelPreset.model,
    usage: extractOpenAiUsage(payload),
  }
}

function buildEvidenceJson(sectionInput: {
  source_chips: unknown
  source_digests: Array<{
    element_kind: string
    element_key: string
    element_label: string | null
    source_role: string
    digest: Record<string, unknown>
  }>
}) {
  return {
    source_chips: sectionInput.source_chips,
    source_digests_summary: sectionInput.source_digests.map((digest) => ({
      element_kind: digest.element_kind,
      element_key: digest.element_key,
      element_label: digest.element_label,
      source_role: digest.source_role,
      digest_fields: Object.keys(digest.digest ?? {}),
    })),
  }
}

async function upsertLayerReport(params: {
  companyId: string
  candidateId: string
  chartId: string
  status: 'ready' | 'error'
  inputBundleJson: unknown
  contentJson: unknown
  baseMarkdown: string | null
  proMarkdown: string | null
  summaryForSynthesis: unknown
  evidenceJson: unknown
  qualityFlags: string[]
  model: string | null
  usageJson: unknown
  estimatedCostUsd: number | null
  generationError: string | null
}) {
  const admin = getSupabaseAdmin()

  const { data: existing, error: existingError } = await admin
    .from('hr_candidate_layer_reports')
    .select('id')
    .eq('candidate_id', params.candidateId)
    .eq('chart_id', params.chartId)
    .eq('layer_key', WORK_MODE_SECTION_KEY)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) {
    throw new Error(existingError.message)
  }

  const row = {
    company_id: params.companyId,
    candidate_id: params.candidateId,
    chart_id: params.chartId,
    layer_key: WORK_MODE_SECTION_KEY,
    layer_title: WORK_MODE_SECTION_TITLE,
    status: params.status,
    input_bundle_json: params.inputBundleJson,
    content_json: params.contentJson,
    base_markdown: params.baseMarkdown,
    pro_markdown: params.proMarkdown,
    summary_for_synthesis: params.summaryForSynthesis,
    evidence_json: params.evidenceJson,
    quality_flags: params.qualityFlags,
    model: params.model,
    usage_json: params.usageJson ?? {},
    estimated_cost_usd: params.estimatedCostUsd,
    generation_error: params.generationError,
  }

  if (existing?.id) {
    const { data, error } = await admin
      .from('hr_candidate_layer_reports')
      .update(row)
      .eq('id', existing.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  const { data, error } = await admin
    .from('hr_candidate_layer_reports')
    .insert(row)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      ok: false,
      error_kind: 'technical',
      error: 'Method not allowed.',
    })
  }

  try {
    const user = await verifyBearerUser(event.headers.authorization ?? event.headers.Authorization)
    const payload = JSON.parse(event.body ?? '{}') as GenerateSectionPayload
    const chartId = payload.chart_id?.trim()
    const sectionKey = payload.section_key?.trim()
    const { preset: modelPreset, fallback_used: modelPresetFallbackUsed } = getTalentMapModelPreset(
      payload.model_preset_id,
    )

    if (!chartId) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'chart_id is required.',
      })
    }

    if (!sectionKey) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'section_key is required.',
      })
    }

    if (sectionKey !== WORK_MODE_SECTION_KEY) {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'Only work_mode_and_entry is supported in Stage 4-F0.1.',
      })
    }

    const admin = getSupabaseAdmin()

    const { data: chart, error: chartError } = await admin
      .from('hr_candidate_charts')
      .select('id, company_id, candidate_id, input_hash')
      .eq('id', chartId)
      .maybeSingle()

    if (chartError) {
      throw new Error(chartError.message)
    }
    if (!chart) {
      return jsonResponse(404, {
        ok: false,
        error_kind: 'technical',
        error: 'Chart not found.',
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
      return jsonResponse(403, {
        ok: false,
        error_kind: 'technical',
        error: 'Chart does not belong to your company.',
      })
    }

    const { data: elementRows, error: elementsError } = await admin
      .from('hr_candidate_chart_elements')
      .select('*')
      .eq('chart_id', chartId)
      .order('element_kind', { ascending: true })
      .order('element_key', { ascending: true })

    if (elementsError) {
      throw new Error(elementsError.message)
    }

    const elements = (elementRows ?? []) as ChartElementRow[]

    const { data: interpretationRows, error: interpretationsError } = await admin
      .from('hd_reference_interpretations')
      .select(
        'element_kind, element_key, element_label, classic_markdown, hr_translation_markdown, pro_markdown, talent_hints, risk_hints, management_hints, environment_hints, limitations, base_layers, pro_layers, context_rules, not_self_layers, contrast_examples, source_quality',
      )
      .eq('language', 'ru')
      .eq('version', 'v1')

    if (interpretationsError) {
      throw new Error(interpretationsError.message)
    }

    const interpretations = (interpretationRows ?? []) as ReferenceInterpretationRow[]
    const { bundle, coverage } = buildReferenceBundle(elements, interpretations)

    const synthesisPreview = buildTalentMapSynthesisInput({
      candidateId: chart.candidate_id,
      chartId: chart.id,
      bundle,
      coverage,
    })

    const auditReport = buildTalentMapSectionInputAudit(synthesisPreview)
    const sectionInput = synthesisPreview.sections.find(
      (section) => section.section_key === WORK_MODE_SECTION_KEY,
    )

    if (!sectionInput) {
      return jsonResponse(422, {
        ok: false,
        error: 'Section input for work_mode_and_entry was not found.',
      })
    }

    const sectionAuditSummary = auditReport.section_summaries.find(
      (summary) => summary.section_key === WORK_MODE_SECTION_KEY,
    )

    if (auditReport.overall_severity !== 'ok' || sectionInput.generation_status !== 'input_ready') {
      return jsonResponse(422, {
        ok: false,
        error: 'Section input audit did not pass. OpenAI was not called.',
        error_kind: 'audit_failed',
        audit: {
          overall_severity: auditReport.overall_severity,
          section_generation_status: sectionInput.generation_status,
          section_summary: sectionAuditSummary ?? null,
          issues: auditReport.issues.filter(
            (issue) => !issue.section_key || issue.section_key === WORK_MODE_SECTION_KEY,
          ),
        },
      })
    }

    const sectionDefinition = getTalentMapSectionDefinition(WORK_MODE_SECTION_KEY)
    const sanitizedInput = buildSanitizedSectionInputForAi({
      section: sectionInput,
      section_goal: sectionDefinition.section_goal,
      global_guardrails: synthesisPreview.global_guardrails,
    })

    const inputBundleJson = {
      section_input: sanitizedInput,
      audit_snapshot: {
        overall_severity: auditReport.overall_severity,
        section_summary: sectionAuditSummary ?? null,
      },
      chart_input_hash: chart.input_hash ?? null,
      model_preset_id: modelPreset.id,
      model_preset_fallback_used: modelPresetFallbackUsed,
    }

    let openAiResult: Awaited<ReturnType<typeof callOpenAiForSection>>
    try {
      openAiResult = await callOpenAiForSection(sanitizedInput, modelPreset)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'OpenAI section synthesis failed.'

      const usageJson = buildUsageJson({
        openAiUsage: null,
        modelPreset,
        modelPresetFallbackUsed,
      })

      const errorReport = await upsertLayerReport({
        companyId: chart.company_id,
        candidateId: chart.candidate_id,
        chartId: chart.id,
        status: 'error',
        inputBundleJson,
        contentJson: {},
        baseMarkdown: null,
        proMarkdown: null,
        summaryForSynthesis: {},
        evidenceJson: buildEvidenceJson(sectionInput),
        qualityFlags: [message],
        model: modelPreset.model,
        usageJson,
        estimatedCostUsd: null,
        generationError: message,
      })

      return jsonResponse(502, {
        ok: false,
        error: message,
        error_kind: 'technical',
        generation_error: message,
        report: errorReport,
      })
    }

    const usageJson = buildUsageJson({
      openAiUsage: openAiResult.usage,
      modelPreset,
      modelPresetFallbackUsed,
    })

    const estimatedCostUsd = estimateOpenAiCostUsd({
      input_tokens: readUsageTokenCount(openAiResult.usage, 'input_tokens'),
      output_tokens: readUsageTokenCount(openAiResult.usage, 'output_tokens'),
      preset: modelPreset,
    })

    const qaResult = runTalentMapGeneratedSectionQa({
      generated: openAiResult.parsed,
      inputSourceChips: sectionInput.source_chips,
    })

    if (!qaResult.ok || !qaResult.data) {
      const generationError = QA_FAILURE_GENERATION_ERROR

      const errorReport = await upsertLayerReport({
        companyId: chart.company_id,
        candidateId: chart.candidate_id,
        chartId: chart.id,
        status: 'error',
        inputBundleJson,
        contentJson: qaResult.data ?? openAiResult.parsed,
        baseMarkdown: null,
        proMarkdown: null,
        summaryForSynthesis: {},
        evidenceJson: buildEvidenceJson(sectionInput),
        qualityFlags: qaResult.issues,
        model: openAiResult.model,
        usageJson,
        estimatedCostUsd,
        generationError,
      })

      return jsonResponse(422, {
        ok: false,
        error: generationError,
        error_kind: 'qa_failed',
        quality_flags: qaResult.issues,
        generation_error: generationError,
        report: errorReport,
      })
    }

    const generatedSection: TalentMapGeneratedSection = {
      ...qaResult.data,
      generation_meta: {
        model_preset_id: modelPreset.id,
        model_preset_label: modelPreset.ui_label,
        model: modelPreset.model,
        reasoning_effort: modelPreset.reasoning_effort,
        max_output_tokens: modelPreset.max_output_tokens,
        internal_credit_cost: modelPreset.internal_credit_cost,
        estimated_cost_usd: estimatedCostUsd,
      },
    }

    const baseMarkdown = renderGeneratedSectionBaseMarkdown(generatedSection)
    const proMarkdown = renderGeneratedSectionProMarkdown(generatedSection)

    const report = await upsertLayerReport({
      companyId: chart.company_id,
      candidateId: chart.candidate_id,
      chartId: chart.id,
      status: 'ready',
      inputBundleJson,
      contentJson: generatedSection,
      baseMarkdown,
      proMarkdown,
      summaryForSynthesis: generatedSection.summary_for_synthesis,
      evidenceJson: buildEvidenceJson(sectionInput),
      qualityFlags: [],
      model: openAiResult.model,
      usageJson,
      estimatedCostUsd,
      generationError: null,
    })

    return jsonResponse(200, {
      ok: true,
      report,
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
      error instanceof Error ? error.message : 'Unexpected generation error'
    return jsonResponse(500, {
      ok: false,
      error_kind: 'technical',
      error: message,
      diagnostics: {
        stage: 'unexpected_catch',
        section_key: WORK_MODE_SECTION_KEY,
      },
    })
  }
}
