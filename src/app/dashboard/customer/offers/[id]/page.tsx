"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function OfferDetails() {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            if (!params.id) return;

            // Fetch offer WITH request details and vendor details
            const { data, error } = await supabase
                .from('offers')
                .select(`
                    *,
                    requests:request_id (*),
                    vendor:vendor_id (full_name, avatar_url)
                `)
                .eq('id', params.id)
                .single();

            if (data) setOffer(data);
            setLoading(false);
        };

        fetchOffer();
    }, [params.id]);

    const handleAction = async (status: 'accepted' | 'rejected') => {
        if (!confirm(status === 'accepted' ? 'هل أنت متأكد من قبول هذا العرض؟' : 'هل أنت متأكد من رفض العرض؟')) return;

        setProcessing(true);
        try {
            const { error } = await supabase
                .from('offers')
                .update({ status })
                .eq('id', params.id);

            if (error) throw error;
            router.push('/dashboard/customer/offers');
        } catch (error) {
            console.error("Error updating offer:", error);
            alert("حدث خطأ أثناء تحديث العرض");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!offer) return <div>Offer not found</div>;

    const request = offer.requests;

    return (
        <div className="animate-fadeInUp max-w-5xl mx-auto py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">عرض من: {offer.vendor?.full_name}</h1>
                    <span className="text-gray-500">تم الاستلام في: {new Date(offer.created_at).toLocaleDateString()}</span>
                </div>
                {offer.status !== 'pending' && (
                    <div className={`px-6 py-2 rounded-full text-lg font-bold ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {offer.status === 'accepted' ? '✅ تم القبول' : '❌ تم الرفض'}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Offer Details */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-[var(--primary)] opacity-5 rounded-bl-full" />

                    <h2 className="text-2xl font-bold mb-6 text-gray-900">تفاصيل العرض</h2>

                    <div className="mb-8">
                        <span className="block text-gray-500 text-sm mb-1">السعر المقترح</span>
                        <div className="text-5xl font-bold text-[var(--primary)]">{offer.price} <span className="text-xl text-gray-400">ر.س</span></div>
                    </div>

                    <div className="mb-8">
                        <span className="block text-gray-500 text-sm mb-2">رسالة المورد</span>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed italic relative">
                            <span className="absolute top-2 right-4 text-4xl text-gray-200">"</span>
                            {offer.message}
                            <span className="absolute bottom-2 left-4 text-4xl text-gray-200">"</span>
                        </div>
                    </div>

                    {offer.status === 'pending' && (
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleAction('accepted')}
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-1 flex justify-center items-center gap-2"
                            >
                                {processing ? 'جاري التنفيذ...' : '✅ قبول العرض'}
                            </button>
                            <button
                                onClick={() => handleAction('rejected')}
                                disabled={processing}
                                className="w-full bg-white text-red-600 border-2 border-red-100 py-4 rounded-xl font-bold hover:bg-red-50 transition-all hover:border-red-200"
                            >
                                ❌ رفض العرض
                            </button>
                        </div>
                    )}
                </div>

                {/* Original Request Context */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-gray-500 uppercase tracking-wider">الطلب الأصلي</h2>

                    <div className="space-y-6">
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">نوع المناسبة</span>
                            <span className="font-bold text-lg text-gray-900">{request.event_type}</span>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <span className="block text-gray-400 text-xs uppercase mb-1">التاريخ</span>
                                <span className="font-bold text-gray-900">{request.event_date}</span>
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase mb-1">المدينة</span>
                                <span className="font-bold text-gray-900">{request.city}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">الخدمات</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {request.service_categories?.map((c: string) => (
                                    <span key={c} className="bg-white border text-gray-600 px-3 py-1 rounded text-xs">{c}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase mb-1">الميزانية التقديرية</span>
                            <span className="font-bold text-gray-900">{request.budget_range}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
