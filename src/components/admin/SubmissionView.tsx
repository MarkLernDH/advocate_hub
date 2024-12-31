import { type Submission } from '@/lib/supabase/schema'
import { formatDistanceToNow } from 'date-fns'

interface SubmissionViewProps {
  submission: Submission
}

interface FileAttachment {
  url: string
  type: string
  name: string
}

export function SubmissionView({ submission }: SubmissionViewProps) {
  return (
    <div className="divide-y divide-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{submission.challenge.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Submitted by {submission.advocate.email} •{' '}
              {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`
              inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
              ${submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}
            `}>
              {submission.status}
            </span>
            <span className="text-sm text-gray-500">
              {submission.challenge.reward_points} points
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-900">Submission Content</h3>
        <div className="mt-2 prose prose-sm max-w-none">
          {submission.content}
        </div>
      </div>

      {submission.files && submission.files.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-gray-900">Attachments</h3>
          <ul className="mt-2 divide-y divide-gray-200">
            {submission.files.map((file: FileAttachment) => (
              <li key={file.url} className="py-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary"
                >
                  <span className="flex-1">{file.name}</span>
                  <span className="text-sm text-gray-500">{file.type}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
