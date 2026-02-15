"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

// Service Data
const services = [
    { id: 'photography', image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=600&fit=crop", icon: "📸", color: "from-purple-500/20 to-blue-500/20" },
    { id: 'music', image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=600&fit=crop", icon: "🎵", color: "from-red-500/20 to-orange-500/20" },
    { id: 'kosha', image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=600&fit=crop", icon: "✨", color: "from-amber-500/20 to-yellow-500/20" },
    { id: 'makeup', image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=600&fit=crop", icon: "💄", color: "from-pink-500/20 to-rose-500/20" },
    { id: 'hairStylist', image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&h=600&fit=crop", icon: "💇‍♀️", color: "from-emerald-500/20 to-teal-500/20" },
    { id: 'catering', image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=600&fit=crop", icon: "🍽️", color: "from-orange-500/20 to-red-500/20" },
    { id: 'flowers', image: "https://images.unsplash.com/photo-1490750967868-58cb75069012?w=500&h=600&fit=crop", icon: "💐", color: "from-pink-500/20 to-purple-500/20" },
];

export default function ServicesMarquee() {
    const { t } = useLanguage();

    return (
        <section id="categories" className="py-24 bg-gradient-to-b from-white to-[var(--cream)] relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[var(--rose)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 mb-12">
                <div className="text-center">
                    <span className="text-[var(--gold)] font-medium mb-2 block animate-fadeInUp tracking-widest uppercase text-sm">{t.categories.badge}</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6 animate-fadeInUp bg-gradient-to-r from-[var(--charcoal)] to-[var(--charcoal-light)] bg-clip-text text-transparent" style={{ animationDelay: '0.1s' }}>
                        {t.categories.title}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto rounded-full animate-fadeInUp" style={{ animationDelay: '0.2s' }} />
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden py-10">

                {/* Infinite Scrolling Marquee */}
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-6"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear",
                            },
                        }}
                        style={{ width: "max-content" }}
                    >
                        {[...services, ...services, ...services, ...services].map((cat, index) => (
                            <div
                                key={`${cat.id}-${index}`}
                                className="group cursor-pointer relative flex-shrink-0 w-[260px] h-[380px]"
                            >
                                <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl ring-1 ring-black/5 bg-white mx-auto">
                                    {/* Image Background */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={cat.image}
                                            alt={t.categories.items[cat.id as keyof typeof t.categories.items] || cat.id}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                        {/* Gradient Color Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay`} />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center justify-end h-full text-center z-10">

                                        {/* Float Icon */}
                                        <div className="mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-xl relative overflow-hidden group-hover:bg-white/20">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-60"></div>
                                                {cat.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 filter drop-shadow-md group-hover:text-[var(--gold)] transition-colors duration-300 font-serif">
                                            {t.categories.items[cat.id as keyof typeof t.categories.items] || cat.id}
                                        </h3>

                                        {/* Decorative Line */}
                                        <div className="w-10 h-1 bg-[var(--gold)] rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-center mb-3 shadow-[0_0_10px_var(--gold)]"></div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-white/90 font-medium tracking-wide text-xs">
                                            {t.hero.scrollDiscover} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="text-center mt-12 relative z-10">
                <a href="#waitlist" className="relative inline-flex group">
                    <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                    <button className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[var(--charcoal)] font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        {t.categories.ctaMore}
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </a>
            </div>
        </section>
    );
}
