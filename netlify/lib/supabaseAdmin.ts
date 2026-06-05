import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin env is not configured.')
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  return adminClient
}

export async function verifyBearerUser(authHeader: string | undefined): Promise<User> {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid Authorization header.', 401)
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) {
    throw new AuthError('Missing bearer token.', 401)
  }

  const client = getSupabaseAdmin()
  const { data, error } = await client.auth.getUser(token)

  if (error || !data.user) {
    throw new AuthError('Invalid or expired session.', 401)
  }

  return data.user
}

export class AuthError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = statusCode
  }
}
