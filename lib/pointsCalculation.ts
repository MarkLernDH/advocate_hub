import { Advocate, Challenge, SubmissionStatus } from '../types'

export function calculatePoints(advocate: Advocate, challenge: Challenge, status: SubmissionStatus): number {
  if (status === SubmissionStatus.APPROVED) {
    return advocate.points + challenge.points
  }
  return advocate.points
}

