import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll: () => {
          return Array.from(request.cookies.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options
            })
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Check route types
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/(protected)/admin')

  // If not authenticated and trying to access protected route, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access auth routes, redirect to appropriate dashboard
  if (isAuthRoute && session) {
    // Get user role from Supabase
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const redirectUrl = userData?.role === UserRole.ADMIN 
      ? new URL('/(protected)/admin/dashboard', request.url)
      : new URL('/(protected)/advocate/dashboard', request.url)
    
    return NextResponse.redirect(redirectUrl)
  }

  // If trying to access admin routes without admin role, redirect to advocate dashboard
  if (isAdminRoute && session) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userData?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/(protected)/advocate/dashboard', request.url))
    }
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Protected routes
    '/(protected)/:path*',
    // Auth routes
    '/auth/:path*'
  ]
}