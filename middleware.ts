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

  // If logged in but accessing auth routes and has role, redirect to appropriate dashboard
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (user?.role) {
      // Don't redirect if we're in the callback route
      if (!request.nextUrl.pathname.startsWith('/auth/callback')) {
        return NextResponse.redirect(new URL(
          user.role === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard',
          request.url
        ))
      }
    }
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

    // If accessing admin routes but not an admin, redirect to advocate dashboard
    if (request.nextUrl.pathname.startsWith('/admin') && user.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/advocate/dashboard', request.url))
    }

    // If accessing advocate routes but not an advocate, redirect to admin dashboard
    if (request.nextUrl.pathname.startsWith('/advocate') && user.role !== UserRole.ADVOCATE) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // If at root, redirect based on role
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL(
        user.role === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard',
        request.url
      ))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth folder (authentication pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}