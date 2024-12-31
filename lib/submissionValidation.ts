import { supabase } from './supabaseClient'
import { DbUserChallenge, SubmissionType, SubmissionStatus } from '../types/'

export async function validateSubmission(
  userId: string,
  challengeId: string,
  content: { type: SubmissionType; value: string }
) {
  // Check if user has already completed this challenge
  const { data: existingSubmission } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .eq('completed', true)
    .single()

  if (existingSubmission) {
    throw new Error('Challenge already completed')
  }

  // Create new submission
  const { error } = await supabase
    .from('user_challenges')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      progress: 100,
      completed: true,
      completed_at: new Date().toISOString()
    })

  if (error) throw error
}