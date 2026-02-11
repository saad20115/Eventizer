-- ========================================================
-- SURVEY MODULE: FINAL CONSOLIDATED SETUP & RECOVERY
-- ========================================================
-- This script performs a full clean-up and restoration:
-- 1. Creates all necessary tables and enums.
-- 2. Deletes any existing 'Vendor Survey' to prevent duplicates.
-- 3. Re-inserts the official Vendor Survey and its 40+ questions.
-- 4. Re-inserts 5 Arabic dummy responses for testing dashboards.
-- 5. Re-applies all Row Level Security (RLS) policies.
-- ========================================================
-- 1. SETUP SCHEMA & ENUMS
DO $$ BEGIN CREATE TYPE survey_target_audience AS ENUM ('customer', 'vendor', 'all');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN CREATE TYPE survey_question_type AS ENUM ('text', 'rating', 'choice', 'boolean');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_audience survey_target_audience NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type survey_question_type NOT NULL,
    options JSONB,
    order_index INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    respondent_id UUID,
    respondent_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.survey_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    response_id UUID REFERENCES public.survey_responses(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 2. CLEAN UP OLD DATA
DELETE FROM public.surveys
WHERE title = 'استبيان مقدمي الخدمات - Vendor Survey';
-- 3. INSERT VENDOR SURVEY
DO $$
DECLARE v_survey_id UUID;
BEGIN
INSERT INTO public.surveys (title, description, target_audience, is_active)
VALUES (
        'استبيان مقدمي الخدمات - Vendor Survey',
        'تُستخدم المعلومات لأغراض التقييم الأولي وبناء قاعدة الشركاء المؤسسين.',
        'vendor',
        true
    )
RETURNING id INTO v_survey_id;
-- Basic Info Questions
INSERT INTO public.survey_questions (
        survey_id,
        question_text,
        question_type,
        options,
        order_index,
        is_required
    )
VALUES (
        v_survey_id,
        'اسم النشاط / الجهة',
        'text',
        null,
        1,
        true
    ),
    (v_survey_id, 'رقم الجوال', 'text', null, 2, true),
    (v_survey_id, 'المدينة', 'text', null, 3, true),
    (
        v_survey_id,
        'نوع الخدمة المقدمة',
        'choice',
        '["مصور (جوال / كاميرا)", "كوش", "DJ / فرق فنية", "ضيافة (كيك / معجنات / حلويات)", "مساعدة العروس (ميكب آرتست / مديرة فعاليات)"]'::jsonb,
        4,
        true
    ),
    (
        v_survey_id,
        'عدد سنوات الخبرة',
        'choice',
        '["أقل من سنة", "1–3 سنوات", "أكثر من 3 سنوات"]'::jsonb,
        5,
        true
    ),
    (
        v_survey_id,
        'رابط حساب إنستجرام',
        'text',
        null,
        6,
        true
    ),
    (
        v_survey_id,
        'رابط حساب تيك توك',
        'text',
        null,
        7,
        false
    ),
    (
        v_survey_id,
        'رابط حساب سناب شات',
        'text',
        null,
        8,
        false
    ),
    (
        v_survey_id,
        'رابط موقع إلكتروني أو بورتفوليو (إن وجد)',
        'text',
        null,
        9,
        false
    ),
    (
        v_survey_id,
        'يرجى إرفاق رابط يحتوي على نماذج من أعمالك (Google Drive, Dropbox, etc)',
        'text',
        null,
        10,
        true
    ),
    -- Status & Challenges
    (
        v_survey_id,
        'كيف تحصل على عملائك حاليًا؟',
        'choice',
        '["إنستجرام", "تيك توك", "سناب شات", "واتساب", "توصيات"]'::jsonb,
        12,
        true
    ),
    (
        v_survey_id,
        'هل الطلب على خدمتك مستقر حاليًا؟',
        'choice',
        '["نعم", "أحيانًا", "لا"]'::jsonb,
        13,
        true
    ),
    (
        v_survey_id,
        'ما أكثر تحدٍ تواجهه في عملك؟',
        'choice',
        '["قلة الطلب", "التفاوض على الأسعار", "كثرة الاستفسارات غير الجادة", "تنظيم المواعيد", "أخرى"]'::jsonb,
        14,
        true
    ),
    -- Collaboration
    (
        v_survey_id,
        'ما رأيك في فكرة منصة تجلب لك عملاء جاهزين للحجز؟',
        'choice',
        '["ممتازة", "مقبولة", "غير مهتم"]'::jsonb,
        35,
        true
    ),
    (
        v_survey_id,
        'هل تقبل العمل بنظام عمولة مقابل جلب العميل؟',
        'choice',
        '["نعم", "حسب النسبة", "لا"]'::jsonb,
        36,
        true
    ),
    (
        v_survey_id,
        'النسبة التي تراها مناسبة',
        'choice',
        '["10%", "12%", "15%"]'::jsonb,
        37,
        true
    ),
    (
        v_survey_id,
        'هل تفضّل عمولة متدرجة حسب عدد الطلبات؟',
        'boolean',
        null,
        38,
        true
    ),
    -- Operations
    (
        v_survey_id,
        'طريقة التواصل المفضلة مع العميل',
        'choice',
        '["واتساب", "اتصال مباشر", "عبر منصة رقمية"]'::jsonb,
        39,
        true
    ),
    (
        v_survey_id,
        'هل تفضّل وجود عقد وساطة ينظم العلاقة مع المنصة؟',
        'choice',
        '["نعم", "لا", "لا يهم"]'::jsonb,
        40,
        true
    ),
    (
        v_survey_id,
        'ما الذي قد يجعلك تتردد أو ترفض العمل مع منصة مثل Eventizer؟',
        'text',
        null,
        41,
        true
    );
-- 4. INSERT 5 ARABIC DUMMY RESPONSES
DECLARE v_q_name UUID;
v_q_mobile UUID;
v_q_city UUID;
v_q_service UUID;
v_q_exp UUID;
v_q_insta UUID;
v_q_source UUID;
v_q_stable UUID;
v_q_challenge UUID;
v_q_platform_opinion UUID;
v_q_commission_accept UUID;
v_q_commission_rate UUID;
v_q_tiered_comm UUID;
v_q_contact_pref UUID;
v_q_contract_pref UUID;
v_response_id UUID;
BEGIN
SELECT id INTO v_q_name
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'اسم النشاط%';
SELECT id INTO v_q_mobile
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'رقم الجوال%';
SELECT id INTO v_q_city
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'المدينة%';
SELECT id INTO v_q_service
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'نوع الخدمة%';
SELECT id INTO v_q_exp
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'عدد سنوات%';
SELECT id INTO v_q_insta
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'رابط حساب%';
SELECT id INTO v_q_source
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'كيف تحصل%';
SELECT id INTO v_q_stable
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل الطلب%';
SELECT id INTO v_q_challenge
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'ما أكثر تحدٍ%';
SELECT id INTO v_q_platform_opinion
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'ما رأيك%';
SELECT id INTO v_q_commission_accept
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تقبل العمل%';
SELECT id INTO v_q_commission_rate
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'النسبة التي%';
SELECT id INTO v_q_tiered_comm
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تفضّل عمولة%';
SELECT id INTO v_q_contact_pref
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'طريقة التواصل%';
SELECT id INTO v_q_contract_pref
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تفضّل وجود عقد%';
-- Resp 1: Photographer
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (
        v_response_id,
        v_q_name,
        'ستوديو سديم الفوتوغرافي'
    ),
    (v_response_id, v_q_mobile, '0505551122'),
    (v_response_id, v_q_city, 'الرياض'),
    (
        v_response_id,
        v_q_service,
        'مصور (جوال / كاميرا)'
    ),
    (v_response_id, v_q_exp, 'أكثر من 3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/sadeem_photo'
    ),
    (v_response_id, v_q_source, 'إنستجرام'),
    (v_response_id, v_q_stable, 'نعم'),
    (
        v_response_id,
        v_q_challenge,
        'التفاوض على الأسعار'
    ),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '10%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (
        v_response_id,
        v_q_contact_pref,
        'عبر منصة رقمية'
    ),
    (v_response_id, v_q_contract_pref, 'نعم');
