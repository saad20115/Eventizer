-- ========================================================
-- ULTIMATE VENDOR SURVEY RESTORATION (40-41 Questions)
-- This script wipes and rebuilds the vendor survey questions
-- to ensure all conditional logic and missing items are restored.
-- ========================================================
DO $$
DECLARE v_survey_id UUID;
BEGIN -- 1. Find the Vendor Survey
SELECT id INTO v_survey_id
FROM public.surveys
WHERE target_audience = 'vendor'
    OR title LIKE '%Vendor%'
LIMIT 1;
IF v_survey_id IS NULL THEN RAISE NOTICE 'Vendor survey not found. Creating it...';
INSERT INTO public.surveys (title, description, target_audience, is_active)
VALUES (
        'استبيان مقدمي الخدمات - Vendor Survey',
        'تُستخدم المعلومات لأغراض التقييم الأولي وبناء قاعدة الشركاء المؤسسين.',
        'vendor',
        true
    )
RETURNING id INTO v_survey_id;
END IF;
RAISE NOTICE 'Using Survey ID: %',
v_survey_id;
-- 2. CLEAR Existing Data (To avoid duplicates and FK issues)
-- We delete answers and responses first if they exist
DELETE FROM public.survey_answers
WHERE question_id IN (
        SELECT id
        FROM public.survey_questions
        WHERE survey_id = v_survey_id
    );
DELETE FROM public.survey_questions
WHERE survey_id = v_survey_id;
-- 3. INSERT All 40 Questions
INSERT INTO public.survey_questions (
        survey_id,
        question_text,
        question_type,
        options,
        order_index,
        is_required
    )
VALUES -- Basic Info
    (
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
    -- Social Links
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
    -- Portfolio
    (
        v_survey_id,
        'يرجى إرفاق رابط يحتوي على نماذج من أعمالك (Google Drive, Dropbox, etc)',
        'text',
        null,
        10,
        true
    ),
    -- Status
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
        '["قلة الطلب", "مشاكل الدفع", "التفاوض على الأسعار", "كثرة الاستفسارات غير الجادة", "تنظيم المواعيد", "أخرى"]'::jsonb,
        14,
        true
    ),
    -- Photography (Conditional)
    (
        v_survey_id,
        '📸 (للمصورين) نوع التصوير الذي تقدمه',
        'choice',
        '["جوال", "كاميرا", "الاثنين"]'::jsonb,
        15,
        false
    ),
    (
        v_survey_id,
        '📸 (للمصورين) متوسط سعر الباقة',
        'text',
        null,
        16,
        false
    ),
    (
        v_survey_id,
        '📸 (للمصورين) مدة التغطية المعتادة',
        'text',
        null,
        17,
        false
    ),
    (
        v_survey_id,
        '📸 (للمصورين) هل تقبل حجوزات قريبة من موعد المناسبة؟',
        'boolean',
        null,
        18,
        false
    ),
    -- Kosha (Conditional)
    (
        v_survey_id,
        '🎨 (للكوش) نوع الكوش التي تقدمها',
        'choice',
        '["جاهزة", "مخصصة حسب الطلب"]'::jsonb,
        19,
        false
    ),
    (
        v_survey_id,
        '🎨 (للكوش) آلية التسعير',
        'choice',
        '["باقات", "حسب الطلب"]'::jsonb,
        20,
        false
    ),
    (
        v_survey_id,
        '🎨 (للكوش) أقل ميزانية تقبل بتنفيذها',
        'text',
        null,
        21,
        false
    ),
    (
        v_survey_id,
        '🎨 (للكوش) هل تحتاج معاينة القاعة قبل التنفيذ؟',
        'boolean',
        null,
        22,
        false
    ),
    -- DJ (Conditional)
    (
        v_survey_id,
        '🎶 (DJ / الفرق الفنية) نوع الخدمة',
        'choice',
        '["DJ", "فرقة فنية", "عروض ترفيهية"]'::jsonb,
        23,
        false
    ),
    (
        v_survey_id,
        '🎶 (DJ / الفرق الفنية) مدة العرض المعتادة',
        'text',
        null,
        24,
        false
    ),
    (
        v_survey_id,
        '🎶 (DJ / الفرق الفنية) آلية التسعير',
        'choice',
        '["سعر ثابت", "حسب نوع المناسبة"]'::jsonb,
        25,
        false
    ),
    (
        v_survey_id,
        '🎶 (DJ / الفرق الفنية) هل تحتاج تجهيزات صوتية من القاعة؟',
        'boolean',
        null,
        26,
        false
    ),
    -- Catering (Conditional)
    (
        v_survey_id,
        '🍰 (الضيافة) نوع المنتجات التي تقدمها',
        'text',
        null,
        27,
        false
    ),
    (
        v_survey_id,
        '🍰 (الضيافة) الحد الأدنى للطلب',
        'text',
        null,
        28,
        false
    ),
    (
        v_survey_id,
        '🍰 (الضيافة) مدة التحضير المعتادة',
        'text',
        null,
        29,
        false
    ),
    (
        v_survey_id,
        '🍰 (الضيافة) هل التوصيل مشمول ضمن السعر؟',
        'boolean',
        null,
        30,
        false
    ),
    -- Bride Helper (Conditional)
    (
        v_survey_id,
        '👰‍♀️ (مساعدة العروس) نوع الدور',
        'choice',
        '["ميكب آرتست", "مديرة فعاليات", "الاثنين"]'::jsonb,
        31,
        false
    ),
    (
        v_survey_id,
        '👰‍♀️ (مساعدة العروس) آلية العمل',
        'choice',
        '["بالساعة", "باليوم"]'::jsonb,
        32,
        false
    ),
    (
        v_survey_id,
        '👰‍♀️ (مساعدة العروس) متى يتم الحجز غالبًا؟',
        'choice',
        '["مبكر", "قريب من موعد المناسبة"]'::jsonb,
        33,
        false
    ),
    (
        v_survey_id,
        '👰‍♀️ (مساعدة العروس) أكثر نقطة متعبة في التعامل مع العرائس',
        'text',
        null,
        34,
        false
    ),
    -- Feedback
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
    -- Contact
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
    -- Closing
    (
        v_survey_id,
        'ما الذي قد يجعلك تتردد أو ترفض العمل مع منصة مثل Eventizer؟',
        'text',
        null,
        41,
        true
    );
RAISE NOTICE 'Survey restoration complete with 40 questions.';
END $$;