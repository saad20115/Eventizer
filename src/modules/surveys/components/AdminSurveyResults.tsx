"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '@/modules/shared/config/supabase';
import { FullSurvey, SurveyResponse } from '@/modules/surveys/types';
import { useParams } from 'next/navigation';

import { useLanguage } from '@/context/LanguageContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminSurveyResults() {
    const { t } = useLanguage();
    const params = useParams();
    const surveyId = params.id as string;

    const [survey, setSurvey] = useState<FullSurvey | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [answersMap, setAnswersMap] = useState<Map<string, Map<string, string>>>(new Map());
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'analysis' | 'responses'>('analysis');
    const containerRef = useRef<HTMLDivElement>(null);


    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterQuestionId, setFilterQuestionId] = useState<string>('all');
    const [filterValue, setFilterValue] = useState('');

    // Derived State: Filtered & Sorted Responses
    const filteredResponses = useMemo(() => {
        return responses.filter(r => {
            // 1. Search (ID or Answers)
            const matchesSearch = () => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();
                if (r.id.toLowerCase().includes(term)) return true;

                // Check answers in Map
                const rAnswers = answersMap.get(r.id);
                if (!rAnswers) return false;
                for (const text of rAnswers.values()) {
                    if (text.toLowerCase().includes(term)) return true;
                }
                return false;
            };

            // 2. Filter by Specific Question
            const matchesFilter = () => {
                if (filterQuestionId === 'all' || !filterValue) return true;
                const answerText = answersMap.get(r.id)?.get(filterQuestionId);
                return (answerText || '').toLowerCase().includes(filterValue.toLowerCase());
            };

            return matchesSearch() && matchesFilter();
        }).sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [responses, answersMap, searchTerm, sortOrder, filterQuestionId, filterValue]);


    useEffect(() => {
        if (!surveyId) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                // 1. Get Survey & Questions in ONE query
                const { data: surveyData } = await supabase
                    .from('surveys')
                    .select('*, questions:survey_questions(*)')
                    .eq('id', surveyId)
                    .order('order_index', { foreignTable: 'survey_questions', ascending: true })
                    .single();

                if (surveyData) {
                    setSurvey(surveyData as FullSurvey);
                }

                // 2. Get Responses
                const { data: responsesData } = await supabase
                    .from('survey_responses')
                    .select('*')
                    .eq('survey_id', surveyId)
                    .order('created_at', { ascending: false });

                if (responsesData) {
                    setResponses(responsesData);

                    // 3. Get Answers for all these responses efficiently
                    if (responsesData.length > 0) {
                        const responseIds = responsesData.map(r => r.id);
                        const { data: answersData } = await supabase
                            .from('survey_answers')
                            .select('*')
                            .in('response_id', responseIds);

                        if (answersData) {
                            // Build nested Map: ResponseId -> QuestionId -> AnswerText
                            const newMap = new Map<string, Map<string, string>>();
                            answersData.forEach(a => {
                                if (!newMap.has(a.response_id)) {
                                    newMap.set(a.response_id, new Map());
                                }
                                newMap.get(a.response_id)!.set(a.question_id, a.answer_text || '');
                            });
                            setAnswersMap(newMap);
                        }
                    }
                }

            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [surveyId]);

    if (loading) return <div>{t.dashboard.surveys.public.loading}</div>;
    if (!survey) return <div>{t.dashboard.surveys.public.notFound}</div>;

    // Helper to count answers for a question
    const getAnswerCounts = (questionId: string) => {
        const counts: Record<string, number> = {};
        const q = survey.questions.find(sq => sq.id === questionId);

        responses.forEach(r => {
            const answerText = answersMap.get(r.id)?.get(questionId);
            if (!answerText) {
                counts['Skipped'] = (counts['Skipped'] || 0) + 1;
                return;
            }

            if (q?.question_type === 'multiple_choice') {
                // Split multi-select answers and count each part
                const parts = answerText.split(',').map(s => s.trim()).filter(Boolean);
                parts.forEach(p => {
                    // Extract name before ":" if it's an "Other" answer
                    const label = p.includes(':') ? p.split(':')[0].trim() : p;
                    counts[label] = (counts[label] || 0) + 1;
                });
            } else {
                // Standard single choice: handle "Other: text" as well for clean labels
                const label = answerText.includes(':') ? answerText.split(':')[0].trim() : answerText;
                counts[label] = (counts[label] || 0) + 1;
            }
        });
        return counts;
    };

    // Helper to prepare data for export
    const prepareExportData = () => {
        return responses.map(r => {
            const row: Record<string, string | number | boolean | null> = {
                'Response ID': r.id,
                'Date': new Date(r.created_at).toLocaleDateString(),
            };
            const rAnswers = answersMap.get(r.id);
            survey?.questions.forEach((q, i) => {
                const answerText = rAnswers?.get(q.id);
                row[`Q${i + 1}: ${q.question_text}`] = answerText || '';
            });
            return row;
        });
    };

    const exportToExcel = () => {
        const data = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Responses");
        XLSX.writeFile(wb, `${survey?.title || 'Survey_Results'}_Responses.xlsx`);
    };

    const exportToPDF = async () => {
        const input = document.getElementById('survey-results-container');
        if (!input) {
            console.error("Survey results container not found");
            return;
        }

        try {
            // Create a clone to manipulate styles for PDF export (e.g., expanding scroll areas)
            const clone = input.cloneNode(true) as HTMLElement;
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '0';
            clone.style.width = `${input.offsetWidth}px`; // Maintain width

            // Remove max-height and overflow restrictions from clone and its children
            // We target specific classes used in the UI: 'max-h-60' and 'overflow-y-auto'
            const scrollables = clone.querySelectorAll('.max-h-60, .overflow-y-auto');
            scrollables.forEach(el => {
                el.classList.remove('max-h-60', 'overflow-y-auto');
                (el as HTMLElement).style.maxHeight = 'none';
                (el as HTMLElement).style.overflow = 'visible';
            });

            document.body.appendChild(clone);

            // Dynamically import html-to-image
            const { toPng } = await import('html-to-image');

            const dataUrl = await toPng(clone, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                canvasWidth: clone.scrollWidth,
                canvasHeight: clone.scrollHeight
            });

            // Cleanup clone
            document.body.removeChild(clone);

            const imgData = dataUrl;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pageHeight = pdf.internal.pageSize.getHeight();

            let heightLeft = pdfHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if content overflows
            while (heightLeft > 0) {
                position -= pageHeight; // Move image up
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${survey?.title || 'Survey_Report'}.pdf`);

        } catch (err: unknown) {
            console.error("Error generating PDF", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            alert(`${t.dashboard.surveys.reports.error}: ${errorMessage}`);
        }
    };

    // Temporary Seeding Logic
    const seedData = async () => {
        if (!confirm('Are you sure you want to seed dummy data?')) return;
        setLoading(true);
        try {
            // Find specific questions
            const q = (textSnippet: string) => survey?.questions.find(q => q.question_text.includes(textSnippet))?.id;

            const newResponses = [
                {
                    survey_id: survey!.id,
                    answers: [
                        { question_id: q('اسم النشاط'), answer_text: 'عدسة الفن للتصوير' },
                        { question_id: q('رقم الجوال'), answer_text: '0501234567' },
                        { question_id: q('المدينة'), answer_text: 'الرياض' },
                        { question_id: q('نوع الخدمة'), answer_text: 'مصور (جوال / كاميرا)' },
                        { question_id: q('سنوات الخبرة'), answer_text: '1–3 سنوات' },
                        { question_id: q('إنستجرام'), answer_text: 'instagram.com/art_lens_sa' },
                        { question_id: q('كيف تحصل'), answer_text: 'إنستجرام' },
                        { question_id: q('هل الطلب'), answer_text: 'أحيانًا' },
                        { question_id: q('تحدٍ'), answer_text: 'التفاوض على الأسعار' },
                        { question_id: q('رأيك في فكرة'), answer_text: 'ممتازة' },
                        { question_id: q('بنظام عمولة'), answer_text: 'نعم' },
                        { question_id: q('النسبة'), answer_text: '10%' },
                        { question_id: q('عمولة متدرجة'), answer_text: 'true' },
                        { question_id: q('طريقة التواصل'), answer_text: 'واتساب' },
                        { question_id: q('عقد وساطة'), answer_text: 'نعم' },
                    ]
                },
                {
                    survey_id: survey!.id,
                    answers: [
                        { question_id: q('اسم النشاط'), answer_text: 'ضيافة النخبة' },
                        { question_id: q('رقم الجوال'), answer_text: '0559876543' },
                        { question_id: q('المدينة'), answer_text: 'جدة' },
                        { question_id: q('نوع الخدمة'), answer_text: 'ضيافة (كيك / معجنات / حلويات)' },
                        { question_id: q('سنوات الخبرة'), answer_text: 'أكثر من 3 سنوات' },
                        { question_id: q('إنستجرام'), answer_text: 'instagram.com/elite_catering' },
                        { question_id: q('كيف تحصل'), answer_text: 'توصيات' },
                        { question_id: q('هل الطلب'), answer_text: 'نعم' },
                        { question_id: q('تحدٍ'), answer_text: 'تنظيم المواعيد' },
                        { question_id: q('رأيك في فكرة'), answer_text: 'مقبولة' },
                        { question_id: q('بنظام عمولة'), answer_text: 'حسب النسبة' },
                        { question_id: q('النسبة'), answer_text: '12%' },
                        { question_id: q('عمولة متدرجة'), answer_text: 'false' },
                        { question_id: q('طريقة التواصل'), answer_text: 'اتصال مباشر' },
                        { question_id: q('عقد وساطة'), answer_text: 'لا يهم' },
                    ]
                }
            ];

            for (const resp of newResponses) {
                const { data: rData, error: rError } = await supabase.from('survey_responses').insert({ survey_id: resp.survey_id }).select().single();
                if (rError || !rData) {
                    console.error("Error creating response", rError);
                    continue;
                }

                const answersToInsert = resp.answers
                    .filter(a => a.question_id) // Filter out undefined question IDs if not found
                    .map(a => ({
                        response_id: rData.id,
                        question_id: a.question_id!,
                        answer_text: a.answer_text
                    }));

                await supabase.from('survey_answers').insert(answersToInsert);
            }

            alert("Dummy data seeded!");
            window.location.reload();

        } catch (e) {
            console.error(e);
            alert("Error seeding data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>{t.dashboard.surveys.public.loading}</div>;
    if (!survey) return <div>{t.dashboard.surveys.public.notFound}</div>;

    return (
        <div className="space-y-8" id="survey-results-container" ref={containerRef}>
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1
                        className="text-2xl font-bold mb-2 text-gray-800 cursor-pointer"
                        onDoubleClick={seedData}
                        title="Double click to seed data (Dev)"
                    >
                        {survey.title}
                    </h1>

                    <p className="text-gray-500 max-w-2xl">{survey.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${survey.target_audience === 'customer' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                            {survey.target_audience.toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${survey.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                            {survey.is_active ? t.dashboard.surveys.status.active : t.dashboard.surveys.status.inactive}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200"
                    >
                        <span>📊</span> {t.dashboard.surveys.reports.exportExcel}
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                        <span>📄</span> {t.dashboard.surveys.reports.exportPDF}
                    </button>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-gray-500 mb-2 font-medium">{t.dashboard.surveys.reports.totalResponses}</div>
                    <div className="text-4xl font-bold text-[var(--primary)]">{responses.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-gray-500 mb-2 font-medium">{t.dashboard.surveys.reports.firstResponse}</div>
                    <div className="text-lg font-bold text-gray-800">
                        {responses.length > 0 ? new Date(responses[responses.length - 1].created_at).toLocaleDateString() : '-'}
                    </div>
                    {responses.length > 0 && <div className="text-xs text-gray-400 mt-1">{new Date(responses[responses.length - 1].created_at).toLocaleTimeString()}</div>}
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="text-gray-500 mb-2 font-medium">{t.dashboard.surveys.reports.lastResponse}</div>
                    <div className="text-lg font-bold text-gray-800">
                        {responses.length > 0 ? new Date(responses[0].created_at).toLocaleDateString() : '-'}
                    </div>
                    {responses.length > 0 && <div className="text-xs text-gray-400 mt-1">{new Date(responses[0].created_at).toLocaleTimeString()}</div>}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'analysis' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    {t.dashboard.surveys.tabs.analysis}
                    {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />}
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'responses' ? 'text-[var(--primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('responses')}
                >
                    {t.dashboard.surveys.tabs.responses}
                    {activeTab === 'responses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'analysis' ? (
                <div className="grid gap-6">
                    {survey.questions.map((q, idx) => {
                        const counts = getAnswerCounts(q.id);
                        const totalForQ = Object.values(counts).reduce((a, b) => a + b, 0);

                        return (
                            <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex gap-2">
                                    <span className="text-gray-400">Q{idx + 1}.</span>
                                    {q.question_text}
                                </h3>

                                {q.question_type === 'text' ? (
                                    <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                                        {responses.map((r: SurveyResponse) => answersMap.get(r.id)?.get(q.id)).filter(Boolean).map((text, i) => (
                                            <div key={i} className="text-sm p-3 border-b border-gray-100 last:border-0 bg-white rounded shadow-sm mb-2 text-gray-700">
                                                &quot;{text}&quot;
                                            </div>
                                        ))}
                                        {responses.every((r: SurveyResponse) => !answersMap.get(r.id)?.has(q.id)) && <span className="text-gray-400 text-sm">{t.dashboard.surveys.table.noTextAnswers}</span>}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {Object.entries(counts).map(([option, count]) => {
                                            const percent = totalForQ ? Math.round((count / totalForQ) * 100) : 0;
                                            return (
                                                <div key={option} className="relative">
                                                    <div className="flex justify-between text-sm mb-1 font-medium text-gray-700">
                                                        <span>{option}</span>
                                                        <span>{count} ({percent}%)</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-400 transition-all duration-500"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {Object.keys(counts).length === 0 && <span className="text-gray-400 text-sm italic">{t.dashboard.surveys.table.noResponses}</span>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                title="Sort Order"
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>

                            <div className="flex gap-2 items-center flex-1 md:flex-initial">
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] max-w-[150px]"
                                    value={filterQuestionId}
                                    onChange={(e) => setFilterQuestionId(e.target.value)}
                                    title="Filter by Question"
                                >
                                    <option value="all">Filter by Question</option>
                                    {survey.questions.map((q, i) => (
                                        <option key={q.id} value={q.id}>Q{i + 1}: {q.question_text.substring(0, 15)}...</option>
                                    ))}
                                </select>
                                {filterQuestionId !== 'all' && (
                                    <input
                                        type="text"
                                        placeholder="Value..."
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] w-32"
                                        value={filterValue}
                                        onChange={(e) => setFilterValue(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 whitespace-nowrap">{t.dashboard.surveys.table.responseId}</th>
                                    <th className="px-6 py-3 whitespace-nowrap">{t.dashboard.surveys.table.date}</th>
                                    {survey.questions.map((q, i) => (
                                        <th key={q.id} className="px-6 py-3 min-w-[200px]">
                                            Q{i + 1}: {q.question_text.length > 30 ? q.question_text.substring(0, 30) + '...' : q.question_text}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResponses.map((r: SurveyResponse) => (
                                    <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{r.id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                                        {survey.questions.map((q) => {
                                            const answerText = answersMap.get(r.id)?.get(q.id);
                                            return (
                                                <td key={q.id} className="px-6 py-4 text-gray-900">
                                                    {answerText || <span className="text-gray-300">-</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {filteredResponses.length === 0 && (
                                    <tr>
                                        <td colSpan={survey.questions.length + 2} className="px-6 py-8 text-center text-gray-500">
                                            {responses.length === 0 ? t.dashboard.surveys.table.noResponses : "No matching results"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
