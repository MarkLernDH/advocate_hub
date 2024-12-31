import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SubmissionView } from '@/components/admin/SubmissionView'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { type Submission } from '@/lib/supabase/schema'

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  
  const { data: submission, error } = await supabase
    .from('submissions')
    .select(`
      *,
      advocate:profiles(id, email, full_name),
      challenge:challenges(id, title, description, reward_points),
      files
    `)
    .eq('id', params.id)
    .single() as { data: Submission | null, error: Error | null }

  if (error) {
    throw new Error('Failed to load submission')
  }

  if (!submission) {
    throw new Error('Submission not found')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Review Submission</h1>
      
      <div className="rounded-lg border bg-white shadow">
        <SubmissionView submission={submission} />
      </div>
      
      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-6 text-lg font-semibold">Submit Review</h2>
        <ReviewForm id={params.id} />
      </div>
    </div>
  )
}
