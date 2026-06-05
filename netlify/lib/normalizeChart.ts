import type { ChartBirthInput } from './inputHash'
import { buildNormalizedCenters, resolveCenterKeyOrNull, type CenterKey } from './centerKeys'

export type NormalizedChartData = {
  type: string | null
  strategy: string | null
  authority: string | null
  profile: string | null
  definition: string | null
  centers: {
    defined: CenterKey[]
    open: CenterKey[]
    all: Array<{ key: CenterKey; label: string; defined: boolean }>
  }
  channels: Array<{ key: string; label: string | null; gates: string[]; metadata: Record<string, unknown> }>
  gates: Array<{
    key: string
    label: string | null
    line: string | null
    planet: string | null
    side: string | null
    center: string | null
    metadata: Record<string, unknown>
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
  variables: Record<string, unknown> | null
  provider_metadata: Record<string, unknown>
  birth_input: ChartBirthInput & { city_label: string }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pickString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (isRecord(value)) {
    const fromOption = pickString(value.option)
    if (fromOption) {
      return fromOption
    }

    const fromId = pickString(value.id)
    if (fromId) {
      return fromId
    }

    const fromName = pickString(value.name)
    if (fromName) {
      return fromName
    }

    const fromValue = pickString(value.value)
    if (fromValue) {
      return fromValue
    }
  }

  return null
}

function pickStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim()
      }
      if (isRecord(item)) {
        return pickString(item.option) ?? pickString(item.id) ?? pickString(item.name)
      }
      return null
    })
    .filter((item): item is string => Boolean(item))
}

function unwrapChartRoot(raw: unknown): Record<string, unknown> {
  if (!isRecord(raw)) {
    return {}
  }

  if (isRecord(raw.data)) {
    return raw.data
  }

  if (isRecord(raw.chart)) {
    return raw.chart
  }

  return raw
}

function extractPropertyValue(properties: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = pickString(properties[key])
    if (value) {
      return value
    }
  }
  return null
}

function normalizeCenters(root: Record<string, unknown>, properties: Record<string, unknown>) {
  const definedFromList = pickStringArray(
    root.definedCenters ??
      root.DefinedCenters ??
      root.ConsciousCenters ??
      root.centers ??
      properties.DefinedCenters,
  )
  const openFromList = pickStringArray(root.openCenters ?? root.OpenCenters ?? properties.OpenCenters)

  const centerObjects = Array.isArray(root.centers)
    ? root.centers
    : Array.isArray(properties.Centers)
      ? properties.Centers
      : []

  const definedFromObjects: string[] = []
  const openFromObjects: string[] = []

  for (const item of centerObjects) {
    if (typeof item === 'string') {
      definedFromObjects.push(item)
      continue
    }

    if (!isRecord(item)) {
      continue
    }

    const name = pickString(item.name) ?? pickString(item.id) ?? pickString(item.center)
    if (!name) {
      continue
    }

    const defined =
      typeof item.defined === 'boolean'
        ? item.defined
        : typeof item.is_defined === 'boolean'
          ? item.is_defined
          : definedFromList.includes(name)

    if (defined) {
      definedFromObjects.push(name)
    } else {
      openFromObjects.push(name)
    }
  }

  const definedProviderValues =
    definedFromList.length > 0 ? definedFromList : definedFromObjects
  const openProviderValues = openFromList.length > 0 ? openFromList : openFromObjects

  return buildNormalizedCenters(definedProviderValues, openProviderValues)
}

