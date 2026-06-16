import type { CandidateChart, ReferenceBundleItem } from './types'

export type NormalizedChartView = {
  type: string | null
  strategy: string | null
  authority: string | null
  profile: string | null
  definition: string | null
  centers: {
    defined: Array<{ key: string; label: string }>
    open: Array<{ key: string; label: string }>
  }
  channels: Array<{ key: string; label: string | null; gates: string[] }>
  gates: Array<{
    key: string
    label: string | null
    line: string | null
    planet: string | null
    side: string | null
  }>
  activations: Array<{
    key: string
    planet: string | null
    side: string | null
    gate: string | null
    line: string | null
    label: string | null
    metadata: Record<string, unknown>
  }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pickString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return null
}

export function parseNormalizedChart(chart: CandidateChart | null): NormalizedChartView | null {
  if (!chart?.normalized_chart_data || !isRecord(chart.normalized_chart_data)) {
    return null
  }

  const data = chart.normalized_chart_data

  const centersRaw = isRecord(data.centers) ? data.centers : {}
  const definedRaw = Array.isArray(centersRaw.defined) ? centersRaw.defined : []
  const openRaw = Array.isArray(centersRaw.open) ? centersRaw.open : []

  const mapCenter = (item: unknown): { key: string; label: string } | null => {
    if (typeof item === 'string') {
      return { key: item, label: item }
    }
    if (isRecord(item)) {
      const key = pickString(item.key) ?? pickString(item.id) ?? 'unknown'
      const label = pickString(item.label) ?? key
      return { key, label }
    }
    return null
  }

  const channels = (Array.isArray(data.channels) ? data.channels : [])
    .map((item) => {
      if (!isRecord(item)) return null
      return {
        key: pickString(item.key) ?? 'unknown',
        label: pickString(item.label),
        gates: Array.isArray(item.gates)
          ? item.gates.filter((g): g is string => typeof g === 'string')
          : [],
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const gates = (Array.isArray(data.gates) ? data.gates : [])
    .map((item) => {
      if (!isRecord(item)) return null
      return {
        key: pickString(item.key) ?? 'unknown',
        label: pickString(item.label),
        line: pickString(item.line),
        planet: pickString(item.planet),
        side: pickString(item.side),
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const activations = (Array.isArray(data.activations) ? data.activations : [])
    .map((item) => {
      if (!isRecord(item)) return null
      return {
        key: pickString(item.key) ?? 'unknown',
        planet: pickString(item.planet),
        side: pickString(item.side),
        gate: pickString(item.gate),
        line: pickString(item.line),
        label: pickString(item.label),
        metadata: isRecord(item.metadata) ? item.metadata : {},
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return {
    type: pickString(data.type),
    strategy: pickString(data.strategy),
    authority: pickString(data.authority),
    profile: pickString(data.profile),
    definition: pickString(data.definition),
    centers: {
      defined: definedRaw.map(mapCenter).filter((c): c is NonNullable<typeof c> => c !== null),
      open: openRaw.map(mapCenter).filter((c): c is NonNullable<typeof c> => c !== null),
    },
    channels,
    gates,
    activations,
  }
}

export function findBundleItem(
  items: ReferenceBundleItem[] | undefined,
  elementKind: string,
  elementKey: string,
): ReferenceBundleItem | undefined {
  return items?.find(
    (item) =>
      item.element.element_kind === elementKind && item.element.element_key === elementKey,
  )
}

export function readActivationComposition(item: ReferenceBundleItem | undefined) {
  if (!item?.interpretation) {
    return {
      activationRole: null as string | null,
      compositionMode: null as string | null,
      sourceQuality: null as string | null,
      matched: item?.matched ?? false,
    }
  }

  const layers = item.interpretation.pro_layers ?? item.interpretation.base_layers
  const components = layers.composition_components
  const activationRole = Array.isArray(components)
    ? components.find((c) => typeof c === 'string' && c.startsWith('activation_role/')) ?? null
    : null

  return {
    activationRole: typeof activationRole === 'string' ? activationRole.replace('activation_role/', '') : null,
    compositionMode: layers.composition_mode ?? null,
    sourceQuality: item.interpretation.source_quality ?? null,
    matched: item.matched,
  }
}
