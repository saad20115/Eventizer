-- Update descriptions for Vendor Survey Questions
-- Basic Info
UPDATE survey_questions
SET description = 'سيتم التواصل معك من خلاله'
WHERE question_text = 'رقم الجوال';
UPDATE survey_questions
SET description = 'المدينة التي تقيم فيها وتعمل بها'
WHERE question_text = 'المدينة';
UPDATE survey_questions
SET description = 'اختر نوع الخدمة الأساسية التي تقدمها'
WHERE question_text = 'نوع الخدمة المقدمة';
-- Social Links
UPDATE survey_questions
SET description = 'يرجى نسخ الرابط كاملاً (https://instagram.com/...)'
WHERE question_text = 'رابط حساب إنستجرام';
UPDATE survey_questions
SET description = 'اختياري'
WHERE question_text = 'رابط حساب تيك توك';
UPDATE survey_questions
SET description = 'اختياري'
WHERE question_text = 'رابط حساب سناب شات';
UPDATE survey_questions
SET description = 'رابط موقعك الخاص أو معرض أعمالك'
WHERE question_text = 'رابط موقع إلكتروني أو بورتفوليو (إن وجد)';
-- Portfolio
UPDATE survey_questions
SET description = 'مهم جداً للتقييم الأولي'
WHERE question_text LIKE 'يرجى إرفاق رابط يحتوي على نماذج%';
-- Specifics
UPDATE survey_questions
SET description = 'بالريال السعودي (تقريبي)'
WHERE question_text LIKE '%متوسط سعر الباقة%';
UPDATE survey_questions
SET description = 'بالريال السعودي'
WHERE question_text LIKE '%أقل ميزانية%';
UPDATE survey_questions
SET description = 'عدد الساعات'
WHERE question_text LIKE '%مدة التغطية%';
UPDATE survey_questions
SET description = 'مثال: الكيك، التوزيعات، الخ'
WHERE question_text LIKE '%نوع المنتجات التي تقدمها%';
-- Operations
UPDATE survey_questions
SET description = 'كيف تفضل أن نتواصل معك بخصوص الطلبات الجديدة؟'
WHERE question_text = 'طريقة التواصل المفضلة مع العميل';