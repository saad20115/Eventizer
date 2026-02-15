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

async function testSubmission(audience: 'vendor' | 'customer') {
    console.log(`\nTesting ${audience} submission...`);

    // 1. Get Survey and Questions
    const { data: survey } = await supabase.from('surveys').select('id').eq('target_audience', audience).single();
    if (!survey) {
        console.error(`${audience} survey not found`);
        return;
    }

    const { data: questions } = await supabase.from('survey_questions').select('id').eq('survey_id', survey.id);
    if (!questions || questions.length === 0) {
        console.error(`No questions found for ${audience} survey`);
        return;
    }

    // 2. Insert Response
    const { data: response, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
            survey_id: survey.id,
            respondent_email: `test-${audience}@example.com`
        })
        .select()
        .single();

    if (responseError) {
        console.error(`❌ ${audience} Response Insert Failed:`, responseError.message);
        return;
    }

    // 3. Insert Answers for first 3 questions
    const answers = questions.slice(0, 3).map(q => ({
        response_id: response.id,
        question_id: q.id,
        answer_text: 'Test Answer'
    }));

    const { error: answersError } = await supabase.from('survey_answers').insert(answers);

    if (answersError) {
        console.error(`❌ ${audience} Answers Insert Failed:`, answersError.message);
    } else {
        console.log(`✅ ${audience} Submission Successful!`);
        // Cleanup
        await supabase.from('survey_responses').delete().eq('id', response.id);
    }
}

async function run() {
    await testSubmission('vendor');
    await testSubmission('customer');
}

run();
