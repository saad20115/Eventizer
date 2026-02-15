
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), 'app/.env.local') });

// Fallback to process.cwd()/.env.local if app/.env.local fails (depending on where script is run)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function repairVendorSurvey() {
    try {
        console.log("🚀 Starting Standalone Survey Repair...");
        console.log(`Connecting to: ${supabaseUrl}`);

        // 1. Find Survey
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .select('id')
            .eq('target_audience', 'vendor')
            .limit(1)
            .single();

        if (surveyError || !survey) {
            console.error('❌ Vendor survey not found:', surveyError?.message);
            return;
        }

        const surveyId = survey.id;
        console.log("✅ Found Vendor Survey ID:", surveyId);

        // 2. Questions to Append
        const questionsToAdd = [
            { text: '📸 (للمصورين) نوع التصوير الذي تقدمه', type: 'choice', options: ["جوال", "كاميرا", "الاثنين"], idx: 15 },
            { text: '📸 (للمصورين) متوسط سعر الباقة', type: 'text', idx: 16 },
            { text: '📸 (للمصورين) مدة التغطية المعتادة', type: 'text', idx: 17 },
            { text: '📸 (للمصورين) هل تقبل حجوزات قريبة من موعد المناسبة؟', type: 'boolean', idx: 18 },

            { text: '🎨 (للكوش) نوع الكوش التي تقدمها', type: 'choice', options: ["جاهزة", "مخصصة حسب الطلب"], idx: 19 },
            { text: '🎨 (للكوش) آلية التسعير', type: 'choice', options: ["باقات", "حسب الطلب"], idx: 20 },
            { text: '🎨 (للكوش) أقل ميزانية تقبل بتنفيذها', type: 'text', idx: 21 },
            { text: '🎨 (للكوش) هل تحتاج معاينة القاعة قبل التنفيذ؟', type: 'boolean', idx: 22 },

            { text: '🎶 (DJ / الفرق الفنية) نوع الخدمة', type: 'choice', options: ["DJ", "فرقة فنية", "عروض ترفيهية"], idx: 23 },
            { text: '🎶 (DJ / الفرق الفنية) مدة العرض المعتادة', type: 'text', idx: 24 },
            { text: '🎶 (DJ / الفرق الفنية) آلية التسعير', type: 'choice', options: ["سعر ثابت", "حسب نوع المناسبة"], idx: 25 },
            { text: '🎶 (DJ / الفرق الفنية) هل تحتاج تجهيزات صوتية من القاعة؟', type: 'boolean', idx: 26 },

            { text: '🍰 (الضيافة) نوع المنتجات التي تقدمها', type: 'text', idx: 27 },
            { text: '🍰 (الضيافة) الحد الأدنى للطلب', type: 'text', idx: 28 },
            { text: '🍰 (الضيافة) مدة التحضير المعتادة', type: 'text', idx: 29 },
            { text: '🍰 (الضيافة) هل التوصيل مشمول ضمن السعر؟', type: 'boolean', idx: 30 },

            { text: '👰‍♀️ (مساعدة العروس) نوع الدور', type: 'choice', options: ["ميكب آرتست", "مديرة فعاليات", "الاثنين"], idx: 31 },
            { text: '👰‍♀️ (مساعدة العروس) آلية العمل', type: 'choice', options: ["بالساعة", "باليوم"], idx: 32 },
            { text: '👰‍♀️ (مساعدة العروس) متى يتم الحجز غالبًا؟', type: 'choice', options: ["مبكر", "قريب من موعد المناسبة"], idx: 33 },
            { text: '👰‍♀️ (مساعدة العروس) أكثر نقطة متعبة في التعامل مع العرائس', type: 'text', idx: 34 },

            // Collaboration (Section 3)
            { text: 'ما رأيك في فكرة منصة تجلب لك عملاء جاهزين للحجز؟', type: 'choice', options: ["ممتازة", "مقبولة", "غير مهتم"], idx: 35 },
            { text: 'هل تقبل العمل بنظام عمولة مقابل جلب العميل؟', type: 'choice', options: ["نعم", "حسب النسبة", "لا"], idx: 36 },
            { text: 'النسبة التي تراها مناسبة', type: 'choice', options: ["10%", "12%", "15%"], idx: 37 },
            { text: 'هل تفضّل عمولة متدرجة حسب عدد الطلبات؟', type: 'boolean', idx: 38 },

            // Operations (Section 4)
            { text: 'طريقة التواصل المفضلة مع العميل', type: 'choice', options: ["واتساب", "اتصال مباشر", "عبر منصة رقمية"], idx: 39 },
            { text: 'هل تفضّل وجود عقد وساطة ينظم العلاقة مع المنصة؟', type: 'choice', options: ["نعم", "لا", "لا يهم"], idx: 40 },

            // Open Question (Section 5)
            { text: 'ما الذي قد يجعلك تتردد أو ترفض العمل مع منصة مثل Eventizer؟', type: 'text', idx: 41 },
        ];

        let addedCount = 0;
        let warningCount = 0;
        let errorCount = 0;

        for (const q of questionsToAdd) {
            // Check if exists
            const { count } = await supabase
                .from('survey_questions')
                .select('*', { count: 'exact', head: true })
                .eq('survey_id', surveyId)
                .eq('order_index', q.idx);

            if (count === 0) {
                const { error: insertError } = await supabase.from('survey_questions').insert({
                    survey_id: surveyId,
                    question_text: q.text,
                    question_type: q.type,
                    options: q.options ? JSON.stringify(q.options) : null,
                    order_index: q.idx,
                    is_required: false
                });

                if (insertError) {
                    console.error(`❌ Failed to insert Q${q.idx}:`, insertError.message);
                    errorCount++;
                } else {
                    console.log(`✅ Inserted Q${q.idx}: ${q.text.substring(0, 30)}...`);
                    addedCount++;
                }
            } else {
                // If it exists but is different (e.g. wrong text), we might want to update it?
                // For now, just warn.
                // console.log(`⚠️ Q${q.idx} already exists. Skipping.`);
                warningCount++;
            }
        }

        // Fix Q4 (Single Select)
        console.log("🔧 Validating Question 4 (Service Type)...");
        const { error: updateError } = await supabase
            .from('survey_questions')
            .update({
                question_type: 'choice',
                options: JSON.stringify(["مصور (جوال / كاميرا)", "كوش", "DJ / فرق فنية", "ضيافة (كيك / معجنات / حلويات)", "مساعدة العروس (ميكب آرتست / مديرة فعاليات)"])
            })
            .eq('survey_id', surveyId)
            .eq('order_index', 4);

        if (updateError) {
            console.error("❌ Failed to update Q4:", updateError.message);
        } else {
            console.log("✅ Question 4 updated to Single Select.");
        }

        console.log("---------------------------------------------------");
        console.log(`RESULTS: Added: ${addedCount}, Skipped: ${warningCount}, Errors: ${errorCount}`);

        if (errorCount > 0) {
            console.log("⚠️ Some questions failed to insert. This is likely due to Row-Level Security (RLS).");
            console.log("👉 If you see RLS errors, you MUST use the SQL Editor in Supabase Dashboard.");
        } else {
            console.log("🎉 Survey Repair Complete!");
        }

    } catch (e: any) {
        console.error("❌ Exception during repair:", e);
    }
}

repairVendorSurvey();
