import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AuthContext,
  authGetSession,
  authSignIn,
  authSignOut,
  authSignUp,
  type AuthContextValue,
} from '../../lib/auth'
import { getSupabaseClient } from '../../lib/supabaseClient'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function initSession() {
      const currentSession = await authGetSession()
      if (!cancelled) {
        setSession(currentSession)
        setLoading(false)
      }
    }

    void initSession()

    const client = getSupabaseClient()
    if (!client) {
      setLoading(false)
      return
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    await authSignUp(email, password)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    await authSignIn(email, password)
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp,
      signIn,
      signOut,
    }),
    [session, loading, signUp, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
