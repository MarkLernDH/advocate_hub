import supabase from './supabase/client'
import { DbUser, Database, UserRole } from '../types/index'
import { paths } from './navigation'

// Existing auth functions
export async function getCurrentUser(): Promise<DbUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  if (!data) return null
  
  return data as unknown as Database['public']['Tables']['users']['Row']
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

// New auth utilities
export function isAuthorizedForPath(role: UserRole | null, path: string): boolean {
  if (path.startsWith('/admin')) {
    return role === UserRole.ADMIN
  }
  if (path.startsWith('/advocate')) {
    return role === UserRole.ADVOCATE
  }
  return true
}

export function getDefaultRedirect(role: UserRole): string {
  return role === UserRole.ADMIN 
    ? paths.dashboard.admin 
    : paths.dashboard.advocate
}

export function isValidRedirectPath(path: string | null, role: UserRole | null): boolean {
  if (!path || !role || path.startsWith('/auth/') || path === '/') {
    return false
  }
  return isAuthorizedForPath(role, path)
}

export function createRedirectUrl(path: string, baseUrl: string): URL {
  return new URL(path, baseUrl)
}