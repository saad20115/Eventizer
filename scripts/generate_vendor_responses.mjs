
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
let envVars = {};

try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envVars = envFile.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
    }, {});
} catch (e) {
    console.error('Error reading .env.local:', e.message);
    process.exit(1);
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
// const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']; 

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Connecting to Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateDummyResponses() {
    console.log('Fetching Vendor Survey...');

    // 1. Get Vendor Survey
    // We look for a survey with "Vendor" in the title or target_audience='vendor'
    let { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select('id, title')
        .eq('target_audience', 'vendor')
        .maybeSingle();

    if (!survey) {
        // Fallback to title search
        const { data: surveyByTitle, error: titleError } = await supabase
            .from('surveys')
            .select('id, title')
            .ilike('title', '%Vendor%') // "Vendor Survey"
            .limit(1)
            .maybeSingle();

        survey = surveyByTitle;
    }

    if (!survey) {
        console.error('Vendor survey not found. Please ensure the survey exists.');
        return;
    }

    console.log(`Found survey: ${survey.title} (${survey.id})`);

    // 2. Get Questions
    const { data: questions, error: questionsError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', survey.id)
        .order('order_index');

    if (questionsError || !questions || questions.length === 0) {
        console.error('Error fetching questions or no questions found:', questionsError);
        return;
    }

    console.log(`Found ${questions.length} questions.`);

    // 3. Generate 10 Responses
    const NUM_RESPONSES = 10;
    console.log(`Generating ${NUM_RESPONSES} dummy responses...`);

    for (let i = 0; i < NUM_RESPONSES; i++) {
        // Create Response
        // Randomize created_at to simulate data over time
        const randomDate = faker.date.recent({ days: 60 }); // Last 60 days

        const { data: response, error: responseError } = await supabase
            .from('survey_responses')
            .insert({
                survey_id: survey.id,
                created_at: randomDate.toISOString(),
                // updated_at: randomDate.toISOString(), // Column does not exist
            })
            .select()
            .single();

        if (responseError) {
            console.error('Error creating response:', responseError);
            continue;
        }

        const answersToInsert = questions.map(q => {
            let answerText = '';

            // Logic to generate somewhat realistic answers based on question text/type
            const textLower = (q.question_text || '').toLowerCase();
            const type = q.question_type;
            const options = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];

            if (type === 'text') {
                if (textLower.includes('name') || textLower.includes('اسم')) answerText = faker.company.name();
                else if (textLower.includes('mobile') || textLower.includes('جوال') || textLower.includes('phone')) answerText = faker.phone.number();
                else if (textLower.includes('city') || textLower.includes('مدينة')) answerText = faker.location.city();
                else if (textLower.includes('instagram') || textLower.includes('إنستجرام')) answerText = `instagram.com/${faker.internet.username()}`;
                else if (textLower.includes('price') || textLower.includes('سعر')) answerText = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
                else answerText = faker.lorem.sentence();
            } else if (type === 'choice' || type === 'radio' || type === 'select') {
                if (options && options.length > 0) {
                    answerText = faker.helpers.arrayElement(options);
                } else {
                    answerText = 'Option 1';
                }
            } else if (type === 'boolean') {
                answerText = faker.datatype.boolean() ? 'true' : 'false';
                // Or "Yes"/"No" if that's what the app expects.
                // Checking options if available
                if (options && options.length > 0) {
                    answerText = faker.helpers.arrayElement(options);
                } else {
                    // Default to Yes/No based on common arabic usage if checking text
                    answerText = faker.datatype.boolean() ? 'نعم' : 'لا';
                }
            } else if (type === 'rating') {
                answerText = faker.number.int({ min: 1, max: 5 }).toString();
            } else {
                answerText = faker.lorem.word();
            }

            return {
                response_id: response.id,
                question_id: q.id,
                answer_text: answerText
            };
        });

        const { error: answersError } = await supabase
            .from('survey_answers')
            .insert(answersToInsert);

        if (answersError) {
            console.error('Error inserting answers:', answersError);
        } else {
            console.log(`Generated response ${i + 1}/${NUM_RESPONSES} (ID: ${response.id})`);
        }
    }

    console.log('Done!');
}

generateDummyResponses().catch(e => console.error(e));
