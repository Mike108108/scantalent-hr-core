import type { SourceChip } from './talentMapSynthesisContract'
import {
  validateTalentMapGeneratedSectionV1,
  type TalentMapGeneratedSectionV1,
} from './talentMapGeneratedSectionContract'

export type GeneratedSectionQaResult = {
  ok: boolean
  issues: string[]
  data?: TalentMapGeneratedSectionV1
}

export const GENERATED_BASE_FORBIDDEN_TERMS = [
  'human design',
  'дизайн человека',
  'бодиграф',
  'проектор',
  'манифестор',
  'генератор',
  'рефлектор',
  'ворота',
  'канал',
  'центр',
  'авторитет',
  'стратегия',
  'профиль',
  'активация',
  'селезёнка',
  'селезенка',
  'сакрал',
  'горло',
  'аджна',
  'корень',
  'g-центр',
  'эго-центр',
] as const

const FORBIDDEN_PRODUCT_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
  { pattern: /\bfit_score\b/i, label: 'fit_score' },
  { pattern: /\bfit[\s_-]?percent(?:age)?\b/i, label: 'fit_percent' },
  { pattern: /\bmatch_score\b/i, label: 'match_score' },
  { pattern: /\bmatch[\s_-]?percent(?:age)?\b/i, label: 'match_percentage' },
  { pattern: /\brole_fit\b/i, label: 'role_fit' },
  { pattern: /\bvacancy_fit\b/i, label: 'vacancy_fit' },
  { pattern: /(?:подходит|соответствует)\s+на\s+\d+\s*%/i, label: 'percentage_match' },
  { pattern: /\b(?:не\s+)?брать\s+кандидата\b/i, label: 'hire_decision' },
  { pattern: /\b(?:не\s+)?брать\s+на\s+работу\b/i, label: 'hire_decision' },
  { pattern: /\b(?:не\s+)?нанять\b/i, label: 'hire_decision' },
  { pattern: /\b(?:не\s+)?нанимать\b/i, label: 'hire_decision' },
  { pattern: /\bрекомендуем\s+нанять\b/i, label: 'hire_recommendation' },
  { pattern: /\bне\s+рекомендуем\s+нанимать\b/i, label: 'hire_recommendation' },
]

function sourceChipKey(chip: { element_kind: string; element_key: string }): string {
  return `${chip.element_kind}:${chip.element_key}`
}

function collectBaseText(section: TalentMapGeneratedSectionV1): string {
  const { base } = section
  return [
    base.headline,
    base.short_summary,
    base.working_pattern,
    base.manager_note,
    ...base.best_entry_conditions,
    ...base.suitable_task_format,
    ...base.what_to_avoid,
  ].join('\n')
}

function collectAllText(section: TalentMapGeneratedSectionV1): string {
  const { pro, summary_for_synthesis } = section
  return [
    collectBaseText(section),
    pro.technical_summary,
    ...pro.source_logic,
    ...pro.interpretation_limits,
    ...pro.reality_checks,
    summary_for_synthesis.one_sentence,
    ...summary_for_synthesis.key_conditions,
    ...summary_for_synthesis.potential_risks,
  ].join('\n')
}

function findForbiddenBaseTerms(text: string): string[] {
  const lower = text.toLowerCase()
  return GENERATED_BASE_FORBIDDEN_TERMS.filter((term) => lower.includes(term))
}

function findForbiddenProductHits(text: string): string[] {
  const hits: string[] = []
  for (const { pattern, label } of FORBIDDEN_PRODUCT_PATTERNS) {
    if (pattern.test(text)) {
      hits.push(label)
    }
  }
  return hits
}

function isProEmpty(section: TalentMapGeneratedSectionV1): boolean {
  const { pro } = section
  return (
    !pro.technical_summary.trim() &&
    pro.source_logic.every((item) => !item.trim()) &&
    pro.interpretation_limits.every((item) => !item.trim()) &&
    pro.reality_checks.every((item) => !item.trim())
  )
}

function isBaseEmpty(section: TalentMapGeneratedSectionV1): boolean {
  const { base } = section
  return (
    !base.headline.trim() &&
    !base.short_summary.trim() &&
    !base.working_pattern.trim() &&
    !base.manager_note.trim()
  )
}

export function runTalentMapGeneratedSectionQa(params: {
  generated: unknown
  inputSourceChips: SourceChip[]
}): GeneratedSectionQaResult {
  const issues: string[] = []

  const validation = validateTalentMapGeneratedSectionV1(params.generated)
  if (!validation.ok || !validation.data) {
    return {
      ok: false,
      issues: validation.issues.length > 0 ? validation.issues : ['Generated section JSON is invalid.'],
    }
  }

  const section = validation.data

  if (section.section_key !== 'work_mode_and_entry') {
    issues.push('section_key must be work_mode_and_entry.')
  }

  if (isBaseEmpty(section)) {
    issues.push('Base section content is empty.')
  }

  if (isProEmpty(section)) {
    issues.push('Pro section content is empty.')
  }

  const baseForbiddenTerms = findForbiddenBaseTerms(collectBaseText(section))
  if (baseForbiddenTerms.length > 0) {
    issues.push(`Base contains forbidden HD terms: ${baseForbiddenTerms.join(', ')}.`)
  }

  const productHits = findForbiddenProductHits(collectAllText(section))
  if (productHits.length > 0) {
    issues.push(`Output contains forbidden product logic: ${[...new Set(productHits)].join(', ')}.`)
  }

  const inputChipKeys = new Set(params.inputSourceChips.map(sourceChipKey))
  const unknownChips = section.source_chips.filter(
    (chip) => !inputChipKeys.has(sourceChipKey(chip)),
  )
  if (unknownChips.length > 0) {
    issues.push(
      `source_chips contain elements not present in input: ${unknownChips
        .map((chip) => sourceChipKey(chip))
        .join(', ')}.`,
    )
  }

  if (section.pro.interpretation_limits.length === 0) {
    issues.push('pro.interpretation_limits is required.')
  }

  if (section.pro.reality_checks.length === 0) {
    issues.push('pro.reality_checks is required.')
  }

  const allowedSourceKeys = new Set(
    params.inputSourceChips.map((chip) => `${chip.element_kind}:${chip.element_key}`),
  )
  const invalidSummaryKeys = section.summary_for_synthesis.source_element_keys.filter(
    (key) => !allowedSourceKeys.has(key) && !params.inputSourceChips.some((chip) => chip.element_key === key),
  )
  if (invalidSummaryKeys.length > 0) {
    issues.push(
      `summary_for_synthesis.source_element_keys contains unknown elements: ${invalidSummaryKeys.join(', ')}.`,
    )
  }

  if (issues.length > 0) {
    return { ok: false, issues, data: section }
  }

  return { ok: true, issues: [], data: section }
}
