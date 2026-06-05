import type { NormalizedChartData } from './normalizeChart'

export type ChartElementInsert = {
  element_kind: string
  element_key: string
  element_label: string | null
  element_value: string | null
  side: string | null
  planet: string | null
  gate: string | null
  line: string | null
  center: string | null
  channel: string | null
  source_path: string | null
  metadata_json: Record<string, unknown>
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_')
}

export function extractCandidateChartElements(
  normalizedChart: NormalizedChartData,
): ChartElementInsert[] {
  const elements: ChartElementInsert[] = []

  const pushScalar = (
    kind: string,
    value: string | null,
    sourcePath: string,
  ) => {
    if (!value) {
      return
    }

    elements.push({
      element_kind: kind,
      element_key: slug(value),
      element_label: value,
      element_value: value,
      side: null,
      planet: null,
      gate: null,
      line: null,
      center: null,
      channel: null,
      source_path: sourcePath,
      metadata_json: {},
    })
  }

  pushScalar('type', normalizedChart.type, 'normalized.type')
  pushScalar('strategy', normalizedChart.strategy, 'normalized.strategy')
  pushScalar('authority', normalizedChart.authority, 'normalized.authority')
  pushScalar('profile', normalizedChart.profile, 'normalized.profile')
  pushScalar('definition', normalizedChart.definition, 'normalized.definition')

  for (const center of normalizedChart.centers.defined) {
    elements.push({
      element_kind: 'defined_center',
      element_key: slug(center),
      element_label: center,
      element_value: center,
      side: null,
      planet: null,
      gate: null,
      line: null,
      center,
      channel: null,
      source_path: 'normalized.centers.defined',
      metadata_json: { defined: true },
    })
  }

  for (const center of normalizedChart.centers.open) {
    elements.push({
      element_kind: 'open_center',
      element_key: slug(center),
      element_label: center,
      element_value: center,
      side: null,
      planet: null,
      gate: null,
      line: null,
      center,
      channel: null,
      source_path: 'normalized.centers.open',
      metadata_json: { defined: false },
    })
  }

  for (const channel of normalizedChart.channels) {
    elements.push({
      element_kind: 'channel',
      element_key: slug(channel.key),
      element_label: channel.label,
      element_value: channel.key,
      side: null,
      planet: null,
      gate: null,
      line: null,
      center: null,
      channel: channel.key,
      source_path: 'normalized.channels',
      metadata_json: { gates: channel.gates, ...channel.metadata },
    })
  }

  for (const gate of normalizedChart.gates) {
    elements.push({
      element_kind: 'gate',
      element_key: gate.key,
      element_label: gate.label,
      element_value: gate.key,
      side: gate.side,
      planet: gate.planet,
      gate: gate.key,
      line: gate.line,
      center: gate.center,
      channel: null,
      source_path: 'normalized.gates',
      metadata_json: gate.metadata,
    })
  }

  for (const activation of normalizedChart.activations) {
    elements.push({
      element_kind: 'activation',
      element_key: slug(activation.key),
      element_label: activation.label,
      element_value: activation.key,
      side: activation.side,
      planet: activation.planet,
      gate: activation.gate,
      line: activation.line,
      center: null,
      channel: null,
      source_path: 'normalized.activations',
      metadata_json: activation.metadata,
    })
  }

  return elements
}

export function countElementsByKind(elements: ChartElementInsert[]) {
  const counts: Record<string, number> = {}

  for (const element of elements) {
    counts[element.element_kind] = (counts[element.element_kind] ?? 0) + 1
  }

  return {
    total: elements.length,
    defined_centers: counts.defined_center ?? 0,
    open_centers: counts.open_center ?? 0,
    channels: counts.channel ?? 0,
    gates: counts.gate ?? 0,
    activations: counts.activation ?? 0,
    by_kind: counts,
  }
}
