import { type NextRequest } from 'next/server'
import { type Session } from '@supabase/supabase-js'

export const isDebug = process.env.NODE_ENV !== 'production'

type MiddlewareContext = {
  action: string
  session: Session | null
  profile: { role?: string } | null
  redirectCount: number
  redirectTo?: string | null
  error?: string
}

export function logMiddleware(request: NextRequest, context: MiddlewareContext) {
  if (!isDebug) return

  console.log(`[Middleware] ${context.action}:`, {
    path: request.nextUrl.pathname,
    ...context,
    timestamp: new Date().toISOString()
  })
}

export function addDebugHeaders(headers: Headers, context: {
  role?: string | null
  pathType: 'public' | 'protected'
  redirectCount: number
}) {
  if (!isDebug) return

  headers.set('x-auth-role', context.role || 'none')
  headers.set('x-path-type', context.pathType)
  headers.set('x-redirect-count', context.redirectCount.toString())
}
