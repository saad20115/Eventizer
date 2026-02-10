import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { DirectionUpdater } from "@/components/DirectionUpdater";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventizer | منصة المناسبات الأولى",
  description: "اربط مناسبتك بأفضل مقدمي الخدمات - تصوير، ضيافة، قاعات وأكثر. احصل على عروض أسعار تنافسية واختر الأنسب.",
  keywords: ["مناسبات", "زفاف", "تصوير", "ضيافة", "حفلات", "events", "wedding", "catering"],
  openGraph: {
    title: "Eventizer | منصة المناسبات الأولى",
    description: "اربط مناسبتك بأفضل مقدمي الخدمات",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-[family-name:var(--font-tajawal)] antialiased">
        <LanguageProvider>
          <DirectionUpdater />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
