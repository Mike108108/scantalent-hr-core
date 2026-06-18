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
import type { SourceChip } from '../../src/lib/talentMapSynthesisContract'
import {
  buildReferenceBundle,
  type ChartElementRow,
  type ReferenceInterpretationRow,
} from './buildReferenceBundle'
import { getSupabaseAdmin } from './supabaseAdmin'

export const WORK_MODE_SECTION_KEY = 'work_mode_and_entry'
export const WORK_MODE_SECTION_TITLE = 'Рабочий формат и вход в задачи'

export const TALENT_MAP_SECTION_GENERATION_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export type LayerReportStatus = 'processing' | 'ready' | 'error'

export function buildProcessingSummaryForSynthesis() {
  return {
    status: 'processing',
    one_sentence: '',
    key_conditions: [] as string[],
    potential_risks: [] as string[],
    source_element_keys: [] as string[],
  }
}

export function buildErrorSummaryForSynthesis(message: string) {
  return {
    status: 'error',
    one_sentence: '',
    key_conditions: [] as string[],
    potential_risks: [message],
    source_element_keys: [] as string[],
  }
}

export function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...TALENT_MAP_SECTION_GENERATION_CORS_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

export function readUsageTokenCount(usage: Record<string, unknown> | null, key: string): number | null {
  if (!usage) {
    return null
  }

  const value = usage[key]
  return typeof value === 'number' ? value : null
}

export function buildUsageJson(params: {
  openAiUsage: Record<string, unknown> | null
  modelPreset: TalentMapModelPreset
  modelPresetFallbackUsed: boolean
  asyncGeneration?: boolean
  startedAt?: string
  finishedAt?: string
}) {
  return {
    ...(params.openAiUsage ?? {}),
    model_preset_id: params.modelPreset.id,
    model_preset_label: params.modelPreset.ui_label,
    model_preset_fallback_used: params.modelPresetFallbackUsed,
    reasoning_effort: params.modelPreset.reasoning_effort,
    max_output_tokens: params.modelPreset.max_output_tokens,
    internal_credit_cost: params.modelPreset.internal_credit_cost,
    ...(params.asyncGeneration ? { async_generation: true } : {}),
    ...(params.startedAt ? { started_at: params.startedAt } : {}),
    ...(params.finishedAt ? { finished_at: params.finishedAt } : {}),
  }
}

