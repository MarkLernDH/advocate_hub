export const SUPABASE_CONFIG = {
  auth: {
    cookie: 'advocacy-hub-auth',
    sessionExpiry: 60 * 60 * 8, // 8 hours
    routes: {
      signIn: '/auth/login',
      signOut: '/auth/logout',
      callback: '/auth/callback',
      unauthorized: '/auth/unauthorized',
    }
  },
  routes: {
    public: ['/'],
    admin: {
      dashboard: '/admin/dashboard',
      challenges: '/admin/challenges',
      review: '/admin/review',
    },
    advocate: {
      dashboard: '/advocate/dashboard',
      challenges: '/advocate/challenges',
    }
  }
} as const

export const PROTECTED_PATHS = {
  admin: Object.values(SUPABASE_CONFIG.routes.admin),
  advocate: Object.values(SUPABASE_CONFIG.routes.advocate),
}
