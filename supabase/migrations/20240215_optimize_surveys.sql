-- Add indexes to improve survey query performance
-- Index for finding questions by survey
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
-- Index for ordering questions (often used with survey_id)
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id_order ON survey_questions(survey_id, order_index);
-- Index for finding responses by survey
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
-- Index for finding responses by respondent (for potential "my responses" feature or duplicate checks)
CREATE INDEX IF NOT EXISTS idx_survey_responses_respondent_id ON survey_responses(respondent_id);
-- Index for finding answers by response
CREATE INDEX IF NOT EXISTS idx_survey_answers_response_id ON survey_answers(response_id);
-- Index for finding answers by question (for analytics/aggregation)
CREATE INDEX IF NOT EXISTS idx_survey_answers_question_id ON survey_answers(question_id);