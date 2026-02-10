"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
    href: string;
    icon: string;
    label: string;
    primaryColor: string;
    lightColor: string;
    badge?: number | string;
}

export default function SidebarLink({ href, icon, label, primaryColor, lightColor, badge }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + '/');

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group mb-1 ${isActive ? 'shadow-md transform scale-[1.02]' : 'hover:bg-gray-50'
                }`}
            style={{
                backgroundColor: isActive ? primaryColor : 'transparent',
                color: isActive ? '#ffffff' : '#4A5568',
            }}
        >
            <span
                className={`text-xl flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
            >
                {icon}
            </span>
            <span className={`font-medium ${isActive ? 'font-bold' : ''}`}>
                {label}
            </span>
            {badge && (
                <span className="mr-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    {badge}
                </span>
            )}
            {isActive && !badge && (
                <span className="mr-auto w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            )}
        </Link>
    );
}
