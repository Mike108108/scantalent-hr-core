import { authGetSession } from './auth'
import { getSupabaseClient } from './supabaseClient'
import type { TalentMapGeneratedSectionV1 } from './talentMapGeneratedSectionContract'
import type { SectionGenerationErrorKind } from './talentMapSectionErrors'
import type { TalentMapSectionKey } from './talentMapSections'

export type TalentMapSectionReportStatus = 'draft' | 'ready' | 'error'

export type TalentMapSectionReport = {
  id: string
  company_id: string
  candidate_id: string
  chart_id: string
  layer_key: TalentMapSectionKey
  layer_title: string | null
  status: TalentMapSectionReportStatus
  input_bundle_json: unknown
  content_json: TalentMapGeneratedSectionV1 | Record<string, unknown>
  base_markdown: string | null
  pro_markdown: string | null
  summary_for_synthesis: unknown
  evidence_json: unknown
  quality_flags: unknown
  model: string | null
  usage_json: unknown
  estimated_cost_usd: number | null
  generation_error: string | null
  created_at: string
  updated_at: string
}

export type GenerateTalentMapSectionResponse =
  | {
      ok: true
      report: TalentMapSectionReport
    }
  | {
      ok: false
      error: string
      error_kind?: SectionGenerationErrorKind
      report?: TalentMapSectionReport
      audit?: {
        overall_severity: string
        issues: unknown[]
        section_summary?: unknown
      }
      quality_flags?: string[]
      generation_error?: string
    }

export async function generateTalentMapSection(payload: {
  chart_id: string
  section_key: 'work_mode_and_entry'
}): Promise<GenerateTalentMapSectionResponse> {
  const session = await authGetSession()
  if (!session?.access_token) {
    throw new Error('Пользователь не авторизован.')
  }

  const response = await fetch('/.netlify/functions/talent-map-section-generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as GenerateTalentMapSectionResponse

  if (!response.ok || !data.ok) {
    return {
      ok: false,
      error: data.ok ? 'Не удалось собрать раздел карты талантов.' : data.error,
      error_kind: !data.ok ? data.error_kind : undefined,
      report: !data.ok ? data.report : undefined,
      audit: !data.ok ? data.audit : undefined,
      quality_flags: !data.ok ? data.quality_flags : undefined,
      generation_error: !data.ok ? data.generation_error : undefined,
    }
  }

  return data
}

export async function getTalentMapSectionReports(chartId: string): Promise<TalentMapSectionReport[]> {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase не настроен. Проверьте переменные окружения.')
  }

  const { data, error } = await client
    .from('hr_candidate_layer_reports')
    .select('*')
    .eq('chart_id', chartId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as TalentMapSectionReport[]
  const latestByLayer = new Map<string, TalentMapSectionReport>()

  for (const row of rows) {
    if (!latestByLayer.has(row.layer_key)) {
      latestByLayer.set(row.layer_key, row)
    }
  }

  return [...latestByLayer.values()]
}

export function getSectionReportMap(
  reports: TalentMapSectionReport[],
): Partial<Record<TalentMapSectionKey, TalentMapSectionReport>> {
  return Object.fromEntries(reports.map((report) => [report.layer_key, report]))
}
