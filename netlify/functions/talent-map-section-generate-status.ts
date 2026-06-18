import type { Handler } from '@netlify/functions'
import {
  jsonResponse,
  TALENT_MAP_SECTION_GENERATION_CORS_HEADERS,
  WORK_MODE_SECTION_KEY,
} from '../lib/talentMapSectionGeneration'
import { AuthError, getSupabaseAdmin, verifyBearerUser } from '../lib/supabaseAdmin'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: TALENT_MAP_SECTION_GENERATION_CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, {
      ok: false,
      error_kind: 'technical',
      error: 'Method not allowed.',
    })
  }

  try {
    const user = await verifyBearerUser(event.headers.authorization ?? event.headers.Authorization)
    const query = event.queryStringParameters ?? {}
    const reportId = query.report_id?.trim()
    const chartId = query.chart_id?.trim()
    const sectionKey = query.section_key?.trim()

    const admin = getSupabaseAdmin()

    let reportQuery = admin.from('hr_candidate_layer_reports').select('*')

    if (reportId) {
      reportQuery = reportQuery.eq('id', reportId)
    } else if (chartId && sectionKey) {
      if (sectionKey !== WORK_MODE_SECTION_KEY) {
        return jsonResponse(400, {
          ok: false,
          error_kind: 'technical',
          error: 'Only work_mode_and_entry is supported in Stage 4-F0.1.',
        })
      }

      reportQuery = reportQuery
        .eq('chart_id', chartId)
        .eq('layer_key', sectionKey)
        .order('updated_at', { ascending: false })
        .limit(1)
    } else {
      return jsonResponse(400, {
        ok: false,
        error_kind: 'technical',
        error: 'report_id or chart_id + section_key is required.',
      })
    }

    const { data: report, error: reportError } = await reportQuery.maybeSingle()

    if (reportError) {
      throw new Error(reportError.message)
    }
    if (!report) {
      return jsonResponse(404, {
        ok: false,
        error_kind: 'technical',
        error: 'Layer report not found.',
      })
    }

    const { data: company, error: companyError } = await admin
      .from('hr_companies')
      .select('id, owner_user_id')
      .eq('id', report.company_id)
      .maybeSingle()

    if (companyError) {
      throw new Error(companyError.message)
    }
    if (!company || company.owner_user_id !== user.id) {
      return jsonResponse(403, {
        ok: false,
        error_kind: 'technical',
        error: 'Report does not belong to your company.',
      })
    }

    return jsonResponse(200, {
      ok: true,
      report,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, {
        ok: false,
        error_kind: 'technical',
        error: error.message,
      })
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected generation status error'
    return jsonResponse(500, {
      ok: false,
      error_kind: 'technical',
      error: message,
      diagnostics: {
        stage: 'status_unexpected_catch',
        section_key: WORK_MODE_SECTION_KEY,
      },
    })
  }
}
