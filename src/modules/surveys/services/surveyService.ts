import { supabase } from '@/modules/shared/config/supabase';
import { FullSurvey, SurveyResponse, SurveyAnswer, SurveyQuestion } from '../types';

export const surveyService = {
    // Fetch active survey for a specific audience (customer/vendor)
    // For MVP, we fetch the first active survey matching the audience.
    async getSurveyByAudience(audience: 'customer' | 'vendor'): Promise<FullSurvey | null> {
        // 1. Get the survey
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .select('*')
            .eq('target_audience', audience)
            .eq('is_active', true)
            .limit(1)
            .single();

        if (surveyError || !survey) {
            console.error('Error fetching survey:', surveyError);
            return null;
        }

        // 2. Get questions
        const { data: questions, error: questionsError } = await supabase
            .from('survey_questions')
            .select('*')
            .eq('survey_id', survey.id)
            .order('order_index', { ascending: true });

        if (questionsError) {
            console.error('Error fetching questions:', questionsError);
            return null;
        }

        return {
            ...survey,
            questions: questions || []
        };
    },

    // Submit a response
    async submitResponse(
        surveyId: string,
        answers: { questionId: string; answer: string }[],
        respondentId?: string,
        respondentEmail?: string
    ): Promise<{ success: boolean; error?: any }> {
        try {
            // 1. Create Response Entry
            const { data: response, error: responseError } = await supabase
                .from('survey_responses')
                .insert([
                    {
                        survey_id: surveyId,
                        respondent_id: respondentId,
                        respondent_email: respondentEmail,
                    }
                ])
                .select()
                .single();

            if (responseError) throw responseError;

            // 2. Create Answers Entries
            const answersToInsert = answers.map(a => ({
                response_id: response.id,
                question_id: a.questionId,
                answer_text: a.answer
            }));

            const { error: answersError } = await supabase
                .from('survey_answers')
                .insert(answersToInsert);

            if (answersError) throw answersError;

            return { success: true };
        } catch (error) {
            console.error('Error submitting survey:', error);
            return { success: false, error };
        }
    }
};
