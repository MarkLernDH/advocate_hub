import type { NextApiRequest, NextApiResponse } from 'next'
import { sendEmail, newChallengeEmail } from '../../../../lib/emailService'
import { Challenge, Advocate } from '../../../../types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const challengeData: Omit<Challenge, 'id'> = req.body

      // Create challenge
      const challenge: Challenge = {
        id: generateId(), // Implement this function to generate a unique ID
        ...challengeData,
      }

      // Save challenge to database
      // This is a placeholder and should be replaced with actual database insert logic
      await saveChallenge(challenge)

      // Fetch all advocates
      // This is a placeholder and should be replaced with actual database query
      const advocates: Advocate[] = await fetchAllAdvocates()

      // Send email notification to all advocates
      for (const advocate of advocates) {
        const emailContent = newChallengeEmail(advocate.name, challenge.title, challenge.description)
        await sendEmail(advocate.email, 'New Challenge Available', emailContent)
      }

      res.status(201).json({ message: 'Challenge created successfully', challenge })
    } catch (error) {
      console.error('Error creating challenge:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// Placeholder functions - replace these with actual database queries
async function saveChallenge(challenge: Challenge): Promise<void> {
  // Implement this function to save the challenge to your database
  console.log('Saving challenge:', challenge)
}

async function fetchAllAdvocates(): Promise<Advocate[]> {
  // Implement this function to fetch all advocates from your database
  return []
}

function generateId(): string {
  // Implement this function to generate a unique ID for challenges
  return Math.random().toString(36).substr(2, 9)
}

