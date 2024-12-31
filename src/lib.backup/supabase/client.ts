import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const createClient = () => createBrowserClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'advocacy-hub-auth',
      flowType: 'pkce'
    },
    cookieOptions: {
      name: 'advocacy-hub-auth',
      lifetime: 60 * 60 * 8,
      domain: process.env.NEXT_PUBLIC_DOMAIN,
      sameSite: 'lax',
      path: '/'
    }
  }
)