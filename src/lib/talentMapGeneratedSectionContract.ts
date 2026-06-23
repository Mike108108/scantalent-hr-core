import {
  getSupportedGeneratedSectionTitle,
  isSupportedGeneratedSectionKey,
  SUPPORTED_GENERATED_SECTION_KEYS,
  type SupportedGeneratedSectionKey,
} from './talentMapGeneratedSections'
import type { TalentMapPresetWorkflowRole } from './talentMapModelPresets'

export const TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION = 'talent_map_section_v1_1' as const

export type TalentMapGeneratedSectionSourceIntegrityMeta = {
  input_source_chip_count: number
  output_source_chip_count: number
  removed_unknown_source_count: number
  normalized_source_key_count: number
}

export type TalentMapGeneratedSectionGenerationMeta = {
  model_preset_id: string
  model_preset_label: string
  model: string
  reasoning_effort: string
  max_output_tokens?: number
  max_output_tokens_policy?: 'omitted' | 'set'
  internal_credit_cost: number
  estimated_cost_usd: number | null
  depth_profile_id: string
  depth_profile_label: string
  generation_mode?: 'standard_snapshot' | 'full_section'
  openai_schema_name?:
    | 'talent_map_standard_snapshot_v1_0'
    | 'talent_map_generated_section_v1_1'
  input_bundle_mode?: 'standard_snapshot_input_v1' | 'full_section_input_v1'
  preset_workflow_role?: TalentMapPresetWorkflowRole
  source_integrity?: TalentMapGeneratedSectionSourceIntegrityMeta
}

export type TalentMapGeneratedSectionBaseBlock = {
  title: string
  points: string[]
}

export type TalentMapGeneratedSectionSourceLogicEntry = {
  source_element_key: string
  source_label: string
  mechanic_meaning: string
  hr_translation: string
  interpretation_limit: string
  reality_check: string
}

export type TalentMapGeneratedSection = {
  schema_version: typeof TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION
  section_key: SupportedGeneratedSectionKey
  section_title: string

  base: {
    headline: string
    hr_summary: string

    how_to_start_work: TalentMapGeneratedSectionBaseBlock
    best_task_format: TalentMapGeneratedSectionBaseBlock
    manager_instructions: TalentMapGeneratedSectionBaseBlock
    useful_in_roles: TalentMapGeneratedSectionBaseBlock
    risks_if_wrong_entry: TalentMapGeneratedSectionBaseBlock
    interview_or_trial_checks: TalentMapGeneratedSectionBaseBlock
    first_working_experiments: TalentMapGeneratedSectionBaseBlock
  }

  pro: {
    technical_summary: string
    source_logic: TalentMapGeneratedSectionSourceLogicEntry[]
    interpretation_limits: string[]
    reality_checks: string[]
  }

  source_chips: Array<{
    element_kind: string
    element_key: string
    element_label: string
    role_in_layer: string
    reason_used: string
    link_target: string
  }>

  summary_for_synthesis: {
    one_sentence: string
    key_conditions: string[]
    potential_risks: string[]
    source_element_keys: string[]
  }

  qa: {
    base_language_checked: boolean
    forbidden_terms_checked: boolean
    source_chips_checked: boolean
    limitations_present: boolean
  }

  generation_meta?: TalentMapGeneratedSectionGenerationMeta
}

/** @deprecated Use TalentMapGeneratedSection */
export type TalentMapGeneratedSectionV1_1 = TalentMapGeneratedSection

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function validateSourceChip(value: unknown, path: string, issues: string[]): boolean {
  if (!value || typeof value !== 'object') {
    issues.push(`${path}: expected object`)
    return false
  }

  const chip = value as Record<string, unknown>
  const fields = [
    'element_kind',
    'element_key',
    'element_label',
    'role_in_layer',
    'reason_used',
    'link_target',
  ] as const

  let ok = true
  for (const field of fields) {
    if (!isNonEmptyString(chip[field])) {
      issues.push(`${path}.${field}: expected non-empty string`)
      ok = false
    }
  }
  return ok
}

