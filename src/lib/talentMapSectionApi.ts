import { getAccessTokenForProtectedRequest } from './auth'
import { getSupabaseClient } from './supabaseClient'
import type { TalentMapGeneratedSection } from './talentMapGeneratedSectionContract'
import type { SupportedGeneratedSectionKey } from './talentMapGeneratedSections'
import type { TalentMapModelPresetId } from './talentMapModelPresets'
import {
  buildSectionGenerationErrorPresentation,
  type SectionGenerationErrorKind,
  type SectionGenerationErrorPresentation,
} from './talentMapSectionErrors'
import type { TalentMapSectionKey } from './talentMapSections'

export const TALENT_MAP_SECTION_GENERATE_ENDPOINT =
  '/.netlify/functions/talent-map-section-generate'

export const TALENT_MAP_SECTION_GENERATE_STATUS_ENDPOINT =
  '/.netlify/functions/talent-map-section-generate-status'

export type TalentMapSectionReportStatus = 'draft' | 'processing' | 'ready' | 'error'

export type TalentMapSectionReport = {
  id: string
  company_id: string
  candidate_id: string
  chart_id: string
  layer_key: TalentMapSectionKey
  layer_title: string | null
  status: TalentMapSectionReportStatus
  input_bundle_json: unknown
  content_json: TalentMapGeneratedSection | Record<string, unknown>
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

type GenerateTalentMapSectionFailure = {
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
  diagnostics?: Record<string, unknown>
  presentation: SectionGenerationErrorPresentation
}

export type GenerateTalentMapSectionResponse =
  | {
      ok: true
      status: 'processing'
      report_id: string
      section_key: SupportedGeneratedSectionKey
      model_preset_id: TalentMapModelPresetId
      report: TalentMapSectionReport
    }
  | GenerateTalentMapSectionFailure

export type TalentMapSectionGenerationStatusResponse =
  | {
      ok: true
      report: TalentMapSectionReport
    }
  | {
      ok: false
      error: string
      error_kind?: SectionGenerationErrorKind
      diagnostics?: Record<string, unknown>
      presentation: SectionGenerationErrorPresentation
    }

async function readJsonResponseSafely(
  response: Response,
  endpointUrl: string,
  requestContext?: {
    section_key?: string
    model_preset_id?: string
    report_id?: string
  },
): Promise<unknown> {
  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  const contextLines = [
    requestContext?.section_key ? `Payload section_key: ${requestContext.section_key}` : null,
    requestContext?.model_preset_id
      ? `Payload model_preset_id: ${requestContext.model_preset_id}`
      : null,
    requestContext?.report_id ? `Report id: ${requestContext.report_id}` : null,
  ].filter(Boolean)

  if (!contentType.toLowerCase().includes('application/json')) {
    const preview = responseText.slice(0, 800)

    throw buildSectionGenerationErrorPresentation({
      technicalMessage: 'Endpoint returned non-JSON response.',
      status: response.status,
      endpoint: endpointUrl,
      rawResponse: {
        contentType: contentType || 'unknown',
        bodyPreview: preview,
        ...Object.fromEntries(
          contextLines.map((line, index) => [`context_${index}`, line]),
        ),
      },
    })
  }

  try {
    return JSON.parse(responseText)
  } catch {
    const preview = responseText.slice(0, 800)

    throw buildSectionGenerationErrorPresentation({
      technicalMessage: 'Endpoint returned invalid JSON.',
      status: response.status,
      endpoint: endpointUrl,
      rawResponse: {
        contentType: contentType || 'unknown',
        bodyPreview: preview,
        ...Object.fromEntries(
          contextLines.map((line, index) => [`context_${index}`, line]),
        ),
      },
    })
  }
}

function buildFailureFromBackendResponse(params: {
  endpoint: string
  status: number
  data: {
    ok: false
    error: string
    error_kind?: SectionGenerationErrorKind
    diagnostics?: Record<string, unknown>
    audit?: unknown
    quality_flags?: string[]
    generation_error?: string
  }
}): GenerateTalentMapSectionFailure {
  const presentation = buildSectionGenerationErrorPresentation({
    technicalMessage: params.data.error,
    errorKind: params.data.error_kind,
    status: params.status,
    endpoint: params.endpoint,
    diagnostics: params.data.diagnostics,
    audit: params.data.audit,
    qualityFlags: params.data.quality_flags,
    rawResponse: params.data,
  })

  return {
    ok: false,
    error: params.data.error,
    error_kind: params.data.error_kind,
    audit: params.data.audit as GenerateTalentMapSectionFailure['audit'],
    quality_flags: params.data.quality_flags,
    generation_error: params.data.generation_error,
    diagnostics: params.data.diagnostics,
    presentation,
  }
}

export async function generateTalentMapSection(
  payload: {
    chart_id: string
    section_key: SupportedGeneratedSectionKey
    model_preset_id: TalentMapModelPresetId
  },
  options?: {
    accessToken?: string | null
  },
): Promise<GenerateTalentMapSectionResponse> {
  const accessToken = await getAccessTokenForProtectedRequest(options?.accessToken)

  const response = await fetch(TALENT_MAP_SECTION_GENERATE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })

  let data: GenerateTalentMapSectionResponse
  try {
    data = (await readJsonResponseSafely(response, TALENT_MAP_SECTION_GENERATE_ENDPOINT, {
      section_key: payload.section_key,
      model_preset_id: payload.model_preset_id,
    })) as GenerateTalentMapSectionResponse
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'userMessage' in error &&
      'technicalDetails' in error
    ) {
      const presentation = error as SectionGenerationErrorPresentation
      return {
        ok: false,
        error: presentation.technicalDetails,
        presentation,
      }
    }
    throw error
  }

  if (!data.ok) {
    return buildFailureFromBackendResponse({
      endpoint: TALENT_MAP_SECTION_GENERATE_ENDPOINT,
      status: response.status,
      data,
    })
  }

  if (!response.ok) {
    const presentation = buildSectionGenerationErrorPresentation({
      technicalMessage: 'Не удалось запустить сборку раздела карты талантов.',
      status: response.status,
      endpoint: TALENT_MAP_SECTION_GENERATE_ENDPOINT,
      rawResponse: data,
    })

    return {
      ok: false,
      error: presentation.technicalDetails,
      presentation,
    }
  }

  return data
}

