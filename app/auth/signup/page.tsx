'use client'

import SignUpForm from '../../components/auth/SignUpForm'
import { useAuth } from '../../components/providers/AuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function SignUpPageContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo') || '/'

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Don't render the form if we're already authenticated
  if (loading || user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SignUpForm />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPageContent />
    </Suspense>
  )
}