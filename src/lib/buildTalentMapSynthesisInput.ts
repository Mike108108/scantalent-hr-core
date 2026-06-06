import {
  elementDisplayLabel,
  elementLinkTarget,
  isElementKind,
  type ElementKind,
} from './elementKnowledgeBaseContract'
import {
  GLOBAL_GUARDRAILS,
  TALENT_MAP_LAYER_DEFINITIONS,
  type GlobalGuardrails,
  type InterpretationFieldKey,
  type SourceChip,
  type TalentMapLayerDefinition,
  type TalentMapLayerKey,
} from './talentMapSynthesisContract'
import type {
  ReferenceBundleCoverage,
  ReferenceBundleItem,
  ReferenceInterpretation,
  SourceInterpretationBundle,
} from './types'

const THROAT_CENTER_KEY = 'throat'
const AJNA_CENTER_KEY = 'ajna'
const COMMUNICATION_CHANNEL_KEYS = new Set(['11-56', '11_56'])
const COMMUNICATION_GATES = new Set(['11', '56', '12', '8'])

const PLANET_FILTERS = {
  communication: new Set(['mercury']),
  risks: new Set(['mars', 'saturn', 'moon']),
  development: new Set(['jupiter', 'saturn', 'north_node', 'south_node']),
} as const

const MAJOR_SOURCE_KINDS = new Set<ElementKind | string>([
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
])

export type SourceItemRole = 'primary' | 'supporting' | 'context_only'

export type LayerSourceItem = {
  /** Always a real chart/reference element kind — never a virtual selection kind. */
  element_kind: ElementKind
  element_key: string
  element_label: string | null
  matched: boolean
  source_role: SourceItemRole
  /** May reference virtual selection kinds, e.g. primary:talent_hints. */
  selection_reason: string
  selected_interpretation_fields: Partial<Record<InterpretationFieldKey, unknown>>
}

export type LayerGuardrails = {
  forbidden_fields: readonly string[]
  forbidden_phrases: readonly string[]
  /** Base-mode output only. */
  forbidden_base_terms: readonly string[]
  /** Pro-mode output may use these HD terms. */
  allowed_pro_terms: readonly string[]
}

export type LayerSynthesisPreview = {
  layer_key: TalentMapLayerKey
  layer_title: string
  source_items: LayerSourceItem[]
  source_chips: SourceChip[]
  selected_fields_for_ai: InterpretationFieldKey[]
  omitted_fields: InterpretationFieldKey[]
  guardrails: LayerGuardrails
  element_kinds_present: ElementKind[]
  warnings: string[]
}

export type TalentMapSynthesisInputPreview = {
  candidate_id: string
  chart_id: string
  source_coverage: ReferenceBundleCoverage | null
  layers: LayerSynthesisPreview[]
  global_guardrails: GlobalGuardrails
  warnings: string[]
}

type SelectionEntry = {
  item: ReferenceBundleItem
  reason: string
  role: SourceItemRole
}

type SelectionResult = {
  items: SelectionEntry[]
}

const ROLE_PRIORITY: Record<SourceItemRole, number> = {
  primary: 3,
  supporting: 2,
  context_only: 1,
}

const ACTIVATION_PLANET_ROLES: Record<string, string> = {
  sun: 'задаёт центральную тему',
  earth: 'даёт опору и заземление',
  mercury: 'определяет стиль коммуникации и передачи',
  mars: 'показывает тему обучения, напряжения и зрелости',
  jupiter: 'раскрывает вектор роста, правил и масштаба',
  saturn: 'задаёт дисциплину, границы и ответственность',
  north_node: 'указывает направление и фон развития',
  south_node: 'указывает направление и фон развития',
  venus: 'отражает ценности и принципы',
  moon: 'задаёт внутренний драйв',
  uranus: 'подчёркивает уникальность и мутацию',
  neptune: 'добавляет скрытую и тонкую тему',
  pluto: 'раскрывает глубину трансформации',
}

function getMetadataGates(metadata: Record<string, unknown>): string[] {
  const gates = metadata.gates
  if (!Array.isArray(gates)) {
    return []
  }

  return gates.filter((gate): gate is string => typeof gate === 'string' && gate.trim().length > 0)
}

