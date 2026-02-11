"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function NewRequestPage() {
    const { t } = useLanguage();

    return (
        <div className="animate-fadeInUp">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.newRequestNav}</h1>
                <p className="text-gray-500 text-sm mt-1">{t.dashboard.newRequestSub}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4">
                    ➕
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">إنشاء طلب جديد</h3>
                <p className="text-gray-500 max-w-md mb-6">
                    قم بتعبئة النموذج لطلب عروض أسعار من أفضل مقدمي الخدمات لمناسبتك.
                </p>
                <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    بدء الطلب
                </button>
            </div>
        </div>
    );
}
