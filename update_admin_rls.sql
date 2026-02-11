-- دالة للتحقق مما إذا كان المستخدم مسؤولاً (تتجاوز RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تحديث سياسات جدول الملفات الشخصية (Profiles)

-- 1. السماح للمسؤولين برؤية جميع الملفات
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT
    USING (is_admin());

-- 2. السماح للمسؤولين بتحديث الملفات (لتغيير الأدوار)
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE
    USING (is_admin());

-- 3. السماح للمسؤولين بحذف المستخدمين (اختياري)
CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE
    USING (is_admin());
