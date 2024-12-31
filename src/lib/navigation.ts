import { UserRole } from '@/types'

export const paths = {
  public: ['/auth/callback', '/auth/logout', '/auth/error'] as const,
  auth: {
    login: '/auth/login',
    error: '/auth/error',
    callback: '/auth/callback',
    logout: '/auth/logout'
  },
  dashboard: {
    admin: '/admin/dashboard',
    advocate: '/advocate/dashboard'
  }
} as const

export type PathsType = typeof paths
export type PublicPath = typeof paths.public[number]

export const errorCodes = {
  TOO_MANY_REDIRECTS: 'too_many_redirects',
  NO_PROFILE: 'no_profile',
  INVALID_ROLE: 'invalid_role',
  UNAUTHORIZED: 'unauthorized'
} as const

export type ErrorCode = typeof errorCodes[keyof typeof errorCodes]

export function createUrl(path: string, baseUrl: string): URL {
  return new URL(path, baseUrl)
}

export function isPublicPath(path: string): boolean {
  return paths.public.includes(path as PublicPath)
}

export function isAuthorizedForPath(role: string | null, path: string): boolean {
  if (path.startsWith('/admin')) {
    return role === UserRole.ADMIN
  }
  if (path.startsWith('/advocate')) {
    return role === UserRole.ADVOCATE
  }
  return true
}

export function getDashboardByRole(role: string): string {
  return role === UserRole.ADMIN ? paths.dashboard.admin : paths.dashboard.advocate
}

export function createErrorUrl(code: ErrorCode, baseUrl: string): URL {
  return new URL(`${paths.auth.error}?code=${code}`, baseUrl)
}
