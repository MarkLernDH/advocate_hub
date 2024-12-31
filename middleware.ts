/// <reference types="node" />
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

  // If not logged in and trying to access protected routes, redirect to login
  if (!session && (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/advocate')
  )) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Skip auth checks for auth-related routes except /auth/callback
  if (request.nextUrl.pathname.startsWith('/auth') && 
      !request.nextUrl.pathname.startsWith('/auth/callback')) {
    // If logged in and trying to access login/signup pages, redirect to appropriate dashboard
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

  // If logged in, fetch user role
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // If user is not found or has no role, redirect to error page
    if (!user?.role) {
      return NextResponse.redirect(new URL('/auth/error', request.url))
    }

    // If at root or accessing wrong role's routes, redirect to appropriate dashboard
    if (request.nextUrl.pathname === '/' || 
        (request.nextUrl.pathname.startsWith('/admin') && user.role !== UserRole.ADMIN) ||
        (request.nextUrl.pathname.startsWith('/advocate') && user.role !== UserRole.ADVOCATE)) {
      const targetPath = user.role === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard'
      return NextResponse.redirect(new URL(targetPath, request.url))
    }
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