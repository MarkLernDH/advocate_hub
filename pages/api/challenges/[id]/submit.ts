import type { NextApiRequest, NextApiResponse } from 'next'
import { validateLinkSubmission } from '../../../../lib/autoValidation'
import { awardPoints } from '../../../../lib/pointsDistribution'
import { sendEmail, submissionStatusChangeEmail } from '../../../../lib/emailService'
import { Advocate, Challenge, Submission, SubmissionStatus, SubmissionType } from '../../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.query
      const { advocateId, content } = req.body

      // Fetch challenge and advocate data
      // This is a placeholder and should be replaced with actual database queries
      const challenge: Challenge = await fetchChallenge(id as string)
      const advocate: Advocate = await fetchAdvocate(advocateId)

      let status = SubmissionStatus.PENDING
      let autoValidated = false

      if (challenge.submissionType === SubmissionType.LINK) {
        autoValidated = await validateLinkSubmission(content.link)
        if (autoValidated) {
          status = SubmissionStatus.APPROVED
        }
      }

      // Create submission
      const submission: Submission = {
        id: generateId(), // Implement this function to generate a unique ID
        challengeId: challenge.id,
        advocateId: advocate.id,
        content,
        status,
        submittedAt: new Date(),
      }

      // Save submission to database
      // This is a placeholder and should be replaced with actual database insert logic
      await saveSubmission(submission)

      // If auto-validated and approved, award points
      if (status === SubmissionStatus.APPROVED) {
        await awardPoints(advocate, challenge, status)
      }

      // Send email notification
      const emailContent = submissionStatusChangeEmail(advocate.name, challenge.title, status)
      await sendEmail(advocate.email, 'Submission Status Update', emailContent)

      res.status(200).json({ message: `Submission for challenge ${id} received`, status, autoValidated })
    } catch (error) {
      console.error('Error processing submission:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// Placeholder functions - replace these with actual database queries
async function fetchChallenge(id: string): Promise<Challenge> {
  // Implement this function to fetch challenge data from your database
  return {} as Challenge
}

async function fetchAdvocate(id: string): Promise<Advocate> {
  // Implement this function to fetch advocate data from your database
  return {} as Advocate
}

async function saveSubmission(submission: Submission): Promise<void> {
  // Implement this function to save the submission to your database
  console.log('Saving submission:', submission)
}

function generateId(): string {
  // Implement this function to generate a unique ID for submissions
  return Math.random().toString(36).substr(2, 9)
}

