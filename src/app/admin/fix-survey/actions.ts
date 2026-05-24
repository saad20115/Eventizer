"use server";

import { createClient } from "@/modules/shared/config/supabaseServer";
import { VENDOR_SURVEY_QUESTIONS } from "./survey-data";

export async function repairVendorSurvey() {
    console.log("🚀 Starting Radical Vendor Survey Rebuild...");
    const supabase = await createClient();

    try {
        // 1. Find Survey
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .select('id')
            .eq('target_audience', 'vendor')
            .limit(1)
            .single();

        if (surveyError || !survey) {
            console.error('❌ Vendor survey not found:', surveyError?.message);
            return { success: false, message: 'Vendor survey not found' };
        }

        const surveyId = survey.id;
        console.log("✅ Found Vendor Survey ID:", surveyId);

        // 2. CLEAR Existing Data (Responses -> Answers -> Questions)
        // This is necessary to avoid Foreign Key Constraint errors
        console.log("🗑️ Clearing existing survey data to ensure clean rebuild...");

        // 2a. Get Response IDs to delete answers
        const { data: responses, error: fetchRespError } = await supabase
            .from('survey_responses')
            .select('id')
            .eq('survey_id', surveyId);

        if (fetchRespError) {
            console.error("⚠️ Error fetching responses:", fetchRespError.message);
            // Proceeding might fail, but let's try
        }

        if (responses && responses.length > 0) {
            const responseIds = responses.map(r => r.id);
            console.log(`Found ${responseIds.length} responses to clear.`);

            // 2b. Delete Answers (chunked if necessary, but usually fine for this scale)
            const { error: matchError } = await supabase
                .from('survey_answers')
                .delete()
                .in('response_id', responseIds);

            if (matchError) console.error("⚠️ Error deleting answers:", matchError.message);
            else console.log("✅ Answers deleted.");

            // 2c. Delete Responses
            const { error: responseError } = await supabase
                .from('survey_responses')
                .delete()
                .eq('survey_id', surveyId);

            if (responseError) console.error("⚠️ Error deleting responses:", responseError.message);
            else console.log("✅ Responses deleted.");
        } else {
            console.log("ℹ️ No existing responses found.");
        }

        // 2d. DELETE Questions
        const { error: deleteError } = await supabase
            .from('survey_questions')
            .delete()
            .eq('survey_id', surveyId);

        if (deleteError) {
            console.error("❌ Error deleting questions:", deleteError.message);
            return { success: false, message: `Delete failed: ${deleteError.message}` };
        }
        console.log("✅ Existing questions deleted.");

        // 3. INSERT New Questions
        console.log(`📝 Inserting ${VENDOR_SURVEY_QUESTIONS.length} new questions...`);

        const formattedQuestions = VENDOR_SURVEY_QUESTIONS.map((q: any) => ({
            survey_id: surveyId,
            question_text: q.text,
            question_type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
            order_index: q.idx,
            is_required: q.required
        }));

        const { error: insertError } = await supabase
            .from('survey_questions')
            .insert(formattedQuestions);

        if (insertError) {
            console.error("❌ Error inserting questions:", insertError.message);
            return { success: false, message: `Insert failed: ${insertError.message}` };
        }

        console.log("✅ Questions inserted successfully.");
        return { success: true, message: 'Vendor Survey restored from source code successfully!' };

    } catch (e: any) {
        console.error("❌ Exception during rebuild:", e);
        return { success: false, message: `Exception: ${e.message || String(e)}` };
    }
}

export async function makeQuestion10Optional() {
    console.log("🔧 Updating Question 10 to optional...");
    const supabase = await createClient();

    try {
        // Find the vendor survey
        const { data: survey, error: surveyError } = await supabase
            .from('surveys')
            .select('id')
            .eq('target_audience', 'vendor')
            .limit(1)
            .single();

        if (surveyError || !survey) {
            return { success: false, message: 'Vendor survey not found' };
        }

        // Update only question 10's is_required field
        const { error: updateError } = await supabase
            .from('survey_questions')
            .update({ is_required: false })
            .eq('survey_id', survey.id)
            .eq('order_index', 10);

        if (updateError) {
            console.error("❌ Update failed:", updateError.message);
            return { success: false, message: `Update failed: ${updateError.message}` };
        }

        console.log("✅ Question 10 updated to optional.");
        return { success: true, message: 'Question 10 is now optional (not required).' };
    } catch (e: any) {
        console.error("❌ Exception:", e);
        return { success: false, message: `Exception: ${e.message || String(e)}` };
    }
}
