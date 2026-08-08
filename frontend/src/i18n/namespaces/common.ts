/**
 * i18n/namespaces/common.ts
 *
 * Common translation keys shared across all modules.
 * Values are English fallbacks — replace with a proper i18n library
 * (e.g., react-i18next) when multi-language support is activated.
 *
 * Roadmap: AR (RTL) + EN (LTR) + Hindi (LTR)
 * Current state: Arabic-only UI. This file establishes the key structure
 * so strings can be centralized and translated without a rewrite.
 */
export const common = {
  actions: {
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    delete: "حذف",
    edit: "تعديل",
    viewAll: "عرض الكل",
    loadMore: "تحميل المزيد",
    search: "بحث",
    filter: "تصفية",
    apply: "تقديم",
    back: "رجوع",
    next: "التالي",
    submit: "إرسال",
    close: "إغلاق",
  },
  states: {
    loading: "جارٍ التحميل...",
    error: "حدث خطأ",
    empty: "لا توجد نتائج",
    unavailable: "غير متاح حالياً",
    comingSoon: "قريباً",
  },
  nav: {
    home: "الرئيسية",
    jobs: "الوظائف",
    companies: "الشركات",
    teams: "الفرق",
    about: "من نحن",
    contact: "تواصل معنا",
    login: "تسجيل دخول",
    register: "إنشاء حساب",
    logout: "تسجيل خروج",
    dashboard: "لوحة التحكم",
  },
  pagination: {
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
    results: "نتيجة",
  },
} as const
