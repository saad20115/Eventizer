"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import RequestCard from "@/components/market/RequestCard";
import { useMarket, MarketFilters } from "@/hooks/useMarket";

export default function MarketPage() {
    const { requests, loading, loadingMore, error, filters, setFilters, loadMore, hasMore } = useMarket();
    const [showFilters, setShowFilters] = useState(false);


    const handleFilterChange = (key: keyof MarketFilters, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }));
    };

    const eventTypes = ['زفاف', 'ملكة', 'تخرج', 'عيد ميلاد', 'مؤتمر', 'أخرى'];
    const cities = ['مكة', 'جدة', 'الطائف'];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <div className="h-32 w-full"></div> {/* Spacer for fixed header */}
            <div className="pt-12 max-w-[1600px] mx-auto px-6 pb-12">
                <div className="text-center mb-12 animate-fadeInUp">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
                        سوق المناسبات
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        تصفح أحدث طلبات المناسبات وقدم عروضك المميزة لتزيد من دخلك
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Right Sidebar - Filters (Logical Start in RTL) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between text-gray-800 font-bold"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                تصفية النتائج
                            </span>
                            <svg className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                                <span>تصفية النتائج</span>
                                <button
                                    onClick={() => setFilters({})}
                                    className="text-sm text-[var(--primary)] hover:underline font-normal"
                                >
                                    إعادة تعيين
                                </button>
                            </h3>

                            <div className="space-y-6">
                                {/* Event Type Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">نوع المناسبة</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none bg-gray-50/50"
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                        value={filters.type || ''}
                                    >
                                        <option value="">الكل</option>
                                        {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none bg-gray-50/50"
                                        onChange={(e) => handleFilterChange('city', e.target.value)}
                                        value={filters.city || ''}
                                    >
                                        <option value="">الكل</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="border-t border-gray-100 my-4"></div>

                                {/* Date Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ المناسبة (من)</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none bg-gray-50/50"
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        value={filters.date || ''}
                                    />
                                </div>

                                {/* Budget Filter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الميزانية (الحد الأدنى)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="مثلاً: 5000"
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)]/20 outline-none bg-gray-50/50"
                                            onChange={(e) => handleFilterChange('budgetMin', Number(e.target.value))}
                                            value={filters.budgetMin || ''}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ر.س</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Results (Center area - widest) */}
                    <div className="lg:col-span-7">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-500 font-medium">جاري تحميل الطلبات...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 text-red-500 bg-red-50 rounded-3xl">
                                حدث خطأ في تحميل البيانات: {error}
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات مطابقة</h3>
                                <p className="text-gray-500">حاول تغيير خيارات البحث للعثور على نتائج أكثر</p>
                                <button
                                    onClick={() => setFilters({})}
                                    className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                                >
                                    إزالة الفلاتر
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {requests.map((req) => (
                                        <RequestCard key={req.id} request={req} />
                                    ))}
                                </div>
                                {hasMore && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => loadMore()}
                                            disabled={loadingMore}
                                            className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-[var(--primary)] text-sm font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                                                    جاري التحميل...
                                                </>
                                            ) : (
                                                'عرض المزيد من الطلبات'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Left Sidebar - Platform Info (End in RTL) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">نصائح 💡</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                        الملف الشخصي المكتمل يزيد فرصك 3 أضعاف.
                                    </p>
                                </div>
                                <div className="p-3 bg-green-50/50 rounded-2xl border border-green-100/50">
                                    <p className="text-xs text-green-800 leading-relaxed font-medium">
                                        سرعة الرد تزيد ثقة العملاء.
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                        ارفع صور أعمالك الحقيقية.
                                    </p>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <h3 className="text-base font-bold text-gray-800 mb-3">كيف يعمل؟</h3>
                            <ul className="text-xs text-gray-500 space-y-3">
                                <li className="flex gap-2">
                                    <span className="text-[var(--primary)] font-bold">١.</span>
                                    اختر الطلب المناسب
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[var(--primary)] font-bold">٢.</span>
                                    قدم عرضك المتكامل
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[var(--primary)] font-bold">٣.</span>
                                    تلقى الرد والاتفاق
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
