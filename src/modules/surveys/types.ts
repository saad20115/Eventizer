export type SurveyTargetAudience = 'customer' | 'vendor' | 'all';
export type SurveyQuestionType = 'text' | 'rating' | 'choice' | 'boolean';

export interface Survey {
    id: string;
    title: string;
    description: string | null;
    target_audience: SurveyTargetAudience;
    is_active: boolean;
    created_at: string;
}

export interface SurveyQuestion {
    id: string;
    survey_id: string;
    question_text: string;
    question_type: SurveyQuestionType;
    options: string[] | null;
    order_index: number;
    is_required: boolean;
    description?: string | null;
}

export interface SurveyResponse {
    id: string;
    survey_id: string;
    respondent_id?: string;
    respondent_email?: string;
    created_at: string;
}

export interface SurveyAnswer {
    id?: string;
    response_id: string;
    question_id: string;
    answer_text: string;
}

export interface FullSurvey extends Survey {
    questions: SurveyQuestion[];
}
