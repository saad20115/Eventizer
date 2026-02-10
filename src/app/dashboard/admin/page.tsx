"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboard() {
    const { t } = useLanguage();

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.adminWelcome}</h1>
                <p className="text-gray-500">{t.dashboard.adminWelcomeSub}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">إجمالي المستخدمين</span>
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">👥</span>
                    </div>
                    <div className="text-3xl font-bold">1,234</div>
                    <div className="text-sm text-green-500 mt-2">↑ 12% هذا الشهر</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">الموردين النشطين</span>
                        <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-xl">🏪</span>
                    </div>
                    <div className="text-3xl font-bold">56</div>
                    <div className="text-sm text-green-500 mt-2">↑ 5 موردين جدد</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">الطلبات الكلية</span>
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">📋</span>
                    </div>
                    <div className="text-3xl font-bold">892</div>
                    <div className="text-sm text-gray-400 mt-2">منذ الإطلاق</div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">الإيرادات</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">💰</span>
                    </div>
                    <div className="text-3xl font-bold">45.2K</div>
                    <div className="text-sm text-green-500 mt-2">↑ 8% عن الشهر الماضي</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">النشاط الأخير</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    🔔
                                </div>
                                <div>
                                    <div className="text-sm font-medium">تسجيل مورد جديد: شركة الأفراح</div>
                                    <div className="text-xs text-gray-500">منذ 2 ساعة</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">بانتظار الموافقة</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                                        🏪
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">استديو الذكريات</div>
                                        <div className="text-xs text-gray-500">التصوير الفوتوغرافي</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600">قبول</button>
                                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200">رفض</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
