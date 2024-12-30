'use client'

import LoginForm from '../../components/auth/LoginForm'
import { useAuth } from '../../components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  // Don't render the form if we're already authenticated
  if (user) {
    return null
  }

  return (
    <div>
      <LoginForm />
    </div>
  )
}