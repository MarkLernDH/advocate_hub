/// <reference types="node" />
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

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

  // Skip auth check for public routes
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname.startsWith('/auth') && 
      !request.nextUrl.pathname.startsWith('/auth/callback')) {
    // If logged in on public routes, redirect to appropriate dashboard
    if (session) {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (user?.role) {
        const targetPath = user.role === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard'
        return NextResponse.redirect(new URL(targetPath, request.url))
      }
    }
    return response
  }

  // Require auth for protected routes
  if (!session) {
    const redirectUrl = new URL('/auth/login', request.url)
    if (request.nextUrl.pathname !== '/auth/login') {
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Check user role for protected routes
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user?.role) {
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  // Handle role-based access
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdvocateRoute = request.nextUrl.pathname.startsWith('/advocate')

  if ((isAdminRoute && user.role !== UserRole.ADMIN) ||
      (isAdvocateRoute && user.role !== UserRole.ADVOCATE)) {
    const targetPath = user.role === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard'
    return NextResponse.redirect(new URL(targetPath, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}