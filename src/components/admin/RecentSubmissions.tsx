import { createServerSupabaseClient } from '@/lib/supabase/server'

interface Submission {
  id: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
  advocate: {
    email: string
  }
  challenge: {
    title: string
  }
}

export async function RecentSubmissions() {
  const supabase = createServerSupabaseClient()
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      id,
      created_at,
      status,
      advocate:profiles(email),
      challenge:challenges(title)
    `)
    .order('created_at', { ascending: false })
    .limit(5) as { data: Submission[] | null }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="font-semibold">Recent Submissions</h2>
      </div>
      <div className="divide-y">
        {submissions?.map((submission: Submission) => (
          <div key={submission.id} className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{submission.challenge.title}</p>
                <p className="text-sm text-gray-600">{submission.advocate.email}</p>
              </div>
              <div className="flex items-center">
                <span className={`
                  inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${submission.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'}
                `}>
                  {submission.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
