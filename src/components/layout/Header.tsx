"use client";
import { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";
import LuxuryLogo from "@/components/ui/LuxuryLogo";

// ===== HEADER =====
export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, language, toggleLanguage } = useLanguage();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = useMemo(() => [
        { label: t.nav.home, href: "/#home" },
        { label: "سوق المناسبات", href: "/market" }, // New Market Link - TODO: Translate
        { label: t.nav.features, href: "/#features" },
        { label: t.nav.services, href: "/#categories" },
        { label: t.nav.howItWorks, href: "/#how-it-works" },
        { label: t.nav.about, href: "/#about" },
        { label: t.nav.surveys, href: "/surveys" },
        { label: t.nav.contact, href: "/#contact" },
    ], [t]);

    // Debug logging
    useEffect(() => {
        console.log('navLinks:', navLinks);
        console.log('mobileMenuOpen:', mobileMenuOpen);
    }, [mobileMenuOpen, navLinks]);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <header className={`header ${scrolled ? "header-solid" : "header-transparent"} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between py-4">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 w-48">
                        <Link
                            href="/"
                            onClick={scrollToTop}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            <LuxuryLogo />
                        </Link>
                    </div>

                    {/* Desktop Nav - Centered */}
                    <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8">
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="relative font-medium transition-all duration-300 py-2 text-[var(--charcoal)] hover:text-[var(--primary)] text-sm lg:text-base whitespace-nowrap"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Actions Section (Login + Language) */}
                    <div className="hidden md:flex items-center justify-end w-48 gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            <span>{language === 'ar' ? 'En' : 'ع'}</span>
                        </button>
                        <div className="relative group z-50">
                            <button className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                <span>{t.nav.login}</span>
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className={`absolute top-full ${language === 'ar' ? 'left-0' : 'right-0'} pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2`}>
                                <div className="bg-white rounded-2xl shadow-2xl border border-[var(--gold)]/20 overflow-hidden p-1">
                                    <Link href="/auth/login?role=customer" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--charcoal)] hover:bg-[var(--cream)] hover:text-[var(--primary)] rounded-xl transition-colors">
                                        <span className="text-xl">🎉</span>
                                        <span className="font-medium">{language === 'ar' ? 'دخول العملاء' : 'Customer Login'}</span>
                                    </Link>
                                    <Link href="/auth/login?role=provider" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--charcoal)] hover:bg-[var(--cream)] hover:text-[var(--primary)] rounded-xl transition-colors">
                                        <span className="text-xl">🏪</span>
                                        <span className="font-medium">{language === 'ar' ? 'مقدمي الخدمة' : 'Service Provider'}</span>
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <Link href="/auth/login?role=admin" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--charcoal)] hover:bg-[var(--cream)] hover:text-[var(--primary)] rounded-xl transition-colors">
                                        <span className="text-xl">🛡️</span>
                                        <span className="font-medium">{language === 'ar' ? 'مدير النظام' : 'System Admin'}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-[var(--charcoal)]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setMobileMenuOpen(false)} />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-screen w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : (language === 'ar' ? "translate-x-full" : "-translate-x-full")}`}
                style={{ maxWidth: '85vw' }}
            >
                <div className="h-full flex flex-col bg-white">
                    {/* Header with Logo */}
                    <div className="flex justify-between items-center p-4 border-b-2 border-gray-200 bg-gray-50">
                        <div className="text-xl font-bold text-[var(--primary)]">Eventizer</div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Section - Scrollable */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {/* Main Navigation Links */}
                        <div className="px-4 py-6">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">القائمة الرئيسية</div>
                            {navLinks && navLinks.length > 0 ? (
                                navLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-3 px-4 mb-2 text-base font-semibold text-gray-800 bg-gray-50 hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all duration-200"
                                    >
                                        {link.label || `Link ${i + 1}`}
                                    </a>
                                ))
                            ) : (
                                <div className="text-red-500 p-4">No nav links available</div>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <div className="px-4 py-4 border-t-2 border-gray-200">
                            <button
                                onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
                                className="w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-base font-semibold text-gray-800 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <span>{language === 'ar' ? 'English 🇬🇧' : 'العربية 🇸🇦'}</span>
                            </button>
                        </div>

                        {/* Login Section */}
                        <div className="px-4 py-4 border-t-2 border-gray-200 bg-gray-50">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">{t.nav.login}</div>
                            <Link
                                href="/auth/login?role=customer"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 mb-2 text-base font-semibold text-gray-800 bg-white hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all border-2 border-gray-200"
                            >
                                <span className="text-xl">🎉</span>
                                <span>{language === 'ar' ? 'دخول العملاء' : 'Customer Login'}</span>
                            </Link>
                            <Link
                                href="/auth/login?role=provider"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 mb-2 text-base font-semibold text-gray-800 bg-white hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all border-2 border-gray-200"
                            >
                                <span className="text-xl">🏪</span>
                                <span>{language === 'ar' ? 'مقدمي الخدمة' : 'Service Provider'}</span>
                            </Link>
                            <Link
                                href="/auth/login?role=admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-4 text-base font-semibold text-gray-800 bg-white hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all border-2 border-gray-200"
                            >
                                <span className="text-xl">🛡️</span>
                                <span>{language === 'ar' ? 'مدير النظام' : 'System Admin'}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
