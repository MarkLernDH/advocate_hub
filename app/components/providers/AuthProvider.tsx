'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabaseClient'
import { DbUser, AdvocateLevel, UserRole, Database } from '../../../types'
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
  const [initializing, setInitializing] = useState(true)
  const processingAuth = useRef(false)

  const ensureUserRecord = async (authUser: User) => {
    if (!authUser?.id) return null
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
        const user = existingUser as unknown as Database['public']['Tables']['users']['Row']
        setDbUser(user)
        return user
      }

      console.log('Creating new user record')
      const newUserData: Database['public']['Tables']['users']['Insert'] = {
        id: authUser.id,
        email: authUser.email!,
        points: 0,
        tier: AdvocateLevel.BRONZE,
        is_active: true,
        role: UserRole.ADVOCATE // Default new users to advocate role
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

    const initializeAuth = async () => {
      if (processingAuth.current) return
      processingAuth.current = true
      
      try {
        console.log('Initializing auth...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setUser(session?.user ?? null)
        if (session?.user) {
          await ensureUserRecord(session.user)
        } else {
          setDbUser(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setInitializing(false)
          setLoading(false)
          processingAuth.current = false
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: { user: User }) => {
        if (!mounted || processingAuth.current) return
        console.log('Auth state changed:', event, session?.user?.id)

        processingAuth.current = true
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setLoading(true)
          try {
            await ensureUserRecord(session.user)
          } catch (error) {
            console.error('Error handling auth state change:', error)
          } finally {
            if (mounted) {
              setLoading(false)
              processingAuth.current = false
            }
          }
        } else {
          setDbUser(null)
          processingAuth.current = false
        }
      }
    )

    return () => {
      console.log('Cleaning up auth subscriptions')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (processingAuth.current) return
    processingAuth.current = true
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } finally {
      setLoading(false)
      processingAuth.current = false
    }
  }

  const signUp = async (email: string, password: string) => {
    if (processingAuth.current) return
    processingAuth.current = true
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } finally {
      setLoading(false)
      processingAuth.current = false
    }
  }

  const signOut = async () => {
    if (processingAuth.current) return
    processingAuth.current = true
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setDbUser(null)
    } finally {
      setLoading(false)
      processingAuth.current = false
    }
  }

  if (initializing) {
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