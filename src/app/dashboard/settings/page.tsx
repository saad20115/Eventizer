export default function DashboardSettings() {
    return (
        <div className="max-w-2xl">
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">الإعدادات ⚙️</h1>
                <p className="text-gray-500">تحكم ببيانات حسابك وتفضيلات الإشعارات.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">صورة الملف الشخصي</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl border border-gray-200">
                            👤
                        </div>
                        <button className="text-[var(--primary)] text-sm font-bold hover:underline">
                            رفع صورة جديدة
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">الاسم الكامل</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" placeholder="الاسم" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">رقم الجوال</label>
                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" placeholder="05xxxxxxxx" />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-colors">
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );
}
