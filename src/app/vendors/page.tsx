"use client";

import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Link from 'next/link';
import { MoveRight, MoveLeft } from "lucide-react";
// Using plain img tags for external images

export default function VendorsPage() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const ArrowIcon = language === "ar" ? MoveLeft : MoveRight;

  const icons = [
    "🎯", // 1. Reach More Customers
    "📈", // 2. Increase Bookings
    "📅", // 3. Manage Appointments
    "💳", // 4. Accept Payments
    "⭐", // 5. Build Reputation
    "📦", // 6. Display Services
    "💬", // 7. Quick Communication
    "📊", // 8. Performance Reports
    "📢", // 9. Free Marketing
    "👥", // 10. Team Management
  ];

  const featureImages = [
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop", // Reach more customers (fixed ID)
    "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=600&fit=crop", // Increase bookings (Fixed)
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop", // Manage appointments
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop", // Accept payments
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop", // Build reputation
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", // Display services
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop", // Quick communication
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", // Reports
    "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=600&fit=crop", // Free marketing
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", // Team management
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <span className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-sm border border-[#e5e5e5] mb-8 animate-fadeInDown">
              <span className="text-sm font-bold text-[#b88c42]">{t.vendorPage.hero.badge}</span>
           </span>
           <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#2c2b29] leading-[1.2] animate-fadeInUp">
             {t.vendorPage.hero.titleStart} <span className="text-[#b88c42]">{t.vendorPage.hero.titleHighlight}</span>
           </h1>
           <p className="text-xl text-[#6b6965] mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
             {t.vendorPage.hero.description}
           </p>
           <Link href="/#waitlist" className="inline-flex items-center justify-center gap-3 bg-[#683341] text-white font-bold text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
             {t.vendorPage.hero.cta}
             <ArrowIcon className="w-5 h-5" />
           </Link>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 mt-24">
          <div className="bg-white rounded-[40px] p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-[#f5f5f5] max-w-5xl mx-auto flex flex-col md:flex-row justify-around items-center gap-10">
            {t.vendorPage.stats.map((stat: { value: string, label: string }, idx: number) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-black text-[#683341] mb-2">{stat.value}</div>
                <div className="text-[#8c8a85] font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Features List */}
        <div className="container mx-auto px-4 mt-32 max-w-6xl">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2c2b29] leading-tight">
                {t.vendorPage.featuresTitle}
              </h2>
              <p className="text-lg text-[#6b6965] max-w-2xl mx-auto">
                {t.vendorPage.featuresDesc}
              </p>
           </div>
           
           <div className="space-y-24">
              {t.vendorFeatures.items.map((feature: { title: string, description: string }, idx: number) => (
               <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
                 <div className="md:w-1/2 w-full">
                    <div className="bg-white w-full aspect-[4/3] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-center relative overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={featureImages[idx % featureImages.length]} 
                        alt={feature.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 z-10 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                        {icons[idx % icons.length]}
                      </div>
                    </div>
                 </div>
                 <div className="md:w-1/2 w-full space-y-6">
                   <div className="inline-block p-4 rounded-2xl bg-white shadow-sm border border-orange-50 text-4xl mb-2 group-hover:scale-110 transition-transform">
                     {icons[idx % icons.length]}
                   </div>
                   <h3 className="text-3xl font-bold text-[#2c2b29] leading-tight">{feature.title}</h3>
                   <p className="text-[#6b6965] text-lg leading-relaxed">{feature.description}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Bottom CTA */}
        <div className="container mx-auto px-4 mt-32 max-w-5xl">
          <div className="bg-gradient-to-br from-[#683341] to-[#4a242e] rounded-[48px] p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b88c42] opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl mx-auto leading-tight">
                {t.vendorPage.bottomCta.title}
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                {t.vendorPage.bottomCta.description}
              </p>
              <Link href="/#waitlist" className="inline-flex items-center justify-center gap-3 bg-white text-[#683341] font-bold text-xl px-12 py-5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                {t.vendorPage.bottomCta.btn}
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer from main page */}
      <footer className="bg-white py-16 border-t border-[var(--gold)]/20 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-2">
                 <span className="text-2xl font-bold bg-gradient-to-r from-[var(--gold)] to-[var(--charcoal)] bg-clip-text text-transparent">Eventizer</span>
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
                    <Link href={`/#${["features", "how-it-works", "categories", "waitlist"][i]}`} className="hover:text-[var(--gold)] hover:pr-2 transition-all duration-300">
                      {link}
                    </Link>
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
    </div>
  );
}
