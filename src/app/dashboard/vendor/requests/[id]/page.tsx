"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/modules/shared/config/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function RequestDetails() {
    const { t } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [offer, setOffer] = useState({ price: '', message: '' });
    const [existingOffer, setExistingOffer] = useState<any>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('requests')
                .select('*, profiles(full_name)')
                .eq('id', params.id)
                .single();

            if (data) setRequest(data);

            // Check if user already submitted an offer
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: offerData } = await supabase
                    .from('offers')
                    .select('*')
                    .eq('request_id', params.id)
                    .eq('vendor_id', user.id)
                    .single();

                if (offerData) setExistingOffer(offerData);
            }

            setLoading(false);
        };

        fetchRequest();
    }, [params.id]);

    const submitOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.from('offers').insert([
                {
                    request_id: params.id,
                    vendor_id: user.id,
                    price: parseFloat(offer.price),
                    message: offer.message,
                    status: 'pending'
                }
            ]);

            if (error) throw error;
            router.push('/dashboard/vendor/requests');
        } catch (error) {
            console.error("Error submitting offer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!request) return <div>Request not found</div>;

    return (
        <div className="animate-fadeInUp max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">تفاصيل الطلب #{request.id.slice(0, 8)}</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Request Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="space-y-4">
                        <div>
                            <span className="block text-gray-400 text-sm">نوع المناسبة</span>
                            <span className="text-xl font-bold text-gray-900">{request.event_type}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">التاريخ</span>
                            <span className="text-lg font-medium">{request.event_date}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">المدينة</span>
                            <span className="text-lg font-medium">{request.city}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">الميزانية</span>
                            <span className="text-lg font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full inline-block">
                                {request.budget_range}
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">الخدمات المطلوبة</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {request.service_categories?.map((c: string) => (
                                    <span key={c} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm">{c}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">الوصف</span>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl mt-2">{request.description}</p>
                        </div>
                    </div>
                </div>

                {/* Offer Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">تقديم عرض سعر</h2>

                    {existingOffer ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                            <span className="text-4xl block mb-2">✅</span>
                            <h3 className="font-bold text-lg mb-2">لقد قدمت عرضاً بالفعل!</h3>
                            <p>حالة العرض: <span className="font-bold">{existingOffer.status}</span></p>
                            <div className="mt-4 pt-4 border-t border-green-200">
                                <span className="text-sm">السعر المقدم: </span>
                                <span className="font-bold text-xl">{existingOffer.price} ر.س</span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submitOffer} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">السعر المقترح (ر.س)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-lg font-bold"
                                    placeholder="0.00"
                                    value={offer.price}
                                    onChange={(e) => setOffer({ ...offer, price: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">رسالة للعميل</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all h-32"
                                    placeholder="اكتب تفاصيل عرضك هنا ولماذا يجب أن يختارك العميل..."
                                    value={offer.message}
                                    onChange={(e) => setOffer({ ...offer, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'جاري الإرسال...' : 'إرسال العرض 🚀'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
