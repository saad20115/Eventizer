"use client";
import { useState, useEffect, useRef } from "react";

import { z } from "zod";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/modules/shared/config/supabase";
import Header from "@/components/layout/Header";
import LuxuryLogo from "@/components/ui/LuxuryLogo";
import ServicesMarquee from "@/components/sections/ServicesMarquee";

// ===== CUSTOM CURSOR COMPONENT =====
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';

        setTimeout(() => {
          if (cursorDotRef.current) {
            cursorDotRef.current.style.left = e.clientX + 'px';
            cursorDotRef.current.style.top = e.clientY + 'px';
          }
        }, 100);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-[var(--primary)] rounded-full pointer-events-none z-[9999] transition-transform duration-150 ease-out hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-[var(--primary)] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}

// ===== CLEAN BACKGROUND =====
function InteractiveGeometricBackground() {
  return null;
}

// Components extracted: LuxuryLogo, Header

// ===== HERO SECTION =====
function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[var(--cream)] via-white to-[var(--cream)]">
      {/* Interactive Background */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--rose), transparent 40%)`,
        }}
      />

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--primary)] opacity-20 blur-3xl"
          style={{
            top: '10%',
            right: '10%',
            transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] opacity-20 blur-3xl"
          style={{
            bottom: '10%',
            left: '5%',
            transform: `translate(${-mousePos.x * 0.01}px, ${-mousePos.y * 0.01}px)`,
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] opacity-15 blur-3xl"
          style={{
            top: '50%',
            left: '30%',
            transform: `translate(${mousePos.x * 0.015}px, ${mousePos.y * 0.015}px)`,
            animation: 'float 12s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`text-center ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-lg mb-8 animate-fadeInDown"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-[var(--muted)]">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1
              className="text-5xl md:text-7xl font-serif mb-6 animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="text-[var(--charcoal)]">{t.hero.titleStart}</span>
              <br />
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p
              className={`text-xl text-[var(--muted)] mb-10 max-w-lg mx-auto ${language === 'ar' ? 'lg:mx-0' : 'lg:mx-0'} animate-fadeInUp`}
              style={{ animationDelay: '0.4s' }}
            >
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${language === 'ar' ? 'lg:justify-start' : 'lg:justify-start'} animate-fadeInUp`}
              style={{ animationDelay: '0.5s' }}
            >
              <a
                href="#waitlist"
                className="btn-primary text-lg px-10 py-4"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-bounce">🎉</span>
                  {t.hero.ctaWaitlist}
                </span>
              </a>
              <a
                href="#how-it-works"
                className="btn-outline text-lg px-10 py-4"
              >
                {t.hero.ctaHowItWorks}
              </a>
            </div>

            {/* Quick Stats */}
            <div
              className={`flex flex-wrap items-center gap-4 sm:gap-8 mt-14 justify-center ${language === 'ar' ? 'lg:justify-start' : 'lg:justify-start'} animate-fadeInUp`}
              style={{ animationDelay: '0.6s' }}
            >
              {[
                { num: "50+", label: t.hero.statService },
                { num: "500+", label: t.hero.statVendor },
                { num: "100%", label: t.hero.statFree },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-3xl font-bold bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {stat.num}
                  </div>
                  <div className="text-sm text-[var(--muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Images */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Main Image */}
            <div
              className={`absolute top-0 ${language === 'ar' ? 'right-0' : 'left-0'} w-80 h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer`}
              style={{
                animation: 'float 6s ease-in-out infinite',
                transform: `translate(${-mousePos.x * 0.01}px, ${-mousePos.y * 0.01}px)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop"
                alt="Luxury Wedding"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Secondary Image */}
            <div
              className={`absolute bottom-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-72 h-80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer`}
              style={{
                animation: 'float 8s ease-in-out infinite',
                animationDelay: '1s',
                transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=450&fit=crop"
                alt="Event Setup"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer">
          <span className="text-xs">{t.hero.scrollDiscover}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ===== ABOUT US WITH ANIMATED CAROUSEL =====
function AboutSection() {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504437484202-61e00caee564?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517457373958-b7bdd458ad20?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=600&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="about" className="py-24 bg-[var(--cream)] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] animate-fadeInUp">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-[var(--gold)]/10 rounded-full blur-3xl" />
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Service ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImage ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Overlay Stat */}
              <div className="absolute bottom-6 right-6 text-white z-10 text-right">
                <div className="text-4xl font-bold mb-1">+10</div>
                <div className="text-sm opacity-90">سنوات من الخبرة والتميز</div>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <span className="text-[var(--gold)] font-medium mb-2 block">{t.about.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              {t.about.title}
            </h2>
            <div className="space-y-6">
              <p className="text-[var(--muted)] text-xl leading-relaxed">
                {t.about.description1}
              </p>
              <p className="text-[var(--muted)] text-xl leading-relaxed">
                {t.about.description2}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-10 p-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-white">
              {[
                { title: t.about.visionTitle, desc: t.about.visionDesc, icon: "🎯" },
                { title: t.about.missionTitle, desc: t.about.missionDesc, icon: "🤝" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-bold text-xl text-[var(--charcoal)]">{item.title}</h4>
                  <p className="text-[var(--muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FEATURES =====
function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="gold-text font-medium mb-2 block animate-fadeInUp">{t.features.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {t.features.title}
          </h2>
          <div className="gold-line mx-auto rounded-full animate-fadeInUp" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.items.map((feature: { title: string; description: string }, i) => (
            <div
              key={i}
              className="card cursor-pointer animate-fadeInUp group"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className={`icon-box mb-6 group-hover:scale-110 group-hover:rotate-6 ${i % 2 === 0 ? 'icon-box-primary' : 'icon-box-secondary'}`}>
                <span className="filter drop-shadow-lg">✦</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">{feature.title}</h3>
              <p className="text-[var(--muted)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== HOW IT WORKS =====
function HowItWorksSection() {
  const { t } = useLanguage();
  const steps = [
    { num: "01", ...t.howItWorks.steps[0], icon: "📝", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop" },
    { num: "02", ...t.howItWorks.steps[1], icon: "📨", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" },
    { num: "03", ...t.howItWorks.steps[2], icon: "✅", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[var(--cream)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[var(--gold)] font-medium mb-2 block">{t.howItWorks.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            {t.howItWorks.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="group relative animate-fadeInUp" style={{ animationDelay: `${0.2 * i}s` }}>
              <div className="relative h-56 rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-[var(--gold)]">
                <img src={step.image} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-[var(--gold)]/30">
                  {step.icon}
                </div>
                <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] rounded-full flex items-center justify-center text-[var(--charcoal)] font-bold shadow-lg">
                  {step.num}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">{step.title}</h3>
                <p className="text-[var(--muted)]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



// ===== WAITLIST =====
const waitlistSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  type: z.enum(["customer", "vendor"]),
});

function WaitlistSection() {
  const [formType, setFormType] = useState<"customer" | "vendor">("customer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot for spam protection
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam Check
    if (honeypot) {
      console.log("Spam detected!");
      return; // Silently fail for bots
    }

    setLoading(true);
    setError(null);

    try {
      // Validate Input (Schema messages are hardcoded, ideally schema should be dynamic too but we pass dynamic errors)
      const validationResult = waitlistSchema.safeParse({
        name,
        email,
        phone: phone || undefined, // Handle empty string as undefined for optional
        type: formType,
      });

      if (!validationResult.success) {
        // Map zod error paths to translated messages manually for MVP
        const firstError = validationResult.error.issues[0];
        if (firstError.path.includes("name")) throw new Error(t.waitlist.validationName);
        if (firstError.path.includes("email")) throw new Error(t.waitlist.validationEmail);
        throw new Error(firstError.message);
      }

      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([
          {
            name,
            email,
            phone,
            type: formType
          }
        ]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting to waitlist:', err);
      setError(err.message || t.waitlist.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[var(--primary)]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="text-[var(--rose)] font-medium mb-2 block">{t.waitlist.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">{t.waitlist.title}</h2>
            <p className="text-white/80 text-lg mb-8">
              {t.waitlist.description}
            </p>
            <div className="flex flex-wrap gap-6">
              {t.waitlist.benefits.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80">
                  <span className="w-6 h-6 bg-[var(--rose)] rounded-full flex items-center justify-center text-white text-sm animate-pulse">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-fadeInUp">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] flex items-center justify-center text-white text-4xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-bold mb-2">{t.waitlist.successTitle}</h3>
                <p className="text-[var(--muted)]">{t.waitlist.successDesc}</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 p-2 bg-[var(--cream)] rounded-2xl mb-6">
                  {[
                    { type: "customer", label: t.waitlist.customer, color: "primary" },
                    { type: "vendor", label: t.waitlist.vendor, color: "secondary" },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${formType === btn.type
                        ? `bg-[var(--${btn.color})] text-white shadow-lg scale-105`
                        : "text-[var(--muted)] hover:bg-white"
                        }`}
                      onClick={() => setFormType(btn.type as "customer" | "vendor")}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot Field (Hidden) */}
                  <input
                    type="text"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {[
                    { type: "text", placeholder: t.waitlist.namePlaceholder, value: name, setter: setName, required: true },
                    { type: "email", placeholder: t.waitlist.emailPlaceholder, value: email, setter: setEmail, required: true },
                    { type: "tel", placeholder: t.waitlist.phonePlaceholder, value: phone, setter: setPhone, required: false },
                  ].map((input, i) => (
                    <input
                      key={i}
                      type={input.type}
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={(e) => input.setter(e.target.value)}
                      required={input.required}
                      className="w-full px-6 py-4 rounded-xl bg-[var(--cream)] text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 hover:shadow-md"
                    />
                  ))}

                  {error && (
                    <div className="text-red-500 text-sm text-center font-bold">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${formType === "customer" ? "btn-primary" : "btn-secondary"} w-full justify-center text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>{t.waitlist.submit}</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  const { t } = useLanguage();
  return (
    <footer id="contact" className="bg-white py-16 border-t border-[var(--gold)]/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-6">
              <LuxuryLogo />
            </div>
            <p className="text-[var(--muted)] mb-6 max-w-md">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              {["𝕏", "📷", "💬"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center hover:bg-[var(--gold)] hover:text-white hover:scale-110 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-[var(--muted)]">
              {[t.nav.features, t.nav.howItWorks, t.nav.services, t.waitlist.badge].map((link, i) => (
                <li key={i}>
                  <a href={`#${["features", "how-it-works", "categories", "waitlist"][i]}`} className="hover:text-[var(--gold)] hover:pr-2 transition-all duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent">{t.footer.contact}</h4>
            <ul className="space-y-3 text-[var(--muted)]">
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📧 info@eventizer.sa</li>
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📱 +966 50 000 0000</li>
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📍 {t.footer.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-[var(--muted)] text-sm">
          <p>&copy; {new Date().getFullYear()} Eventizer. {t.footer.rights}.</p>
          <p className="mt-2">{t.footer.madeWithLove}</p>
        </div>
      </div>
    </footer>
  );
}

// ===== FLOATING BUTTONS (WHATSAPP + SCROLL TO TOP) =====
function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll to Top Button - Same side as scrolling usually, or flip? Keeping left for now as WhatsApp is right */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5C] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* WhatsApp Button - Right Side */}
      <a
        href="https://wa.me/966500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5C] transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}

// ===== MAIN =====
export default function Home() {
  return (
    <>
      <CustomCursor />
      <InteractiveGeometricBackground />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ServicesMarquee />
        <WaitlistSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
