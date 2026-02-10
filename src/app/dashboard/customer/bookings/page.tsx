export default function CustomerBookingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">حجوزاتي 📅</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <span className="text-4xl block mb-2">📭</span>
                <p className="text-gray-500">لا توجد حجوزات حالياً.</p>
                <button className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors">
                    تصفح الخدمات
                </button>
            </div>
        </div>
    );
}
