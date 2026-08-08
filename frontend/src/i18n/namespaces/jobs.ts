/**
 * i18n/namespaces/jobs.ts
 *
 * Translation keys for the Jobs module (public job search + detail + apply gate).
 * All user-facing strings in JobsPage, JobDetailPage, and JobCard
 * should reference keys from this namespace.
 */
export const jobs = {
  search: {
    title: "ابحث عن وظيفتك",
    subtitle: "اكتشف الفرص المهنية المناسبة لمهاراتك وطموحاتك",
    placeholder: "المسمى الوظيفي أو المهارة أو الكلمة المفتاحية...",
    locationPlaceholder: "المدينة أو عن بعد...",
    button: "بحث",
    resultsCount: (count: number) => `${count} وظيفة متاحة`,
    noResults: "لا توجد وظائف تطابق معايير البحث",
    loading: "جارٍ تحميل الوظائف...",
    error: "تعذر تحميل الوظائف. يرجى المحاولة لاحقاً.",
  },
  filters: {
    title: "التصفية",
    location: "الموقع",
    workType: "نوع العمل",
    experience: "مستوى الخبرة",
    salary: "الراتب",
    company: "الشركة",
    teamFriendly: "مناسب للفرق",
    clear: "مسح التصفية",
    apply: "تطبيق",
    workTypes: {
      fullTime: "دوام كامل",
      partTime: "دوام جزئي",
      contract: "عقد",
      remote: "عن بعد",
      hybrid: "هجين",
    },
    experienceLevels: {
      entry: "مبتدئ",
      mid: "متوسط",
      senior: "أول",
      lead: "قيادي",
      executive: "تنفيذي",
    },
  },
  card: {
    postedOn: "نُشر في",
    updatedOn: "حُدِّث في",
    apply: "تقديم الآن",
    viewDetails: "تفاصيل الوظيفة",
    save: "حفظ",
    saved: "محفوظة",
    salaryNotDisclosed: "الراتب غير محدد",
    noSkillsListed: "لم يتم تحديد مهارات",
  },
  detail: {
    about: "عن الوظيفة",
    responsibilities: "المهام والمسؤوليات",
    requirements: "المتطلبات والمؤهلات",
    skills: "المهارات المطلوبة",
    aboutCompany: "عن الشركة",
    applyNow: "تقدم الآن",
    applyGate: {
      title: "للتقديم على هذه الوظيفة",
      subtitle: "يرجى تسجيل الدخول أو إنشاء حساب مرشح",
      loginCta: "تسجيل الدخول",
      registerCta: "إنشاء حساب مجاناً",
    },
    notFound: "لم يتم العثور على هذه الوظيفة",
    expired: "انتهت صلاحية هذه الوظيفة",
  },
} as const
