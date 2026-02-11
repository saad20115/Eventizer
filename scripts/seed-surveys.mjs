
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
}, {});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const vendorSurvey = {
    title: 'استبيان مقدمي الخدمات - Vendor Survey',
    description: 'تُستخدم المعلومات لأغراض التقييم الأولي وبناء قاعدة الشركاء المؤسسين.',
    target_audience: 'vendor',
    is_active: true
};

const questions = [
    // Basic Info
    { text: 'اسم النشاط / الجهة', type: 'text', idx: 1, required: true },
    { text: 'رقم الجوال', type: 'text', idx: 2, required: true },
    { text: 'المدينة', type: 'text', idx: 3, required: true },
    { text: 'نوع الخدمة المقدمة', type: 'choice', options: ["مصور (جوال / كاميرا)", "كوش", "DJ / فرق فنية", "ضيافة (كيك / معجنات / حلويات)", "مساعدة العروس (ميكب آرتست / مديرة فعاليات)"], idx: 4, required: true },
    { text: 'عدد سنوات الخبرة', type: 'choice', options: ["أقل من سنة", "1–3 سنوات", "أكثر من 3 سنوات"], idx: 5, required: true },

    // Social Links
    { text: 'رابط حساب إنستجرام', type: 'text', idx: 6, required: true },
    { text: 'رابط حساب تيك توك', type: 'text', idx: 7, required: false },
    { text: 'رابط حساب سناب شات', type: 'text', idx: 8, required: false },
    { text: 'رابط موقع إلكتروني أو بورتفوليو (إن وجد)', type: 'text', idx: 9, required: false },

    // Portfolio
    { text: 'يرجى إرفاق رابط يحتوي على نماذج من أعمالك (Google Drive, Dropbox, etc)', type: 'text', idx: 10, required: true },

    // Section 1
    { text: 'كيف تحصل على عملائك حاليًا؟', type: 'choice', options: ["إنستجرام", "تيك توك", "سناب شات", "واتساب", "توصيات"], idx: 12, required: true },
    { text: 'هل الطلب على خدمتك مستقر حاليًا؟', type: 'choice', options: ["نعم", "أحيانًا", "لا"], idx: 13, required: true },
    { text: 'ما أكثر تحدٍ تواجهه في عملك؟', type: 'choice', options: ["قلة الطلب", "التفاوض على الأسعار", "كثرة الاستفسارات غير الجادة", "تنظيم المواعيد", "أخرى"], idx: 14, required: true },

    // Section 2 - Photography
    { text: '📸 (للمصورين) نوع التصوير الذي تقدمه', type: 'choice', options: ["جوال", "كاميرا", "الاثنين"], idx: 15, required: false },
    { text: '📸 (للمصورين) متوسط سعر الباقة', type: 'text', idx: 16, required: false },
    { text: '📸 (للمصورين) مدة التغطية المعتادة', type: 'text', idx: 17, required: false },
    { text: '📸 (للمصورين) هل تقبل حجوزات قريبة من موعد المناسبة؟', type: 'choice', options: ["نعم", "لا"], idx: 18, required: false }, // Fixed boolean to choice for simplicity in MVP form or boolean

    // Kosha
    { text: '🎨 (للكوش) نوع الكوش التي تقدمها', type: 'choice', options: ["جاهزة", "مخصصة حسب الطلب"], idx: 19, required: false },
    { text: '🎨 (للكوش) آلية التسعير', type: 'choice', options: ["باقات", "حسب الطلب"], idx: 20, required: false },
    { text: '🎨 (للكوش) أقل ميزانية تقبل بتنفيذها', type: 'text', idx: 21, required: false },
    { text: '🎨 (للكوش) هل تحتاج معاينة القاعة قبل التنفيذ؟', type: 'choice', options: ["نعم", "لا"], idx: 22, required: false },

    // DJ
    { text: '🎶 (DJ / الفرق الفنية) نوع الخدمة', type: 'choice', options: ["DJ", "فرقة فنية", "عروض ترفيهية"], idx: 23, required: false },
    { text: '🎶 (DJ / الفرق الفنية) مدة العرض المعتادة', type: 'text', idx: 24, required: false },
    { text: '🎶 (DJ / الفرق الفنية) آلية التسعير', type: 'choice', options: ["سعر ثابت", "حسب نوع المناسبة"], idx: 25, required: false },
    { text: '🎶 (DJ / الفرق الفنية) هل تحتاج تجهيزات صوتية من القاعة؟', type: 'choice', options: ["نعم", "لا"], idx: 26, required: false },

    // Catering
    { text: '🍰 (الضيافة) نوع المنتجات التي تقدمها', type: 'text', idx: 27, required: false },
    { text: '🍰 (الضيافة) الحد الأدنى للطلب', type: 'text', idx: 28, required: false },
    { text: '🍰 (الضيافة) مدة التحضير المعتادة', type: 'text', idx: 29, required: false },
    { text: '🍰 (الضيافة) هل التوصيل مشمول ضمن السعر؟', type: 'choice', options: ["نعم", "لا"], idx: 30, required: false },

    // Bride Helper
    { text: '👰‍♀️ (مساعدة العروس) نوع الدور', type: 'choice', options: ["ميكب آرتست", "مديرة فعاليات", "الاثنين"], idx: 31, required: false },
    { text: '👰‍♀️ (مساعدة العروس) آلية العمل', type: 'choice', options: ["بالساعة", "باليوم"], idx: 32, required: false },
    { text: '👰‍♀️ (مساعدة العروس) متى يتم الحجز غالبًا؟', type: 'choice', options: ["مبكر", "قريب من موعد المناسبة"], idx: 33, required: false },
    { text: '👰‍♀️ (مساعدة العروس) أكثر نقطة متعبة في التعامل مع العرائس', type: 'text', idx: 34, required: false },

    // Section 3
    { text: 'ما رأيك في فكرة منصة تجلب لك عملاء جاهزين للحجز؟', type: 'choice', options: ["ممتازة", "مقبولة", "غير مهتم"], idx: 35, required: true },
    { text: 'هل تقبل العمل بنظام عمولة مقابل جلب العميل؟', type: 'choice', options: ["نعم", "حسب النسبة", "لا"], idx: 36, required: true },
    { text: 'النسبة التي تراها مناسبة', type: 'choice', options: ["10%", "12%", "15%"], idx: 37, required: true },
    { text: 'هل تفضّل عمولة متدرجة حسب عدد الطلبات؟', type: 'choice', options: ["نعم", "لا"], idx: 38, required: true },

    // Section 4
    { text: 'طريقة التواصل المفضلة مع العميل', type: 'choice', options: ["واتساب", "اتصال مباشر", "عبر منصة رقمية"], idx: 39, required: true },
    { text: 'هل تفضّل وجود عقد وساطة ينظم العلاقة مع المنصة؟', type: 'choice', options: ["نعم", "لا", "لا يهم"], idx: 40, required: true },

    // Section 5
    { text: 'ما الذي قد يجعلك تتردد أو ترفض العمل مع منصة مثل Eventizer؟', type: 'text', idx: 41, required: true }
];

