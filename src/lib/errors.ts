export const errorCodes = {
  TOO_MANY_REDIRECTS: 'too_many_redirects',
  NO_PROFILE: 'no_profile',
  INVALID_ROLE: 'invalid_role',
  UNAUTHORIZED: 'unauthorized'
} as const

export type ErrorCode = keyof typeof errorCodes

export const errorMessages: Record<ErrorCode, string> = {
  TOO_MANY_REDIRECTS: 'Too many redirects occurred. Please try clearing your cookies or contact support.',
  NO_PROFILE: 'Your user profile could not be found. Please contact support.',
  INVALID_ROLE: 'You do not have permission to access this page.',
  UNAUTHORIZED: 'You must be logged in to access this page.'
}

export function createErrorUrl(code: ErrorCode, baseUrl: string): URL {
  return new URL(`/auth/error?code=${errorCodes[code]}`, baseUrl)
}
