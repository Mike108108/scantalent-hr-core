import type { ChartElementRow, ReferenceInterpretationRow } from './buildReferenceBundle'

const PLANET_ALIASES: Record<string, string> = {
  sun: 'sun',
  earth: 'earth',
  moon: 'moon',
  north_node: 'north_node',
  northnode: 'north_node',
  'north node': 'north_node',
  'true node': 'north_node',
  truenode: 'north_node',
  south_node: 'south_node',
  southnode: 'south_node',
  'south node': 'south_node',
  mercury: 'mercury',
  venus: 'venus',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
  pluto: 'pluto',
  'personality sun': 'sun',
  'design sun': 'sun',
}

const SIDE_ALIASES: Record<string, string> = {
  personality: 'personality',
  conscious: 'personality',
  design: 'design',
  unconscious: 'design',
  body: 'design',
}

const VALID_LINES = new Set(['1', '2', '3', '4', '5', '6'])

function normalizeLookupKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_')
}

export function normalizePlanetKey(value: string | null): string | null {
  if (!value) {
    return null
  }

  const normalized = normalizeLookupKey(value)
  return PLANET_ALIASES[normalized] ?? null
}

export function normalizeSideKey(value: string | null): string | null {
  if (!value) {
    return null
  }

  const normalized = normalizeLookupKey(value)
  return SIDE_ALIASES[normalized] ?? null
}

export function normalizeLineKey(value: string | null, elementKey?: string | null): string | null {
  if (value) {
    const trimmed = value.trim()
    if (VALID_LINES.has(trimmed)) {
      return trimmed
    }
  }

  if (!elementKey) {
    return null
  }

  const parts = elementKey.split(':')
  const lastPart = parts[parts.length - 1]?.trim()
  if (lastPart && VALID_LINES.has(lastPart)) {
    return lastPart
  }

  return null
}

export type ActivationComponents = {
  planet: string
  side: string
  gate: string
  line: string
}

export function resolveActivationComponents(element: ChartElementRow): ActivationComponents | null {
  const parts = element.element_key.split(':')
  const planetFromKey = normalizePlanetKey(parts[0] ?? null)
  const sideFromKey = normalizeSideKey(parts[1] ?? null)
  const gateFromKey = parts[2]?.trim() || null
  const lineFromKey = normalizeLineKey(parts[3] ?? null, element.element_key)

  const planet = normalizePlanetKey(element.planet) ?? planetFromKey
  const side = normalizeSideKey(element.side) ?? sideFromKey
  const gate = element.gate?.trim() || gateFromKey
  const line = normalizeLineKey(element.line, element.element_key) ?? lineFromKey

  if (!planet || !side || !gate || !line) {
    return null
  }

  return { planet, side, gate, line }
}

function componentKey(kind: string, key: string): string {
  return `${kind}::${key}`
}

function mergeStringHints(values: (string | null | undefined)[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    if (!value) {
      continue
    }

    const trimmed = value.trim()
    if (!trimmed || seen.has(trimmed)) {
      continue
    }

    seen.add(trimmed)
    result.push(trimmed)
  }

  return result
}

function mergeHintArrays(values: unknown[][]): unknown[] {
  const seen = new Set<string>()
  const result: unknown[] = []

  for (const items of values) {
    for (const item of items) {
      const key = JSON.stringify(item)
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      result.push(item)
    }
  }

  return result.slice(0, 6)
}

