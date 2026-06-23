import {
  TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION,
  cleanGeneratedText,
  type TalentMapGeneratedSection,
  type TalentMapGeneratedSectionBaseBlock,
} from './talentMapGeneratedSectionContract'
import {
  resolveCanonicalSourceKey,
  sourceChipFullKey,
} from './talentMapGeneratedSectionSourceIntegrity'
import type { SourceChip } from './talentMapSynthesisContract'

export const TALENT_MAP_STANDARD_SNAPSHOT_SCHEMA_VERSION =
  'talent_map_standard_snapshot_v1_0' as const

export type TalentMapStandardSnapshot = {
  schema_version: typeof TALENT_MAP_STANDARD_SNAPSHOT_SCHEMA_VERSION
  section_key: 'work_mode_and_entry'
  section_title: 'Рабочий формат и вход в задачи'

  headline: string
  snapshot_paragraph: string

  summary_for_synthesis: {
    one_sentence: string
    key_conditions: string[]
    potential_risks: string[]
    source_element_keys: string[]
  }

  qa: {
    base_language_checked: boolean
    forbidden_terms_checked: boolean
    source_keys_checked: boolean
    no_role_fit_checked: boolean
  }
}

export type TalentMapGenerationMode = 'standard_snapshot' | 'full_section'

export type TalentMapInputBundleMode = 'standard_snapshot_input_v1' | 'full_section_input_v1'

export type TalentMapOpenAiSchemaName =
  | 'talent_map_standard_snapshot_v1_0'
  | 'talent_map_generated_section_v1_1'

const STANDARD_COMPATIBILITY_BLOCK_TITLE = 'Стандартный snapshot: подробный блок не генерировался'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function validateSummaryForSynthesis(value: unknown, issues: string[]): void {
  if (!value || typeof value !== 'object') {
    issues.push('summary_for_synthesis must be an object.')
    return
  }

  const summary = value as Record<string, unknown>
  if (!isNonEmptyString(summary.one_sentence)) {
    issues.push('summary_for_synthesis.one_sentence must be a non-empty string.')
  }

  if (!isStringArray(summary.key_conditions)) {
    issues.push('summary_for_synthesis.key_conditions must be a string array.')
  } else if (summary.key_conditions.length < 1 || summary.key_conditions.length > 3) {
    issues.push('summary_for_synthesis.key_conditions must contain 1–3 items.')
  }

  if (!isStringArray(summary.potential_risks)) {
    issues.push('summary_for_synthesis.potential_risks must be a string array.')
  } else if (summary.potential_risks.length < 1 || summary.potential_risks.length > 3) {
    issues.push('summary_for_synthesis.potential_risks must contain 1–3 items.')
  }

  if (!isStringArray(summary.source_element_keys)) {
    issues.push('summary_for_synthesis.source_element_keys must be a string array.')
  }
}

function validateQaBlock(value: unknown, issues: string[]): void {
  if (!value || typeof value !== 'object') {
    issues.push('qa must be an object.')
    return
  }

  const qa = value as Record<string, unknown>
  for (const field of [
    'base_language_checked',
    'forbidden_terms_checked',
    'source_keys_checked',
    'no_role_fit_checked',
  ] as const) {
    if (typeof qa[field] !== 'boolean') {
      issues.push(`qa.${field} must be a boolean.`)
    }
  }
}

export function validateTalentMapStandardSnapshot(value: unknown): {
  ok: boolean
  data?: TalentMapStandardSnapshot
  issues: string[]
} {
  const issues: string[] = []

  if (!value || typeof value !== 'object') {
    return { ok: false, issues: ['Root value must be an object.'] }
  }

  const record = value as Record<string, unknown>

  if (record.schema_version !== TALENT_MAP_STANDARD_SNAPSHOT_SCHEMA_VERSION) {
    issues.push(`schema_version must be "${TALENT_MAP_STANDARD_SNAPSHOT_SCHEMA_VERSION}".`)
  }

  if (record.section_key !== 'work_mode_and_entry') {
    issues.push('section_key must be "work_mode_and_entry".')
  }

  if (record.section_title !== 'Рабочий формат и вход в задачи') {
    issues.push('section_title must be "Рабочий формат и вход в задачи".')
  }

  if (!isNonEmptyString(record.headline)) {
    issues.push('headline must be a non-empty string.')
  }

  if (!isNonEmptyString(record.snapshot_paragraph)) {
    issues.push('snapshot_paragraph must be a non-empty string.')
  }

  validateSummaryForSynthesis(record.summary_for_synthesis, issues)
  validateQaBlock(record.qa, issues)

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return { ok: true, data: record as TalentMapStandardSnapshot, issues: [] }
}

