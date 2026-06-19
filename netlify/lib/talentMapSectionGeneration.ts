import { buildTalentMapSynthesisInput } from '../../src/lib/buildTalentMapSynthesisInput'
import {
  cleanGeneratedSectionText,
  renderGeneratedSectionBaseMarkdown,
  renderGeneratedSectionProMarkdown,
  validateTalentMapGeneratedSection,
  type TalentMapGeneratedSection,
} from '../../src/lib/talentMapGeneratedSectionContract'
import { enforceGeneratedSectionSourceIntegrity } from '../../src/lib/talentMapGeneratedSectionSourceIntegrity'
import { runTalentMapGeneratedSectionQa } from '../../src/lib/talentMapGeneratedSectionQa'
import { getTalentMapDepthProfile } from '../../src/lib/talentMapDepthProfiles'
import {
  estimateOpenAiCostUsd,
  getTalentMapModelPreset,
  type TalentMapModelPreset,
} from '../../src/lib/talentMapModelPresets'
import { buildTalentMapSectionInputAudit } from '../../src/lib/talentMapSectionInputAudit'
import {
  buildOpenAiParseFailureContentJson,
  buildSanitizedSectionInputForAi,
  buildTalentMapSectionSystemPrompt,
  enrichSectionInputForOpenAi,
  extractOpenAiResponseDiagnostics,
  extractOpenAiResponseText,
  extractOpenAiUsage,
  isOpenAiSectionParseError,
  OpenAiSectionParseError,
  parseOpenAiJsonOutput,
  TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA,
} from '../../src/lib/talentMapSectionOpenAiSchema'
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

function resolveOpenAiCallErrorContext(
  error: unknown,
  modelPreset: TalentMapModelPreset,
): {
  message: string
  usage: Record<string, unknown> | null
  model: string
  contentJson: Record<string, unknown>
  qualityFlags: string[]
} {
  if (isOpenAiSectionParseError(error)) {
    const stage =
      typeof error.diagnostics.stage === 'string'
        ? error.diagnostics.stage
        : 'openai_json_parse_failed'

    return {
      message: error.message,
      usage: error.usage,
      model: error.model,
      contentJson: buildOpenAiParseFailureContentJson({
        message: error.message,
        diagnostics: error.diagnostics,
      }),
      qualityFlags: [error.message, `stage: ${stage}`],
    }
  }

  const message = error instanceof Error ? error.message : 'OpenAI section synthesis failed.'

  return {
    message,
    usage: null,
    model: modelPreset.model,
    contentJson: {},
    qualityFlags: [message],
  }
}

