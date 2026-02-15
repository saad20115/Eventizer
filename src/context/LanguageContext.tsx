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
        common: {
            thankYou: "شكراً لك!",
            received: "تم استلام ردك بنجاح.",
            yes: "نعم",
            no: "لا",
            other: "يرجى التحديد...",
        },
        nav: {
            home: "الرئيسية",
            features: "المميزات",
            services: "الخدمات",
            howItWorks: "كيف يعمل",
            about: "من نحن",
            surveys: "الاستبيانات",
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
            description1: "نوفّر لك منصة متكاملة تجمع نخبة من مقدمي خدمات المناسبات في مكان واحد، لتسهيل عملية الاختيار والحجز.",
            description2: "نهدف إلى ربط العملاء بمقدمي الخدمة بكل شفافية وسهولة، مع تجربة حجز منظمة وآمنة.",
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
                music: "الموسيقى",
                kosha: "الكوش",
                makeup: "الميكب ارتست",
                hairStylist: "الهير ستايلس",
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
            // Common
            vendorPanel: "لوحة المورد",
            customerPanel: "لوحة العميل",
            adminPanel: "لوحة الإدارة",
            home: "الرئيسية",
            settings: "الإعدادات",
            user: "مستخدم",
            logout: "تسجيل الخروج",

            // Customer Specific
            welcomeCustomer: "أهلاً بك 👋",
            welcomeCustomerSub: "مرحباً بك في لوحة تحكم العملاء. هنا يمكنك متابعة طلباتك وحجوزاتك.",
            newRequestNav: "طلب جديد",
            myRequests: "طلباتي",
            receivedOffers: "العروض المستلمة",
            bookings: "حجوزاتي",
            favorites: "المفضلة",
            messages: "الرسائل",
            activeBookings: "الحجوزات النشطة",
            quickActions: "إجراءات سريعة",
            newRequest: "طلب عرض سعر جديد",
            newRequestSub: "حدد نوع مناسبتك واحصل على عروض فورية",
            browseServices: "تصفح الخدمات",
            browseServicesSub: "استعرض مقدمي الخدمات في منطقتك",

            // Vendor Specific
            vendorWelcome: "لوحة المورد 🏪",
            vendorWelcomeSub: "أهلاً بك شريكنا العزيز. تابع أداء خدماتك وطلبات العملاء من هنا.",
            incomingRequests: "الطلبات الواردة",
            myOffers: "عروضي",
            myServices: "خدماتي",
            gallery: "المعرض",
            reports: "التقارير",
            finance: "المالية",
            reviews: "التقييمات",
            newRequests: "الطلبات الجديدة",
            views: "المشاهدات",
            sales: "المبيعات",
            rating: "التقييم",
            recentRequests: "أحدث الطلبات",
            noRequests: "لا توجد طلبات جديدة حالياً",

            // Admin Specific
            adminWelcome: "لوحة الإدارة 🛡️",
            adminWelcomeSub: "مرحباً بك في لوحة التحكم الرئيسية. أدر المنصة من هنا.",
            overview: "نظرة عامة",
            users: "المستخدمون",
            vendors: "الموردون",
            requests: "الطلبات",
            categories: "الفئات",
            financeAdmin: "المالية",
            reportsAdmin: "التقارير",
            security: "الأمان",
            notifications: "الإشعارات",
            waitlist: "قائمة الانتظار",
            platformSettings: "إعدادات المنصة",
            // Surveys
            surveys: {
                title: "الاستبيانات والملاحظات",
                marketResearch: "استبيانات دراسة السوق",
                create: "إنشاء استبيان",
                noSurveys: "لا توجد استبيانات حالياً.",
                loading: "جاري تحميل الاستبيانات...",
                table: {
                    title: "العنوان",
                    target: "الهدف",
                    status: "الحالة",
                    actions: "الإجراءات",
                    viewResults: "عرض النتائج",
                    responseId: "رقم الرد",
                    date: "التاريخ",
                    noResponses: "لا توجد ردود حتى الآن.",
                    noTextAnswers: "لا توجد إجابات نصية.",
                    sections: {
                        generalInfo: "المعلومات العامة",
                        aboutOccasion: "عن المناسبة",
                        searchExp: "تجربة البحث الحالية",
                        budgetPayment: "الميزانية والدفع",
                        concept: "فكرة ايفنتايزر",
                        strategic: "سؤال استراتيجي",
                        businessInfo: "معلومات النشاط",
                        servicesExp: "الخدمات والخبرة",
                        digitalPresence: "التواجد الرقمي والأعمال",
                        marketExp: "تجربة السوق",
                        conceptComm: "فكرة ايفنتايزر والعمولة"
                    },
                },
                tabs: {
                    analysis: "التحليل والرسوم البيانية",
                    responses: "الردود الفردية",
                },
                status: {
                    active: "نشط",
                    inactive: "غير نشط",
                },
                public: {
                    submit: "إرسال الاستبيان",
                    submitTitle: "إرسال",
                    saving: "جاري الحفظ...",
                    thankYou: "شكراً لك!",
                    recorded: "تم تسجيل ردك بنجاح.",
                    backHome: "العودة للرئيسية",
                    error: "فشل إرسال الاستبيان. يرجى المحاولة مرة أخرى.",
                    loading: "جاري التحميل...",
                    notFound: "الاستبيان غير موجود",
                },
                landing: {
                    title: "شاركنا رأيك لنخدمك بشكل أفضل",
                    subtitle: "نحن في Eventizer نسعى دائماً لتطوير خدماتنا لتناسب احتياجاتك. اختر الاستبيان المناسب لك أدناه.",
                    customerTitle: "أنا عميل",
                    customerDesc: "تبحث عن خدمات لمناسبتك؟ شاركنا تجربتك ورأيك في المنصة.",
                    vendorTitle: "أنا مقدم خدمة",
                    vendorDesc: "تقدم خدمات الأفراح والمناسبات؟ ساعدنا في تحسين أدواتنا لك.",
                    start: "ابدأ الاستبيان",
                },
                reports: {
                    exportExcel: "تصدير Excel",
                    exportPDF: "تصدير PDF",
                    totalResponses: "إجمالي الردود",
                    firstResponse: "أول رد",
                    lastResponse: "آخر رد",
                    error: "فشل في تصدير التقرير",
                },
            },
        },
    },
    en: {
        common: {
            thankYou: "Thank You!",
            received: "Your response has been received successfully.",
            yes: "Yes",
            no: "No",
            other: "Please specify...",
        },
        nav: {
            home: "Home",
            features: "Features",
            services: "Services",
            howItWorks: "How It Works",
            about: "About",
            surveys: "Surveys",
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
            description1: "We provide you with an integrated platform that brings together an elite group of event service providers in one place, to simplify the selection and booking process.",
            description2: "We aim to connect clients with service providers with complete transparency and ease, with an organized and secure booking experience.",
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
                music: "Music",
                kosha: "Decoration (Kosha)",
                makeup: "Makeup Artist",
                hairStylist: "Hair Stylist",
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
            // Common
            vendorPanel: "Vendor Panel",
            customerPanel: "Customer Panel",
            adminPanel: "Admin Panel",
            home: "Home",
            settings: "Settings",
            user: "User",
            logout: "Logout",

            // Customer Specific
            welcomeCustomer: "Welcome 👋",
            welcomeCustomerSub: "Welcome to your customer dashboard. Track your requests and bookings here.",
            newRequestNav: "New Request",
            myRequests: "My Requests",
            receivedOffers: "Received Offers",
            bookings: "My Bookings",
            favorites: "Favorites",
            messages: "Messages",
            activeBookings: "Active Bookings",
            quickActions: "Quick Actions",
            newRequest: "New Quote Request",
            newRequestSub: "Specify your event type and get instant offers",
            browseServices: "Browse Services",
            browseServicesSub: "Explore service providers in your area",

            // Vendor Specific
            vendorWelcome: "Vendor Dashboard 🏪",
            vendorWelcomeSub: "Welcome partner. Track your services performance and customer requests here.",
            incomingRequests: "Incoming Requests",
            myOffers: "My Offers",
            myServices: "My Services",
            gallery: "Gallery",
            reports: "Reports",
            finance: "Finance",
            reviews: "Reviews",
            newRequests: "New Requests",
            views: "Views",
            sales: "Sales",
            rating: "Rating",
            recentRequests: "Recent Requests",
            noRequests: "No new requests at the moment",

            // Admin Specific
            adminWelcome: "Admin Dashboard 🛡️",
            adminWelcomeSub: "Welcome to the main control panel. Manage the platform from here.",
            overview: "Overview",
            users: "Users",
            vendors: "Vendors",
            requests: "Requests",
            categories: "Categories",
            financeAdmin: "Finance",
            reportsAdmin: "Reports",
            security: "Security",
            notifications: "Notifications",
            waitlist: "Waitlist",
            platformSettings: "Platform Settings",
            // Surveys
            surveys: {
                title: "Surveys & Feedback",
                marketResearch: "Market Research Surveys",
                create: "Create Survey",
                noSurveys: "No surveys created yet.",
                loading: "Loading surveys...",
                table: {
                    title: "Title",
                    target: "Target",
                    status: "Status",
                    actions: "Actions",
                    viewResults: "View Results",
                    responseId: "Response ID",
                    date: "Date",
                    noResponses: "No responses found.",
                    noTextAnswers: "No text answers yet.",
                    sections: {
                        generalInfo: "General Information",
                        aboutOccasion: "About the Occasion",
                        searchExp: "Search Experience",
                        budgetPayment: "Budget & Payment",
                        concept: "Eventizer Concept",
                        strategic: "Strategic Question",
                        businessInfo: "Business Info",
                        servicesExp: "Services & Experience",
                        digitalPresence: "Digital Presence & Portfolio",
                        marketExp: "Market Experience",
                        conceptComm: "Eventizer Concept & Commission"
                    },
                },
                tabs: {
                    analysis: "Analysis & Charts",
                    responses: "Individual Responses",
                },
                status: {
                    active: "Active",
                    inactive: "Inactive",
                },
                public: {
                    submit: "Submit Survey",
                    submitTitle: "Submit",
                    saving: "Saving...",
                    thankYou: "Thank You!",
                    recorded: "Your feedback has been recorded.",
                    backHome: "Back to Home",
                    error: "Failed to submit survey. Please try again.",
                    loading: "Loading...",
                    notFound: "Survey not found",
                },
                landing: {
                    title: "Share your feedback to help us serve you better",
                    subtitle: "At Eventizer, we strive to improve our services. Please choose the survey relevant to you below.",
                    customerTitle: "I am a Customer",
                    customerDesc: "Looking for event services? Share your experience and feedback.",
                    vendorTitle: "I am a Vendor",
                    vendorDesc: "Providing event services? Help us improve our tools for you.",
                    start: "Start Survey",
                },
                reports: {
                    exportExcel: "Export Excel",
                    exportPDF: "Export PDF",
                    totalResponses: "Total Responses",
                    firstResponse: "First Response",
                    lastResponse: "Last Response",
                    error: "Failed to export report",
                },
            },
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
