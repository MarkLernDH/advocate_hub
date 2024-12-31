'use client'

import Link from 'next/link'
import AuthNav from '../auth/AuthNav'
import { useAuth } from '../providers/AuthProvider'

export default function Navigation() {
  const { dbUser } = useAuth()
  const isAdmin = dbUser?.role === 'ADMIN'
  const baseRoute = isAdmin ? '/admin' : '/advocate'

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Advocacy Hub
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link 
              href={`${baseRoute}/dashboard`}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            {!isAdmin && (
              <>
                <Link 
                  href={`${baseRoute}/rewards`}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Rewards
                </Link>
                <Link 
                  href={`${baseRoute}/leaderboard`}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link 
                  href={`${baseRoute}/submissions`}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Submissions
                </Link>
                <Link 
                  href={`${baseRoute}/submissions/history`}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  History
                </Link>
              </>
            )}
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  )
}
