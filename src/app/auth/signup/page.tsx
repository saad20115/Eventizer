"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<"customer" | "vendor">("customer");

    // Form Fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

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

            if (error) throw error;

            // Successful signup
            // If email confirmation is enabled, user might not be signed in yet.
            // But for now, let's assume they might be or show a message.
            if (data.user) {
                // Optionally redirect to a specific dashboard or a "check your email" page
                // For verified users (if disabled email confirm), push to dashboard
                router.push(role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
            } else {
                setError("يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--charcoal)] via-black to-[var(--charcoal)] p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--gold)]/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)]/20 blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-fadeInUp">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-3xl font-serif font-bold bg-gradient-to-r from-[var(--gold)] to-white bg-clip-text text-transparent mb-2">
                        Eventizer
                    </Link>
                    <h2 className="text-white text-xl font-medium">إنشاء حساب جديد</h2>
                </div>

                {/* Role Select */}
                <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setRole("customer")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "customer"
                                ? "bg-[var(--primary)] text-white shadow-lg"
                                : "text-white/60 hover:text-white"
                            }`}
                    >
                        🎉 عميل
                    </button>
                    <button
                        onClick={() => setRole("vendor")}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "vendor"
                                ? "bg-[var(--secondary)] text-white shadow-lg"
                                : "text-white/60 hover:text-white"
                            }`}
                    >
                        🏪 مقدم خدمة
                    </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-white/80 text-sm mb-1 px-1">الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold)] transition-colors"
                            placeholder="الاسم الثلاثي"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm mb-1 px-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold)] transition-colors"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm mb-1 px-1">رقم الجوال</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold)] transition-colors"
                            placeholder="050xxxxxxx"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm mb-1 px-1">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold)] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-[var(--gold)]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
                    </button>
                </form>

                <p className="text-center text-white/50 text-sm mt-6">
                    لديك حساب بالفعل؟{" "}
                    <Link href="/auth/login" className="text-[var(--gold)] hover:underline">
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
}
