/**
 * i18n/namespaces/companies.ts
 *
 * Translation keys for the public Companies discovery module.
 */
export const companies = {
  header: {
    title: "الشركات",
    subtitle: "اكتشف الجهات التي تقود فرص العمل، بيئاتها، والوظائف المتاحة لديهم.",
  },
  search: {
    placeholder: "ابحث عن شركة أو مجال عمل...",
    locationPlaceholder: "المدينة أو المنطقة...",
    button: "بحث",
    clear: "مسح",
    suggestionsHeader: "الشركات والمجالات",
    noSuggestions: "لا توجد نتائج سريعة مطابقة",
  },
  filters: {
    title: "التصفية",
    location: "المدينة",
    industry: "مجال العمل",
    verifiedOnly: "حسابات موثقة فقط",
    hasJobsOnly: "لديها وظائف شاغرة",
    clearAll: "مسح الفلاتر",
  },
  list: {
    resultsCount: (count: number) => `${count} شركة مسجلة`,
    verifiedBadge: "حساب موثق",
    openJobsCount: (count: number) =>
      count === 0
        ? "لا توجد وظائف شاعرة"
        : count === 1
        ? "فرصة واحدة متاحة"
        : `${count} فرص متاحة`,
    exploreCta: "استكشف الشركة",
    noDescription: "لا تتوفر نبذة مختصرة عن الشركة حالياً.",
  },
  detail: {
    aboutTitle: "عن الشركة",
    noAboutText: "لم تضف الشركة نبذة تعريفية بعد.",
    openJobsTitle: "الوظائف المتاحة",
    noOpenJobs: "لا توجد وظائف منشورة حالياً من قبل هذه الشركة.",
    browseAllJobs: "تصفح جميع الوظائف في فائدة",
    infoTitle: "معلومات الشركة",
    location: "الموقع الجغرافي",
    field: "مجال العمل",
    type: "نوع المنشأة",
    size: "حجم المنشأة",
    website: "الموقع الإلكتروني",
    verificationStatus: "حالة التوثيق",
    verified: "موثقة رسمياً",
    unverified: "غير موثقة بعد",
    viewWebsite: "زيارة الموقع الرسمي",
    joinCtaTitle: "هل تبحث عن فرص لدى هذه الشركة؟",
    joinCtaSubtitle: "استعرض وظائفها الحالية وسجل ملفك للتقديم المباشر.",
    viewJobsCta: "استعرض الوظائف الشاغرة",
    backToList: "العودة للشركات",
  },
  states: {
    loading: "جارٍ تحميل الشركات...",
    emptyTitle: "لم نجد شركات تطابق بحثك",
    emptySubtitle: "جرّب تغيير اسم الشركة أو المدينة أو إزالة الفلاتر المحددة.",
    errorTitle: "تعذر تحميل الشركات",
    errorSubtitle: "حدثت مشكلة أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
    retryButton: "إعادة المحاولة",
    notFoundTitle: "الشركة غير موجودة",
    notFoundSubtitle: "قد يكون الرابط غير صحيح أو لم تعد الشركة متاحة بالمنظومة.",
  },
} as const
