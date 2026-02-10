"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function VendorDashboard() {
    const { t } = useLanguage();

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.vendorWelcome}</h1>
                <p className="text-gray-500">{t.dashboard.vendorWelcomeSub}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.newRequests}</span>
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">🔔</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.views}</span>
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">👁️</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.sales}</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">💰</span>
                    </div>
                    <div className="text-3xl font-bold">0.00 ر.س</div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.rating}</span>
                        <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-xl">⭐</span>
                    </div>
                    <div className="text-3xl font-bold">5.0</div>
                </div>
            </div>

            {/* Recent Requests */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.recentRequests}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 text-center text-gray-500 py-12">
                    <span className="text-4xl block mb-2">📭</span>
                    {t.dashboard.noRequests}
                </div>
            </div>
        </div>
    );
}
