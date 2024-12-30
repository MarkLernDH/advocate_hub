'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './components/providers/AuthProvider'
import { Card } from "../components/ui/card"
import Image from 'next/image'
import { DbUser } from '../types'
import { supabase } from '../lib/supabaseClient'

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  platform: 'linkedin' | 'g2' | 'slack' | 'x'
  icon: string
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Share our latest report on LinkedIn',
    description: 'Help spread the word about our latest industry insights',
    points: 100,
    platform: 'linkedin',
    icon: '/linkedin.svg'
  },
  {
    id: '2',
    title: 'Comment on this LinkedIn thread?',
    description: 'Join the conversation and share your thoughts',
    points: 200,
    platform: 'linkedin',
    icon: '/linkedin.svg'
  },
  {
    id: '3',
    title: 'Give us a review on G2!',
    description: 'Share your experience with our platform',
    points: 200,
    platform: 'g2',
    icon: '/g2.svg'
  }
]

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setDbUser(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setUserLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  if (loading || userLoading) {
    return <div>Loading...</div>
  }

  if (!user || !dbUser) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="bg-navy-900 text-white p-8 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-bold">
                Welcome Back, <span className="text-emerald-400">{dbUser.email?.split('@')[0]}</span>
              </h1>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-emerald-400 font-semibold">{dbUser.tier}</div>
                  <div className="text-sm text-gray-300">Advocate Level</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-semibold">{dbUser.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-semibold">2</div>
                  <div className="text-sm text-gray-300">Completed Rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={challenge.icon}
                  alt={challenge.platform}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <h2 className="text-xl font-semibold">{challenge.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600">
                  {challenge.points} points
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Start Challenge
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}