export const TALENT_MAP_SECTION_KEYS = [
  'work_mode_and_entry',
  'decision_style',
  'main_talents',
  'work_environment',
  'communication',
  'risks',
  'management',
  'development_potential',
] as const

export type TalentMapSectionKey = (typeof TALENT_MAP_SECTION_KEYS)[number]

export type ComputeSectionSize = 'small' | 'medium' | 'large'

export type TalentMapSectionStatus =
  | 'not_collected'
  | 'ready'
  | 'error'
  | 'needs_update'

export type TalentMapSectionDefinition = {
  key: TalentMapSectionKey
  title: string
  description: string
  creditCost: number
  compute_weight: ComputeSectionSize
}

export const MVP_TALENT_MAP_SECTIONS: TalentMapSectionDefinition[] = [
  {
    key: 'work_mode_and_entry',
    title: 'Рабочий формат и вход в задачи',
    description: 'Как человек естественно включается в работу и какой формат задач ему подходит.',
    creditCost: 1,
    compute_weight: 'medium',
  },
  {
    key: 'decision_style',
    title: 'Принятие решений',
    description: 'Как лучше принимать рабочие решения и где усиливается давление.',
    creditCost: 1,
    compute_weight: 'medium',
  },
  {
    key: 'main_talents',
    title: 'Главные таланты',
    description: 'Какие устойчивые сильные стороны видны в карте.',
    creditCost: 1,
    compute_weight: 'large',
  },
  {
    key: 'work_environment',
    title: 'Рабочая среда',
    description: 'В каких условиях человек раскрывается лучше всего.',
    creditCost: 1,
    compute_weight: 'medium',
  },
  {
    key: 'communication',
    title: 'Коммуникация',
    description: 'Как обсуждать задачи, обратную связь и ожидания.',
    creditCost: 1,
    compute_weight: 'medium',
  },
  {
    key: 'risks',
    title: 'Риски и чувствительные зоны',
    description: 'Где возможны перегрузка, искажения и уязвимости.',
    creditCost: 1,
    compute_weight: 'large',
  },
  {
    key: 'management',
    title: 'Управление кандидатом',
    description: 'Как ставить задачи и поддерживать сильные стороны.',
    creditCost: 1,
    compute_weight: 'medium',
  },
  {
    key: 'development_potential',
    title: 'Потенциал развития',
    description: 'Куда человек может расти через опыт и практику.',
    creditCost: 1,
    compute_weight: 'large',
  },
]

export const SECTION_STATUS_LABELS: Record<TalentMapSectionStatus, string> = {
  not_collected: 'Ещё не собран',
  ready: 'Готов',
  error: 'Ошибка',
  needs_update: 'Требует обновления',
}

export function getTalentMapSectionDefinition(
  sectionKey: TalentMapSectionKey,
): TalentMapSectionDefinition {
  const definition = MVP_TALENT_MAP_SECTIONS.find((section) => section.key === sectionKey)
  if (!definition) {
    throw new Error(`Unknown talent map section: ${sectionKey}`)
  }
  return definition
}

/** @deprecated Use creditCost on TalentMapSectionDefinition */
export function sectionTokenCost(sectionKey: TalentMapSectionKey): number {
  return getTalentMapSectionDefinition(sectionKey).creditCost
}
