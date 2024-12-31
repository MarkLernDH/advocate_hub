import { createServerSupabaseClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import { paths } from '@/lib/navigation'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo')
  
  if (code) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // If there's an error, redirect to login with error message
      const loginUrl = new URL(paths.auth.login, requestUrl.origin)
      loginUrl.searchParams.set('error', error.message)
      return NextResponse.redirect(loginUrl)
    }

    // If we have a session, check the user's role
    if (data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single()

      // Redirect to the appropriate dashboard if no specific redirect is provided
      if (!redirectTo) {
        const defaultRedirect = profile?.role === 'ADMIN'
          ? paths.dashboard.admin
          : paths.dashboard.advocate
        return NextResponse.redirect(new URL(defaultRedirect, requestUrl.origin))
      }
    }
  }

  // Redirect to the specified URL or the home page
  return NextResponse.redirect(
    new URL(redirectTo || '/', requestUrl.origin)
  )
}
