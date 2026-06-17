import type { ReferenceBundleItem } from './types'
import type { TalentMapSectionKey } from './talentMapSections'
import type { SectionSourceRole } from './talentMapSourceBudget'

export const RANK_ROLE_WEIGHTS: Record<SectionSourceRole, number> = {
  primary: 100,
  supporting: 50,
  context_only: 10,
}

export const RANK_SOURCE_QUALITY_WEIGHTS: Record<string, number> = {
  expert_draft: 20,
  composed_draft: 10,
  draft: 0,
  missing: -50,
}

export const RANK_SOURCE_RICHNESS_WEIGHTS = {
  relevant_hints: 8,
  limitations: 5,
  context_rules: 5,
  related_context_elements: 4,
} as const

export const RANK_DUPLICATION_PENALTIES = {
  gate_represented_by_channel: -15,
  activation_duplicate_theme: -10,
} as const

const SECTION_KIND_WEIGHTS: Partial<Record<TalentMapSectionKey, Record<string, number>>> = {
  work_mode_and_entry: {
    type: 15,
    strategy: 15,
    profile: 12,
    definition: 12,
    authority: 12,
    channel: 8,
    personality_sun: 10,
    design_sun: 10,
    personality_earth: 10,
    design_earth: 10,
  },
  decision_style: {
    authority: 15,
    strategy: 15,
    defined_center: 12,
    open_center: 12,
    moon_activation: 10,
    mars_activation: 10,
    saturn_activation: 10,
  },
  main_talents: {
    channel: 15,
    defined_center: 12,
    personality_sun: 12,
    design_sun: 12,
    personality_earth: 12,
    design_earth: 12,
    gate: 8,
    talent_hints: 8,
  },
  work_environment: {
    open_center: 15,
    defined_center: 12,
    definition: 12,
    strategy: 10,
    authority: 10,
    environment_hints: 8,
  },
  communication: {
    throat_center: 15,
    ajna_center: 12,
    communication_channel: 15,
    mercury_activation: 15,
    profile: 10,
    communication_gate: 8,
  },
  risks: {
    open_center: 15,
    risk_hints: 12,
    not_self_layers: 12,
    limitations: 10,
    mars_activation: 10,
    saturn_activation: 10,
    moon_activation: 10,
  },
  management: {
    strategy: 15,
    authority: 15,
    profile: 12,
    management_hints: 12,
    open_center: 10,
  },
  development_potential: {
    jupiter_activation: 12,
    saturn_activation: 12,
    north_node_activation: 12,
    south_node_activation: 12,
    pluto_activation: 12,
    channel: 10,
    gate: 8,
    personality_sun: 8,
    design_sun: 8,
    personality_earth: 8,
    design_earth: 8,
  },
}

const ACTIVATION_RELEVANCE_BY_SECTION: Partial<
  Record<TalentMapSectionKey, ReadonlySet<string>>
> = {
  communication: new Set(['mercury']),
  risks: new Set(['mars', 'saturn', 'moon']),
  development_potential: new Set(['jupiter', 'saturn', 'north_node', 'south_node', 'pluto']),
  main_talents: new Set(['sun', 'earth']),
  decision_style: new Set(['moon', 'mars', 'saturn']),
  work_mode_and_entry: new Set(['sun', 'earth']),
}

