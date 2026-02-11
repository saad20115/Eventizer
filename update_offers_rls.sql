-- تحديث سياسات جدول العروض (Offers) لتمكين العملاء من القبول/الرفض

-- 1. التأكد من عدم وجود سياسة مشابهة
DROP POLICY IF EXISTS "Customers can update offers for their requests" ON public.offers;

-- 2. إنشاء سياسة التحديث
-- تسمح هذه السياسة للعميل بتحديث العروض المرتبطة بطلباته الخاصة فقط
CREATE POLICY "Customers can update offers for their requests" ON public.offers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE requests.id = offers.request_id
            AND requests.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE requests.id = offers.request_id
            AND requests.user_id = auth.uid()
        )
    );
