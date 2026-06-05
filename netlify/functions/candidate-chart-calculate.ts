import type { Handler } from '@netlify/functions'
import { countElementsByKind, extractCandidateChartElements } from '../lib/extractCandidateChartElements'
import { fetchHumanDesignChart, HdApiError } from '../lib/hdApiClient'
import { computeChartInputHash, type ChartBirthInput } from '../lib/inputHash'
import { normalizeChartData } from '../lib/normalizeChart'
import { AuthError, getSupabaseAdmin, verifyBearerUser } from '../lib/supabaseAdmin'

type CalculateChartPayload = {
  candidate_id?: string
  birth_date?: string
  birth_time?: string
  birth_place?: string
  birth_timezone?: string
  birth_latitude?: number
  birth_longitude?: number
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

function validatePayload(payload: CalculateChartPayload): ChartBirthInput & { candidate_id: string } {
  const candidateId = payload.candidate_id?.trim()
  const birthDate = payload.birth_date?.trim()
  const birthTime = payload.birth_time?.trim()
  const birthPlace = payload.birth_place?.trim()
  const birthTimezone = payload.birth_timezone?.trim()
  const birthLatitude = payload.birth_latitude
  const birthLongitude = payload.birth_longitude

  if (!candidateId) {
    throw new Error('candidate_id is required.')
  }
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new Error('birth_date must be YYYY-MM-DD.')
  }
  if (!birthTime || !/^\d{2}:\d{2}$/.test(birthTime.slice(0, 5))) {
    throw new Error('birth_time must be HH:mm.')
  }
  if (!birthPlace) {
    throw new Error('birth_place is required.')
  }
  if (!birthTimezone) {
    throw new Error('birth_timezone is required.')
  }
  if (typeof birthLatitude !== 'number' || Number.isNaN(birthLatitude)) {
    throw new Error('birth_latitude is required.')
  }
  if (typeof birthLongitude !== 'number' || Number.isNaN(birthLongitude)) {
    throw new Error('birth_longitude is required.')
  }

  return {
    candidate_id: candidateId,
    birth_date: birthDate,
    birth_time: birthTime.slice(0, 5),
    birth_place: birthPlace,
    birth_timezone: birthTimezone,
    birth_latitude: birthLatitude,
    birth_longitude: birthLongitude,
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
    const payload = validatePayload(JSON.parse(event.body ?? '{}') as CalculateChartPayload)
    const admin = getSupabaseAdmin()

    const { data: candidate, error: candidateError } = await admin
      .from('hr_candidates')
      .select('id, company_id, name')
      .eq('id', payload.candidate_id)
      .maybeSingle()

    if (candidateError) {
      throw new Error(candidateError.message)
    }
    if (!candidate) {
      return jsonResponse(404, { ok: false, error: 'Candidate not found.' })
    }

    const { data: company, error: companyError } = await admin
      .from('hr_companies')
      .select('id, owner_user_id')
      .eq('id', candidate.company_id)
      .maybeSingle()

    if (companyError) {
      throw new Error(companyError.message)
    }
    if (!company || company.owner_user_id !== user.id) {
      return jsonResponse(403, { ok: false, error: 'Candidate does not belong to your company.' })
    }

    const birthInput: ChartBirthInput = {
      birth_date: payload.birth_date,
      birth_time: payload.birth_time,
      birth_place: payload.birth_place,
      birth_timezone: payload.birth_timezone,
      birth_latitude: payload.birth_latitude,
      birth_longitude: payload.birth_longitude,
    }

    const inputHash = computeChartInputHash(birthInput)

    const { data: existingChart, error: existingError } = await admin
      .from('hr_candidate_charts')
      .select('*')
      .eq('candidate_id', candidate.id)
      .eq('input_hash', inputHash)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingError) {
      throw new Error(existingError.message)
    }

    if (existingChart) {
      const { count, error: countError } = await admin
        .from('hr_candidate_chart_elements')
        .select('*', { count: 'exact', head: true })
        .eq('chart_id', existingChart.id)

      if (countError) {
        throw new Error(countError.message)
      }

      return jsonResponse(200, {
        ok: true,
        reused: true,
        chart: {
          id: existingChart.id,
          candidate_id: existingChart.candidate_id,
          input_hash: existingChart.input_hash,
          chart_source: existingChart.chart_source,
          calculated_at: existingChart.calculated_at,
          normalized_chart_data: existingChart.normalized_chart_data,
          raw_chart_data: existingChart.raw_chart_data,
          elements_count: count ?? 0,
        },
      })
    }

    const { raw, chartSource } = await fetchHumanDesignChart({
      birthDate: birthInput.birth_date,
      birthTime: birthInput.birth_time,
      birthTimezone: birthInput.birth_timezone,
      birthLatitude: birthInput.birth_latitude,
      birthLongitude: birthInput.birth_longitude,
    })

    const normalized = normalizeChartData(raw, birthInput)
    const elementRows = extractCandidateChartElements(normalized)
    const elementCounts = countElementsByKind(elementRows)
    const calculatedAt = new Date().toISOString()

    const { data: chartRow, error: chartInsertError } = await admin
      .from('hr_candidate_charts')
      .insert({
        company_id: candidate.company_id,
        candidate_id: candidate.id,
        input_hash: inputHash,
        chart_source: chartSource,
        raw_chart_data: raw,
        normalized_chart_data: normalized,
        calculated_at: calculatedAt,
      })
      .select('*')
      .single()

    if (chartInsertError) {
      throw new Error(chartInsertError.message)
    }

    if (elementRows.length > 0) {
      const { error: elementsError } = await admin.from('hr_candidate_chart_elements').insert(
        elementRows.map((element) => ({
          company_id: candidate.company_id,
          candidate_id: candidate.id,
          chart_id: chartRow.id,
          ...element,
        })),
      )

      if (elementsError) {
        throw new Error(elementsError.message)
      }
    }

    await admin
      .from('hr_candidates')
      .update({
        birth_date: birthInput.birth_date,
        birth_time: `${birthInput.birth_time}:00`,
        birth_place: birthInput.birth_place,
        birth_timezone: birthInput.birth_timezone,
      })
      .eq('id', candidate.id)

    return jsonResponse(200, {
      ok: true,
      reused: false,
      chart: {
        id: chartRow.id,
        candidate_id: chartRow.candidate_id,
        input_hash: chartRow.input_hash,
        chart_source: chartRow.chart_source,
        calculated_at: chartRow.calculated_at,
        normalized_chart_data: chartRow.normalized_chart_data,
        raw_chart_data: chartRow.raw_chart_data,
        elements_count: elementCounts.total,
        element_counts: elementCounts,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, { ok: false, error: error.message })
    }

    if (error instanceof HdApiError) {
      return jsonResponse(502, {
        ok: false,
        error: error.providerMessage,
        hd_api: {
          provider: error.provider,
          endpoint: error.endpoint,
          status: error.status,
          message: error.providerMessage,
          request_body_keys: error.requestBodyKeys,
        },
      })
    }

    const message = error instanceof Error ? error.message : 'Chart calculation failed.'
    return jsonResponse(500, { ok: false, error: message })
  }
}
