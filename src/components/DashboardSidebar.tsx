"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

// Navigation item type
interface NavItem {
    label: string;
    href: string;
    icon: string;
    active?: boolean;
}

interface DashboardSidebarProps {
    role: 'customer' | 'vendor' | 'admin';
    user: any;
    onSignOut: () => void;
}

export default function DashboardSidebar({ role, user, onSignOut }: DashboardSidebarProps) {
    const { t, language } = useLanguage();
    const pathname = usePathname();

    // Navigation items based on role
    const getNavItems = (): NavItem[] => {
        if (role === 'customer') {
            return [
                { label: t.dashboard.home, href: '/dashboard/customer', icon: '🏠' },
                { label: t.dashboard.newRequestNav, href: '/dashboard/customer/new-request', icon: '➕' },
                { label: t.dashboard.myRequests, href: '/dashboard/customer/requests', icon: '📋' },
                { label: t.dashboard.receivedOffers, href: '/dashboard/customer/offers', icon: '🏷️' },
                { label: t.dashboard.bookings, href: '/dashboard/customer/bookings', icon: '📅' },
                { label: t.dashboard.favorites, href: '/dashboard/customer/favorites', icon: '❤️' },
                { label: t.dashboard.messages, href: '/dashboard/customer/messages', icon: '💬' },
                { label: t.dashboard.settings, href: '/dashboard/settings', icon: '⚙️' },
            ];
        } else if (role === 'vendor') {
            return [
                { label: t.dashboard.home, href: '/dashboard/vendor', icon: '🏠' },
                { label: t.dashboard.incomingRequests, href: '/dashboard/vendor/requests', icon: '📨' },
                { label: t.dashboard.myOffers, href: '/dashboard/vendor/offers', icon: '📊' },
                { label: t.dashboard.bookings, href: '/dashboard/vendor/bookings', icon: '📅' },
                { label: t.dashboard.myServices, href: '/dashboard/vendor/services', icon: '🛍️' },
                { label: t.dashboard.gallery, href: '/dashboard/vendor/gallery', icon: '📸' },
                { label: t.dashboard.reports, href: '/dashboard/vendor/reports', icon: '📈' },
                { label: t.dashboard.finance, href: '/dashboard/vendor/finance', icon: '💰' },
                { label: t.dashboard.reviews, href: '/dashboard/vendor/reviews', icon: '⭐' },
                { label: t.dashboard.settings, href: '/dashboard/settings', icon: '⚙️' },
            ];
        } else { // admin
            return [
                { label: t.dashboard.overview, href: '/dashboard/admin', icon: '🏠' },
                { label: t.dashboard.users, href: '/dashboard/admin/users', icon: '👥' },
                { label: t.dashboard.vendors, href: '/dashboard/admin/vendors', icon: '🏪' },
                { label: t.dashboard.requests, href: '/dashboard/admin/requests', icon: '📋' },
                { label: t.dashboard.categories, href: '/dashboard/admin/categories', icon: '🏷️' },
                { label: t.dashboard.financeAdmin, href: '/dashboard/admin/finance', icon: '💰' },
                { label: t.dashboard.reportsAdmin, href: '/dashboard/admin/reports', icon: '📊' },
                { label: t.dashboard.security, href: '/dashboard/admin/security', icon: '🛡️' },
                { label: t.dashboard.notifications, href: '/dashboard/admin/notifications', icon: '🔔' },
                { label: t.dashboard.waitlist, href: '/dashboard/admin/waitlist', icon: '📧' },
                { label: t.dashboard.platformSettings, href: '/dashboard/admin/settings', icon: '⚙️' },
            ];
        }
    };

    const navItems = getNavItems();

    // Get panel title based on role
    const getPanelTitle = () => {
        if (role === 'customer') return t.dashboard.customerPanel;
        if (role === 'vendor') return t.dashboard.vendorPanel;
        return t.dashboard.adminPanel;
    };

    // Get theme color based on role
    const getThemeColor = () => {
        if (role === 'customer') return '#8B5A3C'; // Brown
        if (role === 'vendor') return '#C19A6B'; // Gold
        return '#4A5568'; // Dark Gray
    };

    const themeColor = getThemeColor();

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Logo & Title */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/" className="block text-2xl font-serif font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-2">
                    Eventizer
                </Link>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {getPanelTitle()}
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            style={isActive ? { backgroundColor: themeColor } : {}}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: themeColor }}
                    >
                        {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-bold truncate text-sm">
                            {user?.user_metadata?.full_name || t.dashboard.user}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                    <span>🚪</span>
                    {t.dashboard.logout}
                </button>
            </div>
        </div>
    );
}
