import type { TalentMapDepthProfile } from './talentMapDepthProfiles'
import type { SupportedGeneratedSectionKey } from './talentMapGeneratedSections'
import { getSupportedGeneratedSectionTitle } from './talentMapGeneratedSections'
import type { SourceChip } from './talentMapSynthesisContract'

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

const TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA_BODY = {
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
    section_key: { type: 'string' },
    section_title: { type: 'string' },
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

export function buildTalentMapSectionOpenAiJsonSchema(params: {
  sectionKey: SupportedGeneratedSectionKey
  sectionTitle: string
}) {
  return {
    ...TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA_BODY,
    properties: {
      ...TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA_BODY.properties,
      section_key: { type: 'string', const: params.sectionKey },
      section_title: { type: 'string', const: params.sectionTitle },
    },
  }
}

export const TALENT_MAP_SECTION_OPENAI_JSON_SCHEMA = buildTalentMapSectionOpenAiJsonSchema({
  sectionKey: 'work_mode_and_entry',
  sectionTitle: getSupportedGeneratedSectionTitle('work_mode_and_entry'),
})

export const TALENT_MAP_SECTION_SYSTEM_PROMPT_BASE = `Ты собираешь один раздел HR-карты талантов: "Рабочий формат и вход в задачи".

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

отклик →
первичная реакция на задачу / рабочая включённость / готовность включиться

приглашение →
явный рабочий запрос / признанная зона ответственности / понятная роль

интуитивный →
быстрая первичная оценка уместности / раннее замечание риска

селезёночный сигнал →
ранний сигнал риска / быстрое замечание небезопасного или нежизнеспособного хода

энергетический →
рабочий / поведенческий / ресурсный / нагрузочный

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

export const DECISION_STYLE_SECTION_SYSTEM_PROMPT_BASE = `Ты собираешь один раздел HR-карты талантов: "Принятие решений".

Твоя задача — не описать карту и не пересказать элементы.
Твоя задача — дать HR/руководителю практическую инструкцию:
как человек принимает рабочие решения, где на него давит среда,
что нельзя ускорять, как ставить рамку выбора, что проверить до решения,
как отличать устойчивый стиль решений от ситуативного напряжения.

Base — это клиентский HR-язык.
Base должен быть готов для показа HR/руководителю без знания Human Design.
Base должен быть практической инструкцией о стиле решений, а не описанием карты.

Каждый пункт Base должен отвечать на рабочий вопрос о решениях:
- как запускать рабочее решение;
- в каком формате человеку проще выбирать;
- как руководителю не давить на решение;
- где этот стиль решений особенно полезен;
- что искажает решение;
- что проверить до решения о кандидате;
- какие первые эксперименты проверят стиль решений.

Рекомендуемые block.title для Base (используй как title соответствующих блоков):
- base.how_to_start_work → "Как запускать рабочее решение"
- base.best_task_format → "В каком формате человеку проще выбирать"
- base.manager_instructions → "Как руководителю не давить на решение"
- base.useful_in_roles → "Где этот стиль решений особенно полезен"
- base.risks_if_wrong_entry → "Что искажает решение"
- base.interview_or_trial_checks → "Что проверить до решения о кандидате"
- base.first_working_experiments → "Первые эксперименты для проверки стиля решений"

Используй HR-язык решений:
рабочее решение, выбор, оценка уместности, ранний сигнал риска, давление, срочность,
ответственность, согласование, темп выбора, проверка решения на практике.

Base запрещено:
- использовать Human Design terms;
- использовать source labels;
- писать Projector, Splenic, Wait for the Invitation, Split Definition, Curiosity;
- писать канал, ворота, центр, профиль, стратегия, авторитет, бодиграф, Human Design, Дизайн Человека;
- писать personality sun, design sun, personality earth, design earth;
- пересказывать элементы карты;
- писать общие фразы без рабочего действия;
- давать решение о найме;
- использовать проценты;
- использовать fit_score, match_score, role_fit, vacancy_fit.

Если источник содержит технический термин, переведи его в язык рабочих решений.

Pro может использовать технические источники, но должен объяснять:
source → смысл механики → HR-перевод → ограничение вывода → что проверить в реальности.

Не придумывай source names.
Если источника нет в selected source_chips, не упоминай его как основание.

Ты не оцениваешь соответствие кандидата вакансии.
Ты не принимаешь решение о найме.
Ты можешь использовать только предоставленные source_digests и source_chips.
Если данных недостаточно — укажи ограничение вывода.
Не придумывай значения элементов, которых нет во входе.
Не генерируй generation_meta — это добавит backend после валидации.`

function buildSectionSystemPromptBase(sectionKey: SupportedGeneratedSectionKey): string {
  switch (sectionKey) {
    case 'work_mode_and_entry':
      return TALENT_MAP_SECTION_SYSTEM_PROMPT_BASE
    case 'decision_style':
      return DECISION_STYLE_SECTION_SYSTEM_PROMPT_BASE
  }
}

/** @deprecated Use buildTalentMapSectionSystemPrompt */
export const TALENT_MAP_SECTION_SYSTEM_PROMPT = TALENT_MAP_SECTION_SYSTEM_PROMPT_BASE

const VISIBLE_JSON_TARGET_BY_DEPTH: Record<TalentMapDepthProfile['id'], string> = {
  compact: '1 500–3 000',
  full: '11 000–15 000',
  expert: '18 000–24 000',
}

function buildDepthVolumeGuidance(depthProfile: TalentMapDepthProfile): string[] {
  switch (depthProfile.id) {
    case 'compact':
      return [
        '- Base blocks: up to 2 пункта в каждом блоке (schema minimum; каждый пункт — 1 короткая фраза)',
        '- source_chips: up to 3 (только из входа)',
        '- pro.source_logic: up to 1 источника',
        '- pro.technical_summary: 1 короткое предложение',
        '- interpretation_limits: up to 1',
        '- reality_checks: up to 1',
        '- summary key_conditions: up to 2',
        '- summary potential_risks: up to 2',
      ]
    case 'full':
      return [
        '- Base blocks: up to 3 пункта в каждом блоке',
        '- source_chips: up to 9 (только из входа)',
        '- pro.source_logic: up to 8 источников',
        '- interpretation_limits: up to 4',
        '- reality_checks: up to 4',
        '- summary key_conditions: up to 5',
        '- summary potential_risks: up to 5',
      ]
    case 'expert':
      return [
        '- Base blocks: up to 4 пункта в каждом блоке',
        '- source_chips: up to 14 (только из входа, если столько есть)',
        '- pro.source_logic: up to 14 источников',
        '- interpretation_limits: up to 7',
        '- reality_checks: up to 7',
        '- summary key_conditions: up to 7',
        '- summary potential_risks: up to 7',
      ]
  }
}

export function buildTalentMapSectionSystemPrompt(params: {
  sectionKey: SupportedGeneratedSectionKey
  sectionTitle: string
  sectionGoal: string
  depthProfile: TalentMapDepthProfile
}): string {
  const { sectionKey, sectionGoal, depthProfile } = params
  const visibleJsonTarget = VISIBLE_JSON_TARGET_BY_DEPTH[depthProfile.id]
  const sectionPromptBase = buildSectionSystemPromptBase(sectionKey)

  const compactSectionFocus =
    sectionKey === 'decision_style'
      ? '- Describe how the candidate makes work decisions, where pressure/acceleration risk appears, what HR should notice quickly.'
      : '- Describe only what is visible in this layer of the candidate map (work entry and task format).'

  const fullSectionFocus =
    sectionKey === 'decision_style'
      ? '- Full helps HR understand decision style, pressure points, what to verify before decision, and how to distinguish stable style from situational tension.'
      : '- Full helps HR understand strengths, risks, conditions, and practical checks before a hiring decision.'

  const expertSectionFocus =
    sectionKey === 'decision_style'
      ? '- Premium explains how a manager should structure decision-making with this person: responsibility, alignment, communication rules, deadlines, avoiding false urgency, first 2–4 weeks signals, management mistakes that break strengths.'
      : '- Premium explains how to introduce, adapt, manage, integrate into team/processes, and avoid breaking strengths.'

  const depthBlock = [
    `Section goal: ${sectionGoal}`,
    '',
    `Профиль глубины: ${depthProfile.prompt_label}`,
    '',
    depthProfile.style_instruction,
    '',
    'Целевые объёмы для этого профиля (target band / upper guidance, не minimum):',
    ...buildDepthVolumeGuidance(depthProfile),
    '',
    'Принцип target band:',
    '- Целевые объёмы — это target band / upper guidance, а не обязательная квота.',
    '- Если источников недостаточно, используй меньше пунктов.',
    '- Не придумывай выводы и не добавляй filler, чтобы попасть в объём.',
    '- Разница между режимами должна быть заметной: compact короче full, full короче expert.',
    '- Но complete valid JSON важнее длины.',
    '',
    'Принцип depth:',
    ...(depthProfile.id === 'compact'
      ? [
          '- Compact / standard = mass screening snapshot. Описывает только текущий слой карты кандидата.',
          '- На этом этапе нет контекста вакансии. Не сравнивай кандидата с вакансией или ролью.',
          '- Do not write: why to move forward; why to reject; good/bad candidate; fit for role; fit for vacancy;',
          '  what to compare with a role later; what to compare with a vacancy later;',
          '  «на что смотреть при сравнении с ролью»; «на что смотреть при сравнении с вакансией».',
          '- No onboarding/management playbook. No long interview/testing expansion.',
          '- Describe only what is visible in this layer of the candidate map.',
          '- Visible user output = headline + one substantial hr_summary paragraph (600–1 000 chars, 5–7 sentences).',
          '- For standard/compact, base.hr_summary is the main visible client output. Write one paragraph, not one sentence.',
          compactSectionFocus,
          '- Target: 600–1 000 Russian characters (~90–150 words). Explain: main layer pattern; work manifestation;',
          '  helpful conditions; risks if managed poorly; what HR/manager should keep in mind (no vacancy comparison).',
          '- Do not mention source keys, HD terms, vacancy, role fit, match score, hire/no-hire, or what to compare later.',
          '- Для standard основной видимый текст — один содержательный абзац, не одна фраза.',
          '- Остальные Base blocks и Pro — минимально для valid JSON; смысл слоя должен быть в hr_summary.',
        ]
      : depthProfile.id === 'full'
        ? [
            '- Compact / standard = mass screening snapshot (no vacancy/role comparison, no onboarding playbook).',
            '- Full / quality = candidate assessment. Helps evaluate the candidate and decide what to check before decision.',
            fullSectionFocus,
            '- Full may include: what to check in interview/trial; first working experiments; behavior risks to verify.',
            '- Full must NOT become a full post-decision onboarding/management playbook.',
            '- Do not write detailed guidance on: onboarding after hire; team/process integration;',
            '  long-term management playbook; how not to break the person after acceptance.',
          ]
        : [
            '- Compact / standard = mass screening snapshot (no vacancy/role comparison).',
            '- Full / quality = candidate assessment (what to verify before decision, not post-decision playbook).',
            '- Expert / premium = management and onboarding playbook for important candidates.',
            expertSectionFocus,
            '- Premium must NOT be only a longer version of Quality.',
            '- Premium must add management/adaptation/onboarding value that Quality does not provide.',
            '- Do not merely add more generic bullets. Translate the layer into actions for a manager.',
            '- Premium does not decide hire/no-hire. It explains how to work with the person if management attention is warranted.',
          ]),
    ...(depthProfile.id === 'compact'
      ? []
      : depthProfile.id === 'full'
        ? ['- Expert = onboarding/management playbook — not used in this profile.']
        : []),
    ...(depthProfile.id !== 'compact'
      ? [
          '- Standard/compact must still be production-quality. Do not produce shallow generic HR advice.',
          '- Do not write vague points like «важно поддерживать», «нужно учитывать особенности», «подходит для разных задач» unless the point explains exactly what to do/check.',
        ]
      : []),
    ...(depthProfile.id === 'full'
      ? [
          '- Each full/quality point should answer: what to verify about the candidate; what to test;',
          '  what risks to watch; how to run first working experiments; how to read behavior before decision.',
        ]
      : depthProfile.id === 'expert'
        ? [
            '- Each expert/premium point should answer: how to introduce/adapt/manage; how to integrate into team/processes;',
            '  what management mistakes to avoid; what early signals show talent vs distortion.',
          ]
        : depthProfile.id === 'compact'
          ? [
              '- Each compact point should answer one of: main layer pattern; work manifestation;',
              '  helpful conditions; risk if managed poorly — without interview/trial/onboarding expansion.',
            ]
          : []),
    '- Base must remain client-facing and without Human Design/source terms.',
    '- Pro can use source logic but only from allowed source chips.',
    '- Не добирай пункты ради количества. Меньше сильных пунктов лучше слабых.',
    '',
    'Hard completion rule:',
    '- Return exactly one complete valid JSON object.',
    '- Valid closed JSON is more important than extra nuance.',
    '- Never sacrifice JSON completion for more detail.',
    '- If you need to shorten, shorten explanations and use fewer items.',
    '- Do not add filler items to satisfy a count.',
    '- Do not repeat the same idea across Base and Pro.',
    '- One point = one clear working idea.',
    '- No long examples inside JSON fields.',
    '',
    'Source/key rule:',
    '- Use only full source keys exactly as provided in allowed_source_chip_keys.',
    '- Never output raw element_key values like "projector", "splenic", "1/3", "18.1".',
    '- Always output "type:projector", "authority:splenic", "profile:1/3", etc.',
    '- Все source_chips, pro.source_logic.source_element_key и summary_for_synthesis.source_element_keys должны быть только из allowed_source_chip_keys / source_chips, которые пришли во входе.',
    '- Нельзя придумывать новые источники.',
    '- Нельзя добавлять gate/channel/center/etc., которых нет в allowed_source_chip_keys.',
    '- Если хочется сослаться на элемент, которого нет во входе, не используй его.',
    '',
    'Visible JSON budget:',
    `- Aim to keep the visible JSON around ${visibleJsonTarget} characters.`,
    '- This is a soft target, not a strict validation rule.',
    '- If the report needs less, use less.',
    '- Do not expand the report to reach the target.',
    '- If the report needs more, prioritize complete valid JSON and concise wording.',
  ].join('\n')

  return `${sectionPromptBase}\n\n${depthBlock}`
}

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

export function enrichSectionInputForOpenAi(params: {
  sectionInput: ReturnType<typeof buildSanitizedSectionInputForAi>
  depthProfile: TalentMapDepthProfile
  sourceChips: SourceChip[]
}) {
  return {
    ...params.sectionInput,
    allowed_source_chip_keys: params.sourceChips.map(
      (chip) => `${chip.element_kind}:${chip.element_key}`,
    ),
    generation_depth_profile: {
      id: params.depthProfile.id,
      label: params.depthProfile.ui_label,
      prompt_label: params.depthProfile.prompt_label,
      rules: {
        base_points_per_block: params.depthProfile.base_points_per_block,
        source_chips_target: params.depthProfile.source_chips_target,
        source_logic_target: params.depthProfile.source_logic_target,
        interpretation_limits_target: params.depthProfile.interpretation_limits_target,
        reality_checks_target: params.depthProfile.reality_checks_target,
        summary_key_conditions_target: params.depthProfile.summary_key_conditions_target,
        summary_risks_target: params.depthProfile.summary_risks_target,
        style_instruction: params.depthProfile.style_instruction,
      },
    },
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

export function isOpenAiIncompleteMaxOutputTokens(
  openAiDiagnostics: Record<string, unknown> | null | undefined,
): boolean {
  if (!openAiDiagnostics || openAiDiagnostics.status !== 'incomplete') {
    return false
  }

  const incompleteDetails = openAiDiagnostics.incomplete_details
  if (!incompleteDetails || typeof incompleteDetails !== 'object') {
    return false
  }

  return (incompleteDetails as Record<string, unknown>).reason === 'max_output_tokens'
}

export const OPENAI_INCOMPLETE_MAX_OUTPUT_TOKENS_MESSAGE =
  'OpenAI response was incomplete because max_output_tokens was reached.'

export function buildOpenAiIncompleteMaxOutputTokensDiagnostics(params: {
  openAiDiagnostics: Record<string, unknown>
  modelPresetId: string
  modelPresetLabel: string
  parseExtras?: Record<string, unknown>
}): Record<string, unknown> {
  return {
    stage: 'openai_response_incomplete',
    error_kind: 'openai_response_incomplete_max_output_tokens',
    openai_response_diagnostics: params.openAiDiagnostics,
    model_preset_id: params.modelPresetId,
    model_preset_label: params.modelPresetLabel,
    ...(params.parseExtras ?? {}),
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
  schema_name?: string
  generation_mode?: 'standard_snapshot' | 'full_section'
}): Record<string, unknown> {
  const errorKind =
    typeof params.diagnostics.error_kind === 'string'
      ? params.diagnostics.error_kind
      : 'openai_json_parse_failed'

  return {
    status: 'error',
    error_kind: errorKind,
    message: params.message,
    parse_diagnostics: params.diagnostics,
    ...(params.schema_name ? { schema_name: params.schema_name } : {}),
    ...(params.generation_mode ? { generation_mode: params.generation_mode } : {}),
  }
}

export type SectionParseDiagnosticsContent = {
  stage?: string
  error_kind?: string
  parse_error_message?: string
  raw_response_preview?: string
  cleaned_response_preview?: string
  openai_response_diagnostics?: Record<string, unknown>
  parse_strategy_attempts?: OpenAiJsonParseAttempt[]
}

const PARSE_FAILURE_ERROR_KINDS = new Set([
  'openai_json_parse_failed',
  'openai_response_incomplete_max_output_tokens',
])

export function readSectionParseDiagnostics(contentJson: unknown): SectionParseDiagnosticsContent | null {
  if (!contentJson || typeof contentJson !== 'object') {
    return null
  }

  const record = contentJson as Record<string, unknown>
  const errorKind = typeof record.error_kind === 'string' ? record.error_kind : null
  if (!errorKind || !PARSE_FAILURE_ERROR_KINDS.has(errorKind)) {
    return null
  }

  const parseDiagnostics = record.parse_diagnostics
  if (!parseDiagnostics || typeof parseDiagnostics !== 'object') {
    return null
  }

  return parseDiagnostics as SectionParseDiagnosticsContent
}
