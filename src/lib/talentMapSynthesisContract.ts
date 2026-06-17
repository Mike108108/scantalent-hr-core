import { type ElementKind } from './elementKnowledgeBaseContract'
import {
  TALENT_MAP_SECTION_KEYS,
  type TalentMapSectionKey,
} from './talentMapSections'

/**
 * HR Talent Map section synthesis contract v0.1.
 * Sections synthesize combinations of elements — they do not store canonical element meanings.
 */

export { TALENT_MAP_SECTION_KEYS }
export type { TalentMapSectionKey }

/** @deprecated Use TALENT_MAP_SECTION_KEYS */
export const TALENT_MAP_LAYER_KEYS = TALENT_MAP_SECTION_KEYS

/** @deprecated Use TalentMapSectionKey */
export type TalentMapLayerKey = TalentMapSectionKey

/**
 * Virtual selection kinds — used only in section mapping, selection_reason and
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
  'communication_channel',
  'communication_gate',
  'ajna_center',
  'throat_center',
  'throat_gate',
  'throat_channel',
  'mercury_activation',
  'mars_activation',
  'saturn_activation',
  'moon_activation',
  'jupiter_activation',
  'north_node_activation',
  'south_node_activation',
  'pluto_activation',
  'nodes_activation',
  'personality_sun',
  'design_sun',
  'personality_earth',
  'design_earth',
  'recovery_conditions',
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
  | 'recovery_conditions'

/** Short section link to Element Library — no full interpretation payload. */
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

export type TalentMapSectionSynthesisDefinition = {
  section_key: TalentMapSectionKey
  title: string
  short_description: string
  section_goal: string
  base_output_rules: string[]
  pro_output_rules: string[]
  primary_element_kinds: readonly (ElementKind | string)[]
  supporting_element_kinds: readonly (ElementKind | string)[]
  context_element_kinds?: readonly (ElementKind | string)[]
  excluded_element_kinds?: readonly (ElementKind | string)[]
  interpretation_fields_for_ai: readonly InterpretationFieldKey[]
  omitted_interpretation_fields: readonly InterpretationFieldKey[]
  /** Base-mode output only — Pro output uses allowed_pro_terms instead. */
  forbidden_base_terms: readonly string[]
  /** Pro-mode output may include HD terminology listed here. */
  allowed_pro_terms: readonly string[]
  source_chip_rules: SourceChipRules
  min_matched_source_items: number
  section_guardrails?: readonly string[]
}

/** @deprecated Use TalentMapSectionSynthesisDefinition */
export type TalentMapLayerDefinition = TalentMapSectionSynthesisDefinition

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

/** Base-mode output only — does not restrict Pro-mode section synthesis output. */
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
  'Глубокое техническое Human Design-основание по сочетанию элементов раздела.',
  'Полные Pro-описания элементов остаются в Element Library; в разделе — только synthesis.',
  'Source chips обязательны для каждого ключевого элемента-основания.',
] as const

const RISKS_SECTION_GUARDRAILS = [
  'Не превращать риски в диагнозы или hiring-вердикты.',
  'Описывать условия перегрузки и искажения, а не «проблемность» человека.',
] as const

