import type { TalentMapSynthesisInputPreview, SectionInputPreview } from './buildTalentMapSynthesisInput'
import { TALENT_MAP_SECTION_KEYS, type TalentMapSectionKey } from './talentMapSections'
import { SECTION_DIGEST_TOTAL_MAX } from './talentMapSourceBudget'
import {
  GLOBAL_FORBIDDEN_FIELDS,
  GLOBAL_FORBIDDEN_PHRASES,
} from './talentMapSynthesisContract'
import type { SectionSourceDigest } from './talentMapSectionTypes'

export type SectionInputAuditSeverity = 'ok' | 'info' | 'warning' | 'error'

export type SectionInputAuditIssue = {
  severity: Exclude<SectionInputAuditSeverity, 'ok'>
  check_id: string
  section_key?: TalentMapSectionKey | null
  message: string
  element_kind?: string
  element_key?: string
}

export type SectionInputAuditSummary = {
  section_key: TalentMapSectionKey
  section_title: string
  total_selected: number
  omitted_by_budget: number
  severity: SectionInputAuditSeverity
  issue_counts: {
    info: number
    warning: number
    error: number
  }
}

export type TalentMapSectionInputAuditReport = {
  overall_severity: SectionInputAuditSeverity
  candidate_id: string
  chart_id: string
  section_count: number
  total_source_bundle_size: number | null
  summary: {
    ok: number
    info: number
    warning: number
    error: number
  }
  section_summaries: SectionInputAuditSummary[]
  issues: SectionInputAuditIssue[]
  flags: {
    old_d0_keys_in_selected_digests: boolean
    old_d0_keys_in_selected_fields: boolean
    activation_role_standalone: boolean
    any_section_selected_all_sources: boolean
  }
}

export const OLD_D0_SECTION_KEYS = [
  'work_style',
  'decision_and_stability',
  'communication_and_influence',
  'risks_and_distortions',
  'management_and_environment',
  'pro_foundation',
] as const

export type OldD0SectionKey = (typeof OLD_D0_SECTION_KEYS)[number]

const OLD_D0_KEY_SET = new Set<string>(OLD_D0_SECTION_KEYS)

const CANONICAL_SECTION_KEY_SET = new Set<string>(TALENT_MAP_SECTION_KEYS)

const FORBIDDEN_STANDALONE_SOURCE_KINDS = new Set([
  'activation_role',
  'planet',
  'line',
  'side',
])

const FORBIDDEN_OUTPUT_FIELDS = [
  ...GLOBAL_FORBIDDEN_FIELDS,
  'fit_score',
  'fit_percent',
  'match_score',
  'match_percentage',
  'role_fit',
  'vacancy_fit',
] as const

const FORBIDDEN_OUTPUT_PHRASES = [
  ...GLOBAL_FORBIDDEN_PHRASES,
  'подходит на',
  'соответствует на',
  'нанять',
  'не нанять',
  'не нанимать',
] as const

const PRO_PAYLOAD_KEYS = new Set(['pro_markdown', 'pro_layers', 'classic_markdown'])

const CLOSE_TO_ALL_SOURCES_RATIO = 0.85

type OldKeyOccurrence = {
  path: string
  key: string
}

type IssueDraft = Omit<SectionInputAuditIssue, 'severity'> & {
  severity: Exclude<SectionInputAuditSeverity, 'ok'>
}

function worstSeverity(
  current: SectionInputAuditSeverity,
  next: Exclude<SectionInputAuditSeverity, 'ok'>,
): SectionInputAuditSeverity {
  const order: Record<SectionInputAuditSeverity, number> = {
    ok: 0,
    info: 1,
    warning: 2,
    error: 3,
  }
  return order[next] > order[current] ? next : current
}

function addIssue(issues: IssueDraft[], issue: IssueDraft): void {
  issues.push(issue)
}

