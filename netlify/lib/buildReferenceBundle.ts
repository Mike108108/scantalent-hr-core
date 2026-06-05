import type { ChartElementInsert } from './extractCandidateChartElements'

export type ChartElementRow = ChartElementInsert & { id: string }

export type ReferenceInterpretationRow = {
  element_kind: string
  element_key: string
  element_label: string | null
  classic_markdown: string | null
  hr_translation_markdown: string | null
  pro_markdown: string | null
  talent_hints: unknown[]
  risk_hints: unknown[]
  management_hints: unknown[]
  environment_hints: unknown[]
  limitations: unknown[]
  base_layers: Record<string, unknown>
  pro_layers: Record<string, unknown>
  context_rules: Record<string, unknown>
  not_self_layers: Record<string, unknown>
  contrast_examples: unknown[]
  source_quality: string
}

export type RelatedContextElement = {
  id: string
  element_kind: string
  element_key: string
  element_label: string | null
  relation: string
}

export type BundleItem = {
  element: ChartElementRow
  matched: boolean
  interpretation: ReferenceInterpretationRow | null
  related_context_elements: RelatedContextElement[]
  missing_reason: string | null
}

export type BundleMissingItem = {
  element_kind: string
  element_key: string
  element_label: string | null
  reason: string
}

export type BundleCoverageByKind = {
  total: number
  matched: number
  missing: number
}

export type BundleCoverage = {
  total_elements: number
  matched_elements: number
  missing_elements: number
  coverage_percent: number
  by_kind: Record<string, BundleCoverageByKind>
}

export type SourceInterpretationBundle = {
  language: string
  version: string
  items: BundleItem[]
  missing_items: BundleMissingItem[]
}

const GLOBAL_CONTEXT_KINDS = ['type', 'strategy', 'authority', 'profile', 'definition'] as const

const MISSING_REASON = 'No reference interpretation found for ru/v1'

function interpretationKey(kind: string, key: string): string {
  return `${kind}::${key}`
}

function toRelated(element: ChartElementRow, relation: string): RelatedContextElement {
  return {
    id: element.id,
    element_kind: element.element_kind,
    element_key: element.element_key,
    element_label: element.element_label,
    relation,
  }
}

