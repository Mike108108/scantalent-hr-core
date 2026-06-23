import type { Handler } from '@netlify/functions'
import {
  SUPPORTED_GENERATED_SECTION_KEYS,
  isSupportedGeneratedSectionKey,
} from '../../src/lib/talentMapGeneratedSections'
import {
  jsonResponse,
  TALENT_MAP_SECTION_GENERATION_CORS_HEADERS,
} from '../lib/talentMapSectionGeneration'
import { AuthError, getSupabaseAdmin, readBearerAuthorizationHeader, verifyBearerUser } from '../lib/supabaseAdmin'

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
    const user = await verifyBearerUser(readBearerAuthorizationHeader(event.headers))
    const query = event.queryStringParameters ?? {}
    const reportId = query.report_id?.trim()
    const chartId = query.chart_id?.trim()
    const sectionKeyRaw = query.section_key?.trim()

    const admin = getSupabaseAdmin()

    let reportQuery = admin.from('hr_candidate_layer_reports').select('*')

    if (reportId) {
      reportQuery = reportQuery.eq('id', reportId)
    } else if (chartId && sectionKeyRaw) {
      if (!isSupportedGeneratedSectionKey(sectionKeyRaw)) {
        return jsonResponse(400, {
          ok: false,
          error_kind: 'technical',
          error: 'Unsupported runtime-generated section_key.',
          diagnostics: {
            requested_section_key: sectionKeyRaw,
            supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
          },
        })
      }

      reportQuery = reportQuery
        .eq('chart_id', chartId)
        .eq('layer_key', sectionKeyRaw)
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
        diagnostics: {
          stage: 'auth',
          endpoint: 'talent-map-section-generate-status',
        },
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
        supported_section_keys: SUPPORTED_GENERATED_SECTION_KEYS,
      },
    })
  }
}
