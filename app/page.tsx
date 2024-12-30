import { Card } from "../components/ui/card"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookieStore = cookies()
          return Array.from(cookieStore.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            // This won't actually set cookies in a server component,
            // but we need to provide the method
          })
        }
      }
    }
  )

  // Get session and redirect if not authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Fetch user stats
  const { data: statsData } = await supabase
    .from('user_stats')
    .select('advocacy_level, total_points, unlocked_rewards')
    .eq('user_id', session.user.id)
    .single()

  const userStats = [
    {
      label: "Advocacy Level",
      value: statsData?.advocacy_level || "Bronze",
      action: "View Benefits",
      href: "/benefits"
    },
    {
      label: "Total Points",
      value: statsData?.total_points?.toLocaleString() || "0",
      action: "View History",
      href: "/history"
    },
    {
      label: "Unlocked Rewards",
      value: statsData?.unlocked_rewards?.toString() || "0",
      action: "Redeem",
      href: "/rewards"
    }
  ]

  // Fetch recommended challenges
  const { data: recommendedChallenges = [] } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  const challenges = (recommendedChallenges ?? []).map((challenge) => ({
    icon: challenge.platform_icon || "/default-challenge.svg",
    title: challenge.title,
    points: challenge.points,
  }))

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header Section */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#09143A] rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">
                Welcome Back, <span className="text-[#4ADE80]">{userData?.name || session.user.email?.split('@')[0]}</span>
              </h1>
              <div className="flex gap-6">
                {userStats.map((stat) => (
                  <div key={stat.label} className="bg-[#0F1729]/50 rounded-lg p-4 min-w-[200px]">
                    <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold mb-2">{stat.value}</div>
                    <a href={stat.href} className="text-sm text-blue-400 hover:text-blue-300">
                      {stat.action} →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Recommended for you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.title} className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <img src={challenge.icon} alt="" className="w-8 h-8 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {challenge.title}
                  </h3>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                {challenge.points} points
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )}