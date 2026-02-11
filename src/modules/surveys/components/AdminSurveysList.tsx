"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/modules/shared/config/supabase';
import { Survey } from '@/modules/surveys/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSurveysList() {
    const { t, direction } = useLanguage();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const { data, error } = await supabase
                .from('surveys')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setSurveys(data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading surveys...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" dir={direction}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t.dashboard.surveys.marketResearch}</h2>
                {/* Future: Add 'Create Survey' button here */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-right py-3 px-4 font-medium text-gray-500">{t.dashboard.surveys.table.title}</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">{t.dashboard.surveys.table.target}</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">{t.dashboard.surveys.table.status}</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">{t.dashboard.surveys.table.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surveys.map((survey) => (
                            <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-gray-800 font-medium">{survey.title}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${survey.target_audience === 'customer' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {survey.target_audience.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`flex items-center gap-1.5 text-sm ${survey.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${survey.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                                        {survey.is_active ? t.dashboard.surveys.status.active : t.dashboard.surveys.status.inactive}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <Link
                                        href={`/dashboard/admin/surveys/${survey.id}`}
                                        className="text-[var(--primary)] hover:underline font-medium text-sm"
                                    >
                                        {t.dashboard.surveys.table.viewResults} →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {surveys.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-400">
                                    {t.dashboard.surveys.noSurveys}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