function validateSummaryForSynthesis(value: unknown, issues: string[]): void {
  if (!value || typeof value !== 'object') {
    issues.push('summary_for_synthesis must be an object.')
    return
  }

  const summary = value as Record<string, unknown>
  if (!isNonEmptyString(summary.one_sentence)) {
    issues.push('summary_for_synthesis.one_sentence must be a non-empty string.')
  }
  for (const field of ['key_conditions', 'potential_risks', 'source_element_keys'] as const) {
    if (!isStringArray(summary[field])) {
      issues.push(`summary_for_synthesis.${field} must be a string array.`)
    }
  }
}

function validateQaBlock(value: unknown, issues: string[]): void {
  if (!value || typeof value !== 'object') {
    issues.push('qa must be an object.')
    return
  }

  const qa = value as Record<string, unknown>
  for (const field of [
    'base_language_checked',
    'forbidden_terms_checked',
    'source_chips_checked',
    'limitations_present',
  ] as const) {
    if (typeof qa[field] !== 'boolean') {
      issues.push(`qa.${field} must be a boolean.`)
    }
  }
}

function validateBaseBlock(value: unknown, path: string, issues: string[]): void {
  if (!value || typeof value !== 'object') {
    issues.push(`${path} must be an object.`)
    return
  }

  const block = value as Record<string, unknown>
  if (!isNonEmptyString(block.title)) {
    issues.push(`${path}.title must be a non-empty string.`)
  }
  if (!isStringArray(block.points)) {
    issues.push(`${path}.points must be a string array.`)
  }
}

export function isTalentMapGeneratedSectionContent(
  content: unknown,
): content is TalentMapGeneratedSection {
  if (!content || typeof content !== 'object') {
    return false
  }

  return (
    (content as Record<string, unknown>).schema_version ===
    TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION
  )
}

export function validateTalentMapGeneratedSection(value: unknown): {
  ok: boolean
  data?: TalentMapGeneratedSection
  issues: string[]
} {
  const issues: string[] = []

  if (!value || typeof value !== 'object') {
    return { ok: false, issues: ['Root value must be an object.'] }
  }

  const record = value as Record<string, unknown>

  if (record.schema_version !== TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION) {
    issues.push(`schema_version must be "${TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION}".`)
  }

  if (!isSupportedGeneratedSectionKey(record.section_key)) {
    issues.push(`section_key must be one of: ${SUPPORTED_GENERATED_SECTION_KEYS.join(', ')}.`)
  } else if (record.section_title !== getSupportedGeneratedSectionTitle(record.section_key)) {
    issues.push(
      `section_title must be "${getSupportedGeneratedSectionTitle(record.section_key)}".`,
    )
  }

  if (!record.base || typeof record.base !== 'object') {
    issues.push('base must be an object.')
  } else {
    const base = record.base as Record<string, unknown>
    if (!isNonEmptyString(base.headline)) {
      issues.push('base.headline must be a non-empty string.')
    }
    if (!isNonEmptyString(base.hr_summary)) {
      issues.push('base.hr_summary must be a non-empty string.')
    }

    for (const field of [
      'how_to_start_work',
      'best_task_format',
      'manager_instructions',
      'useful_in_roles',
      'risks_if_wrong_entry',
      'interview_or_trial_checks',
      'first_working_experiments',
    ] as const) {
      validateBaseBlock(base[field], `base.${field}`, issues)
    }
  }

  if (!record.pro || typeof record.pro !== 'object') {
    issues.push('pro must be an object.')
  } else {
    const pro = record.pro as Record<string, unknown>
    if (!isNonEmptyString(pro.technical_summary)) {
      issues.push('pro.technical_summary must be a non-empty string.')
    }

    if (!Array.isArray(pro.source_logic)) {
      issues.push('pro.source_logic must be an array.')
    } else {
      pro.source_logic.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          issues.push(`pro.source_logic[${index}] must be an object.`)
          return
        }

        const entry = item as Record<string, unknown>
        for (const field of [
          'source_element_key',
          'source_label',
          'mechanic_meaning',
          'hr_translation',
          'interpretation_limit',
          'reality_check',
        ] as const) {
          if (!isNonEmptyString(entry[field])) {
            issues.push(`pro.source_logic[${index}].${field} must be a non-empty string.`)
          }
        }
      })
    }

    for (const field of ['interpretation_limits', 'reality_checks'] as const) {
      if (!isStringArray(pro[field])) {
        issues.push(`pro.${field} must be a string array.`)
      }
    }
  }

  if (!Array.isArray(record.source_chips)) {
    issues.push('source_chips must be an array.')
  } else {
    record.source_chips.forEach((chip, index) => {
      validateSourceChip(chip, `source_chips[${index}]`, issues)
    })
  }

  validateSummaryForSynthesis(record.summary_for_synthesis, issues)
  validateQaBlock(record.qa, issues)

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, data: record as TalentMapGeneratedSection, issues: [] }
}

