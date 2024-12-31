export const SUPABASE_AUTH_COOKIE = 'advocacy-hub-auth'
export const SESSION_EXPIRY = 60 * 60 * 8 // 8 hours
export const AUTH_ROUTES = ['/auth/login', '/auth/callback']
export const PROTECTED_ROUTES = {
  admin: ['/admin', '/admin/dashboard', '/admin/challenges', '/admin/review'],
  advocate: ['/advocate', '/advocate/dashboard']
}
