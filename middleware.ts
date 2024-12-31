/// <reference types="node" />
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'

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
  
  // Define public routes - remove root path from public routes
  const isPublicRoute = request.nextUrl.pathname.startsWith('/auth') && 
    !request.nextUrl.pathname.startsWith('/auth/callback')

  // If the user is not signed in and the route is not public, redirect to login
  if (!session && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access login page, redirect to appropriate dashboard
  if (session && request.nextUrl.pathname === '/auth/login') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const redirectPath = profile?.role === 'ADMIN' 
      ? '/admin/dashboard'
      : '/advocate/dashboard'

    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Get user role once if session exists
  let userRole = null
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    userRole = user?.role
  }

  // Handle public routes
  if (isPublicRoute) {
    if (session && userRole) {
      const targetPath = userRole === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard'
      return NextResponse.redirect(new URL(targetPath, request.url))
    }
    return response
  }

  // Handle missing role
  if (!userRole) {
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  // Handle role-based access
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdvocateRoute = request.nextUrl.pathname.startsWith('/advocate')

  if ((isAdminRoute && userRole !== UserRole.ADMIN) ||
      (isAdvocateRoute && userRole !== UserRole.ADVOCATE)) {
    const targetPath = userRole === UserRole.ADMIN ? '/admin/dashboard' : '/advocate/dashboard'
    return NextResponse.redirect(new URL(targetPath, request.url))
  }
  console.log('Middleware path:', request.nextUrl.pathname)
  console.log('Session:', !!session)
  console.log('User role:', userRole)
  return response
}