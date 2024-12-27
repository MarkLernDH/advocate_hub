'use client'

import Link from 'next/link'
import { useAuth } from '../providers/AuthProvider'

export default function AuthNav() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="flex space-x-4">
        <Link
          href="/auth/login"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <button
      onClick={() => signOut()}
      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      Sign Out
    </button>
  )
}