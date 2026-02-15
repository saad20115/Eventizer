
import { serverSurveyService } from '@/modules/surveys/services/serverSurveyService';
import SurveyForm from '@/modules/surveys/components/SurveyForm';

export default async function VendorSurveyPage() {
    const survey = await serverSurveyService.getSurveyByAudience('vendor');

    if (!survey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-700">No active survey found.</h2>
                    <p className="text-gray-500">Please check back later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]" />
                    <div className="p-8">
                        <SurveyForm survey={survey} />
                    </div>
                </div>
            </div>
        </div>
    );
}
