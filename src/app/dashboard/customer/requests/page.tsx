"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function RequestsPage() {
    const { t, language } = useLanguage();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('requests')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (data) setRequests(data);
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        if (language === 'ar') {
            switch (status) {
                case 'open': return 'مفتوح';
                case 'completed': return 'مكتمل';
                case 'cancelled': return 'ملغي';
                default: return status;
            }
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeInUp">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.myRequests}</h1>
                    <p className="text-gray-500">تابع حالة طلباتك وعروض الموردين</p>
                </div>
                <Link
                    href="/dashboard/customer/new-request"
                    className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-colors shadow-lg flex items-center gap-2"
                >
                    <span>➕</span>
                    <span className="hidden sm:inline">{t.dashboard.newRequestNav}</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {['all', 'open', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${filter === status
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {status === 'all' ? (language === 'ar' ? 'الكل' : 'All') : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            {requests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <span className="text-6xl block mb-4">📝</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات حتى الآن</h3>
                    <p className="text-gray-500 mb-8">ابدأ بإنشاء أول طلب لمناسبتك واحصل على عروض مميزة</p>
                    <Link
                        href="/dashboard/customer/new-request"
                        className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        {t.dashboard.newRequestNav}
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                                            {request.event_type === 'wedding' ? '💍' : '🎉'} {request.event_type}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                                            {getStatusLabel(request.status)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">
                                        📅 {new Date(request.event_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')} • 📍 {request.city}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {request.budget_range === 'premium' ? '$$$' : request.budget_range === 'high' ? '$$' : '$'}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {request.service_categories?.map((cat: string) => (
                                    <span key={cat} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm">
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                                <button className="text-[var(--primary)] font-bold text-sm hover:underline">
                                    التفاصيل والعروض &larr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
