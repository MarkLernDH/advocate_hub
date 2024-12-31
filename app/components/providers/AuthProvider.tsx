'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabaseClient'
import { DbUser } from '../../../types'

interface AuthContextType {
  user: User | null
  dbUser: DbUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('Initializing auth...')

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      console.log('Auth state changed: INITIAL_SESSION', session?.user?.id)
      if (session?.user) {
        setUser(session.user)
      }
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id)
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setDbUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch or create user record when auth user changes
  useEffect(() => {
    async function ensureUserRecord() {
      if (!user) {
        setLoading(false)
        return
      }

      console.log('Ensuring user record for:', user.id)
      try {
        // First try to get the existing user
        let { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (existingUser) {
          console.log('Found existing user:', existingUser)
          setDbUser(existingUser)
        } else {
          // Create new user if doesn't exist
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                role: 'ADVOCATE', // Default role
                tier: 'BRONZE', // Default tier
                points: 0,
                is_active: true,
              },
            ])
            .select()
            .single()

          if (createError) throw createError

          console.log('Created new user:', newUser)
          setDbUser(newUser)
        }
      } catch (error) {
        console.error('Error ensuring user record:', error)
      } finally {
        setLoading(false)
      }
    }

    ensureUserRecord()
  }, [user])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setDbUser(null)
  }

  const value = {
    user,
    dbUser,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}