import { RoleGuard } from '@/components/auth/RoleGuard'
import { UserRole } from '@/lib/supabase/types'

export default function AdvocateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['advocate'] as UserRole[]}>
      <div className="flex min-h-screen">
        {/* TODO: Add AdvocateSidebar component */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </RoleGuard>
  )
}
