-- Create the waitlist table
CREATE TABLE waitlist (
  id TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  type TEXT CHECK (type IN ('customer', 'vendor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (signup)
CREATE POLICY "Allow public insert to waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Create policy to allow only authenticated users to view (admin)
-- (Note: You'll need to configure your admin users/roles later)
-- SECURITY UPDATE: Commented out to prevent default authenticated access.
-- Only enable this if you have a proper admin role check (e.g., using custom claims).
-- CREATE POLICY "Allow authenticated view of waitlist" ON waitlist
--   FOR SELECT USING (auth.role() = 'authenticated');
