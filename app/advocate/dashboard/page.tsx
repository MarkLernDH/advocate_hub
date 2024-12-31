'use client'

import React, { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import Image from 'next/image'
import { 
  DbUser, 
  Challenge, 
  ChallengeType, 
  ProofType, 
  ChallengeStatus 
} from '@/types/index'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/app/components/providers/AuthProvider'
import { DailyBonus } from '@/components/DailyBonus'

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Share our latest report on LinkedIn',
    description: 'Help spread the word about our latest industry insights',
    type: ChallengeType.SOCIAL_SHARE,
    points: 100,
    proofRequirements: [ProofType.LINK],
    imageUrl: '/linkedin.svg',
    instructions: ['Go to LinkedIn', 'Share our latest report', 'Copy the link to your post'],
    status: ChallengeStatus.ACTIVE
  },
  {
    id: '2',
    title: 'Comment on this LinkedIn thread?',
    description: 'Join the conversation and share your thoughts',
    type: ChallengeType.SOCIAL_SHARE,
    points: 200,
    proofRequirements: [ProofType.LINK],
    imageUrl: '/linkedin.svg',
    instructions: ['Find the thread', 'Add your perspective', 'Copy the link to your comment'],
    status: ChallengeStatus.ACTIVE
  },
  {
    id: '3',
    title: 'Give us a review on G2!',
    description: 'Share your experience with our platform',
    type: ChallengeType.G2_REVIEW,
    points: 200,
    proofRequirements: [ProofType.LINK],
    imageUrl: '/g2.svg',
    instructions: ['Visit our G2 page', 'Write an honest review', 'Copy the link to your review'],
    status: ChallengeStatus.ACTIVE
  }
]

export default function Dashboard() {
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
                <div className="text-gray-300 mb-2">Advocacy Level</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">{dbUser?.tier || 'BRONZE'}</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  View Benefits <span className="ml-1">→</span>
                </button>
              </div>
              <div className="bg-[#152c5b] p-6 rounded-lg text-center min-w-[240px]">
                <div className="text-gray-300 mb-2">Total Points</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">{dbUser?.points?.toLocaleString() || '0'}</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  View History <span className="ml-1">→</span>
                </button>
              </div>
              <div className="bg-[#152c5b] p-6 rounded-lg text-center min-w-[240px]">
                <div className="text-gray-300 mb-2">Unlocked Rewards</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">2</div>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center w-full">
                  Redeem <span className="ml-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Bonus Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <DailyBonus />
      </section>

      {/* Challenges Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6">
              <div className="flex flex-col h-full">
                <Image
                  src={challenge.imageUrl || '/default-challenge.svg'}
                  alt={challenge.title}
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h2 className="text-xl font-semibold mb-3">{challenge.title}</h2>
                <p className="text-gray-600 mb-auto">{challenge.description}</p>
                <div className="flex justify-between items-center w-full mt-6">
                  <span className="text-sm font-medium text-blue-600">
                    {challenge.points} points
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Start Challenge
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
