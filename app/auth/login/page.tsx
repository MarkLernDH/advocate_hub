'use client'

import LoginForm from '../../components/auth/LoginForm'
import { useAuth } from '../../components/providers/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  children: React.ReactNode
}

function LoginPageContent() {
  const { user, loading } = useAuth()

  // Don't render the form if we're already authenticated
  // Let middleware handle the redirect
  if (loading || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}