import { type ElementKind } from './elementKnowledgeBaseContract'

/**
 * HR Talent Map layer synthesis contract v0.1.
 * Layers synthesize combinations of elements — they do not store canonical element meanings.
 */

export const TALENT_MAP_LAYER_KEYS = [
  'work_style',
  'main_talents',
  'decision_and_stability',
  'communication_and_influence',
  'risks_and_distortions',
  'management_and_environment',
  'development_potential',
  'pro_foundation',
] as const

export type TalentMapLayerKey = (typeof TALENT_MAP_LAYER_KEYS)[number]

/**
 * Virtual selection kinds — used only in layer mapping, selection_reason and
 * interpretation_fields_for_ai. Must never appear as element_kind in source_items or source_chips.
 */
export const VIRTUAL_SELECTION_KINDS = [
  'talent_hints',
  'risk_hints',
  'management_hints',
  'environment_hints',
  'limitations',
  'not_self_layers',
  'contrast_examples',
  'communication_hints',
  'throat_center',
  'throat_gate',
  'throat_channel',
  'mercury_activation',
  'mars_activation',
  'saturn_activation',
  'moon_activation',
  'jupiter_activation',
  'nodes_activation',
  'source_quality',
  'composition_mode',
  'related_context_summary',
  'coverage_summary',
] as const

export type VirtualSelectionKind = (typeof VIRTUAL_SELECTION_KINDS)[number]

export type InterpretationFieldKey =
  | 'base_layers'
  | 'pro_layers'
  | 'talent_hints'
  | 'risk_hints'
  | 'management_hints'
  | 'environment_hints'
  | 'limitations'
  | 'context_rules'
  | 'not_self_layers'
  | 'contrast_examples'
  | 'source_quality'
  | 'related_context_summary'
  | 'composition_meta'

/** Short layer link to Element Library — no full interpretation payload. */
export type SourceChip = {
  element_kind: ElementKind
  element_key: string
  element_label: string
  role_in_layer: string
  reason_used: string
  link_target: string
}

export type SourceChipRules = {
  must_not_include_full_pro_description: true
  must_explain_role_in_layer_only: true
  must_link_to_element_card: true
  link_target_format: 'element://{element_kind}/{element_key}'
}

export const SOURCE_CHIP_RULES: SourceChipRules = {
  must_not_include_full_pro_description: true,
  must_explain_role_in_layer_only: true,
  must_link_to_element_card: true,
  link_target_format: 'element://{element_kind}/{element_key}',
}

export type TalentMapLayerDefinition = {
  layer_key: TalentMapLayerKey
  title: string
  short_description: string
  layer_goal: string
  base_output_rules: string[]
  pro_output_rules: string[]
  primary_element_kinds: readonly (ElementKind | string)[]
  supporting_element_kinds: readonly (ElementKind | string)[]
  excluded_element_kinds?: readonly (ElementKind | string)[]
  interpretation_fields_for_ai: readonly InterpretationFieldKey[]
  omitted_interpretation_fields: readonly InterpretationFieldKey[]
  /** Base-mode output only — Pro output uses allowed_pro_terms instead. */
  forbidden_base_terms: readonly string[]
  /** Pro-mode output may include HD terminology listed here. */
  allowed_pro_terms: readonly string[]
  source_chip_rules: SourceChipRules
  min_matched_source_items: number
}

export const GLOBAL_FORBIDDEN_FIELDS = [
  'fit_score',
  'fit_percent',
  'fit_percentage',
  'match_score',
  'match_percentage',
  'role_fit',
  'vacancy_fit',
  'vacancy_id',
  'hiring_recommendation',
  'hire_decision',
  'recommendation_to_hire',
] as const

export const GLOBAL_FORBIDDEN_PHRASES = [
  'подходит на',
  'соответствует на',
  'брать',
  'не брать',
  'нанять',
  'не нанимать',
  'рекомендуем нанять',
  'не рекомендуем нанимать',
  'идеально подходит на роль',
] as const

