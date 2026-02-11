"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";

export default function ProfileForm() {
    const { t } = useLanguage();
    const { profile, loading, updateProfile } = useProfile();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loadingSave, setLoadingSave] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profile) {
            setName(profile.full_name || "");
            setPhone(profile.phone || "");
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSave(true);
        setMessage(null);

        const { success, error } = await updateProfile({
            full_name: name,
            phone: phone,
        });

        if (success) {
            setMessage({ type: 'success', text: 'تم حفظ التعديلات بنجاح ✨' });
        } else {
            setMessage({ type: 'error', text: error || 'حدث خطأ أثناء الحفظ' });
        }
        setLoadingSave(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="animate-fadeInUp max-w-2xl mx-auto space-y-6">
            {/* Avatar Section (Placeholder) */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-3 relative group cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span>👤</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">تغيير</span>
                    </div>
                </div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
                <div className="text-xs font-bold bg-gray-100 px-2 py-1 rounded mt-1 uppercase text-gray-600">
                    {profile?.role === 'customer' ? 'عميل' : profile?.role === 'vendor' ? 'مورد' : 'مسؤول'}
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="الاسم الثلاثي"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="05xxxxxxxx"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Alert Messages */}
            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={loadingSave}
                    className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loadingSave ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>جاري الحفظ...</span>
                        </>
                    ) : (
                        <span>حفظ التغييرات</span>
                    )}
                </button>
            </div>
        </form>
    );
}
