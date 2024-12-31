import supabase from './supabase/client'
import { 
  DbUser, 
  DbChallenge, 
  DbUserChallenge,
  SubmissionStatus,
  ChallengeStatus,
  AdvocateLevel,
  UserRole,
  Database
} from '../types/index'

// User Operations
export async function getUser(userId: string): Promise<DbUser | null> {
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching user:', fetchError)
      return null
    }

    return existingUser
  } catch (error) {
    console.error('Error in getUser:', error)
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<DbUser>): Promise<DbUser | null> {
  try {
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return null
    }

    return updatedUser
  } catch (error) {
    console.error('Error in updateUser:', error)
    return null
  }
}

// Challenge Operations
export async function getActiveChallenges(): Promise<DbChallenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challenges:', error)
    return []
  }

  return data || []
}

export async function getChallengeById(challengeId: string): Promise<DbChallenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single()

  if (error) {
    console.error('Error fetching challenge:', error)
    return null
  }

  return data
}

export async function getUserChallenges(userId: string): Promise<(DbUserChallenge & { challenge: DbChallenge })[]> {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user challenges:', error)
    return []
  }

  return data || []
}

// Profile Operations
export async function getAdvocateProfile(userId: string): Promise<DbUser | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('role', 'ADVOCATE')
      .single()

    if (error) {
      console.error('Error fetching advocate profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Error in getAdvocateProfile:', error)
    return null
  }
}