/** Base-mode output only — does not restrict Pro-mode layer synthesis output. */
export const BASE_FORBIDDEN_TERMS = [
  'Human Design',
  'бодиграф',
  'ворота',
  'канал',
  'центр',
  'активация',
  'авторитет',
  'стратегия',
  'профиль',
  'not-self',
  'сакрал',
  'селезёнка',
  'горло',
  'аджна',
  'корень',
  'personality',
  'design',
] as const

/** Pro-mode output may use these HD terms; Base-mode must avoid BASE_FORBIDDEN_TERMS instead. */
export const PRO_ALLOWED_HD_TERMS = [
  'Human Design',
  'бодиграф',
  'gate',
  'channel',
  'center',
  'authority',
  'strategy',
  'profile',
  'activation',
  'planet',
  'line',
  'ворота',
  'канал',
  'центр',
  'активация',
  'авторитет',
  'стратегия',
  'профиль',
  'not-self',
  'сакрал',
  'селезёнка',
  'горло',
  'аджна',
  'корень',
  'personality',
  'design',
] as const

export type GlobalGuardrails = {
  forbidden_fields: readonly string[]
  forbidden_phrases: readonly string[]
  base_forbidden_terms: readonly string[]
  pro_allowed_hd_terms: readonly string[]
  ai_must_not_invent_element_meanings: true
  synthesis_only_from_provided_source: true
}

export const GLOBAL_GUARDRAILS: GlobalGuardrails = {
  forbidden_fields: GLOBAL_FORBIDDEN_FIELDS,
  forbidden_phrases: GLOBAL_FORBIDDEN_PHRASES,
  base_forbidden_terms: BASE_FORBIDDEN_TERMS,
  pro_allowed_hd_terms: PRO_ALLOWED_HD_TERMS,
  ai_must_not_invent_element_meanings: true,
  synthesis_only_from_provided_source: true,
}

const sharedBaseOutputRules = [
  'Коротко, прикладно, только польза для HR.',
  'Без Human Design терминов и без дублирования полных Pro-описаний элементов.',
  'Использовать source chips для ссылок на Element Library.',
  'Не давать hiring-рекомендаций, процентов соответствия и role-fit.',
] as const

const sharedProOutputRules = [
  'Глубокое техническое Human Design-основание по сочетанию элементов слоя.',
  'Полные Pro-описания элементов остаются в Element Library; в слое — только synthesis.',
  'Source chips обязательны для каждого ключевого элемента-основания.',
] as const