async function seed() {
    console.log('Seeding Vendor Survey...');

    // 1. Delete existing (Optional, be careful in prod)
    const { data: existing, error: fetchError } = await supabase
        .from('surveys')
        .select('id')
        .eq('title', vendorSurvey.title);

    if (fetchError) console.error('Error fetching existing:', fetchError);

    if (existing && existing.length > 0) {
        console.log(`Found ${existing.length} existing surveys. Deleting...`);
        for (const s of existing) {
            await supabase.from('surveys').delete().eq('id', s.id);
        }
    }

    // 2. Insert Survey
    const { data: survey, error: insertError } = await supabase
        .from('surveys')
        .insert(vendorSurvey)
        .select()
        .single();

    if (insertError) {
        console.error('Error inserting survey:', insertError);
        return;
    }

    console.log('Survey created:', survey.id);

    // 3. Insert Questions
    const formattedQuestions = questions.map(q => ({
        survey_id: survey.id,
        question_text: q.text,
        question_type: q.type,
        options: q.options ? JSON.stringify(q.options) : null,
        order_index: q.idx,
        is_required: q.required
    }));

    const { error: matchError } = await supabase
        .from('survey_questions')
        .insert(formattedQuestions);

    if (matchError) {
        console.error('Error inserting questions:', matchError);
    } else {
        console.log(`Successfully inserted ${formattedQuestions.length} questions.`);
    }
}

seed();
