
export const VENDOR_SURVEY_QUESTIONS = [
    // === Basic Info ===
    { text: 'اسم النشاط / الجهة', type: 'text', idx: 1, required: true },
    { text: 'رقم الجوال', type: 'text', idx: 2, required: true },
    { text: 'المدينة', type: 'text', idx: 3, required: true },
    // Changed to 'choice' (Single Select) as per user request
    { text: 'نوع الخدمة المقدمة', type: 'choice', options: ["مصور (جوال / كاميرا)", "كوش", "DJ / فرق فنية", "ضيافة (كيك / معجنات / حلويات)", "مساعدة العروس (ميكب آرتست / مديرة فعاليات)"], idx: 4, required: true },
    { text: 'عدد سنوات الخبرة', type: 'choice', options: ["أقل من سنة", "1–3 سنوات", "أكثر من 3 سنوات"], idx: 5, required: true },

    // === Social Links ===
    { text: 'رابط حساب إنستجرام', type: 'text', idx: 6, required: true },
    { text: 'رابط حساب تيك توك', type: 'text', idx: 7, required: false },
    { text: 'رابط حساب سناب شات', type: 'text', idx: 8, required: false },
    { text: 'رابط موقع إلكتروني أو بورتفوليو (إن وجد)', type: 'text', idx: 9, required: false },

    // === Portfolio ===
    { text: 'يرجى إرفاق رابط يحتوي على نماذج من أعمالك (Google Drive, Dropbox, etc)', type: 'text', idx: 10, required: false },

    // === Section 1: Current Status ===
    { text: 'كيف تحصل على عملائك حاليًا؟', type: 'choice', options: ["إنستجرام", "تيك توك", "سناب شات", "واتساب", "توصيات"], idx: 12, required: true },
    { text: 'هل الطلب على خدمتك مستقر حاليًا؟', type: 'choice', options: ["نعم", "أحيانًا", "لا"], idx: 13, required: true },
    { text: 'ما أكثر تحدٍ تواجهه في عملك؟', type: 'choice', options: ["قلة الطلب", "مشاكل الدفع", "التفاوض على الأسعار", "كثرة الاستفسارات غير الجادة", "تنظيم المواعيد", "أخرى"], idx: 14, required: true },

    // === CONDITIONAL SECTIONS ===
    // Photography
    { text: '📸 (للمصورين) نوع التصوير الذي تقدمه', type: 'choice', options: ["جوال", "كاميرا", "الاثنين"], idx: 15, required: false },
    { text: '📸 (للمصورين) متوسط سعر الباقة', type: 'text', idx: 16, required: false },
    { text: '📸 (للمصورين) مدة التغطية المعتادة', type: 'text', idx: 17, required: false },
    { text: '📸 (للمصورين) هل تقبل حجوزات قريبة من موعد المناسبة؟', type: 'boolean', idx: 18, required: false },

    // Kosha
    { text: '🎨 (للكوش) نوع الكوش التي تقدمها', type: 'choice', options: ["جاهزة", "مخصصة حسب الطلب"], idx: 19, required: false },
    { text: '🎨 (للكوش) آلية التسعير', type: 'choice', options: ["باقات", "حسب الطلب"], idx: 20, required: false },
    { text: '🎨 (للكوش) أقل ميزانية تقبل بتنفيذها', type: 'text', idx: 21, required: false },
    { text: '🎨 (للكوش) هل تحتاج معاينة القاعة قبل التنفيذ؟', type: 'boolean', idx: 22, required: false },

    // DJ
    { text: '🎶 (DJ / الفرق الفنية) نوع الخدمة', type: 'choice', options: ["DJ", "فرقة فنية", "عروض ترفيهية"], idx: 23, required: false },
    { text: '🎶 (DJ / الفرق الفنية) مدة العرض المعتادة', type: 'text', idx: 24, required: false },
    { text: '🎶 (DJ / الفرق الفنية) آلية التسعير', type: 'choice', options: ["سعر ثابت", "حسب نوع المناسبة"], idx: 25, required: false },
    { text: '🎶 (DJ / الفرق الفنية) هل تحتاج تجهيزات صوتية من القاعة؟', type: 'boolean', idx: 26, required: false },

    // Catering
    { text: '🍰 (الضيافة) نوع المنتجات التي تقدمها', type: 'text', idx: 27, required: false },
    { text: '🍰 (الضيافة) الحد الأدنى للطلب', type: 'text', idx: 28, required: false },
    { text: '🍰 (الضيافة) مدة التحضير المعتادة', type: 'text', idx: 29, required: false },
    { text: '🍰 (الضيافة) هل التوصيل مشمول ضمن السعر؟', type: 'boolean', idx: 30, required: false },

    // Bride Helper
    { text: '👰‍♀️ (مساعدة العروس) نوع الدور', type: 'choice', options: ["ميكب آرتست", "مديرة فعاليات", "الاثنين"], idx: 31, required: false },
    { text: '👰‍♀️ (مساعدة العروس) آلية العمل', type: 'choice', options: ["بالساعة", "باليوم"], idx: 32, required: false },
    { text: '👰‍♀️ (مساعدة العروس) متى يتم الحجز غالبًا؟', type: 'choice', options: ["مبكر", "قريب من موعد المناسبة"], idx: 33, required: false },
    { text: '👰‍♀️ (مساعدة العروس) أكثر نقطة متعبة في التعامل مع العرائس', type: 'text', idx: 34, required: false },

    // === Section 3 ===
    { text: 'ما رأيك في فكرة منصة تجلب لك عملاء جاهزين للحجز؟', type: 'choice', options: ["ممتازة", "مقبولة", "غير مهتم"], idx: 35, required: true },
    { text: 'هل تقبل العمل بنظام عمولة مقابل جلب العميل؟', type: 'choice', options: ["نعم", "حسب النسبة", "لا"], idx: 36, required: true },
    { text: 'النسبة التي تراها مناسبة', type: 'choice', options: ["10%", "12%", "15%"], idx: 37, required: true },
    { text: 'هل تفضّل عمولة متدرجة حسب عدد الطلبات؟', type: 'boolean', idx: 38, required: true },

    // === Section 4 ===
    { text: 'طريقة التواصل المفضلة مع العميل', type: 'choice', options: ["واتساب", "اتصال مباشر", "عبر منصة رقمية"], idx: 39, required: true },
    { text: 'هل تفضّل وجود عقد وساطة ينظم العلاقة مع المنصة؟', type: 'choice', options: ["نعم", "لا", "لا يهم"], idx: 40, required: true },

    // === Section 5 ===
    { text: 'ما الذي قد يجعلك تتردد أو ترفض العمل مع منصة مثل Eventizer؟', type: 'text', idx: 41, required: true }
];
