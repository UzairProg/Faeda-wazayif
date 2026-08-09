/**
 * i18n/namespaces/teams.ts
 *
 * Translation keys for the public Team Marketplace module.
 */
export const teams = {
  header: {
    title: "الفرق التخصصية",
    subtitle: "اكتشف فرقاً تجمع مهارات متكاملة لتنفيذ المشاريع والفرص التي تحتاج أكثر من تخصص واحد.",
    badge: "منظومة الفرق التخصصية",
    valueComparisonTitle: "توظيف مهارة واحدة مقابل استقطاب قدرة متكاملة",
    hireIndividualLabel: "توظيف فردي",
    hireTeamLabel: "استقطاب فريق متكامل",
  },
  search: {
    placeholder: "ابحث عن فريق، مهارة، أو تخصص...",
    locationPlaceholder: "المدينة أو عن بعد...",
    button: "بحث",
    clear: "مسح",
    suggestionsHeader: "الفرق والمهارات",
    noSuggestions: "لا توجد نتائج سريعة مطابقة",
  },
  filters: {
    title: "التصفية",
    location: "المدينة",
    capability: "القدرات والمهارات",
    remoteOnly: "عمل عن بعد فقط",
    clearAll: "مسح الفلاتر",
  },
  list: {
    resultsCount: (count: number) => `${count} فريق مسجل`,
    memberCount: (count: number) =>
      count === 1 ? "عضو واحد" : count === 2 ? "عضوان" : `${count} أعضاء`,
    exploreCta: "استكشف الفريق",
    noDescription: "لا توجد نبذة مختصرة عن الفريق حالياً.",
  },
  preview: {
    title: "معاينة الفريق السريعة",
    selectPrompt: "اختر فريقاً من القائمة لمشاهدة قدراته ومكونات طاقمه مباشرة",
    capabilitiesTitle: "قدرات الفريق والمهارات",
    trackTitle: "المسار التخصصي",
    viewFullProfile: "عرض ملف الفريق الكامل",
  },
  detail: {
    capabilitiesTitle: "ماذا يستطيع الفريق أن ينجز؟",
    membersTitle: "أعضاء الفريق والطاقم",
    noMembers: "لم يكتمل الملف العام لأعضاء الفريق بعد.",
    opportunitiesTitle: "فرص مناسبة للفرق",
    noOpportunities: "لا توجد فرص مخصصة للفرق حالياً.",
    browseJobsCta: "تصفح جميع الوظائف والفرص",
    backToList: "العودة للفرق التخصصية",
  },
  states: {
    loading: "جارٍ تحميل الفرق التخصصية...",
    emptyTitle: "لا توجد فرق منشورة بعد",
    emptySubtitle: "ستظهر الفرق هنا عندما تُنشر ملفاتها العامة في المنظومة.",
    errorTitle: "تعذر تحميل الفرق",
    errorSubtitle: "حدثت مشكلة أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
    retryButton: "إعادة المحاولة",
    notFoundTitle: "الفريق غير موجود",
    notFoundSubtitle: "قد يكون الرابط غير صحيح أو لم يعد الفريق منشوراً بالمنظومة.",
  },
} as const