function normalizePlanet(planet: string | null | undefined): string | null {
  if (!planet) {
    return null
  }

  return planet.trim().toLowerCase().replace(/\s+/g, '_')
}

function resolveActivationPlanet(item: ReferenceBundleItem): string | null {
  return normalizePlanet(item.element.planet) ?? normalizePlanet(item.element.element_key.split(':')[0])
}

function activationMatchesPlanets(item: ReferenceBundleItem, planets: Set<string>): boolean {
  if (item.element.element_kind !== 'activation') {
    return false
  }

  const planet = normalizePlanet(item.element.planet)
  if (planet && planets.has(planet)) {
    return true
  }

  const keyPlanet = normalizePlanet(item.element.element_key.split(':')[0])
  return keyPlanet !== null && planets.has(keyPlanet)
}

function buildGateCenterMap(items: ReferenceBundleItem[]): Map<string, string> {
  const map = new Map<string, string>()

  for (const item of items) {
    if (item.element.element_kind !== 'gate') {
      continue
    }

    const gateKey = item.element.gate ?? item.element.element_key
    if (item.element.center) {
      map.set(gateKey, item.element.center)
    }
  }

  return map
}

function isThroatCenterElement(item: ReferenceBundleItem): boolean {
  const element = item.element
  if (element.element_kind !== 'defined_center' && element.element_kind !== 'open_center') {
    return false
  }

  return element.center === THROAT_CENTER_KEY || element.element_key === THROAT_CENTER_KEY
}

function isThroatGateElement(item: ReferenceBundleItem): boolean {
  return item.element.element_kind === 'gate' && item.element.center === THROAT_CENTER_KEY
}

function isAjnaDefinedCenter(item: ReferenceBundleItem): boolean {
  const element = item.element
  return (
    element.element_kind === 'defined_center' &&
    (element.center === AJNA_CENTER_KEY || element.element_key === AJNA_CENTER_KEY)
  )
}

function isCommunicationChannel(item: ReferenceBundleItem): boolean {
  if (item.element.element_kind !== 'channel') {
    return false
  }

  const key = item.element.element_key.trim().toLowerCase()
  if (COMMUNICATION_CHANNEL_KEYS.has(key)) {
    return true
  }

  const gateKeys = getMetadataGates(item.element.metadata_json)
  return gateKeys.includes('11') && gateKeys.includes('56')
}

function isCommunicationGate(item: ReferenceBundleItem): boolean {
  if (item.element.element_kind !== 'gate') {
    return false
  }

  const gateKey = item.element.gate ?? item.element.element_key
  return COMMUNICATION_GATES.has(gateKey)
}

function isThroatChannelElement(item: ReferenceBundleItem, gateCenterMap: Map<string, string>): boolean {
  if (item.element.element_kind !== 'channel') {
    return false
  }

  const gateKeys = getMetadataGates(item.element.metadata_json)
  return gateKeys.some((gateKey) => gateCenterMap.get(gateKey) === THROAT_CENTER_KEY)
}

function hasKind(items: ReferenceBundleItem[], kind: string): ReferenceBundleItem[] {
  return items.filter((item) => item.element.element_kind === kind)
}

