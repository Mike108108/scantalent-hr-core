import type { CandidateChart, ChartElementCounts, ReferenceBundleCoverage } from './types'

const KIND_COUNT_KEYS = ['channel', 'gate', 'activation'] as const

function countFromByKind(byKind: Record<string, { total: number }> | undefined): Pick<
  ChartElementCounts,
  'channels' | 'gates' | 'activations'
> {
  return {
    channels: byKind?.channel?.total ?? 0,
    gates: byKind?.gate?.total ?? 0,
    activations: byKind?.activation?.total ?? 0,
  }
}

export function countsFromBundleCoverage(
  coverage: ReferenceBundleCoverage,
): Pick<ChartElementCounts, 'total' | 'channels' | 'gates' | 'activations' | 'defined_centers' | 'open_centers'> {
  const byKind = coverage.by_kind

  return {
    total: coverage.total_elements,
    defined_centers: byKind?.defined_center?.total ?? 0,
    open_centers: byKind?.open_center?.total ?? 0,
    ...countFromByKind(byKind),
  }
}

export function countsFromNormalizedChart(
  chart: CandidateChart | null,
): Pick<ChartElementCounts, 'channels' | 'gates' | 'activations'> | null {
  if (!chart?.normalized_chart_data || typeof chart.normalized_chart_data !== 'object') {
    return null
  }

  const data = chart.normalized_chart_data as {
    channels?: unknown[]
    gates?: unknown[]
    activations?: unknown[]
  }

  return {
    channels: Array.isArray(data.channels) ? data.channels.length : 0,
    gates: Array.isArray(data.gates) ? data.gates.length : 0,
    activations: Array.isArray(data.activations) ? data.activations.length : 0,
  }
}

function needsStructuralFallback(counts: ChartElementCounts | null): boolean {
  if (!counts) {
    return true
  }

  return KIND_COUNT_KEYS.every((kind) => {
    const key = kind === 'channel' ? 'channels' : kind === 'gate' ? 'gates' : 'activations'
    return (counts[key] ?? 0) === 0
  })
}

export function resolveDisplayElementCounts(params: {
  dbCounts: ChartElementCounts | null
  chart: CandidateChart | null
  bundleCoverage?: ReferenceBundleCoverage | null
}): ChartElementCounts | null {
  const { dbCounts, chart, bundleCoverage } = params

  if (!dbCounts && !bundleCoverage && !chart) {
    return null
  }

  const base: ChartElementCounts = dbCounts ?? {
    total: bundleCoverage?.total_elements ?? 0,
    defined_centers: bundleCoverage?.by_kind?.defined_center?.total ?? 0,
    open_centers: bundleCoverage?.by_kind?.open_center?.total ?? 0,
    channels: 0,
    gates: 0,
    activations: 0,
  }

  if (!needsStructuralFallback(base)) {
    return base
  }

  if (bundleCoverage) {
    const fromCoverage = countsFromBundleCoverage(bundleCoverage)
    return {
      ...base,
      total: base.total || fromCoverage.total,
      defined_centers: base.defined_centers || fromCoverage.defined_centers,
      open_centers: base.open_centers || fromCoverage.open_centers,
      channels: fromCoverage.channels,
      gates: fromCoverage.gates,
      activations: fromCoverage.activations,
    }
  }

  const fromNormalized = countsFromNormalizedChart(chart)
  if (fromNormalized) {
    return {
      ...base,
      channels: fromNormalized.channels,
      gates: fromNormalized.gates,
      activations: fromNormalized.activations,
    }
  }

  return base
}
