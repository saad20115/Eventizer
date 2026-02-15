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

async function inspect() {
    console.log('Inspecting Survey Questions...');
    const { data: surveys } = await supabase.from('surveys').select('*').eq('target_audience', 'vendor').eq('is_active', true);
    if (!surveys?.length) return console.log('No active vendor survey.');

    const survey = surveys[0];
    console.log(`Survey ID: ${survey.id}`);

    const { data: questions } = await supabase.from('survey_questions')
        .select('id, order_index, question_text')
        .eq('survey_id', survey.id)
        .order('order_index', { ascending: true });

    questions?.forEach(q => {
        console.log(`[${q.order_index}] ${q.question_text.substring(0, 50)}...`);
    });
}

inspect();
