/// <reference types="node" />
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'
import { SUPABASE_CONFIG } from './src/lib/supabase/config'

export async function middleware(request: NextRequest) {
  // Static files and API routes bypass middleware
  if (request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static')) {
    return NextResponse.next()
  }

  // Create response and Supabase client
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

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // Special paths that should bypass middleware
  const isAuthCallback = request.nextUrl.pathname === '/auth/callback'
  const isLoginPage = request.nextUrl.pathname === '/auth/login'
  const isLogoutPage = request.nextUrl.pathname === '/auth/logout'

  // Always allow auth callback and logout
  if (isAuthCallback || isLogoutPage) {
    return response
  }

  // Handle unauthenticated users
  if (!session) {
    // Allow access to login page
    if (isLoginPage) {
      return response
    }

    // Redirect other routes to login
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // From this point on, we know the user is authenticated
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const userRole = profile?.role || 'ADVOCATE'

  // Handle login page access for authenticated users
  if (isLoginPage) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const dashboardPath = userRole === 'ADMIN' 
      ? SUPABASE_CONFIG.routes.admin.dashboard
      : SUPABASE_CONFIG.routes.advocate.dashboard
    
    return NextResponse.redirect(
      new URL(redirectTo || dashboardPath, request.url)
    )
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(
      new URL(SUPABASE_CONFIG.routes.advocate.dashboard, request.url)
    )
  }

  // Allow all other requests
  return response
}