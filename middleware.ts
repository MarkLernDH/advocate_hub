import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types'
import { paths, isPublicPath, createUrl } from '@/lib/navigation'
import { errorCodes, createErrorUrl } from '@/lib/errors'
import { 
  isAuthorizedForPath, 
  isValidRedirectPath, 
  getDefaultRedirect 
} from '@/lib/auth'
import { logMiddleware, addDebugHeaders, isDebug } from '@/lib/debug'

// Helper to check if request is for static assets
function isStaticAsset(pathname: string): boolean {
  return pathname.startsWith('/_next') || 
         pathname.startsWith('/static') || 
         pathname.startsWith('/api') ||
         pathname.includes('.') // Catches files like favicon.ico, manifest.json, etc.
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Always allow static assets and API routes
  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0')
  if (redirectCount > 5) {
    logMiddleware(request, {
      action: 'Too many redirects',
      session: null,
      profile: null,
      redirectCount,
      error: errorCodes.TOO_MANY_REDIRECTS
    })
    return NextResponse.redirect(createErrorUrl('TOO_MANY_REDIRECTS', request.url))
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Increment redirect count
  response.headers.set('x-redirect-count', (redirectCount + 1).toString())

  // Create Supabase client with proper cookie handling
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
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            path: '/',
            maxAge: 0
          })
        },
      },
    }
  )

  // Allow public routes without any auth checks
  if (isPublicPath(pathname)) {
    logMiddleware(request, {
      action: 'Public route access',
      session: null,
      profile: null,
      redirectCount,
      path: pathname
    })
    return response
  }

  // Get session and profile in parallel
  const [sessionResult, profileResult] = await Promise.all([
    supabase.auth.getSession(),
    supabase.from('profiles').select('role').single()
  ])

  const session = sessionResult.data.session
  const profile = profileResult.data

  // Add debug information
  addDebugHeaders(response.headers, {
    role: profile?.role,
    pathType: isPublicPath(pathname) ? 'public' : 'protected',
    redirectCount
  })

  // If we're already on the login page, don't redirect again
  if (pathname === paths.auth.login) {
    if (!session) {
      logMiddleware(request, {
        action: 'Login page access - no session',
        session,
        profile,
        redirectCount
      })
      return response
    }
    
    // If authenticated on login page, redirect to appropriate dashboard
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const isValidRedirect = redirectTo && isValidRedirectPath(redirectTo, profile?.role as UserRole)
    const targetPath = isValidRedirect ? redirectTo : getDefaultRedirect(profile?.role as UserRole)
    
    // Prevent redirect loops
    if (pathname === targetPath) {
      return response
    }

    logMiddleware(request, {
      action: 'Login redirect - authenticated user',
      session,
      profile,
      redirectCount,
      redirectTo: targetPath
    })

    return NextResponse.redirect(createUrl(targetPath, request.url))
  }

  // Handle unauthenticated users
  if (!session) {
    // Prevent redirect loops
    if (pathname === paths.auth.login) {
      return response
    }

    logMiddleware(request, {
      action: 'Unauthenticated access',
      session: null,
      profile: null,
      redirectCount,
      path: pathname
    })

    const loginUrl = createUrl(paths.auth.login, request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirectTo', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Handle missing profile
  if (!profile) {
    logMiddleware(request, {
      action: 'Missing profile',
      session,
      profile: null,
      redirectCount,
      error: errorCodes.NO_PROFILE
    })
    return NextResponse.redirect(createErrorUrl('NO_PROFILE', request.url))
  }

  // Check path authorization
  if (!isAuthorizedForPath(profile.role as UserRole, pathname)) {
    logMiddleware(request, {
      action: 'Unauthorized path access',
      session,
      profile,
      redirectCount,
      error: errorCodes.INVALID_ROLE
    })
    return NextResponse.redirect(createErrorUrl('INVALID_ROLE', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}