import type { TalentMapGeneratedSection } from './talentMapGeneratedSectionContract'
import type { SourceChip } from './talentMapSynthesisContract'

export type TalentMapGeneratedSectionQualityFlag = string

export function sourceChipFullKey(chip: { element_kind: string; element_key: string }): string {
  return `${chip.element_kind}:${chip.element_key}`
}

function integrityWarning(category: string, detail: string): TalentMapGeneratedSectionQualityFlag {
  return `warning: ${category}: ${detail}`
}

function buildInputChipIndex(sourceChips: SourceChip[]): {
  byFullKey: Map<string, SourceChip>
  byElementKey: Map<string, SourceChip[]>
} {
  const byFullKey = new Map<string, SourceChip>()
  const byElementKey = new Map<string, SourceChip[]>()

  for (const chip of sourceChips) {
    byFullKey.set(sourceChipFullKey(chip), chip)
    const existing = byElementKey.get(chip.element_key) ?? []
    existing.push(chip)
    byElementKey.set(chip.element_key, existing)
  }

  return { byFullKey, byElementKey }
}

function resolveAllowedSourceKey(
  rawKey: string,
  whitelist: Set<string>,
  byElementKey: Map<string, SourceChip[]>,
): { key: string | null; normalized: boolean } {
  if (whitelist.has(rawKey)) {
    return { key: rawKey, normalized: false }
  }

  const matches = byElementKey.get(rawKey) ?? []
  if (matches.length === 1) {
    return { key: sourceChipFullKey(matches[0]), normalized: true }
  }

  return { key: null, normalized: false }
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

export function enforceGeneratedSectionSourceIntegrity(params: {
  section: TalentMapGeneratedSection
  inputSourceChips: SourceChip[]
}): {
  section: TalentMapGeneratedSection
  warnings: TalentMapGeneratedSectionQualityFlag[]
  removed: {
    source_chips: string[]
    pro_source_logic: string[]
    summary_source_element_keys: string[]
  }
  normalized: {
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
  const whitelist = new Set(inputSourceChips.map(sourceChipFullKey))
  const { byFullKey, byElementKey } = buildInputChipIndex(inputSourceChips)

  const removed = {
    source_chips: [] as string[],
    pro_source_logic: [] as string[],
    summary_source_element_keys: [] as string[],
  }
  const normalized = {
    pro_source_logic: [] as string[],
    summary_source_element_keys: [] as string[],
  }

  const cleanedSourceChips = params.section.source_chips.flatMap((chip) => {
    const fullKey = sourceChipFullKey(chip)
    if (!whitelist.has(fullKey)) {
      removed.source_chips.push(fullKey)
      return []
    }

    const inputChip = byFullKey.get(fullKey)
    if (!inputChip) {
      removed.source_chips.push(fullKey)
      return []
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
    const resolved = resolveAllowedSourceKey(
      entry.source_element_key,
      whitelist,
      byElementKey,
    )

    if (!resolved.key) {
      removed.pro_source_logic.push(entry.source_element_key)
      return []
    }

    const inputChip = byFullKey.get(resolved.key)
    if (!inputChip) {
      removed.pro_source_logic.push(entry.source_element_key)
      return []
    }

    if (resolved.normalized) {
      normalized.pro_source_logic.push(`${entry.source_element_key} → ${resolved.key}`)
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
    const resolved = resolveAllowedSourceKey(rawKey, whitelist, byElementKey)
    if (!resolved.key) {
      removed.summary_source_element_keys.push(rawKey)
      continue
    }

    if (resolved.normalized) {
      normalized.summary_source_element_keys.push(`${rawKey} → ${resolved.key}`)
    }

    cleanedSummaryKeys.push(resolved.key)
  }

  const section: TalentMapGeneratedSection = {
    ...params.section,
    source_chips: cleanedSourceChips,
    pro: {
      ...params.section.pro,
      source_logic: cleanedSourceLogic,
    },
    summary_for_synthesis: {
      ...params.section.summary_for_synthesis,
      source_element_keys: dedupePreserveOrder(cleanedSummaryKeys),
    },
  }

  const removedUnknownCount =
    removed.source_chips.length +
    removed.pro_source_logic.length +
    removed.summary_source_element_keys.length
  const normalizedCount =
    normalized.pro_source_logic.length + normalized.summary_source_element_keys.length

  const warnings: TalentMapGeneratedSectionQualityFlag[] = []

  if (removedUnknownCount > 0) {
    const details = [
      ...removed.source_chips,
      ...removed.pro_source_logic,
      ...removed.summary_source_element_keys,
    ]
    warnings.push(integrityWarning('source_integrity.removed_unknown_sources', details.join(', ')))
  }

  if (normalizedCount > 0) {
    const details = [...normalized.pro_source_logic, ...normalized.summary_source_element_keys]
    warnings.push(integrityWarning('source_integrity.normalized_source_keys', details.join(', ')))
  }

  if (section.source_chips.length === 0 || section.pro.source_logic.length === 0) {
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
