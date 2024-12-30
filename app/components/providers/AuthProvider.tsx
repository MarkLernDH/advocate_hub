'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabaseClient'
import { DbUser, AdvocateLevel } from '../../../types'
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
        setDbUser(existingUser as DbUser)
        return existingUser
      }

      console.log('Creating new user record')
      // Create new user record if it doesn't exist
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email,
            points: 0,
            tier: AdvocateLevel.BRONZE,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true
          }
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        throw insertError
      }
      
      console.log('Created new user:', newUser)
      setDbUser(newUser as DbUser)
      return newUser
    } catch (error) {
      console.error('Error ensuring user record:', error)
      throw error // Re-throw to handle in the calling function
    }
  }

  useEffect(() => {
    let mounted = true
    console.log('Setting up auth subscriptions')
    
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Got initial session:', session?.user?.id)
        
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await ensureUserRecord(session.user)
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
        setLoading(true)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await ensureUserRecord(session.user)
        } else {
          setDbUser(null)
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      console.log('Cleaning up auth subscriptions')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])


  useEffect(() => {
    console.log('Setting up auth subscriptions')
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got initial session:', session?.user?.id)
      setUser(session?.user ?? null)
      if (session?.user) {
        ensureUserRecord(session.user)
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      setUser(session?.user ?? null)
      if (session?.user) {
        await ensureUserRecord(session.user)
      } else {
        setDbUser(null)
      }
      setLoading(false)
    })

    return () => {
      console.log('Cleaning up auth subscriptions')
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up for:', email)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    console.log('Signing out')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  if (loading) {
    console.log('Auth provider is loading')
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
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