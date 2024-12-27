import { Card } from "../components/ui/card"

export default function Dashboard() {
  const userStats = [
    {
      label: "Advocacy Level",
      value: "Gold",
      action: "View Benefits",
      href: "/benefits"
    },
    {
      label: "Total Points",
      value: "31,662",
      action: "View History",
      href: "/history"
    },
    {
      label: "Unlocked Rewards",
      value: "2",
      action: "Redeem",
      href: "/rewards"
    }
  ]

  const recommendedChallenges = [
    {
      icon: "/linkedin.svg",
      title: "Share our latest report on LinkedIn",
      points: 200,
    },
    {
      icon: "/linkedin.svg",
      title: "Comment on this LinkedIn thread?",
      points: 200,
    },
    {
      icon: "/g2.svg",
      title: "Give us a review on G2!",
      points: 200,
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
    {/* Header Section */}
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#09143A] rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">
              Welcome Back, <span className="text-[#4ADE80]">Mark</span>
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
          {recommendedChallenges.map((challenge) => (
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
  )
}