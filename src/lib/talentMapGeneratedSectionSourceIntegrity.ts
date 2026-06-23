import type { TalentMapGeneratedSection } from './talentMapGeneratedSectionContract'
import type { SourceChip } from './talentMapSynthesisContract'

export type TalentMapGeneratedSectionQualityFlag = string

export type CanonicalSourceKeyReason =
  | 'already_full'
  | 'kind_plus_raw'
  | 'collapsed_double_prefix'
  | 'raw_unique_match'

export function sourceChipFullKey(chip: { element_kind: string; element_key: string }): string {
  return `${chip.element_kind}:${chip.element_key}`
}

export function resolveCanonicalSourceKey(params: {
  elementKind?: string
  elementKeyOrFullKey: string
  allowedKeys: Set<string>
  allowedKeysByRawElementKey: Map<string, string[]>
}): {
  key: string | null
  normalizedFrom?: string
  reason?: CanonicalSourceKeyReason
} {
  const trimmed = params.elementKeyOrFullKey.trim()
  if (!trimmed) {
    return { key: null }
  }

  const { allowedKeys, allowedKeysByRawElementKey } = params
  const elementKind = params.elementKind?.trim()

  if (allowedKeys.has(trimmed)) {
    return { key: trimmed, reason: 'already_full' }
  }

  if (elementKind) {
    const kindPlusRaw = `${elementKind}:${trimmed}`
    if (allowedKeys.has(kindPlusRaw)) {
      return { key: kindPlusRaw, normalizedFrom: trimmed, reason: 'kind_plus_raw' }
    }

    const doublePrefix = `${elementKind}:${elementKind}:`
    if (trimmed.startsWith(doublePrefix)) {
      const collapsed = `${elementKind}:${trimmed.slice(doublePrefix.length)}`
      if (allowedKeys.has(collapsed)) {
        return { key: collapsed, normalizedFrom: trimmed, reason: 'collapsed_double_prefix' }
      }
    }
  }

  const parts = trimmed.split(':')
  if (parts.length >= 3 && parts[0] === parts[1]) {
    const collapsed = `${parts[0]}:${parts.slice(2).join(':')}`
    if (allowedKeys.has(collapsed)) {
      return { key: collapsed, normalizedFrom: trimmed, reason: 'collapsed_double_prefix' }
    }
  }

  const rawMatches = allowedKeysByRawElementKey.get(trimmed) ?? []
  if (rawMatches.length === 1) {
    return { key: rawMatches[0], normalizedFrom: trimmed, reason: 'raw_unique_match' }
  }

  return { key: null }
}

function integrityWarning(category: string, detail: string): TalentMapGeneratedSectionQualityFlag {
  return `warning: ${category}: ${detail}`
}

function buildAllowedKeysIndex(sourceChips: SourceChip[]): {
  allowedKeys: Set<string>
  byFullKey: Map<string, SourceChip>
  allowedKeysByRawElementKey: Map<string, string[]>
} {
  const allowedKeys = new Set<string>()
  const byFullKey = new Map<string, SourceChip>()
  const allowedKeysByRawElementKey = new Map<string, string[]>()

  for (const chip of sourceChips) {
    const fullKey = sourceChipFullKey(chip)
    allowedKeys.add(fullKey)
    byFullKey.set(fullKey, chip)

    const rawKey = chip.element_key.trim()
    const existing = allowedKeysByRawElementKey.get(rawKey) ?? []
    if (!existing.includes(fullKey)) {
      existing.push(fullKey)
    }
    allowedKeysByRawElementKey.set(rawKey, existing)
  }

  return { allowedKeys, byFullKey, allowedKeysByRawElementKey }
}

function dedupePreserveOrder(keys: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const key of keys) {
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(key)
  }

  return result
}

function formatNormalizedPair(from: string, to: string): string {
  return `${from} → ${to}`
}

function rebuildSourceChipsFromValidKeys(params: {
  proSourceLogicKeys: string[]
  summarySourceKeys: string[]
  byFullKey: Map<string, SourceChip>
}): SourceChip[] {
  const orderedKeys = dedupePreserveOrder([
    ...params.proSourceLogicKeys,
    ...params.summarySourceKeys,
  ])

  return orderedKeys.flatMap((key) => {
    const inputChip = params.byFullKey.get(key)
    if (!inputChip) {
      return []
    }

    return [
      {
        element_kind: inputChip.element_kind,
        element_key: inputChip.element_key,
        element_label: inputChip.element_label,
        link_target: inputChip.link_target,
        role_in_layer: inputChip.role_in_layer,
        reason_used: inputChip.reason_used,
      },
    ]
  })
}

