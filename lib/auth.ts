import { supabase } from './supabaseClient'
import { DbUser } from '../types'

export async function getCurrentUser(): Promise<DbUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function withAuth<T>(handler: (user: DbUser, ...args: any[]) => Promise<T>) {
  return async (...args: any[]): Promise<T> => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized')
    return handler(user, ...args)
  }
}