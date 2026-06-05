export const CENTER_CATALOG = [
  { key: 'head', label: 'Head' },
  { key: 'ajna', label: 'Ajna' },
  { key: 'throat', label: 'Throat' },
  { key: 'g', label: 'G' },
  { key: 'ego', label: 'Ego' },
  { key: 'spleen', label: 'Spleen' },
  { key: 'solar_plexus', label: 'Solar Plexus' },
  { key: 'sacral', label: 'Sacral' },
  { key: 'root', label: 'Root' },
] as const

export type CenterKey = (typeof CENTER_CATALOG)[number]['key']

const ALIAS_TO_CENTER_KEY: Record<string, CenterKey> = {
  head: 'head',
  crown: 'head',
  ajna: 'ajna',
  throat: 'throat',
  g: 'g',
  g_center: 'g',
  identity: 'g',
  ego: 'ego',
  heart: 'ego',
  will: 'ego',
  spleen: 'spleen',
  splenic: 'spleen',
  solar_plexus: 'solar_plexus',
  solarplexus: 'solar_plexus',
  sacral: 'sacral',
  root: 'root',
}

const LABEL_BY_KEY = Object.fromEntries(CENTER_CATALOG.map((center) => [center.key, center.label])) as Record<
  CenterKey,
  string
>

function normalizeProviderCenterToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/_center$/g, '')
    .replace(/^the_/g, '')
}

export function resolveCenterKey(providerValue: string): CenterKey | null {
  const normalized = normalizeProviderCenterToken(providerValue)

  if (normalized in ALIAS_TO_CENTER_KEY) {
    return ALIAS_TO_CENTER_KEY[normalized]
  }

  if (normalized.includes('solar_plexus') || normalized.includes('solarplexus')) {
    return 'solar_plexus'
  }

  if (normalized.includes('splenic') || normalized.endsWith('_spleen') || normalized === 'spleen') {
    return 'spleen'
  }

  if (normalized.includes('heart') || normalized.includes('_ego') || normalized === 'will') {
    return 'ego'
  }

  if (normalized.includes('identity') || normalized === 'g') {
    return 'g'
  }

  if (normalized.includes('crown')) {
    return 'head'
  }

  return null
}

export function getCenterLabel(key: CenterKey): string {
  return LABEL_BY_KEY[key]
}

export function resolveCenterKeyOrNull(providerValue: string | null | undefined): CenterKey | null {
  if (!providerValue) {
    return null
  }

  return resolveCenterKey(providerValue)
}

export type NormalizedCenters = {
  all: Array<{ key: CenterKey; label: string; defined: boolean }>
  defined: CenterKey[]
  open: CenterKey[]
}

function uniqueCenterKeys(values: string[]): CenterKey[] {
  const keys: CenterKey[] = []

  for (const value of values) {
    const key = resolveCenterKey(value)
    if (key && !keys.includes(key)) {
      keys.push(key)
    }
  }

  return keys
}

export function buildNormalizedCenters(
  definedProviderValues: string[],
  openProviderValues: string[],
): NormalizedCenters {
  const definedKeys = new Set(uniqueCenterKeys(definedProviderValues))
  const openKeys = new Set(uniqueCenterKeys(openProviderValues))

  if (definedKeys.size > 0 && openKeys.size === 0) {
    for (const { key } of CENTER_CATALOG) {
      if (!definedKeys.has(key)) {
        openKeys.add(key)
      }
    }
  }

  if (definedKeys.size === 0 && openKeys.size > 0) {
    for (const { key } of CENTER_CATALOG) {
      if (!openKeys.has(key)) {
        definedKeys.add(key)
      }
    }
  }

  for (const key of definedKeys) {
    openKeys.delete(key)
  }

  const all = CENTER_CATALOG.map(({ key, label }) => ({
    key,
    label,
    defined: definedKeys.has(key),
  }))

  return {
    all,
    defined: CENTER_CATALOG.filter((center) => definedKeys.has(center.key)).map((center) => center.key),
    open: CENTER_CATALOG.filter((center) => openKeys.has(center.key)).map((center) => center.key),
  }
}