function pickLayer(
  rows: ReferenceInterpretationRow[],
  key: string,
  bucket: 'base_layers' | 'pro_layers' | 'not_self_layers',
): string | undefined {
  for (const row of rows) {
    const value = row[bucket]?.[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return undefined
}

function buildComponentKeys(components: ActivationComponents): string[] {
  return [
    `gate/${components.gate}`,
    `line/${components.line}`,
    `planet/${components.planet}`,
    `side/${components.side}`,
    `activation_role/${components.side}_${components.planet}`,
  ]
}

function buildSideLabel(side: string): string {
  return side === 'personality' ? 'сознательная' : 'автоматическая'
}

export function composeActivationInterpretation(
  element: ChartElementRow,
  interpretationMap: Map<string, ReferenceInterpretationRow>,
): { interpretation: ReferenceInterpretationRow | null; missingComponents: string[] } {
  const components = resolveActivationComponents(element)
  if (!components) {
    return { interpretation: null, missingComponents: ['activation key parse failed'] }
  }

  const componentKeys = buildComponentKeys(components)
  const missingComponents: string[] = []

  const gateRef = interpretationMap.get(componentKey('gate', components.gate)) ?? null
  const lineRef = interpretationMap.get(componentKey('line', components.line)) ?? null
  const planetRef = interpretationMap.get(componentKey('planet', components.planet)) ?? null
  const sideRef = interpretationMap.get(componentKey('side', components.side)) ?? null
  const roleRef =
    interpretationMap.get(componentKey('activation_role', `${components.side}_${components.planet}`)) ??
    null

  if (!gateRef) {
    missingComponents.push(`gate/${components.gate}`)
  }
  if (!lineRef) {
    missingComponents.push(`line/${components.line}`)
  }
  if (!planetRef) {
    missingComponents.push(`planet/${components.planet}`)
  }
  if (!sideRef) {
    missingComponents.push(`side/${components.side}`)
  }
  if (!roleRef) {
    missingComponents.push(`activation_role/${components.side}_${components.planet}`)
  }

  if (missingComponents.length > 0) {
    return { interpretation: null, missingComponents }
  }

  const refs = [gateRef, lineRef, planetRef, sideRef, roleRef] as ReferenceInterpretationRow[]
  const sideLabel = buildSideLabel(components.side)
  const roleLabel = roleRef.element_label ?? `${components.side}_${components.planet}`
  const lineLabel = lineRef.element_label ?? `Линия ${components.line}`
  const planetLabel = planetRef.element_label ?? components.planet
  const gateLabel = gateRef.element_label ?? components.gate

  const hrTranslationMarkdown = [
    'Эта тема показывает, как конкретный рабочий талант играет роль в общей карте кандидата. Важны не только навык или склонность, но и позиция: центральная тема, опора, коммуникация, зона взросления или фоновый автоматический паттерн.',
    `${roleLabel} (${sideLabel} сторона) задаёт функцию ${planetLabel.toLowerCase()} в рабочем проявлении.`,
    `${lineLabel} добавляет способ реализации: ${pickLayer(refs, 'plain_meaning', 'base_layers') ?? pickLayer([lineRef], 'work_manifestation', 'base_layers') ?? 'стиль проявления через линию.'}`,
    `Тема ${gateLabel} определяет содержание: ${pickLayer([gateRef], 'plain_meaning', 'base_layers') ?? 'ключевой смысл рабочей темы.'}`,
  ].join('\n\n')

  const proMarkdown = [
    `Composed activation interpretation: gate/${components.gate} + line/${components.line} + planet/${components.planet} + side/${components.side} + activation_role/${components.side}_${components.planet}.`,
    'Direct activation reference row was not found, so the interpretation was assembled from component references.',
    roleRef.pro_markdown ?? '',
    planetRef.pro_markdown ?? '',
    lineRef.pro_markdown ?? '',
    gateRef.pro_markdown ?? '',
  ]
    .filter((part) => part.trim().length > 0)
    .join('\n\n')

  const interpretation: ReferenceInterpretationRow = {
    element_kind: 'activation',
    element_key: element.element_key,
    element_label: element.element_label ?? `Activation ${element.element_key}`,
    classic_markdown: [
      `Activation ${element.element_key}: composed from gate ${components.gate}, line ${components.line}, planet ${components.planet}, side ${components.side}.`,
      roleRef.classic_markdown ?? '',
      gateRef.classic_markdown ?? '',
    ]
      .filter((part) => part.trim().length > 0)
      .join('\n\n'),
    hr_translation_markdown: hrTranslationMarkdown,
    pro_markdown: proMarkdown,
    talent_hints: mergeHintArrays(refs.map((row) => row.talent_hints)),
    risk_hints: mergeHintArrays(refs.map((row) => row.risk_hints)),
    management_hints: mergeHintArrays(refs.map((row) => row.management_hints)),
    environment_hints: mergeHintArrays(refs.map((row) => row.environment_hints)),
    limitations: mergeHintArrays(refs.map((row) => row.limitations)),
    base_layers: {
      plain_meaning: mergeStringHints([
        pickLayer([roleRef], 'plain_meaning', 'base_layers'),
        pickLayer([gateRef], 'plain_meaning', 'base_layers'),
      ]).join(' '),
      work_manifestation: mergeStringHints([
        pickLayer([roleRef], 'work_manifestation', 'base_layers'),
        pickLayer([lineRef], 'work_manifestation', 'base_layers'),
        pickLayer([gateRef], 'work_manifestation', 'base_layers'),
      ]).join(' '),
      strengths: mergeStringHints([
        pickLayer([roleRef], 'strengths', 'base_layers'),
        pickLayer([lineRef], 'strengths', 'base_layers'),
        pickLayer([gateRef], 'strengths', 'base_layers'),
      ]).join(' '),
      risks: mergeStringHints([
        pickLayer([roleRef], 'risks', 'base_layers'),
        pickLayer([lineRef], 'risks', 'base_layers'),
        pickLayer([gateRef], 'risks', 'base_layers'),
      ]).join(' '),
      when_it_works_best: mergeStringHints([
        pickLayer([roleRef], 'when_it_works_best', 'base_layers'),
        pickLayer([lineRef], 'when_it_works_best', 'base_layers'),
        pickLayer([gateRef], 'when_it_works_best', 'base_layers'),
      ]).join(' '),
      when_talent_is_not_revealed: mergeStringHints([
        pickLayer([roleRef], 'when_talent_is_not_revealed', 'base_layers'),
        pickLayer([lineRef], 'when_talent_is_not_revealed', 'base_layers'),
        pickLayer([gateRef], 'when_talent_is_not_revealed', 'base_layers'),
      ]).join(' '),
    },
    pro_layers: {
      hd_meaning: mergeStringHints([
        pickLayer([roleRef], 'hd_meaning', 'pro_layers'),
        pickLayer([planetRef], 'hd_meaning', 'pro_layers'),
        pickLayer([gateRef], 'hd_meaning', 'pro_layers'),
      ]).join(' '),
      mechanics: mergeStringHints([
        pickLayer([roleRef], 'mechanics', 'pro_layers'),
        pickLayer([lineRef], 'mechanics', 'pro_layers'),
        pickLayer([planetRef], 'mechanics', 'pro_layers'),
      ]).join(' '),
      classical_keywords: mergeHintArrays(refs.map((row) => {
        const keywords = row.pro_layers?.classical_keywords
        return Array.isArray(keywords) ? keywords : []
      })),
      source_logic: 'Composed from gate, line, planet, side and activation_role references.',
      pro_not_self: mergeStringHints([
        pickLayer([roleRef], 'pro_not_self', 'pro_layers'),
        pickLayer([planetRef], 'pro_not_self', 'pro_layers'),
        pickLayer([gateRef], 'pro_not_self', 'pro_layers'),
      ]).join(' '),
      composition_components: componentKeys,
      composition_mode: 'activation_composed_v0_1',
    },
    context_rules: {
      primary_context: ['gate', 'line', 'planet', 'side', 'activation_role'],
      secondary_context: ['type', 'strategy', 'authority', 'profile', 'channel', 'center'],
      depends_on:
        'Final reading depends on whole chart context and should not be treated as isolated conclusion.',
      related_element_kinds: [
        'gate',
        'line',
        'planet',
        'side',
        'activation_role',
        'channel',
        'type',
        'strategy',
        'authority',
        'profile',
      ],
      context_note: 'This is a composed draft source layer, not a final HR conclusion.',
      source_component_keys: componentKeys,
    },
    not_self_layers: {
      base: mergeStringHints([
        pickLayer([roleRef], 'base', 'not_self_layers'),
        pickLayer([planetRef], 'base', 'not_self_layers'),
        pickLayer([gateRef], 'base', 'not_self_layers'),
      ]).join(' '),
      pro: mergeStringHints([
        pickLayer([roleRef], 'pro', 'not_self_layers'),
        pickLayer([planetRef], 'pro', 'not_self_layers'),
        pickLayer([gateRef], 'pro', 'not_self_layers'),
      ]).join(' '),
      warning_signals: mergeHintArrays(refs.map((row) => {
        const signals = row.not_self_layers?.warning_signals
        return Array.isArray(signals) ? signals : []
      })),
      recovery_conditions: mergeHintArrays(refs.map((row) => {
        const conditions = row.not_self_layers?.recovery_conditions
        return Array.isArray(conditions) ? conditions : []
      })),
    },
    contrast_examples: mergeHintArrays(refs.map((row) => row.contrast_examples)).slice(0, 2),
    source_quality: 'composed_draft',
  }

  return { interpretation, missingComponents: [] }
}
