"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function MessagesPage() {
    const { t } = useLanguage();

    return (
        <div className="animate-fadeInUp">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">{t.dashboard.messages}</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4">
                    💬
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد رسائل</h3>
                <p className="text-gray-500 max-w-md">
                    تواصل مباشرة مع الموردين لمناقشة تفاصيل مناسبتك.
                </p>
            </div>
        </div>
    );
}
