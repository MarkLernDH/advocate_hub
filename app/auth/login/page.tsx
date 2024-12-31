'use client'

import LoginForm from '../../components/auth/LoginForm'
import { useAuth } from '../../components/providers/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

function LoginPageContent() {
  const { user, dbUser, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo') || '/'

  useEffect(() => {
    if (!loading && user && dbUser) {
      router.replace(redirectTo)
    }
  }, [user, dbUser, loading, router, redirectTo])

  // Don't render the form if we're already authenticated
  if (loading || user) {
    return null
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