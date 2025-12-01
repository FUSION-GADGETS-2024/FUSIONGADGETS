-- Add custom user_code column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- Create function to generate custom user ID (e.g., FG8K2N4P)
CREATE OR REPLACE FUNCTION generate_user_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude similar chars (I,O,0,1)
  result TEXT := 'FG';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update create_profile_for_user to include user_code
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_code TEXT;
  v_attempts INTEGER := 0;
BEGIN
  -- Generate unique user code
  LOOP
    v_user_code := generate_user_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE user_code = v_user_code);
    v_attempts := v_attempts + 1;
    EXIT WHEN v_attempts > 10;
  END LOOP;

  INSERT INTO profiles (id, email, name, user_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    v_user_code
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing users without user_code
UPDATE profiles 
SET user_code = generate_user_code() 
WHERE user_code IS NULL;

-- Create index for user_code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_code ON profiles(user_code);