function hasVirtualKind(
  items: ReferenceBundleItem[],
  virtualKind: string,
  gateCenterMap: Map<string, string>,
): ReferenceBundleItem[] {
  switch (virtualKind) {
    case 'talent_hints':
      return items.filter((item) => (item.interpretation?.talent_hints.length ?? 0) > 0)
    case 'risk_hints':
      return items.filter((item) => (item.interpretation?.risk_hints.length ?? 0) > 0)
    case 'management_hints':
      return items.filter((item) => (item.interpretation?.management_hints.length ?? 0) > 0)
    case 'environment_hints':
      return items.filter((item) => (item.interpretation?.environment_hints.length ?? 0) > 0)
    case 'not_self_layers':
      return items.filter((item) => Object.keys(item.interpretation?.not_self_layers ?? {}).length > 0)
    case 'limitations':
      return items.filter((item) => (item.interpretation?.limitations.length ?? 0) > 0)
    case 'contrast_examples':
      return items.filter((item) => (item.interpretation?.contrast_examples.length ?? 0) > 0)
    case 'communication_hints':
      return items.filter(
        (item) =>
          (item.interpretation?.talent_hints.length ?? 0) > 0 ||
          (item.interpretation?.environment_hints.length ?? 0) > 0,
      )
    case 'communication_channel':
      return items.filter(isCommunicationChannel)
    case 'communication_gate':
      return items.filter(isCommunicationGate)
    case 'ajna_center':
      return items.filter(isAjnaDefinedCenter)
    case 'throat_center':
      return items.filter(isThroatCenterElement)
    case 'throat_gate':
      return items.filter(isThroatGateElement)
    case 'throat_channel':
      return items.filter((item) => isThroatChannelElement(item, gateCenterMap))
    case 'mercury_activation':
      return items.filter((item) => activationMatchesPlanets(item, PLANET_FILTERS.communication))
    case 'mars_activation':
      return items.filter((item) => activationMatchesPlanets(item, PLANET_FILTERS.risks))
    case 'saturn_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['saturn'])))
    case 'moon_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['moon'])))
    case 'jupiter_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['jupiter'])))
    case 'nodes_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['north_node', 'south_node'])))
    case 'source_quality':
      return items.filter((item) => Boolean(item.interpretation?.source_quality))
    case 'composition_mode':
      return items.filter((item) => Boolean(item.interpretation?.pro_layers.composition_mode))
    case 'related_context_summary':
      return items.filter((item) => item.related_context_elements.length > 0)
    case 'coverage_summary':
      return items
    default:
      return hasKind(items, virtualKind)
  }
}

function itemKey(item: ReferenceBundleItem): string {
  return `${item.element.element_kind}::${item.element.element_key}`
}

function mergeSelectionEntries(entries: SelectionEntry[]): SelectionEntry[] {
  const byKey = new Map<string, SelectionEntry>()

  for (const entry of entries) {
    const key = itemKey(entry.item)
    const existing = byKey.get(key)
    if (!existing || ROLE_PRIORITY[entry.role] > ROLE_PRIORITY[existing.role]) {
      byKey.set(key, entry)
    }
  }

  return [...byKey.values()]
}

function buildBundleItemMap(bundleItems: ReferenceBundleItem[]): Map<string, ReferenceBundleItem> {
  const map = new Map<string, ReferenceBundleItem>()
  for (const item of bundleItems) {
    map.set(itemKey(item), item)
  }
  return map
}

function appendContextOnlyItems(
  layer: TalentMapLayerDefinition,
  selected: SelectionEntry[],
  bundleItemMap: Map<string, ReferenceBundleItem>,
): SelectionEntry[] {
  if (layer.layer_key === 'pro_foundation') {
    return selected
  }

  const contextEntries: SelectionEntry[] = [...selected]
  const majorKeys = new Set(selected.map((entry) => itemKey(entry.item)))

  for (const entry of selected) {
    if (entry.role === 'context_only') {
      continue
    }

    for (const related of entry.item.related_context_elements) {
      if (!isElementKind(related.element_kind)) {
        continue
      }

      const relatedKey = `${related.element_kind}::${related.element_key}`
      if (majorKeys.has(relatedKey)) {
        continue
      }

      const bundleItem = bundleItemMap.get(relatedKey)
      if (!bundleItem) {
        continue
      }

      majorKeys.add(relatedKey)
      contextEntries.push({
        item: bundleItem,
        reason: `context:${related.relation}`,
        role: 'context_only',
      })
    }
  }

  return mergeSelectionEntries(contextEntries)
}

