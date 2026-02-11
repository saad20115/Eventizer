-- 1. جدول الطلبات (Requests)
CREATE TABLE public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    event_type TEXT NOT NULL, 
    event_date DATE NOT NULL,
    city TEXT NOT NULL,
    guest_count INTEGER,
    budget_range TEXT,
    service_categories TEXT[],
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل RLS (Row Level Security)
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 3. سياسات الأمان (Policies)

-- السماح للمستخدم برؤية طلباته الخاصة
CREATE POLICY "Users can view own requests" ON public.requests
    FOR SELECT USING (auth.uid() = user_id);

-- السماح للمستخدم بإنشاء طلبات
CREATE POLICY "Users can insert own requests" ON public.requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- السماح للمورِّدين برؤية جميع الطلبات المفتوحة (سيتم تفعيلها لاحقاً عند الحاجة)
-- CREATE POLICY "Vendors can view open requests" ON public.requests
--    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'vendor'));

-- 4. إعداد الصلاحيات للوصول العام (اختياري، للبداية فقط)
GRANT ALL ON public.requests TO anon, authenticated, service_role;
