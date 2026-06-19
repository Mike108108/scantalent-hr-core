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
    'headline: 1 короткая прикладная мысль.',
    'hr_summary: 2 коротких предложения.',
    'Каждый Base block: 2 пункта; каждый пункт короткий, конкретный, без длинного объяснения.',
    'source_chips: 3–5 самых важных источников, только из input.',
    'pro.source_logic: 3–4 главных источника.',
    'interpretation_limits: 2 пункта; reality_checks: 2 пункта.',
    'summary_for_synthesis.key_conditions: 2–3 пункта; potential_risks: 2–3 пункта.',
    'Без длинных сценариев и без экспертных развилок.',
    'Compact не означает плохой ответ — меньше охват, но чисто и применимо.',
  ].join('\n'),
}

const FULL_PROFILE: TalentMapDepthProfile = {
  id: 'full',
  ui_label: 'Полный HR-разбор',
  ui_short_label: 'Full',
  ui_description: 'Основной клиентский HR-разбор слоя.',
  prompt_label: 'full — полный HR-разбор слоя',
  base_points_per_block: { min: 2, max: 3 },
  source_chips_target: { min: 5, max: 8 },
  source_logic_target: { min: 5, max: 8 },
  interpretation_limits_target: { min: 3, max: 4 },
  reality_checks_target: { min: 3, max: 4 },
  summary_key_conditions_target: { min: 3, max: 4 },
  summary_risks_target: { min: 3, max: 4 },
  style_instruction: [
    'headline: коротко и точно.',
    'hr_summary: 3–5 предложений.',
    'Каждый Base block: 2–3 пункта; пункты конкретные, не generic HR.',
    'source_chips: 5–8 источников, только из input.',
    'pro.source_logic: 5–8 источников.',
    'interpretation_limits: 3–4; reality_checks: 3–4.',
    'summary_for_synthesis.key_conditions: 3–4; potential_risks: 3–4.',
    'Результат должен быть годен как основной клиентский слой карты.',
  ].join('\n'),
}

const EXPERT_PROFILE: TalentMapDepthProfile = {
  id: 'expert',
  ui_label: 'Экспертная сборка',
  ui_short_label: 'Expert',
  ui_description: 'Экспертная сборка слоя для важного кандидата.',
  prompt_label: 'expert — экспертный синтез с нюансами',
  base_points_per_block: { min: 3, max: 4 },
  source_chips_target: { min: 8, max: 12 },
  source_logic_target: { min: 8, max: 12 },
  interpretation_limits_target: { min: 4, max: 6 },
  reality_checks_target: { min: 4, max: 6 },
  summary_key_conditions_target: { min: 4, max: 6 },
  summary_risks_target: { min: 4, max: 6 },
  style_instruction: [
    'headline: точная формула рабочего входа.',
    'hr_summary: 4–7 предложений.',
    'Каждый Base block: 3–4 пункта.',
    'Добавлять приоритеты: что главное, что вторично.',
    'Добавлять сценарии: хорошая среда / неподходящая среда.',
    'Добавлять управленческие нюансы.',
    'Добавлять противоречия или напряжения, если они реально следуют из источников.',
    'source_chips: 8–12 источников, если столько реально есть во входе.',
    'pro.source_logic: 8–12 источников, если столько реально есть во входе.',
    'interpretation_limits: 4–6; reality_checks: 4–6.',
    'summary_for_synthesis.key_conditions: 4–6; potential_risks: 4–6.',
    'Это не просто больше текста, а больше синтеза.',
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
