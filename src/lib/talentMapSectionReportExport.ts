import type { TalentMapSectionReport } from './talentMapSectionApi'
import {
  isTalentMapGeneratedSectionContent,
  TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION,
} from './talentMapGeneratedSectionContract'

const NOT_AVAILABLE = 'not_available'
const MAX_OUTPUT_TOKENS_NOT_SET = 'not set'

type UsageJsonRecord = Record<string, unknown>

function asRecord(value: unknown): UsageJsonRecord | null {
  return value && typeof value === 'object' ? (value as UsageJsonRecord) : null
}

function readIsoTimestamp(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parseTimestampMs(value: string | null): number | null {
  if (!value) {
    return null
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatGenerationDurationMs(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} ч ${minutes} мин ${seconds} сек`
  }

  if (minutes > 0) {
    return `${minutes} мин ${seconds} сек`
  }

  return `${seconds} сек`
}

export function formatGenerationDurationClock(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatGenerationDuration(startedAt: string | null, finishedAt: string | null): string {
  const startMs = parseTimestampMs(startedAt)
  const finishMs = parseTimestampMs(finishedAt)

  if (startMs === null || finishMs === null || finishMs < startMs) {
    return NOT_AVAILABLE
  }

  return formatGenerationDurationMs(finishMs - startMs)
}

export type ReportGenerationTiming = {
  startedAt: string | null
  finishedAt: string | null
  durationMs: number | null
  durationHuman: string
}

export function resolveReportGenerationTiming(report: TalentMapSectionReport): ReportGenerationTiming {
  const usage = asRecord(report.usage_json)
  const startedAt =
    readIsoTimestamp(usage?.started_at) ?? readIsoTimestamp(report.created_at)
  const finishedAt =
    readIsoTimestamp(usage?.finished_at) ??
    (report.status === 'ready' || report.status === 'error'
      ? readIsoTimestamp(report.updated_at)
      : null)

  const startMs = parseTimestampMs(startedAt)
  const finishMs = parseTimestampMs(finishedAt)

  if (startMs !== null && finishMs !== null && finishMs >= startMs) {
    const durationMs = finishMs - startMs
    return {
      startedAt,
      finishedAt,
      durationMs,
      durationHuman: formatGenerationDurationMs(durationMs),
    }
  }

  return {
    startedAt,
    finishedAt,
    durationMs: null,
    durationHuman: NOT_AVAILABLE,
  }
}

export type ReportGenerationMeta = {
  presetId: string
  presetLabel: string
  model: string
  reasoningEffort: string
  maxOutputTokens: string
  internalCreditCost: string
  estimatedCostUsd: string
  depthProfileId: string
  depthProfileLabel: string
  sourceIntegritySummary: string
}

export function resolveReportGenerationMeta(report: TalentMapSectionReport): ReportGenerationMeta {
  const content = isTalentMapGeneratedSectionContent(report.content_json)
    ? report.content_json
    : null
  const usage = asRecord(report.usage_json)
  const generationMeta = content?.generation_meta

  const estimatedCost =
    readNumber(report.estimated_cost_usd) ??
    readNumber(generationMeta?.estimated_cost_usd) ??
    readNumber(usage?.estimated_cost_usd)

  const sourceIntegrity = generationMeta?.source_integrity
  const sourceIntegritySummary =
    sourceIntegrity &&
    typeof sourceIntegrity === 'object' &&
    'input_source_chip_count' in sourceIntegrity
      ? [
          `input=${String(sourceIntegrity.input_source_chip_count)}`,
          `output=${String(sourceIntegrity.output_source_chip_count)}`,
          `removed=${String(sourceIntegrity.removed_unknown_source_count)}`,
          `normalized=${String(sourceIntegrity.normalized_source_key_count)}`,
        ].join(', ')
      : NOT_AVAILABLE

  return {
    presetId:
      generationMeta?.model_preset_id ??
      (typeof usage?.model_preset_id === 'string' ? usage.model_preset_id : NOT_AVAILABLE),
    presetLabel:
      generationMeta?.model_preset_label ??
      (typeof usage?.model_preset_label === 'string' ? usage.model_preset_label : NOT_AVAILABLE),
    model:
      generationMeta?.model ??
      report.model ??
      (typeof usage?.model === 'string' ? usage.model : NOT_AVAILABLE),
    reasoningEffort:
      generationMeta?.reasoning_effort ??
      (typeof usage?.reasoning_effort === 'string' ? usage.reasoning_effort : NOT_AVAILABLE),
    maxOutputTokens:
      generationMeta?.max_output_tokens !== undefined
        ? String(generationMeta.max_output_tokens)
        : usage?.max_output_tokens !== undefined
          ? String(usage.max_output_tokens)
          : MAX_OUTPUT_TOKENS_NOT_SET,
    internalCreditCost:
      generationMeta?.internal_credit_cost !== undefined
        ? String(generationMeta.internal_credit_cost)
        : usage?.internal_credit_cost !== undefined
          ? String(usage.internal_credit_cost)
          : NOT_AVAILABLE,
    estimatedCostUsd:
      estimatedCost !== null ? `~$${estimatedCost.toFixed(4)}` : NOT_AVAILABLE,
    depthProfileId:
      typeof generationMeta?.depth_profile_id === 'string'
        ? generationMeta.depth_profile_id
        : NOT_AVAILABLE,
    depthProfileLabel:
      typeof generationMeta?.depth_profile_label === 'string'
        ? generationMeta.depth_profile_label
        : NOT_AVAILABLE,
    sourceIntegritySummary,
  }
}

export type OpenAiTokenUsage = {
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
}

export function resolveOpenAiTokenUsage(report: TalentMapSectionReport): OpenAiTokenUsage {
  const usage = asRecord(report.usage_json)
  if (!usage) {
    return { inputTokens: null, outputTokens: null, totalTokens: null }
  }

  const inputTokens = readNumber(usage.input_tokens)
  const outputTokens = readNumber(usage.output_tokens)
  const totalTokens =
    readNumber(usage.total_tokens) ??
    (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null)

  return { inputTokens, outputTokens, totalTokens }
}

function formatQualityFlags(report: TalentMapSectionReport): string[] {
  if (!Array.isArray(report.quality_flags)) {
    return []
  }

  return report.quality_flags.filter((item): item is string => typeof item === 'string')
}

function formatSourceChipsMarkdown(report: TalentMapSectionReport): string {
  const content = isTalentMapGeneratedSectionContent(report.content_json)
    ? report.content_json
    : null

  if (!content?.source_chips?.length) {
    return NOT_AVAILABLE
  }

  return content.source_chips
    .map(
      (chip) =>
        `- **${chip.element_label || chip.element_key}** (${chip.element_kind}:${chip.element_key}) — ${chip.role_in_layer}\n  ${chip.reason_used}`,
    )
    .join('\n')
}

function formatSummaryForSynthesisMarkdown(report: TalentMapSectionReport): string {
  const summary =
    report.summary_for_synthesis ??
    (isTalentMapGeneratedSectionContent(report.content_json)
      ? report.content_json.summary_for_synthesis
      : null)

  if (!summary) {
    return NOT_AVAILABLE
  }

  return ['```json', JSON.stringify(summary, null, 2), '```'].join('\n')
}

function resolveSectionTitle(report: TalentMapSectionReport): string {
  if (report.layer_title) {
    return report.layer_title
  }

  if (
    isTalentMapGeneratedSectionContent(report.content_json) &&
    report.content_json.section_title
  ) {
    return report.content_json.section_title
  }

  return report.layer_key
}

function resolveSchemaVersion(report: TalentMapSectionReport): string {
  if (
    isTalentMapGeneratedSectionContent(report.content_json) &&
    report.content_json.schema_version
  ) {
    return report.content_json.schema_version
  }

  return TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION
}

function formatMarkdownListField(label: string, value: string): string {
  return `- ${label}: ${value}`
}

export function buildTalentMapSectionReportMarkdown(report: TalentMapSectionReport): string {
  const timing = resolveReportGenerationTiming(report)
  const meta = resolveReportGenerationMeta(report)
  const qualityFlags = formatQualityFlags(report)
  const tokenUsage = resolveOpenAiTokenUsage(report)

  const technicalMetadata = {
    report_id: report.id,
    candidate_id: report.candidate_id,
    chart_id: report.chart_id,
    model: meta.model === NOT_AVAILABLE ? report.model : meta.model,
    usage_json: report.usage_json ?? null,
    estimated_cost_usd:
      meta.estimatedCostUsd === NOT_AVAILABLE ? null : meta.estimatedCostUsd.replace(/^~/, ''),
    generation_error: report.generation_error,
    openai_token_usage: {
      input_tokens: tokenUsage.inputTokens,
      output_tokens: tokenUsage.outputTokens,
      total_tokens: tokenUsage.totalTokens,
    },
  }

  const generationDurationLine =
    timing.durationHuman === NOT_AVAILABLE
      ? formatMarkdownListField('generation_duration', NOT_AVAILABLE)
      : [
          formatMarkdownListField('generation_duration_ms', String(timing.durationMs)),
          formatMarkdownListField('generation_duration', timing.durationHuman),
        ].join('\n')

  return [
    '# ScanTalent — отчёт по разделу',
    '',
    '## Раздел',
    formatMarkdownListField('section_key', report.layer_key),
    formatMarkdownListField('section_title', resolveSectionTitle(report)),
    formatMarkdownListField('report_status', report.status),
    formatMarkdownListField('schema_version', resolveSchemaVersion(report)),
    '',
    '## Генерация',
    formatMarkdownListField('preset', meta.presetId),
    formatMarkdownListField('preset_label', meta.presetLabel),
    formatMarkdownListField('model', meta.model),
    formatMarkdownListField('reasoning_effort', meta.reasoningEffort),
    formatMarkdownListField('max_output_tokens', meta.maxOutputTokens),
    formatMarkdownListField('internal_credits', meta.internalCreditCost),
    formatMarkdownListField('estimated_cost_usd', meta.estimatedCostUsd),
    ...(meta.depthProfileId !== NOT_AVAILABLE
      ? [formatMarkdownListField('depth_profile_id', meta.depthProfileId)]
      : []),
    ...(meta.depthProfileLabel !== NOT_AVAILABLE
      ? [formatMarkdownListField('depth_profile_label', meta.depthProfileLabel)]
      : []),
    ...(meta.sourceIntegritySummary !== NOT_AVAILABLE
      ? [formatMarkdownListField('source_integrity', meta.sourceIntegritySummary)]
      : []),
    formatMarkdownListField(
      'generation_started_at',
      timing.startedAt ?? NOT_AVAILABLE,
    ),
    formatMarkdownListField(
      'generation_finished_at',
      timing.finishedAt ?? NOT_AVAILABLE,
    ),
    generationDurationLine,
    formatMarkdownListField('report_created_at', report.created_at),
    formatMarkdownListField('report_updated_at', report.updated_at),
    '',
    '## QA',
    formatMarkdownListField('quality_flags_count', String(qualityFlags.length)),
    formatMarkdownListField(
      'quality_flags',
      qualityFlags.length > 0 ? qualityFlags.join('; ') : '—',
    ),
    '',
    '## Base',
    report.base_markdown?.trim() || NOT_AVAILABLE,
    '',
    '## Pro / technical foundation',
    report.pro_markdown?.trim() || NOT_AVAILABLE,
    '',
    '## Source chips',
    formatSourceChipsMarkdown(report),
    '',
    '## Summary for synthesis',
    formatSummaryForSynthesisMarkdown(report),
    '',
    '## Technical metadata',
    '```json',
    JSON.stringify(technicalMetadata, null, 2),
    '```',
    '',
  ].join('\n')
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function buildSafeSectionReportFilename(report: TalentMapSectionReport): string {
  const candidateShort = report.candidate_id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 8) || 'candidate'
  const now = new Date()
  const timestamp = [
    now.getFullYear(),
    padDatePart(now.getMonth() + 1),
    padDatePart(now.getDate()),
  ].join('-')
  const clock = [padDatePart(now.getHours()), padDatePart(now.getMinutes())].join('-')

  return `scantalent_${report.layer_key}_${candidateShort}_${timestamp}_${clock}.md`
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}

export function downloadTalentMapSectionReport(report: TalentMapSectionReport): void {
  downloadTextFile(
    buildSafeSectionReportFilename(report),
    buildTalentMapSectionReportMarkdown(report),
  )
}