export function buildEvidenceJson(sectionInput: {
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

export async function callOpenAiForSection(
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

export async function upsertProcessingLayerReport(params: {
  companyId: string
  candidateId: string
  chartId: string
  inputBundleJson: unknown
  evidenceJson: unknown
  model: string
  usageJson: unknown
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
    status: 'processing',
    input_bundle_json: params.inputBundleJson,
    content_json: {},
    base_markdown: null,
    pro_markdown: null,
    summary_for_synthesis: buildProcessingSummaryForSynthesis(),
    evidence_json: params.evidenceJson,
    quality_flags: [],
    model: params.model,
    usage_json: params.usageJson ?? {},
    estimated_cost_usd: null,
    generation_error: null,
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

export async function updateLayerReportById(
  reportId: string,
  row: Record<string, unknown>,
) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('hr_candidate_layer_reports')
    .update(row)
    .eq('id', reportId)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function markLayerReportError(params: {
  reportId: string
  inputBundleJson: unknown
  evidenceJson: unknown
  contentJson: unknown
  qualityFlags: string[]
  model: string | null
  usageJson: unknown
  estimatedCostUsd: number | null
  generationError: string
}) {
  return updateLayerReportById(params.reportId, {
    status: 'error',
    input_bundle_json: params.inputBundleJson,
    content_json: params.contentJson,
    base_markdown: null,
    pro_markdown: null,
    summary_for_synthesis: buildErrorSummaryForSynthesis(params.generationError),
    evidence_json: params.evidenceJson,
    quality_flags: params.qualityFlags,
    model: params.model,
    usage_json: params.usageJson,
    estimated_cost_usd: params.estimatedCostUsd,
    generation_error: params.generationError,
  })
}

export function readInputBundleSectionInput(inputBundleJson: unknown): {
  section_input?: {
    source_chips?: SourceChip[]
  }
} | null {
  if (!inputBundleJson || typeof inputBundleJson !== 'object') {
    return null
  }

  return inputBundleJson as {
    section_input?: {
      source_chips?: SourceChip[]
    }
  }
}

export async function prepareWorkModeSectionInput(chartId: string) {
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
    throw new Error('Chart not found.')
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
    throw new Error('Section input for work_mode_and_entry was not found.')
  }

  const sectionAuditSummary = auditReport.section_summaries.find(
    (summary) => summary.section_key === WORK_MODE_SECTION_KEY,
  )

  if (auditReport.overall_severity !== 'ok' || sectionInput.generation_status !== 'input_ready') {
    const auditError = new Error('Section input audit did not pass. OpenAI was not called.')
    ;(auditError as Error & { auditPayload?: unknown }).auditPayload = {
      overall_severity: auditReport.overall_severity,
      section_generation_status: sectionInput.generation_status,
      section_summary: sectionAuditSummary ?? null,
      issues: auditReport.issues.filter(
        (issue) => !issue.section_key || issue.section_key === WORK_MODE_SECTION_KEY,
      ),
    }
    throw auditError
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
  }

  return {
    chart,
    sectionInput,
    inputBundleJson,
    evidenceJson: buildEvidenceJson(sectionInput),
    auditReport,
    sectionAuditSummary,
  }
}

export async function runBackgroundSectionGeneration(params: {
  reportId: string
  chartId: string
  modelPresetId: string
}) {
  const admin = getSupabaseAdmin()
  const startedAt = new Date().toISOString()

  const { data: report, error: reportError } = await admin
    .from('hr_candidate_layer_reports')
    .select('*')
    .eq('id', params.reportId)
    .maybeSingle()

  if (reportError) {
    throw new Error(reportError.message)
  }
  if (!report) {
    throw new Error('Layer report not found.')
  }
  if (report.chart_id !== params.chartId) {
    throw new Error('Report chart_id mismatch.')
  }
  if (report.layer_key !== WORK_MODE_SECTION_KEY) {
    throw new Error('Unsupported section key for background generation.')
  }

  const inputBundleRecord =
    report.input_bundle_json && typeof report.input_bundle_json === 'object'
      ? (report.input_bundle_json as Record<string, unknown>)
      : {}

  const { preset: modelPreset, fallback_used: modelPresetFallbackUsed } = getTalentMapModelPreset(
    params.modelPresetId || inputBundleRecord.model_preset_id,
  )

  const inputBundleJson = {
    ...inputBundleRecord,
    model_preset_id: modelPreset.id,
    model_preset_fallback_used: modelPresetFallbackUsed,
  }

  const sectionInputBundle = readInputBundleSectionInput(inputBundleJson)
  const sanitizedInput = sectionInputBundle?.section_input
  if (!sanitizedInput) {
    throw new Error('Section input bundle is missing section_input.')
  }

  const sourceChips = Array.isArray(sanitizedInput.source_chips)
    ? sanitizedInput.source_chips
    : []

  const evidenceJson = report.evidence_json ?? {}

  let openAiResult: Awaited<ReturnType<typeof callOpenAiForSection>>
  try {
    openAiResult = await callOpenAiForSection(sanitizedInput, modelPreset)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OpenAI section synthesis failed.'
    const usageJson = buildUsageJson({
      openAiUsage: null,
      modelPreset,
      modelPresetFallbackUsed,
      asyncGeneration: true,
      startedAt,
      finishedAt: new Date().toISOString(),
    })

    await markLayerReportError({
      reportId: params.reportId,
      inputBundleJson,
      evidenceJson,
      contentJson: {},
      qualityFlags: [message],
      model: modelPreset.model,
      usageJson,
      estimatedCostUsd: null,
      generationError: message,
    })
    return
  }

  const usageJson = buildUsageJson({
    openAiUsage: openAiResult.usage,
    modelPreset,
    modelPresetFallbackUsed,
    asyncGeneration: true,
    startedAt,
    finishedAt: new Date().toISOString(),
  })

  const estimatedCostUsd = estimateOpenAiCostUsd({
    input_tokens: readUsageTokenCount(openAiResult.usage, 'input_tokens'),
    output_tokens: readUsageTokenCount(openAiResult.usage, 'output_tokens'),
    preset: modelPreset,
  })

  const qaResult = runTalentMapGeneratedSectionQa({
    generated: openAiResult.parsed,
    inputSourceChips: sourceChips,
  })

  if (!qaResult.ok || !qaResult.data) {
    await markLayerReportError({
      reportId: params.reportId,
      inputBundleJson,
      evidenceJson,
      contentJson: qaResult.data ?? openAiResult.parsed,
      qualityFlags: qaResult.issues,
      model: openAiResult.model,
      usageJson,
      estimatedCostUsd,
      generationError: QA_FAILURE_GENERATION_ERROR,
    })
    return
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

  await updateLayerReportById(params.reportId, {
    status: 'ready',
    input_bundle_json: inputBundleJson,
    content_json: generatedSection,
    base_markdown: baseMarkdown,
    pro_markdown: proMarkdown,
    summary_for_synthesis: generatedSection.summary_for_synthesis,
    evidence_json: evidenceJson,
    quality_flags: [],
    model: openAiResult.model,
    usage_json: usageJson,
    estimated_cost_usd: estimatedCostUsd,
    generation_error: null,
  })
}

export function resolveFunctionOrigin(event: {
  headers: Record<string, string | undefined>
}) {
  const host = event.headers.host ?? event.headers.Host
  const protocol = event.headers['x-forwarded-proto'] ?? 'https'
  if (!host) {
    return null
  }
  return `${protocol}://${host}`
}
