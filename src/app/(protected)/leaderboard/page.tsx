import { createServerSupabaseClient } from '@/lib/supabase/server'
import { type Profile } from '@/lib/supabase/schema'

interface LeaderboardEntry extends Profile {}

function calculateLevel(points: number): string {
  if (points >= 1000) return 'Diamond'
  if (points >= 500) return 'Platinum'
  if (points >= 250) return 'Gold'
  if (points >= 100) return 'Silver'
  return 'Bronze'
}

export default async function LeaderboardPage() {
  const supabase = createServerSupabaseClient()
  
  const { data: advocates, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, total_points')
    .order('total_points', { ascending: false })
    .limit(100) as { data: LeaderboardEntry[] | null, error: Error | null }

  if (error) {
    throw new Error('Failed to load leaderboard')
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Advocate Leaderboard</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">Rank</th>
              <th className="px-6 py-3 text-left">Advocate</th>
              <th className="px-6 py-3 text-left">Level</th>
              <th className="px-6 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {advocates?.map((advocate, index) => (
              <tr key={advocate.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{advocate.full_name || advocate.email}</td>
                <td className="px-6 py-4">{calculateLevel(advocate.total_points)}</td>
                <td className="px-6 py-4 text-right">{advocate.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
