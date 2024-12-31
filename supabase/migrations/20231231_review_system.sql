-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
    CREATE TYPE submission_quality AS ENUM ('outstanding', 'good', 'acceptable', 'poor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create points_history table
CREATE TABLE IF NOT EXISTS points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advocate_id UUID NOT NULL REFERENCES profiles(id),
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT points_history_points_check CHECK (points != 0)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id),
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    status review_status NOT NULL,
    quality submission_quality NOT NULL,
    feedback TEXT NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT reviews_points_check CHECK (points_awarded >= 0)
);

-- Add necessary columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS total_points INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT profiles_total_points_check CHECK (total_points >= 0);

-- Create function to update advocate points
CREATE OR REPLACE FUNCTION update_advocate_points(
    p_advocate_id UUID,
    p_points INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update points in a transaction
    UPDATE profiles
    SET 
        total_points = total_points + p_points,
        updated_at = NOW()
    WHERE id = p_advocate_id;
    
    -- Insert points history record
    INSERT INTO points_history (
        advocate_id,
        points,
        reason,
        created_at
    ) VALUES (
        p_advocate_id,
        p_points,
        'submission_reward',
        NOW()
    );
END;
$$;

-- Create function to process review
CREATE OR REPLACE FUNCTION process_review(
    p_submission_id UUID,
    p_reviewer_id UUID,
    p_status review_status,
    p_quality submission_quality,
    p_feedback TEXT
)
RETURNS reviews
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_review reviews;
BEGIN
    -- Update submission status
    UPDATE submissions
    SET 
        status = p_status,
        updated_at = NOW()
    WHERE id = p_submission_id;
    
    -- Create review record
    INSERT INTO reviews (
        submission_id,
        reviewer_id,
        status,
        quality,
        feedback,
        created_at
    ) VALUES (
        p_submission_id,
        p_reviewer_id,
        p_status,
        p_quality,
        p_feedback,
        NOW()
    )
    RETURNING * INTO v_review;
    
    RETURN v_review;
END;
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_advocate_id ON submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_submission_id ON reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_points_history_advocate_id ON points_history(advocate_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON points_history(created_at DESC);
