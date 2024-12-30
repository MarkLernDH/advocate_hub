import { Card } from "../components/ui/card"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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
    points: 200,
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

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (userError) {
    console.error('Error fetching user data:', userError)
    return <div>Error loading dashboard</div>
  }

  const user = userData as DbUser

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-navy-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-bold">
                Welcome Back, <span className="text-emerald-400">{user.email?.split('@')[0]}</span>
              </h1>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-emerald-400 font-semibold">{user.tier}</div>
                  <div className="text-sm text-gray-300">Advocate Level</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-semibold">{user.points.toLocaleString()}</div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 relative">
                  <Image
                    src={challenge.icon}
                    alt={challenge.platform}
                    width={40}
                    height={40}
                  />
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 6L14 14M14 6L6 14" />
                  </svg>
                </button>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{challenge.title}</h3>
              <p className="mt-2 text-gray-600">{challenge.description}</p>
              <div className="mt-4 flex items-center">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5l1.85 3.75 4.15.6-3 2.925.7 4.175L10 12.925 6.3 14.95l.7-4.175-3-2.925 4.15-.6L10 3.5z" />
                </svg>
                <span className="ml-2 text-gray-600">{challenge.points} points</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Advocacy Rewards Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-lg p-8 text-white">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Earn Advocacy Rewards</h3>
              <p className="text-gray-300 mt-2">Spread the DealHub stuff and get rewarded</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['linkedin', 'g2', 'x', 'slack'].map((platform) => (
                <Card key={platform} className="bg-white/10 backdrop-blur-lg p-6">
                  <div className="h-10 w-10 relative mb-4">
                    <Image
                      src={`/${platform}.svg`}
                      alt={platform}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                  </p>
                  <div className="mt-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3.5l1.85 3.75 4.15.6-3 2.925.7 4.175L10 12.925 6.3 14.95l.7-4.175-3-2.925 4.15-.6L10 3.5z" />
                    </svg>
                    <span className="ml-2 text-gray-300">200 points</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}