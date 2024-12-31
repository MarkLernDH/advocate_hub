-- Migrate data from users table to profiles if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Insert missing users into profiles
        INSERT INTO profiles (id, email, full_name, total_points, created_at, updated_at)
        SELECT 
            u.id,
            u.email,
            NULL as full_name, -- We'll need to update this manually
            u.points as total_points,
            u.created_at,
            u.updated_at
        FROM users u
        LEFT JOIN profiles p ON u.id = p.id
        WHERE p.id IS NULL;

        -- Drop the users table
        DROP TABLE IF EXISTS users CASCADE;
    END IF;
END $$;

-- Drop deprecated advocates table if it exists
DROP TABLE IF EXISTS advocates CASCADE;

-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'ADVOCATE'
CHECK (role IN ('ADVOCATE', 'ADMIN'));

-- Add is_active column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Update RLS policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
