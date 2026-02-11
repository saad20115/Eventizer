"use client";

import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/modules/shared/config/supabase";
import { useRouter } from "next/navigation";

interface UserProfileProps {
    user: any;
    primaryColor: string;
    lightColor: string;
}

export default function SidebarUserProfile({ user, primaryColor, lightColor }: UserProfileProps) {
    const { t } = useLanguage();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="mt-4 p-4 border-t border-gray-100 bg-gray-50/50 rounded-2xl mx-2">
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md transform hover:scale-105 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${lightColor})` }}
                >
                    {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="font-bold truncate text-gray-900 text-sm">
                        {user?.user_metadata?.full_name || t.dashboard.user}
                    </div>
                    <div className="text-xs text-gray-500 truncate font-mono opacity-75">
                        {user?.email}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-600 bg-white hover:bg-red-50 hover:border-red-200 text-sm font-bold transition-all duration-300 shadow-sm hover:shadow"
            >
                <span className="transform rotate-180">🚪</span>
                {t.dashboard.logout}
            </button>
        </div>
    );
}