/** @deprecated Use validateTalentMapGeneratedSection */
export const validateTalentMapGeneratedSectionV1_1 = validateTalentMapGeneratedSection

export function cleanGeneratedText(value: string): string {
  return value
    .replace(/\t+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function cleanGeneratedSectionBaseBlock(
  block: TalentMapGeneratedSectionBaseBlock,
): TalentMapGeneratedSectionBaseBlock {
  return {
    title: cleanGeneratedText(block.title),
    points: block.points.map(cleanGeneratedText),
  }
}

function cleanGeneratedSectionSourceLogicEntry(
  entry: TalentMapGeneratedSectionSourceLogicEntry,
): TalentMapGeneratedSectionSourceLogicEntry {
  return {
    source_element_key: cleanGeneratedText(entry.source_element_key),
    source_label: cleanGeneratedText(entry.source_label),
    mechanic_meaning: cleanGeneratedText(entry.mechanic_meaning),
    hr_translation: cleanGeneratedText(entry.hr_translation),
    interpretation_limit: cleanGeneratedText(entry.interpretation_limit),
    reality_check: cleanGeneratedText(entry.reality_check),
  }
}

export function cleanGeneratedSectionText(section: TalentMapGeneratedSection): TalentMapGeneratedSection {
  return {
    ...section,
    base: {
      headline: cleanGeneratedText(section.base.headline),
      hr_summary: cleanGeneratedText(section.base.hr_summary),
      how_to_start_work: cleanGeneratedSectionBaseBlock(section.base.how_to_start_work),
      best_task_format: cleanGeneratedSectionBaseBlock(section.base.best_task_format),
      manager_instructions: cleanGeneratedSectionBaseBlock(section.base.manager_instructions),
      useful_in_roles: cleanGeneratedSectionBaseBlock(section.base.useful_in_roles),
      risks_if_wrong_entry: cleanGeneratedSectionBaseBlock(section.base.risks_if_wrong_entry),
      interview_or_trial_checks: cleanGeneratedSectionBaseBlock(section.base.interview_or_trial_checks),
      first_working_experiments: cleanGeneratedSectionBaseBlock(section.base.first_working_experiments),
    },
    pro: {
      technical_summary: cleanGeneratedText(section.pro.technical_summary),
      source_logic: section.pro.source_logic.map(cleanGeneratedSectionSourceLogicEntry),
      interpretation_limits: section.pro.interpretation_limits.map(cleanGeneratedText),
      reality_checks: section.pro.reality_checks.map(cleanGeneratedText),
    },
    source_chips: section.source_chips.map((chip) => ({
      ...chip,
      element_kind: cleanGeneratedText(chip.element_kind),
      element_key: cleanGeneratedText(chip.element_key),
      element_label: cleanGeneratedText(chip.element_label),
      role_in_layer: cleanGeneratedText(chip.role_in_layer),
      reason_used: cleanGeneratedText(chip.reason_used),
      link_target: cleanGeneratedText(chip.link_target),
    })),
    summary_for_synthesis: {
      one_sentence: cleanGeneratedText(section.summary_for_synthesis.one_sentence),
      key_conditions: section.summary_for_synthesis.key_conditions.map(cleanGeneratedText),
      potential_risks: section.summary_for_synthesis.potential_risks.map(cleanGeneratedText),
      source_element_keys: section.summary_for_synthesis.source_element_keys.map(cleanGeneratedText),
    },
  }
}

function renderMarkdownList(title: string, items: string[]): string {
  if (items.length === 0) {
    return `## ${title}\n\n—`
  }
  return `## ${title}\n\n${items.map((item) => `- ${item}`).join('\n')}`
}

function renderBaseBlock(block: TalentMapGeneratedSectionBaseBlock): string {
  return renderMarkdownList(block.title, block.points)
}

export const MIN_STANDARD_SNAPSHOT_CHARS = 450
export const MAX_STANDARD_SNAPSHOT_CHARS = 1100

function normalizeSnapshotText(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.replace(/\s+/g, ' ').trim()
}

function firstBaseBlockPoint(block: TalentMapGeneratedSectionBaseBlock): string {
  return block.points[0] ?? ''
}

function dedupeSnapshotParts(parts: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const part of parts) {
    const normalized = normalizeSnapshotText(part)
    if (!normalized) {
      continue
    }

    const key = normalized.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(normalized)
  }

  return result
}

function collectStandardSnapshotFallbackParts(section: TalentMapGeneratedSection): string[] {
  const { base, summary_for_synthesis } = section

  return [
    base.hr_summary,
    summary_for_synthesis.one_sentence,
    ...summary_for_synthesis.key_conditions.slice(0, 2),
    firstBaseBlockPoint(base.how_to_start_work),
    firstBaseBlockPoint(base.best_task_format),
    firstBaseBlockPoint(base.manager_instructions),
    firstBaseBlockPoint(base.risks_if_wrong_entry),
  ]
}

function trimSnapshotParagraph(paragraph: string): string {
  if (paragraph.length <= MAX_STANDARD_SNAPSHOT_CHARS) {
    return paragraph
  }

  let trimmed = paragraph.slice(0, MAX_STANDARD_SNAPSHOT_CHARS)
  const lastSentenceEnd = Math.max(trimmed.lastIndexOf('.'), trimmed.lastIndexOf('!'), trimmed.lastIndexOf('?'))

  if (lastSentenceEnd >= MIN_STANDARD_SNAPSHOT_CHARS) {
    trimmed = trimmed.slice(0, lastSentenceEnd + 1)
  }

  return trimmed.trim()
}

/** Resolves the visible standard snapshot paragraph, with fallback enrichment if too short. */
export function resolveStandardSnapshotParagraph(section: TalentMapGeneratedSection): string {
  const hrSummary = normalizeSnapshotText(section.base.hr_summary)

  if (hrSummary.length >= MIN_STANDARD_SNAPSHOT_CHARS) {
    return trimSnapshotParagraph(hrSummary)
  }

  const enriched = dedupeSnapshotParts(collectStandardSnapshotFallbackParts(section)).join(' ')
  return trimSnapshotParagraph(enriched || hrSummary)
}

/** Visible standard output: one neutral layer snapshot (headline + substantial paragraph). */
export function renderGeneratedSectionStandardSnapshotMarkdown(
  section: TalentMapGeneratedSection,
): string {
  const paragraph = resolveStandardSnapshotParagraph(section)
  return [`# ${section.base.headline}`, '', paragraph].join('\n')
}

export function renderGeneratedSectionBaseMarkdown(section: TalentMapGeneratedSection): string {
  const { base } = section
  return [
    `# ${base.headline}`,
    '',
    base.hr_summary,
    '',
    renderBaseBlock(base.how_to_start_work),
    '',
    renderBaseBlock(base.best_task_format),
    '',
    renderBaseBlock(base.manager_instructions),
    '',
    renderBaseBlock(base.useful_in_roles),
    '',
    renderBaseBlock(base.risks_if_wrong_entry),
    '',
    renderBaseBlock(base.interview_or_trial_checks),
    '',
    renderBaseBlock(base.first_working_experiments),
  ].join('\n')
}

export function renderGeneratedSectionProMarkdown(section: TalentMapGeneratedSection): string {
  const { pro } = section
  const sourceLogicLines =
    pro.source_logic.length > 0
      ? pro.source_logic
          .map(
            (entry) =>
              `- **${entry.source_label}** (${entry.source_element_key}): ${entry.mechanic_meaning} → ${entry.hr_translation}. Ограничение: ${entry.interpretation_limit}. Проверка: ${entry.reality_check}.`,
          )
          .join('\n')
      : '—'

  return [
    '## Техническое резюме',
    '',
    pro.technical_summary,
    '',
    '## Логика источников',
    '',
    sourceLogicLines,
    '',
    renderMarkdownList('Ограничения интерпретации', pro.interpretation_limits),
    '',
    renderMarkdownList('Что проверить в реальности', pro.reality_checks),
  ].join('\n')
}

export { isSupportedGeneratedSectionKey as isSupportedGenerationSectionKey } from './talentMapGeneratedSections'