-- Resp 2: Catering
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'حلويات نجدية فاخرة'),
    (v_response_id, v_q_mobile, '0554443322'),
    (v_response_id, v_q_city, 'القصيم'),
    (
        v_response_id,
        v_q_service,
        'ضيافة (كيك / معجنات / حلويات)'
    ),
    (v_response_id, v_q_exp, 'أكثر من 3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/najdi_sweets'
    ),
    (v_response_id, v_q_source, 'واتساب'),
    (v_response_id, v_q_stable, 'نعم'),
    (v_response_id, v_q_challenge, 'تنظيم المواعيد'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (
        v_response_id,
        v_q_commission_accept,
        'حسب النسبة'
    ),
    (v_response_id, v_q_commission_rate, '12%'),
    (v_response_id, v_q_tiered_comm, 'false'),
    (v_response_id, v_q_contact_pref, 'واتساب'),
    (v_response_id, v_q_contract_pref, 'لا يهم');
-- Resp 3: Kosha
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'ركن الياسمين للكوش'),
    (v_response_id, v_q_mobile, '0543332211'),
    (v_response_id, v_q_city, 'جدة'),
    (v_response_id, v_q_service, 'كوش'),
    (v_response_id, v_q_exp, '1–3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/yasmin_corner'
    ),
    (v_response_id, v_q_source, 'تيك توك'),
    (v_response_id, v_q_stable, 'أحيانًا'),
    (
        v_response_id,
        v_q_challenge,
        'كثرة الاستفسارات غير الجادة'
    ),
    (v_response_id, v_q_platform_opinion, 'مقبولة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '15%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (v_response_id, v_q_contact_pref, 'اتصال مباشر'),
    (v_response_id, v_q_contract_pref, 'نعم');
-- Resp 4: DJ
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (
        v_response_id,
        v_q_name,
        'نغمات المساء للفرق الفنية'
    ),
    (v_response_id, v_q_mobile, '0567778899'),
    (v_response_id, v_q_city, 'الخبر'),
    (v_response_id, v_q_service, 'DJ / فرق فنية'),
    (v_response_id, v_q_exp, '1–3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/sunset_tunes'
    ),
    (v_response_id, v_q_source, 'توصيات'),
    (v_response_id, v_q_stable, 'لا'),
    (v_response_id, v_q_challenge, 'قلة الطلب'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '10%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (
        v_response_id,
        v_q_contact_pref,
        'عبر منصة رقمية'
    ),
    (v_response_id, v_q_contract_pref, 'نعم');
-- Resp 5: Makeup Artist
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (
        v_response_id,
        v_q_name,
        'إشراقة الجمال - Makeup Artist'
    ),
    (v_response_id, v_q_mobile, '0532221100'),
    (v_response_id, v_q_city, 'المدينة المنورة'),
    (
        v_response_id,
        v_q_service,
        'مساعدة العروس (ميكب آرتست / مديرة فعاليات)'
    ),
    (v_response_id, v_q_exp, 'أقل من سنة'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/beauty_glow_sa'
    ),
    (v_response_id, v_q_source, 'سناب شات'),
    (v_response_id, v_q_stable, 'أحيانًا'),
    (v_response_id, v_q_challenge, 'تنظيم المواع'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '12%'),
    (v_response_id, v_q_tiered_comm, 'false'),
    (v_response_id, v_q_contact_pref, 'واتساب'),
    (v_response_id, v_q_contract_pref, 'لا يهم');
END;
END $$;
-- 5. RE-APPLY RLS POLICIES
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view active surveys" ON public.surveys;
DROP POLICY IF EXISTS "Public view questions for active surveys" ON public.survey_questions;
DROP POLICY IF EXISTS "Public insert responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Public insert answers" ON public.survey_answers;
DROP POLICY IF EXISTS "Authenticated users can view all surveys" ON public.surveys;
DROP POLICY IF EXISTS "Authenticated users can view all responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Authenticated users can view all answers" ON public.survey_answers;
CREATE POLICY "Public view active surveys" ON public.surveys FOR
SELECT USING (is_active = true);
CREATE POLICY "Public view questions for active surveys" ON public.survey_questions FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.surveys
            WHERE surveys.id = survey_questions.survey_id
                AND surveys.is_active = true
        )
    );
CREATE POLICY "Public insert responses" ON public.survey_responses FOR
INSERT WITH CHECK (true);
CREATE POLICY "Public insert answers" ON public.survey_answers FOR
INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view all surveys" ON public.surveys FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view all responses" ON public.survey_responses FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view all answers" ON public.survey_answers FOR
SELECT USING (auth.role() = 'authenticated');
-- ========================================================
-- SETUP COMPLETE: Vendor Survey restored with 5 Arabic responses.
-- ========================================================