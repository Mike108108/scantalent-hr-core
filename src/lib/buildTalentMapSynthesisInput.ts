import {
  elementDisplayLabel,
  elementLinkTarget,
  isElementKind,
  type ElementKind,
} from './elementKnowledgeBaseContract'
import {
  applySectionBudget,
  DIGEST_CHAR_LIMITS,
  SECTION_DIGEST_TOTAL_MAX,
  SECTION_SOURCE_BUDGETS,
  type SectionSourceRole,
} from './talentMapSourceBudget'
import {
  buildChannelGateKeySet,
  computeRankScore,
  type RankedSelectionContext,
} from './talentMapSourceRanking'
import {
  getTalentMapSectionDefinition,
  GLOBAL_GUARDRAILS,
  TALENT_MAP_SECTION_DEFINITIONS,
  type GlobalGuardrails,
  type InterpretationFieldKey,
  type SourceChip,
  type TalentMapSectionKey,
  type TalentMapSectionSynthesisDefinition,
} from './talentMapSynthesisContract'
import { getTalentMapSectionDefinition as getUiSectionDefinition } from './talentMapSections'
import type {
  SectionBudgetSummary,
  SectionGenerationStatus,
  SectionSourceDigest,
} from './talentMapSectionTypes'
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
  development: new Set(['jupiter', 'saturn', 'north_node', 'south_node', 'pluto']),
} as const

const EXCLUDED_SOURCE_KINDS = new Set<string>(['activation_role', 'planet', 'line', 'side'])

export type SourceItemRole = SectionSourceRole

export type SectionSourceItem = {
  element_kind: ElementKind
  element_key: string
  element_label: string | null
  matched: boolean
  source_role: SourceItemRole
  selection_reason: string
  rank_score: number
  rank_reasons: string[]
  selected_interpretation_fields: Partial<Record<InterpretationFieldKey, unknown>>
}

export type SectionGuardrails = {
  forbidden_fields: readonly string[]
  forbidden_phrases: readonly string[]
  forbidden_base_terms: readonly string[]
  allowed_pro_terms: readonly string[]
  section_guardrails: readonly string[]
}

export type SectionInputPreview = {
  section_key: TalentMapSectionKey
  section_title: string
  generation_status: SectionGenerationStatus
  user_status_label: string
  credit_cost: number
  compute_weight: 'small' | 'medium' | 'large'
  source_items: SectionSourceItem[]
  omitted_by_budget: SectionSourceItem[]
  source_digests: SectionSourceDigest[]
  source_chips: SourceChip[]
  budget_summary: SectionBudgetSummary
  selected_fields_for_ai: InterpretationFieldKey[]
  omitted_fields: InterpretationFieldKey[]
  guardrails: SectionGuardrails
  element_kinds_present: ElementKind[]
  warnings: string[]
}

export type TalentMapSynthesisInputPreview = {
  candidate_id: string
  chart_id: string
  source_coverage: ReferenceBundleCoverage | null
  sections: SectionInputPreview[]
  /** @deprecated Use sections */
  layers: SectionInputPreview[]
  global_guardrails: GlobalGuardrails
  warnings: string[]
}

