import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_AUTH_COOKIE, SESSION_EXPIRY } from './constants'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const createClient = () => {
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: SUPABASE_AUTH_COOKIE,
        flowType: 'pkce'
      },
      cookieOptions: {
        name: SUPABASE_AUTH_COOKIE,
        maxAge: SESSION_EXPIRY,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  )
}
