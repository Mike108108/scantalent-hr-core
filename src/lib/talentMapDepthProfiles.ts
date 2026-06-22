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
  ui_label: 'Короткий рабочий вывод',
  ui_short_label: 'Compact',
  ui_description: 'Короткий рабочий вывод. Быстро понять, как вводить человека в задачи.',
  prompt_label: 'compact — короткий рабочий вывод',
  base_points_per_block: { min: 2, max: 2 },
  source_chips_target: { min: 3, max: 5 },
  source_logic_target: { min: 3, max: 4 },
  interpretation_limits_target: { min: 2, max: 2 },
  reality_checks_target: { min: 2, max: 2 },
  summary_key_conditions_target: { min: 2, max: 3 },
  summary_risks_target: { min: 2, max: 3 },
  style_instruction: [
    'Compact — это не слабая версия, а короткая рабочая версия.',
    'headline: 1 короткая прикладная мысль.',
    'hr_summary: 2 коротких предложения.',
    'Каждый Base block: up to 2 пункта; каждый пункт — готовое HR-действие или проверяемое наблюдение.',
    'Не писать общие фразы вроде «важно поддерживать», «нужно учитывать особенности», «подходит для разных задач», если не указано, что именно делать или проверять.',
    'Лучше 2 сильных пункта, чем 4 generic. Не размазывать один источник на много пунктов.',
    'source_chips: up to 5 самых важных источников, только из input.',
    'pro.source_logic: up to 4 главных источника.',
    'interpretation_limits: up to 2; reality_checks: up to 2.',
    'summary_for_synthesis.key_conditions: up to 3; potential_risks: up to 3.',
    'Без длинных сценариев и без экспертных развилок.',
    'Не добирай пункты ради количества — меньше сильных пунктов лучше.',
  ].join('\n'),
}

const FULL_PROFILE: TalentMapDepthProfile = {
  id: 'full',
  ui_label: 'Полный HR-разбор',
  ui_short_label: 'Full',
  ui_description: 'Основной клиентский HR-разбор слоя.',
  prompt_label: 'full — полный HR-разбор слоя',
  base_points_per_block: { min: 3, max: 3 },
  source_chips_target: { min: 6, max: 9 },
  source_logic_target: { min: 6, max: 8 },
  interpretation_limits_target: { min: 3, max: 4 },
  reality_checks_target: { min: 3, max: 4 },
  summary_key_conditions_target: { min: 3, max: 5 },
  summary_risks_target: { min: 3, max: 5 },
  style_instruction: [
    'Full — основной клиентский уровень.',
    'headline: коротко и точно.',
    'hr_summary: up to 5 предложений.',
    'Каждый Base block: up to 3 пункта; пункты конкретные, не generic HR.',
    'Нужно дать не только вывод, но и объяснить, почему он следует из источников.',
    'Должно быть больше связей между элементами, чем в compact.',
    'Должно быть больше условий раскрытия и управленческой применимости.',
    'Но без экспертской перегрузки. Не повторять одну мысль в разных блоках.',
    'source_chips: up to 9 источников, только из input.',
    'pro.source_logic: up to 8 источников.',
    'interpretation_limits: up to 4; reality_checks: up to 4.',
    'summary_for_synthesis.key_conditions: up to 5; potential_risks: up to 5.',
    'Результат должен быть годен как основной клиентский слой карты.',
    'Не добирай пункты ради количества — меньше сильных пунктов лучше.',
  ].join('\n'),
}

const EXPERT_PROFILE: TalentMapDepthProfile = {
  id: 'expert',
  ui_label: 'Экспертная сборка',
  ui_short_label: 'Expert',
  ui_description: 'Экспертная сборка слоя для важного кандидата.',
  prompt_label: 'expert — экспертный синтез с нюансами',
  base_points_per_block: { min: 4, max: 4 },
  source_chips_target: { min: 9, max: 14 },
  source_logic_target: { min: 9, max: 14 },
  interpretation_limits_target: { min: 5, max: 7 },
  reality_checks_target: { min: 5, max: 7 },
  summary_key_conditions_target: { min: 5, max: 7 },
  summary_risks_target: { min: 5, max: 7 },
  style_instruction: [
    'Expert — не просто длиннее, а глубже.',
    'headline: точная формула рабочего входа.',
    'hr_summary: up to 7 предложений.',
    'Каждый Base block: up to 4 пункта.',
    'Добавлять сценарии, если они реально следуют из источников:',
    '- благоприятная среда;',
    '- неподходящая среда;',
    '- как проявляется в начале работы;',
    '- как проявляется под давлением;',
    '- что руководителю нельзя делать;',
    '- что проверять на интервью/тестовом/первой неделе.',
    'Добавлять противоречия и напряжения только если они реально следуют из источников.',
    'Не придумывать психодиагностику.',
    'Не добавлять fit_score, match_score, role_fit, vacancy_fit.',
    'Не принимать решение о найме.',
    'source_chips: up to 14 источников, если столько реально есть во входе.',
    'pro.source_logic: up to 14 источников, если столько реально есть во входе.',
    'interpretation_limits: up to 7; reality_checks: up to 7.',
    'summary_for_synthesis.key_conditions: up to 7; potential_risks: up to 7.',
    'Это не просто больше текста, а больше синтеза.',
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
