import { Challenge, Submission, SubmissionType } from '../types'

export function validateSubmission(challenge: Challenge, submission: Submission): boolean {
  if (challenge.submissionType !== submission.content.link ? SubmissionType.LINK : SubmissionType.FILE) {
    return false
  }
  // TODO: Add more validation rules
  return true
}

