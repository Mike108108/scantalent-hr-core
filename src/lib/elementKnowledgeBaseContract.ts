/**
 * Element Knowledge Base contract v0.1
 *
 * Standalone element meanings come from hd_reference_interpretations.
 * AI must not invent element meanings — only synthesize from provided source context.
 */

export const ELEMENT_KINDS = [
  'type',
  'strategy',
  'authority',
  'profile',
  'definition',
  'defined_center',
  'open_center',
  'channel',
  'gate',
  'planet',
  'line',
  'side',
  'activation_role',
  'activation',
] as const

export type ElementKind = (typeof ELEMENT_KINDS)[number]

export const ELEMENT_UI_GROUPS = {
  global: ['type', 'strategy', 'authority', 'profile', 'definition'],
  centers: ['defined_center', 'open_center'],
  channels: ['channel'],
  gates: ['gate'],
  activations: ['activation'],
  activation_components: ['planet', 'line', 'side', 'activation_role'],
} as const satisfies Record<string, readonly ElementKind[]>

export type ElementUiGroup = keyof typeof ELEMENT_UI_GROUPS

/** Canonical Element Card fields — one card per element in Element Library. */
export type ElementCardFieldKey =
  | 'base_short'
  | 'pro_detailed'
  | 'hints'
  | 'risks'
  | 'management_hints'
  | 'environment_hints'
  | 'limitations'
  | 'context_rules'
  | 'not_self_layers'
  | 'contrast_examples'
  | 'source_quality'

export type ElementCardFieldSpec = {
  key: ElementCardFieldKey
  label: string
  /** Maps to ReferenceInterpretation / hd_reference_interpretations columns. */
  source_paths: string[]
  /** Where the field is rendered in UI. */
  render_in: 'element_library' | 'ai_input_only'
}

export const ELEMENT_CARD_FIELDS: ElementCardFieldSpec[] = [
  {
    key: 'base_short',
    label: 'Base-кратко',
    source_paths: ['hr_translation_markdown', 'base_layers.plain_meaning', 'base_layers.work_manifestation'],
    render_in: 'element_library',
  },
  {
    key: 'pro_detailed',
    label: 'Pro-подробно',
    source_paths: ['pro_markdown', 'classic_markdown', 'pro_layers'],
    render_in: 'element_library',
  },
  {
    key: 'hints',
    label: 'hints',
    source_paths: ['talent_hints', 'base_layers.strengths', 'base_layers.when_it_works_best'],
    render_in: 'element_library',
  },
  {
    key: 'risks',
    label: 'risks',
    source_paths: ['risk_hints', 'base_layers.risks', 'base_layers.when_talent_is_not_revealed'],
    render_in: 'element_library',
  },
  {
    key: 'management_hints',
    label: 'management hints',
    source_paths: ['management_hints'],
    render_in: 'element_library',
  },
  {
    key: 'environment_hints',
    label: 'environment hints',
    source_paths: ['environment_hints'],
    render_in: 'element_library',
  },
  {
    key: 'limitations',
    label: 'limitations',
    source_paths: ['limitations'],
    render_in: 'element_library',
  },
  {
    key: 'context_rules',
    label: 'context rules',
    source_paths: ['context_rules'],
    render_in: 'ai_input_only',
  },
  {
    key: 'not_self_layers',
    label: 'not-self layers',
    source_paths: ['not_self_layers'],
    render_in: 'ai_input_only',
  },
  {
    key: 'contrast_examples',
    label: 'contrast examples',
    source_paths: ['contrast_examples'],
    render_in: 'ai_input_only',
  },
  {
    key: 'source_quality',
    label: 'source quality',
    source_paths: ['source_quality', 'pro_layers.composition_mode', 'pro_layers.source_component_keys'],
    render_in: 'ai_input_only',
  },
]

export const ELEMENT_KNOWLEDGE_BASE_RULES = {
  standalone_meaning_source: 'hd_reference_interpretations',
  ai_must_not_invent_standalone_meanings: true,
  ai_may_only_synthesize_from_provided_context: true,
  element_library_is_canonical_for_pro_descriptions: true,
  hr_layers_must_not_duplicate_full_pro_descriptions: true,
  hr_layers_use_source_chips_to_link_element_cards: true,
} as const

export function isElementKind(value: string): value is ElementKind {
  return (ELEMENT_KINDS as readonly string[]).includes(value)
}

export function elementLinkTarget(kind: string, key: string): string {
  return `element://${kind}/${key}`
}

export function elementDisplayLabel(
  kind: string,
  key: string,
  label: string | null | undefined,
): string {
  if (label?.trim()) {
    return label.trim()
  }

  const kindLabels: Record<string, string> = {
    type: 'Type',
    strategy: 'Strategy',
    authority: 'Authority',
    profile: 'Profile',
    definition: 'Definition',
    defined_center: 'Defined center',
    open_center: 'Open center',
    channel: 'Channel',
    gate: 'Gate',
    activation: 'Activation',
    planet: 'Planet',
    line: 'Line',
    side: 'Side',
    activation_role: 'Activation role',
  }

  const prefix = kindLabels[kind] ?? kind
  return `${prefix} ${key}`
}
