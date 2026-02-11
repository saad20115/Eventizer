-- Seed Data for Events Market
-- Run this AFTER supabase_market_full.sql
-- 1. Create a Dummy Vendor Profile (if not exists, we use a specific UUID or just insert one)
-- Note: In real app, users sign up. Here we insert a profile directly linked to a 'fake' auth user ID for demo purposes.
-- WARNING: This requires an actual user ID from auth.users if we want to log in as them. 
-- INSTEAD: We will just insert into public.profiles and public.requests assuming we want to just "see" them in the market.
-- The RLS might block viewing if we are not signed in, but "Anyone can view open requests" policy should allow it.
-- Insert a dummy customer profile (linked to a random UUID, won't be able to login unless we create auth user, but good for display)
INSERT INTO public.profiles (id, full_name, role, avatar_url)
VALUES (
        '00000000-0000-0000-0000-000000000001',
        'أحمد العمري',
        'customer',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'شركة الأفراح',
        'vendor',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Afrah'
    ) ON CONFLICT (id) DO NOTHING;
-- Insert Vendor details
INSERT INTO public.vendors (id, business_name, verified, rating, total_jobs)
VALUES (
        '00000000-0000-0000-0000-000000000002',
        'شركة الأفراح للتنظيم',
        true,
        4.8,
        15
    ) ON CONFLICT (id) DO NOTHING;
-- Insert Dummy Requests
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
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '00000000-0000-0000-0000-000000000001',
        'زفاف',
        CURRENT_DATE + INTERVAL '30 days',
        'مكة',
        15000,
        25000,
        'نبحث عن مصور محترف وتنسيق طاولات لزفاف في قاعة صغيرة. العدد المتوقع 50 شخص.',
        'open',
        NOW()
    ),
    (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        '00000000-0000-0000-0000-000000000001',
        'عيد ميلاد',
        CURRENT_DATE + INTERVAL '7 days',
        'جدة',
        2000,
        5000,
        'حفلة عيد ميلاد طفل عمر 5 سنوات، نحتاج مهرج ورسم على الوجه.',
        'open',
        NOW() - INTERVAL '1 day'
    ) ON CONFLICT (id) DO NOTHING;
-- Insert a dummy offer for the first request
INSERT INTO public.offers (request_id, vendor_id, price, message, status)
VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '00000000-0000-0000-0000-000000000002',
        22000,
        'أهلاً بك أستاذ أحمد، يسعدنا تقديم خدماتنا. يشمل العرض تصوير فيديو وفوتوغراف مع ألبوم فاخر.',
        'pending'
    ) ON CONFLICT DO NOTHING;