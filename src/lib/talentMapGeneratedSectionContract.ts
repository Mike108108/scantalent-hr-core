import type { TalentMapSectionKey } from './talentMapSections'

export const TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION = 'talent_map_section_v1' as const

export type TalentMapGeneratedSectionV1 = {
  schema_version: typeof TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION
  section_key: 'work_mode_and_entry'
  section_title: 'Рабочий формат и вход в задачи'

  base: {
    headline: string
    short_summary: string
    working_pattern: string
    best_entry_conditions: string[]
    suitable_task_format: string[]
    what_to_avoid: string[]
    manager_note: string
  }

  pro: {
    technical_summary: string
    source_logic: string[]
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
}

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

export function validateTalentMapGeneratedSectionV1(value: unknown): {
  ok: boolean
  data?: TalentMapGeneratedSectionV1
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

  if (record.section_key !== 'work_mode_and_entry') {
    issues.push('section_key must be "work_mode_and_entry".')
  }

  if (record.section_title !== 'Рабочий формат и вход в задачи') {
    issues.push('section_title must be "Рабочий формат и вход в задачи".')
  }

  if (!record.base || typeof record.base !== 'object') {
    issues.push('base must be an object.')
  } else {
    const base = record.base as Record<string, unknown>
    const baseFields = [
      'headline',
      'short_summary',
      'working_pattern',
      'manager_note',
    ] as const
    for (const field of baseFields) {
      if (!isNonEmptyString(base[field])) {
        issues.push(`base.${field} must be a non-empty string.`)
      }
    }
    for (const field of [
      'best_entry_conditions',
      'suitable_task_format',
      'what_to_avoid',
    ] as const) {
      if (!isStringArray(base[field])) {
        issues.push(`base.${field} must be a string array.`)
      }
    }
  }

  if (!record.pro || typeof record.pro !== 'object') {
    issues.push('pro must be an object.')
  } else {
    const pro = record.pro as Record<string, unknown>
    if (!isNonEmptyString(pro.technical_summary)) {
      issues.push('pro.technical_summary must be a non-empty string.')
    }
    for (const field of ['source_logic', 'interpretation_limits', 'reality_checks'] as const) {
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

  if (!record.summary_for_synthesis || typeof record.summary_for_synthesis !== 'object') {
    issues.push('summary_for_synthesis must be an object.')
  } else {
    const summary = record.summary_for_synthesis as Record<string, unknown>
    if (!isNonEmptyString(summary.one_sentence)) {
      issues.push('summary_for_synthesis.one_sentence must be a non-empty string.')
    }
    for (const field of ['key_conditions', 'potential_risks', 'source_element_keys'] as const) {
      if (!isStringArray(summary[field])) {
        issues.push(`summary_for_synthesis.${field} must be a string array.`)
      }
    }
  }

  if (!record.qa || typeof record.qa !== 'object') {
    issues.push('qa must be an object.')
  } else {
    const qa = record.qa as Record<string, unknown>
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

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, data: record as TalentMapGeneratedSectionV1, issues: [] }
}

function renderMarkdownList(title: string, items: string[]): string {
  if (items.length === 0) {
    return `## ${title}\n\n—`
  }
  return `## ${title}\n\n${items.map((item) => `- ${item}`).join('\n')}`
}

export function renderGeneratedSectionBaseMarkdown(section: TalentMapGeneratedSectionV1): string {
  const { base } = section
  return [
    `# ${base.headline}`,
    '',
    base.short_summary,
    '',
    '## Рабочий паттерн',
    '',
    base.working_pattern,
    '',
    renderMarkdownList('Лучшие условия входа', base.best_entry_conditions),
    '',
    renderMarkdownList('Подходящий формат задач', base.suitable_task_format),
    '',
    renderMarkdownList('Чего лучше избегать', base.what_to_avoid),
    '',
    '## Заметка для руководителя',
    '',
    base.manager_note,
  ].join('\n')
}

export function renderGeneratedSectionProMarkdown(section: TalentMapGeneratedSectionV1): string {
  const { pro } = section
  return [
    '## Техническое резюме',
    '',
    pro.technical_summary,
    '',
    renderMarkdownList('Логика источников', pro.source_logic),
    '',
    renderMarkdownList('Ограничения интерпретации', pro.interpretation_limits),
    '',
    renderMarkdownList('Что проверить в реальности', pro.reality_checks),
  ].join('\n')
}

export function isSupportedGenerationSectionKey(
  sectionKey: TalentMapSectionKey,
): sectionKey is 'work_mode_and_entry' {
  return sectionKey === 'work_mode_and_entry'
}
