/**
 * i18n/namespaces/contact.ts
 *
 * Translation keys for the public Contact Us page (/contact).
 */
export const contact = {
  hero: {
    eyebrow: "تواصل معنا",
    heading: "نحن هنا للاستماع",
    subheading: "لديك سؤال، اقتراح، أو استفسار؟ أخبرنا وسنكون سعداء بمساعدتك.",
  },
  reasons: {
    title: "سبب التواصل الرئيسي",
    general: {
      title: "استفسار عام",
      desc: "لدي سؤال عن فائدة أو خدماتها.",
    },
    support: {
      title: "الدعم والمساعدة",
      desc: "أحتاج مساعدة في استخدام المنصة.",
    },
    partnership: {
      title: "شراكة أو تعاون",
      desc: "أرغب في مناقشة فرصة تعاون.",
    },
    suggestion: {
      title: "اقتراح أو ملاحظة",
      desc: "لدي فكرة أو ملاحظة لتحسين التجربة.",
    },
  },
  form: {
    nameLabel: "الاسم",
    namePlaceholder: "اكتب اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "example@domain.com",
    reasonLabel: "سبب التواصل",
    messageLabel: "كيف يمكننا مساعدتك؟",
    messagePlaceholder: "اكتب تفاصيل استفسارك أو رسالتك هنا...",
    submitBtn: "إرسال الرسالة",
    submittingBtn: "جارٍ الإرسال...",
    errors: {
      nameRequired: "يرجى إدخال اسمك.",
      emailRequired: "يرجى إدخال البريد الإلكتروني.",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
      messageRequired: "اكتب رسالتك قبل الإرسال.",
      genericFail: "تعذر إرسال الرسالة حالياً. حاول مرة أخرى.",
    },
  },
  success: {
    title: "تم استلام رسالتك بنجاح",
    desc: "شكرًا لتواصلك معنا. سنراجع رسالتك ونعود إليك في أقرب وقت.",
    sendAnother: "إرسال رسالة أخرى",
  },
  direct: {
    title: "معلومات التواصل المتاحة",
    emailLabel: "البريد الإلكتروني",
    emailValue: "contact@faedajobs.com",
    locationLabel: "المقر الرئيسي",
    locationValue: "الرياض، المملكة العربية السعودية",
  },
} as const
