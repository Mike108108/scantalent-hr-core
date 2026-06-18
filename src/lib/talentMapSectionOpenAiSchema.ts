export const TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version',
    'section_key',
    'section_title',
    'base',
    'pro',
    'source_chips',
    'summary_for_synthesis',
    'qa',
  ],
  properties: {
    schema_version: { type: 'string', const: 'talent_map_section_v1' },
    section_key: { type: 'string', const: 'work_mode_and_entry' },
    section_title: { type: 'string', const: 'Рабочий формат и вход в задачи' },
    base: {
      type: 'object',
      additionalProperties: false,
      required: [
        'headline',
        'short_summary',
        'working_pattern',
        'best_entry_conditions',
        'suitable_task_format',
        'what_to_avoid',
        'manager_note',
      ],
      properties: {
        headline: { type: 'string' },
        short_summary: { type: 'string' },
        working_pattern: { type: 'string' },
        best_entry_conditions: { type: 'array', items: { type: 'string' } },
        suitable_task_format: { type: 'array', items: { type: 'string' } },
        what_to_avoid: { type: 'array', items: { type: 'string' } },
        manager_note: { type: 'string' },
      },
    },
    pro: {
      type: 'object',
      additionalProperties: false,
      required: ['technical_summary', 'source_logic', 'interpretation_limits', 'reality_checks'],
      properties: {
        technical_summary: { type: 'string' },
        source_logic: { type: 'array', items: { type: 'string' } },
        interpretation_limits: { type: 'array', items: { type: 'string' } },
        reality_checks: { type: 'array', items: { type: 'string' } },
      },
    },
    source_chips: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'element_kind',
          'element_key',
          'element_label',
          'role_in_layer',
          'reason_used',
          'link_target',
        ],
        properties: {
          element_kind: { type: 'string' },
          element_key: { type: 'string' },
          element_label: { type: 'string' },
          role_in_layer: { type: 'string' },
          reason_used: { type: 'string' },
          link_target: { type: 'string' },
        },
      },
    },
    summary_for_synthesis: {
      type: 'object',
      additionalProperties: false,
      required: ['one_sentence', 'key_conditions', 'potential_risks', 'source_element_keys'],
      properties: {
        one_sentence: { type: 'string' },
        key_conditions: { type: 'array', items: { type: 'string' } },
        potential_risks: { type: 'array', items: { type: 'string' } },
        source_element_keys: { type: 'array', items: { type: 'string' } },
      },
    },
    qa: {
      type: 'object',
      additionalProperties: false,
      required: [
        'base_language_checked',
        'forbidden_terms_checked',
        'source_chips_checked',
        'limitations_present',
      ],
      properties: {
        base_language_checked: { type: 'boolean' },
        forbidden_terms_checked: { type: 'boolean' },
        source_chips_checked: { type: 'boolean' },
        limitations_present: { type: 'boolean' },
      },
    },
  },
} as const

export const TALENT_MAP_SECTION_SYSTEM_PROMPT = `Ты собираешь один раздел HR-карты талантов кандидата.
Раздел: "Рабочий формат и вход в задачи".
Ты не оцениваешь соответствие кандидата вакансии.
Ты не принимаешь решение о найме.
Ты не используешь проценты.
Ты не используешь fit_score, match_score, role_fit, vacancy_fit.
Ты не используешь Human Design термины в Base.
Ты можешь использовать только предоставленные source_digests и source_chips.
Если данных недостаточно — укажи ограничение вывода.
Не придумывай значения элементов, которых нет во входе.
Base должен быть понятным HR-языком.
Pro может раскрывать техническое основание, но только через:
технический источник → механика → HR-перевод → ограничение вывода → что проверить в реальности.`

export function buildSanitizedSectionInputForAi(params: {
  section: {
    section_key: string
    section_title: string
    source_digests: unknown
    source_chips: unknown
    guardrails: unknown
    selected_fields_for_ai: unknown
    budget_summary: unknown
  }
  section_goal: string
  global_guardrails: unknown
}) {
  return {
    section_key: params.section.section_key,
    section_title: params.section.section_title,
    section_goal: params.section_goal,
    source_digests: params.section.source_digests,
    source_chips: params.section.source_chips,
    guardrails: params.section.guardrails,
    selected_fields_for_ai: params.section.selected_fields_for_ai,
    budget_summary: params.section.budget_summary,
    global_guardrails: params.global_guardrails,
  }
}

export function extractOpenAiResponseText(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>

  if (typeof record.output_text === 'string' && record.output_text.trim()) {
    return record.output_text.trim()
  }

  const output = record.output
  if (!Array.isArray(output)) {
    return null
  }

  const textParts: string[] = []

  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue
    }

    const outputItem = item as Record<string, unknown>

    if (typeof outputItem.text === 'string' && outputItem.text.trim()) {
      textParts.push(outputItem.text.trim())
    }

    if (Array.isArray(outputItem.content)) {
      for (const contentPart of outputItem.content) {
        if (!contentPart || typeof contentPart !== 'object') {
          continue
        }

        const part = contentPart as Record<string, unknown>
        const partType = typeof part.type === 'string' ? part.type : ''

        if (typeof part.text === 'string' && part.text.trim()) {
          textParts.push(part.text.trim())
          continue
        }

        if (typeof part.output_text === 'string' && part.output_text.trim()) {
          textParts.push(part.output_text.trim())
          continue
        }

        if (
          (partType === 'output_text' || partType === 'text') &&
          typeof part.value === 'string' &&
          part.value.trim()
        ) {
          textParts.push(part.value.trim())
        }
      }
    }
  }

  const combined = textParts.join('\n').trim()
  return combined || null
}

export function extractOpenAiUsage(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const usage = (payload as Record<string, unknown>).usage
  if (!usage || typeof usage !== 'object') {
    return null
  }

  return usage as Record<string, unknown>
}
