-- 1. جدول العروض (Offers)
CREATE TABLE public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    vendor_id UUID REFERENCES public.profiles(id) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- 3. سياسات الأمان
-- المورد يرى عروضه فقط
CREATE POLICY "Vendors can view own offers" ON public.offers
    FOR SELECT USING (auth.uid() = vendor_id);

-- المورد يستطيع إنشاء عروض
CREATE POLICY "Vendors can create offers" ON public.offers
    FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- العميل يرى العروض المقدمة لطلباته
CREATE POLICY "Customers can view offers for their requests" ON public.offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE requests.id = offers.request_id
            AND requests.user_id = auth.uid()
        )
    );
