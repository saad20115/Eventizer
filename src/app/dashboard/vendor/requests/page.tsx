export default function VendorRequestsPage() {
    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">الطلبات الواردة 📨</h1>
                <p className="text-gray-500">استعرض طلبات العملاء الجديدة وتفاعل معها لزيادة مبيعاتك.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center py-12">
                <span className="text-6xl block mb-4 animate-pulse">📭</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد طلبات جديدة</h3>
                <p className="text-gray-500 max-w-sm mx-auto">سيظهر هنا أي طلب جديد يطابق خدماتك. تأكد من إكمال ملفك الشخصي لتزيد فرص ظهورك.</p>
                <button className="mt-6 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:scale-105 transition-transform">
                    تحديث الملف الشخصي
                </button>
            </div>
        </div>
    );
}
