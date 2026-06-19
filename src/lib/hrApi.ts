import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabaseClient'
import type { Candidate, CandidateChart, ChartElementCounts, Company } from './types'

export type CandidatePayload = {
  name: string
  email?: string | null
  phone?: string | null
  birth_date?: string | null
  birth_time?: string | null
  birth_place?: string | null
  birth_city_label?: string | null
  birth_timezone?: string | null
  birth_latitude?: number | null
  birth_longitude?: number | null
  birth_city_source?: string | null
  notes?: string | null
}

function getClientOrThrow() {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase не настроен. Проверьте переменные окружения.')
  }
  return client
}

export async function getCurrentUser(): Promise<User | null> {
  const client = getClientOrThrow()

  const { data, error } = await client.auth.getUser()
  if (error) {
    throw new Error(error.message)
  }

  return data.user
}

export async function getOrCreateCompanyForCurrentUser(): Promise<Company> {
  const client = getClientOrThrow()
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Пользователь не авторизован.')
  }

  const { data: existing, error: selectError } = await client
    .from('hr_companies')
    .select('*')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (selectError) {
    throw new Error(selectError.message)
  }

  if (existing) {
    return existing as Company
  }

  const { data: created, error: insertError } = await client
    .from('hr_companies')
    .insert({
      owner_user_id: user.id,
      name: 'Моя компания',
    })
    .select('*')
    .single()

  if (insertError) {
    throw new Error(insertError.message)
  }

  return created as Company
}

export async function getFirstCandidateForCompany(companyId: string): Promise<Candidate | null> {
  const client = getClientOrThrow()

  const { data, error } = await client
    .from('hr_candidates')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as Candidate | null) ?? null
}

export async function upsertSingleCandidateForCompany(
  companyId: string,
  payload: CandidatePayload,
): Promise<Candidate> {
  const client = getClientOrThrow()
  const existing = await getFirstCandidateForCompany(companyId)

  const row: Record<string, unknown> = {
    company_id: companyId,
    name: payload.name.trim(),
    birth_date: payload.birth_date || null,
    birth_time: payload.birth_time || null,
    birth_place: payload.birth_place?.trim() || null,
    birth_timezone: payload.birth_timezone?.trim() || null,
  }

  if (payload.birth_city_label !== undefined) {
    row.birth_city_label = payload.birth_city_label?.trim() || null
  }

  if (payload.birth_latitude !== undefined) {
    row.birth_latitude = payload.birth_latitude
  }

  if (payload.birth_longitude !== undefined) {
    row.birth_longitude = payload.birth_longitude
  }

  if (payload.birth_city_source !== undefined) {
    row.birth_city_source = payload.birth_city_source?.trim() || null
  }

  if (payload.email !== undefined) {
    row.email = payload.email?.trim() || null
  }

  if (payload.phone !== undefined) {
    row.phone = payload.phone?.trim() || null
  }

  if (payload.notes !== undefined) {
    row.notes = payload.notes?.trim() || null
  }

  if (existing) {
    const { data, error } = await client
      .from('hr_candidates')
      .update(row)
      .eq('id', existing.id)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Candidate
  }

  const insertRow = {
    company_id: companyId,
    name: payload.name.trim(),
    email: payload.email?.trim() || null,
    phone: payload.phone?.trim() || null,
    birth_date: payload.birth_date || null,
    birth_time: payload.birth_time || null,
    birth_place: payload.birth_place?.trim() || null,
    birth_city_label: payload.birth_city_label?.trim() || null,
    birth_timezone: payload.birth_timezone?.trim() || null,
    birth_latitude: payload.birth_latitude ?? null,
    birth_longitude: payload.birth_longitude ?? null,
    birth_city_source: payload.birth_city_source?.trim() || null,
    notes: payload.notes?.trim() || null,
  }

  const { data, error } = await client.from('hr_candidates').insert(insertRow).select('*').single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Candidate
}

export async function deleteCandidateForCompany(
  companyId: string,
  candidateId: string,
): Promise<void> {
  const client = getClientOrThrow()

  const { error } = await client
    .from('hr_candidates')
    .delete()
    .eq('id', candidateId)
    .eq('company_id', companyId)
    .select('id')

  if (error) {
    throw new Error(error.message)
  }
}

export async function getLatestChartForCandidate(
  candidateId: string,
): Promise<CandidateChart | null> {
  const client = getClientOrThrow()

  const { data, error } = await client
    .from('hr_candidate_charts')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as CandidateChart | null) ?? null
}

export async function getChartElementCounts(chartId: string): Promise<ChartElementCounts> {
  const client = getClientOrThrow()

  const { data, error } = await client
    .from('hr_candidate_chart_elements')
    .select('element_kind')
    .eq('chart_id', chartId)

  if (error) {
    throw new Error(error.message)
  }

  const counts: ChartElementCounts = {
    total: data?.length ?? 0,
    defined_centers: 0,
    open_centers: 0,
    channels: 0,
    gates: 0,
    activations: 0,
  }

  for (const row of data ?? []) {
    switch (row.element_kind) {
      case 'defined_center':
        counts.defined_centers += 1
        break
      case 'open_center':
        counts.open_centers += 1
        break
      case 'channel':
        counts.channels += 1
        break
      case 'gate':
        counts.gates += 1
        break
      case 'activation':
        counts.activations += 1
        break
      default:
        break
    }
  }

  return counts
}
