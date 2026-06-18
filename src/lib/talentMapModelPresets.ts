export type TalentMapModelPresetId = 'standard' | 'quality' | 'premium'

export type TalentMapReasoningEffort = 'low' | 'medium' | 'high'

export type TalentMapModelPreset = {
  id: TalentMapModelPresetId
  ui_label: string
  ui_description: string
  model: string
  reasoning_effort: TalentMapReasoningEffort
  max_output_tokens: number
  internal_credit_cost: number
  pricing: {
    input_usd_per_1m: number
    output_usd_per_1m: number
  }
}

export const TALENT_MAP_MODEL_PRESETS: Record<TalentMapModelPresetId, TalentMapModelPreset> = {
  standard: {
    id: 'standard',
    ui_label: 'Стандартная сборка',
    ui_description:
      'Базовый клиентский уровень. Подходит для обычной HR-карты и первичной оценки рабочего формата.',
    model: 'gpt-5-mini',
    reasoning_effort: 'medium',
    max_output_tokens: 7000,
    internal_credit_cost: 3,
    pricing: {
      input_usd_per_1m: 0.25,
      output_usd_per_1m: 2.0,
    },
  },
  quality: {
    id: 'quality',
    ui_label: 'Качественная сборка',
    ui_description:
      'Более глубокий и практичный HR-разбор. Лучше подходит для финальной карты кандидата.',
    model: 'gpt-5.4-mini',
    reasoning_effort: 'medium',
    max_output_tokens: 9000,
    internal_credit_cost: 8,
    pricing: {
      input_usd_per_1m: 0.75,
      output_usd_per_1m: 4.5,
    },
  },
  premium: {
    id: 'premium',
    ui_label: 'Максимальная сборка',
    ui_description:
      'Максимальное качество для важных кандидатов и проверки потолка результата.',
    model: 'gpt-5.4',
    reasoning_effort: 'medium',
    max_output_tokens: 12000,
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
