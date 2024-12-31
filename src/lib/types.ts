// Keep existing enums
export enum ChallengeType {
    CONTENT = 'CONTENT',
    REVIEW = 'REVIEW',
    SOCIAL = 'SOCIAL',
    REFERRAL = 'REFERRAL'
  }
  
  export enum AdvocateLevel {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM'
  }
  
  export enum ChallengeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED'
  }
  
  export enum SubmissionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }
  
  export enum SubmissionType {
    LINK = 'LINK',
    FILE = 'FILE',
    TEXT = 'TEXT'
  }
  
  export enum ChallengeType {
    QUESTIONS = 'QUESTIONS',
    ONLINE_ACTION = 'ONLINE_ACTION',
    CORPORATE_APPROVAL = 'CORPORATE_APPROVAL',
    ADVOCATE_WORKFLOW = 'ADVOCATE_WORKFLOW',
    UPLOAD_IMAGE = 'UPLOAD_IMAGE',
    UPLOAD_VIDEO = 'UPLOAD_VIDEO',
    UPLOAD_FILE = 'UPLOAD_FILE',
    DISCUSSION_REPLY = 'DISCUSSION_REPLY',
    QUIZ = 'QUIZ',
    JOIN_GROUP = 'JOIN_GROUP',
    API_INTEGRATION = 'API_INTEGRATION',
    SOCIAL_SHARE = 'SOCIAL_SHARE',
    REFERRAL_SOCIAL = 'REFERRAL_SOCIAL',
    TWITTER_POST = 'TWITTER_POST',
    FOLLOW_TWITTER = 'FOLLOW_TWITTER',
    NPS = 'NPS',
    ONLINE_REVIEW = 'ONLINE_REVIEW',
    G2_REVIEW = 'G2_REVIEW',
    CHECK_IN = 'CHECK_IN'
  }
  
  export enum ProofType {
    SCREENSHOT = 'SCREENSHOT',
    LINK = 'LINK',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    FILE = 'FILE',
    SOCIAL_LINK = 'SOCIAL_LINK',
    API_VERIFICATION = 'API_VERIFICATION',
    ADMIN_APPROVAL = 'ADMIN_APPROVAL'
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    ADVOCATE = 'ADVOCATE'
  }
  
  // Database Schema Types
  export interface Database {
    public: {
      Tables: {
        users: {
          Row: DbUser
          Insert: Omit<DbUser, 'created_at' | 'updated_at'>
          Update: Partial<DbUser>
        }
        challenges: {
          Row: DbChallenge
          Insert: Omit<DbChallenge, 'Completions'>
          Update: Partial<DbChallenge>
        }
        user_challenges: {
          Row: DbUserChallenge
          Insert: Omit<DbUserChallenge, 'created_at'>
          Update: Partial<DbUserChallenge>
        }
        advocates: {
          Row: DbAdvocate
          Insert: Omit<DbAdvocate, 'ChallengesCompleted' | 'Points' | 'Rewards'>
          Update: Partial<DbAdvocate>
        }
      }
    }
  }
  
  // Database Row Types
  export interface DbUser {
    id: string
    email: string
    role: UserRole
    points: number
    level: AdvocateLevel
    created_at: string
    updated_at: string
    is_active: boolean
  }
  
  export interface DbAdvocate {
    AdvocateId: string
    Name: string
    Email: string
    JobTitle?: string
    Company?: string
    ChallengesAssigned: number
    ChallengesCompleted: number
    JoinedDate: string
    FirstAdvocacyDate?: string
    LatestAdvocacyDate?: string
    Points: number
    Rewards: number
    is_active: boolean
  }
  
  export interface DbChallenge {
    ChallengeId: string
    Name: string
    Description?: string
    Type: ChallengeType
    Points: number
    ProofRequirements: ProofType[]
    ImageUrl?: string
    Instructions: string[]
    AssignedAdvocates: number
    Completions: number
    is_active: boolean
    created_at: string
    deadline?: string
  }
  
  export interface DbUserChallenge {
    id: string
    user_id: string
    challenge_id: string
    progress: number
    completed: boolean
    completed_at?: string
    created_at: string
  }
  
  // Frontend types (with additional UI-specific fields)
  export interface Advocate {
    id: string
    name: string
    email: string
    level: AdvocateLevel
    points: number
    challenges: Challenge[]
    submissions: Submission[]
  }
  
  export interface Challenge {
    id: string
    title: string
    description: string
    type: ChallengeType
    points: number
    proofRequirements: ProofType[]
    imageUrl?: string
    instructions: string[]
    deadline?: Date
    status: ChallengeStatus
  }
  
  export interface Submission {
    id: string
    challengeId: string
    advocateId: string
    content: {
      link?: string
      file?: string
      text?: string
    }
    status: SubmissionStatus
    submittedAt: Date
    reviewedAt?: Date
    feedback?: string
  }