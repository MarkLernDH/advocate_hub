import { supabase } from './supabaseClient'
import { 
  DbUser, 
  DbChallenge, 
  DbUserChallenge, 
  DbAdvocate,
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
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching user:', fetchError)
      throw fetchError
    }

    if (existingUser) {
      return existingUser as unknown as Database['public']['Tables']['users']['Row']
    }

    // If user doesn't exist, create a new one
    const newUserData: Database['public']['Tables']['users']['Insert'] = {
        id: userId,
        points: 0,
        level: AdvocateLevel.BRONZE, // Default new users to bronze tier: AdvocateLevel.BRONZE,
        is_active: true,
        email: '',
        role: UserRole.ADVOCATE // Default new users to advocate role
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([newUserData])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      throw insertError
    }

    if (!newUser) {
      return null
    }

    return newUser as unknown as Database['public']['Tables']['users']['Row']
  } catch (error) {
    console.error('Error in getUser:', error)
    throw error
  }
}

// Challenge Operations
export async function getActiveChallenges(): Promise<DbChallenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  
  return (data || []) as unknown as Database['public']['Tables']['challenges']['Row'][]
}

export async function getChallengeById(challengeId: string): Promise<DbChallenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('ChallengeId', challengeId)
    .single()

  if (error) throw error
  if (!data) return null

  return data as unknown as Database['public']['Tables']['challenges']['Row']
}

async function getUserChallenges(userId: string): Promise<(DbUserChallenge & { challenge: DbChallenge })[]> {
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenge:challenges(*)')
      .eq('user_id', userId)
  
    if (error) throw error
    
    return (data || []).map((item: { challenge: unknown }) => ({
      ...(item as unknown as Database['public']['Tables']['user_challenges']['Row']),
      challenge: item.challenge as unknown as Database['public']['Tables']['challenges']['Row']
    }))
  }

// Advocate Operations
export async function getAdvocateProfile(userId: string): Promise<DbAdvocate | null> {
  const { data, error } = await supabase
    .from('advocates')
    .select('*')
    .eq('AdvocateId', userId)
    .single()

  if (error) throw error
  if (!data) return null

  return data as unknown as Database['public']['Tables']['advocates']['Row']
}