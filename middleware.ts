/// <reference types="node" />
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'
import { SUPABASE_CONFIG } from './src/lib/supabase/config'

export async function middleware(request: NextRequest) {
  // Keep your static file check
  if (request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Define auth-related routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isCallbackRoute = request.nextUrl.pathname === '/auth/callback'
  const isLoginRoute = request.nextUrl.pathname === '/auth/login'

  // Allow callback route to proceed
  if (isCallbackRoute) {
    return response
  }

  // If user is not signed in
  if (!session) {
    // Allow access to login page
    if (isLoginRoute) {
      return response
    }
    // Redirect to login for all other routes
    const redirectUrl = new URL('/auth/login', request.url)
    if (!isAuthRoute) {
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in
  if (session) {
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = profile?.role || 'ADVOCATE'

    // Redirect from login page to appropriate dashboard
    if (isLoginRoute) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo')
      if (redirectTo) {
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }
      const dashboardPath = userRole === 'ADMIN' 
        ? SUPABASE_CONFIG.routes.admin.dashboard
        : SUPABASE_CONFIG.routes.advocate.dashboard
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }

    // Check admin route access
    if (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(SUPABASE_CONFIG.routes.advocate.dashboard, request.url))
    }
  }

  return response
}