export const TALENT_MAP_SECTION_DEFINITIONS: TalentMapSectionSynthesisDefinition[] = [
  {
    section_key: 'work_mode_and_entry',
    title: 'Рабочий формат и вход в задачи',
    short_description: 'Как человек естественно включается в работу и какой формат задач ему подходит.',
    section_goal:
      'Синтезировать рабочий формат и способ входа в задачи из type, strategy, profile, definition, authority, центров, каналов и ключевых Sun/Earth активаций.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['type', 'strategy', 'profile', 'definition', 'authority'],
    supporting_element_kinds: [
      'open_center',
      'defined_center',
      'channel',
      'personality_sun',
      'design_sun',
      'personality_earth',
      'design_earth',
    ],
    context_element_kinds: ['limitations', 'related_context_summary', 'management_hints', 'environment_hints'],
    interpretation_fields_for_ai: [
      'base_layers',
      'management_hints',
      'environment_hints',
      'context_rules',
      'related_context_summary',
      'limitations',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples', 'not_self_layers'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 3,
  },
  {
    section_key: 'decision_style',
    title: 'Принятие решений',
    short_description: 'Как лучше принимать рабочие решения и где усиливается давление.',
    section_goal:
      'Синтезировать стиль решений из authority, strategy, центров, profile, definition и релевантных Moon/Mars/Saturn активаций.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['authority', 'strategy', 'defined_center', 'open_center'],
    supporting_element_kinds: [
      'profile',
      'definition',
      'moon_activation',
      'mars_activation',
      'saturn_activation',
      'risk_hints',
      'not_self_layers',
      'limitations',
    ],
    context_element_kinds: ['related_context_summary', 'contrast_examples'],
    interpretation_fields_for_ai: [
      'base_layers',
      'risk_hints',
      'not_self_layers',
      'limitations',
      'context_rules',
      'related_context_summary',
      'contrast_examples',
    ],
    omitted_interpretation_fields: ['pro_layers', 'talent_hints'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    section_key: 'main_talents',
    title: 'Главные таланты',
    short_description: 'Устойчивые сильные стороны и таланты, видимые в рабочем контексте.',
    section_goal:
      'Выделить главные таланты из каналов, центров, Sun/Earth активаций и gates с talent_hints. Канал имеет приоритет над standalone gate.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: [
      'channel',
      'defined_center',
      'personality_sun',
      'design_sun',
      'personality_earth',
      'design_earth',
    ],
    supporting_element_kinds: ['gate', 'talent_hints', 'activation'],
    context_element_kinds: ['related_context_summary', 'limitations'],
    interpretation_fields_for_ai: ['base_layers', 'talent_hints', 'context_rules', 'related_context_summary', 'limitations'],
    omitted_interpretation_fields: ['pro_layers', 'not_self_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    section_key: 'work_environment',
    title: 'Рабочая среда',
    short_description: 'В каких условиях человек раскрывается лучше всего.',
    section_goal:
      'Синтезировать рабочую среду из open/defined centers, definition, strategy, authority и hints — без выдуманных environment/motivation/variables элементов.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['open_center', 'defined_center', 'definition', 'strategy', 'authority'],
    supporting_element_kinds: ['environment_hints', 'management_hints', 'risk_hints', 'channel'],
    context_element_kinds: ['limitations', 'related_context_summary'],
    interpretation_fields_for_ai: [
      'environment_hints',
      'management_hints',
      'base_layers',
      'context_rules',
      'related_context_summary',
      'limitations',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    section_key: 'communication',
    title: 'Коммуникация',
    short_description: 'Как обсуждать задачи, обратную связь и ожидания.',
    section_goal:
      'Собрать коммуникационный профиль из throat/ajna центров, communication channel, Mercury activation и profile.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['throat_center', 'ajna_center', 'communication_channel', 'mercury_activation', 'profile'],
    supporting_element_kinds: [
      'communication_gate',
      'talent_hints',
      'management_hints',
      'environment_hints',
    ],
    context_element_kinds: ['related_context_summary', 'limitations'],
    interpretation_fields_for_ai: [
      'base_layers',
      'talent_hints',
      'environment_hints',
      'management_hints',
      'context_rules',
      'related_context_summary',
      'limitations',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples', 'not_self_layers'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    section_key: 'risks',
    title: 'Риски и чувствительные зоны',
    short_description: 'Где возможны перегрузка, искажения и уязвимости.',
    section_goal:
      'Выявить риски из open centers, risk_hints, not_self, limitations и релевантных Mars/Saturn/Moon активаций.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['open_center', 'risk_hints', 'not_self_layers', 'limitations'],
    supporting_element_kinds: [
      'mars_activation',
      'saturn_activation',
      'moon_activation',
      'channel',
      'contrast_examples',
    ],
    context_element_kinds: ['related_context_summary', 'management_hints', 'recovery_conditions'],
    interpretation_fields_for_ai: [
      'risk_hints',
      'not_self_layers',
      'limitations',
      'contrast_examples',
      'base_layers',
      'context_rules',
      'related_context_summary',
      'recovery_conditions',
    ],
    omitted_interpretation_fields: ['pro_layers', 'talent_hints'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
    section_guardrails: RISKS_SECTION_GUARDRAILS,
  },
  {
    section_key: 'management',
    title: 'Управление кандидатом',
    short_description: 'Как ставить задачи и поддерживать сильные стороны.',
    section_goal:
      'Синтезировать управленческие рекомендации из strategy, authority, profile, management_hints и центров.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: ['strategy', 'authority', 'profile', 'management_hints', 'open_center'],
    supporting_element_kinds: ['defined_center', 'channel', 'environment_hints', 'risk_hints'],
    context_element_kinds: ['related_context_summary', 'limitations'],
    interpretation_fields_for_ai: [
      'management_hints',
      'environment_hints',
      'base_layers',
      'context_rules',
      'related_context_summary',
      'limitations',
    ],
    omitted_interpretation_fields: ['pro_layers', 'contrast_examples'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
  {
    section_key: 'development_potential',
    title: 'Потенциал развития',
    short_description: 'Куда человек может расти через опыт и практику.',
    section_goal:
      'Определить вектор развития из Jupiter/Saturn/Nodes/Pluto активаций, channels, gates с talent_hints и Sun-Earth оси.',
    base_output_rules: [...sharedBaseOutputRules],
    pro_output_rules: [...sharedProOutputRules],
    primary_element_kinds: [
      'jupiter_activation',
      'saturn_activation',
      'north_node_activation',
      'south_node_activation',
      'pluto_activation',
      'channel',
    ],
    supporting_element_kinds: [
      'gate',
      'talent_hints',
      'limitations',
      'personality_sun',
      'design_sun',
      'personality_earth',
      'design_earth',
    ],
    context_element_kinds: ['related_context_summary', 'contrast_examples'],
    interpretation_fields_for_ai: [
      'talent_hints',
      'limitations',
      'base_layers',
      'context_rules',
      'related_context_summary',
      'contrast_examples',
    ],
    omitted_interpretation_fields: ['pro_layers', 'not_self_layers'],
    forbidden_base_terms: BASE_FORBIDDEN_TERMS,
    allowed_pro_terms: PRO_ALLOWED_HD_TERMS,
    source_chip_rules: SOURCE_CHIP_RULES,
    min_matched_source_items: 2,
  },
]

/** @deprecated Use TALENT_MAP_SECTION_DEFINITIONS */
export const TALENT_MAP_LAYER_DEFINITIONS = TALENT_MAP_SECTION_DEFINITIONS

export function getTalentMapSectionDefinition(
  sectionKey: TalentMapSectionKey,
): TalentMapSectionSynthesisDefinition {
  const definition = TALENT_MAP_SECTION_DEFINITIONS.find((section) => section.section_key === sectionKey)
  if (!definition) {
    throw new Error(`Unknown talent map section: ${sectionKey}`)
  }
  return definition
}

/** @deprecated Use getTalentMapSectionDefinition */
export function getTalentMapLayerDefinition(sectionKey: TalentMapSectionKey): TalentMapSectionSynthesisDefinition {
  return getTalentMapSectionDefinition(sectionKey)
}
