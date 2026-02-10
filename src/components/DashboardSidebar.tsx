"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import SidebarLink from "./dashboard/SidebarLink";
import UserProfile from "./dashboard/UserProfile";

interface DashboardSidebarProps {
    role: 'customer' | 'vendor' | 'admin';
    user: any;
    onSignOut: () => void;
}

export default function DashboardSidebar({ role, user, onSignOut }: DashboardSidebarProps) {
    const { t, direction } = useLanguage();

    // Theme Configuration
    const theme = {
        customer: {
            primary: '#8B5A3C',
            light: '#D4A574',
            bgIcon: 'bg-amber-50',
            border: 'border-amber-100'
        },
        vendor: {
            primary: '#C19A6B',
            light: '#E6D5B8',
            bgIcon: 'bg-yellow-50',
            border: 'border-yellow-100'
        },
        admin: {
            primary: '#4A5568',
            light: '#718096',
            bgIcon: 'bg-gray-50',
            border: 'border-gray-100'
        }
    };

    const currentTheme = theme[role];

    // Navigation Items Definition
    const getNavItems = () => {
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

    const getPanelTitle = () => {
        if (role === 'customer') return t.dashboard.customerPanel;
        if (role === 'vendor') return t.dashboard.vendorPanel;
        return t.dashboard.adminPanel;
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100" dir={direction}>
            {/* Header */}
            <div className={`p-6 border-b ${currentTheme.border}`}>
                <Link href="/" className="block text-2xl font-serif font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-1 transition-opacity hover:opacity-80">
                    Eventizer
                </Link>
                <div
                    className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded inline-block"
                    style={{ color: currentTheme.primary, backgroundColor: `${currentTheme.primary}15` }}
                >
                    {getPanelTitle()}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                    <SidebarLink
                        key={item.href}
                        {...item}
                        primaryColor={currentTheme.primary}
                        lightColor={currentTheme.light}
                    />
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-3">
                <UserProfile
                    user={user}
                    primaryColor={currentTheme.primary}
                    lightColor={currentTheme.light}
                />
            </div>
        </div>
    );
}
