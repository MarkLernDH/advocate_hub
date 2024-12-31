import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_ROUTES, PROTECTED_ROUTES } from './constants'
import type { UserRole } from './types'

export const createMiddlewareClient = (request: NextRequest) => {
  // Initialize response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  return {
    supabase: createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    ),
    response,
  }
}

export const authMiddleware = async (request: NextRequest) => {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  const { supabase, response } = createMiddlewareClient(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Allow access to public routes
  if (request.nextUrl.pathname === '/' || AUTH_ROUTES.includes(request.nextUrl.pathname)) {
    return response
  }

  // Redirect to login if no session
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = profile?.role as UserRole

  // Check role-based access
  const isAdminRoute = PROTECTED_ROUTES.admin.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAdvocateRoute = PROTECTED_ROUTES.advocate.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/advocate/dashboard', request.url))
  }

  if (isAdvocateRoute && role !== 'advocate') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}