export const TALENT_MAP_LAYER_DEFINITIONS: TalentMapLayerDefinition[] = [
  {
    layer_key: 'work_style',
    title: 'Рабочий стиль',
    short_description: 'Как человек входит в работу, действует и удерживает рабочий ритм.',
    layer_goal: 'Синтезировать прикладной рабочий стиль из глобальных механик, центров, каналов и релевантных активаций.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['type', 'strategy', 'profile', 'definition'],
    supporting_element_kinds: ['authority', 'defined_center', 'open_center', 'channel', 'activation'],
    interpretation_fields_for_ai: [
      'base_layers',
      'management_hints',
      'environment_hints',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples', 'not_self_layers'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 3,
  },
  {
    layer_key: 'main_talents',
    title: 'Сильные стороны / таланты',
    short_description: 'Устойчивые сильные стороны и таланты, видимые в рабочем контексте.',
    layer_goal: 'Выделить главные таланты из каналов, центров, ворот и активаций с опорой на talent_hints.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['channel', 'defined_center', 'gate', 'activation'],
    supporting_element_kinds: ['talent_hints'],
    interpretation_fields_for_ai: ['base_layers', 'talent_hints', 'context_rules', 'related_context_summary'],
    omitted_interpretation_fields: ['pro_layers', 'not_self_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'decision_and_stability',
    title: 'Принятие решений и рабочая устойчивость',
    short_description: 'Как человек принимает решения и сохраняет устойчивость под нагрузкой.',
    layer_goal: 'Синтезировать стиль решений и устойчивость из authority, strategy, центров и risk/not-self сигналов.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['authority', 'strategy'],
    supporting_element_kinds: ['defined_center', 'open_center', 'activation', 'risk_hints', 'not_self_layers'],
    interpretation_fields_for_ai: [
      'base_layers',
      'risk_hints',
      'not_self_layers',
      'limitations',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'talent_hints', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'communication_and_influence',
    title: 'Коммуникация и влияние',
    short_description: 'Как человек доносит мысли, влияет и взаимодействует в команде.',
    layer_goal: 'Собрать коммуникационный профиль из throat-связанных элементов, Mercury-активаций и profile.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['profile'],
    supporting_element_kinds: [
      'throat_center',
      'throat_gate',
      'throat_channel',
      'mercury_activation',
      'communication_hints',
    ],
    interpretation_fields_for_ai: [
      'base_layers',
      'talent_hints',
      'environment_hints',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples', 'not_self_layers'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'risks_and_distortions',
    title: 'Риски и условия искажения',
    short_description: 'Где талант искажается и при каких условиях растут рабочие риски.',
    layer_goal: 'Выявить риски из open centers, not-self, limitations и релевантных Mars/Saturn/Moon активаций.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['open_center', 'not_self_layers', 'risk_hints', 'limitations'],
    supporting_element_kinds: ['mars_activation', 'saturn_activation', 'moon_activation', 'contrast_examples'],
    interpretation_fields_for_ai: [
      'risk_hints',
      'not_self_layers',
      'limitations',
      'contrast_examples',
      'base_layers',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'talent_hints'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'management_and_environment',
    title: 'Управление и среда',
    short_description: 'Как управлять человеком и какая среда раскрывает продуктивность.',
    layer_goal: 'Синтезировать management/environment рекомендации из strategy, authority, profile, hints и центров.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['strategy', 'authority', 'profile'],
    supporting_element_kinds: [
      'management_hints',
      'environment_hints',
      'defined_center',
      'open_center',
      'channel',
    ],
    interpretation_fields_for_ai: [
      'management_hints',
      'environment_hints',
      'base_layers',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'development_potential',
    title: 'Потенциал развития',
    short_description: 'Куда расти и что развивать для раскрытия таланта.',
    layer_goal: 'Определить вектор развития из channels, gates, Jupiter/Saturn/Nodes активаций, talent_hints и limitations.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['channel', 'gate'],
    supporting_element_kinds: [
      'jupiter_activation',
      'saturn_activation',
      'nodes_activation',
      'talent_hints',
      'limitations',
    ],
    interpretation_fields_for_ai: [
      'talent_hints',
      'limitations',
      'base_layers',
      'context_rules',
      'related_context_summary',
    ],
    omitted_interpretation_fields: ['pro_layers', 'not_self_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    layer_key: 'pro_foundation',
    title: 'Pro-основание / источники карты',
    short_description: 'Техническое основание карты и сводка источников для Pro-режима.',
    layer_goal: 'Дать полную карту источников: major groups, source_quality, composition_mode, coverage и context.',
    base_output_rules: [
      'Не использовать в Base-режиме; слой предназначен для Pro foundation.',
      'Показать структуру источников без hiring-выводов.',
    ],
    pro_output_rules: [
      'Полное техническое основание по всем major source groups.',
      'Включать source_quality, composition_mode и coverage summary.',
      'Не дублировать Element Library целиком — ссылаться через source chips.',
    ],
    primary_element_kinds: [
      'type',
      'strategy',
      'authority',
      'profile',
      'definition',
      'defined_center',
      'open_center',
      'channel',
      'gate',
      'activation',
    ],
    supporting_element_kinds: ['source_quality', 'composition_mode', 'related_context_summary', 'coverage_summary'],
    excluded_element_kinds: ['planet', 'line', 'side', 'activation_role'],
    interpretation_fields_for_ai: [
      'base_layers',
      'pro_layers',
      'context_rules',
      'source_quality',
      'composition_meta',
      'related_context_summary',
    ],
    omitted_interpretation_fields: [],
    forbidden_base_terms: [],
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 5,
  },
]

export function getTalentMapLayerDefinition(layerKey: TalentMapLayerKey): TalentMapLayerDefinition {
  const definition = TALENT_MAP_LAYER_DEFINITIONS.find((layer) => layer.layer_key === layerKey)
  if (!definition) {
    throw new Error(`Unknown talent map layer: ${layerKey}`)
  }
  return definition
}
