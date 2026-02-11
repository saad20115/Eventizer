"use client";
import { useState, useEffect } from "react";

// ===== LUXURY ANIMATED LOGO =====
export default function LuxuryLogo() {
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
