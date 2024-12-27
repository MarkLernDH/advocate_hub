import type { NextApiRequest, NextApiResponse } from 'next'
import { Challenge, ChallengeStatus, SubmissionType } from '../../../types'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // TODO: In the future, fetch challenges from database
      const challenges: Challenge[] = [
        {
          id: '1',
          title: 'Write a Product Review',
          description: 'Share your experience with our product on your blog or social media.',
          points: 100,
          submissionType: SubmissionType.LINK,
          instructions: ['Write a detailed review', 'Include at least one photo', 'Share the link to your post'],
          deadline: new Date('2023-12-31'),
          status: ChallengeStatus.ACTIVE,
        },
        {
          id: '2',
          title: 'Attend a Webinar',
          description: 'Participate in our upcoming product webinar and provide feedback.',
          points: 50,
          submissionType: SubmissionType.TEXT,
          instructions: ['Register for the webinar', 'Attend the full session', 'Submit a summary of what you learned'],
          deadline: new Date('2023-11-30'),
          status: ChallengeStatus.ACTIVE,
        },
      ];
      
      res.status(200).json(challenges)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).json({ message: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Error in challenges endpoint:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

