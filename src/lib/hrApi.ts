import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabaseClient'
import type { Candidate, Company } from './types'

export type CandidatePayload = {
  name: string
  email?: string | null
  phone?: string | null
  birth_date?: string | null
  birth_time?: string | null
  birth_place?: string | null
  birth_timezone?: string | null
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

  const row = {
    company_id: companyId,
    name: payload.name.trim(),
    email: payload.email?.trim() || null,
    phone: payload.phone?.trim() || null,
    birth_date: payload.birth_date || null,
    birth_time: payload.birth_time || null,
    birth_place: payload.birth_place?.trim() || null,
    birth_timezone: payload.birth_timezone?.trim() || null,
    notes: payload.notes?.trim() || null,
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

  const { data, error } = await client.from('hr_candidates').insert(row).select('*').single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Candidate
}