type SelectionEntry = {
  item: ReferenceBundleItem
  reason: string
  role: SourceItemRole
  rank_score: number
  rank_reasons: string[]
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
  pluto: 'раскрывает глубину трансформации',
  venus: 'отражает ценности и принципы',
  moon: 'задаёт внутренний драйв',
  uranus: 'подчёркивает уникальность и мутацию',
  neptune: 'добавляет скрытую и тонкую тему',
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

function resolveActivationSide(item: ReferenceBundleItem): string | null {
  const side = item.element.side ?? item.element.element_key.split(':')[1] ?? null
  return side ? side.trim().toLowerCase() : null
}

function activationMatchesPlanets(item: ReferenceBundleItem, planets: Set<string>): boolean {
  if (item.element.element_kind !== 'activation') {
    return false
  }

  const planet = resolveActivationPlanet(item)
  return planet !== null && planets.has(planet)
}

function activationMatchesSidePlanet(
  item: ReferenceBundleItem,
  side: 'personality' | 'design',
  planet: string,
): boolean {
  if (item.element.element_kind !== 'activation') {
    return false
  }

  const itemSide = resolveActivationSide(item)
  const itemPlanet = resolveActivationPlanet(item)
  return itemSide === side && itemPlanet === planet
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
    case 'recovery_conditions':
      return items.filter((item) => {
        const layers = item.interpretation
        if (!layers) {
          return false
        }
        const recovery =
          layers.pro_layers.recovery_conditions ?? layers.base_layers.recovery_conditions
        if (Array.isArray(recovery)) {
          return recovery.length > 0
        }
        return typeof recovery === 'string' && recovery.trim().length > 0
      })
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
      return items.filter((item) => activationMatchesPlanets(item, new Set(['mars'])))
    case 'saturn_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['saturn'])))
    case 'moon_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['moon'])))
    case 'jupiter_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['jupiter'])))
    case 'north_node_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['north_node'])))
    case 'south_node_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['south_node'])))
    case 'pluto_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['pluto'])))
    case 'nodes_activation':
      return items.filter((item) => activationMatchesPlanets(item, new Set(['north_node', 'south_node'])))
    case 'personality_sun':
      return items.filter((item) => activationMatchesSidePlanet(item, 'personality', 'sun'))
    case 'design_sun':
      return items.filter((item) => activationMatchesSidePlanet(item, 'design', 'sun'))
    case 'personality_earth':
      return items.filter((item) => activationMatchesSidePlanet(item, 'personality', 'earth'))
    case 'design_earth':
      return items.filter((item) => activationMatchesSidePlanet(item, 'design', 'earth'))
    case 'related_context_summary':
      return items.filter((item) => item.related_context_elements.length > 0)
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

function appendRelatedContextItems(
  selected: SelectionEntry[],
  bundleItemMap: Map<string, ReferenceBundleItem>,
): SelectionEntry[] {
  const contextEntries: SelectionEntry[] = [...selected]
  const majorKeys = new Set(selected.map((entry) => itemKey(entry.item)))

  for (const entry of selected) {
    if (entry.role === 'context_only') {
      continue
    }

    for (const related of entry.item.related_context_elements) {
      if (!isElementKind(related.element_kind) || EXCLUDED_SOURCE_KINDS.has(related.element_kind)) {
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
        reason: `context:related_context_elements:${related.relation}`,
        role: 'context_only',
        rank_score: 0,
        rank_reasons: [],
      })
    }
  }

  return mergeSelectionEntries(contextEntries)
}

function selectSectionItems(
  section: TalentMapSectionSynthesisDefinition,
  bundleItems: ReferenceBundleItem[],
  gateCenterMap: Map<string, string>,
  bundleItemMap: Map<string, ReferenceBundleItem>,
): SelectionResult {
  const eligibleItems = bundleItems.filter(
    (item) => !EXCLUDED_SOURCE_KINDS.has(item.element.element_kind),
  )

  const selected: SelectionEntry[] = []

  for (const kind of section.primary_element_kinds) {
    for (const item of hasVirtualKind(eligibleItems, kind, gateCenterMap)) {
      selected.push({ item, reason: `primary:${kind}`, role: 'primary', rank_score: 0, rank_reasons: [] })
    }
  }

  for (const kind of section.supporting_element_kinds) {
    for (const item of hasVirtualKind(eligibleItems, kind, gateCenterMap)) {
      if (kind === 'gate' && section.section_key === 'main_talents') {
        if ((item.interpretation?.talent_hints.length ?? 0) === 0) {
          continue
        }
      }
      if (kind === 'activation' && section.section_key === 'main_talents') {
        if ((item.interpretation?.talent_hints.length ?? 0) === 0) {
          continue
        }
      }
      if (kind === 'gate' && section.section_key === 'development_potential') {
        if ((item.interpretation?.talent_hints.length ?? 0) === 0) {
          continue
        }
      }
      selected.push({ item, reason: `supporting:${kind}`, role: 'supporting', rank_score: 0, rank_reasons: [] })
    }
  }

  for (const kind of section.context_element_kinds ?? []) {
    for (const item of hasVirtualKind(eligibleItems, kind, gateCenterMap)) {
      selected.push({
        item,
        reason: `context:${kind}`,
        role: 'context_only',
        rank_score: 0,
        rank_reasons: [],
      })
    }
  }

  let uniqueSelected = mergeSelectionEntries(selected)

  if (section.excluded_element_kinds?.length) {
    const excluded = new Set(section.excluded_element_kinds)
    uniqueSelected = uniqueSelected.filter((entry) => !excluded.has(entry.item.element.element_kind))
  }

  uniqueSelected = appendRelatedContextItems(uniqueSelected, bundleItemMap)

  if (section.section_key === 'risks') {
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
      if (kind === 'channel') {
        return (item.interpretation?.risk_hints.length ?? 0) > 0
      }
      return activationMatchesPlanets(item, PLANET_FILTERS.risks)
    })
  }

  if (section.section_key === 'development_potential') {
    uniqueSelected = uniqueSelected.filter((entry) => {
      const { item } = entry
      const kind = item.element.element_kind
      if (kind === 'channel') {
        return true
      }
      if (kind === 'gate') {
        return (item.interpretation?.talent_hints.length ?? 0) > 0
      }
      if ((item.interpretation?.limitations.length ?? 0) > 0) {
        return true
      }
      return activationMatchesPlanets(item, PLANET_FILTERS.development)
    })
  }

  uniqueSelected = uniqueSelected.filter((entry) => {
    if (entry.role !== 'context_only') {
      return true
    }
    return isElementKind(entry.item.element.element_kind)
  })

  return { items: uniqueSelected }
}

