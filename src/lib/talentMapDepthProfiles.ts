export type TalentMapDepthProfileId = 'compact' | 'full' | 'expert'

export type TalentMapDepthProfile = {
  id: TalentMapDepthProfileId
  ui_label: string
  ui_short_label: string
  ui_description: string
  prompt_label: string

  base_points_per_block: {
    min: number
    max: number
  }

  source_chips_target: {
    min: number
    max: number
  }

  source_logic_target: {
    min: number
    max: number
  }

  interpretation_limits_target: {
    min: number
    max: number
  }

  reality_checks_target: {
    min: number
    max: number
  }

  summary_key_conditions_target: {
    min: number
    max: number
  }

  summary_risks_target: {
    min: number
    max: number
  }

  style_instruction: string
}

const COMPACT_PROFILE: TalentMapDepthProfile = {
  id: 'compact',
  ui_label: 'Быстрый слой-портрет',
  ui_short_label: 'Compact',
  ui_description:
    'Быстрый слой-портрет для массового первичного скрининга — что видно по кандидату в рамках текущего слоя.',
  prompt_label: 'compact — mass screening snapshot / быстрый первичный скрининг',
  base_points_per_block: { min: 2, max: 2 },
  source_chips_target: { min: 1, max: 3 },
  source_logic_target: { min: 1, max: 1 },
  interpretation_limits_target: { min: 1, max: 1 },
  reality_checks_target: { min: 1, max: 1 },
  summary_key_conditions_target: { min: 1, max: 2 },
  summary_risks_target: { min: 1, max: 2 },
  style_instruction: [
    'Compact / standard = fast mass screening snapshot.',
    'Role: mass primary screening — useful after 30–60 seconds of reading.',
    'It describes the candidate only within the current section/layer.',
    'It does not compare the candidate with a vacancy or role.',
    'It does not decide whether to move the candidate forward.',
    'It does not include role-fit or vacancy-fit guidance.',
    'It does not include “what to compare later”.',
    'It does not produce fit_score, match_score, hire/no-hire recommendation.',
    'It does not include onboarding playbook or management playbook.',
    'It does not include long interview/testing expansion or premium-level adaptation guidance.',
    'It must not try to be a mini version of Premium.',
    'headline: 1 короткий нейтральный заголовок слоя.',
    'hr_summary: основной видимый клиентский текст — один содержательный абзац, не одна фраза.',
    'For standard/compact, base.hr_summary is the main visible client output.',
    'Write it as one substantial paragraph, not as one sentence.',
    'Target length: 600–1 000 Russian characters or about 90–150 words. Use 5–7 concise sentences.',
    'It must explain: (1) the main pattern of this layer; (2) how it usually shows up in work;',
    '(3) what conditions help this person function better; (4) what can go wrong if the layer is managed poorly;',
    '(5) what HR/manager should keep in mind, without comparing to a vacancy.',
    'Do not mention source keys, Human Design terms, vacancy, role fit, match score, hire/no-hire, or what to compare later.',
    'Для standard основной видимый текст — не одна фраза, а один содержательный абзац.',
    'Он должен быть коротким, но достаточно объясняющим, чтобы HR понял смысл слоя без открытия Pro.',
    'Base blocks: schema требует все подблоки с min 2 пункта — держи каждый пункт максимально коротким (1 короткая фраза).',
    'Не разворачивай управленческие инструкции, интервью/тест/первую неделю — это не видимый standard output.',
    'source_chips: up to 3 самых важных источников, только из input.',
    'pro.source_logic: up to 1 главного источника; pro.technical_summary: 1 короткое предложение.',
    'interpretation_limits: up to 1; reality_checks: up to 1.',
    'summary_for_synthesis.key_conditions: up to 2; potential_risks: up to 2.',
    'Не добирай пункты ради количества — минимум для valid JSON, максимум краткости.',
  ].join('\n'),
}

