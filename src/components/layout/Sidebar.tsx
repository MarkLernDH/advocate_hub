import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/supabase/context'
import { SUPABASE_CONFIG } from '@/lib/supabase/config'

interface Route {
  href: string
  label: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'
  const routes: Route[] = isAdmin 
    ? [
        { href: SUPABASE_CONFIG.routes.admin.dashboard, label: 'Dashboard' },
        { href: SUPABASE_CONFIG.routes.admin.challenges, label: 'Challenges' },
        { href: SUPABASE_CONFIG.routes.admin.review, label: 'Review' },
      ]
    : [
        { href: SUPABASE_CONFIG.routes.advocate.dashboard, label: 'Dashboard' },
        { href: SUPABASE_CONFIG.routes.advocate.challenges, label: 'Challenges' },
      ]

  return (
    <aside className="w-64 border-r bg-gray-50">
      <nav className="flex flex-col gap-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              pathname === route.href
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