function normalizeChannels(root: Record<string, unknown>, properties: Record<string, unknown>) {
  const longChannels = pickStringArray(root.channelsLong)
  const source =
    (Array.isArray(root.channelsShort) ? root.channelsShort : null) ??
    (Array.isArray(root.channels) ? root.channels : null) ??
    (Array.isArray(root.Channels) ? root.Channels : null) ??
    (Array.isArray(properties.Channels) ? properties.Channels : null) ??
    []

  return source
    .map((item, index) => {
      if (typeof item === 'string') {
        const gates = item.includes('-') ? item.split('-').map((gate) => gate.trim()) : []
        return {
          key: item,
          label: longChannels[index] ?? item,
          gates,
          metadata: { channelsShort: item, channelsLong: longChannels[index] ?? null },
        }
      }

      if (!isRecord(item)) {
        return null
      }

      const key =
        pickString(item.key) ??
        pickString(item.id) ??
        pickString(item.option) ??
        pickString(item.name) ??
        pickString(item.channel)

      if (!key) {
        return null
      }

      const gates = pickStringArray(item.gates ?? item.Gates)

      return {
        key,
        label: pickString(item.label) ?? pickString(item.option) ?? key,
        gates,
        metadata: item,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function normalizeGates(root: Record<string, unknown>, properties: Record<string, unknown>) {
  const source =
    (Array.isArray(root.gates) ? root.gates : null) ??
    (isRecord(properties.Gates) && Array.isArray(properties.Gates.list) ? properties.Gates.list : null) ??
    []

  const gateEntries: Array<{
    key: string
    label: string | null
    line: string | null
    planet: string | null
    side: string | null
    center: string | null
    metadata: Record<string, unknown>
  }> = []

  if (Array.isArray(source) && source.length > 0) {
    for (const item of source) {
      if (typeof item === 'number' || typeof item === 'string') {
        const key = String(item)
        gateEntries.push({
          key,
          label: key,
          line: null,
          planet: null,
          side: null,
          center: null,
          metadata: {},
        })
        continue
      }

      if (!isRecord(item)) {
        continue
      }

      const gateValue =
        pickString(item.gate) ??
        pickString(item.Gate) ??
        pickString(item.id) ??
        pickString(item.key) ??
        pickString(item.option)

      if (!gateValue) {
        continue
      }

      gateEntries.push({
        key: gateValue.replace(/\D/g, '') || gateValue,
        label: pickString(item.label) ?? pickString(item.option) ?? gateValue,
        line: pickString(item.line) ?? pickString(item.Line),
        planet: pickString(item.planet) ?? pickString(item.Planet),
        side: pickString(item.side) ?? pickString(item.Side),
        center: resolveCenterKeyOrNull(
          pickString(item.center) ?? pickString(item.Center) ?? null,
        ),
        metadata: item,
      })
    }
  } else if (isRecord(root.Gates)) {
    for (const [index, gateValue] of Object.entries(root.Gates)) {
      if (typeof gateValue !== 'number' && typeof gateValue !== 'string') {
        continue
      }

      const key = String(gateValue)
      gateEntries.push({
        key,
        label: key,
        line: null,
        planet: null,
        side: null,
        center: null,
        metadata: { source_index: index },
      })
    }
  }

  return gateEntries
}

function normalizeSideActivations(side: string, source: unknown) {
  if (!isRecord(source)) {
    return []
  }

  return Object.entries(source)
    .map(([planet, value]) => {
      if (typeof value === 'string') {
        const [gatePart, linePart] = value.split('.')
        const gateText = gatePart?.trim() || null
        const lineText = linePart?.trim() || null
        const key = [planet, side, gateText, lineText].filter(Boolean).join(':')

        return {
          key,
          planet,
          side,
          gate: gateText,
          line: lineText,
          label: value,
          metadata: { activation: value },
        }
      }

      if (!isRecord(value)) {
        return null
      }

      const gate = value.Gate ?? value.gate
      const line = value.Line ?? value.line
      const gateText = gate === undefined || gate === null ? null : String(gate)
      const lineText = line === undefined || line === null ? null : String(line)
      const key = [planet, side, gateText, lineText].filter(Boolean).join(':')

      return {
        key,
        planet,
        side,
        gate: gateText,
        line: lineText,
        label: key,
        metadata: value,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null && Boolean(item.key))
}

function normalizeActivations(root: Record<string, unknown>) {
  if (isRecord(root.activations) && !Array.isArray(root.activations)) {
    const fromGrid = [
      ...normalizeSideActivations('personality', root.activations.personality),
      ...normalizeSideActivations('design', root.activations.design),
    ]

    if (fromGrid.length > 0) {
      return fromGrid
    }
  }

  const source =
    (Array.isArray(root.activations) ? root.activations : null) ??
    (Array.isArray(root.planetary_activations) ? root.planetary_activations : null) ??
    (Array.isArray(root.planets) ? root.planets : null) ??
    []

  const fromSides = [
    ...normalizeSideActivations('personality', root.Personality ?? root.personality),
    ...normalizeSideActivations('design', root.Design ?? root.design),
  ]

  if (fromSides.length > 0) {
    return fromSides
  }

  return source
    .map((item) => {
      if (!isRecord(item)) {
        return null
      }

      const planet = pickString(item.planet) ?? pickString(item.Planet)
      const side = pickString(item.side) ?? pickString(item.Side)
      const gate = pickString(item.gate) ?? pickString(item.Gate)
      const line = pickString(item.line) ?? pickString(item.Line)
      const key = pickString(item.key) ?? [planet, side, gate, line].filter(Boolean).join(':')

      if (!key) {
        return null
      }

      return {
        key,
        planet,
        side,
        gate,
        line,
        label: pickString(item.label) ?? key,
        metadata: item,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function normalizeVariables(root: Record<string, unknown>, properties: Record<string, unknown>) {
  const source = root.variables ?? properties.Variables ?? null
  if (isRecord(source)) {
    return source
  }

  if (typeof source === 'string' && source.trim()) {
    return {
      code: source.trim(),
      motivation: pickString(root.motivation),
      environment: pickString(root.environment),
      determination: pickString(root.determination),
      cognition: pickString(root.cognition),
    }
  }

  return null
}

export function normalizeChartData(
  raw: unknown,
  birthInput: ChartBirthInput,
): NormalizedChartData {
  const root = unwrapChartRoot(raw)
  const properties = isRecord(root.Properties) ? root.Properties : {}

  const type =
    pickString(root.type) ??
    extractPropertyValue(properties, ['Type']) ??
    pickString(root.Type)

  const strategy =
    pickString(root.strategy) ??
    extractPropertyValue(properties, ['Strategy']) ??
    pickString(root.Strategy)

  const authority =
    pickString(root.authority) ??
    extractPropertyValue(properties, ['InnerAuthority', 'Authority']) ??
    pickString(root.Authority)

  const profile =
    pickString(root.profile) ??
    extractPropertyValue(properties, ['Profile']) ??
    pickString(root.Profile)

  const definition =
    pickString(root.definition) ??
    extractPropertyValue(properties, ['Definition']) ??
    pickString(root.Definition)

  const centers = normalizeCenters(root, properties)
  const channels = normalizeChannels(root, properties)
  const gates = normalizeGates(root, properties)
  const activations = normalizeActivations(root)
  const variables = normalizeVariables(root, properties)

  return {
    type,
    strategy,
    authority,
    profile,
    definition,
    centers,
    channels,
    gates,
    activations,
    variables,
    provider_metadata: {
      has_properties: Object.keys(properties).length > 0,
      top_level_keys: Object.keys(root).slice(0, 40),
    },
    birth_input: {
      ...birthInput,
      city_label: birthInput.birth_place,
    },
  }
}
