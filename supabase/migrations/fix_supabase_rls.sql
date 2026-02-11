-- 1. Enable RLS on core tables
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;
-- 2. Clean up overly permissive policies (to fix "Always True" warnings)
DROP POLICY IF EXISTS "Admin view all surveys" ON public.surveys;
DROP POLICY IF EXISTS "Admin view all responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Admin view all answers" ON public.survey_answers;
-- 3. Create tighter policies
-- For now, allow authenticated users to view all results (Admin substitute)
-- In production, you should check for a 'role' field in profiles.
CREATE POLICY "Authenticated users can view all surveys" ON public.surveys FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view all responses" ON public.survey_responses FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view all answers" ON public.survey_answers FOR
SELECT USING (auth.role() = 'authenticated');
-- Ensure public can still take surveys
-- (Survey taking policies already exist in supabase_surveys.sql, but let's ensure they are there)
-- CREATE POLICY "Public view active surveys" ON surveys FOR SELECT USING (is_active = true); -- already exists
-- 4. Ensure basic policies for waitlist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'waitlist'
        AND policyname = 'Allow public insert to waitlist'
) THEN CREATE POLICY "Allow public insert to waitlist" ON public.waitlist FOR
INSERT WITH CHECK (true);
END IF;
END $$;
-- 5. Leaked Password Protection (Note: This is a Dashboard setting, not SQL)
-- Go to: Authentication -> Settings -> Security and enable "Password leak protection"