function findOldD0KeyOccurrences(
  value: unknown,
  path = '$',
  skipPaths: readonly string[] = [],
): OldKeyOccurrence[] {
  if (value === null || value === undefined) {
    return []
  }

  if (typeof value === 'string') {
    if (OLD_D0_KEY_SET.has(value)) {
      return [{ path, key: value }]
    }
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const itemPath = `${path}[${index}]`
      if (skipPaths.some((skip) => itemPath.startsWith(skip))) {
        return []
      }
      return findOldD0KeyOccurrences(item, itemPath, skipPaths)
    })
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return entries.flatMap(([key, nested]) => {
      const keyPath = path === '$' ? key : `${path}.${key}`
      if (skipPaths.some((skip) => keyPath.startsWith(skip))) {
        return []
      }

      const hits: OldKeyOccurrence[] = []
      if (OLD_D0_KEY_SET.has(key)) {
        hits.push({ path: keyPath, key })
      }
      hits.push(...findOldD0KeyOccurrences(nested, keyPath, skipPaths))
      return hits
    })
  }

  return []
}

function collectForbiddenFieldHits(
  value: unknown,
  path = '$',
): Array<{ path: string; field: string }> {
  if (value === null || value === undefined) {
    return []
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    const hits: Array<{ path: string; field: string }> = []

    for (const field of FORBIDDEN_OUTPUT_FIELDS) {
      if (lower.includes(field.toLowerCase())) {
        hits.push({ path, field })
      }
    }

    for (const phrase of FORBIDDEN_OUTPUT_PHRASES) {
      if (lower.includes(phrase.toLowerCase())) {
        hits.push({ path, field: phrase })
      }
    }

    const percentHirePattern = /(подходит|соответствует)\s+на\s+\d+\s*%/i
    if (percentHirePattern.test(value)) {
      hits.push({ path, field: 'percentage_hire_wording' })
    }

    const hireDecisionPattern = /(нанять|не\s+нанять)/i
    if (hireDecisionPattern.test(value)) {
      hits.push({ path, field: 'hire_decision_wording' })
    }

    return hits
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectForbiddenFieldHits(item, `${path}[${index}]`),
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return entries.flatMap(([key, nested]) => {
      const keyPath = path === '$' ? key : `${path}.${key}`
      const hits: Array<{ path: string; field: string }> = []

      if (FORBIDDEN_OUTPUT_FIELDS.some((field) => field.toLowerCase() === key.toLowerCase())) {
        hits.push({ path: keyPath, field: key })
      }

      hits.push(...collectForbiddenFieldHits(nested, keyPath))
      return hits
    })
  }

  return []
}

function hasProPayload(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasProPayload(item))
  }

  if (typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (PRO_PAYLOAD_KEYS.has(key)) {
        return true
      }
      if (hasProPayload(nested)) {
        return true
      }
    }
  }

  return false
}

function isDigestEmpty(digest: SectionSourceDigest['digest']): boolean {
  if (digest.plain_meaning?.trim()) return false
  if (digest.work_manifestation?.trim()) return false
  if (digest.context_note?.trim()) return false

  for (const key of [
    'strengths',
    'risks',
    'management_hints',
    'environment_hints',
    'limitations',
  ] as const) {
    const items = digest[key]
    if (items?.some((item) => item.trim())) {
      return false
    }
  }

  return true
}

function digestCharCount(digest: SectionSourceDigest['digest']): number {
  const parts: string[] = []
  if (digest.plain_meaning) parts.push(digest.plain_meaning)
  if (digest.work_manifestation) parts.push(digest.work_manifestation)
  for (const key of [
    'strengths',
    'risks',
    'management_hints',
    'environment_hints',
    'limitations',
  ] as const) {
    const value = digest[key]
    if (value) {
      parts.push(value.join(' '))
    }
  }
  if (digest.context_note) parts.push(digest.context_note)
  return parts.join(' ').length
}

