import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a singleton instance
let _supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (_supabaseInstance === null) {
    _supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'advocacy-hub-auth'
      }
    })
  }
  return _supabaseInstance
}

// Export the singleton instance
export const supabase = getSupabaseClient()