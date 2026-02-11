-- Add Dummy Vendor Responses
-- 1. Get the Vendor Survey ID
DO $$
DECLARE v_survey_id UUID;
v_q_name UUID;
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
BEGIN -- Find the active vendor survey
SELECT id INTO v_survey_id
FROM surveys
WHERE target_audience = 'vendor'
    AND is_active = true
LIMIT 1;
IF v_survey_id IS NULL THEN RAISE NOTICE 'No active vendor survey found.';
RETURN;
END IF;
-- Get Question IDs (assuming text matches standard seed, using wildcards for safety)
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
    AND question_text LIKE 'رابط حساب إنستجرام%';
SELECT id INTO v_q_source
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'كيف تحصل على عملائك%';
SELECT id INTO v_q_stable
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل الطلب على خدمتك%';
SELECT id INTO v_q_challenge
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'ما أكثر تحدٍ%';
SELECT id INTO v_q_platform_opinion
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'ما رأيك في فكرة منصة%';
SELECT id INTO v_q_commission_accept
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تقبل العمل بنظام عمولة%';
SELECT id INTO v_q_commission_rate
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'النسبة التي تراها%';
SELECT id INTO v_q_tiered_comm
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تفضّل عمولة متدرجة%';
SELECT id INTO v_q_contact_pref
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'طريقة التواصل%';
SELECT id INTO v_q_contract_pref
FROM survey_questions
WHERE survey_id = v_survey_id
    AND question_text LIKE 'هل تفضّل وجود عقد%';
-- Response 1: Photographer
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'عدسة الفن للتصوير'),
    (v_response_id, v_q_mobile, '0501234567'),
    (v_response_id, v_q_city, 'الرياض'),
    (
        v_response_id,
        v_q_service,
        'مصور (جوال / كاميرا)'
    ),
    (v_response_id, v_q_exp, '1–3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/art_lens_sa'
    ),
    (v_response_id, v_q_source, 'إنستجرام'),
    (v_response_id, v_q_stable, 'أحيانًا'),
    (
        v_response_id,
        v_q_challenge,
        'التفاوض على الأسعار'
    ),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '10%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (v_response_id, v_q_contact_pref, 'واتساب'),
    (v_response_id, v_q_contract_pref, 'نعم');
-- Response 2: Hospitality
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'ضيافة النخبة'),
    (v_response_id, v_q_mobile, '0559876543'),
    (v_response_id, v_q_city, 'جدة'),
    (
        v_response_id,
        v_q_service,
        'ضيافة (كيك / معجنات / حلويات)'
    ),
    (v_response_id, v_q_exp, 'أكثر من 3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/elite_catering'
    ),
    (v_response_id, v_q_source, 'توصيات'),
    (v_response_id, v_q_stable, 'نعم'),
    (v_response_id, v_q_challenge, 'تنظيم المواعيد'),
    (v_response_id, v_q_platform_opinion, 'مقبولة'),
    (
        v_response_id,
        v_q_commission_accept,
        'حسب النسبة'
    ),
    (v_response_id, v_q_commission_rate, '12%'),
    (v_response_id, v_q_tiered_comm, 'false'),
    (v_response_id, v_q_contact_pref, 'اتصال مباشر'),
    (v_response_id, v_q_contract_pref, 'لا يهم');
-- Response 3: Kosha
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'أزهار وكوش'),
    (v_response_id, v_q_mobile, '0544556677'),
    (v_response_id, v_q_city, 'الدمام'),
    (v_response_id, v_q_service, 'كوش'),
    (v_response_id, v_q_exp, '1–3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/flowers_kosha'
    ),
    (v_response_id, v_q_source, 'تيك توك'),
    (v_response_id, v_q_stable, 'لا'),
    (v_response_id, v_q_challenge, 'قلة الطلب'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '15%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (
        v_response_id,
        v_q_contact_pref,
        'عبر منصة رقمية'
    ),
    (v_response_id, v_q_contract_pref, 'نعم');
END $$;