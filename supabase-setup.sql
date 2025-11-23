-- Supabase Database Setup Script
-- Run this SQL in your Supabase SQL Editor

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gold', 'stocks', 'crypto', 'cash')),
  name TEXT NOT NULL,
  symbol TEXT,
  quantity NUMERIC NOT NULL,
  purchase_price NUMERIC NOT NULL,
  purchase_date DATE NOT NULL,
  current_price NUMERIC,
  current_value NUMERIC,
  profit_loss NUMERIC,
  profit_loss_percent NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(type);

-- Enable Row Level Security (RLS)
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own investments
CREATE POLICY "Users can read their own investments"
  ON investments
  FOR SELECT
  USING (true); -- For now, allow all reads (you can restrict by user_id later)

-- Create policy to allow users to insert their own investments
CREATE POLICY "Users can insert their own investments"
  ON investments
  FOR INSERT
  WITH CHECK (true); -- For now, allow all inserts

-- Create policy to allow users to update their own investments
CREATE POLICY "Users can update their own investments"
  ON investments
  FOR UPDATE
  USING (true); -- For now, allow all updates

-- Create policy to allow users to delete their own investments
CREATE POLICY "Users can delete their own investments"
  ON investments
  FOR DELETE
  USING (true); -- For now, allow all deletes

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

