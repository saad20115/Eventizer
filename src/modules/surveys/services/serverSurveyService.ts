import { createClient } from "@/modules/shared/config/supabaseServer";
import { FullSurvey } from "../types";

export const serverSurveyService = {
    // Fetch active survey for a specific audience (customer/vendor)
    async getSurveyByAudience(audience: 'customer' | 'vendor'): Promise<FullSurvey | null> {
        const supabase = await createClient();

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
            console.error('Error fetching survey with questions (server):', error);
            return null;
        }

        return data as FullSurvey;
    }
};
