-- Add 5 Arabic Dummy Vendor Responses
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
BEGIN -- Find the vendor survey
SELECT id INTO v_survey_id
FROM public.surveys
WHERE title = 'استبيان مقدمي الخدمات - Vendor Survey'
LIMIT 1;
IF v_survey_id IS NOT NULL THEN -- Get Question IDs
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
-- 1. Photographer
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
-- 2. Catering
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
-- 3. Kosha
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
-- 4. DJ
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (v_response_id, v_q_name, 'نغمات الليل للدي جي'),
    (v_response_id, v_q_mobile, '0598887766'),
    (v_response_id, v_q_city, 'الخبر'),
    (v_response_id, v_q_service, 'DJ / فرق فنية'),
    (v_response_id, v_q_exp, '1–3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/night_tunes'
    ),
    (v_response_id, v_q_source, 'سناب شات'),
    (v_response_id, v_q_stable, 'لا'),
    (v_response_id, v_q_challenge, 'قلة الطلب'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '10%'),
    (v_response_id, v_q_tiered_comm, 'true'),
    (v_response_id, v_q_contact_pref, 'اتصال مباشر'),
    (v_response_id, v_q_contract_pref, 'نعم');
-- 5. Makeup Artist
INSERT INTO survey_responses (survey_id)
VALUES (v_survey_id)
RETURNING id INTO v_response_id;
INSERT INTO survey_answers (response_id, question_id, answer_text)
VALUES (
        v_response_id,
        v_q_name,
        'لمسة جمال - ميكب آرتست'
    ),
    (v_response_id, v_q_mobile, '0531112233'),
    (v_response_id, v_q_city, 'مكة المكرمة'),
    (
        v_response_id,
        v_q_service,
        'مساعدة العروس (ميكب آرتست / مديرة فعاليات)'
    ),
    (v_response_id, v_q_exp, 'أكثر من 3 سنوات'),
    (
        v_response_id,
        v_q_insta,
        'instagram.com/beauty_touch'
    ),
    (v_response_id, v_q_source, 'إنستجرام'),
    (v_response_id, v_q_stable, 'نعم'),
    (v_response_id, v_q_challenge, 'أخرى'),
    (v_response_id, v_q_platform_opinion, 'ممتازة'),
    (v_response_id, v_q_commission_accept, 'نعم'),
    (v_response_id, v_q_commission_rate, '12%'),
    (v_response_id, v_q_tiered_comm, 'false'),
    (v_response_id, v_q_contact_pref, 'واتساب'),
    (v_response_id, v_q_contract_pref, 'لا يهم');
END IF;
END $$;