export type RankedSelectionContext = {
  sectionKey: TalentMapSectionKey
  selectionReason: string
  sourceRole: SectionSourceRole
  channelGateKeys: ReadonlySet<string>
  selectedGateKeys: ReadonlySet<string>
  selectedActivationThemes: ReadonlySet<string>
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

function resolveSelectionKind(reason: string): string {
  const [, kind] = reason.split(':')
  return kind ?? reason
}

function hasRelevantHints(item: ReferenceBundleItem, sectionKey: TalentMapSectionKey): boolean {
  const interpretation = item.interpretation
  if (!interpretation) {
    return false
  }

  switch (sectionKey) {
    case 'main_talents':
    case 'development_potential':
      return interpretation.talent_hints.length > 0
    case 'risks':
      return interpretation.risk_hints.length > 0
    case 'management':
      return interpretation.management_hints.length > 0
    case 'work_environment':
      return interpretation.environment_hints.length > 0 || interpretation.management_hints.length > 0
    case 'communication':
      return (
        interpretation.talent_hints.length > 0 ||
        interpretation.management_hints.length > 0 ||
        interpretation.environment_hints.length > 0
      )
    default:
      return (
        interpretation.talent_hints.length > 0 ||
        interpretation.risk_hints.length > 0 ||
        interpretation.management_hints.length > 0 ||
        interpretation.environment_hints.length > 0
      )
  }
}

function activationSidePlanetKey(item: ReferenceBundleItem): string | null {
  if (item.element.element_kind !== 'activation') {
    return null
  }

  const planet = resolveActivationPlanet(item)
  if (!planet) {
    return null
  }

  const side = (item.element.side ?? item.element.element_key.split(':')[1] ?? '').toLowerCase()
  if (side === 'personality' || side === 'design') {
    return `${side}_${planet}`
  }

  return planet
}

function activationGatePlanetKey(item: ReferenceBundleItem): string | null {
  if (item.element.element_kind !== 'activation') {
    return null
  }

  const planet = resolveActivationPlanet(item)
  const gate = item.element.gate ?? item.element.element_key.split(':').slice(-1)[0]
  if (!planet || !gate) {
    return null
  }

  return `${planet}:${gate}`
}

export function computeRankScore(
  item: ReferenceBundleItem,
  context: RankedSelectionContext,
): { rank_score: number; rank_reasons: string[] } {
  const reasons: string[] = []
  let score = RANK_ROLE_WEIGHTS[context.sourceRole]
  reasons.push(`role:${context.sourceRole}(+${RANK_ROLE_WEIGHTS[context.sourceRole]})`)

  const selectionKind = resolveSelectionKind(context.selectionReason)
  const sectionKindWeights = SECTION_KIND_WEIGHTS[context.sectionKey] ?? {}
  const kindBoost = sectionKindWeights[selectionKind] ?? 0
  if (kindBoost > 0) {
    score += kindBoost
    reasons.push(`section_kind:${selectionKind}(+${kindBoost})`)
  }

  const quality = item.interpretation?.source_quality ?? (item.matched ? 'draft' : 'missing')
  const qualityBoost = RANK_SOURCE_QUALITY_WEIGHTS[quality] ?? 0
  score += qualityBoost
  reasons.push(`source_quality:${quality}(${qualityBoost >= 0 ? '+' : ''}${qualityBoost})`)

  if (hasRelevantHints(item, context.sectionKey)) {
    score += RANK_SOURCE_RICHNESS_WEIGHTS.relevant_hints
    reasons.push(`relevant_hints(+${RANK_SOURCE_RICHNESS_WEIGHTS.relevant_hints})`)
  }

  if ((item.interpretation?.limitations.length ?? 0) > 0) {
    score += RANK_SOURCE_RICHNESS_WEIGHTS.limitations
    reasons.push(`limitations(+${RANK_SOURCE_RICHNESS_WEIGHTS.limitations})`)
  }

  if (Object.keys(item.interpretation?.context_rules ?? {}).length > 0) {
    score += RANK_SOURCE_RICHNESS_WEIGHTS.context_rules
    reasons.push(`context_rules(+${RANK_SOURCE_RICHNESS_WEIGHTS.context_rules})`)
  }

  if (item.related_context_elements.length > 0) {
    score += RANK_SOURCE_RICHNESS_WEIGHTS.related_context_elements
    reasons.push(`related_context(+${RANK_SOURCE_RICHNESS_WEIGHTS.related_context_elements})`)
  }

  const relevantPlanets = ACTIVATION_RELEVANCE_BY_SECTION[context.sectionKey]
  const planet = resolveActivationPlanet(item)
  if (relevantPlanets && planet && relevantPlanets.has(planet)) {
    score += 12
    reasons.push(`activation_relevance:${planet}(+12)`)
  }

  const sidePlanetKey = activationSidePlanetKey(item)
  if (sidePlanetKey && sectionKindWeights[sidePlanetKey]) {
    const sideBoost = sectionKindWeights[sidePlanetKey]!
    score += sideBoost
    reasons.push(`activation_side:${sidePlanetKey}(+${sideBoost})`)
  }

  if (item.element.element_kind === 'gate') {
    const gateKey = item.element.gate ?? item.element.element_key
    if (context.channelGateKeys.has(gateKey)) {
      score += RANK_DUPLICATION_PENALTIES.gate_represented_by_channel
      reasons.push(`gate_in_channel(${RANK_DUPLICATION_PENALTIES.gate_represented_by_channel})`)
    }
  }

  const activationKey = activationGatePlanetKey(item)
  if (activationKey && context.selectedActivationThemes.has(activationKey)) {
    score += RANK_DUPLICATION_PENALTIES.activation_duplicate_theme
    reasons.push(
      `activation_duplicate(${RANK_DUPLICATION_PENALTIES.activation_duplicate_theme})`,
    )
  }

  return { rank_score: score, rank_reasons: reasons }
}

export function buildChannelGateKeySet(items: ReferenceBundleItem[]): Set<string> {
  const gateKeys = new Set<string>()

  for (const item of items) {
    if (item.element.element_kind !== 'channel') {
      continue
    }

    const metadataGates = item.element.metadata_json.gates
    if (Array.isArray(metadataGates)) {
      for (const gate of metadataGates) {
        if (typeof gate === 'string') {
          gateKeys.add(gate)
        }
      }
    }

    const channelKey = item.element.element_key.replace(/_/g, '-')
    const parts = channelKey.split('-').filter(Boolean)
    for (const part of parts) {
      gateKeys.add(part)
    }
  }

  return gateKeys
}