export async function getTalentMapSectionGenerationStatus(
  params: {
    report_id?: string
    chart_id?: string
    section_key?: SupportedGeneratedSectionKey
  },
  options?: {
    accessToken?: string | null
  },
): Promise<TalentMapSectionGenerationStatusResponse> {
  const accessToken = await getAccessTokenForProtectedRequest(options?.accessToken)

  const searchParams = new URLSearchParams()
  if (params.report_id) {
    searchParams.set('report_id', params.report_id)
  }
  if (params.chart_id) {
    searchParams.set('chart_id', params.chart_id)
  }
  if (params.section_key) {
    searchParams.set('section_key', params.section_key)
  }

  const endpointUrl = `${TALENT_MAP_SECTION_GENERATE_STATUS_ENDPOINT}?${searchParams.toString()}`

  const response = await fetch(endpointUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  let data: TalentMapSectionGenerationStatusResponse
  try {
    data = (await readJsonResponseSafely(response, endpointUrl, {
      report_id: params.report_id,
      section_key: params.section_key,
    })) as TalentMapSectionGenerationStatusResponse
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'userMessage' in error &&
      'technicalDetails' in error
    ) {
      const presentation = error as SectionGenerationErrorPresentation
      return {
        ok: false,
        error: presentation.technicalDetails,
        presentation,
      }
    }
    throw error
  }

  if (!response.ok || !data.ok) {
    if (!data.ok) {
      const presentation = buildSectionGenerationErrorPresentation({
        technicalMessage: data.error,
        errorKind: data.error_kind,
        status: response.status,
        endpoint: endpointUrl,
        diagnostics: data.diagnostics,
        rawResponse: data,
      })

      return {
        ok: false,
        error: data.error,
        error_kind: data.error_kind,
        diagnostics: data.diagnostics,
        presentation,
      }
    }

    const presentation = buildSectionGenerationErrorPresentation({
      technicalMessage: 'Не удалось получить статус сборки раздела.',
      status: response.status,
      endpoint: endpointUrl,
      rawResponse: data,
    })

    return {
      ok: false,
      error: presentation.technicalDetails,
      presentation,
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

export const TALENT_MAP_SECTION_POLL_INTERVAL_MS = 2500
export const TALENT_MAP_SECTION_POLL_TIMEOUT_MS = 180000

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function isSectionGenerationErrorPresentation(
  value: unknown,
): value is SectionGenerationErrorPresentation {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userMessage' in value &&
    'technicalDetails' in value
  )
}