function selectLayerItems(
  layer: TalentMapLayerDefinition,
  bundleItems: ReferenceBundleItem[],
  gateCenterMap: Map<string, string>,
  bundleItemMap: Map<string, ReferenceBundleItem>,
): SelectionResult {
  const selected: SelectionEntry[] = []

  for (const kind of layer.primary_element_kinds) {
    for (const item of hasVirtualKind(bundleItems, kind, gateCenterMap)) {
      selected.push({ item, reason: `primary:${kind}`, role: 'primary' })
    }
  }

  for (const kind of layer.supporting_element_kinds) {
    for (const item of hasVirtualKind(bundleItems, kind, gateCenterMap)) {
      selected.push({ item, reason: `supporting:${kind}`, role: 'supporting' })
    }
  }

  let uniqueSelected = mergeSelectionEntries(selected)

  if (layer.excluded_element_kinds?.length) {
    const excluded = new Set(layer.excluded_element_kinds)
    uniqueSelected = uniqueSelected.filter((entry) => !excluded.has(entry.item.element.element_kind))
  }

  uniqueSelected = appendContextOnlyItems(layer, uniqueSelected, bundleItemMap)

  if (layer.layer_key === 'risks_and_distortions') {
    uniqueSelected = uniqueSelected.filter((entry) => {
      const { item } = entry
      const kind = item.element.element_kind
      if (kind === 'open_center') {
        return true
      }
      if (
        (item.interpretation?.risk_hints.length ?? 0) > 0 ||
        Object.keys(item.interpretation?.not_self_layers ?? {}).length > 0 ||
        (item.interpretation?.limitations.length ?? 0) > 0 ||
        (item.interpretation?.contrast_examples.length ?? 0) > 0
      ) {
        return true
      }
      return activationMatchesPlanets(item, PLANET_FILTERS.risks)
    })
  }

  if (layer.layer_key === 'development_potential') {
    uniqueSelected = uniqueSelected.filter((entry) => {
      const { item } = entry
      const kind = item.element.element_kind
      if (kind === 'channel' || kind === 'gate') {
        return true
      }
      if (
        (item.interpretation?.talent_hints.length ?? 0) > 0 ||
        (item.interpretation?.limitations.length ?? 0) > 0
      ) {
        return true
      }
      return activationMatchesPlanets(item, PLANET_FILTERS.development)
    })
  }

  if (layer.layer_key === 'pro_foundation') {
    uniqueSelected = uniqueSelected.filter(
      (entry) => entry.role === 'context_only' || MAJOR_SOURCE_KINDS.has(entry.item.element.element_kind),
    )
  } else {
    uniqueSelected = uniqueSelected.filter((entry) => {
      if (entry.role !== 'context_only') {
        return true
      }
      return isElementKind(entry.item.element.element_kind)
    })
  }

  return { items: uniqueSelected }
}

function interpretationFieldsForRole(
  role: SourceItemRole,
  layer: TalentMapLayerDefinition,
): readonly InterpretationFieldKey[] {
  if (role === 'context_only') {
    return ['related_context_summary']
  }

  return layer.interpretation_fields_for_ai
}

function pickInterpretationFields(
  interpretation: ReferenceInterpretation | null,
  relatedContextCount: number,
  fields: readonly InterpretationFieldKey[],
): Partial<Record<InterpretationFieldKey, unknown>> {
  if (!interpretation) {
    return {}
  }

  const selected: Partial<Record<InterpretationFieldKey, unknown>> = {}

  for (const field of fields) {
    switch (field) {
      case 'base_layers':
        selected.base_layers = interpretation.base_layers
        break
      case 'pro_layers':
        selected.pro_layers = interpretation.pro_layers
        break
      case 'talent_hints':
        selected.talent_hints = interpretation.talent_hints
        break
      case 'risk_hints':
        selected.risk_hints = interpretation.risk_hints
        break
      case 'management_hints':
        selected.management_hints = interpretation.management_hints
        break
      case 'environment_hints':
        selected.environment_hints = interpretation.environment_hints
        break
      case 'limitations':
        selected.limitations = interpretation.limitations
        break
      case 'context_rules':
        selected.context_rules = interpretation.context_rules
        break
      case 'not_self_layers':
        selected.not_self_layers = interpretation.not_self_layers
        break
      case 'contrast_examples':
        selected.contrast_examples = interpretation.contrast_examples
        break
      case 'source_quality':
        selected.source_quality = interpretation.source_quality
        break
      case 'composition_meta':
        selected.composition_meta = {
          composition_mode: interpretation.pro_layers.composition_mode ?? null,
          composition_components: interpretation.pro_layers.composition_components ?? null,
          source_component_keys: interpretation.pro_layers.source_component_keys ?? null,
        }
        break
      case 'related_context_summary':
        if (relatedContextCount > 0) {
          selected.related_context_summary = { related_context_count: relatedContextCount }
        }
        break
      default:
        break
    }
  }

  return selected
}

