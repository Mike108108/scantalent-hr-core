import type { SourceChip } from './talentMapSynthesisContract'
import { sourceChipFullKey } from './talentMapGeneratedSectionSourceIntegrity'
import {
  MIN_STANDARD_SNAPSHOT_CHARS,
  renderGeneratedSectionBaseMarkdown,
  renderGeneratedSectionStandardSnapshotMarkdown,
  validateTalentMapGeneratedSection,
  type TalentMapGeneratedSection,
} from './talentMapGeneratedSectionContract'
import type { TalentMapGenerationMode } from './talentMapStandardSnapshotContract'

export type GeneratedSectionQaResult = {
  /** False only when schema/JSON validation fails (technical blocker). */
  ok: boolean
  /** Blocking schema/validation issues — cause status = error. */
  issues: string[]
  /** Non-blocking content quality warnings — stored in quality_flags. */
  warnings: string[]
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

function isSourceKeyAllowed(key: string, allowedSourceKeys: Set<string>): boolean {
  return allowedSourceKeys.has(key)
}

function collectBaseScanText(section: TalentMapGeneratedSection): string {
  return [JSON.stringify(section.base), renderGeneratedSectionBaseMarkdown(section)].join('\n')
}

function collectBaseClientText(section: TalentMapGeneratedSection): string {
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

  return [
    base.headline,
    base.hr_summary,
    ...blocks.flatMap((block) => [block.title, ...block.points]),
  ].join('\n')
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase())
}

