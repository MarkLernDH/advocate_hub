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

