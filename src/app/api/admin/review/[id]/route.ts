import { createServerSupabaseClient } from '@/lib/supabase/server'
import { calculatePoints } from '@/lib/rewards'
import { NextResponse } from 'next/server'
import { type ReviewStatus, type SubmissionQuality } from '@/lib/supabase/schema'
import { type PostgrestSingleResponse } from '@supabase/supabase-js'

interface ReviewData {
  status: ReviewStatus
  quality: SubmissionQuality
  feedback: string
}

interface SubmissionWithChallenge {
  user_id: string
  challenge: {
    reward_points: number
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json() as ReviewData
    const submissionId = params.id
    const reviewerId = session.user.id

    // Start a transaction
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('user_id, challenge:challenges(reward_points)')
      .eq('id', submissionId)
      .single() as PostgrestSingleResponse<SubmissionWithChallenge>

    if (submissionError) {
      throw submissionError
    }

    // Calculate points based on quality
    const pointsAwarded = json.status === 'approved' 
      ? calculatePoints(submission.challenge.reward_points, json.quality)
      : 0

    // Update submission status and create review
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ 
        status: json.status,
        points_awarded: pointsAwarded,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId)

    if (updateError) {
      throw updateError
    }

    // Create review record
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        submission_id: submissionId,
        reviewer_id: reviewerId,
        status: json.status,
        quality: json.quality,
        feedback: json.feedback,
        points_awarded: pointsAwarded
      })

    if (reviewError) {
      throw reviewError
    }

    // If approved, update advocate's total points
    if (json.status === 'approved') {
      const { error: pointsError } = await supabase.rpc('update_advocate_points', {
        advocate_id: submission.user_id,
        points_to_add: pointsAwarded
      })

      if (pointsError) {
        throw pointsError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review API error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    )
  }
}
