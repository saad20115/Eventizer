
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service key for bypassing RLS if needed

if (!supabaseUrl || (!supabaseKey && !supabaseServiceKey)) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, (supabaseServiceKey || supabaseKey)!);

async function generateDummyResponses() {
    console.log('Fetching Vendor Survey...');

    // 1. Get Vendor Survey
    const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select('id, title')
        .ilike('title', '%Vendor%')
        .single();

    if (surveyError || !survey) {
        console.error('Vendor survey not found:', surveyError);
        return;
    }

    console.log(`Found survey: ${survey.title} (${survey.id})`);

    // 2. Get Questions
    const { data: questions, error: questionsError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', survey.id)
        .order('order_index');

    if (questionsError || !questions) {
        console.error('Error fetching questions:', questionsError);
        return;
    }

    console.log(`Found ${questions.length} questions.`);

    // 3. Generate 10 Responses
    for (let i = 0; i < 10; i++) {
        // Create Response
        const { data: response, error: responseError } = await supabase
            .from('survey_responses')
            .insert({
                survey_id: survey.id,
                created_at: faker.date.recent({ days: 30 }).toISOString(),
            })
            .select()
            .single();

        if (responseError) {
            console.error('Error creating response:', responseError);
            continue;
        }

        const answersToInsert = questions.map(q => {
            let answerText = '';

            if (q.question_type === 'text') {
                answerText = faker.lorem.sentence();
            } else if (q.question_type === 'choice' || q.question_type === 'boolean') {
                const options = q.options || (q.question_type === 'boolean' ? ['Yes', 'No'] : []);
                if (options.length > 0) {
                    answerText = faker.helpers.arrayElement(options);
                }
            } else if (q.question_type === 'rating') {
                answerText = faker.number.int({ min: 1, max: 5 }).toString();
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
            console.log(`Generated response ${i + 1}/10`);
        }
    }

    console.log('Done!');
}

generateDummyResponses();