function auditSectionContract(preview: TalentMapSynthesisInputPreview, issues: IssueDraft[]): void {
  if (preview.sections.length !== TALENT_MAP_SECTION_KEYS.length) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'section_contract.count',
      section_key: null,
      message: `Ожидается ${TALENT_MAP_SECTION_KEYS.length} разделов карты талантов, получено ${preview.sections.length}.`,
    })
  }

  const sectionKeys = preview.sections.map((section) => section.section_key)
  const expectedKeys = [...TALENT_MAP_SECTION_KEYS]

  if (
    sectionKeys.length !== expectedKeys.length ||
    sectionKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'section_contract.keys',
      section_key: null,
      message: `Ключи разделов не совпадают с каноническим списком: ${sectionKeys.join(', ')}.`,
    })
  }

  for (const section of preview.sections) {
    if (OLD_D0_KEY_SET.has(section.section_key)) {
      addIssue(issues, {
        severity: 'error',
        check_id: 'section_contract.old_d0_section_key',
        section_key: section.section_key as TalentMapSectionKey,
        message: `Раздел использует устаревший D0 key «${section.section_key}».`,
      })
    }
  }

  for (const layer of preview.layers) {
    if (OLD_D0_KEY_SET.has(layer.section_key)) {
      addIssue(issues, {
        severity: 'error',
        check_id: 'section_contract.old_d0_layer_key',
        section_key: layer.section_key as TalentMapSectionKey,
        message: `Слой preview использует устаревший D0 key «${layer.section_key}».`,
      })
    }

    if (!CANONICAL_SECTION_KEY_SET.has(layer.section_key)) {
      addIssue(issues, {
        severity: 'error',
        check_id: 'section_contract.invalid_layer_key',
        section_key: layer.section_key as TalentMapSectionKey,
        message: `Слой preview содержит неканонический ключ «${layer.section_key}».`,
      })
    }
  }

  if (preview.layers.length !== TALENT_MAP_SECTION_KEYS.length) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'section_contract.layer_count',
      section_key: null,
      message: `Ожидается ${TALENT_MAP_SECTION_KEYS.length} layer keys в preview, получено ${preview.layers.length}.`,
    })
  }

  const layerKeys = preview.layers.map((layer) => layer.section_key)
  if (
    layerKeys.length !== expectedKeys.length ||
    layerKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'section_contract.layer_keys',
      section_key: null,
      message: `Layer keys preview не совпадают с каноническим списком: ${layerKeys.join(', ')}.`,
    })
  }

  if (preview.sections.some((section) => String(section.section_key) === 'pro_foundation')) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'section_contract.pro_foundation_section',
      section_key: null,
      message: 'pro_foundation не должен быть разделом карты талантов.',
    })
  }
}

