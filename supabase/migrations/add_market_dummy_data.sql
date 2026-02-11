-- Fixed SQL Script for Dummy Market Data
-- This version handles the Foreign Key connection to the auth system
-- 1. Insert dummy authentication records (to satisfy Foreign Key constraints)
-- Note: We use unique UUIDs and placeholder emails
INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        aud,
        role
    )
VALUES (
        '00000000-0000-0000-0000-000000000003',
        'sara.demo@eventizer.com',
        '',
        now(),
        '{"full_name": "سارة الغامدي"}',
        'authenticated',
        'authenticated'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'khaled.demo@eventizer.com',
        '',
        now(),
        '{"full_name": "خالد الحربي"}',
        'authenticated',
        'authenticated'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'nora.demo@eventizer.com',
        '',
        now(),
        '{"full_name": "نورة القحطاني"}',
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
-- 2. Insert corresponding profiles in the public schema
INSERT INTO public.profiles (id, full_name, role, avatar_url)
VALUES (
        '00000000-0000-0000-0000-000000000003',
        'سارة الغامدي',
        'customer',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'خالد الحربي',
        'customer',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'نورة القحطاني',
        'customer',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora'
    ) ON CONFLICT (id) DO NOTHING;
-- 3. Insert diverse open requests
INSERT INTO public.requests (
        id,
        user_id,
        event_type,
        event_date,
        city,
        budget_min,
        budget_max,
        description,
        status,
        created_at
    )
VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000003',
        'تخرج',
        CURRENT_DATE + INTERVAL '20 days',
        'الطائف',
        3000,
        7000,
        'حفلة تخرج جامعي، أحتاج بوفيه عشاء لـ 30 شخص وتنسيق بالونات وهدايا تذكارية.',
        'open',
        NOW() - INTERVAL '2 hours'
    ),
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000004',
        'مؤتمر',
        CURRENT_DATE + INTERVAL '45 days',
        'جدة',
        20000,
        45000,
        'مؤتمر تقني لمدة يومين، نحتاج تجهيز إضاءة وصوت وشاشات LED كبيرة وترجمة فورية.',
        'open',
        NOW() - INTERVAL '5 hours'
    ),
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000005',
        'زفاف',
        CURRENT_DATE + INTERVAL '60 days',
        'مكة',
        30000,
        60000,
        'تنظيم زفاف متكامل في استراحة كبرى، يشمل الكوشة، الضيافة، وتجهيز ممر العروس.',
        'open',
        NOW() - INTERVAL '1 day'
    ),
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000003',
        'عيد ميلاد',
        CURRENT_DATE + INTERVAL '12 days',
        'جدة',
        1000,
        3000,
        'حفلة ميلاد بسيطة في المنزل، نحتاج كيكة بتصميم خاص ومصور لمدة ساعتين.',
        'open',
        NOW() - INTERVAL '3 days'
    ),
    (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000004',
        'أخرى',
        CURRENT_DATE + INTERVAL '5 days',
        'الطائف',
        5000,
        10000,
        'اجتماع عائلي كبير، نحتاج ذبائح وطباخ ماهر في الموقع وتجهيز خيمة خارجية.',
        'open',
        NOW() - INTERVAL '4 days'
    );