function activationRoleInLayer(item: ReferenceBundleItem, layer: TalentMapLayerDefinition): string {
  const planet = resolveActivationPlanet(item)
  const baseRole = ACTIVATION_PLANET_ROLES[planet ?? ''] ?? 'уточняет персональную активацию темы'
  return `${baseRole} в слое «${layer.title}»`
}

function layerRoleText(
  layer: TalentMapLayerDefinition,
  entry: SelectionEntry,
): string {
  if (entry.item.element.element_kind === 'activation') {
    return activationRoleInLayer(entry.item, layer)
  }

  const [, kind] = entry.reason.split(':')

  const roleByKind: Record<string, string> = {
    type: 'задаёт базовый рабочий тип поведения',
    strategy: 'определяет естественный способ входа в работу',
    authority: 'задаёт механику принятия решений',
    profile: 'влияет на стиль взаимодействия и роли',
    definition: 'задаёт общую связность энергетической картины',
    defined_center: 'показывает устойчивую рабочую опору',
    open_center: 'указывает зону уязвимости и условий искажения',
    channel: 'раскрывает устойчивую тематику таланта',
    gate: 'добавляет конкретную тему проявления',
    activation: 'уточняет персональную активацию темы',
    talent_hints: 'даёт прямые HR-подсказки по таланту',
    risk_hints: 'подсвечивает риски и условия искажения',
    management_hints: 'даёт управленческие подсказки',
    environment_hints: 'описывает подходящую рабочую среду',
    not_self_layers: 'описывает not-self сигналы',
    limitations: 'фиксирует ограничения интерпретации',
    contrast_examples: 'показывает контрастные условия чтения',
    throat_center: 'связан с центром коммуникации',
    throat_gate: 'связан с темой выражения через горло',
    throat_channel: 'связан с каналом коммуникации',
    communication_channel: 'задаёт устойчивую тему коммуникации и влияния',
    communication_gate: 'добавляет коммуникационную тему выражения',
    ajna_center: 'даёт ментальную опору для формулировки и влияния',
    mercury_activation: 'уточняет стиль передачи и коммуникации',
    mars_activation: 'уточняет тему напряжения и обучения',
    saturn_activation: 'уточняет тему дисциплины и границ',
    moon_activation: 'уточняет эмоциональный драйв',
    jupiter_activation: 'уточняет вектор роста и расширения',
    nodes_activation: 'уточняет направление развития',
    source_quality: 'фиксирует качество источника',
    composition_mode: 'описывает режим композиции активации',
    related_context_summary: 'даёт связанный контекст карты',
    coverage_summary: 'участвует в сводке покрытия источников',
    communication_hints: 'даёт коммуникационные подсказки',
    context: 'даёт связанный контекст для интерпретации слоя',
  }

  if (entry.role === 'context_only') {
    return roleByKind.context
  }

  return roleByKind[kind] ?? `участвует как источник слоя ${layer.title}`
}

function buildSourceChip(
  layer: TalentMapLayerDefinition,
  entry: SelectionEntry,
): SourceChip | null {
  if (entry.role === 'context_only') {
    return null
  }

  const { element } = entry.item
  if (!isElementKind(element.element_kind)) {
    return null
  }

  const label = elementDisplayLabel(element.element_kind, element.element_key, element.element_label)

  return {
    element_kind: element.element_kind,
    element_key: element.element_key,
    element_label: label,
    role_in_layer: layerRoleText(layer, entry),
    reason_used: `используется как ${entry.role} источник слоя ${layer.layer_key}`,
    link_target: elementLinkTarget(element.element_kind, element.element_key),
  }
}

