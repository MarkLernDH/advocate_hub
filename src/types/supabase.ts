export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          points: number
          level: string
          is_active: boolean
          email: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          points?: number
          level?: string
          is_active?: boolean
          email: string
          role?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          points: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          points: number
          status?: string
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: string
          submission_type: string
          submission_content: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status?: string
          submission_type: string
          submission_content: string
        }
      }
      advocates: {
        Row: {
          id: string
          user_id: string
          bio: string
          social_links: Record<string, string>
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string
          social_links?: Record<string, string>
        }
      }
    }
  }
}
