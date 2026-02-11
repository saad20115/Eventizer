-- Create enum for survey target audience
CREATE TYPE survey_target_audience AS ENUM ('customer', 'vendor', 'all');

-- Create enum for question types
CREATE TYPE survey_question_type AS ENUM ('text', 'rating', 'choice', 'boolean');

-- 1. Surveys Table
CREATE TABLE surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_audience survey_target_audience NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Survey Questions Table
CREATE TABLE survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type survey_question_type NOT NULL,
  options JSONB, -- For 'choice' type: ["Option A", "Option B"]
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Survey Responses Table (One submission per user/session)
CREATE TABLE survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_id UUID, -- Optional: Link to auth.users if logged in
  respondent_email TEXT, -- Optional: Capture email if anonymous
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Survey Answers Table (Individual answers)
CREATE TABLE survey_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_text TEXT, -- Stores text, selected option, or rating value as string
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public/Users can view ACTIVE surveys and questions
CREATE POLICY "Public view active surveys" ON surveys
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public view questions for active surveys" ON survey_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM surveys 
      WHERE surveys.id = survey_questions.survey_id 
      AND surveys.is_active = true
    )
  );

-- Public/Users can INSERT responses and answers
CREATE POLICY "Public insert responses" ON survey_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert answers" ON survey_answers
  FOR INSERT WITH CHECK (true);

-- Admin can view ALL (requires admin role logic, simplified for now to authenticated or public for dev)
-- For now, allow public read for dev/testing dashboards if no strict admin role is enforced yet
CREATE POLICY "Admin view all surveys" ON surveys
  FOR ALL USING (true); -- Replace with admin check in production

CREATE POLICY "Admin view all responses" ON survey_responses
  FOR SELECT USING (true);

CREATE POLICY "Admin view all answers" ON survey_answers
  FOR SELECT USING (true);
