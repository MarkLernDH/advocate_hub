// src/lib/supabase/context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { createClient } from './client'
import type { UserRole } from './types'

interface AuthState {
  user: (User & { role: UserRole }) | null
  loading: boolean
  error: Error | null
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null
}

const AuthContext = createContext<AuthState>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        let userWithRole = null
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          if (profileError) throw profileError

          userWithRole = {
            ...session.user,
            role: profile.role as UserRole
          }
        }

        setState(current => ({
          ...current,
          user: userWithRole,
          loading: false
        }))
      } catch (error) {
        setState(current => ({
          ...current,
          error: error as Error,
          loading: false
        }))
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          let userWithRole = null
          if (session?.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()
            
            if (profileError) throw profileError

            userWithRole = {
              ...session.user,
              role: profile.role as UserRole
            }
          }

          setState(current => ({
            ...current,
            user: userWithRole,
            loading: false
          }))
        } catch (error) {
          setState(current => ({
            ...current,
            error: error as Error,
            loading: false
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
