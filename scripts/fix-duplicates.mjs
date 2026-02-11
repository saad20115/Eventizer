
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicates() {
    console.log('Checking for duplicate/empty surveys...');

    // 1. Get all surveys
    const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select('id, title, created_at');

    if (surveysError) {
        console.error('Error fetching surveys:', surveysError);
        return;
    }

    console.log(`Found ${surveys.length} surveys.`);

    for (const survey of surveys) {
        // 2. Check for questions
        const { count, error: countError } = await supabase
            .from('survey_questions')
            .select('*', { count: 'exact', head: true })
            .eq('survey_id', survey.id);

        if (countError) {
            console.error(`Error checking questions for survey ${survey.id}:`, countError);
            continue;
        }

        if (count === 0) {
            console.log(`Survey ${survey.id} ("${survey.title}") has 0 questions. Deleting...`);
            const { error: deleteError } = await supabase
                .from('surveys')
                .delete()
                .eq('id', survey.id);

            if (deleteError) {
                console.error(`Failed to delete survey ${survey.id}:`, deleteError);
            } else {
                console.log(`Deleted survey ${survey.id}.`);
            }
        } else {
            console.log(`Survey ${survey.id} has ${count} questions. Keeping.`);
        }
    }
    console.log('Done.');
}

fixDuplicates();
