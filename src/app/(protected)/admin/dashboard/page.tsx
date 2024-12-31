import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { PendingReviews } from '@/components/admin/PendingReviews'
import { RecentSubmissions } from '@/components/admin/RecentSubmissions'
import { type Submission } from '@/lib/supabase/schema'

interface DashboardStats {
  total_advocates: number
  total_submissions: number
  pending_reviews: number
  total_points_awarded: number
}

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()
  
  // Fetch dashboard stats
  const { data: statsData } = await supabase
    .from('profiles')
    .select('role', { count: 'exact' })
    .eq('role', 'advocate')
  
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('points_awarded')
  
  const { data: submissionsData } = await supabase
    .from('submissions')
    .select('status')
  
  const stats: DashboardStats = {
    total_advocates: statsData?.length || 0,
    total_submissions: submissionsData?.length || 0,
    pending_reviews: submissionsData?.filter(s => s.status === 'pending').length || 0,
    total_points_awarded: reviewsData?.reduce((sum, r) => sum + (r.points_awarded || 0), 0) || 0
  }

  // Fetch pending reviews
  const { data: pendingSubmissions } = await supabase
    .from('submissions')
    .select(`
      id,
      created_at,
      status,
      advocate:profiles(id, email, full_name),
      challenge:challenges(id, title, description, reward_points)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Submission[] | null }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingReviews submissions={pendingSubmissions || []} />
        <RecentSubmissions />
      </div>
    </div>
  )
}
