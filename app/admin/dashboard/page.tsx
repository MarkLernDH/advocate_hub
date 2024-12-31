'use client'

import React, { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { DbUser } from '@/types/index'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/components/providers/AuthProvider'

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
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="bg-navy-900 text-white p-8 rounded-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Welcome Back, <span className="text-emerald-400">{dbUser?.email?.split('@')[0]}</span>
            </h1>
            <div className="flex gap-8">
              <div className="bg-[#152c5b] p-6 rounded-lg text-center min-w-[240px]">
                <div className="text-gray-300 mb-2">Total Users</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">245</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  View Details <span className="ml-1">→</span>
                </button>
              </div>
              <div className="bg-[#152c5b] p-6 rounded-lg text-center min-w-[240px]">
                <div className="text-gray-300 mb-2">Active Challenges</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">12</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  Manage <span className="ml-1">→</span>
                </button>
              </div>
              <div className="bg-[#152c5b] p-6 rounded-lg text-center min-w-[240px]">
                <div className="text-gray-300 mb-2">Pending Reviews</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">5</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  Review <span className="ml-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Create Challenge</h3>
            <p className="text-gray-600 mb-4">Create a new advocacy challenge for users</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create New
            </button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Review Submissions</h3>
            <p className="text-gray-600 mb-4">Review and approve pending submissions</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              View Queue
            </button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Manage Users
            </button>
          </Card>
        </div>
      </div>
    </main>
  )
}
