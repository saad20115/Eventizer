"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function SurveysLanding() {
    const { t, direction } = useLanguage();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4" dir={direction}>
            <div className="text-center mb-12 max-w-2xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {t.dashboard.surveys.landing.title}
                </h1>
                <p className="text-lg text-gray-600">
                    {t.dashboard.surveys.landing.subtitle}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Customer Card */}
                <Link href="/surveys/customer" className="group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                            🛍️
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t.dashboard.surveys.landing.customerTitle}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {t.dashboard.surveys.landing.customerDesc}
                        </p>
                        <span className="text-[var(--primary)] font-bold group-hover:underline">
                            {t.dashboard.surveys.landing.start} {direction === 'rtl' ? '←' : '→'}
                        </span>
                    </div>
                </Link>

                {/* Vendor Card */}
                <Link href="/surveys/vendor" className="group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                            🏪
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t.dashboard.surveys.landing.vendorTitle}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {t.dashboard.surveys.landing.vendorDesc}
                        </p>
                        <span className="text-[var(--primary)] font-bold group-hover:underline">
                            {t.dashboard.surveys.landing.start} {direction === 'rtl' ? '←' : '→'}
                        </span>
                    </div>
                </Link>
            </div>

            <Link
                href="/"
                className="mt-12 px-8 py-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
                <span>🏠</span>
                <span>{direction === 'rtl' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}</span>
            </Link>
        </div>
    );
}
