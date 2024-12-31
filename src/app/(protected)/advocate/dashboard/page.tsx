import { createServerSupabaseClient } from '@/lib/supabase/server'

interface Submission {
  status: string
  points: number | null
}

export default async function AdvocateDashboard() {
  const supabase = createServerSupabaseClient()
  
  // Fetch user's submissions count and points
  const { data: stats } = await supabase
    .from('submissions')
    .select('status, points', { count: 'exact' })
    .eq('user_id', (await supabase.auth.getSession()).data.session?.user.id || '') as { data: Submission[] | null }

  const totalSubmissions = stats?.length || 0
  const totalPoints = stats?.reduce((sum: number, item: Submission) => sum + (item.points || 0), 0) || 0
  const approvedSubmissions = stats?.filter((item: Submission) => item.status === 'approved').length || 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
          <p className="mt-2 text-3xl font-bold">{totalSubmissions}</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Approved Submissions</h3>
          <p className="mt-2 text-3xl font-bold">{approvedSubmissions}</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Points</h3>
          <p className="mt-2 text-3xl font-bold">{totalPoints}</p>
        </div>
      </div>

      {/* TODO: Add RecentSubmissions component */}
    </div>
  )
}
