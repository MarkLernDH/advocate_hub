'use client'

import LoginForm from '../../components/auth/LoginForm'
import { useAuth } from '../../components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/')
    }
  }, [user, loading, router])

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