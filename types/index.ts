// Keep existing enums
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

// Database types (matching schema)
export interface DbUser {
  id: string;
  email: string;
  points: number;
  tier: AdvocateLevel;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface DbAdvocate {
  AdvocateId: string;
  Name: string;
  Email: string;
  JobTitle?: string;
  Company?: string;
  ChallengesAssigned: number;
  ChallengesCompleted: number;
  JoinedDate: string;
  FirstAdvocacyDate?: string;
  LatestAdvocacyDate?: string;
  Points: number;
  Rewards: number;
  is_active: boolean;
}

export interface DbChallenge {
  ChallengeId: string;
  Name: string;
  Description?: string;
  Channel?: string;
  Type?: string;
  Points: number;
  AssignedAdvocates: number;
  Completions: number;
  is_active: boolean;
}

export interface DbUserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

// Frontend types (with additional UI-specific fields)
export interface Advocate {
  id: string;
  name: string;
  email: string;
  level: AdvocateLevel;
  points: number;
  challenges: Challenge[];
  submissions: Submission[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  submissionType: SubmissionType;
  instructions: string[];
  deadline: Date;
  status: ChallengeStatus;
}

export interface Submission {
  id: string;
  challengeId: string;
  advocateId: string;
  content: {
    link?: string;
    file?: string;
    text?: string;
  };
  status: SubmissionStatus;
  reviewedAt?: Date;
  feedback?: string;
}