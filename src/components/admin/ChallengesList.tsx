import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Challenge {
  id: string
  title: string
  description: string
  reward_points: number
  created_at: string
  status: 'draft' | 'active' | 'completed'
}

interface ChallengesListProps {
  challenges: Challenge[]
}

export function ChallengesList({ challenges }: ChallengesListProps) {
  return (
    <div className="divide-y divide-gray-200 rounded-lg border bg-white">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  <Link 
                    href={`/admin/challenges/${challenge.id}`}
                    className="hover:text-primary"
                  >
                    {challenge.title}
                  </Link>
                </h3>
                <span className={`
                  ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                    challenge.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'}
                `}>
                  {challenge.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {challenge.description}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{challenge.reward_points} points</span>
                <span className="mx-2">•</span>
                <span>Created {formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
