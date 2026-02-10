"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDashboard() {
    const { t } = useLanguage();

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.welcomeCustomer}</h1>
                <p className="text-gray-500">{t.dashboard.welcomeCustomerSub}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.activeBookings}</span>
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">📅</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.receivedOffers}</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">🏷️</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">{t.dashboard.favorites}</span>
                        <span className="bg-red-100 text-red-600 p-2 rounded-lg text-xl">❤️</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.dashboard.quickActions}</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <button className="flex items-center gap-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">➕</span>
                    <div className="text-right">
                        <div className="font-bold text-lg">{t.dashboard.newRequest}</div>
                        <div className="text-white/80 text-sm">{t.dashboard.newRequestSub}</div>
                    </div>
                </button>

                <button className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[var(--primary)] transition-all group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🔍</span>
                    <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">{t.dashboard.browseServices}</div>
                        <div className="text-gray-500 text-sm">{t.dashboard.browseServicesSub}</div>
                    </div>
                </button>
            </div>
        </div>
    );
}