function rankSectionItems(
  sectionKey: TalentMapSectionKey,
  items: SelectionEntry[],
  channelGateKeys: ReadonlySet<string>,
): SelectionEntry[] {
  const selectedGateKeys = new Set<string>()
  const selectedActivationThemes = new Set<string>()

  for (const entry of items) {
    if (entry.item.element.element_kind === 'gate') {
      selectedGateKeys.add(entry.item.element.gate ?? entry.item.element.element_key)
    }
    if (entry.item.element.element_kind === 'activation') {
      const planet = resolveActivationPlanet(entry.item)
      const gate = entry.item.element.gate ?? entry.item.element.element_key.split(':').slice(-1)[0]
      if (planet && gate) {
        selectedActivationThemes.add(`${planet}:${gate}`)
      }
    }
  }

  const ranked = items.map((entry) => {
    const context: RankedSelectionContext = {
      sectionKey,
      selectionReason: entry.reason,
      sourceRole: entry.role,
      channelGateKeys,
      selectedGateKeys,
      selectedActivationThemes,
    }
    const { rank_score, rank_reasons } = computeRankScore(entry.item, context)
    return { ...entry, rank_score, rank_reasons }
  })

  return ranked.sort((a, b) => b.rank_score - a.rank_score)
}

function interpretationFieldsForRole(
  role: SourceItemRole,
  section: TalentMapSectionSynthesisDefinition,
): readonly InterpretationFieldKey[] {
  if (role === 'context_only') {
    return ['related_context_summary', 'limitations']
  }

  return section.interpretation_fields_for_ai
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
  const recovery =
    interpretation.pro_layers.recovery_conditions ?? interpretation.base_layers.recovery_conditions

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
      case 'recovery_conditions':
        if (recovery) {
          selected.recovery_conditions = recovery
        }
        break
      case 'composition_meta':
        selected.composition_meta = {
          composition_mode: interpretation.pro_layers.composition_mode ?? null,
          composition_components: interpretation.pro_layers.composition_components ?? null,
          source_component_keys:
            interpretation.pro_layers.source_component_keys ??
            interpretation.context_rules.source_component_keys ??
            interpretation.pro_layers.composition_components ??
            null,
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

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text
  }
  return `${text.slice(0, maxChars - 1)}…`
}

function truncateStringArray(items: string[], maxChars: number): string[] {
  const result: string[] = []
  let used = 0

  for (const item of items) {
    const nextLen = used + item.length + (result.length > 0 ? 2 : 0)
    if (nextLen > maxChars) {
      break
    }
    result.push(item)
    used = nextLen
  }

  return result
}

