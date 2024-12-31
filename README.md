# Advocacy Hub

A gamified platform that converts customers into brand advocates through structured challenges and rewards.

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Supabase Auth with magic links
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript
- **File Storage**: Supabase Storage

## Core Features

- 🔐 Role-based authentication (Advocates & Admins)
- 📝 Challenge creation and management
- ✅ Submission and review system
- 🏆 Points-based reward system
- 📊 Analytics dashboard

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Environment Setup

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

## Project Structure

```
/src
  /app                     # Next.js 14 App Router
    /api                   # Route handlers
    /(auth)                # Auth route group
    /(protected)           # Protected route group
    /layout.tsx
    /page.tsx              # Landing page
  
  /components             # Shared components
    /ui                   # UI components
    /admin               # Admin components
    /advocate            # Advocate components
    /auth               # Auth components
  
  /lib                   # Shared utilities
    /supabase           # Supabase client/server
    /utils.ts
    /validation.ts
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Database Setup

1. Create a new Supabase project
2. Install the Supabase CLI:
   ```bash
   brew install supabase/tap/supabase
   ```
3. Run migrations in order:
   ```bash
   cd supabase/migrations
   # Run these in order:
   supabase db push 20231231_core_tables.sql
   supabase db push 20231231_review_system.sql
   supabase db push 20231231_cleanup_and_consolidate.sql
   ```
4. Generate TypeScript types:
   ```bash
   supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
   ```

## Database Schema

Key tables:

- **profiles**: User profiles and settings
  - `id`: UUID (references auth.users)
  - `email`: TEXT
  - `full_name`: TEXT
  - `role`: TEXT ('ADMIN' or 'ADVOCATE')
  - `total_points`: INTEGER
  - `is_active`: BOOLEAN
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ

- **challenges**: Available challenges
  - `id`: UUID
  - `title`: TEXT
  - `description`: TEXT
  - `points`: INTEGER
  - `requirements`: TEXT[]
  - `is_active`: BOOLEAN
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ
  - `created_by`: UUID (references profiles)

- **submissions**: Challenge submissions
  - `id`: UUID
  - `challenge_id`: UUID (references challenges)
  - `advocate_id`: UUID (references profiles)
  - `content`: TEXT
  - `attachments`: TEXT[]
  - `status`: TEXT ('pending', 'approved', 'rejected')
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ

- **points_history**: Points transaction history
  - `id`: UUID
  - `advocate_id`: UUID (references profiles)
  - `points`: INTEGER
  - `reason`: TEXT
  - `created_at`: TIMESTAMPTZ

- **reviews**: Submission reviews
  - `id`: UUID
  - `submission_id`: UUID (references submissions)
  - `reviewer_id`: UUID (references profiles)
  - `status`: review_status
  - `quality`: submission_quality
  - `feedback`: TEXT
  - `points_awarded`: INTEGER
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ

## Authentication Flow

Users sign in with magic link
Role assignment (Admin/Advocate)
Role-based routing to appropriate dashboard

## Development Guidelines

Use TypeScript for all new files
Follow the existing component structure
Add proper types for all props and state
Use server components where possible
Implement proper error handling

## Contributing

Fork the repository
Create a feature branch
Submit a pull request

## License

MIT License
