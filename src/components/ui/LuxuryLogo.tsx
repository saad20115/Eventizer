"use client";
import Image from "next/image";

// ===== LUXURY LOGO WITH ANIMATED SHIMMER =====
export default function LuxuryLogo() {
    return (
        <div className="relative group overflow-hidden">
            <div className="relative flex items-center justify-center">
                {/* Main Logo Image - Increased Width */}
                <Image
                    src="/logo.png"
                    alt="Eventizer Logo"
                    width={280} // Increased from 200
                    height={84} // Proportional increase
                    className="h-16 w-auto transition-all duration-700 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                />

                {/* Shimmer Effect Layer - Continuous Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* White Crystal Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] animate-luxuryShimmerActive" />

                    {/* Golden Gloss Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/40 via-[#D4AF37]/30 to-transparent -translate-x-[150%] animate-luxuryShimmerActive animation-delay-2000" />
                </div>
            </div>

            {/* Decorative Luxury Underline */}
            <div
                className="absolute -bottom-1 left-0 h-[3px] transition-all duration-[1000ms] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-[#D4AF37] via-[#FFD700] to-transparent shadow-[0_0_12px_#D4AF37]"
            />

            <style jsx>{`
                @keyframes luxuryShimmerActive {
                    0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
                    15% { opacity: 1; }
                    35% { transform: translateX(250%) skewX(-20deg); opacity: 1; }
                    50% { opacity: 0; }
                    100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
                }
                .animate-luxuryShimmerActive {
                    animation: luxuryShimmerActive 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