function digestCharCount(digest: SectionSourceDigest['digest']): number {
  const parts: string[] = []
  if (digest.plain_meaning) parts.push(digest.plain_meaning)
  if (digest.work_manifestation) parts.push(digest.work_manifestation)
  for (const key of [
    'strengths',
    'risks',
    'management_hints',
    'environment_hints',
    'limitations',
  ] as const) {
    const value = digest[key]
    if (value) {
      parts.push(value.join(' '))
    }
  }
  if (digest.context_note) parts.push(digest.context_note)
  return parts.join(' ').length
}

function buildDigestPayload(
  interpretation: ReferenceInterpretation | null,
  role: SourceItemRole,
): SectionSourceDigest['digest'] {
  if (!interpretation) {
    return {}
  }

  const maxChars = DIGEST_CHAR_LIMITS[role]
  const base = interpretation.base_layers

  const digest: SectionSourceDigest['digest'] = {
    plain_meaning: base.plain_meaning
      ? truncateText(String(base.plain_meaning), Math.floor(maxChars * 0.4))
      : undefined,
    work_manifestation: base.work_manifestation
      ? truncateText(String(base.work_manifestation), Math.floor(maxChars * 0.35))
      : undefined,
    strengths: base.strengths
      ? truncateStringArray(
          String(base.strengths)
            .split(/[;\n]/)
            .map((s) => s.trim())
            .filter(Boolean),
          Math.floor(maxChars * 0.25),
        )
      : truncateStringArray(interpretation.talent_hints, Math.floor(maxChars * 0.2)),
    risks: truncateStringArray(interpretation.risk_hints, Math.floor(maxChars * 0.2)),
    management_hints: truncateStringArray(interpretation.management_hints, Math.floor(maxChars * 0.15)),
    environment_hints: truncateStringArray(interpretation.environment_hints, Math.floor(maxChars * 0.15)),
    limitations: truncateStringArray(interpretation.limitations, Math.floor(maxChars * 0.15)),
    context_note: base.context_note ? truncateText(String(base.context_note), Math.floor(maxChars * 0.15)) : undefined,
  }

  const compositionMode = interpretation.pro_layers.composition_mode
  const sourceComponentKeys =
    interpretation.pro_layers.source_component_keys ??
    interpretation.context_rules.source_component_keys ??
    null

  if (compositionMode || sourceComponentKeys) {
    digest.composition_meta = {
      composition_mode: compositionMode ?? null,
      composition_components: interpretation.pro_layers.composition_components ?? null,
      source_component_keys: sourceComponentKeys,
    }
  }

  return digest
}

function activationRoleInSection(
  item: ReferenceBundleItem,
  section: TalentMapSectionSynthesisDefinition,
): string {
  const planet = resolveActivationPlanet(item)
  const baseRole = ACTIVATION_PLANET_ROLES[planet ?? ''] ?? 'уточняет персональную активацию темы'
  return `${baseRole} в разделе «${section.title}»`
}

function sectionRoleText(section: TalentMapSectionSynthesisDefinition, entry: SelectionEntry): string {
  if (entry.item.element.element_kind === 'activation') {
    return activationRoleInSection(entry.item, section)
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
    recovery_conditions: 'описывает условия восстановления',
    throat_center: 'связан с центром коммуникации',
    throat_gate: 'связан с темой выражения через горло',
    throat_channel: 'связан с каналом коммуникации',
    communication_channel: 'задаёт устойчивую тему коммуникации',
    communication_gate: 'добавляет коммуникационную тему выражения',
    ajna_center: 'даёт ментальную опору для формулировки',
    mercury_activation: 'уточняет стиль передачи и коммуникации',
    mars_activation: 'уточняет тему напряжения и обучения',
    saturn_activation: 'уточняет тему дисциплины и границ',
    moon_activation: 'уточняет эмоциональный драйв',
    jupiter_activation: 'уточняет вектор роста и расширения',
    north_node_activation: 'уточняет направление развития',
    south_node_activation: 'уточняет направление развития',
    pluto_activation: 'уточняет глубину трансформации',
    personality_sun: 'задаёт осознанную центральную тему',
    design_sun: 'задаёт автоматическую центральную тему',
    personality_earth: 'даёт осознанную опору',
    design_earth: 'даёт автоматическую опору',
    related_context_summary: 'даёт связанный контекст карты',
    context: 'даёт связанный контекст для интерпретации раздела',
  }

  if (entry.role === 'context_only') {
    return roleByKind.context
  }

  return roleByKind[kind] ?? `участвует как источник раздела ${section.title}`
}