function auditBudgetAndSources(
  section: SectionInputPreview,
  totalBundleSize: number | null,
  issues: IssueDraft[],
): boolean {
  const { budget_summary: budget } = section
  let selectedAllSources = false

  if (budget.total_selected > budget.total_max) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.total_selected',
      section_key: section.section_key,
      message: `Выбрано источников (${budget.total_selected}) больше budget total_max (${budget.total_max}).`,
    })
  }

  if (budget.primary_selected > budget.primary_max) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.primary_selected',
      section_key: section.section_key,
      message: `Primary источников (${budget.primary_selected}) больше primary_max (${budget.primary_max}).`,
    })
  }

  if (budget.supporting_selected > budget.supporting_max) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.supporting_selected',
      section_key: section.section_key,
      message: `Supporting источников (${budget.supporting_selected}) больше supporting_max (${budget.supporting_max}).`,
    })
  }

  if (budget.context_selected > budget.context_max) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.context_selected',
      section_key: section.section_key,
      message: `Context источников (${budget.context_selected}) больше context_max (${budget.context_max}).`,
    })
  }

  if (section.source_items.length !== budget.total_selected) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.source_items_length',
      section_key: section.section_key,
      message: `source_items (${section.source_items.length}) не совпадает с total_selected (${budget.total_selected}).`,
    })
  }

  if (section.source_digests.length !== section.source_items.length) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.source_digests_length',
      section_key: section.section_key,
      message: `source_digests (${section.source_digests.length}) не совпадает с source_items (${section.source_items.length}).`,
    })
  }

  if (section.omitted_by_budget.length !== budget.omitted_count) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'budget.omitted_count',
      section_key: section.section_key,
      message: `omitted_by_budget (${section.omitted_by_budget.length}) не совпадает с omitted_count (${budget.omitted_count}).`,
    })
  }

  if (totalBundleSize !== null && totalBundleSize > 0) {
    if (budget.total_selected === totalBundleSize) {
      selectedAllSources = true
      addIssue(issues, {
        severity: 'warning',
        check_id: 'budget.selected_all_sources',
        section_key: section.section_key,
        message: `Раздел выбрал все ${totalBundleSize} источников bundle — проверьте ranking/budget.`,
      })
    } else if (budget.total_selected / totalBundleSize >= CLOSE_TO_ALL_SOURCES_RATIO) {
      addIssue(issues, {
        severity: 'warning',
        check_id: 'budget.selected_near_all_sources',
        section_key: section.section_key,
        message: `Раздел выбрал ${budget.total_selected} из ${totalBundleSize} источников bundle — подозрительно много.`,
      })
    }
  }

  return selectedAllSources
}

function auditActivationGuardrails(section: SectionInputPreview, issues: IssueDraft[]): boolean {
  let activationRoleStandalone = false

  for (const item of section.source_items) {
    if (FORBIDDEN_STANDALONE_SOURCE_KINDS.has(item.element_kind)) {
      activationRoleStandalone = activationRoleStandalone || item.element_kind === 'activation_role'
      addIssue(issues, {
        severity: 'error',
        check_id: 'activation.standalone_source_item',
        section_key: section.section_key,
        message: `source_items содержит запрещённый standalone kind «${item.element_kind}».`,
        element_kind: item.element_kind,
        element_key: item.element_key,
      })
    }
  }

  for (const chip of section.source_chips) {
    if (FORBIDDEN_STANDALONE_SOURCE_KINDS.has(chip.element_kind)) {
      activationRoleStandalone = activationRoleStandalone || chip.element_kind === 'activation_role'
      addIssue(issues, {
        severity: 'error',
        check_id: 'activation.standalone_source_chip',
        section_key: section.section_key,
        message: `source_chips содержит запрещённый standalone kind «${chip.element_kind}».`,
        element_kind: chip.element_kind,
        element_key: chip.element_key,
      })
    }
  }

  for (const digest of section.source_digests) {
    if (FORBIDDEN_STANDALONE_SOURCE_KINDS.has(digest.element_kind)) {
      activationRoleStandalone =
        activationRoleStandalone || digest.element_kind === 'activation_role'
      addIssue(issues, {
        severity: 'error',
        check_id: 'activation.standalone_source_digest',
        section_key: section.section_key,
        message: `source_digests содержит запрещённый standalone kind «${digest.element_kind}».`,
        element_kind: digest.element_kind,
        element_key: digest.element_key,
      })
    }
  }

  return activationRoleStandalone
}

