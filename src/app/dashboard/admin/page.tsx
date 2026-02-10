"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboard() {
    const { t } = useLanguage();

    return (
        <div>
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.adminWelcome}</h1>
                <p className="text-gray-500">{t.dashboard.adminWelcomeSub}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium text-sm">Total Users</span>
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">👥</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-xs text-gray-400 mt-1">Registered users</div>
                </div>

                {/* Active Vendors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium text-sm">Active Vendors</span>
                        <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">🏪</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-xs text-gray-400 mt-1">Verified vendors</div>
                </div>

                {/* Total Requests */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium text-sm">Total Requests</span>
                        <span className="bg-purple-100 text-purple-600 p-2 rounded-lg text-xl">📋</span>
                    </div>
                    <div className="text-3xl font-bold">0</div>
                    <div className="text-xs text-gray-400 mt-1">All time</div>
                </div>

                {/* Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 font-medium text-sm">Platform Revenue</span>
                        <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-xl">💰</span>
                    </div>
                    <div className="text-3xl font-bold">0.00 ر.س</div>
                    <div className="text-xs text-gray-400 mt-1">Total earnings</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Pending Vendor Approvals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Pending Vendor Approvals</h2>
                    </div>
                    <div className="p-8 text-center text-gray-500 py-12">
                        <span className="text-4xl block mb-2">✅</span>
                        No pending approvals
                    </div>
                </div>

                {/* Waitlist Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Waitlist Overview</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Total Registered</span>
                            <span className="font-bold text-gray-900">0</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Customers</span>
                            <span className="font-bold text-blue-600">0</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-600">Vendors</span>
                            <span className="font-bold text-green-600">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
