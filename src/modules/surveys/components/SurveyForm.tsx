"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FullSurvey, SurveyQuestion } from '../types';
import { surveyService } from '../services/surveyService';
import { useLanguage } from '@/context/LanguageContext';

interface SurveyFormProps {
    survey: FullSurvey;
    userEmail?: string;
    userId?: string;
    onComplete?: () => void;
}

export default function SurveyForm({ survey, userEmail, userId, onComplete }: SurveyFormProps) {
    const { t, direction } = useLanguage();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

    // Helper to find the "Service Type" answer
    // We look for a question with specific text. This is a heuristic for the MVP.
    const serviceTypeQuestionId = useMemo(() => {
        return survey.questions.find(q => q.question_text.includes("نوع الخدمة المقدمة"))?.id;
    }, [survey]);

    const selectedServiceType = serviceTypeQuestionId ? answers[serviceTypeQuestionId] : null;

    // Logic to determine if a question should be shown
    const shouldShowQuestion = (q: SurveyQuestion) => {
        // If it's a general question (no special prefix), show it
        if (!q.question_text.match(/^[\u{1F300}-\u{1F9FF}]/u)) { // Regex to check for emoji at start
            // Exception: The service specific headers (not implemented as headers but questions?)
            return true;
        }

        // Specific logic based on emojis used in the seed data
        const text = q.question_text;

        if (text.startsWith('📸')) return selectedServiceType?.includes("مصور");
        if (text.startsWith('🎨')) return selectedServiceType?.includes("كوش");
        if (text.startsWith('🎶')) return selectedServiceType?.includes("DJ") || selectedServiceType?.includes("فرق");
        if (text.startsWith('🍰')) return selectedServiceType?.includes("ضيافة");
        if (text.startsWith('👰‍♀️')) return selectedServiceType?.includes("مساعدة");

        return true;
    };

    const visibleQuestions = survey.questions.filter(shouldShowQuestion);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        // If user switches away from "Other", we might want to clear the custom input, but keeping it is also fine for UX.
    };

    const handleMultipleChoiceChange = (questionId: string, option: string) => {
        setAnswers(prev => {
            const currentVal = prev[questionId] || "";
            const selectedOptions = currentVal ? currentVal.split(',').map(s => s.trim()) : [];

            let newOptions;
            if (selectedOptions.includes(option)) {
                newOptions = selectedOptions.filter(o => o !== option);
            } else {
                newOptions = [...selectedOptions, option];
            }

            return {
                ...prev,
                [questionId]: newOptions.join(', ')
            };
        });
    };

    const handleOtherInputChange = (questionId: string, value: string) => {
        setOtherInputs(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validate required fields (ONLY visible ones)
        const missingRequired = visibleQuestions.filter(q => {
            if (!q.is_required) return false;
            const answer = answers[q.id];
            if (!answer) return true;

            // If "Other" is selected, ensure the text input is not empty
            if ((answer === 'أخرى' || answer === 'Other') && !otherInputs[q.id]?.trim()) {
                return true;
            }
            return false;
        });

        if (missingRequired.length > 0) {
            setError('Please answer all required questions.');
            setIsSubmitting(false);
            return;
        }

        const formattedAnswers = visibleQuestions
            .filter(q => answers[q.id]) // ensure we have an answer
            .map(q => {
                let finalAnswer = answers[q.id];

                // Keep fallback keywords identical to rendering logic for consistency
                const forceMulti = q.question_type === 'choice' && (
                    q.question_text.includes('صعوبة') ||
                    q.question_text.includes('أسهل') ||
                    q.question_text.includes('تبحث') ||
                    q.question_text.includes('تحد') ||
                    q.question_text.includes('تحدٍ') ||
                    q.question_text.includes('مشكلة') ||
                    q.question_text.includes('أكثر من خيار') ||
                    JSON.stringify(q.options || []).includes('بوفيه')
                );

                const currentEffectiveType = forceMulti ? 'multiple_choice' : q.question_type;

                if (currentEffectiveType === 'multiple_choice') {
                    // Logic for multi-select: Handle "Other" for each selected option
                    const parts = finalAnswer.split(',').map((s: string) => s.trim());
                    const processedParts = parts.map((p: string) => {
                        if ((p === 'أخرى' || p === 'Other') && otherInputs[q.id]?.trim()) {
                            return `${p}: ${otherInputs[q.id].trim()}`;
                        }
                        return p;
                    });
                    finalAnswer = processedParts.join(', ');
                } else {
                    // Combine "Other" for single-select
                    if ((finalAnswer === 'أخرى' || finalAnswer === 'Other') && otherInputs[q.id]?.trim()) {
                        finalAnswer = `${finalAnswer}: ${otherInputs[q.id].trim()}`;
                    }
                }

                return {
                    questionId: q.id,
                    answer: finalAnswer
                };
            });

        const result = await surveyService.submitResponse(survey.id, formattedAnswers, userId, userEmail);

        if (result.success) {
            setIsCompleted(true);
            if (onComplete) onComplete();
        } else {
            setError(t.dashboard.surveys.public.error);
        }
        setIsSubmitting(false);
    };

    if (isCompleted) {
        return (
            <div className="text-center p-12 bg-green-50 rounded-3xl border border-green-100 shadow-xl animate-fadeIn max-w-2xl mx-auto mt-10 relative">
                <Link
                    href="/"
                    className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 text-[var(--primary)] hover:text-gray-700 transition-colors font-bold text-lg group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span>{t.nav?.home || "العودة للرئيسية"}</span>
                </Link>

                <div className="text-6xl mb-6 animate-bounce">🙏</div>
                <h3 className="text-3xl font-bold text-green-800 mb-4">{t.dashboard.surveys.public.thankYou}</h3>
                <p className="text-xl text-green-700 font-medium mb-8">{t.dashboard.surveys.public.recorded}</p>

                <div className="flex justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition shadow-sm"
                    >
                        {t.nav?.home}
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-block px-8 py-3 bg-[var(--primary)] text-white rounded-full font-semibold hover:bg-[var(--primary)]/90 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        الذهاب للوحة التحكم
                    </Link>
                </div>
            </div>
        );
    }

    const getSectionHeader = (orderIndex: number) => {
        const isCustomer = survey.target_audience === 'customer';
        const sections = t.dashboard.surveys.table.sections;
        if (!sections) return null;

        if (isCustomer) {
            if (orderIndex === 1) return sections.generalInfo;
            if (orderIndex === 7) return sections.aboutOccasion;
            if (orderIndex === 10) return sections.searchExp;
            if (orderIndex === 13) return sections.budgetPayment;
            if (orderIndex === 17) return sections.concept;
            if (orderIndex === 19) return sections.strategic;
        } else {
            if (orderIndex === 1) return sections.businessInfo;
            if (orderIndex === 4) return sections.servicesExp;
            if (orderIndex === 6) return sections.digitalPresence;
            if (orderIndex === 11) return sections.marketExp;
            if (orderIndex === 14) return sections.conceptComm;
        }
        return null;
    };

    return (
        <div dir={direction}>
            <Link
                href="/"
                className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 text-[var(--primary)] hover:text-gray-700 transition-colors font-bold text-lg group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>{t.nav?.home || "العودة للرئيسية"}</span>
            </Link>

            <form onSubmit={handleSubmit} className="space-y-8 pt-20" dir={direction}>
                <div className="text-center mb-12 relative px-4">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{survey.title}</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">{survey.description}</p>
                </div>

                <div className="space-y-6">
                    {visibleQuestions.map((q, idx) => {
                        const sectionHeader = getSectionHeader(q.order_index);

                        // Force multiple_choice for specific logical questions based on keywords
                        // This acts as a fallback if the database type update failed
                        const forceMulti = q.question_type === 'choice' && (
                            q.question_text.includes('صعوبة') ||
                            q.question_text.includes('أسهل') ||
                            q.question_text.includes('تبحث') ||
                            q.question_text.includes('تحد') ||
                            q.question_text.includes('تحدٍ') ||
                            q.question_text.includes('مشكلة') ||
                            q.question_text.includes('أكثر من خيار') ||
                            JSON.stringify(q.options || []).includes('بوفيه')
                        );

                        const effectiveType = forceMulti ? 'multiple_choice' : q.question_type;


                        // HOTFIX: Explicitly override options for the "Challenges" question 
                        // to ensure "Payment Problems" appears immediately, regardless of DB state.
                        let displayOptions = q.options;
                        if (q.question_text.includes('تحد') || q.question_text.includes('Challenge')) {
                            displayOptions = ["قلة الطلب", "مشاكل الدفع", "التفاوض على الأسعار", "كثرة الاستفسارات غير الجادة", "تنظيم المواعيد", "أخرى"];
                        }

                        // Debug log to help identify why a question isn't shifting to multi-select
                        if (q.question_type === 'choice') {
                            console.log(`Survey Debug: Question "${q.question_text}" - forceMulti: ${forceMulti}`);
                        }

                        return (
                            <div key={q.id}>
                                {sectionHeader && (
                                    <div className="mt-16 mb-8 first:mt-0">
                                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-gradient-to-b from-[var(--primary)] to-purple-600 rounded-full" />
                                            {sectionHeader}
                                        </h3>
                                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-2 ml-4" />
                                    </div>
                                )}
                                <div
                                    className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <label className="block mb-6">
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <span className="text-xl font-bold text-gray-800 block">
                                                    {q.question_text}
                                                    {q.is_required && <span className="text-red-500 ml-1" title="Required">*</span>}
                                                </span>
                                                {q.description && (
                                                    <p className="text-sm text-gray-500 mt-2 font-medium bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">
                                                        💡 {q.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </label>

                                    {effectiveType === 'text' && (
                                        (() => {
                                            // Heuristic to determine input type
                                            let inputType = 'text';
                                            if (q.question_text.includes('رابط') || q.question_text.includes('Link')) inputType = 'url';
                                            else if (q.question_text.includes('رقم الجوال') || q.question_text.includes('Mobile')) inputType = 'tel';
                                            else if (q.question_text.includes('سعر') || q.question_text.includes('ميزانية') || q.question_text.includes('Price') || q.question_text.includes('Budget')) inputType = 'number';

                                            // Use textarea for open-ended questions or if long input expected (and not a specific type like url/tel/number)
                                            // If it's explicitly numbers/links, use input. If general text, use textarea.
                                            const isSpecificType = inputType !== 'text';

                                            if (!isSpecificType) {
                                                return (
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent min-h-[100px]"
                                                        placeholder="Your answer..."
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    />
                                                );
                                            }

                                            return (
                                                <input
                                                    type={inputType}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                                    placeholder={inputType === 'url' ? 'https://example.com' : 'Your answer...'}
                                                    value={answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    dir="ltr" // Force LTR for URLs and Numbers usually
                                                />
                                            );
                                        })()
                                    )}

                                    {effectiveType === 'rating' && (
                                        <div className="flex gap-3 items-center flex-wrap">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => handleAnswerChange(q.id, rating.toString())}
                                                    className={`w-14 h-14 rounded-2xl font-bold text-lg transition-all transform active:scale-95 ${answers[q.id] === rating.toString()
                                                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-110 ring-4 ring-[var(--primary)]/20'
                                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:scale-105 border border-gray-200'
                                                        }`}
                                                >
                                                    {rating}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {effectiveType === 'choice' && displayOptions && (
                                        <div className="space-y-2">
                                            {displayOptions.map((option: string) => {
                                                const isSelected = answers[q.id] === option;
                                                return (
                                                    <div key={option}>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-sm'
                                                            : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name={q.id}
                                                                value={option}
                                                                checked={isSelected}
                                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                                className="w-5 h-5 text-[var(--primary)] focus:ring-[var(--primary)]"
                                                            />
                                                            <span className="font-medium text-lg">{option}</span>
                                                        </label>

                                                        {/* Render text input if this option is "Other" and it is selected */}
                                                        {(option === 'أخرى' || option === 'Other') && isSelected && (
                                                            <input
                                                                type="text"
                                                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] text-sm animate-fadeIn"
                                                                placeholder={t.common?.other || "Please specify..."}
                                                                value={otherInputs[q.id] || ''}
                                                                onChange={(e) => handleOtherInputChange(q.id, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {effectiveType === 'multiple_choice' && displayOptions && (
                                        <div className="space-y-2">
                                            {displayOptions.map((option: string) => {
                                                const isSelected = (answers[q.id] || "").split(',').map(s => s.trim()).includes(option);
                                                return (
                                                    <div key={option}>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-sm'
                                                            : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                                                            }`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleMultipleChoiceChange(q.id, option)}
                                                                className="w-5 h-5 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                                                            />
                                                            <span className="font-medium text-lg">{option}</span>
                                                        </label>

                                                        {/* Render text input if this option is "Other" and it is selected */}
                                                        {(option === 'أخرى' || option === 'Other') && isSelected && (
                                                            <input
                                                                type="text"
                                                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] text-sm animate-fadeIn"
                                                                placeholder={t.common?.other || "Please specify..."}
                                                                value={otherInputs[q.id] || ''}
                                                                onChange={(e) => handleOtherInputChange(q.id, e.target.value)}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.question_type === 'boolean' && (
                                        <div className="space-y-2">
                                            {['true', 'false'].map((val) => {
                                                const isTrue = val === 'true';
                                                const isSelected = answers[q.id] === val;
                                                const label = isTrue ? (t.common?.yes || "نعم") : (t.common?.no || "لا");
                                                return (
                                                    <label
                                                        key={val}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                                            ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-sm'
                                                            : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={q.id}
                                                            value={val}
                                                            checked={isSelected}
                                                            onChange={() => handleAnswerChange(q.id, val)}
                                                            className="w-5 h-5 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                                                        />
                                                        <span className="font-medium text-lg">{label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center shadow-sm animate-shake">
                        <span className="text-2xl block mb-2">⚠️</span>
                        {error}
                    </div>
                )}

                <div className="mt-12 mb-8 flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full max-w-lg bg-[var(--primary)] text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-gradient-to-r from-[var(--primary)] to-purple-800 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t.dashboard.surveys.public.saving}</span>
                            </>
                        ) : (
                            <>
                                <span>{t.dashboard.surveys.public.submit}</span>
                                <span className="text-2xl rtl:rotate-180">🚀</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Spacer for fixed bottom bar */}
                <div className="h-24"></div>
            </form>
        </div>
    );
}
