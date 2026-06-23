import { enrichSectionInputForOpenAi, buildSanitizedSectionInputForAi } from './talentMapSectionOpenAiSchema'
import { getTalentMapDepthProfile } from './talentMapDepthProfiles'
import type { TalentMapModelPreset } from './talentMapModelPresets'
import type { SectionSourceDigest } from './talentMapSectionTypes'
import { sourceChipFullKey } from './talentMapGeneratedSectionSourceIntegrity'
import type { SourceChip } from './talentMapSynthesisContract'
import type {
  TalentMapGenerationMode,
  TalentMapInputBundleMode,
} from './talentMapStandardSnapshotContract'

export const STANDARD_SNAPSHOT_INPUT_CONTRACT = 'standard_snapshot_input_v1' as const
export const FULL_SECTION_INPUT_CONTRACT = 'full_section_input_v1' as const

const STANDARD_SNAPSHOT_DIGEST_MAX = 8
const STANDARD_SNAPSHOT_DIGEST_MIN = 6

type SanitizedSectionInput = ReturnType<typeof buildSanitizedSectionInputForAi> & {
  generation_input_contract?: string
  input_bundle_mode?: string
  generation_depth_profile?: unknown
}

type CompactSourceDigest = {
  source_key: string
  element_label: string | null
  source_role: string
  plain_meaning?: string
  work_manifestation?: string
  management_hint?: string
  environment_hint?: string
  risk_hint?: string
  limitation?: string
}

function isStandardSnapshotInput(value: unknown): boolean {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as Record<string, unknown>).generation_input_contract === STANDARD_SNAPSHOT_INPUT_CONTRACT
  )
}

function firstNonEmptyString(values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return undefined
}

function firstArrayItem(values: unknown[] | undefined): string | undefined {
  if (!Array.isArray(values)) {
    return undefined
  }
  return firstNonEmptyString(values)
}

function buildCompactSourceDigest(digest: SectionSourceDigest): CompactSourceDigest {
  const { digest: payload } = digest
  const compact: CompactSourceDigest = {
    source_key: sourceChipFullKey(digest),
    element_label: digest.element_label,
    source_role: digest.source_role,
  }

  const plainMeaning = firstNonEmptyString([payload.plain_meaning])
  if (plainMeaning) {
    compact.plain_meaning = plainMeaning.slice(0, 280)
  }

  const workManifestation = firstNonEmptyString([payload.work_manifestation])
  if (workManifestation) {
    compact.work_manifestation = workManifestation.slice(0, 280)
  }

  const managementHint = firstArrayItem(payload.management_hints)
  if (managementHint) {
    compact.management_hint = managementHint.slice(0, 200)
  }

  const environmentHint = firstArrayItem(payload.environment_hints)
  if (environmentHint) {
    compact.environment_hint = environmentHint.slice(0, 200)
  }

  const riskHint = firstArrayItem(payload.risks)
  if (riskHint) {
    compact.risk_hint = riskHint.slice(0, 200)
  }

  const limitation = firstArrayItem(payload.limitations)
  if (limitation) {
    compact.limitation = limitation.slice(0, 200)
  }

  return compact
}

function rankSourceDigests(digests: SectionSourceDigest[]): SectionSourceDigest[] {
  const rolePriority: Record<string, number> = {
    primary: 0,
    supporting: 1,
    context: 2,
  }

  return [...digests].sort((left, right) => {
    const leftRole = rolePriority[left.source_role] ?? 3
    const rightRole = rolePriority[right.source_role] ?? 3
    if (leftRole !== rightRole) {
      return leftRole - rightRole
    }

    return (right.rank_score ?? 0) - (left.rank_score ?? 0)
  })
}

function selectCompactSourceDigests(digests: SectionSourceDigest[]): CompactSourceDigest[] {
  const ranked = rankSourceDigests(digests)
  const limit = Math.min(STANDARD_SNAPSHOT_DIGEST_MAX, Math.max(STANDARD_SNAPSHOT_DIGEST_MIN, ranked.length))
  return ranked.slice(0, limit).map(buildCompactSourceDigest)
}

export function buildStandardSnapshotInputForAi(params: {
  sectionInput: SanitizedSectionInput
  sectionGoal: string
  sourceChips: SourceChip[]
}) {
  const sourceDigests = Array.isArray(params.sectionInput.source_digests)
    ? (params.sectionInput.source_digests as SectionSourceDigest[])
    : []

  return {
    generation_input_contract: STANDARD_SNAPSHOT_INPUT_CONTRACT,
    section_key: params.sectionInput.section_key,
    section_title: params.sectionInput.section_title,
    section_goal: params.sectionGoal,
    allowed_source_chip_keys: params.sourceChips.map(sourceChipFullKey),
    source_chips_compact: params.sourceChips.map((chip) => ({
      source_key: sourceChipFullKey(chip),
      element_label: chip.element_label || null,
      role_in_layer: chip.role_in_layer,
      reason_used: chip.reason_used,
    })),
    source_digests_compact: selectCompactSourceDigests(sourceDigests),
    guardrails: {
      no_hd_terms_in_visible_text: true,
      no_role_fit: true,
      no_vacancy_fit: true,
      no_scores: true,
      no_hire_decision: true,
    },
    output_rules: {
      visible_format: 'headline_plus_one_paragraph',
      paragraph_target_chars: '600-1000',
      paragraph_min_chars: 450,
      paragraph_max_chars: 1100,
    },
  }
}

export function resolveSectionGenerationInputForPreset(params: {
  sanitizedInput: SanitizedSectionInput
  sourceChips: SourceChip[]
  modelPreset: TalentMapModelPreset
  sectionGoal: string
}): {
  inputForOpenAi: unknown
  persistedSectionInput: unknown
  inputBundleMode: TalentMapInputBundleMode
  generationMode: TalentMapGenerationMode
} {
  if (params.modelPreset.id === 'standard') {
    if (isStandardSnapshotInput(params.sanitizedInput)) {
      return {
        inputForOpenAi: params.sanitizedInput,
        persistedSectionInput: params.sanitizedInput,
        inputBundleMode: 'standard_snapshot_input_v1',
        generationMode: 'standard_snapshot',
      }
    }

    const standardInput = buildStandardSnapshotInputForAi({
      sectionInput: params.sanitizedInput,
      sectionGoal: params.sectionGoal,
      sourceChips: params.sourceChips,
    })

    return {
      inputForOpenAi: standardInput,
      persistedSectionInput: standardInput,
      inputBundleMode: 'standard_snapshot_input_v1',
      generationMode: 'standard_snapshot',
    }
  }

  if (
    params.sanitizedInput.generation_input_contract === FULL_SECTION_INPUT_CONTRACT &&
    params.sanitizedInput.generation_depth_profile
  ) {
    return {
      inputForOpenAi: params.sanitizedInput,
      persistedSectionInput: params.sanitizedInput,
      inputBundleMode: 'full_section_input_v1',
      generationMode: 'full_section',
    }
  }

  const depthProfile = getTalentMapDepthProfile(params.modelPreset.depth_profile_id)
  const enrichedInput = enrichSectionInputForOpenAi({
    sectionInput: params.sanitizedInput,
    depthProfile,
    sourceChips: params.sourceChips,
  })

  const fullInput = {
    ...enrichedInput,
    generation_input_contract: FULL_SECTION_INPUT_CONTRACT,
    input_bundle_mode: 'full_section_input_v1',
  }

  return {
    inputForOpenAi: fullInput,
    persistedSectionInput: fullInput,
    inputBundleMode: 'full_section_input_v1',
    generationMode: 'full_section',
  }
}
