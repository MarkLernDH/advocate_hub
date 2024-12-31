'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useOptimistic } from 'react'
import { type Submission } from '@/lib/supabase/schema'

interface PendingReviewsProps {
  submissions: Submission[]
}

export function PendingReviews({ submissions: initialSubmissions }: PendingReviewsProps) {
  const [submissions, removeSubmission] = useOptimistic(
    initialSubmissions,
    (state: Submission[], submissionId: string) => 
      state.filter(s => s.id !== submissionId)
  )

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="font-semibold">Pending Reviews</h2>
      </div>
      <div className="divide-y">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            href={`/admin/review/${submission.id}`}
            className="block p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{submission.challenge.title}</p>
                <p className="text-sm text-gray-600">{submission.advocate.email}</p>
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
              </p>
            </div>
          </Link>
        ))}
        {submissions.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500">
            No pending reviews
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <Link
          href="/admin/review"
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          View all pending reviews →
        </Link>
      </div>
    </div>
  )
}