export async function callOpenAiForSection(
  enrichedInput: unknown,
  modelPreset: TalentMapModelPreset,
): Promise<{
  parsed: unknown
  model: string
  usage: Record<string, unknown> | null
  diagnostics: Record<string, unknown>
  parse_strategy: string
}> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  const depthProfile = getTalentMapDepthProfile(modelPreset.depth_profile_id)
  const systemPrompt = buildTalentMapSectionSystemPrompt({ depthProfile })
  const userPayloadText = JSON.stringify(enrichedInput)

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
            text: systemPrompt,
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

  const usage = extractOpenAiUsage(payload)
  const outputText = extractOpenAiResponseText(payload)
  const openAiDiagnostics = extractOpenAiResponseDiagnostics(payload, outputText)

  if (!outputText) {
    throw new OpenAiSectionParseError({
      message: 'OpenAI response did not contain JSON output.',
      diagnostics: {
        stage: 'openai_json_output_missing',
        openai_response_diagnostics: openAiDiagnostics,
        model_preset_id: modelPreset.id,
        model_preset_label: modelPreset.ui_label,
      },
      usage,
      model: modelPreset.model,
      modelPresetId: modelPreset.id,
      modelPresetLabel: modelPreset.ui_label,
    })
  }

  const parseResult = parseOpenAiJsonOutput(outputText)
  if (!parseResult.ok) {
    throw new OpenAiSectionParseError({
      message: 'OpenAI response JSON could not be parsed.',
      diagnostics: {
        stage: 'openai_json_parse_failed',
        parse_error_message: parseResult.error,
        raw_response_preview: parseResult.raw_preview,
        cleaned_response_preview: parseResult.cleaned_preview,
        parse_strategy_attempts: parseResult.parse_strategy_attempts,
        openai_response_diagnostics: openAiDiagnostics,
        model_preset_id: modelPreset.id,
        model_preset_label: modelPreset.ui_label,
      },
      usage,
      model: modelPreset.model,
      modelPresetId: modelPreset.id,
      modelPresetLabel: modelPreset.ui_label,
    })
  }

  return {
    parsed: parseResult.parsed,
    model: modelPreset.model,
    usage,
    diagnostics: openAiDiagnostics,
    parse_strategy: parseResult.parse_strategy,
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

export function enrichWorkModeSectionInputForGeneration(params: {
  sanitizedInput: ReturnType<typeof buildSanitizedSectionInputForAi>
  sourceChips: SourceChip[]
  modelPreset: TalentMapModelPreset
}) {
  const depthProfile = getTalentMapDepthProfile(params.modelPreset.depth_profile_id)
  return enrichSectionInputForOpenAi({
    sectionInput: params.sanitizedInput,
    depthProfile,
    sourceChips: params.sourceChips,
  })
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

  const sectionInputBundle = readInputBundleSectionInput(inputBundleRecord)
  const sanitizedInput = sectionInputBundle?.section_input
  if (!sanitizedInput) {
    throw new Error('Section input bundle is missing section_input.')
  }

  const sourceChips = Array.isArray(sanitizedInput.source_chips)
    ? sanitizedInput.source_chips
    : []

  const enrichedInput = enrichWorkModeSectionInputForGeneration({
    sanitizedInput: sanitizedInput as ReturnType<typeof buildSanitizedSectionInputForAi>,
    sourceChips,
    modelPreset,
  })

  const inputBundleJson = {
    ...inputBundleRecord,
    model_preset_id: modelPreset.id,
    model_preset_fallback_used: modelPresetFallbackUsed,
    section_input: enrichedInput,
  }

  const evidenceJson = report.evidence_json ?? {}

  let openAiResult: Awaited<ReturnType<typeof callOpenAiForSection>>
  try {
    openAiResult = await callOpenAiForSection(enrichedInput, modelPreset)
  } catch (error) {
    const errorContext = resolveOpenAiCallErrorContext(error, modelPreset)
    const usageJson = buildUsageJson({
      openAiUsage: errorContext.usage,
      modelPreset,
      modelPresetFallbackUsed,
      asyncGeneration: true,
      startedAt,
      finishedAt: new Date().toISOString(),
    })

    const estimatedCostUsd = estimateOpenAiCostUsd({
      input_tokens: readUsageTokenCount(errorContext.usage, 'input_tokens'),
      output_tokens: readUsageTokenCount(errorContext.usage, 'output_tokens'),
      preset: modelPreset,
    })

    await markLayerReportError({
      reportId: params.reportId,
      inputBundleJson,
      evidenceJson,
      contentJson: errorContext.contentJson,
      qualityFlags: errorContext.qualityFlags,
      model: errorContext.model,
      usageJson,
      estimatedCostUsd,
      generationError: errorContext.message,
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

  const schemaValidation = validateTalentMapGeneratedSection(openAiResult.parsed)
  if (!schemaValidation.ok || !schemaValidation.data) {
    const schemaIssues =
      schemaValidation.issues.length > 0
        ? schemaValidation.issues
        : ['Generated section JSON is invalid.']
    await markLayerReportError({
      reportId: params.reportId,
      inputBundleJson,
      evidenceJson,
      contentJson: openAiResult.parsed,
      qualityFlags: schemaIssues,
      model: openAiResult.model,
      usageJson,
      estimatedCostUsd,
      generationError: schemaIssues.join('; '),
    })
    return
  }

  const cleanedSection = cleanGeneratedSectionText(schemaValidation.data)

  const sourceIntegrityResult = enforceGeneratedSectionSourceIntegrity({
    section: cleanedSection,
    inputSourceChips: sourceChips,
  })

  const qaResult = runTalentMapGeneratedSectionQa({
    generated: sourceIntegrityResult.section,
    inputSourceChips: sourceChips,
  })

  const depthProfile = getTalentMapDepthProfile(modelPreset.depth_profile_id)

  const generatedSection: TalentMapGeneratedSection = {
    ...sourceIntegrityResult.section,
    generation_meta: {
      model_preset_id: modelPreset.id,
      model_preset_label: modelPreset.ui_label,
      model: modelPreset.model,
      reasoning_effort: modelPreset.reasoning_effort,
      max_output_tokens: modelPreset.max_output_tokens,
      internal_credit_cost: modelPreset.internal_credit_cost,
      estimated_cost_usd: estimatedCostUsd,
      depth_profile_id: depthProfile.id,
      depth_profile_label: depthProfile.ui_label,
      source_integrity: sourceIntegrityResult.stats,
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
    quality_flags: [...sourceIntegrityResult.warnings, ...qaResult.warnings],
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
