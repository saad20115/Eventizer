
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
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// Simulating Client (Anon)
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log('Testing fetch with Anon Key...');

    // 1. Get Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('target_audience', 'vendor')
        .eq('is_active', true)
        .limit(1)
        .single();

    if (surveyError) {
        console.error('Error fetching survey:', surveyError);
        return;
    }

    if (!survey) {
        console.error('No survey found');
        return;
    }

    console.log('Survey found:', survey.title, 'ID:', survey.id);

    // 2. Get Questions
    const { data: questions, error: questionsError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', survey.id);

    if (questionsError) {
        console.error('Error fetching questions:', questionsError);
    } else {
        console.log(`Questions found: ${questions?.length}`);
        if (questions?.length === 0) {
            console.log('WARNING: 0 questions returned properly, checking if any exist at all...');
            // Check count generic
            const { count } = await supabase.from('survey_questions').select('*', { count: 'exact', head: true });
            console.log(`Total questions in table (visible to anon): ${count}`);
        } else {
            console.log('First question:', questions[0]?.question_text);
        }
    }
}

testFetch();
