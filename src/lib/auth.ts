import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { getSupabaseClient } from './supabaseClient'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function getClientOrThrow() {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error('Supabase не настроен. Проверьте переменные окружения.')
  }
  return client
}

function formatAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Неверный email или пароль.'
  }
  if (message.includes('User already registered')) {
    return 'Пользователь с таким email уже зарегистрирован.'
  }
  if (message.includes('Password should be at least')) {
    return 'Пароль слишком короткий (минимум 6 символов).'
  }
  return message
}

export async function authSignUp(email: string, password: string): Promise<void> {
  const client = getClientOrThrow()

  const { data, error } = await client.auth.signUp({ email, password })
  if (error) {
    throw new Error(formatAuthError(error.message))
  }

  if (!data.session) {
    const { error: signInError } = await client.auth.signInWithPassword({ email, password })
    if (signInError) {
      throw new Error(formatAuthError(signInError.message))
    }
  }
}

export async function authSignIn(email: string, password: string): Promise<void> {
  const client = getClientOrThrow()

  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(formatAuthError(error.message))
  }
}

export async function authSignOut(): Promise<void> {
  const client = getClientOrThrow()

  const { error } = await client.auth.signOut()
  if (error) {
    throw new Error(formatAuthError(error.message))
  }
}

export async function authGetSession(): Promise<Session | null> {
  const client = getSupabaseClient()
  if (!client) {
    return null
  }

  const { data } = await client.auth.getSession()
  return data.session
}