function buildLayerGuardrails(layer: TalentMapLayerDefinition): LayerGuardrails {
  return {
    forbidden_fields: GLOBAL_GUARDRAILS.forbidden_fields,
    forbidden_phrases: GLOBAL_GUARDRAILS.forbidden_phrases,
    forbidden_base_terms: layer.forbidden_base_terms,
    allowed_pro_terms: layer.allowed_pro_terms,
  }
}

function buildLayerPreview(
  layer: TalentMapLayerDefinition,
  bundleItems: ReferenceBundleItem[],
  gateCenterMap: Map<string, string>,
  bundleItemMap: Map<string, ReferenceBundleItem>,
): LayerSynthesisPreview {
  const selection = selectLayerItems(layer, bundleItems, gateCenterMap, bundleItemMap)
  const majorItems = selection.items.filter((entry) => entry.role !== 'context_only')
  const matchedMajorItems = majorItems.filter((entry) => entry.item.matched)

  const sourceItems: LayerSourceItem[] = selection.items.flatMap((entry) => {
    const kind = entry.item.element.element_kind
    if (!isElementKind(kind)) {
      return []
    }

    return [
      {
        element_kind: kind,
        element_key: entry.item.element.element_key,
        element_label: entry.item.element.element_label,
        matched: entry.item.matched,
        source_role: entry.role,
        selection_reason: entry.reason,
        selected_interpretation_fields: pickInterpretationFields(
          entry.item.interpretation,
          entry.item.related_context_elements.length,
          interpretationFieldsForRole(entry.role, layer),
        ),
      },
    ]
  })

  const sourceChips = matchedMajorItems
    .map((entry) => buildSourceChip(layer, entry))
    .filter((chip): chip is SourceChip => chip !== null)
  const elementKindsPresent = [
    ...new Set(sourceItems.map((item) => item.element_kind)),
  ].sort()

  const warnings: string[] = []
  if (matchedMajorItems.length < layer.min_matched_source_items) {
    warnings.push(
      `Слой ${layer.layer_key} получил ${matchedMajorItems.length} matched primary/supporting source_items (минимум ${layer.min_matched_source_items}).`,
    )
  }

  const unmatchedMajorCount = majorItems.length - matchedMajorItems.length
  if (unmatchedMajorCount > 0) {
    warnings.push(
      `Слой ${layer.layer_key}: ${unmatchedMajorCount} primary/supporting элементов без расшифровки.`,
    )
  }

  return {
    layer_key: layer.layer_key,
    layer_title: layer.title,
    source_items: sourceItems,
    source_chips: sourceChips,
    selected_fields_for_ai: [...layer.interpretation_fields_for_ai],
    omitted_fields: [...layer.omitted_interpretation_fields],
    guardrails: buildLayerGuardrails(layer),
    element_kinds_present: elementKindsPresent,
    warnings,
  }
}

export function buildTalentMapSynthesisInput(params: {
  candidateId: string
  chartId: string
  bundle: SourceInterpretationBundle
  coverage?: ReferenceBundleCoverage | null
}): TalentMapSynthesisInputPreview {
  const gateCenterMap = buildGateCenterMap(params.bundle.items)
  const bundleItemMap = buildBundleItemMap(params.bundle.items)
  const layers = TALENT_MAP_LAYER_DEFINITIONS.map((layer) =>
    buildLayerPreview(layer, params.bundle.items, gateCenterMap, bundleItemMap),
  )

  const warnings = layers.flatMap((layer) => layer.warnings)

  if ((params.coverage?.missing_elements ?? 0) > 0) {
    warnings.push(
      `source_interpretation_bundle: ${params.coverage?.missing_elements} элементов без расшифровки (coverage ${params.coverage?.coverage_percent ?? 0}%).`,
    )
  }

  return {
    candidate_id: params.candidateId,
    chart_id: params.chartId,
    source_coverage: params.coverage ?? null,
    layers,
    global_guardrails: GLOBAL_GUARDRAILS,
    warnings,
  }
}
