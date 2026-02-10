"use client";
// Deployment Sync Trace: v1.0.1


import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { z } from "zod";

// Validation Schema
const waitlistSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  type: z.enum(["customer", "vendor"]),
});

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





// ===== LUXURY ANIMATED LOGO =====
function LuxuryLogo() {
  const [theme, setTheme] = useState<'gold' | 'silver'>('gold');

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(prev => prev === 'gold' ? 'silver' : 'gold');
    }, 7000); // Slower alternation (7s)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <span
        className="text-3xl font-serif tracking-wider font-bold transition-all duration-[2000ms]"
        style={{
          backgroundImage: theme === 'gold'
            // Black Base with Gold Shine
            ? 'linear-gradient(135deg, #000000 40%, #D4AF37 50%, #000000 60%)'
            // Black Base with White Shine
            : 'linear-gradient(135deg, #000000 40%, #FFFFFF 50%, #000000 60%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 4s infinite linear',
          filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.8))'
        }}
      >
        𝔈ventizer
      </span>
      {/* Decorative Underline matching shine */}
      <div
        className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-[2000ms] ${theme === 'gold' ? 'w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent' : 'w-full bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent'
          }`}
      />
    </div>
  );
}

// ===== HEADER =====
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "الرئيسية", href: "#", active: true },
    { label: "المميزات", href: "#features" },
    { label: "كيف يعمل", href: "#how-it-works" },
    {
      label: "تسجيل الدخول",
      href: "#",
      children: [
        { label: "حساب العميل", href: "/auth/login?role=customer" },
        { label: "حساب مقدم الخدمة", href: "/auth/login?role=provider" },
        { label: "حساب مدير النظام", href: "/auth/login?role=admin" },
      ]
    },
  ];

  return (
    <header className={`header ${scrolled ? "header-solid" : "header-transparent"}`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <LuxuryLogo />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <div
                key={i}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(i)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className={`relative font-medium transition-all duration-300 py-2 flex items-center gap-1 ${link.active ? "text-[var(--primary)]" : "text-[var(--charcoal)] hover:text-[var(--primary)]"
                    }`}
                >
                  {link.label}
                  {link.children && (
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-all duration-300 ${link.active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>

                {/* Dropdown Menu */}
                {link.children && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-[var(--gold)]/20 overflow-hidden">
                      {link.children.map((subLink, j) => (
                        <a
                          key={j}
                          href={subLink.href}
                          className="block px-4 py-3 text-sm text-[var(--charcoal)] hover:bg-[var(--cream)] hover:text-[var(--primary)] transition-colors text-right border-b border-gray-50 last:border-0"
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <a href="/auth/signup" className="btn-primary group">
              <span className="relative z-10">ابدأ الآن</span>
              <div className="absolute inset-0 bg-[var(--primary-dark)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-[var(--charcoal)] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-4 shadow-xl">
            {navLinks.map((link, i) => (
              <div key={i}>
                {!link.children ? (
                  <a
                    href={link.href}
                    className="block py-3 text-[var(--charcoal)] font-medium hover:text-[var(--primary)] hover:pr-4 transition-all duration-300 border-b border-gray-100 last:border-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <div className="py-2 border-b border-gray-100 last:border-0">
                    <div className="text-[var(--charcoal)] font-medium mb-2 pr-2">{link.label}</div>
                    <div className="pr-4 space-y-2 border-r-2 border-[var(--gold)]/20 mr-2 bg-gray-50/50 rounded-lg p-2">
                      {link.children.map((subLink, j) => (
                        <a
                          key={j}
                          href={subLink.href}
                          className="block py-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/auth/signup" className="block w-full text-center mt-4 btn-primary" onClick={() => setMobileMenuOpen(false)}>
              ابدأ الآن
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ===== HERO SECTION =====
function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[var(--cream)] via-white to-[var(--cream)]">
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
          <div className="text-center lg:text-right">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-lg mb-8 animate-fadeInDown"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-[var(--muted)]">قريباً في المملكة العربية السعودية</span>
            </div>

            {/* Title */}
            <h1
              className="text-5xl md:text-7xl font-serif mb-6 animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="text-[var(--charcoal)]">اجعل مناسبتك</span>
              <br />
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]">
                لا تُنسى
              </span>
            </h1>

            <p
              className="text-xl text-[var(--muted)] mb-10 max-w-lg mx-auto lg:mx-0 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              منصة Eventizer تربطك بأفضل مقدمي خدمات المناسبات. احصل على عروض أسعار تنافسية واختر الأنسب لمناسبتك.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp"
              style={{ animationDelay: '0.5s' }}
            >
              <a
                href="#waitlist"
                className="btn-primary text-lg px-10 py-4"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-bounce">🎉</span>
                  انضم لقائمة الانتظار
                </span>
              </a>
              <a
                href="#how-it-works"
                className="btn-outline text-lg px-10 py-4"
              >
                كيف يعمل؟
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-8 mt-14 justify-center lg:justify-start animate-fadeInUp"
              style={{ animationDelay: '0.6s' }}
            >
              {[
                { num: "50+", label: "فئة خدمة" },
                { num: "500+", label: "مورد معتمد" },
                { num: "100%", label: "مجاني" },
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
              className="absolute top-0 right-0 w-80 h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{
                animation: 'float 6s ease-in-out infinite',
                transform: `translate(${-mousePos.x * 0.01}px, ${-mousePos.y * 0.01}px)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop"
                alt="حفل زفاف فاخر"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Secondary Image */}
            <div
              className="absolute bottom-0 left-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{
                animation: 'float 8s ease-in-out infinite',
                animationDelay: '1s',
                transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=450&fit=crop"
                alt="تجهيزات مناسبة"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div
              className="absolute top-1/3 left-10 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer"
              style={{
                animation: 'float 5s ease-in-out infinite',
                animationDelay: '0.5s',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] rounded-full flex items-center justify-center text-white text-xl animate-pulse">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[var(--charcoal)]">تم اختيار العرض</div>
                  <div className="text-sm text-[var(--muted)]">3 عروض مستلمة</div>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-1/3 right-10 bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer"
              style={{
                animation: 'float 7s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">⭐</div>
                <div>
                  <div className="font-bold text-[var(--charcoal)]">تقييم 4.9</div>
                  <div className="text-sm text-[var(--muted)]">+200 تقييم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer">
          <span className="text-xs">اكتشف المزيد</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ===== FEATURES =====
function FeaturesSection() {
  const features = [
    { icon: "📋", title: "طلب عروض أسعار", description: "أنشئ طلبك بسهولة واحصل على عروض متعددة من أفضل الموردين", color: "primary" },
    { icon: "💰", title: "مقارنة شفافة", description: "قارن بين العروض والأسعار واختر الأنسب لميزانيتك", color: "secondary" },
    { icon: "⭐", title: "موردون موثوقون", description: "جميع مقدمي الخدمات موثقون ومعتمدون لضمان الجودة", color: "primary" },
    { icon: "💬", title: "تواصل مباشر", description: "تواصل مع الموردين مباشرة عبر المنصة أو واتساب", color: "secondary" },
    { icon: "🔒", title: "آمن وموثوق", description: "حماية بياناتك وخصوصيتك هي أولويتنا القصوى", color: "primary" },
    { icon: "⚡", title: "سريع وسهل", description: "واجهة بسيطة وسريعة تجعل التخطيط لمناسبتك متعة", color: "secondary" },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="gold-text font-medium mb-2 block animate-fadeInUp">✦ المميزات ✦</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            لماذا <span className="text-gradient">Eventizer</span>؟
          </h2>
          <div className="gold-line mx-auto rounded-full animate-fadeInUp" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="card cursor-pointer animate-fadeInUp group"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className={`icon-box mb-6 group-hover:scale-110 group-hover:rotate-6 ${feature.color === 'primary' ? 'icon-box-primary' : 'icon-box-secondary'}`}>
                <span className="filter drop-shadow-lg">{feature.icon}</span>
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
  const steps = [
    { num: "01", title: "أنشئ طلبك", description: "حدد نوع المناسبة والخدمات والتاريخ", icon: "📝", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop" },
    { num: "02", title: "استقبل العروض", description: "يتواصل معك الموردون بعروض تنافسية", icon: "📨", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" },
    { num: "03", title: "قارن واختر", description: "راجع العروض واختر الأنسب لمناسبتك", icon: "✅", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[var(--cream)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[var(--gold)] font-medium mb-2 block">✦ الخطوات ✦</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            كيف <span className="bg-gradient-to-r from-[var(--gold)] via-[var(--primary)] to-[var(--gold)] bg-clip-text text-transparent">يعمل؟</span>
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

// ===== CATEGORIES =====
function CategoriesSection() {
  const categories = [
    { name: "التصوير", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=600&fit=crop" },
    { name: "الضيافة", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop" },
    { name: "القاعات", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=600&fit=crop" },
    { name: "الزهور", image: "/images/fnp-bouquet-50.jpg" },
    { name: "الموسيقى", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=600&fit=crop" },
    { name: "الحلويات", image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&h=600&fit=crop" },
    { name: "الكوش", image: "/images/kosha-hia-2020.jpg" },
    { name: "الهدايا", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop" },
  ];

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[var(--primary)] font-medium mb-2 block">الفئات</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            استكشف <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">خدماتنا</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-white">
                  <span className="font-bold text-xl">{cat.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#waitlist" className="inline-flex items-center gap-2 bg-[var(--secondary)] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span>+50 فئة إضافية</span>
            <span className="group-hover:translate-x-1 transition-transform">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== WAITLIST =====
import { supabase } from "@/lib/supabase";

function WaitlistSection() {
  const [formType, setFormType] = useState<"customer" | "vendor">("customer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot for spam protection
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Validate Input
      const validationResult = waitlistSchema.safeParse({
        name,
        email,
        phone: phone || undefined, // Handle empty string as undefined for optional
        type: formType,
      });

      if (!validationResult.success) {
        throw new Error(validationResult.error.issues[0].message);
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
      setError(err.message || "عذراً، حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
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
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="text-[var(--rose)] font-medium mb-2 block">انضم إلينا</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">كن من الأوائل</h2>
            <p className="text-white/80 text-lg mb-8">
              سجل الآن في قائمة الانتظار واحصل على وصول مبكر ومزايا حصرية
            </p>
            <div className="flex flex-wrap gap-6">
              {["دعوة حصرية", "خصومات خاصة", "أولوية التسجيل"].map((item, i) => (
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
                <h3 className="text-2xl font-bold mb-2">شكراً لانضمامك!</h3>
                <p className="text-[var(--muted)]">سنتواصل معك قريباً</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 p-2 bg-[var(--cream)] rounded-2xl mb-6">
                  {[
                    { type: "customer", label: "🎉 عميل", color: "primary" },
                    { type: "vendor", label: "🏪 مقدم خدمة", color: "secondary" },
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
                    { type: "text", placeholder: "الاسم الكامل", value: name, setter: setName, required: true },
                    { type: "email", placeholder: "البريد الإلكتروني", value: email, setter: setEmail, required: true },
                    { type: "tel", placeholder: "رقم الجوال", value: phone, setter: setPhone, required: false },
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
                      <>🚀 سجلني الآن</>
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
  return (
    <footer className="bg-white py-16 border-t border-[var(--gold)]/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-6">
              <LuxuryLogo />
            </div>
            <p className="text-[var(--muted)] mb-6 max-w-md">
              منصة تربط أصحاب المناسبات بأفضل مقدمي الخدمات
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
            <h4 className="font-bold mb-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent">روابط سريعة</h4>
            <ul className="space-y-3 text-[var(--muted)]">
              {["المميزات", "كيف يعمل", "الخدمات", "انضم إلينا"].map((link, i) => (
                <li key={i}>
                  <a href={`#${["features", "how-it-works", "categories", "waitlist"][i]}`} className="hover:text-[var(--gold)] hover:pr-2 transition-all duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent">تواصل معنا</h4>
            <ul className="space-y-3 text-[var(--muted)]">
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📧 info@eventizer.sa</li>
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📱 +966 50 000 0000</li>
              <li className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">📍 مكة المكرمة - السعودية</li>
              <li className="flex items-center gap-2 mt-4 text-[var(--gold)] font-medium text-sm">❤️ صنع بحب في المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent my-8" />

        <div className="text-center text-[var(--muted)] text-sm">
          © 2026 <span className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] bg-clip-text text-transparent font-semibold">Eventizer</span>. جميع الحقوق محفوظة.
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
      {/* Scroll to Top Button - Left Side */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5C] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
          aria-label="العودة للأعلى"
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
        aria-label="تواصل عبر واتساب"
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
        <FeaturesSection />
        <HowItWorksSection />
        <CategoriesSection />
        <WaitlistSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
