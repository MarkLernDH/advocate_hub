'use client'

import React, { useEffect, useState } from 'react'
import { Card } from "../../../components/ui/card"
import { DbUser } from '../../../types'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../components/providers/AuthProvider'
import { DailyBonus } from '../../../components/DailyBonus'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) throw error
        setDbUser(data)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setUserLoading(false)
      }
    }

    loadUser()
  }, [user])

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Error Loading Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Unable to load user data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {dbUser.email}</p>
            <p><span className="font-medium">Role:</span> {dbUser.role}</p>
            <p><span className="font-medium">Points:</span> {dbUser.points}</p>
            <p><span className="font-medium">Level:</span> {dbUser.level}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Bonus</h2>
          <DailyBonus userId={dbUser.id} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => {/* Add action */}}
            >
              Review Submissions
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              onClick={() => {/* Add action */}}
            >
              Create Challenge
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