function buildSourceChip(
  section: TalentMapSectionSynthesisDefinition,
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
    role_in_layer: sectionRoleText(section, entry),
    reason_used: `используется как ${entry.role} источник раздела ${section.section_key}`,
    link_target: elementLinkTarget(element.element_kind, element.element_key),
  }
}

function entryToSourceItem(
  section: TalentMapSectionSynthesisDefinition,
  entry: SelectionEntry,
): SectionSourceItem | null {
  const kind = entry.item.element.element_kind
  if (!isElementKind(kind)) {
    return null
  }

  return {
    element_kind: kind,
    element_key: entry.item.element.element_key,
    element_label: entry.item.element.element_label,
    matched: entry.item.matched,
    source_role: entry.role,
    selection_reason: entry.reason,
    rank_score: entry.rank_score,
    rank_reasons: entry.rank_reasons,
    selected_interpretation_fields: pickInterpretationFields(
      entry.item.interpretation,
      entry.item.related_context_elements.length,
      interpretationFieldsForRole(entry.role, section),
    ),
  }
}

function buildSectionGuardrails(section: TalentMapSectionSynthesisDefinition): SectionGuardrails {
  return {
    forbidden_fields: GLOBAL_GUARDRAILS.forbidden_fields,
    forbidden_phrases: GLOBAL_GUARDRAILS.forbidden_phrases,
    forbidden_base_terms: section.forbidden_base_terms,
    allowed_pro_terms: section.allowed_pro_terms,
    section_guardrails: section.section_guardrails ?? [],
  }
}

function resolveGenerationStatus(
  section: TalentMapSectionSynthesisDefinition,
  matchedMajorCount: number,
): SectionGenerationStatus {
  if (matchedMajorCount < section.min_matched_source_items) {
    return 'input_not_ready'
  }
  return 'input_ready'
}

function buildBudgetSummary(
  selected: SectionSourceItem[],
  omittedCount: number,
  digests: SectionSourceDigest[],
  sectionKey: TalentMapSectionKey,
): SectionBudgetSummary {
  const budget = SECTION_SOURCE_BUDGETS[sectionKey]
  const primarySelected = selected.filter((item) => item.source_role === 'primary').length
  const supportingSelected = selected.filter((item) => item.source_role === 'supporting').length
  const contextSelected = selected.filter((item) => item.source_role === 'context_only').length
  const totalDigestChars = digests.reduce((sum, item) => sum + digestCharCount(item.digest), 0)

  return {
    primary_selected: primarySelected,
    supporting_selected: supportingSelected,
    context_selected: contextSelected,
    total_selected: selected.length,
    primary_max: budget.primaryMax,
    supporting_max: budget.supportingMax,
    context_max: budget.contextMax,
    total_max: budget.totalMax,
    omitted_count: omittedCount,
    total_digest_chars: totalDigestChars,
    estimated_input_tokens: Math.ceil(totalDigestChars / 4),
  }
}

