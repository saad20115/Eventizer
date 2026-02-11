import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMarket() {
    console.log('Seeding Market Data...');

    // 1. New Profiles
    const profiles = [
        { id: '00000000-0000-0000-0000-000000000003', full_name: 'سارة الغامدي', role: 'customer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
        { id: '00000000-0000-0000-0000-000000000004', full_name: 'خالد الحربي', role: 'customer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled' },
        { id: '00000000-0000-0000-0000-000000000005', full_name: 'نورة القحطاني', role: 'customer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora' }
    ];

    const { error: profileError } = await supabase.from('profiles').upsert(profiles);
    if (profileError) console.error('Error seeding profiles:', profileError);
    else console.log('✅ Profiles seeded.');

    // 2. New Requests
    const requests = [
        {
            user_id: '00000000-0000-0000-0000-000000000003',
            event_type: 'تخرج',
            event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            city: 'الطائف',
            budget_min: 3000,
            budget_max: 7000,
            description: 'حفلة تخرج جامعي، أحتاج بوفيه عشاء لـ 30 شخص وتنسيق بالونات وهدايا تذكارية.',
            status: 'open'
        },
        {
            user_id: '00000000-0000-0000-0000-000000000004',
            event_type: 'مؤتمر',
            event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            city: 'جدة',
            budget_min: 20000,
            budget_max: 45000,
            description: 'مؤتمر تقني لمدة يومين، نحتاج تجهيز إضاءة وصوت وشاشات LED كبيرة وترجمة فورية.',
            status: 'open'
        },
        {
            user_id: '00000000-0000-0000-0000-000000000005',
            event_type: 'زفاف',
            event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            city: 'مكة',
            budget_min: 30000,
            budget_max: 60000,
            description: 'تنظيم زفاف متكامل في استراحة كبرى، يشمل الكوشة، الضيافة، وتجهيز ممر العروس.',
            status: 'open'
        },
        {
            user_id: '00000000-0000-0000-0000-000000000003',
            event_type: 'عيد ميلاد',
            event_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            city: 'جدة',
            budget_min: 1000,
            budget_max: 3000,
            description: 'حفلة ميلاد بسيطة في المنزل، نحتاج كيكة بتصميم خاص ومصور لمدة ساعتين.',
            status: 'open'
        },
        {
            user_id: '00000000-0000-0000-0000-000000000004',
            event_type: 'أخرى',
            event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            city: 'الطائف',
            budget_min: 5000,
            budget_max: 10000,
            description: 'اجتماع عائلي كبير، نحتاج ذبائح وطباخ ماهر في الموقع وتجهيز خيمة خارجية.',
            status: 'open'
        }
    ];

    const { error: requestError } = await supabase.from('requests').insert(requests);
    if (requestError) console.error('Error seeding requests:', requestError);
    else console.log('✅ Requests seeded.');
}

seedMarket();