function uniqueRelated(items: RelatedContextElement[]): RelatedContextElement[] {
  const seen = new Set<string>()
  const result: RelatedContextElement[] = []

  for (const item of items) {
    const key = `${item.element_kind}::${item.element_key}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(item)
  }

  return result
}

function getMetadataGates(metadata: Record<string, unknown>): string[] {
  const gates = metadata.gates
  if (!Array.isArray(gates)) {
    return []
  }

  return gates.filter((gate): gate is string => typeof gate === 'string' && gate.trim().length > 0)
}

function findGlobalContext(
  elements: ChartElementRow[],
  excludeId?: string,
  kinds: readonly string[] = GLOBAL_CONTEXT_KINDS,
): RelatedContextElement[] {
  const related: RelatedContextElement[] = []

  for (const kind of kinds) {
    const match = elements.find((element) => element.element_kind === kind && element.id !== excludeId)
    if (match) {
      related.push(toRelated(match, `global_${kind}`))
    }
  }

  return related
}

function findCenterElements(elements: ChartElementRow[]): ChartElementRow[] {
  return elements.filter(
    (element) => element.element_kind === 'defined_center' || element.element_kind === 'open_center',
  )
}

function findChannelsForCenter(elements: ChartElementRow[], centerKey: string): ChartElementRow[] {
  const gateKeysForCenter = new Set(
    elements
      .filter((element) => element.element_kind === 'gate' && element.center === centerKey)
      .map((element) => element.gate ?? element.element_key),
  )

  if (gateKeysForCenter.size === 0) {
    return []
  }

  return elements.filter((element) => {
    if (element.element_kind !== 'channel') {
      return false
    }

    const channelGates = getMetadataGates(element.metadata_json)
    return channelGates.some((gate) => gateKeysForCenter.has(gate))
  })
}

function findCentersForChannelGates(
  elements: ChartElementRow[],
  gateKeys: string[],
): ChartElementRow[] {
  const centerKeys = new Set<string>()

  for (const gateKey of gateKeys) {
    const gateElement = elements.find(
      (element) =>
        element.element_kind === 'gate' && (element.gate === gateKey || element.element_key === gateKey),
    )

    if (gateElement?.center) {
      centerKeys.add(gateElement.center)
    }
  }

  return findCenterElements(elements).filter(
    (element) => element.center && centerKeys.has(element.center),
  )
}

function buildRelatedContextElements(
  element: ChartElementRow,
  allElements: ChartElementRow[],
): RelatedContextElement[] {
  const related: RelatedContextElement[] = []
  const kind = element.element_kind

  if (kind === 'channel') {
    related.push(...findGlobalContext(allElements, element.id))
    related.push(...findCenterElements(allElements).map((center) => toRelated(center, 'chart_center')))

    const gateKeys = getMetadataGates(element.metadata_json)
    for (const gateKey of gateKeys) {
      const gateElement = allElements.find(
        (row) =>
          row.element_kind === 'gate' && (row.gate === gateKey || row.element_key === gateKey),
      )
      if (gateElement) {
        related.push(toRelated(gateElement, 'channel_gate'))
      }
    }

    for (const centerElement of findCentersForChannelGates(allElements, gateKeys)) {
      related.push(toRelated(centerElement, 'channel_center'))
    }

    return uniqueRelated(related.filter((item) => item.id !== element.id))
  }

  if (kind === 'defined_center' || kind === 'open_center') {
    const centerKey = element.center ?? element.element_key

    related.push(
      ...findGlobalContext(allElements, element.id, ['type', 'strategy', 'authority']).map((item) => ({
        ...item,
        relation: item.relation,
      })),
    )

    for (const channelElement of findChannelsForCenter(allElements, centerKey)) {
      related.push(toRelated(channelElement, 'center_channel'))
    }

    return uniqueRelated(related.filter((item) => item.id !== element.id))
  }

  if (kind === 'gate') {
    const gateKey = element.gate ?? element.element_key

    const activations = allElements.filter(
      (row) => row.element_kind === 'activation' && row.gate === gateKey,
    )
    related.push(...activations.map((row) => toRelated(row, 'gate_activation')))

    const channels = allElements.filter((row) => {
      if (row.element_kind !== 'channel') {
        return false
      }
      return getMetadataGates(row.metadata_json).includes(gateKey)
    })
    related.push(...channels.map((row) => toRelated(row, 'gate_channel')))

    if (element.center) {
      const centerElement = allElements.find(
        (row) =>
          (row.element_kind === 'defined_center' || row.element_kind === 'open_center') &&
          (row.center === element.center || row.element_key === element.center),
      )
      if (centerElement) {
        related.push(toRelated(centerElement, 'gate_center'))
      }
    }

    return uniqueRelated(related.filter((item) => item.id !== element.id))
  }

  if (kind === 'activation') {
    related.push(...findGlobalContext(allElements, element.id, ['type', 'strategy', 'authority', 'profile']))

    if (element.gate) {
      const gateElement = allElements.find(
        (row) =>
          row.element_kind === 'gate' &&
          (row.gate === element.gate || row.element_key === element.gate),
      )
      if (gateElement) {
        related.push(toRelated(gateElement, 'activation_gate'))
      }
    }

    return uniqueRelated(related.filter((item) => item.id !== element.id))
  }

  related.push(...findGlobalContext(allElements, element.id))
  return uniqueRelated(related.filter((item) => item.id !== element.id))
}

function computeCoverage(items: BundleItem[]): BundleCoverage {
  const byKind: Record<string, BundleCoverageByKind> = {}

  for (const item of items) {
    const kind = item.element.element_kind
    if (!byKind[kind]) {
      byKind[kind] = { total: 0, matched: 0, missing: 0 }
    }

    byKind[kind].total += 1
    if (item.matched) {
      byKind[kind].matched += 1
    } else {
      byKind[kind].missing += 1
    }
  }

  const totalElements = items.length
  const matchedElements = items.filter((item) => item.matched).length
  const missingElements = totalElements - matchedElements
  const coveragePercent =
    totalElements > 0 ? Math.round((matchedElements / totalElements) * 100) : 0

  return {
    total_elements: totalElements,
    matched_elements: matchedElements,
    missing_elements: missingElements,
    coverage_percent: coveragePercent,
    by_kind: byKind,
  }
}

export function buildReferenceBundle(
  elements: ChartElementRow[],
  interpretations: ReferenceInterpretationRow[],
  language = 'ru',
  version = 'v1',
): { bundle: SourceInterpretationBundle; coverage: BundleCoverage } {
  const interpretationMap = new Map<string, ReferenceInterpretationRow>()

  for (const interpretation of interpretations) {
    interpretationMap.set(
      interpretationKey(interpretation.element_kind, interpretation.element_key),
      interpretation,
    )
  }

  const items: BundleItem[] = elements.map((element) => {
    const interpretation =
      interpretationMap.get(interpretationKey(element.element_kind, element.element_key)) ?? null

    return {
      element,
      matched: interpretation !== null,
      interpretation,
      related_context_elements: buildRelatedContextElements(element, elements),
      missing_reason: interpretation ? null : MISSING_REASON,
    }
  })

  const missingItems: BundleMissingItem[] = items
    .filter((item) => !item.matched)
    .map((item) => ({
      element_kind: item.element.element_kind,
      element_key: item.element.element_key,
      element_label: item.element.element_label,
      reason: MISSING_REASON,
    }))

  const bundle: SourceInterpretationBundle = {
    language,
    version,
    items,
    missing_items: missingItems,
  }

  return {
    bundle,
    coverage: computeCoverage(items),
  }
}
