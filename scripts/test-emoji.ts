import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    // 1. Get Survey ID
    const { data: survey } = await supabase.from('surveys').select('id').eq('target_audience', 'vendor').single();
    if (!survey) return;

    console.log("Testing insert with emoji...");
    const { error } = await supabase.from('survey_questions').insert({
        survey_id: survey.id,
        question_text: '📸 Test Emoji',
        question_type: 'text',
        order_index: 999
    });

    if (error) {
        console.error("❌ Emoji Insert Failed:", error.message);
    } else {
        console.log("✅ Emoji Insert Succeeded!");
        // Cleanup
        await supabase.from('survey_questions').delete().eq('order_index', 999);
    }
}

test();
