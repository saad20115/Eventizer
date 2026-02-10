"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    direction: 'rtl' | 'ltr';
    toggleLanguage: () => void;
    t: typeof translations.ar;
}

const translations = {
    ar: {
        nav: {
            home: "الرئيسية",
            features: "المميزات",
            services: "الخدمات",
            howItWorks: "كيف يعمل",
            about: "من نحن",
            contact: "تواصل معنا",
            login: "دخول",
        },
        hero: {
            badge: "قريباً في المملكة العربية السعودية",
            titleStart: "اجعل مناسبتك",
            titleHighlight: "لا تُنسى",
            description: "منصة Eventizer تربطك بأفضل مقدمي خدمات المناسبات. احصل على عروض أسعار تنافسية واختر الأنسب لمناسبتك.",
            ctaWaitlist: "انضم لقائمة الانتظار",
            ctaHowItWorks: "كيف يعمل؟",
            statService: "فئة خدمة",
            statVendor: "مورد معتمد",
            statFree: "مجاني",
            scrollDiscover: "اكتشف المزيد",
        },
        about: {
            badge: "✦ من نحن ✦",
            title: "نبني جسر الثقة بين العملاء ومقدمي الخدمات",
            description1: "Eventizer هي منصة رائدة تهدف إلى تبسيط تخطيط المناسبات في المملكة العربية السعودية. نربط أصحاب المناسبات بأفضل مقدمي الخدمات بشفافية تامة.",
            description2: "نؤمن بأن كل مناسبة تستحق أن تكون مميزة، لذا نوفر لك أدوات سهلة لمقارنة العروض واتخاذ القرار الأنسب.",
            visionTitle: "رؤيتنا",
            visionDesc: "أن نكون المنصة الأولى لتخطيط المناسبات",
            missionTitle: "مهمتنا",
            missionDesc: "تسهيل وتحسين تجربة تنظيم الفعاليات",
        },
        features: {
            badge: "✦ المميزات ✦",
            title: "لماذا Eventizer؟",
            items: [
                { title: "طلب عروض أسعار", description: "أنشئ طلبك بسهولة واحصل على عروض متعددة من أفضل الموردين" },
                { title: "مقارنة شفافة", description: "قارن بين العروض والأسعار واختر الأنسب لميزانيتك" },
                { title: "موردون موثوقون", description: "جميع مقدمي الخدمات موثقون ومعتمدون لضمان الجودة" },
                { title: "تواصل مباشر", description: "تواصل مع الموردين مباشرة عبر المنصة أو واتساب" },
                { title: "آمن وموثوق", description: "حماية بياناتك وخصوصيتك هي أولويتنا القصوى" },
                { title: "سريع وسهل", description: "واجهة بسيطة وسريعة تجعل التخطيط لمناسبتك متعة" },
            ],
        },
        howItWorks: {
            badge: "✦ الخطوات ✦",
            title: "كيف يعمل؟",
            steps: [
                { title: "أنشئ طلبك", description: "حدد نوع المناسبة والخدمات والتاريخ" },
                { title: "استقبل العروض", description: "يتواصل معك الموردون بعروض تنافسية" },
                { title: "قارن واختر", description: "راجع العروض واختر الأنسب لمناسبتك" },
            ],
        },
        categories: {
            badge: "الفئات",
            title: "استكشف خدماتنا",
            items: {
                photography: "التصوير",
                catering: "الضيافة",
                venues: "القاعات",
                flowers: "الزهور",
                music: "الموسيقى",
                sweets: "الحلويات",
                kosha: "الكوش",
                gifts: "الهدايا",
            },
            ctaMore: "+50 فئة إضافية",
        },
        waitlist: {
            badge: "انضم إلينا",
            title: "كن من الأوائل",
            description: "سجل الآن في قائمة الانتظار واحصل على وصول مبكر ومزايا حصرية",
            benefits: ["دعوة حصرية", "خصومات خاصة", "أولوية التسجيل"],
            customer: "🎉 عميل",
            vendor: "🏪 مقدم خدمة",
            namePlaceholder: "الاسم الكامل",
            emailPlaceholder: "البريد الإلكتروني",
            phonePlaceholder: "رقم الجوال",
            submit: "🚀 سجلني الآن",
            successTitle: "شكراً لانضمامك!",
            successDesc: "سنتواصل معك قريباً",
            validationName: "الاسم مطلوب",
            validationEmail: "البريد الإلكتروني غير صحيح",
            errorGeneric: "عذراً، حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
        },
        footer: {
            description: "منصة تربط أصحاب المناسبات بأفضل مقدمي الخدمات",
            quickLinks: "روابط سريعة",
            contact: "تواصل معنا",
            address: "مكة المكرمة، السعودية",
            rights: "جميع الحقوق محفوظة",
            madeWithLove: "صُنع بـ ❤️ في المملكة العربية السعودية",
        },
        auth: {
            customerTitle: "تسجيل دخول العملاء",
            providerTitle: "تسجيل دخول الموردين",
            adminTitle: "لوحة الإدارة",
            backToHome: "العودة للرئيسية",
            emailLabel: "البريد الإلكتروني",
            emailPlaceholder: "name@example.com",
            passwordLabel: "كلمة المرور",
            passwordPlaceholder: "••••••••",
            loginButton: "دخول",
            loadingLogin: "جاري الدخول...",
            noAccount: "ليس لديك حساب؟",
            signupTitle: "إنشاء حساب جديد",
            nameLabel: "الاسم الكامل",
            namePlaceholder: "الاسم الثلاثي",
            phoneLabel: "رقم الجوال",
            phonePlaceholder: "050xxxxxxx",
            signupButton: "إنشاء الحساب",
            loadingSignup: "جاري التسجيل...",
            haveAccount: "لديك حساب بالفعل؟",
            loginLink: "تسجيل الدخول",
            roleCustomer: "🎉 عميل",
            roleVendor: "🏪 مقدم خدمة",
        },
        dashboard: {
            vendorPanel: "لوحة التاجر",
            customerPanel: "لوحة العميل",
            home: "الرئيسية",
            requests: "الطلبات الواردة",
            bookings: "حجوزاتي",
            settings: "الإعدادات",
            user: "مستخدم",
            logout: "تسجيل الخروج",
            welcomeCustomer: "أهلاً بك 👋",
            welcomeCustomerSub: "مرحباً بك في لوحة تحكم العملاء. هنا يمكنك متابعة طلباتك وحجوزاتك.",
            activeBookings: "الحجوزات النشطة",
            receivedOffers: "العروض المستلمة",
            favorites: "المفضلة",
            quickActions: "إجراءات سريعة",
            newRequest: "طلب عرض سعر جديد",
            newRequestSub: "حدد نوع مناسبتك واحصل على عروض فورية",
            browseServices: "تصفح الخدمات",
            browseServicesSub: "استعرض مقدمي الخدمات في منطقتك",
            vendorWelcome: "لوحة التاجر 🏪",
            vendorWelcomeSub: "أهلاً بك شريكنا العزيز. تابع أداء خدماتك وطلبات العملاء من هنا.",
            newRequests: "الطلبات الجديدة",
            views: "المشاهدات",
            sales: "المبيعات",
            rating: "التقييم",
            recentRequests: "أحدث الطلبات",
            noRequests: "لا توجد طلبات جديدة حالياً",
        },
    },
    en: {
        nav: {
            home: "Home",
            features: "Features",
            services: "Services",
            howItWorks: "How It Works",
            about: "About",
            contact: "Contact",
            login: "Login",
        },
        hero: {
            badge: "Coming Soon in Saudi Arabia",
            titleStart: "Make Your Event",
            titleHighlight: "Unforgettable",
            description: "Eventizer connects you with the best event service providers. Get competitive quotes and choose what suits your event best.",
            ctaWaitlist: "Join Waitlist",
            ctaHowItWorks: "How It Works",
            statService: "Service Categories",
            statVendor: "Verified Vendors",
            statFree: "Free",
            scrollDiscover: "Discover More",
        },
        about: {
            badge: "✦ About Us ✦",
            title: "Building Trust Between Clients and Service Providers",
            description1: "Eventizer is a leading platform aimed at simplifying event planning in Saudi Arabia. We connect event organizers with the best service providers with complete transparency.",
            description2: "We believe every event deserves to be special, so we provide you with easy tools to compare offers and make the best decision.",
            visionTitle: "Our Vision",
            visionDesc: "To be the #1 event planning platform",
            missionTitle: "Our Mission",
            missionDesc: "Simplifying and improving event organization experience",
        },
        features: {
            badge: "✦ Features ✦",
            title: "Why Eventizer?",
            items: [
                { title: "Request Quotes", description: "Create your request easily and get multiple offers from the best vendors" },
                { title: "Transparent Comparison", description: "Compare offers and prices and choose what fits your budget" },
                { title: "Trusted Vendors", description: "All service providers are verified and certified to ensure quality" },
                { title: "Direct Communication", description: "Communicate with vendors directly via the platform or WhatsApp" },
                { title: "Safe & Secure", description: "Protecting your data and privacy is our top priority" },
                { title: "Fast & Easy", description: "A simple and fast interface makes planning your event a pleasure" },
            ],
        },
        howItWorks: {
            badge: "✦ Steps ✦",
            title: "How It Works?",
            steps: [
                { title: "Create Request", description: "Specify event type, services, and date" },
                { title: "Receive Offers", description: "Vendors contact you with competitive offers" },
                { title: "Compare & Choose", description: "Review offers and choose what suits your event best" },
            ],
        },
        categories: {
            badge: "Categories",
            title: "Explore Our Services",
            items: {
                photography: "Photography",
                catering: "Catering",
                venues: "Venues",
                flowers: "Flowers",
                music: "Music",
                sweets: "Sweets",
                kosha: "Decoration",
                gifts: "Gifts",
            },
            ctaMore: "+50 More Categories",
        },
        waitlist: {
            badge: "Join Us",
            title: "Be Among the First",
            description: "Register now for early access and exclusive benefits",
            benefits: ["Exclusive Invite", "Special Discounts", "Priority Registration"],
            customer: "🎉 Customer",
            vendor: "🏪 Service Provider",
            namePlaceholder: "Full Name",
            emailPlaceholder: "Email Address",
            phonePlaceholder: "Phone Number",
            submit: "🚀 Register Now",
            successTitle: "Thank You for Joining!",
            successDesc: "We'll contact you soon",
            validationName: "Name is required",
            validationEmail: "Invalid email address",
            errorGeneric: "Sorry, an error occurred during registration. Please try again.",
        },
        footer: {
            description: "A platform connecting event organizers with the best service providers",
            quickLinks: "Quick Links",
            contact: "Contact Us",
            address: "Makkah, Saudi Arabia",
            rights: "All Rights Reserved",
            madeWithLove: "Made with ❤️ in Saudi Arabia",
        },
        auth: {
            customerTitle: "Customer Login",
            providerTitle: "Provider Login",
            adminTitle: "Admin Dashboard",
            backToHome: "Back to Home",
            emailLabel: "Email",
            emailPlaceholder: "name@example.com",
            passwordLabel: "Password",
            passwordPlaceholder: "••••••••",
            loginButton: "Login",
            loadingLogin: "Logging in...",
            noAccount: "Don't have an account?",
            signupTitle: "Create New Account",
            nameLabel: "Full Name",
            namePlaceholder: "Your Full Name",
            phoneLabel: "Phone Number",
            phonePlaceholder: "050xxxxxxx",
            signupButton: "Create Account",
            loadingSignup: "Registering...",
            haveAccount: "Already have an account?",
            loginLink: "Login",
            roleCustomer: "🎉 Customer",
            roleVendor: "🏪 Service Provider",
        },
        dashboard: {
            vendorPanel: "Vendor Panel",
            customerPanel: "Customer Panel",
            home: "Home",
            requests: "Requests",
            bookings: "My Bookings",
            settings: "Settings",
            user: "User",
            logout: "Logout",
            welcomeCustomer: "Welcome 👋",
            welcomeCustomerSub: "Welcome to your customer dashboard. Track your requests and bookings here.",
            activeBookings: "Active Bookings",
            receivedOffers: "Received Offers",
            favorites: "Favorites",
            quickActions: "Quick Actions",
            newRequest: "New Quote Request",
            newRequestSub: "Specify your event type and get instant offers",
            browseServices: "Browse Services",
            browseServicesSub: "Explore service providers in your area",
            vendorWelcome: "Vendor Dashboard 🏪",
            vendorWelcomeSub: "Welcome partner. Track your services performance and customer requests here.",
            newRequests: "New Requests",
            views: "Views",
            sales: "Sales",
            rating: "Rating",
            recentRequests: "Recent Requests",
            noRequests: "No new requests at the moment",
        },
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ar');

    useEffect(() => {
        // Load saved language preference
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'ar' || saved === 'en')) {
            setLanguage(saved);
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const newLang = prev === 'ar' ? 'en' : 'ar';
            localStorage.setItem('language', newLang);
            return newLang;
        });
    };

    const direction = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, direction, toggleLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
