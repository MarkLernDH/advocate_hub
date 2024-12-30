'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Trophy,
  Users,
  Settings,
  BarChart
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/(protected)/admin/dashboard', icon: LayoutDashboard },
  { name: 'Challenges', href: '/(protected)/admin/challenges', icon: Trophy },
  { name: 'Advocates', href: '/(protected)/admin/advocates', icon: Users },
  { name: 'Analytics', href: '/(protected)/admin/analytics', icon: BarChart },
  { name: 'Settings', href: '/(protected)/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Admin Portal</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
              )}
            >
              <item.icon
                className={cn(
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-white',
                  'mr-3 h-5 w-5 flex-shrink-0'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="flex h-16 items-center justify-center border-t border-gray-800">
        <span className="text-sm text-gray-400">Logged in as Admin</span>
      </div>
    </div>
  )
}
