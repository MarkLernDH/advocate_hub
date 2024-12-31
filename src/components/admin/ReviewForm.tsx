'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ReviewStatus, type SubmissionQuality } from '@/lib/supabase/schema'
import { useToast } from '@/components/ui/Toast'
import { handleError } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ReviewFormProps {
  id: string
}

export function ReviewForm({ id }: ReviewFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<ReviewStatus>('pending')
  const [quality, setQuality] = useState<SubmissionQuality>('good')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/review/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, quality, feedback })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast({
        title: 'Review submitted',
        description: 'The submission has been successfully reviewed.',
        variant: 'success'
      })

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      handleError(error, {
        toast,
        defaultMessage: 'Failed to submit review'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Review Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReviewStatus)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isSubmitting}
        >
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Submission Quality
        </label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as SubmissionQuality)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isSubmitting}
        >
          <option value="outstanding">Outstanding</option>
          <option value="good">Good</option>
          <option value="acceptable">Acceptable</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          required
          disabled={isSubmitting}
          placeholder="Provide detailed feedback for the advocate..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}
