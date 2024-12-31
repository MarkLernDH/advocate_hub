'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabaseClient'

interface Submission {
  id: string
  user_id: string
  challenge_id: string
  created_at: string
  status: string
  points_awarded: number
  // Add any other fields from your submissions table
}

export default function SubmissionsHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('challenge_submissions')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setSubmissions(data || [])
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Submission History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Challenge
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {new Date(submission.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {submission.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {submission.challenge_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {submission.points_awarded}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}