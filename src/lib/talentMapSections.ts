import type { LayerKey } from './types'

export type TalentMapSectionStatus =
  | 'not_collected'
  | 'ready'
  | 'error'
  | 'needs_update'

export type TalentMapSectionDefinition = {
  key: LayerKey
  title: string
  description: string
  tokenCost: number
}

export const MVP_TALENT_MAP_SECTIONS: TalentMapSectionDefinition[] = [
  {
    key: 'work_mode_and_entry',
    title: 'Рабочий формат и вход в задачи',
    description: 'Как человек естественно включается в работу и какой формат задач ему подходит.',
    tokenCost: 1,
  },
  {
    key: 'decision_style',
    title: 'Принятие решений',
    description: 'Как лучше принимать рабочие решения и где усиливается давление.',
    tokenCost: 1,
  },
  {
    key: 'main_talents',
    title: 'Главные таланты',
    description: 'Какие устойчивые сильные стороны видны в карте.',
    tokenCost: 1,
  },
  {
    key: 'work_environment',
    title: 'Рабочая среда',
    description: 'В каких условиях человек раскрывается лучше всего.',
    tokenCost: 1,
  },
  {
    key: 'communication',
    title: 'Коммуникация',
    description: 'Как обсуждать задачи, обратную связь и ожидания.',
    tokenCost: 1,
  },
  {
    key: 'risks',
    title: 'Риски и чувствительные зоны',
    description: 'Где возможны перегрузка, искажения и уязвимости.',
    tokenCost: 1,
  },
  {
    key: 'management',
    title: 'Управление кандидатом',
    description: 'Как ставить задачи и поддерживать сильные стороны.',
    tokenCost: 1,
  },
  {
    key: 'development_potential',
    title: 'Потенциал развития',
    description: 'Куда человек может расти через опыт и практику.',
    tokenCost: 1,
  },
]

export const SECTION_STATUS_LABELS: Record<TalentMapSectionStatus, string> = {
  not_collected: 'Ещё не собран',
  ready: 'Готов',
  error: 'Ошибка',
  needs_update: 'Требует обновления',
}
