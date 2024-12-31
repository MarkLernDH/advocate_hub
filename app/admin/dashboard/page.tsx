'use client'

import React from 'react'
import { Card } from "../../../components/ui/card"
import { useAuth } from '../../components/providers/AuthProvider'
import { DailyBonus } from '../../../components/DailyBonus'

export default function AdminDashboard() {
  const { dbUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Daily Bonus</h3>
              <DailyBonus userId={''} />
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Submissions</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">1</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
