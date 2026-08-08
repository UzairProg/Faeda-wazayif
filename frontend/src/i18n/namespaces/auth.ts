/**
 * i18n/namespaces/auth.ts
 * Translation keys for the Auth module.
 */
export const auth = {
  login: {
    title: "أهلاً بك مجدداً",
    subtitle: "أدخل بياناتك للوصول إلى منصة التوظيف الذكية وحسابك.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "هل نسيت كلمة المرور؟",
    submit: "تسجيل الدخول",
    orContinueWith: "أو المتابعة عبر",
    googleLogin: "تسجيل الدخول بواسطة Google",
    noAccount: "ليس لديك حساب بعد؟",
    createAccount: "إنشاء حساب جديد",
  },
  register: {
    title: "إنشاء حسابك الجديد",
    subtitle: "انضم إلى مجتمعنا من المحترفين والمبدعين بخطوات بسيطة.",
    chooseType: "اختر نوع حسابك المناسب:",
    seeker: {
      title: "باحث عن عمل",
      description: "أريد البحث عن فرص وظيفية مميزة ومعرفة قيمتي السوقية.",
    },
    employer: {
      title: "جهة توظيف / شركة",
      description: "أريد توظيف أفضل الكفاءات وإدارة عمليات التوظيف بذكاء.",
    },
    next: "التالي",
    hasAccount: "هل لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
  },
  forgotPassword: {
    title: "استعادة كلمة المرور",
    subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة.",
    email: "البريد الإلكتروني",
    submit: "إرسال رابط الاستعادة",
    backToLogin: "العودة لتسجيل الدخول",
  },
} as const
