import { RoleGuard } from '@/components/auth/RoleGuard'
import { UserRole } from '@/lib/supabase/types'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['admin'] as UserRole[]}>
      <div className="flex min-h-screen">
        {/* TODO: Add AdminSidebar component */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </RoleGuard>
  )
}
