import type { NextApiRequest, NextApiResponse } from 'next'
import { SubmissionStatus, ProofType } from '../../../../types/index'
import { validateLinkSubmission } from '../../../../lib/validation'
import { supabase } from '../../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const challengeId = req.query.id as string
    const { content, userId } = req.body

    // Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('ChallengeId', challengeId)
      .single()

    if (challengeError) throw challengeError

    let status = SubmissionStatus.PENDING
    let autoValidated = false

    // Check if the submission matches any of the required proof types
    if (challenge.ProofRequirements.includes(ProofType.LINK) && content.link) {
      autoValidated = await validateLinkSubmission(content.link)
      if (autoValidated) {
        status = SubmissionStatus.APPROVED
      }
    }

    // If it's an admin approval type, always set to pending
    if (challenge.ProofRequirements.includes(ProofType.ADMIN_APPROVAL)) {
      status = SubmissionStatus.PENDING
    }

    // Create submission record
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert([
        {
          challengeId,
          advocateId: userId,
          content,
          status,
          submittedAt: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (submissionError) throw submissionError

    // If submission was auto-approved, update user points
    if (status === SubmissionStatus.APPROVED) {
      const { error: pointsError } = await supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: challenge.Points
      })

      if (pointsError) throw pointsError
    }

    res.status(201).json({
      message: autoValidated ? 'Submission approved' : 'Submission pending review',
      submission
    })
  } catch (error) {
    console.error('Error submitting challenge:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
