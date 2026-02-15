import { supabase } from '@/modules/shared/config/supabase';
import { FullSurvey } from '../types';

export const surveyService = {
    // Fetch active survey for a specific audience (customer/vendor)
    // For MVP, we fetch the first active survey matching the audience.
    async getSurveyByAudience(audience: 'customer' | 'vendor'): Promise<FullSurvey | null> {
        // Fetch survey and its questions in a single query using joins
        const { data, error } = await supabase
            .from('surveys')
            .select(`
                *,
                questions:survey_questions(*)
            `)
            .eq('target_audience', audience)
            .eq('is_active', true)
            .order('order_index', { foreignTable: 'survey_questions', ascending: true })
            .limit(1)
            .single();

        if (error || !data) {
            console.error('Error fetching survey with questions:', error);
            return null;
        }

        return data as FullSurvey;
    },

    // Submit a response
    async submitResponse(
        surveyId: string,
        answers: { questionId: string; answer: string }[],
        respondentId?: string,
        respondentEmail?: string
    ): Promise<{ success: boolean; error?: Error | unknown }> {
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
        } catch (error: unknown) {
            console.error('Error submitting survey:', error);
            return { success: false, error };
            return { success: false, error };
        }
    },

    // Check if user has already responded to the active survey for an audience
    async hasUserResponded(userId: string, audience: 'customer' | 'vendor'): Promise<boolean> {
        // 1. Get Active Survey ID for that audience
        // We reuse the getSurveyByAudience logic but we could optimize to select ID only if needed.
        // For now, reuse is fine.
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .select('id')
            .eq('target_audience', audience)
            .eq('is_active', true)
            .limit(1)
            .single();

        if (surveyError || !survey) return false;

        // 2. Check Response Count
        const { count, error } = await supabase
            .from('survey_responses')
            .select('*', { count: 'exact', head: true })
            .eq('survey_id', survey.id)
            .eq('respondent_id', userId);

        if (error) {
            console.error('Error checking response status:', error);
            return false;
        }

        return (count || 0) > 0;
    }
};
