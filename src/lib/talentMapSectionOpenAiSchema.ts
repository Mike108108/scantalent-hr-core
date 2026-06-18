const BASE_BLOCK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'points'],
  properties: {
    title: { type: 'string' },
    points: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 4,
    },
  },
} as const

const SOURCE_LOGIC_ENTRY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'source_element_key',
    'source_label',
    'mechanic_meaning',
    'hr_translation',
    'interpretation_limit',
    'reality_check',
  ],
  properties: {
    source_element_key: { type: 'string' },
    source_label: { type: 'string' },
    mechanic_meaning: { type: 'string' },
    hr_translation: { type: 'string' },
    interpretation_limit: { type: 'string' },
    reality_check: { type: 'string' },
  },
} as const

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
    schema_version: { type: 'string', const: 'talent_map_section_v1_1' },
    section_key: { type: 'string', const: 'work_mode_and_entry' },
    section_title: { type: 'string', const: 'Рабочий формат и вход в задачи' },
    base: {
      type: 'object',
      additionalProperties: false,
      required: [
        'headline',
        'hr_summary',
        'how_to_start_work',
        'best_task_format',
        'manager_instructions',
        'useful_in_roles',
        'risks_if_wrong_entry',
        'interview_or_trial_checks',
        'first_working_experiments',
      ],
      properties: {
        headline: { type: 'string' },
        hr_summary: { type: 'string' },
        how_to_start_work: BASE_BLOCK_SCHEMA,
        best_task_format: BASE_BLOCK_SCHEMA,
        manager_instructions: BASE_BLOCK_SCHEMA,
        useful_in_roles: BASE_BLOCK_SCHEMA,
        risks_if_wrong_entry: BASE_BLOCK_SCHEMA,
        interview_or_trial_checks: BASE_BLOCK_SCHEMA,
        first_working_experiments: BASE_BLOCK_SCHEMA,
      },
    },
    pro: {
      type: 'object',
      additionalProperties: false,
      required: ['technical_summary', 'source_logic', 'interpretation_limits', 'reality_checks'],
      properties: {
        technical_summary: { type: 'string' },
        source_logic: {
          type: 'array',
          items: SOURCE_LOGIC_ENTRY_SCHEMA,
        },
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

export const TALENT_MAP_SECTION_SYSTEM_PROMPT = `Ты собираешь один раздел HR-карты талантов: "Рабочий формат и вход в задачи".

Твоя задача — не описать карту и не пересказать элементы.
Твоя задача — дать HR/руководителю практическую инструкцию:
как вводить человека в задачи, какие задачи давать, как ставить рамки, где он может быть полезен, что проверить в интервью/тестовом/первой неделе.

Base — это клиентский HR-язык.
Base должен быть готов для показа HR/руководителю без знания Human Design.
Base должен быть практической инструкцией, а не описанием карты.

Каждый пункт Base должен отвечать на рабочий вопрос:
- как дать задачу;
- какие вводные передать;
- какие задачи подходят;
- где человек будет полезен;
- что может сломаться;
- что проверить на интервью/тестовом/первой неделе;
- какие первые рабочие эксперименты дать.

Base запрещено:
- использовать Human Design terms;
- использовать source labels;
- писать Projector, Splenic, Wait for the Invitation, Split Definition, Curiosity;
- писать канал 11-56, канал 18-58, ворота, центр, профиль 1/3, стратегия Ждать приглашения, авторитет, бодиграф, Human Design, Дизайн Человека;
- писать personality sun, design sun, personality earth, design earth;
- использовать слово "канал" как термин карты — вместо этого писать "способ связи", "формат коммуникации", "маршрут задачи", "источник заявки", "контакт для доступа к данным";
- пересказывать элементы карты;
- писать общие фразы без рабочего действия;
- писать "нужен контекст" без примера, какой именно контекст дать;
- писать "может быть полезен" без примера, в какой рабочей ситуации;
- давать решение о найме;
- использовать проценты;
- использовать fit_score, match_score, role_fit, vacancy_fit.

Если источник содержит технический термин, переведи его в рабочий язык.

Примеры перевода:

Projector →
человек лучше включается там, где его взгляд явно запрошен и есть понятная роль

Wait for the Invitation →
не бросать задачу в формате "сам разберись"; лучше обозначить, зачем нужен его взгляд, где границы ответственности и какой результат ждёт команда

Splenic →
может быстро замечать, где решение выглядит небезопасным, несвоевременным или нежизнеспособным; лучше дать возможность озвучить это и проверить фактами

Split Definition →
лучше собирает картину через диалог, уточнения и связь разных частей контекста

Curiosity →
умеет связывать факты, задавать вопросы и объяснять смысл так, чтобы другие включались

Каждый Base-пункт должен быть прикладным.

Плохо:
"Ему нужен контекст".

Хорошо:
"Перед задачей дать цель, критерий хорошего результата, владельца решения, доступ к нужным людям/данным и срок первого черновика".

Плохо:
"Подходит диагностика систем".

Хорошо:
"Дать задачу разобрать, где в процессе теряются заявки, почему команда по-разному понимает правила и какие 2–3 улучшения можно протестировать".

Плохо:
"Нужно приглашение".

Хорошо:
"Не бросать задачу в формате 'сам разберись'; лучше явно обозначить, зачем нужен его взгляд, где границы ответственности и какой результат ждёт команда".

Плохо:
"У него быстрый селезёночный сигнал".

Хорошо:
"Он может быстро замечать, где решение выглядит небезопасным, несвоевременным или нежизнеспособным; лучше дать ему возможность сразу озвучить такие наблюдения и потом проверить их фактами".

Pro может использовать технические источники, но должен объяснять:
source → смысл механики → HR-перевод → ограничение вывода → что проверить в реальности.

Не придумывай source names.
Если источника нет в selected source_chips, не упоминай его как основание.
Не используй странные или неподтверждённые слова.
Не используй "пауки" или другие случайные слова.

Ты не оцениваешь соответствие кандидата вакансии.
Ты не принимаешь решение о найме.
Ты можешь использовать только предоставленные source_digests и source_chips.
Если данных недостаточно — укажи ограничение вывода.
Не придумывай значения элементов, которых нет во входе.
Не генерируй generation_meta — это добавит backend после валидации.`

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

export const OPENAI_RESPONSE_PREVIEW_LIMIT = 8000

export function buildOpenAiResponsePreview(text: string): string {
  if (text.length <= OPENAI_RESPONSE_PREVIEW_LIMIT) {
    return text
  }

  return text.slice(0, OPENAI_RESPONSE_PREVIEW_LIMIT)
}

export function stripJsonMarkdownFence(text: string): string {
  const trimmed = text.trim()

  const fencedMatch = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i)
  if (fencedMatch) {
    return fencedMatch[1].trim()
  }

  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*\n?/i, '')
      .replace(/\n?```\s*$/, '')
      .trim()
  }

  return trimmed
}

export function extractFirstJsonObjectText(text: string): string | null {
  const start = text.indexOf('{')
  if (start === -1) {
    return null
  }

  let depth = 0
  let inString = false
  let escaped = false

  for (let index = start; index < text.length; index += 1) {
    const char = text[index]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === '"') {
        inString = false
      }

      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === '{') {
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return text.slice(start, index + 1)
      }
    }
  }

  return null
}

export type OpenAiJsonParseAttempt = {
  strategy: string
  error: string
}

export type OpenAiJsonParseSuccess = {
  ok: true
  parsed: unknown
  parse_strategy: string
}

export type OpenAiJsonParseFailure = {
  ok: false
  error: string
  cleaned_preview: string
  raw_preview: string
  parse_strategy_attempts: OpenAiJsonParseAttempt[]
}

function tryJsonParse(
  candidate: string,
  strategy: string,
  attempts: OpenAiJsonParseAttempt[],
): OpenAiJsonParseSuccess | null {
  try {
    return {
      ok: true,
      parsed: JSON.parse(candidate),
      parse_strategy: strategy,
    }
  } catch (error) {
    attempts.push({
      strategy,
      error: error instanceof Error ? error.message : 'JSON.parse failed',
    })
    return null
  }
}

export function parseOpenAiJsonOutput(text: string): OpenAiJsonParseSuccess | OpenAiJsonParseFailure {
  const raw = text.trim()
  const raw_preview = buildOpenAiResponsePreview(raw)
  const attempts: OpenAiJsonParseAttempt[] = []

  const direct = tryJsonParse(raw, 'direct_json_parse', attempts)
  if (direct) {
    return direct
  }

  const stripped = stripJsonMarkdownFence(raw)
  if (stripped !== raw) {
    const strippedResult = tryJsonParse(stripped, 'stripped_markdown_fence', attempts)
    if (strippedResult) {
      return strippedResult
    }
  } else {
    attempts.push({
      strategy: 'stripped_markdown_fence',
      error: 'No markdown fence detected',
    })
  }

  const extracted = extractFirstJsonObjectText(stripped)
  if (extracted) {
    const extractedResult = tryJsonParse(extracted, 'extracted_first_json_object', attempts)
    if (extractedResult) {
      return extractedResult
    }
  } else {
    attempts.push({
      strategy: 'extracted_first_json_object',
      error: 'No JSON object boundaries found',
    })
  }

  return {
    ok: false,
    error: attempts[attempts.length - 1]?.error ?? 'JSON.parse failed',
    cleaned_preview: buildOpenAiResponsePreview(stripped),
    raw_preview,
    parse_strategy_attempts: attempts,
  }
}

export function extractOpenAiResponseDiagnostics(
  payload: unknown,
  outputText?: string | null,
): Record<string, unknown> {
  const diagnostics: Record<string, unknown> = {}

  if (!payload || typeof payload !== 'object') {
    return diagnostics
  }

  const record = payload as Record<string, unknown>

  for (const key of ['id', 'status', 'model', 'created_at', 'incomplete_details', 'error'] as const) {
    if (record[key] !== undefined) {
      diagnostics[key] = record[key]
    }
  }

  if (record.usage !== undefined) {
    diagnostics.usage = record.usage
  }

  if (Array.isArray(record.output)) {
    diagnostics.output_items = record.output.map((item, index) => {
      if (!item || typeof item !== 'object') {
        return { index, type: 'unknown' }
      }

      const outputItem = item as Record<string, unknown>
      const summary: Record<string, unknown> = {
        index,
        type: outputItem.type ?? null,
        status: outputItem.status ?? null,
      }

      if (outputItem.finish_reason !== undefined) {
        summary.finish_reason = outputItem.finish_reason
      }

      if (Array.isArray(outputItem.content)) {
        summary.content_part_types = outputItem.content.map((part) => {
          if (!part || typeof part !== 'object') {
            return 'unknown'
          }

          return (part as Record<string, unknown>).type ?? 'unknown'
        })
      }

      return summary
    })
  }

  if (outputText !== undefined) {
    diagnostics.output_text_length = outputText?.length ?? 0
    if (outputText) {
      diagnostics.output_text_preview = buildOpenAiResponsePreview(outputText)
    }
  }

  return diagnostics
}

export class OpenAiSectionParseError extends Error {
  readonly diagnostics: Record<string, unknown>

  readonly usage: Record<string, unknown> | null

  readonly model: string

  readonly modelPresetId: string

  readonly modelPresetLabel: string

  constructor(params: {
    message: string
    diagnostics: Record<string, unknown>
    usage: Record<string, unknown> | null
    model: string
    modelPresetId: string
    modelPresetLabel: string
  }) {
    super(params.message)
    this.name = 'OpenAiSectionParseError'
    this.diagnostics = params.diagnostics
    this.usage = params.usage
    this.model = params.model
    this.modelPresetId = params.modelPresetId
    this.modelPresetLabel = params.modelPresetLabel
  }
}

export function isOpenAiSectionParseError(error: unknown): error is OpenAiSectionParseError {
  return error instanceof OpenAiSectionParseError
}

export function buildOpenAiParseFailureContentJson(params: {
  message: string
  diagnostics: Record<string, unknown>
}): Record<string, unknown> {
  return {
    status: 'error',
    error_kind: 'openai_json_parse_failed',
    message: params.message,
    parse_diagnostics: params.diagnostics,
  }
}

export type SectionParseDiagnosticsContent = {
  stage?: string
  parse_error_message?: string
  raw_response_preview?: string
  cleaned_response_preview?: string
  openai_response_diagnostics?: Record<string, unknown>
  parse_strategy_attempts?: OpenAiJsonParseAttempt[]
}

export function readSectionParseDiagnostics(contentJson: unknown): SectionParseDiagnosticsContent | null {
  if (!contentJson || typeof contentJson !== 'object') {
    return null
  }

  const record = contentJson as Record<string, unknown>
  if (record.error_kind !== 'openai_json_parse_failed') {
    return null
  }

  const parseDiagnostics = record.parse_diagnostics
  if (!parseDiagnostics || typeof parseDiagnostics !== 'object') {
    return null
  }

  return parseDiagnostics as SectionParseDiagnosticsContent
}
