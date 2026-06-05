const CANONICAL_CENTER_COUNT = 9

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isNormalizedCentersCacheValid(normalizedChartData: unknown): boolean {
  if (!isRecord(normalizedChartData)) {
    return false
  }

  const centers = normalizedChartData.centers
  if (!isRecord(centers)) {
    return false
  }

  const all = centers.all
  const defined = centers.defined
  const open = centers.open

  if (!Array.isArray(all) || all.length !== CANONICAL_CENTER_COUNT) {
    return false
  }

  if (!Array.isArray(defined) || !Array.isArray(open)) {
    return false
  }

  if (defined.length + open.length !== CANONICAL_CENTER_COUNT) {
    return false
  }

  for (const item of all) {
    if (!isRecord(item)) {
      return false
    }

    if (typeof item.key !== 'string' || !item.key.trim()) {
      return false
    }

    if (typeof item.label !== 'string' || !item.label.trim()) {
      return false
    }

    if (typeof item.defined !== 'boolean') {
      return false
    }
  }

  return true
}

export function readCenterCountsFromNormalized(normalizedChartData: unknown): {
  defined: number
  open: number
  all: number
} | null {
  if (!isNormalizedCentersCacheValid(normalizedChartData)) {
    return null
  }

  const centers = (normalizedChartData as { centers: { defined: unknown[]; open: unknown[]; all: unknown[] } })
    .centers

  return {
    defined: centers.defined.length,
    open: centers.open.length,
    all: centers.all.length,
  }
}