const FULL_PROFILE: TalentMapDepthProfile = {
  id: 'full',
  ui_label: 'Полный HR-разбор',
  ui_short_label: 'Full',
  ui_description:
    'Глубокая HR-оценка кандидата: сильные стороны, риски, условия раскрытия и практические проверки перед решением.',
  prompt_label: 'full — candidate assessment / глубокая HR-оценка кандидата',
  base_points_per_block: { min: 3, max: 3 },
  source_chips_target: { min: 6, max: 9 },
  source_logic_target: { min: 6, max: 8 },
  interpretation_limits_target: { min: 3, max: 4 },
  reality_checks_target: { min: 3, max: 4 },
  summary_key_conditions_target: { min: 3, max: 5 },
  summary_risks_target: { min: 3, max: 5 },
  style_instruction: [
    'Full / quality = candidate assessment level.',
    'Role: deep HR analysis of the current layer to help evaluate the candidate before a decision.',
    'headline: коротко и точно.',
    'hr_summary: up to 5 предложений.',
    'Каждый Base block: up to 3 пункта; пункты конкретные, не generic HR.',
    'Нужно дать не только вывод, но и объяснить, почему он следует из источников.',
    'Должно быть больше связей между элементами, чем в compact.',
    'Показать сильные стороны, риски, условия раскрытия, первые проверочные задачи.',
    'Полезно для решения, что проверить о кандидате: на интервью, на тестовом, в первых рабочих экспериментах.',
    'Можно давать: что проверить; что протестировать; какие риски в поведении смотреть; как читать поведение кандидата до решения.',
    'Quality НЕ должен превращаться в Premium.',
    'Не уходить подробно в: onboarding после найма; интеграцию в команду/процессы; long-term management playbook;',
    'как не сломать человека после принятия решения.',
    'Должно быть больше условий раскрытия и управленческой применимости, чем в compact.',
    'Но без экспертской перегрузки и без post-decision playbook. Не повторять одну мысль в разных блоках.',
    'source_chips: up to 9 источников, только из input.',
    'pro.source_logic: up to 8 источников.',
    'interpretation_limits: up to 4; reality_checks: up to 4.',
    'summary_for_synthesis.key_conditions: up to 5; potential_risks: up to 5.',
    'Результат должен быть годен как полноценный HR-разбор для подготовки решения.',
    'Не добирай пункты ради количества — меньше сильных пунктов лучше.',
  ].join('\n'),
}

const EXPERT_PROFILE: TalentMapDepthProfile = {
  id: 'expert',
  ui_label: 'Экспертная сборка',
  ui_short_label: 'Expert',
  ui_description:
    'Экспертный управленческий playbook: ввод в роль, адаптация, команда, процессы и риски управления.',
  prompt_label: 'expert — onboarding & management playbook / экспертный управленческий разбор',
  base_points_per_block: { min: 4, max: 4 },
  source_chips_target: { min: 9, max: 14 },
  source_logic_target: { min: 9, max: 14 },
  interpretation_limits_target: { min: 5, max: 7 },
  reality_checks_target: { min: 5, max: 7 },
  summary_key_conditions_target: { min: 5, max: 7 },
  summary_risks_target: { min: 5, max: 7 },
  style_instruction: [
    'Expert / premium = onboarding & management playbook for important candidates.',
    'Role: explain how to work with the person if they are important enough to invest management attention.',
    'Premium must NOT be only a longer version of Quality.',
    'Premium must add management/adaptation/onboarding value that Quality does not provide.',
    'Do not merely add more generic bullets — translate the layer into actions for a manager.',
    'headline: точная управленческая формула рабочего входа.',
    'hr_summary: up to 7 предложений.',
    'Каждый Base block: up to 4 пункта.',
    'Premium-only темы (если следуют из источников):',
    '- управленческая формула слоя;',
    '- как вводить человека в роль;',
    '- как адаптировать в первые 2–4 недели;',
    '- как встроить в команду;',
    '- как встроить в процессы;',
    '- как руководителю ставить задачи;',
    '- как не сломать сильные стороны;',
    '- какие ошибки управления опасны;',
    '- какие условия среды критичны;',
    '- как отличить талант от искажения;',
    '- что смотреть в первые 2–4 недели;',
    '- что делать, если человек начинает уходить в искажение;',
    '- что нельзя делать даже с сильным кандидатом.',
    'Добавлять сценарии только если они реально следуют из источников:',
    '- благоприятная среда;',
    '- неподходящая среда;',
    '- как проявляется в начале работы;',
    '- как проявляется под давлением.',
    'Добавлять противоречия и напряжения только если они реально следуют из источников.',
    'Не придумывать психодиагностику.',
    'Не добавлять fit_score, match_score, role_fit, vacancy_fit.',
    'Не принимать решение о найме. Не писать «нанять / не нанять».',
    'Не предполагать, что кандидат уже точно принят, если это не задано пользователем.',
    'source_chips: up to 14 источников, если столько реально есть во входе.',
    'pro.source_logic: up to 14 источников, если столько реально есть во входе.',
    'interpretation_limits: up to 7; reality_checks: up to 7.',
    'summary_for_synthesis.key_conditions: up to 7; potential_risks: up to 7.',
    'Это не просто больше текста, а другой тип пользы — управленческий playbook.',
    'Не добирай пункты ради количества — меньше сильных пунктов лучше.',
  ].join('\n'),
}

export const TALENT_MAP_DEPTH_PROFILES: Record<TalentMapDepthProfileId, TalentMapDepthProfile> = {
  compact: COMPACT_PROFILE,
  full: FULL_PROFILE,
  expert: EXPERT_PROFILE,
}

export function getTalentMapDepthProfile(id: TalentMapDepthProfileId): TalentMapDepthProfile {
  return TALENT_MAP_DEPTH_PROFILES[id]
}
