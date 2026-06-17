import type { TalentMapSectionKey } from './talentMapSections'

export type VacancySignalKey =
  | 'work_format'
  | 'decision_autonomy'
  | 'core_tasks'
  | 'communication_load'
  | 'pace_and_stress'
  | 'management_style'
  | 'growth_path'
  | 'culture_environment'

export type VacancySignalDependency = {
  signal_key: VacancySignalKey
  label: string
  required_sections: readonly TalentMapSectionKey[]
}

export const VACANCY_SIGNAL_DEPENDENCIES: VacancySignalDependency[] = [
  {
    signal_key: 'work_format',
    label: 'Формат работы',
    required_sections: ['work_mode_and_entry', 'work_environment'],
  },
  {
    signal_key: 'decision_autonomy',
    label: 'Автономия решений',
    required_sections: ['decision_style', 'management'],
  },
  {
    signal_key: 'core_tasks',
    label: 'Ключевые задачи',
    required_sections: ['main_talents', 'development_potential'],
  },
  {
    signal_key: 'communication_load',
    label: 'Коммуникационная нагрузка',
    required_sections: ['communication', 'management'],
  },
  {
    signal_key: 'pace_and_stress',
    label: 'Темп и стресс',
    required_sections: ['risks', 'work_environment', 'decision_style'],
  },
  {
    signal_key: 'management_style',
    label: 'Стиль управления',
    required_sections: ['management', 'decision_style'],
  },
  {
    signal_key: 'growth_path',
    label: 'Путь развития',
    required_sections: ['development_potential', 'main_talents'],
  },
  {
    signal_key: 'culture_environment',
    label: 'Культура и среда',
    required_sections: ['work_environment', 'risks'],
  },
]

export function getSectionsForVacancySignal(signalKey: VacancySignalKey): TalentMapSectionKey[] {
  const entry = VACANCY_SIGNAL_DEPENDENCIES.find((item) => item.signal_key === signalKey)
  return entry ? [...entry.required_sections] : []
}
