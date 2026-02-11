"use client";

import { useLanguage } from "@/context/LanguageContext";
import ProfileForm from "../../../components/profile/ProfileForm";

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <div className="animate-fadeInUp">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">{t.dashboard.settings}</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Profile Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">الملف الشخصي</h2>
                            <p className="text-sm text-gray-500 mt-1">تحديث بياناتك الشخصية ومعلومات الاتصال</p>
                        </div>
                        <ProfileForm />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">الأمان</h2>
                            <p className="text-sm text-gray-500 mt-1">تغيير كلمة المرور وتأمين الحساب</p>
                        </div>
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">خدمة تغيير كلمة المرور ستتوفر قريباً</p>
                            <button className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
                                تغيير كلمة المرور
                            </button>
                        </div>
                    </div>
                </div>

                {/* Side Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">تفضيلات الإشعارات</h3>
                        <div className="space-y-3">
                            {['إشعارات الطلبات الجديدة', 'رسائل المحادثات', 'العروض الترويجية', 'تحديثات المنصة'].map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-5 h-5 rounded text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 transition-colors" defaultChecked={idx < 2} />
                                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">اللغة والمظهر</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">لغة الواجهة</label>
                                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--primary)]">
                                    <option>العربية (Arabic)</option>
                                    <option>English (الإنجليزية)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">المظهر</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="border-2 border-[var(--primary)] bg-white p-2 text-center rounded-lg text-sm font-bold text-[var(--primary)]">فاتح ☀️</div>
                                    <div className="border border-gray-200 bg-gray-900 p-2 text-center rounded-lg text-sm text-gray-400 cursor-not-allowed opacity-50">داكن 🌙</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
