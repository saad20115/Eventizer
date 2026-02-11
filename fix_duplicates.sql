-- Delete surveys that have no questions
-- This handles the case where a survey was created (e.g. by seed script) but questions failed to insert.
DELETE FROM surveys
WHERE id NOT IN (
        SELECT DISTINCT survey_id
        FROM survey_questions
    );
-- Optional: Verify the remaining survey has questions
-- SELECT * FROM surveys;