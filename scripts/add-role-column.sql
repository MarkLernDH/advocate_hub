-- Add role enum type first
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'ADVOCATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to users table with correct type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'ADVOCATE'::user_role;