function buildSectionPreview(
  section: TalentMapSectionSynthesisDefinition,
  bundleItems: ReferenceBundleItem[],
  gateCenterMap: Map<string, string>,
  bundleItemMap: Map<string, ReferenceBundleItem>,
  channelGateKeys: ReadonlySet<string>,
): SectionInputPreview {
  const selection = selectSectionItems(section, bundleItems, gateCenterMap, bundleItemMap)
  const ranked = rankSectionItems(section.section_key, selection.items, channelGateKeys)

  const rankedSourceItems = ranked
    .map((entry) => entryToSourceItem(section, entry))
    .filter((item): item is SectionSourceItem => item !== null)

  const budget = SECTION_SOURCE_BUDGETS[section.section_key]
  const { selected: budgetSelectedKeys, omitted: budgetOmittedKeys } = applySectionBudget(
    rankedSourceItems,
    budget,
  )

  let selectedItems = budgetSelectedKeys
  let omittedItems = budgetOmittedKeys

  let totalDigestChars = 0
  const digests: SectionSourceDigest[] = []

  for (const sourceItem of selectedItems) {
    const entry = ranked.find(
      (e) =>
        e.item.element.element_kind === sourceItem.element_kind &&
        e.item.element.element_key === sourceItem.element_key,
    )
    if (!entry) {
      continue
    }

    const digestPayload = buildDigestPayload(entry.item.interpretation, sourceItem.source_role)
    const digestSize = digestCharCount(digestPayload)

    if (totalDigestChars + digestSize > SECTION_DIGEST_TOTAL_MAX) {
      omittedItems = [...omittedItems, sourceItem]
      selectedItems = selectedItems.filter(
        (item) =>
          !(
            item.element_kind === sourceItem.element_kind &&
            item.element_key === sourceItem.element_key
          ),
      )
      continue
    }

    totalDigestChars += digestSize
    const chip = buildSourceChip(section, entry)

    digests.push({
      element_kind: sourceItem.element_kind,
      element_key: sourceItem.element_key,
      element_label: sourceItem.element_label,
      source_role: sourceItem.source_role,
      rank_score: sourceItem.rank_score,
      rank_reasons: sourceItem.rank_reasons,
      digest: digestPayload,
      source_chip: chip ?? {
        role_in_layer: sectionRoleText(section, entry),
        reason_used: sourceItem.selection_reason,
        link_target: elementLinkTarget(sourceItem.element_kind, sourceItem.element_key),
      },
    })
  }

  const matchedMajorItems = selectedItems.filter(
    (item) => item.source_role !== 'context_only' && item.matched,
  )

  const sourceChips = selectedItems
    .flatMap((sourceItem) => {
      const entry = ranked.find(
        (e) =>
          e.item.element.element_kind === sourceItem.element_kind &&
          e.item.element.element_key === sourceItem.element_key,
      )
      return entry ? [buildSourceChip(section, entry)] : []
    })
    .filter((chip): chip is SourceChip => chip !== null)

  const elementKindsPresent = [...new Set(selectedItems.map((item) => item.element_kind))].sort()
  const uiSection = getUiSectionDefinition(section.section_key)
  const generationStatus = resolveGenerationStatus(section, matchedMajorItems.length)

  const warnings: string[] = []
  if (matchedMajorItems.length < section.min_matched_source_items) {
    warnings.push(
      `Раздел ${section.section_key}: ${matchedMajorItems.length} matched primary/supporting источников (минимум ${section.min_matched_source_items}).`,
    )
  }

  if (omittedItems.length > 0) {
    warnings.push(
      `Раздел ${section.section_key}: ${omittedItems.length} источников отложены по budget/ranking.`,
    )
  }

  const budgetSummary = buildBudgetSummary(selectedItems, omittedItems.length, digests, section.section_key)

  return {
    section_key: section.section_key,
    section_title: section.title,
    generation_status: generationStatus,
    user_status_label: generationStatus === 'input_ready' ? 'Ещё не собран' : 'Вход не готов',
    credit_cost: uiSection.creditCost,
    compute_weight: uiSection.compute_weight,
    source_items: selectedItems,
    omitted_by_budget: omittedItems,
    source_digests: digests,
    source_chips: sourceChips,
    budget_summary: budgetSummary,
    selected_fields_for_ai: [...section.interpretation_fields_for_ai],
    omitted_fields: [...section.omitted_interpretation_fields],
    guardrails: buildSectionGuardrails(section),
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
  const channelGateKeys = buildChannelGateKeySet(params.bundle.items)

  const sections = TALENT_MAP_SECTION_DEFINITIONS.map((section) =>
    buildSectionPreview(section, params.bundle.items, gateCenterMap, bundleItemMap, channelGateKeys),
  )

  const warnings = sections.flatMap((section) => section.warnings)

  if ((params.coverage?.missing_elements ?? 0) > 0) {
    warnings.push(
      `source_interpretation_bundle: ${params.coverage?.missing_elements} элементов без расшифровки.`,
    )
  }

  return {
    candidate_id: params.candidateId,
    chart_id: params.chartId,
    source_coverage: params.coverage ?? null,
    sections,
    layers: sections,
    global_guardrails: GLOBAL_GUARDRAILS,
    warnings,
  }
}

export { getTalentMapSectionDefinition }
