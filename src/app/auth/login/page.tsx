"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');
    const { t, language } = useLanguage();

    // Default to 'customer' if no role specified or invalid
    const [currentRole, setCurrentRole] = useState<'customer' | 'provider' | 'admin'>('customer');

    useEffect(() => {
        if (roleParam === 'provider') setCurrentRole('provider');
        else if (roleParam === 'admin') setCurrentRole('admin');
        else setCurrentRole('customer');
    }, [roleParam]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Theme Config based on Role
    const themes = {
        customer: {
            title: t.auth.customerTitle,
            gradient: "from-[#722F37] to-[#D4AF37]", // Burgundy to Gold
            buttonBg: "bg-[#722F37] hover:bg-[#59242b]",
            accent: "text-[#722F37]",
            bgOverlay: "bg-[#722F37]/5",
            icon: "🎉"
        },
        provider: {
            title: t.auth.providerTitle,
            gradient: "from-[#6B7B5E] to-[#2C3E50]", // Sage to Navy
            buttonBg: "bg-[#6B7B5E] hover:bg-[#55634a]",
            accent: "text-[#6B7B5E]",
            bgOverlay: "bg-[#6B7B5E]/5",
            icon: "🏪"
        },
        admin: {
            title: t.auth.adminTitle,
            gradient: "from-[#1a1a1a] to-[#4a4a4a]", // Dark Grayscale
            buttonBg: "bg-[#1a1a1a] hover:bg-[#333]",
            accent: "text-[#1a1a1a]",
            bgOverlay: "bg-gray-100",
            icon: "🛡️"
        }
    };

    const theme = themes[currentRole];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (data.user) {
                // Verify user role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                const userRole = profile?.role || 'customer';

                // Optional: Enforce role matching
                // if (userRole !== currentRole) throw new Error("Unauthorized access for this role");

                router.push(userRole === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
            }
            if (error) throw error;

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${currentRole === 'admin' ? 'bg-gray-50' : 'bg-[#FDFBF7]'}`}>

            {/* Dynamic Background Ambience */}
            <div className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-1000">
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-gradient-to-br ${theme.gradient} opacity-20`} />
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-gradient-to-tl ${theme.gradient} opacity-20`} />
            </div>

            {/* Back to Home */}
            <Link
                href="/"
                className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} flex items-center gap-2 font-medium transition-colors z-20 ${theme.accent} hover:opacity-80`}
            >
                <svg className={`w-5 h-5 ${language === 'ar' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t.auth.backToHome}
            </Link>

            <div className={`w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl relative z-10 animate-fadeInUp ${currentRole === 'admin' ? 'border-t-4 border-t-[#1a1a1a]' : ''}`}>
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4 animate-bounce-slow">{theme.icon}</div>
                    <Link href="/" className={`inline-block text-3xl font-serif font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-2`}>
                        Eventizer
                    </Link>
                    <h2 className={`text-xl font-bold ${theme.accent} mt-2`}>{theme.title}</h2>
                </div>



                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 px-1 ${theme.accent}`}>{t.auth.emailLabel}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all focus:border-transparent ${currentRole === 'provider' ? 'focus:ring-[#6B7B5E]' : currentRole === 'admin' ? 'focus:ring-gray-800' : 'focus:ring-[#722F37]'}`}
                            placeholder={t.auth.emailPlaceholder}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 px-1 ${theme.accent}`}>{t.auth.passwordLabel}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all focus:border-transparent ${currentRole === 'provider' ? 'focus:ring-[#6B7B5E]' : currentRole === 'admin' ? 'focus:ring-gray-800' : 'focus:ring-[#722F37]'}`}
                            placeholder={t.auth.passwordPlaceholder}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 py-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${theme.buttonBg}`}
                    >
                        {loading ? t.auth.loadingLogin : t.auth.loginButton}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-8">
                    {t.auth.noAccount}{" "}
                    <Link href={`/auth/signup?role=${currentRole === 'provider' ? 'provider' : 'customer'}`} className={`font-semibold hover:underline ${theme.accent}`}>
                        {t.auth.signupTitle}
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