const BASE_FORBIDDEN_WORD_PATTERNS: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: 'projector', pattern: /\bprojector\b/i },
  { label: 'проектор', pattern: /(^|[^а-яёa-z])проектор(а|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'manifestor', pattern: /\bmanifestor\b/i },
  { label: 'манифестор', pattern: /(^|[^а-яёa-z])манифестор(а|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'generator', pattern: /\bgenerator\b/i },
  { label: 'генератор', pattern: /(^|[^а-яёa-z])генератор(а|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'reflector', pattern: /\breflector\b/i },
  { label: 'рефлектор', pattern: /(^|[^а-яёa-z])рефлектор(а|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'splenic', pattern: /\bsplenic\b/i },
  { label: 'spleen', pattern: /\bspleen\b/i },
  { label: 'селезёночный', pattern: /(^|[^а-яёa-z])селез[её]ночн(ый|ая|ое|ые|ого|ой|ому|ым|ыми|ом|ах|ами)?([^а-яёa-z]|$)/iu },
  { label: 'селезеночный', pattern: /(^|[^а-яёa-z])селезеночн(ый|ая|ое|ые|ого|ой|ому|ым|ыми|ом|ах|ами)?([^а-яёa-z]|$)/iu },
  { label: 'селезёнка', pattern: /(^|[^а-яёa-z])селез[её]нк(а|е|и|у|ой|ою|ами|ах)?([^а-яёa-z]|$)/iu },
  { label: 'селезенка', pattern: /(^|[^а-яёa-z])селезенк(а|е|и|у|ой|ою|ами|ах)?([^а-яёa-z]|$)/iu },
  { label: 'sacral', pattern: /\bsacral\b/i },
  { label: 'сакрал', pattern: /(^|[^а-яёa-z])сакрал(а|е|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'authority', pattern: /\bauthority\b/i },
  { label: 'авторитет', pattern: /(^|[^а-яёa-z])авторитет(а|е|у|ом|ы)?([^а-яёa-z]|$)/iu },
  { label: 'strategy', pattern: /\bstrategy\b/i },
  { label: 'стратегия', pattern: /(^|[^а-яёa-z])стратег(ия|ии|ию|ией|ий)?([^а-яёa-z]|$)/iu },
  { label: 'profile', pattern: /\bprofile\b/i },
  { label: 'профиль', pattern: /(^|[^а-яёa-z])профил(ь|я|е|ю|ем|и|ей)?([^а-яёa-z]|$)/iu },
  { label: 'gate', pattern: /\bgate\b/i },
  { label: 'ворота', pattern: /(^|[^а-яёa-z])ворот(а|ами)?([^а-яёa-z]|$)/iu },
  { label: 'channel', pattern: /\bchannel\b/i },
  { label: 'канал', pattern: /(^|[^а-яёa-z])канал(а|е|у|ом|ов|ами)?([^а-яёa-z]|$)/iu },
  { label: 'center', pattern: /\b(g[\s-]?center|center)\b/i },
  { label: 'центр', pattern: /(^|[^а-яёa-z])центр(ы|а|е|ом|у)?([^а-яёa-z]|$)/iu },
  { label: 'ajna', pattern: /\bajna\b/i },
  { label: 'аджна', pattern: /(^|[^а-яёa-z])аджн(а|е|у|ой|ы)?([^а-яёa-z]|$)/iu },
  { label: 'throat', pattern: /\bthroat\b/i },
  { label: 'горло', pattern: /(^|[^а-яёa-z])горл(о|а|е|у|ом)?([^а-яёa-z]|$)/iu },
  { label: 'root', pattern: /\broot\b/i },
  { label: 'корень', pattern: /(^|[^а-яёa-z])корн(я|е|ю|ем|и|ей)?([^а-яёa-z]|$)/iu },
  { label: 'ego', pattern: /\bego\b/i },
  { label: 'эго', pattern: /(^|[^а-яёa-z])эго([^а-яёa-z]|$)/iu },
  { label: 'definition', pattern: /\bdefinition\b/i },
  { label: 'curiosity', pattern: /\bcuriosity\b/i },
  { label: 'activation', pattern: /\bactivation\b/i },
  { label: 'активация', pattern: /(^|[^а-яёa-z])активац(ия|ии|ию|ией|ий)?([^а-яёa-z]|$)/iu },
]

const BASE_FORBIDDEN_PHRASES = [
  'human design',
  'дизайн человека',
  'бодиграф',
  'wait for the invitation',
  'split definition',
  'g center',
  'g-центр',
  'personality sun',
  'design sun',
  'personality earth',
  'design earth',
] as const

/** Non-blocking: semi-technical HR calques that prompts should avoid in Base/client text. */
const BASE_SEMI_TECHNICAL_HR_TERMS: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: 'отклик', pattern: /(^|[^а-яёa-z])отклик(а|у|ом|и|ов|ами|ах|е)?([^а-яёa-z]|$)/iu },
  { label: 'приглашение', pattern: /(^|[^а-яёa-z])приглашен(ие|ия|ию|ием|ии|ий)?([^а-яёa-z]|$)/iu },
  { label: 'интуитивный', pattern: /(^|[^а-яёa-z])интуитивн(ый|ая|ое|ые|ого|ой|ому|ым|ыми|о|а|ы)?([^а-яёa-z]|$)/iu },
  { label: 'внутренний авторитет', pattern: /внутренн(ий|его|ем|им)\s+авторитет/iu },
  { label: 'энергетический', pattern: /(^|[^а-яёa-z])энергетическ(ий|ая|ое|ие|ого|ой|ому|им|ими|ом|их|ими)?([^а-яёa-z]|$)/iu },
  { label: 'аура', pattern: /(^|[^а-яёa-z])аур(а|ы|е|у|ой|ою|ами|ах)?([^а-яёa-z]|$)/iu },
  { label: 'определение', pattern: /(^|[^а-яёa-z])определени(е|я|ю|ем|и|ями|ях)?([^а-яёa-z]|$)/iu },
]

function findSemiTechnicalHrTerms(text: string): string[] {
  const hits = new Set<string>()

  for (const { label, pattern } of BASE_SEMI_TECHNICAL_HR_TERMS) {
    if (pattern.test(text)) {
      hits.add(label)
    }
  }

  return [...hits]
}

function findBaseForbiddenHdTerms(text: string, extraTerms: readonly string[]): string[] {
  const hits = new Set<string>()

  for (const phrase of BASE_FORBIDDEN_PHRASES) {
    if (containsPhrase(text, phrase)) {
      hits.add(phrase)
    }
  }

  for (const { label, pattern } of BASE_FORBIDDEN_WORD_PATTERNS) {
    if (pattern.test(text)) {
      hits.add(label)
    }
  }

  for (const term of extraTerms) {
    if (BASE_FORBIDDEN_PHRASES.some((phrase) => phrase === term)) {
      continue
    }
    if (BASE_FORBIDDEN_WORD_PATTERNS.some(({ label }) => label === term)) {
      continue
    }
    if (containsPhrase(text, term)) {
      hits.add(term)
    }
  }

  return [...hits]
}

function findGarbageTerms(text: string, terms: readonly string[]): string[] {
  const hits = new Set<string>()

  for (const term of terms) {
    if (containsPhrase(text, term)) {
      hits.add(term)
    }
  }

  return [...hits]
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

function qaWarning(category: string, detail: string): string {
  return `warning: ${category}: ${detail}`
}

function collectStandardSnapshotVisibleText(section: TalentMapGeneratedSection): string {
  return renderGeneratedSectionStandardSnapshotMarkdown(section)
}

function collectContentQaWarnings(
  section: TalentMapGeneratedSection,
  inputSourceChips: SourceChip[],
  mode: TalentMapGenerationMode,
): string[] {
  const warnings: string[] = []
  const isStandardSnapshot = mode === 'standard_snapshot'

  if (!isStandardSnapshot && isBaseEmpty(section)) {
    warnings.push(qaWarning('text_quality.empty_base', 'Base section content is empty.'))
  }

  if (!isStandardSnapshot && isProEmpty(section)) {
    warnings.push(qaWarning('text_quality.empty_pro', 'Pro section content is empty.'))
  }

  const baseScanText = isStandardSnapshot
    ? collectStandardSnapshotVisibleText(section)
    : collectBaseScanText(section)
  const baseClientText = isStandardSnapshot
    ? collectStandardSnapshotVisibleText(section)
    : collectBaseClientText(section)
  const baseForbiddenTerms = findBaseForbiddenHdTerms(baseScanText, GENERATED_BASE_FORBIDDEN_TERMS)
  for (const term of baseForbiddenTerms) {
    warnings.push(qaWarning('base.technical_language', term))
  }

  const semiTechnicalTerms = findSemiTechnicalHrTerms(baseClientText)
  for (const term of semiTechnicalTerms) {
    warnings.push(qaWarning('base.semi_technical_hr_language', term))
  }

  const garbageTerms = findGarbageTerms(baseClientText, GENERATED_GARBAGE_TERMS)
  for (const term of garbageTerms) {
    warnings.push(qaWarning('text_quality.garbage_term', term))
  }

  const productHits = findForbiddenProductHits(baseClientText)
  for (const hit of [...new Set(productHits)]) {
    if (hit.includes('hire') || hit === 'hire_decision' || hit === 'hire_recommendation') {
      warnings.push(qaWarning('forbidden_hiring_phrase', hit))
    } else {
      warnings.push(qaWarning('forbidden_score_language', hit))
    }
  }

  const allowedSourceKeys = new Set(inputSourceChips.map(sourceChipFullKey))

  const unknownChips = section.source_chips.filter(
    (chip) => !allowedSourceKeys.has(sourceChipFullKey(chip)),
  )
  if (unknownChips.length > 0) {
    warnings.push(
      qaWarning(
        'base.source_chips',
        `source_chips contain elements not present in input: ${unknownChips
          .map((chip) => sourceChipFullKey(chip))
          .join(', ')}`,
      ),
    )
  }

  if (!isStandardSnapshot && section.pro.interpretation_limits.length === 0) {
    warnings.push(qaWarning('pro.interpretation_limits', 'interpretation_limits is empty.'))
  }

  if (!isStandardSnapshot && section.pro.reality_checks.length === 0) {
    warnings.push(qaWarning('pro.reality_checks', 'reality_checks is empty.'))
  }

  if (!isStandardSnapshot) {
    const invalidSourceLogicKeys = section.pro.source_logic.filter(
      (entry) => !isSourceKeyAllowed(entry.source_element_key, allowedSourceKeys),
    )
    if (invalidSourceLogicKeys.length > 0) {
      warnings.push(
        qaWarning(
          'pro.source_logic',
          `unknown source_element_key values: ${invalidSourceLogicKeys
            .map((entry) => entry.source_element_key)
            .join(', ')}`,
        ),
      )
    }
  }

  const invalidSummaryKeys = section.summary_for_synthesis.source_element_keys.filter(
    (key) => !isSourceKeyAllowed(key, allowedSourceKeys),
  )
  if (invalidSummaryKeys.length > 0) {
    warnings.push(
      qaWarning(
        'summary_for_synthesis.source_element_keys',
        `unknown elements: ${invalidSummaryKeys.join(', ')}`,
      ),
    )
  }

  if (isStandardSnapshot) {
    if (!section.base.headline.trim()) {
      warnings.push(qaWarning('standard_snapshot.empty_headline', 'headline is empty.'))
    }

    const paragraph = section.base.hr_summary.trim()
    if (!paragraph) {
      warnings.push(qaWarning('standard_snapshot.empty_paragraph', 'snapshot paragraph is empty.'))
    } else if (paragraph.length < MIN_STANDARD_SNAPSHOT_CHARS) {
      warnings.push(
        qaWarning(
          'standard_snapshot.too_short',
          `snapshot paragraph is shorter than ${MIN_STANDARD_SNAPSHOT_CHARS} chars.`,
        ),
      )
    }
  }

  if (/\t+/.test(baseClientText) || /[ ]{2,}/.test(baseClientText) || /\n{3,}/.test(baseClientText)) {
    warnings.push(qaWarning('text_quality.excessive_whitespace', 'excessive whitespace detected'))
  }

  return warnings
}

export function runTalentMapGeneratedSectionQa(params: {
  generated: unknown
  inputSourceChips: SourceChip[]
  mode?: TalentMapGenerationMode
}): GeneratedSectionQaResult {
  const mode = params.mode ?? 'full_section'
  const validation = validateTalentMapGeneratedSection(params.generated)
  if (!validation.ok || !validation.data) {
    return {
      ok: false,
      issues: validation.issues.length > 0 ? validation.issues : ['Generated section JSON is invalid.'],
      warnings: [],
    }
  }

  const warnings = collectContentQaWarnings(validation.data, params.inputSourceChips, mode)

  return { ok: true, issues: [], warnings, data: validation.data }
}