export function cleanStandardSnapshotText(snapshot: TalentMapStandardSnapshot): TalentMapStandardSnapshot {
  return {
    ...snapshot,
    headline: cleanGeneratedText(snapshot.headline),
    snapshot_paragraph: cleanGeneratedText(snapshot.snapshot_paragraph),
    summary_for_synthesis: {
      one_sentence: cleanGeneratedText(snapshot.summary_for_synthesis.one_sentence),
      key_conditions: snapshot.summary_for_synthesis.key_conditions.map(cleanGeneratedText),
      potential_risks: snapshot.summary_for_synthesis.potential_risks.map(cleanGeneratedText),
      source_element_keys: snapshot.summary_for_synthesis.source_element_keys.map(cleanGeneratedText),
    },
  }
}

export function buildStandardCompatibilityBaseBlock(title: string): TalentMapGeneratedSectionBaseBlock {
  return {
    title,
    points: [],
  }
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

export function reconstructSourceChipsFromKeys(params: {
  sourceElementKeys: string[]
  inputSourceChips: SourceChip[]
}): SourceChip[] {
  const { allowedKeys, byFullKey, allowedKeysByRawElementKey } = buildAllowedKeysIndex(
    params.inputSourceChips,
  )

  const resolvedKeys = dedupePreserveOrder(
    params.sourceElementKeys.flatMap((rawKey) => {
      const resolved = resolveCanonicalSourceKey({
        elementKeyOrFullKey: rawKey,
        allowedKeys,
        allowedKeysByRawElementKey,
      })
      return resolved.key ? [resolved.key] : []
    }),
  )

  return resolvedKeys.flatMap((key) => {
    const inputChip = byFullKey.get(key)
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

export function adaptStandardSnapshotToGeneratedSection(params: {
  snapshot: TalentMapStandardSnapshot
  inputSourceChips: SourceChip[]
}): TalentMapGeneratedSection {
  const { snapshot } = params
  const compatibilityTitle = STANDARD_COMPATIBILITY_BLOCK_TITLE

  return {
    schema_version: TALENT_MAP_GENERATED_SECTION_SCHEMA_VERSION,
    section_key: 'work_mode_and_entry',
    section_title: 'Рабочий формат и вход в задачи',
    base: {
      headline: snapshot.headline,
      hr_summary: snapshot.snapshot_paragraph,
      how_to_start_work: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      best_task_format: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      manager_instructions: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      useful_in_roles: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      risks_if_wrong_entry: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      interview_or_trial_checks: buildStandardCompatibilityBaseBlock(compatibilityTitle),
      first_working_experiments: buildStandardCompatibilityBaseBlock(compatibilityTitle),
    },
    pro: {
      technical_summary: '',
      source_logic: [],
      interpretation_limits: [],
      reality_checks: [],
    },
    source_chips: reconstructSourceChipsFromKeys({
      sourceElementKeys: snapshot.summary_for_synthesis.source_element_keys,
      inputSourceChips: params.inputSourceChips,
    }),
    summary_for_synthesis: {
      one_sentence: snapshot.summary_for_synthesis.one_sentence,
      key_conditions: snapshot.summary_for_synthesis.key_conditions,
      potential_risks: snapshot.summary_for_synthesis.potential_risks,
      source_element_keys: snapshot.summary_for_synthesis.source_element_keys,
    },
    qa: {
      base_language_checked: snapshot.qa.base_language_checked,
      forbidden_terms_checked: snapshot.qa.forbidden_terms_checked,
      source_chips_checked: snapshot.qa.source_keys_checked,
      limitations_present: true,
    },
  }
}
