import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ChallengesList } from '@/components/admin/ChallengesList'
import { CreateChallengeButton } from '@/components/admin/CreateChallengeButton'

export default async function ChallengesPage() {
  const supabase = createServerSupabaseClient()
  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <CreateChallengeButton />
      </div>
      <ChallengesList challenges={challenges || []} />
    </div>
  )
}
