// Define routes that require authentication
export const PROTECTED_ROUTES = {
  admin: ['/admin'],
  advocate: ['/advocate', '/leaderboard', '/profile', '/challenges']
}

// Define routes that are only accessible when not authenticated
export const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password'
]
