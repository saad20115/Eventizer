-- Add description column to survey_questions if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'survey_questions'
        AND column_name = 'description'
) THEN
ALTER TABLE survey_questions
ADD COLUMN description TEXT;
END IF;
END $$;