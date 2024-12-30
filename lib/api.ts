import { supabase } from './supabaseClient'
import { 
  DbUser, 
  DbChallenge, 
  DbUserChallenge, 
  DbAdvocate,
  SubmissionStatus,
  ChallengeStatus,
  AdvocateLevel 
} from '../types'

// User Operations
export async function getUser(userId: string) {
  try {
    // First try to get the existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching user:', fetchError)
      throw fetchError
    }

    if (existingUser) {
      return existingUser as DbUser
    }

    // If user doesn't exist, create a new one
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          points: 0,
          tier: AdvocateLevel.BRONZE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      throw insertError
    }

    return newUser as DbUser
  } catch (error) {
    console.error('Error in getUser:', error)
    throw error
  }
}

// Challenge Operations
export async function getActiveChallenges() {
  const { data, error } = await supabase
    .from('Challenges')
    .select('*')
    .eq('is_active', true)
    .order('Points', { ascending: false })

  if (error) throw error
  return data as DbChallenge[]
}

export async function getChallengeById(challengeId: string) {
  const { data, error } = await supabase
    .from('Challenges')
    .select('*')
    .eq('ChallengeId', challengeId)
    .single()

  if (error) throw error
  return data as DbChallenge
}

export async function getUserChallenges(userId: string) {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:Challenges(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (DbUserChallenge & { challenge: DbChallenge })[]
}

// Advocate Operations
export async function getAdvocateProfile(userId: string) {
  const { data, error } = await supabase
    .from('Advocates')
    .select('*')
    .eq('AdvocateId', userId)
    .single()

  if (error) throw error
  return data as DbAdvocate
}

export async function updateAdvocateProfile(advocateId: string, updates: Partial<DbAdvocate>) {
  const { error } = await supabase
    .from('Advocates')
    .update(updates)
    .eq('AdvocateId', advocateId)

  if (error) throw error
}

// Campaign Operations
export async function getActiveCampaigns() {
  const { data, error } = await supabase
    .from('Campaigns')
    .select(`
      *,
      challenges:Challenges(*)
    `)
    .eq('is_active', true)

  if (error) throw error
  return data
}

// Analytics Operations
export async function getAdvocateStats(advocateId: string) {
  const { data, error } = await supabase
    .rpc('get_advocate_stats', { advocate_id: advocateId })

  if (error) throw error
  return data
}

// Leaderboard Operations
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, points, tier')
    .order('points', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Pick<DbUser, 'id' | 'email' | 'points' | 'tier'>[]
}