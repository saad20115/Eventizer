"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    // Default to 'customer' if no role specified or invalid
    const [role, setRole] = useState<"customer" | "vendor">("customer");

    useEffect(() => {
        if (roleParam === 'provider' || roleParam === 'vendor') setRole('vendor');
        else setRole('customer');
    }, [roleParam]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    // Theme logic for Signup (simpler version)
    const isVendor = role === 'vendor';
    const themeColor = isVendor ? "var(--secondary)" : "var(--primary)";
    const themeGradient = isVendor ? "from-[#6B7B5E] to-[#2C3E50]" : "from-[#722F37] to-[#D4AF37]";

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        phone: phone,
                        role: role,
                    },
                },
            });

            if (data.user) {
                router.push(role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
            }
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`} style={{ backgroundColor: '#FDFBF7' }}>
            {/* Background Ambience (Light) */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-gradient-to-br ${themeGradient} opacity-10`} />
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-gradient-to-tl ${themeGradient} opacity-10`} />
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 font-medium transition-colors z-20 hover:opacity-80"
                style={{ color: themeColor }}
            >
                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                الرئيسية
            </Link>

            <div className={`w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl relative z-10 animate-fadeInUp ${isVendor ? 'border-t-4 border-t-[var(--secondary)]' : 'border-t-4 border-t-[var(--primary)]'}`}>
                <div className="text-center mb-6">
                    <Link href="/" className={`inline-block text-3xl font-serif font-bold bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent mb-2`}>
                        Eventizer
                    </Link>
                    <h2 className="text-[var(--charcoal)] text-xl font-bold">إنشاء حساب جديد</h2>
                </div>

                {/* Role Select */}
                <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => { setRole("customer"); router.push('?role=customer'); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isVendor
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-500 hover:bg-white hover:shadow-sm"
                            }`}
                    >
                        🎉 عميل
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole("vendor"); router.push('?role=provider'); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isVendor
                            ? "bg-[var(--secondary)] text-white shadow-md"
                            : "text-gray-500 hover:bg-white hover:shadow-sm"
                            }`}
                    >
                        🏪 مقدم خدمة
                    </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 px-1">الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${isVendor ? 'focus:ring-[var(--secondary)] focus:border-[var(--secondary)]' : 'focus:ring-[var(--primary)] focus:border-[var(--primary)]'}`}
                            placeholder="الاسم الثلاثي"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 px-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${isVendor ? 'focus:ring-[var(--secondary)] focus:border-[var(--secondary)]' : 'focus:ring-[var(--primary)] focus:border-[var(--primary)]'}`}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 px-1">رقم الجوال</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${isVendor ? 'focus:ring-[var(--secondary)] focus:border-[var(--secondary)]' : 'focus:ring-[var(--primary)] focus:border-[var(--primary)]'}`}
                            placeholder="050xxxxxxx"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1 px-1">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${isVendor ? 'focus:ring-[var(--secondary)] focus:border-[var(--secondary)]' : 'focus:ring-[var(--primary)] focus:border-[var(--primary)]'}`}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${isVendor ? 'bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-dark)] shadow-[var(--secondary)]/20' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] shadow-[var(--primary)]/20'}`}
                    >
                        {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    لديك حساب بالفعل؟{" "}
                    <Link href={`/auth/login?role=${isVendor ? 'provider' : 'customer'}`} className={`font-semibold hover:underline ${isVendor ? 'text-[var(--secondary)]' : 'text-[var(--primary)]'}`}>
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">جاري التحميل...</div>}>
            <SignupContent />
        </Suspense>
    );
}
