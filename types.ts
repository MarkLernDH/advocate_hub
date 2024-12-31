export enum UserRole {
  ADMIN = 'ADMIN',
  ADVOCATE = 'ADVOCATE'
}

export enum AdvocateLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface DbUser {
  id: string
  email: string
  role: UserRole
  points: number
  level: AdvocateLevel
  created_at: string
  updated_at: string
  last_login: string | null
  profile_complete: boolean
}

export interface Advocate {
  id: string
  name: string
  email: string
  points: number
  level: AdvocateLevel
}

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  platform: 'linkedin' | 'g2' | 'slack' | 'x'
  icon: string
  status?: SubmissionStatus
  created_at?: string
  updated_at?: string
}
