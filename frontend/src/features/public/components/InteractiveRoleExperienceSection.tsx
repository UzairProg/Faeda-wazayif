/**
 * features/public/components/InteractiveRoleExperienceSection.tsx
 *
 * Interactive role experience switcher for Home page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { User, Building2, Users, GraduationCap, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Layers } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

type PerspectiveRole = "candidate" | "company" | "team" | "university"

interface RoleData {
  label: string
  title: string
  subtitle: string
  icon: typeof User
  ctaText: string
  ctaLink: string
  steps: { name: string; desc: string }[]
  previewTitle: string
  previewItems: { label: string; tag: string }[]
  highlights: string[]
}

export function InteractiveRoleExperienceSection() {
  const [activeRole, setActiveRole] = useState<PerspectiveRole>("candidate")
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const perspectives: Record<PerspectiveRole, RoleData> = {
    candidate: {
      label: t("about.audience.tabCandidates"),
      title: language === "en"
        ? "Unified path to build identity & seize opportunities"
        : language === "hi"
        ? "पहचान बनाने और अवसरों को हासिल करने का एकीकृत मार्ग"
        : "مسار متكامل لبناء هويتك واقتناص فرصك",
      subtitle: language === "en"
        ? "Present yourself accurately, inspect your CV, and know your real market value."
        : language === "hi"
        ? "सटीक रूप से खुद को प्रस्तुत करें, अपने सीवी का निरीक्षण करें, और अपना वास्तविक बाजार मूल्य जानें।"
        : "عرف بنفسك صح، افحص سيرتك الذاتية، واعرف مستواك وراتبك المستحق في السوق.",
      icon: User,
      ctaText: t("auth.login.createAccount"),
      ctaLink: `${ROUTES.AUTH.REGISTER}?role=candidate`,
      steps: language === "en" ? [
        { name: "01. Professional Profile", desc: "Consolidate skills and projects in one place." },
        { name: "02. CV ATS Screening", desc: "Verify compatibility with recruitment systems." },
        { name: "03. Market Value Analysis", desc: "Understand your expected salary range." },
        { name: "04. Position Match", desc: "Explainable position recommendations." },
        { name: "05. Application Tracking", desc: "Track status without waiting." },
      ] : language === "hi" ? [
        { name: "01. पेशेवर प्रोफ़ाइल", desc: "कौशल और परियोजनाओं को एक ही स्थान पर समेकित करें।" },
        { name: "02. सीवी एटीएस स्क्रीनिंग", desc: "भर्ती प्रणालियों के साथ अनुकूलता की पुष्टि करें।" },
        { name: "03. बाजार मूल्य विश्लेषण", desc: "अपनी अपेक्षित वेतन सीमा को समझें।" },
        { name: "04. पद मिलान", desc: "स्पष्टीकरण योग्य पद सिफारिशें।" },
        { name: "05. आवेदन ट्रैकिंग", desc: "बिना किसी प्रतीक्षा के स्थिति ट्रैक करें।" },
      ] : [
        { name: "01. الملف المهني", desc: "اجمع خبراتك ومشاريعك في مكان واحد." },
        { name: "02. فحص السيرة الذاتية", desc: "تأكد من توافق سيرتك مع أنظمة التوظيف." },
        { name: "03. القيمة السوقية", desc: "عرف الراتب المناسب لخبرتك بالسوق." },
        { name: "04. الفرص المناسبة", desc: "ترشيحات واضحة توضح لك سبب الاختيار." },
        { name: "05. متابعة الطلب", desc: "تابع حالة طلبك أولاً بأول بدون انتظار." },
      ],
      previewTitle: language === "en"
        ? "Candidate Workspace Preview"
        : language === "hi"
        ? "उम्मीदवार कार्यक्षेत्र पूर्वावलोकन"
        : "معاينة واجهة المرشح والمحترف",
      previewItems: language === "en" ? [
        { label: "CV ATS Readiness Score", tag: "88% High Readiness" },
        { label: "Market Value Salary Range", tag: "22K – 28K SAR" },
        { label: "Recommendation Reasoning", tag: "React & TS Skill Match" },
      ] : language === "hi" ? [
        { label: "सीवी एटीएस तत्परता स्कोर", tag: "88% उच्च तत्परता" },
        { label: "बाजार मूल्य वेतन सीमा", tag: "22K – 28K SAR" },
        { label: "सिफारिश का कारण", tag: "React & TS कौशल मिलान" },
      ] : [
        { label: "درجة توافق سيرتك مع أنظمة التوظيف", tag: "88% جاهزية عالية" },
        { label: "نطاق الراتب المستحق في السوق السعودي", tag: "22K – 28K SAR" },
        { label: "سبب ترشيحك للفرصة", tag: "مطابقة مهارات React & TS" },
      ],
      highlights: language === "en"
        ? ["Instant ATS Analysis", "Salary Estimation", "Clear Application Tracking"]
        : language === "hi"
        ? ["तत्काल एटीएस विश्लेषण", "वेतन अनुमान", "स्पष्ट आवेदन ट्रैकिंग"]
        : ["فحص فوري للسيرة الذاتية", "تقدير الراتب المستحق بالسوق", "متابعة واضحة لكل طلب"],
    },
    company: {
      label: t("about.audience.tabEmployers"),
      title: language === "en"
        ? "Faster sourcing & trusted hiring"
        : language === "hi"
        ? "तेज खोज और विश्वसनीय भर्ती"
        : "استقطاب أسرع وتوظيف موثوق",
      subtitle: language === "en"
        ? "Verify organization account, post jobs, and recruit top talent and teams."
        : language === "hi"
        ? "संगठन खाते की पुष्टि करें, नौकरियां पोस्ट करें, और शीर्ष प्रतिभाओं तथा टीमों को भर्ती करें।"
        : "وثّق حساب شركتك، انشر وظائفك، واستقطب الكفاءات والفرق المتميزة.",
      icon: Building2,
      ctaText: t("auth.roles.company.title"),
      ctaLink: `${ROUTES.AUTH.REGISTER}?role=company`,
      steps: language === "en" ? [
        { name: "01. Verification", desc: "Official badge boosting employer brand trust." },
        { name: "02. Opportunities", desc: "Post vacancies or recruit whole teams." },
        { name: "03. Sourcing", desc: "Search across verified talent pool." },
        { name: "04. Evaluation", desc: "Evaluation screens supporting decision making." },
        { name: "05. Direct Hiring", desc: "Issue offers and speed up time-to-hire." },
      ] : language === "hi" ? [
        { name: "01. सत्यापन", desc: "नियोक्ता ब्रांड ट्रस्ट बढ़ाने वाला आधिकारिक बैज।" },
        { name: "02. अवसर", desc: "रिक्तियां पोस्ट करें या पूरी टीमों की भर्ती करें।" },
        { name: "03. सोर्सिंग", desc: "सत्यापित प्रतिभा पूल में खोजें।" },
        { name: "04. मूल्यांकन", desc: "निर्णय लेने का समर्थन करने वाली मूल्यांकन स्क्रीन।" },
        { name: "05. प्रत्यक्ष भर्ती", desc: "प्रस्ताव जारी करें और भर्ती के समय को तेज करें।" },
      ] : [
        { name: "01. توثيق الشركة", desc: "بروفايل معتمد يرفع موثوقية التوظيف." },
        { name: "02. نشر الفرص", desc: "اعلن عن وظائف فردية أو فرق عمل كاملة." },
        { name: "03. اكتشاف الكفاءات", desc: "تصفح وابحث بين أفضل المتقدمين." },
        { name: "04. الفرز والتقييم", desc: "أدوات تقييم سهلة تساعدك تتخذ القرار." },
        { name: "05. التوظيف المباشر", desc: "قدم العروض واختصر وقت التوظيف." },
      ],
      previewTitle: language === "en"
        ? "Employer Dashboard Preview"
        : language === "hi"
        ? "नियोक्ता डैशबोर्ड पूर्वावलोकन"
        : "معاينة لوحة توظيف الشركات",
      previewItems: language === "en" ? [
        { label: "Official Verification Status", tag: "Verified Account" },
        { label: "Direct Sourcing in Talent Pool", tag: "Custom Search" },
        { label: "Applicant Evaluation Screen", tag: "Unified Screening" },
      ] : language === "hi" ? [
        { label: "आधिकारिक सत्यापन स्थिति", tag: "सत्यापित खाता" },
        { label: "प्रतिभा पूल में प्रत्यक्ष सोर्सिंग", tag: "कस्टम खोज" },
        { label: "आवेदक मूल्यांकन स्क्रीन", tag: "एकीकृत स्क्रीनिंग" },
      ] : [
        { label: "حساب الشركة والتوثيق الرسمي", tag: "حساب معتمد" },
        { label: "البحث المباشر في قاعدة الكفاءات", tag: "بحث مخصص" },
        { label: "لوحة تقييم وفرز المتقدمين", tag: "فرز موحد" },
      ],
      highlights: language === "en"
        ? ["Verified Accounts", "Whole Team Contracting", "Streamlined Evaluation"]
        : language === "hi"
        ? ["सत्यापित खाते", "संपूर्ण टीम अनुबंध", "सुव्यवस्थित मूल्यांकन"]
        : ["حسابات شركات معتمدة", "إمكانية توظيف فرق كاملة", "أدوات فرز وتقييم سهلة"],
    },
    team: {
      label: t("about.audience.tabTeams"),
      title: language === "en"
        ? "Contract as a unified team unit"
        : language === "hi"
        ? "एक एकीकृत टीम इकाई के रूप में अनुबंध"
        : "التقدم كفريق واحد للمشاريع والفرص",
      subtitle: language === "en"
        ? "Consolidate skills, define roster roles, and apply as one entity."
        : language === "hi"
        ? "कौशलों को समेकित करें, रोस्टर भूमिकाओं को परिभाषित करें, और एक संस्था के रूप में आवेदन करें।"
        : "جمع كفاءات فريقك، حدد مهاراتكم المشتركة، وتقدموا ككتلة واحدة.",
      icon: Users,
      ctaText: t("about.audience.tabTeams"),
      ctaLink: `${ROUTES.AUTH.REGISTER}?role=team`,
      steps: language === "en" ? [
        { name: "01. Team Setup", desc: "Assemble members and define roles." },
        { name: "02. Skill Map", desc: "Calculate capability coverage percentage." },
        { name: "03. Opportunities", desc: "Discover jobs suited for teams." },
        { name: "04. Single Apply", desc: "Submit team profile in one click." },
        { name: "05. Execution", desc: "Receive contract offers and start immediately." },
      ] : language === "hi" ? [
        { name: "01. टीम सेटअप", desc: "सदस्यों को इकट्ठा करें और भूमिकाएं परिभाषित करें।" },
        { name: "02. कौशल मानचित्र", desc: "क्षमता कवरेज प्रतिशत की गणना करें।" },
        { name: "03. अवसर", desc: "टीमों के लिए उपयुक्त नौकरियों की खोज करें।" },
        { name: "04. एकल आवेदन", desc: "एक क्लिक में टीम प्रोफ़ाइल सबमिट करें।" },
        { name: "05. निष्पादन", desc: "अनुबंध प्रस्ताव प्राप्त करें और तुरंत शुरू करें।" },
      ] : [
        { name: "01. تشكيل الفريق", desc: "اجمع أعضاء فريقك وحدد أدوارهم." },
        { name: "02. خريطة المهارات", desc: "احسب نسبة تغطية مهارات فريقك." },
        { name: "03. فرص الفرق", desc: "استكشف مشاريع مخصصة للفرق الجاهزة." },
        { name: "04. التقديم الجماعي", desc: "قدم ملف الفريق بنقرة واحدة." },
        { name: "05. البدء بالعمل", desc: "استلم العروض وابدأ التنفيذ مباشرة." },
      ],
      previewTitle: language === "en"
        ? "Team Marketplace Preview"
        : language === "hi"
        ? "टीम बाज़ार पूर्वावलोकन"
        : "معاينة واجهة الفريق التخصصي",
      previewItems: language === "en" ? [
        { label: "Team Skill Coverage Ratio", tag: "96% Complete Coverage" },
        { label: "Roster Roles & Rights", tag: "Protected Roster" },
        { label: "Direct Team Contracts", tag: "Unified Offer" },
      ] : language === "hi" ? [
        { label: "टीम कौशल कवरेज अनुपात", tag: "96% पूर्ण कवरेज" },
        { label: "रोस्टर भूमिकाएं और अधिकार", tag: "संरक्षित रोस्टर" },
        { label: "प्रत्यक्ष टीम अनुबंध", tag: "एकीकृत प्रस्ताव" },
      ] : [
        { label: "تغطية مهارات الفريق للمشروع", tag: "96% كفاءة مكتملة" },
        { label: "توزيع الأدوار وحقوق الأعضاء", tag: "حقوق موثقة" },
        { label: "عروض التوظيف الموجهة للفرق", tag: "تعاقد موحد" },
      ],
      highlights: language === "en"
        ? ["Combined Capability Map", "Direct Team Offers", "Unified Contracting"]
        : language === "hi"
        ? ["संयुक्त क्षमता मानचित्र", "प्रत्यक्ष टीम प्रस्ताव", "एकीकृत अनुबंध"]
        : ["خريطة مهارات تجميعية", "عروض موجهة للفرق الجاهزة", "تعاقد جماعي يحفظ الحقوق"],
    },
    university: {
      label: t("about.audience.tabEducation"),
      title: language === "en"
        ? "Bridge education outputs to market demand"
        : language === "hi"
        ? "शिक्षा आउटपुट को बाजार की मांग से जोड़ें"
        : "ربط المخرجات بمتطلبات سوق العمل",
      subtitle: language === "en"
        ? "Track graduate readiness and align academic skills with industry needs."
        : language === "hi"
        ? "स्नातक तत्परता को ट्रैक करें और शैक्षणिक कौशलों को उद्योग की जरूरतों के साथ संरेखित करें।"
        : "تابِع جاهزية الخريجين وربط التخصصات التعليمية باحتياجات التوظيف.",
      icon: GraduationCap,
      ctaText: t("common.nav.contact"),
      ctaLink: ROUTES.PUBLIC.CONTACT,
      steps: language === "en" ? [
        { name: "01. Academic Profile", desc: "Present faculties and programs." },
        { name: "02. Student Readiness", desc: "Measure graduate skills alignment." },
        { name: "03. Market Skills", desc: "Understand top in-demand skills." },
        { name: "04. Partnerships", desc: "Connect students with real jobs." },
      ] : language === "hi" ? [
        { name: "01. शैक्षणिक प्रोफ़ाइल", desc: "संकायों और कार्यक्रमों को प्रस्तुत करें।" },
        { name: "02. छात्र तत्परता", desc: "स्नातक कौशल संरेखण को मापें।" },
        { name: "03. बाजार कौशल", desc: "शीर्ष इन-डिमांड कौशल को समझें।" },
        { name: "04. साझेदारियाँ", desc: "छात्रों को वास्तविक नौकरियों से जोड़ें।" },
      ] : [
        { name: "01. البروفايل الأكاديمي", desc: "عرض الكليات والبرامج التعليمية." },
        { name: "02. جاهزية الطلاب", desc: "قياس تلاؤم مهارات الخريجين مع السوق." },
        { name: "03. المهارات المطلوبة", desc: "معرفة أكثر المهارات طلباً لدى الشركات." },
        { name: "04. الشراكات المباشرة", desc: "ربط الخريجين بفرص التوظيف والتدريب." },
      ],
      previewTitle: language === "en"
        ? "Educational Dashboard Preview"
        : language === "hi"
        ? "शैक्षणिक डैशबोर्ड पूर्वावलोकन"
        : "معاينة لوحة التخصصات والجامعات",
      previewItems: language === "en" ? [
        { label: "Graduate Market Readiness Index", tag: "Industry Alignment" },
        { label: "In-demand Skills Live Report", tag: "Real Data" },
        { label: "Direct Traineeship Programs", tag: "Verified Partners" },
      ] : language === "hi" ? [
        { label: "स्नातक बाजार तत्परता सूचकांक", tag: "उद्योग संरेखण" },
        { label: "इन-डिमांड कौशल लाइव रिपोर्ट", tag: "वास्तविक डेटा" },
        { label: "प्रत्यक्ष प्रशिक्षुता कार्यक्रम", tag: "सत्यापित भागीदार" },
      ] : [
        { label: "مؤشر جاهزية خريجي الكليات التقنية", tag: "ربط بسوق العمل" },
        { label: "تقرير المهارات المطلوبة لدى الشركات", tag: "بيانات حية" },
        { label: "برامج التدريب والتأهيل المباشر", tag: "شراكات معتمدة" },
      ],
      highlights: language === "en"
        ? ["Labor Market Readiness Metrics", "Direct Employer Connections", "Live Skill Demand Data"]
        : language === "hi"
        ? ["श्रम बाजार तत्परता मेट्रिक्स", "प्रत्यक्ष नियोक्ता कनेक्शन", "लाइव कौशल मांग डेटा"]
        : ["مؤشرات جاهزية سوق العمل", "ربط مباشر مع أصحاب العمل", "رؤى توظيف حديثة"],
    },
  }

  const current = perspectives[activeRole]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{t("about.audience.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-3">
            {t("about.audience.title")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "en"
              ? "Select your role to explore how the ecosystem streamlines your journey."
              : language === "hi"
              ? "यह जानने के लिए अपनी भूमिका चुनें कि पारिस्थितिकी तंत्र आपकी यात्रा को कैसे सुव्यवस्थित करता है।"
              : "اختر دورك لاستكشاف كيف تسهل المنظومة مسارك العملي."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-6xl mx-auto">
            {(Object.keys(perspectives) as PerspectiveRole[]).map((roleKey) => {
              const role = perspectives[roleKey]
              const Icon = role.icon
              const isActive = activeRole === roleKey
              return (
                <button
                  key={roleKey}
                  onClick={() => setActiveRole(roleKey)}
                  className={`flex items-center justify-center gap-2.5 p-4 sm:p-5 rounded-2xl font-bold text-xs sm:text-base transition-all duration-300 border text-center ${isActive
                    ? "bg-primary text-white border-primary/50 shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-card/60 text-muted-foreground border-white/10 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{role.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Transforming Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.1} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-12 bg-card/50 backdrop-blur-md border-white/10 shadow-2xl relative text-start">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <current.icon className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{current.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{current.subtitle}</p>
                  </div>
                  <Link to={current.ctaLink} className="shrink-0">
                    <Button size="sm" className="rounded-xl px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-1.5">
                      <span>{current.ctaText}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
                  <div className="lg:col-span-6 space-y-3.5">
                    {current.steps.map((st) => (
                      <div key={st.name} className="p-4 sm:p-4.5 rounded-xl bg-white/5 border border-white/5 text-start">
                        <span className="text-xs sm:text-sm font-bold text-primary block mb-0.5">{st.name}</span>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-6">
                    <div className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/10 shadow-xl text-start">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          <span className="text-xs sm:text-sm text-white/90 font-mono font-bold ms-2">{current.previewTitle}</span>
                        </div>
                        <span className="text-xs font-mono text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {language === "en" ? "Live Interactive" : language === "hi" ? "लाइव इंटरएक्टिव" : "مثال توضيحي"}
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {current.previewItems.map((item) => (
                          <div key={item.label} className="p-4 sm:p-4.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                            <span className="text-white font-medium">{item.label}</span>
                            <span className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-bold text-xs shrink-0 font-mono">{item.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-muted-foreground">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {language === "en" ? "Trajectory Highlights:" : language === "hi" ? "करियर मार्ग की विशेषताएं:" : "مميزات هذا المسار:"}
                  </span>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {current.highlights.map((h) => (
                      <span key={h} className="flex items-center gap-1.5 text-white/90">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

              </GlassCard>
            </TiltCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
