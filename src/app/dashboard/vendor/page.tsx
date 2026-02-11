"use client";
import React, { useEffect, useState } from 'react';
import { useOffers } from "@/hooks/useOffers";
import { supabase } from "@/modules/shared/config/supabase";
import OfferCard from "@/components/market/OfferCard";
import Link from 'next/link';

export default function VendorDashboard() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { offers, loading } = useOffers(undefined, userId || undefined);

    // Calculate stats
    const totalOffers = offers.length;
    const acceptedOffers = offers.filter(o => o.status === 'accepted').length;
    const pendingOffers = offers.filter(o => o.status === 'pending').length;

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم مقدم الخدمة</h1>
                <p className="text-gray-500">تابع عروضك وأرباحك من مكان واحد</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">إجمالي العروض</span>
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">📤</span>
                    </div>
                    <div className="text-3xl font-bold">{totalOffers}</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">العروض المقبولة</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold">{acceptedOffers}</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">قيد الانتظار</span>
                        <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-xl">⏳</span>
                    </div>
                    <div className="text-3xl font-bold">{pendingOffers}</div>
                </div>
            </div>

            {/* Recent Offers */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">عروضي المقدمة</h2>
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
                </div>
            ) : offers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 text-center text-gray-500 py-12">
                        <span className="text-4xl block mb-2">📭</span>
                        لا توجد عروض مقدمة بعد.
                        <div className="mt-4">
                            <Link href="/market" className="text-[var(--primary)] font-bold hover:underline">تصفح طلبات السوق</Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="relative group">
                            <OfferCard offer={offer} isOwner={true} />
                            <Link
                                href={`/market/${offer.request_id}`}
                                className="absolute top-4 left-4 text-xs font-bold text-[var(--primary)] hover:underline z-10"
                            >
                                عرض تفاصيل الطلب ↗
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
