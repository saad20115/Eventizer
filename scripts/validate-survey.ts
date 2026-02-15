import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
let envVars: Record<string, string> = {};

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });
} else {
    console.error('.env.local not found');
    process.exit(1);
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateSurvey() {
    console.log('Validating Vendor Survey...');

    // 1. Get Active Vendor Survey
    const { data: surveys, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('target_audience', 'vendor')
        .eq('is_active', true);

    if (surveyError) {
        console.error('Error fetching surveys:', surveyError);
        return;
    }

    if (!surveys || surveys.length === 0) {
        console.error('No active vendor survey found.');
        return;
    }

    const survey = surveys[0];
    console.log(`Found Active Survey: ${survey.title} (${survey.id})`);

    // 2. Get Questions
    const { data: questions, error: qError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', survey.id)
        .order('order_index', { ascending: true });

    if (qError) {
        console.error('Error fetching questions:', qError);
        return;
    }

    console.log(`Total Questions: ${questions.length}`);

    // 3. Check for specific conditional questions
    const checks = [
        { key: '📸', name: 'Photography' },
        { key: '🎨', name: 'Kosha' },
        { key: '🎶', name: 'DJ/Band' },
        { key: '🍰', name: 'Catering' },
        { key: '👰‍♀️', name: 'Bride Helper' }
    ];

    let missingCount = 0;

    checks.forEach(check => {
        const found = questions.some((q: any) => q.question_text.includes(check.key));
        if (found) {
            console.log(`✅ ${check.name} questions found.`);
        } else {
            console.error(`❌ ${check.name} questions MISSING!`);
            missingCount++;
        }
    });

    if (missingCount > 0) {
        console.log('\nConclusion: Conditional questions are MISSING.');
    } else {
        console.log('\nConclusion: All conditional questions are PRESENT.');
    }
}

validateSurvey();
