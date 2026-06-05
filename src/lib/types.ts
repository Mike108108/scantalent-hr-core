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
  birth_timezone: string | null
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

export type TalentMapStatus = 'draft' | 'processing' | 'ready' | 'error'

export type LayerKey =
  | 'work_mode_and_entry'
  | 'decision_style'
  | 'main_talents'
  | 'work_environment'
  | 'communication'
  | 'risks'
  | 'management'
  | 'development_potential'
