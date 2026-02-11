"use client";

import AdminSurveysList from '@/modules/surveys/components/AdminSurveysList';

export default function AdminSurveysPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Surveys & Feedback</h1>
            <AdminSurveysList />
        </div>
    );
}
