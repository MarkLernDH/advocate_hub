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

Create a new Supabase project
Run the setup SQL scripts from /scripts
Set up database policies for security

```sql
# Example policy setup included in /scripts/setup.sql
```

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

## Database Schema

Key tables:

profiles: User profiles and points
challenges: Available challenges
submissions: Challenge submissions
reviews: Submission reviews
points_history: Point transaction log

## Contributing

Fork the repository
Create a feature branch
Submit a pull request

## License

MIT License
