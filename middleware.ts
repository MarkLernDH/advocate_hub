import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  // Check if this is a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If trying to access auth routes while authenticated, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Protected routes
    '/(protected)/:path*',
    // Auth routes
    '/auth/:path*',
  ],
}