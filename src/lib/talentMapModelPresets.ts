import type { TalentMapDepthProfileId } from './talentMapDepthProfiles'

export type TalentMapModelPresetId = 'standard' | 'quality' | 'premium'

export type TalentMapPresetWorkflowRole =
  | 'mass_screening_snapshot'
  | 'candidate_assessment'
  | 'onboarding_management_playbook'

export const TALENT_MAP_PRESET_WORKFLOW_ROLE: Record<
  TalentMapModelPresetId,
  TalentMapPresetWorkflowRole
> = {
  standard: 'mass_screening_snapshot',
  quality: 'candidate_assessment',
  premium: 'onboarding_management_playbook',
}

export type TalentMapReasoningEffort = 'low' | 'medium' | 'high'

export type TalentMapModelPreset = {
  id: TalentMapModelPresetId
  depth_profile_id: TalentMapDepthProfileId
  ui_label: string
  ui_description: string
  model: string
  reasoning_effort: TalentMapReasoningEffort
  /**
   * Optional hard output cap.
   * Current presets should omit this by default; depth is controlled by depth profiles.
   */
  max_output_tokens?: number
  internal_credit_cost: number
  pricing: {
    input_usd_per_1m: number
    output_usd_per_1m: number
  }
}

export const TALENT_MAP_MODEL_PRESETS: Record<TalentMapModelPresetId, TalentMapModelPreset> = {
  standard: {
    id: 'standard',
    depth_profile_id: 'compact',
    ui_label: 'Стандартная сборка',
    ui_description:
      'Быстрый слой-портрет для массового первичного скрининга кандидатов.',
    model: 'gpt-5-mini',
    reasoning_effort: 'low',
    internal_credit_cost: 3,
    pricing: {
      input_usd_per_1m: 0.25,
      output_usd_per_1m: 2.0,
    },
  },
  quality: {
    id: 'quality',
    depth_profile_id: 'full',
    ui_label: 'Качественная сборка',
    ui_description:
      'Полный HR-разбор кандидата для глубокой оценки, проверки рисков и подготовки решения.',
    model: 'gpt-5.4-mini',
    reasoning_effort: 'low',
    internal_credit_cost: 8,
    pricing: {
      input_usd_per_1m: 0.75,
      output_usd_per_1m: 4.5,
    },
  },
  premium: {
    id: 'premium',
    depth_profile_id: 'expert',
    ui_label: 'Максимальная сборка',
    ui_description:
      'Экспертный управленческий разбор для важных кандидатов: адаптация, ввод в роль, команда, процессы, риски управления и условия раскрытия.',
    model: 'gpt-5.4',
    reasoning_effort: 'medium',
    internal_credit_cost: 25,
    pricing: {
      input_usd_per_1m: 2.5,
      output_usd_per_1m: 15.0,
    },
  },
}

export const DEFAULT_TALENT_MAP_MODEL_PRESET_ID: TalentMapModelPresetId = 'standard'

export const TALENT_MAP_MODEL_PRESET_ORDER: TalentMapModelPresetId[] = [
  'standard',
  'quality',
  'premium',
]

export function getTalentMapModelPreset(id: unknown): {
  preset: TalentMapModelPreset
  fallback_used: boolean
} {
  if (
    typeof id === 'string' &&
    Object.prototype.hasOwnProperty.call(TALENT_MAP_MODEL_PRESETS, id)
  ) {
    return {
      preset: TALENT_MAP_MODEL_PRESETS[id as TalentMapModelPresetId],
      fallback_used: false,
    }
  }

  return {
    preset: TALENT_MAP_MODEL_PRESETS[DEFAULT_TALENT_MAP_MODEL_PRESET_ID],
    fallback_used: true,
  }
}

export function estimateOpenAiCostUsd(args: {
  input_tokens?: number | null
  output_tokens?: number | null
  preset: TalentMapModelPreset
}): number | null {
  const inputTokens = typeof args.input_tokens === 'number' ? args.input_tokens : null
  const outputTokens = typeof args.output_tokens === 'number' ? args.output_tokens : null

  if (inputTokens === null && outputTokens === null) {
    return null
  }

  const inputCost =
    inputTokens === null ? 0 : (inputTokens / 1_000_000) * args.preset.pricing.input_usd_per_1m

  const outputCost =
    outputTokens === null ? 0 : (outputTokens / 1_000_000) * args.preset.pricing.output_usd_per_1m

  return inputCost + outputCost
}
