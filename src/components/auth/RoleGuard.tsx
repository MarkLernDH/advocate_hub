// src/components/auth/RoleGuard.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/supabase/context'
import { UserRole } from '@/lib/supabase/types'
import { SUPABASE_CONFIG } from '@/lib/supabase/config'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackUrl?: string
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = SUPABASE_CONFIG.auth.routes.unauthorized
}: RoleGuardProps) {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div>Loading...</div> // TODO: Replace with proper loading component
  }

  if (error) {
    router.push(SUPABASE_CONFIG.auth.routes.signIn)
    return null
  }

  if (!user || !allowedRoles.includes(user.role)) {
    router.push(fallbackUrl)
    return null
  }

  return <>{children}</>
}
