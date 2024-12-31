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

export async function middleware(request: NextRequest) {
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

  // Static files and API routes bypass middleware
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

  // Increment redirect count
  response.headers.set('x-redirect-count', (redirectCount + 1).toString())

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

  // Allow public routes
  if (isPublicPath(request.nextUrl.pathname)) {
    logMiddleware(request, {
      action: 'Public route access',
      session: null,
      profile: null,
      redirectCount
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
    pathType: isPublicPath(request.nextUrl.pathname) ? 'public' : 'protected',
    redirectCount
  })

  // Handle login page separately
  if (request.nextUrl.pathname === paths.auth.login) {
    if (!session) {
      logMiddleware(request, {
        action: 'Login page access - no session',
        session,
        profile,
        redirectCount
      })
      return response
    }
    
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const isValidRedirect = isValidRedirectPath(redirectTo, profile?.role as UserRole)
    const targetPath = isValidRedirect 
      ? redirectTo! 
      : getDefaultRedirect(profile?.role as UserRole)
    
    logMiddleware(request, {
      action: 'Login redirect',
      session,
      profile,
      redirectCount,
      redirectTo: targetPath
    })

    return NextResponse.redirect(createUrl(targetPath, request.url))
  }

  // Handle unauthenticated users
  if (!session) {
    logMiddleware(request, {
      action: 'Unauthenticated access',
      session: null,
      profile: null,
      redirectCount
    })
    const loginUrl = createUrl(paths.auth.login, request.url)
    if (request.nextUrl.pathname !== '/') {
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
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
  if (!isAuthorizedForPath(profile.role as UserRole, request.nextUrl.pathname)) {
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