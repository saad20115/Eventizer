-- تحديث سياسات الأمان للسماح للموردين برؤية الطلبات المفتوحة

-- 1. التأكد من وجود سياسة للموردين (حذفها إذا كانت موجودة لتجنب التكرار)
DROP POLICY IF EXISTS "Vendors can view open requests" ON public.requests;

-- 2. إنشاء السياسة الجديدة
-- هذه السياسة تسمح لأي مستخدم مسجل الدخول وله دور 'vendor' برؤية جميع الطلبات التي حالتها 'open'
CREATE POLICY "Vendors can view open requests" ON public.requests
    FOR SELECT
    USING (
        (auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'vendor'
        ))
        AND 
        (status = 'open')
    );

-- 3. (اختياري) فهرس لتحسين أداء الاستعلام
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
