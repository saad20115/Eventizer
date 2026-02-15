import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');
let envVars: Record<string, string> = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function restoreQuestions() {
    console.log('Restoring Missing Survey Questions...');

    // 1. Get Active Vendor Survey
    const { data: surveys } = await supabase.from('surveys').select('*').eq('target_audience', 'vendor').eq('is_active', true);
    if (!surveys?.length) return console.error('No active vendor survey found.');
    const surveyId = surveys[0].id;
    console.log(`Target Survey ID: ${surveyId}`);

    // 2. Define Missing Questions (Indices 15-34)
    // Extracted from populate_vendor_survey.sql
    const missingQuestions = [
        // Photography (15-18)
        { idx: 15, text: '📸 (للمصورين) نوع التصوير الذي تقدمه', type: 'choice', options: '["جوال", "كاميرا", "الاثنين"]', required: false },
        { idx: 16, text: '📸 (للمصورين) متوسط سعر الباقة', type: 'text', options: null, required: false },
        { idx: 17, text: '📸 (للمصورين) مدة التغطية المعتادة', type: 'text', options: null, required: false },
        { idx: 18, text: '📸 (للمصورين) هل تقبل حجوزات قريبة من موعد المناسبة؟', type: 'boolean', options: null, required: false },

        // Kosha (19-22)
        { idx: 19, text: '🎨 (للكوش) نوع الكوش التي تقدمها', type: 'choice', options: '["جاهزة", "مخصصة حسب الطلب"]', required: false },
        { idx: 20, text: '🎨 (للكوش) آلية التسعير', type: 'choice', options: '["باقات", "حسب الطلب"]', required: false },
        { idx: 21, text: '🎨 (للكوش) أقل ميزانية تقبل بتنفيذها', type: 'text', options: null, required: false },
        { idx: 22, text: '🎨 (للكوش) هل تحتاج معاينة القاعة قبل التنفيذ؟', type: 'boolean', options: null, required: false },

        // DJ / Bands (23-26)
        { idx: 23, text: '🎶 (DJ / الفرق الفنية) نوع الخدمة', type: 'choice', options: '["DJ", "فرقة فنية", "عروض ترفيهية"]', required: false },
        { idx: 24, text: '🎶 (DJ / الفرق الفنية) مدة العرض المعتادة', type: 'text', options: null, required: false },
        { idx: 25, text: '🎶 (DJ / الفرق الفنية) آلية التسعير', type: 'choice', options: '["سعر ثابت", "حسب نوع المناسبة"]', required: false },
        { idx: 26, text: '🎶 (DJ / الفرق الفنية) هل تحتاج تجهيزات صوتية من القاعة؟', type: 'boolean', options: null, required: false },

        // Catering (27-30)
        { idx: 27, text: '🍰 (الضيافة) نوع المنتجات التي تقدمها', type: 'text', options: null, required: false },
        { idx: 28, text: '🍰 (الضيافة) الحد الأدنى للطلب', type: 'text', options: null, required: false },
        { idx: 29, text: '🍰 (الضيافة) مدة التحضير المعتادة', type: 'text', options: null, required: false },
        { idx: 30, text: '🍰 (الضيافة) هل التوصيل مشمول ضمن السعر؟', type: 'boolean', options: null, required: false },

        // Bride Helper (31-34)
        { idx: 31, text: '👰‍♀️ (مساعدة العروس) نوع الدور', type: 'choice', options: '["ميكب آرتست", "مديرة فعاليات", "الاثنين"]', required: false },
        { idx: 32, text: '👰‍♀️ (مساعدة العروس) آلية العمل', type: 'choice', options: '["بالساعة", "باليوم"]', required: false },
        { idx: 33, text: '👰‍♀️ (مساعدة العروس) متى يتم الحجز غالبًا؟', type: 'choice', options: '["مبكر", "قريب من موعد المناسبة"]', required: false },
        { idx: 34, text: '👰‍♀️ (مساعدة العروس) أكثر نقطة متعبة في التعامل مع العرائس', type: 'text', options: null, required: false }
    ];

    // 3. Insert Questions
    for (const q of missingQuestions) {
        // Check if exists first to avoid duplicates
        const { data: existing } = await supabase.from('survey_questions')
            .select('id')
            .eq('survey_id', surveyId)
            .eq('order_index', q.idx)
            .single();

        if (existing) {
            console.log(`Skipping [${q.idx}] (Already exists)`);
        } else {
            const { error } = await supabase.from('survey_questions').insert({
                survey_id: surveyId,
                question_text: q.text,
                question_type: q.type,
                options: q.options ? JSON.parse(q.options) : null,
                order_index: q.idx,
                is_required: q.required
            });

            if (error) console.error(`Error inserting [${q.idx}]:`, error);
            else console.log(`Inserted [${q.idx}] ${q.text.substring(0, 30)}...`);
        }
    }

    console.log('Restoration Complete.');
}

restoreQuestions();