function auditOldD0Keys(
  section: SectionInputPreview,
  issues: IssueDraft[],
  flags: TalentMapSectionInputAuditReport['flags'],
): void {
  for (const item of section.source_items) {
    const hits = findOldD0KeyOccurrences(item.selected_interpretation_fields, '$')
    for (const hit of hits) {
      flags.old_d0_keys_in_selected_fields = true
      addIssue(issues, {
        severity: 'warning',
        check_id: 'old_d0.selected_interpretation_fields',
        section_key: section.section_key,
        message: `Устаревший D0 key «${hit.key}» в selected_interpretation_fields (${hit.path}).`,
        element_kind: item.element_kind,
        element_key: item.element_key,
      })
    }
  }

  for (const digest of section.source_digests) {
    const hits = findOldD0KeyOccurrences(digest.digest, '$')
    for (const hit of hits) {
      flags.old_d0_keys_in_selected_digests = true
      addIssue(issues, {
        severity: 'warning',
        check_id: 'old_d0.source_digest',
        section_key: section.section_key,
        message: `Устаревший D0 key «${hit.key}» в source_digests (${hit.path}).`,
        element_kind: digest.element_kind,
        element_key: digest.element_key,
      })
    }
  }

  const metadataSnapshot = {
    guardrails: section.guardrails,
    warnings: section.warnings,
    selected_fields_for_ai: section.selected_fields_for_ai,
    omitted_fields: section.omitted_fields,
    source_chips: section.source_chips,
    omitted_by_budget: section.omitted_by_budget.map((item) => ({
      element_kind: item.element_kind,
      element_key: item.element_key,
      selection_reason: item.selection_reason,
    })),
  }

  const metadataHits = findOldD0KeyOccurrences(metadataSnapshot, '$')
  const selectedHits = new Set(
    [
      ...section.source_items.flatMap((item) =>
        findOldD0KeyOccurrences(item.selected_interpretation_fields, '$').map((hit) => hit.key),
      ),
      ...section.source_digests.flatMap((digest) =>
        findOldD0KeyOccurrences(digest.digest, '$').map((hit) => hit.key),
      ),
    ].map((key) => key),
  )

  for (const hit of metadataHits) {
    if (selectedHits.has(hit.key)) {
      continue
    }

    addIssue(issues, {
      severity: 'info',
      check_id: 'old_d0.reference_metadata',
      section_key: section.section_key,
      message: `Устаревший D0 key «${hit.key}» только в reference/debug metadata (${hit.path}).`,
    })
  }
}

function auditForbiddenOutput(section: SectionInputPreview, issues: IssueDraft[]): void {
  const selectedFutureInput = {
    source_items: section.source_items.map((item) => ({
      element_kind: item.element_kind,
      element_key: item.element_key,
      selected_interpretation_fields: item.selected_interpretation_fields,
    })),
    source_digests: section.source_digests,
    selected_fields_for_ai: section.selected_fields_for_ai,
  }

  const hits = collectForbiddenFieldHits(selectedFutureInput)
  for (const hit of hits) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'forbidden_output.future_input',
      section_key: section.section_key,
      message: `Запрещённое поле или формулировка «${hit.field}» в подготовленном входе (${hit.path}).`,
    })
  }
}

function auditDigests(section: SectionInputPreview, issues: IssueDraft[]): void {
  const { budget_summary: budget } = section

  if (budget.total_digest_chars > SECTION_DIGEST_TOTAL_MAX) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'digest.total_chars',
      section_key: section.section_key,
      message: `Суммарный digest (${budget.total_digest_chars}) превышает лимит ${SECTION_DIGEST_TOTAL_MAX}.`,
    })
  }

  if (budget.estimated_input_tokens < 0) {
    addIssue(issues, {
      severity: 'error',
      check_id: 'digest.estimated_tokens',
      section_key: section.section_key,
      message: `estimated_input_tokens отрицательный (${budget.estimated_input_tokens}).`,
    })
  }

  const digestByKey = new Map(
    section.source_digests.map((digest) => [`${digest.element_kind}:${digest.element_key}`, digest]),
  )

  for (const item of section.source_items) {
    const digest = digestByKey.get(`${item.element_kind}:${item.element_key}`)
    if (!digest) {
      addIssue(issues, {
        severity: 'warning',
        check_id: 'digest.missing_for_selected',
        section_key: section.section_key,
        message: 'Для выбранного источника отсутствует digest.',
        element_kind: item.element_kind,
        element_key: item.element_key,
      })
      continue
    }

    if (isDigestEmpty(digest.digest)) {
      addIssue(issues, {
        severity: 'warning',
        check_id: 'digest.empty_for_selected',
        section_key: section.section_key,
        message: 'Digest пуст для выбранного источника.',
        element_kind: item.element_kind,
        element_key: item.element_key,
      })
    }

    if (hasProPayload(digest.digest)) {
      addIssue(issues, {
        severity: 'error',
        check_id: 'digest.pro_payload',
        section_key: section.section_key,
        message: 'Digest содержит pro_markdown или полный Pro payload.',
        element_kind: digest.element_kind,
        element_key: digest.element_key,
      })
    }

    const recomputedChars = digestCharCount(digest.digest)
    if (recomputedChars === 0 && !isDigestEmpty(digest.digest)) {
      addIssue(issues, {
        severity: 'warning',
        check_id: 'digest.unrecognized_content',
        section_key: section.section_key,
        message: 'Digest содержит только composition_meta без текстового содержимого.',
        element_kind: digest.element_kind,
        element_key: digest.element_key,
      })
    }
  }
}

