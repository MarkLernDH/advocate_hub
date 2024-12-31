import { SupabaseClient, User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'advocate'

export interface AuthContextType {
  user: User | null
  role: UserRole | null
  isLoading: boolean
  supabase: SupabaseClient
}

export interface AuthState {
  accessToken: string | null
  user: User | null
  role: UserRole | null
}
