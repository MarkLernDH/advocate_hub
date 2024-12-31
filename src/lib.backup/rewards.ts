import { type SubmissionQuality } from './supabase/schema'

const QUALITY_MULTIPLIERS: Record<SubmissionQuality, number> = {
  outstanding: 1.5,
  good: 1.0,
  acceptable: 0.75,
  poor: 0.5
}

export function calculatePoints(basePoints: number, quality: SubmissionQuality): number {
  const multiplier = QUALITY_MULTIPLIERS[quality]
  return Math.round(basePoints * multiplier)
}
