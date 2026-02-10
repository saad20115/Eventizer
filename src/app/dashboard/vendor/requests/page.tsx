"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VendorRequestsPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cityFilter, setCityFilter] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Fetch ONLY open requests
                let query = supabase
                    .from('requests')
                    .select('*, profiles(full_name)')
                    .eq('status', 'open')
                    .order('created_at', { ascending: false });

                const { data, error } = await query;

                if (error) throw error;
                if (data) setRequests(data);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Enhance filtering logic
    const filteredRequests = requests.filter(req => {
        const matchesCity = cityFilter ? req.city === cityFilter : true;
        const matchesService = serviceFilter ? req.service_categories?.includes(serviceFilter) : true;
        return matchesCity && matchesService;
    });

    const categories = [
        { id: 'photography', label: 'تصوير / Photography', icon: '📸' },
        { id: 'catering', label: 'ضيافة / Catering', icon: '🍽️' },
        { id: 'venues', label: 'قاعات / Venues', icon: '🏰' },
        { id: 'flowers', label: 'زهور / Flowers', icon: '🌸' },
        { id: 'music', label: 'صوتيات / Music', icon: '🎵' },
        { id: 'beauty', label: 'تجميل / Beauty', icon: '💄' },
        { id: 'gifts', label: 'هدايا / Gifts', icon: '🎁' },
        { id: 'lighting', label: 'إضاءة / Lighting', icon: '💡' },
        { id: 'planning', label: 'تنظيم / Planning', icon: '📝' },
    ];

    const cities = ["Riyadh", "Jeddah", "Makkah", "Dammam", "Khobar", "Other"];

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.incomingRequests}</h1>
                <p className="text-gray-500">استعرض طلبات العملاء وقدم عروضك المميزة</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">تصفية حسب:</span>
                </div>

                <select
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    <option value="">جميع المدن / All Cities</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>

                <select
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                >
                    <option value="">جميع الخدمات / All Services</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>

                {(cityFilter || serviceFilter) && (
                    <button
                        onClick={() => { setCityFilter(''); setServiceFilter(''); }}
                        className="text-red-500 text-sm hover:underline px-2"
                    >
                        مسح التصفيات
                    </button>
                )}
            </div>

            {/* Requests Grid */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <span className="text-6xl block mb-4">📭</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات مطابقة</h3>
                    <p className="text-gray-500">حاول تغيير خيارات التصفية لرؤية المزيد من النتائج</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-gray-50 p-3 rounded-xl text-3xl">
                                    {request.event_type === 'wedding' ? '💍' :
                                        request.event_type === 'birthday' ? '🎂' :
                                            request.event_type === 'graduation' ? '🎓' : '🎉'}
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-bold text-gray-900 mb-1">
                                        {request.budget_range === 'premium' ? '$$$$' :
                                            request.budget_range === 'high' ? '$$$' :
                                                request.budget_range === 'medium' ? '$$' : '$'}
                                    </span>
                                    <span className="text-xs text-gray-400">الميزانية</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">
                                {request.event_type.charAt(0).toUpperCase() + request.event_type.slice(1)} Event
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <span>📅</span>
                                    <span>{new Date(request.event_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span>{request.city}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>👥</span>
                                    <span>{request.guest_count} ضيف</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {request.service_categories?.slice(0, 3).map((cat: string) => (
                                    <span key={cat} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs border border-blue-100">
                                        {cat}
                                    </span>
                                ))}
                                {(request.service_categories?.length || 0) > 3 && (
                                    <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded text-xs border border-gray-100">
                                        +{request.service_categories.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto border-t border-gray-50 pt-4">
                                <Link
                                    href={`/dashboard/vendor/requests/${request.id}`}
                                    className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-[var(--primary)] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    قدم عرض الآن ⚡
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
