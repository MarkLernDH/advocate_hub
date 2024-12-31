import { supabase } from './supabaseClient'
import { DbUser, AdvocateLevel, Database } from '../types/index'

export function calculateNextTier(points: number): AdvocateLevel {
  if (points >= 10000) return AdvocateLevel.PLATINUM
  if (points >= 5000) return AdvocateLevel.GOLD
  if (points >= 1000) return AdvocateLevel.SILVER
  return AdvocateLevel.BRONZE
}

export async function updateUserPoints(userId: string, pointsToAdd: number) {
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('points')
    .eq('id', userId)
    .single()
  
  if (fetchError) throw fetchError
  if (!user) throw new Error('User not found')

  const currentPoints = user.points as number || 0
  const newPoints = currentPoints + pointsToAdd
  const newTier = calculateNextTier(newPoints)

  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      points: newPoints,
      tier: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (updateError) throw updateError
}