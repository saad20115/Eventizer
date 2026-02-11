"use client";
import React from 'react';
import { useMyRequests } from "@/hooks/useMarket";
import RequestCard from "@/components/market/RequestCard";
import Link from 'next/link';

export default function CustomerDashboard() {
    const { requests, loading } = useMyRequests();

    // Stats
    const totalRequests = requests.length;
    const activeRequests = requests.filter(r => r.status === 'open').length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم العميل</h1>
                <p className="text-gray-500">تابع طلباتك والعروض المقدمة لك</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">إجمالي الطلبات</span>
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">📝</span>
                    </div>
                    <div className="text-3xl font-bold">{totalRequests}</div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">قيد التنفيذ (مفتوح)</span>
                        <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-xl">⏳</span>
                    </div>
                    <div className="text-3xl font-bold">{activeRequests}</div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium">مكتملة</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold">{completedRequests}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link href="/market" className="flex items-center gap-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">➕</span>
                    <div className="text-right">
                        <div className="font-bold text-lg">طلب جديد</div>
                        <div className="text-white/80 text-sm">أضف مناسبة جديدة للسوق</div>
                    </div>
                </Link>

                <Link href="/market" className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[var(--primary)] transition-all group">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🔍</span>
                    <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">تصفح السوق</div>
                        <div className="text-gray-500 text-sm">اطلع على العروض الأخرى والأسعار</div>
                    </div>
                </Link>
            </div>

            {/* My Requests */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">طلباتي السابقة</h2>
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 text-center text-gray-500 py-12">
                        <span className="text-4xl block mb-2">📭</span>
                        ليس لديك أي طلبات سابقة.
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {requests.map((req) => (
                        <RequestCard key={req.id} request={req} />
                    ))}
                </div>
            )}
        </div>
    );
}
