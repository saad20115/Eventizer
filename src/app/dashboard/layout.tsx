"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { direction } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<'customer' | 'vendor' | 'admin'>('customer');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Fetch user role from profiles table
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const role = (profile?.role || 'customer') as 'customer' | 'vendor' | 'admin';

            setUser(user);
            setUserRole(role);
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex" dir={direction}>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 ${direction === 'rtl' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? "translate-x-0" : (direction === 'rtl' ? "translate-x-full" : "-translate-x-full")
                    } lg:static lg:block`}
            >
                <DashboardSidebar
                    role={userRole}
                    user={user}
                    onSignOut={handleSignOut}
                />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm lg:hidden h-16 flex items-center px-4 justify-between">
                    <span className="font-bold text-gray-800">Eventizer</span>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-100 text-2xl"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
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
