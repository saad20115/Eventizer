"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
            } else {
                setUser(user);
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>;
    }

    const isVendor = pathname.includes('/vendor');

    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
                    } lg:static lg:block`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <Link href="/" className="text-2xl font-serif font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            Eventizer
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="text-xs font-bold text-gray-400 px-4 py-2 uppercase tracking-wider">
                            {isVendor ? "لوحة التاجر" : "لوحة العميل"}
                        </div>

                        <Link
                            href={isVendor ? "/dashboard/vendor" : "/dashboard/customer"}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === (isVendor ? "/dashboard/vendor" : "/dashboard/customer")
                                    ? "bg-[var(--primary)] text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <span>📊</span>
                            <span>الرئيسية</span>
                        </Link>

                        <Link
                            href={isVendor ? "/dashboard/vendor/requests" : "/dashboard/customer/bookings"}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname.includes("requests") || pathname.includes("bookings")
                                    ? "bg-[var(--primary)] text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <span>{isVendor ? "📨" : "📅"}</span>
                            <span>{isVendor ? "الطلبات الواردة" : "حجوزاتي"}</span>
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
                        >
                            <span>⚙️</span>
                            <span>الإعدادات</span>
                        </Link>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                                👤
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold truncate text-sm">{user.user_metadata?.full_name || "مستخدم"}</div>
                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                            <span>🚪</span>
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white shadow-sm lg:hidden h-16 flex items-center px-4 justify-between">
                    <span className="font-bold text-gray-800">Eventizer</span>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
                        ☰
                    </button>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
