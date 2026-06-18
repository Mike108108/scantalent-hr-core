import type { SourceChip } from './talentMapSynthesisContract'
import {
  renderGeneratedSectionBaseMarkdown,
  validateTalentMapGeneratedSection,
  type TalentMapGeneratedSection,
} from './talentMapGeneratedSectionContract'

export type GeneratedSectionQaResult = {
  ok: boolean
  issues: string[]
  data?: TalentMapGeneratedSection
}

export const GENERATED_BASE_FORBIDDEN_TERMS = [
  'human design',
  'дизайн человека',
  'бодиграф',
  'projector',
  'проектор',
  'manifestor',
  'манифестор',
  'generator',
  'генератор',
  'reflector',
  'рефлектор',
  'splenic',
  'spleen',
  'селезёночный',
  'селезеночный',
  'селезёнка',
  'селезенка',
  'sacral',
  'сакрал',
  'authority',
  'авторитет',
  'strategy',
  'стратегия',
  'profile',
  'профиль',
  'gate',
  'ворота',
  'channel',
  'канал',
  'center',
  'центр',
  'ajna',
  'аджна',
  'throat',
  'горло',
  'root',
  'корень',
  'g center',
  'g-центр',
  'ego',
  'эго',
  'split definition',
  'definition',
  'wait for the invitation',
  'curiosity',
  'activation',
  'активация',
  'personality sun',
  'design sun',
  'personality earth',
  'design earth',
] as const

export const GENERATED_GARBAGE_TERMS = ['пауки'] as const

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

function isSourceKeyAllowed(
  key: string,
  allowedSourceKeys: Set<string>,
  inputSourceChips: SourceChip[],
): boolean {
  if (allowedSourceKeys.has(key)) {
    return true
  }

  return inputSourceChips.some((chip) => chip.element_key === key)
}

function collectBaseScanText(section: TalentMapGeneratedSection): string {
  return [JSON.stringify(section.base), renderGeneratedSectionBaseMarkdown(section)].join('\n')
}

function collectAllText(section: TalentMapGeneratedSection): string {
  const { pro, summary_for_synthesis } = section
  return [
    collectBaseScanText(section),
    pro.technical_summary,
    ...pro.source_logic.flatMap((entry) => [
      entry.source_element_key,
      entry.source_label,
      entry.mechanic_meaning,
      entry.hr_translation,
      entry.interpretation_limit,
      entry.reality_check,
    ]),
    ...pro.interpretation_limits,
    ...pro.reality_checks,
    summary_for_synthesis.one_sentence,
    ...summary_for_synthesis.key_conditions,
    ...summary_for_synthesis.potential_risks,
  ].join('\n')
}

function findForbiddenTerms(text: string, terms: readonly string[]): string[] {
  const lower = text.toLowerCase()
  return terms.filter((term) => lower.includes(term.toLowerCase()))
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

function isProEmpty(section: TalentMapGeneratedSection): boolean {
  const { pro } = section
  return (
    !pro.technical_summary.trim() &&
    pro.source_logic.length === 0 &&
    pro.interpretation_limits.every((item) => !item.trim()) &&
    pro.reality_checks.every((item) => !item.trim())
  )
}

function isBaseEmpty(section: TalentMapGeneratedSection): boolean {
  const { base } = section
  const blocks = [
    base.how_to_start_work,
    base.best_task_format,
    base.manager_instructions,
    base.useful_in_roles,
    base.risks_if_wrong_entry,
    base.interview_or_trial_checks,
    base.first_working_experiments,
  ]

  return (
    !base.headline.trim() &&
    !base.hr_summary.trim() &&
    blocks.every((block) => !block.title.trim() && block.points.every((point) => !point.trim()))
  )
}

export function runTalentMapGeneratedSectionQa(params: {
  generated: unknown
  inputSourceChips: SourceChip[]
}): GeneratedSectionQaResult {
  const issues: string[] = []

  const validation = validateTalentMapGeneratedSection(params.generated)
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

  const baseScanText = collectBaseScanText(section)
  const baseForbiddenTerms = findForbiddenTerms(baseScanText, GENERATED_BASE_FORBIDDEN_TERMS)
  if (baseForbiddenTerms.length > 0) {
    for (const term of baseForbiddenTerms) {
      issues.push(`base.forbidden_term: ${term}`)
    }
  }

  const allText = collectAllText(section)
  const garbageTerms = findForbiddenTerms(allText, GENERATED_GARBAGE_TERMS)
  if (garbageTerms.length > 0) {
    for (const term of garbageTerms) {
      issues.push(`garbage_term: ${term}`)
    }
  }

  const productHits = findForbiddenProductHits(allText)
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

  const invalidSourceLogicKeys = section.pro.source_logic.filter(
    (entry) => !isSourceKeyAllowed(entry.source_element_key, allowedSourceKeys, params.inputSourceChips),
  )
  if (invalidSourceLogicKeys.length > 0) {
    issues.push(
      `pro.source_logic contains unknown source_element_key values: ${invalidSourceLogicKeys
        .map((entry) => entry.source_element_key)
        .join(', ')}.`,
    )
  }

  const invalidSummaryKeys = section.summary_for_synthesis.source_element_keys.filter(
    (key) => !isSourceKeyAllowed(key, allowedSourceKeys, params.inputSourceChips),
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
