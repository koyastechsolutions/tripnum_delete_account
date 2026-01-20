-- Supabase Setup SQL Script
-- Run this in your Supabase SQL Editor to set up the account deletion requests table

-- Create account_deletion_requests table
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deletion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_id ON account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_email ON account_deletion_requests(email);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON account_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_deletion_date ON account_deletion_requests(deletion_date);

-- Enable Row Level Security
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own deletion requests" ON account_deletion_requests;
DROP POLICY IF EXISTS "Users can create their own deletion requests" ON account_deletion_requests;
DROP POLICY IF EXISTS "Users can delete their own deletion requests" ON account_deletion_requests;
DROP POLICY IF EXISTS "Users can update their own deletion requests" ON account_deletion_requests;

-- Create policy for users to view their own deletion requests
CREATE POLICY "Users can view their own deletion requests" ON account_deletion_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to create their own deletion requests
CREATE POLICY "Users can create their own deletion requests" ON account_deletion_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own deletion requests
CREATE POLICY "Users can delete their own deletion requests" ON account_deletion_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Create policy for users to update their own deletion requests
CREATE POLICY "Users can update their own deletion requests" ON account_deletion_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_account_deletion_requests_updated_at ON account_deletion_requests;
CREATE TRIGGER update_account_deletion_requests_updated_at
    BEFORE UPDATE ON account_deletion_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for admin to see all deletion requests
-- CREATE OR REPLACE VIEW admin_deletion_requests AS
-- SELECT 
--   id,
--   user_id,
--   email,
--   requested_at,
--   deletion_date,
--   status,
--   created_at,
--   updated_at,
--   EXTRACT(EPOCH FROM (deletion_date - NOW())) / 86400 AS days_until_deletion
-- FROM account_deletion_requests
-- ORDER BY deletion_date ASC;
