import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing
function getEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env: Record<string, string> = {};
    for (const line of lines) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    }
    return env;
}

const env = getEnv();
const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log(`Checking ${supabaseUrl}...`);

    for (const audience of ['vendor', 'customer'] as const) {
        console.log(`\n--- Checking ${audience.toUpperCase()} Survey ---`);

        const { data: survey } = await supabase
            .from('surveys')
            .select('id, title')
            .eq('target_audience', audience)
            .limit(1)
            .single();

        if (!survey) {
            console.error(`${audience} survey not found`);
            continue;
        }

        const { count, data, error } = await supabase
            .from('survey_questions')
            .select('*', { count: 'exact' })
            .eq('survey_id', survey.id);

        if (error) {
            console.error(`Error fetching ${audience} questions:`, error.message);
            continue;
        }

        console.log(`Survey: ${survey.title} (${survey.id})`);
        console.log(`Total Questions in DB: ${count}`);

        if (data) {
            data.sort((a, b) => a.order_index - b.order_index);
            data.forEach(q => {
                console.log(`${String(q.order_index).padStart(2, ' ')}. ${q.question_text.substring(0, 50)}${q.question_text.length > 50 ? '...' : ''} (${q.question_type})`);
            });
        }
    }
}

check();
