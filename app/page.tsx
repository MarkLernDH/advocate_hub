'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './components/providers/AuthProvider'
import { Card } from "../components/ui/card"
import Image from 'next/image'
import { DbUser } from '../types'


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
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Advocacy Hub</h1>
        
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