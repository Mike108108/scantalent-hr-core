export type SupabaseEnvStatus = {
  configured: boolean
  missing: string[]
  warning: string | null
}

const SUPABASE_URL_KEY = 'VITE_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'VITE_SUPABASE_ANON_KEY'

export function getSupabaseUrl(): string | undefined {
  const value = import.meta.env.VITE_SUPABASE_URL
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

export function getSupabaseAnonKey(): string | undefined {
  const value = import.meta.env.VITE_SUPABASE_ANON_KEY
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const missing: string[] = []

  if (!getSupabaseUrl()) {
    missing.push(SUPABASE_URL_KEY)
  }

  if (!getSupabaseAnonKey()) {
    missing.push(SUPABASE_ANON_KEY)
  }

  const configured = missing.length === 0

  return {
    configured,
    missing,
    warning: configured
      ? null
      : `Supabase не настроен. Добавьте ${missing.join(' и ')} в .env (см. .env.example). Приложение работает в режиме scaffold без подключения к базе.`,
  }
}
