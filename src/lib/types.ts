export type Company = {
  id: string
  owner_user_id: string
  name: string
  created_at: string
  updated_at: string
}

export type Candidate = {
  id: string
  company_id: string
  name: string
  email: string | null
  phone: string | null
  birth_date: string | null
  birth_time: string | null
  birth_place: string | null
  birth_city_label: string | null
  birth_timezone: string | null
  birth_latitude: number | null
  birth_longitude: number | null
  birth_city_source: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type CandidateChart = {
  id: string
  company_id: string
  candidate_id: string
  input_hash: string | null
  chart_source: string | null
  raw_chart_data: unknown
  normalized_chart_data: unknown
  calculated_at: string | null
  created_at: string
  updated_at: string
}

export type ChartElementCounts = {
  total: number
  defined_centers: number
  open_centers: number
  channels: number
  gates: number
  activations: number
}

export type TalentMapStatus = 'draft' | 'pending' | 'processing' | 'ready' | 'error'

export type { LayerKey, TalentMapSectionKey } from './talentMapSectionTypes'
export type { TalentMapSectionReport } from './talentMapSectionApi'

export type ReferenceInterpretationLayers = {
  plain_meaning?: string
  work_manifestation?: string
  strengths?: string
  risks?: string
  when_it_works_best?: string
  when_talent_is_not_revealed?: string
  hd_meaning?: string
  mechanics?: string
  classical_keywords?: string | string[]
  source_logic?: string
  pro_not_self?: string
  composition_components?: string[]
  composition_mode?: string
  primary_context?: string | string[]
  secondary_context?: string | string[]
  depends_on?: string
  related_element_kinds?: string | string[]
  context_note?: string
  source_component_keys?: string[]
  base?: string
  pro?: string
  warning_signals?: string | string[]
  recovery_conditions?: string | string[]
}

export type ReferenceContrastExample = {
  contrast_context: string
  how_it_would_read: string
  why_current_context_is_different: string
}

export type ReferenceInterpretation = {
  element_label: string | null
  classic_markdown: string | null
  hr_translation_markdown: string | null
  pro_markdown: string | null
  talent_hints: string[]
  risk_hints: string[]
  management_hints: string[]
  environment_hints: string[]
  limitations: string[]
  base_layers: ReferenceInterpretationLayers
  pro_layers: ReferenceInterpretationLayers
  context_rules: ReferenceInterpretationLayers
  not_self_layers: ReferenceInterpretationLayers
  contrast_examples: ReferenceContrastExample[]
  source_quality: string
}

export type ReferenceBundleChartElement = {
  id: string
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

export type ReferenceBundleRelatedElement = {
  id: string
  element_kind: string
  element_key: string
  element_label: string | null
  relation: string
}

export type ReferenceBundleItem = {
  element: ReferenceBundleChartElement
  matched: boolean
  interpretation: ReferenceInterpretation | null
  related_context_elements: ReferenceBundleRelatedElement[]
  missing_reason: string | null
}

export type ReferenceBundleMissingItem = {
  element_kind: string
  element_key: string
  element_label: string | null
  reason: string
}

export type ReferenceBundleCoverageByKind = {
  total: number
  matched: number
  missing: number
}

export type ReferenceBundleCoverage = {
  total_elements: number
  matched_elements: number
  missing_elements: number
  coverage_percent: number
  by_kind: Record<string, ReferenceBundleCoverageByKind>
}

export type SourceInterpretationBundle = {
  language: string
  version: string
  items: ReferenceBundleItem[]
  missing_items: ReferenceBundleMissingItem[]
}

export type ReferenceBundleResponse = {
  ok: boolean
  chart_id?: string
  coverage?: ReferenceBundleCoverage
  bundle?: SourceInterpretationBundle
  error?: string
}