export function enforceGeneratedSectionSourceIntegrity(params: {
  section: TalentMapGeneratedSection
  inputSourceChips: SourceChip[]
  mode?: 'standard_snapshot' | 'full_section'
}): {
  section: TalentMapGeneratedSection
  warnings: TalentMapGeneratedSectionQualityFlag[]
  removed: {
    source_chips: string[]
    pro_source_logic: string[]
    summary_source_element_keys: string[]
  }
  normalized: {
    source_chips: string[]
    pro_source_logic: string[]
    summary_source_element_keys: string[]
  }
  stats: {
    input_source_chip_count: number
    output_source_chip_count: number
    removed_unknown_source_count: number
    normalized_source_key_count: number
  }
} {
  const { inputSourceChips } = params
  const isStandardSnapshot = params.mode === 'standard_snapshot'
  const { allowedKeys, byFullKey, allowedKeysByRawElementKey } =
    buildAllowedKeysIndex(inputSourceChips)

  const removed = {
    source_chips: [] as string[],
    pro_source_logic: [] as string[],
    summary_source_element_keys: [] as string[],
  }
  const normalized = {
    source_chips: [] as string[],
    pro_source_logic: [] as string[],
    summary_source_element_keys: [] as string[],
  }

  const cleanedSourceChips = params.section.source_chips.flatMap((chip) => {
    const rawReference = sourceChipFullKey(chip)
    const resolved = resolveCanonicalSourceKey({
      elementKind: chip.element_kind,
      elementKeyOrFullKey: chip.element_key,
      allowedKeys,
      allowedKeysByRawElementKey,
    })

    if (!resolved.key) {
      removed.source_chips.push(rawReference)
      return []
    }

    const inputChip = byFullKey.get(resolved.key)
    if (!inputChip) {
      removed.source_chips.push(rawReference)
      return []
    }

    if (resolved.normalizedFrom && resolved.normalizedFrom !== resolved.key) {
      normalized.source_chips.push(formatNormalizedPair(resolved.normalizedFrom, resolved.key))
    }

    return [
      {
        element_kind: inputChip.element_kind,
        element_key: inputChip.element_key,
        element_label: inputChip.element_label,
        link_target: inputChip.link_target,
        role_in_layer: chip.role_in_layer.trim() || inputChip.role_in_layer,
        reason_used: chip.reason_used.trim() || inputChip.reason_used,
      },
    ]
  })

  const cleanedSourceLogic = params.section.pro.source_logic.flatMap((entry) => {
    const resolved = resolveCanonicalSourceKey({
      elementKeyOrFullKey: entry.source_element_key,
      allowedKeys,
      allowedKeysByRawElementKey,
    })

    if (!resolved.key) {
      removed.pro_source_logic.push(entry.source_element_key)
      return []
    }

    const inputChip = byFullKey.get(resolved.key)
    if (!inputChip) {
      removed.pro_source_logic.push(entry.source_element_key)
      return []
    }

    if (resolved.normalizedFrom && resolved.normalizedFrom !== resolved.key) {
      normalized.pro_source_logic.push(formatNormalizedPair(resolved.normalizedFrom, resolved.key))
    }

    return [
      {
        ...entry,
        source_element_key: resolved.key,
        source_label: entry.source_label.trim() || inputChip.element_label,
      },
    ]
  })

  const cleanedSummaryKeys: string[] = []
  for (const rawKey of params.section.summary_for_synthesis.source_element_keys) {
    const resolved = resolveCanonicalSourceKey({
      elementKeyOrFullKey: rawKey,
      allowedKeys,
      allowedKeysByRawElementKey,
    })

    if (!resolved.key) {
      removed.summary_source_element_keys.push(rawKey)
      continue
    }

    if (resolved.normalizedFrom && resolved.normalizedFrom !== resolved.key) {
      normalized.summary_source_element_keys.push(formatNormalizedPair(resolved.normalizedFrom, resolved.key))
    }

    cleanedSummaryKeys.push(resolved.key)
  }

  const dedupedSummaryKeys = dedupePreserveOrder(cleanedSummaryKeys)

  let finalSourceChips = cleanedSourceChips
  let rebuiltSourceChips = false

  if (finalSourceChips.length === 0) {
    const rebuilt = rebuildSourceChipsFromValidKeys({
      proSourceLogicKeys: cleanedSourceLogic.map((entry) => entry.source_element_key),
      summarySourceKeys: dedupedSummaryKeys,
      byFullKey,
    })

    if (rebuilt.length > 0) {
      finalSourceChips = rebuilt
      rebuiltSourceChips = true
    }
  }

  const section: TalentMapGeneratedSection = {
    ...params.section,
    source_chips: finalSourceChips,
    pro: {
      ...params.section.pro,
      source_logic: cleanedSourceLogic,
    },
    summary_for_synthesis: {
      ...params.section.summary_for_synthesis,
      source_element_keys: dedupedSummaryKeys,
    },
  }

  const removedUnknownCount =
    removed.source_chips.length +
    removed.pro_source_logic.length +
    removed.summary_source_element_keys.length
  const normalizedCount =
    normalized.source_chips.length +
    normalized.pro_source_logic.length +
    normalized.summary_source_element_keys.length

  const warnings: TalentMapGeneratedSectionQualityFlag[] = []

  if (removedUnknownCount > 0) {
    const details = [
      ...removed.source_chips,
      ...removed.pro_source_logic,
      ...removed.summary_source_element_keys,
    ]
    warnings.push(integrityWarning('source_integrity.removed_unknown_sources', details.join(', ')))
  }

  if (rebuiltSourceChips) {
    warnings.push(
      integrityWarning(
        'source_integrity.rebuilt_source_chips_from_valid_keys',
        `${finalSourceChips.length} chip(s) rebuilt from pro/summary references`,
      ),
    )
  }

  if (section.source_chips.length === 0) {
    warnings.push(integrityWarning('source_integrity.empty_after_cleanup', 'empty source references after cleanup'))
  } else if (!isStandardSnapshot && section.pro.source_logic.length === 0) {
    warnings.push(integrityWarning('source_integrity.empty_after_cleanup', 'empty source references after cleanup'))
  }

  return {
    section,
    warnings,
    removed,
    normalized,
    stats: {
      input_source_chip_count: inputSourceChips.length,
      output_source_chip_count: section.source_chips.length,
      removed_unknown_source_count: removedUnknownCount,
      normalized_source_key_count: normalizedCount,
    },
  }
}