function buildSectionSummary(
  section: SectionInputPreview,
  sectionIssues: SectionInputAuditIssue[],
): SectionInputAuditSummary {
  const issue_counts = {
    info: sectionIssues.filter((issue) => issue.severity === 'info').length,
    warning: sectionIssues.filter((issue) => issue.severity === 'warning').length,
    error: sectionIssues.filter((issue) => issue.severity === 'error').length,
  }

  let severity: SectionInputAuditSeverity = 'ok'
  for (const issue of sectionIssues) {
    severity = worstSeverity(severity, issue.severity)
  }

  return {
    section_key: section.section_key,
    section_title: section.section_title,
    total_selected: section.budget_summary.total_selected,
    omitted_by_budget: section.budget_summary.omitted_count,
    severity,
    issue_counts,
  }
}

export function buildTalentMapSectionInputAudit(
  preview: TalentMapSynthesisInputPreview,
): TalentMapSectionInputAuditReport {
  const issues: IssueDraft[] = []
  const flags: TalentMapSectionInputAuditReport['flags'] = {
    old_d0_keys_in_selected_digests: false,
    old_d0_keys_in_selected_fields: false,
    activation_role_standalone: false,
    any_section_selected_all_sources: false,
  }

  const totalSourceBundleSize = preview.source_coverage?.total_elements ?? null

  auditSectionContract(preview, issues)

  for (const section of preview.sections) {
    if (auditBudgetAndSources(section, totalSourceBundleSize, issues)) {
      flags.any_section_selected_all_sources = true
    }

    if (auditActivationGuardrails(section, issues)) {
      flags.activation_role_standalone = true
    }

    auditOldD0Keys(section, issues, flags)
    auditForbiddenOutput(section, issues)
    auditDigests(section, issues)
  }

  const finalizedIssues: SectionInputAuditIssue[] = issues

  const summary = {
    ok: 0,
    info: finalizedIssues.filter((issue) => issue.severity === 'info').length,
    warning: finalizedIssues.filter((issue) => issue.severity === 'warning').length,
    error: finalizedIssues.filter((issue) => issue.severity === 'error').length,
  }

  const section_summaries = preview.sections.map((section) =>
    buildSectionSummary(
      section,
      finalizedIssues.filter((issue) => issue.section_key === section.section_key),
    ),
  )

  summary.ok = section_summaries.filter((section) => section.severity === 'ok').length

  let overall_severity: SectionInputAuditSeverity = 'ok'
  for (const issue of finalizedIssues) {
    overall_severity = worstSeverity(overall_severity, issue.severity)
  }

  return {
    overall_severity,
    candidate_id: preview.candidate_id,
    chart_id: preview.chart_id,
    section_count: preview.sections.length,
    total_source_bundle_size: totalSourceBundleSize,
    summary,
    section_summaries,
    issues: finalizedIssues,
    flags,
  }
}
