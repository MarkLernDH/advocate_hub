export type ReviewStatus = 'pending' | 'approved' | 'rejected'
export type SubmissionQuality = 'outstanding' | 'good' | 'acceptable' | 'poor'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'ADMIN' | 'ADVOCATE'
  total_points: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  submission_id: string
  reviewer_id: string
  status: ReviewStatus
  quality: SubmissionQuality
  feedback: string
  points_awarded: number
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  user_id: string
  challenge_id: string
  content: string
  status: ReviewStatus
  created_at: string
  updated_at: string
  advocate: {
    id: string
    email: string
    full_name: string
  }
  challenge: {
    id: string
    title: string
    description: string
    reward_points: number
  }
  files?: {
    url: string
    type: string
    name: string
  }[]
}
