import {
  TALENT_MAP_SECTION_KEYS,
  type TalentMapSectionKey,
  type ComputeSectionSize,
} from './talentMapSections'
import type { SectionSourceRole } from './talentMapSourceBudget'

export type { TalentMapSectionKey }

/** @deprecated Use TalentMapSectionKey */
export type LayerKey = TalentMapSectionKey

export type SectionGenerationStatus =
  | 'not_generated'
  | 'input_not_ready'
  | 'input_ready'
  | 'generating'
  | 'ready'
  | 'failed'
  | 'stale'

export const SECTION_GENERATION_STATUS_LABELS: Record<SectionGenerationStatus, string> = {
  not_generated: 'Ещё не собран',
  input_not_ready: 'Вход не готов',
  input_ready: 'Ещё не собран',
  generating: 'Сборка…',
  ready: 'Готов',
  failed: 'Ошибка',
  stale: 'Требует обновления',
}

export type SectionInputStatusLabel =
  | 'Ещё не собран'
  | 'Вход не готов'
  | 'Готов'
  | 'Ошибка'
  | 'Требует обновления'

export function sectionUserStatusLabel(status: SectionGenerationStatus): SectionInputStatusLabel {
  return SECTION_GENERATION_STATUS_LABELS[status] as SectionInputStatusLabel
}

export { TALENT_MAP_SECTION_KEYS }

export type SectionSourceDigest = {
  element_kind: string
  element_key: string
  element_label: string | null
  source_role: SectionSourceRole
  rank_score: number
  rank_reasons: string[]

  digest: {
    plain_meaning?: string
    work_manifestation?: string
    strengths?: string[]
    risks?: string[]
    management_hints?: string[]
    environment_hints?: string[]
    limitations?: string[]
    context_note?: string
    composition_meta?: {
      composition_mode?: string | null
      composition_components?: string[] | null
      source_component_keys?: string[] | null
    }
  }

  source_chip: {
    role_in_layer: string
    reason_used: string
    link_target: string
  }
}

export type SectionBudgetSummary = {
  primary_selected: number
  supporting_selected: number
  context_selected: number
  total_selected: number
  primary_max: number
  supporting_max: number
  context_max: number
  total_max: number
  omitted_count: number
  total_digest_chars: number
  estimated_input_tokens: number
}

export type SectionComputeMeta = {
  credit_cost: number
  compute_weight: ComputeSectionSize
}
