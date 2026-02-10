"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Form steps
const STEPS = ['event_details', 'services', 'preferences', 'review'];

export default function NewRequest() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data state
    const [formData, setFormData] = useState({
        eventType: '',
        eventDate: '',
        city: '',
        guestCount: '',
        serviceCategories: [] as string[],
        budgetRange: '',
        description: '',
    });

    // Helper functions
    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleServiceToggle = (service: string) => {
        const currentServices = formData.serviceCategories;
        if (currentServices.includes(service)) {
            setFormData({
                ...formData,
                serviceCategories: currentServices.filter((s) => s !== service),
            });
        } else {
            setFormData({
                ...formData,
                serviceCategories: [...currentServices, service],
            });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase.from('requests').insert([
                {
                    user_id: user.id,
                    event_type: formData.eventType,
                    event_date: formData.eventDate,
                    city: formData.city,
                    guest_count: parseInt(formData.guestCount),
                    budget_range: formData.budgetRange,
                    service_categories: formData.serviceCategories,
                    description: formData.description,
                    status: 'open',
                },
            ]);

            if (insertError) throw insertError;

            // Success! Redirect to requests list
            router.push('/dashboard/customer/requests');
        } catch (err: any) {
            setError(err.message || 'An error occurred while submitting request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Steps
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6 animate-fadeInUp">
                        <h2 className="text-2xl font-bold mb-4">{t.dashboard.newRequest}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المناسبة</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                    value={formData.eventType}
                                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                                >
                                    <option value="">اختر نوع المناسبة</option>
                                    <option value="wedding">زواج / Wedding</option>
                                    <option value="graduation">حفل تخرج / Graduation</option>
                                    <option value="birthday">عيد ميلاد / Birthday</option>
                                    <option value="corporate">فعالية شركة / Corporate</option>
                                    <option value="conference">مؤتمر / Conference</option>
                                    <option value="other">أخرى / Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الضيوف (تقريبي)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                    placeholder="مثال: 100"
                                    value={formData.guestCount}
                                    onChange={(e) => handleInputChange('guestCount', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ المناسبة</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                    value={formData.eventDate}
                                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                >
                                    <option value="">اختر المدينة</option>
                                    <option value="Riyadh">الرياض / Riyadh</option>
                                    <option value="Jeddah">جدة / Jeddah</option>
                                    <option value="Makkah">مكة المكرمة / Makkah</option>
                                    <option value="Dammam">الدمام / Dammam</option>
                                    <option value="Khobar">الخبر / Khobar</option>
                                    <option value="Other">أخرى / Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6 animate-fadeInUp">
                        <h2 className="text-2xl font-bold mb-4">{t.dashboard.browseServices}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { id: 'photography', label: 'تصوير / Photography', icon: '📸' },
                                { id: 'catering', label: 'ضيافة / Catering', icon: '🍽️' },
                                { id: 'venues', label: 'قاعات / Venues', icon: '🏰' },
                                { id: 'flowers', label: 'زهور / Flowers', icon: '🌸' },
                                { id: 'music', label: 'صوتيات / Music', icon: '🎵' },
                                { id: 'beauty', label: 'تجميل / Beauty', icon: '💄' },
                                { id: 'gifts', label: 'هدايا / Gifts', icon: '🎁' },
                                { id: 'lighting', label: 'إضاءة / Lighting', icon: '💡' },
                                { id: 'planning', label: 'تنظيم / Planning', icon: '📝' },
                            ].map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceToggle(service.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${formData.serviceCategories.includes(service.id)
                                            ? 'border-[var(--primary)] bg-[var(--cream)] text-[var(--primary)] font-bold'
                                            : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <div className="text-3xl">{service.icon}</div>
                                    <div className="text-sm">{service.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-4 text-center">
                            يمكنك اختيار أكثر من خدمة
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fadeInUp">
                        <h2 className="text-2xl font-bold mb-4">التفاصيل والميزانية</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">نطاق الميزانية التقديرية</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                    value={formData.budgetRange}
                                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                                >
                                    <option value="">اختر الميزانية</option>
                                    <option value="low">أقل من 5,000 ر.س</option>
                                    <option value="medium">5,000 - 20,000 ر.س</option>
                                    <option value="high">20,000 - 50,000 ر.س</option>
                                    <option value="premium">أكثر من 50,000 ر.س</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تفاصيل إضافية عن الطلب</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[var(--primary)] focus:border-[var(--primary)] h-32"
                                    placeholder="أكتب أي تفاصيل أخرى تود إضافتها للموردين..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fadeInUp">
                        <h2 className="text-2xl font-bold mb-4">مراجعة الطلب</h2>
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">نوع المناسبة</span>
                                <span className="font-bold">{formData.eventType}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">التاريخ</span>
                                <span className="font-bold">{formData.eventDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">المدينة</span>
                                <span className="font-bold">{formData.city}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">عدد الضيوف</span>
                                <span className="font-bold">{formData.guestCount}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">الخدمات المطلوبة</span>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {formData.serviceCategories.map(s => (
                                        <span key={s} className="bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">الميزانية</span>
                                <span className="font-bold">{formData.budgetRange}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">الوصف</span>
                                <p className="text-sm bg-white p-3 rounded border text-gray-700">{formData.description || 'لا يوجد وصف'}</p>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Progress Bar */}
            <div className="mb-12 relative">
                <div className="flex justify-between items-center relative z-10">
                    {STEPS.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${index <= currentStep
                                        ? 'bg-[var(--primary)] text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-[var(--primary)]' : 'text-gray-400'}`}>
                                {['Info', 'Services', 'Budget', 'Confirm'][index]}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0">
                    <div
                        className="h-full bg-[var(--primary)] transition-all duration-300"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100 min-h-[400px]">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0 || isSubmitting}
                    className={`px-6 py-3 rounded-xl border border-gray-300 font-medium transition-colors ${currentStep === 0
                            ? 'opacity-0 invisible'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                >
                    السابق / Back
                </button>

                {currentStep === STEPS.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-dark)] shadow-lg transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            <>
                                إرسال الطلب 🚀
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        // Simple validation for step 0
                        disabled={currentStep === 0 && (!formData.eventType || !formData.city || !formData.eventDate)}
                        className="px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-dark)] shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        التالي / Next
                    </button>
                )}
            </div>
        </div>
    );
}
