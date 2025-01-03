import { Database as DatabaseGenerated } from './supabase'

export type Database = DatabaseGenerated

// Temporarily use users table until we can regenerate types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbChallenge = Database['public']['Tables']['challenges']['Row']
export type DbUserChallenge = Database['public']['Tables']['user_challenges']['Row']

export enum SubmissionType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link'
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ChallengeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed'
}

export enum AdvocateLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ADVOCATE = 'ADVOCATE'
}
