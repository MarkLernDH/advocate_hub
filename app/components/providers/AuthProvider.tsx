'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabaseClient'
import { DbUser, AdvocateLevel, Database } from '../../../types'
import LoadingSpinner from '../shared/LoadingSpinner'

interface AuthContextType {
  user: User | null
  dbUser: DbUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

  const ensureUserRecord = async (authUser: User) => {
    console.log('Ensuring user record for:', authUser.id)
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (fetchError) {
        console.error('Error fetching user:', fetchError)
        throw fetchError
      }

      if (existingUser) {
        console.log('Found existing user:', existingUser)
        // Type assertion for database row
        const user = existingUser as unknown as Database['public']['Tables']['users']['Row']
        setDbUser(user)
        return user
      }

      console.log('Creating new user record')
      // Create new user record if it doesn't exist
      const newUserData: Database['public']['Tables']['users']['Insert'] = {
        id: authUser.id,
        email: authUser.email!,
        points: 0,
        tier: AdvocateLevel.BRONZE,
        is_active: true
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        throw insertError
      }
      
      if (!newUser) {
        throw new Error('Failed to create user record')
      }

      console.log('Created new user:', newUser)
      // Type assertion for database row
      const user = newUser as unknown as Database['public']['Tables']['users']['Row']
      setDbUser(user)
      return user
    } catch (error) {
      console.error('Error ensuring user record:', error)
      throw error
    }
  }

  useEffect(() => {
    let mounted = true
    console.log('Setting up auth subscriptions')
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Got initial session:', session?.user?.id)
        
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await ensureUserRecord(session.user)
          } else {
            setDbUser(null)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      if (!mounted) return

      try {
        setUser(session?.user ?? null)
        if (session?.user) {
          await ensureUserRecord(session.user)
        } else {
          setDbUser(null)
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
      }
    })

    return () => {
      console.log('Cleaning up auth subscriptions')
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array to run only once

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setDbUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    dbUser,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
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