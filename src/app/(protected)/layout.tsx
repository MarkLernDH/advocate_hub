import { RoleGuard } from '@/components/auth/RoleGuard'
import { UserRole } from '@/lib/supabase/types'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['admin', 'advocate'] as UserRole[]}>
      <main className="min-h-screen">
        {children}
      </main>
    </RoleGuard>
  )
}
