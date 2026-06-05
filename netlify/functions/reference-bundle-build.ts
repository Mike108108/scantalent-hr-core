import type { Handler } from '@netlify/functions'
import {
  buildReferenceBundle,
  type ChartElementRow,
  type ReferenceInterpretationRow,
} from '../lib/buildReferenceBundle'
import { AuthError, getSupabaseAdmin, verifyBearerUser } from '../lib/supabaseAdmin'

type BuildBundlePayload = {
  chart_id?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'Method not allowed.' })
  }

  try {
    const user = await verifyBearerUser(event.headers.authorization ?? event.headers.Authorization)
    const payload = JSON.parse(event.body ?? '{}') as BuildBundlePayload
    const chartId = payload.chart_id?.trim()

    if (!chartId) {
      return jsonResponse(400, { ok: false, error: 'chart_id is required.' })
    }

    const admin = getSupabaseAdmin()

    const { data: chart, error: chartError } = await admin
      .from('hr_candidate_charts')
      .select('id, company_id, candidate_id')
      .eq('id', chartId)
      .maybeSingle()

    if (chartError) {
      throw new Error(chartError.message)
    }
    if (!chart) {
      return jsonResponse(404, { ok: false, error: 'Chart not found.' })
    }

    const { data: company, error: companyError } = await admin
      .from('hr_companies')
      .select('id, owner_user_id')
      .eq('id', chart.company_id)
      .maybeSingle()

    if (companyError) {
      throw new Error(companyError.message)
    }
    if (!company || company.owner_user_id !== user.id) {
      return jsonResponse(403, { ok: false, error: 'Chart does not belong to your company.' })
    }

    const { data: elementRows, error: elementsError } = await admin
      .from('hr_candidate_chart_elements')
      .select('*')
      .eq('chart_id', chartId)
      .order('element_kind', { ascending: true })
      .order('element_key', { ascending: true })

    if (elementsError) {
      throw new Error(elementsError.message)
    }

    const elements = (elementRows ?? []) as ChartElementRow[]

    const { data: interpretationRows, error: interpretationsError } = await admin
      .from('hd_reference_interpretations')
      .select(
        'element_kind, element_key, element_label, classic_markdown, hr_translation_markdown, pro_markdown, talent_hints, risk_hints, management_hints, environment_hints, limitations, base_layers, pro_layers, context_rules, not_self_layers, contrast_examples, source_quality',
      )
      .eq('language', 'ru')
      .eq('version', 'v1')

    if (interpretationsError) {
      throw new Error(interpretationsError.message)
    }

    const interpretations = (interpretationRows ?? []) as ReferenceInterpretationRow[]

    const { bundle, coverage } = buildReferenceBundle(elements, interpretations)

    return jsonResponse(200, {
      ok: true,
      chart_id: chartId,
      coverage,
      bundle,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, { ok: false, error: error.message })
    }

    const message = error instanceof Error ? error.message : 'Reference bundle build failed.'
    return jsonResponse(500, { ok: false, error: message })
  }
}
