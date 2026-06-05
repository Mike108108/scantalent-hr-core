import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAnonKey, getSupabaseEnvStatus, getSupabaseUrl } from './env'

let client: SupabaseClient | null = null
let warned = false

export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  if (!url || !anonKey) {
    if (!warned && typeof console !== 'undefined') {
      const status = getSupabaseEnvStatus()
      if (status.warning) {
        console.warn(`[ScanTalent] ${status.warning}`)
      }
      warned = true
    }
    return null
  }

  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return client
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnvStatus().configured
}
