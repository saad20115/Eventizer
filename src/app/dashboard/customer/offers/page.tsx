"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OffersPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Fetch offers that belong to user's requests
                    // RLS policy ensures user only sees relevant offers
                    const { data, error } = await supabase
                        .from('offers')
                        .select(`
                            *,
                            requests:request_id (id, event_type, event_date),
                            vendor:vendor_id (full_name, avatar_url)
                        `)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    if (data) setOffers(data);
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const filteredOffers = filter === 'all'
        ? offers
        : offers.filter(o => o.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        if (language === 'ar') {
            switch (status) {
                case 'pending': return 'معلق';
                case 'accepted': return 'مقبول';
                case 'rejected': return 'مرفوض';
                default: return status;
            }
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeInUp">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.receivedOffers}</h1>
                <p className="text-gray-500">استعرض العروض المقدمة من الموردين لطلباتك</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${filter === status
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {status === 'all'
                            ? (language === 'ar' ? 'الكل' : 'All')
                            : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {/* Offers List */}
            {filteredOffers.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <span className="text-6xl block mb-4">🏷️</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد عروض متاح حالياً</h3>
                    <p className="text-gray-500 mb-8">انتظر قليلاً حتى يقدم الموردون عروضهم على طلباتك</p>
                    <Link
                        href="/dashboard/customer/requests"
                        className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        العودة لطلباتي
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <div key={offer.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full relative">
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4 rtl:right-auto rtl:left-4 ltr:right-4 ltr:left-auto">
                                <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getStatusColor(offer.status)}`}>
                                    {getStatusLabel(offer.status)}
                                </span>
                            </div>

                            {/* Vendor Info */}
                            <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl overflow-hidden">
                                    {offer.vendor?.avatar_url ? (
                                        <img src={offer.vendor.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        '🏪'
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{offer.vendor?.full_name || 'مورد مجهول'}</h3>
                                    <span className="text-xs text-gray-400 block">عرض لمناسبة: {offer.requests?.event_type}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="block text-sm text-gray-500 mb-1">السعر المقترح</span>
                                <span className="text-3xl font-bold text-[var(--primary)]">{offer.price} ر.س</span>
                            </div>

                            {/* Message Preview */}
                            <div className="mb-6 flex-1">
                                <p className="text-gray-600 text-sm line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                    "{offer.message}"
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50">
                                <Link
                                    href={`/dashboard/customer/offers/${offer.id}`}
                                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-[var(--primary)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    عرض التفاصيل واتخاذ قرار
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
