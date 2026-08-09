import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { User, Building2, Users, GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Layers } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

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

const perspectives: Record<PerspectiveRole, RoleData> = {
  candidate: {
    label: "الكفاءات والباحثين",
    title: "مسار متكامل لبناء هويتك واقتناص فرصك",
    subtitle: "عرف بنفسك صح، افحص سيرتك الذاتية، واعرف مستواك وراتبك المستحق في السوق.",
    icon: User,
    ctaText: "سجل كمرشح",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=candidate`,
    steps: [
      { name: "01. الملف المهني", desc: "اجمع خبراتك ومشاريعك في مكان واحد." },
      { name: "02. فحص السيرة الذاتية", desc: "تأكد من توافق سيرتك مع أنظمة التوظيف." },
      { name: "03. القيمة السوقية", desc: "عرف الراتب المناسب لخبرتك بالسوق." },
      { name: "04. الفرص المناسبة", desc: "ترشيحات واضحة توضح لك سبب الاختيار." },
      { name: "05. متابعة الطلب", desc: "تابع حالة طلبك أولاً بأول بدون انتظار." },
    ],
    previewTitle: "معاينة واجهة المرشح والمحترف",
    previewItems: [
      { label: "درجة توافق سيرتك مع أنظمة التوظيف", tag: "88% جاهزية عالية" },
      { label: "نطاق الراتب المستحق في السوق السعودي", tag: "22K – 28K SAR" },
      { label: "سبب ترشيحك للفرصة", tag: "مطابقة مهارات React & TS" },
    ],
    highlights: ["فحص فوري للسيرة الذاتية", "تقدير الراتب المستحق بالسوق", "متابعة واضحة لكل طلب"],
  },
  company: {
    label: "الشركات وأصحاب العمل",
    title: "استقطاب أسرع وتوظيف موثوق",
    subtitle: "وثّق حساب شركتك، انشر وظائفك، واستقطب الكفاءات والفرق المتميزة.",
    icon: Building2,
    ctaText: "سجل حساب شركة",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=company`,
    steps: [
      { name: "01. توثيق الشركة", desc: "بروفايل معتمد يرفع موثوقية التوظيف." },
      { name: "02. نشر الفرص", desc: "اعلن عن وظائف فردية أو فرق عمل كاملة." },
      { name: "03. اكتشاف الكفاءات", desc: "تصفح وابحث بين أفضل المتقدمين." },
      { name: "04. الفرز والتقييم", desc: "أدوات تقييم سهلة تساعدك تتخذ القرار." },
      { name: "05. التوظيف المباشر", desc: "قدم العروض واختصر وقت التوظيف." },
    ],
    previewTitle: "معاينة لوحة توظيف الشركات",
    previewItems: [
      { label: "حساب الشركة والتوثيق الرسمي", tag: "حساب معتمد" },
      { label: "البحث المباشر في قاعدة الكفاءات", tag: "بحث مخصص" },
      { label: "لوحة تقييم وفرز المتقدمين", tag: "فرز موحد" },
    ],
    highlights: ["حسابات شركات معتمدة", "إمكانية توظيف فرق كاملة", "أدوات فرز وتقييم سهلة"],
  },
  team: {
    label: "الفرق التخصصية",
    title: "التقدم كفريق واحد للمشاريع والفرص",
    subtitle: "جمع كفاءات فريقك، حدد مهاراتكم المشتركة، وتقدموا ككتلة واحدة.",
    icon: Users,
    ctaText: "سجل فريق عمل",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=team`,
    steps: [
      { name: "01. تشكيل الفريق", desc: "اجمع أعضاء فريقك وحدد أدوارهم." },
      { name: "02. خريطة المهارات", desc: "احسب نسبة تغطية مهارات فريقك." },
      { name: "03. فرص الفرق", desc: "استكشف مشاريع مخصصة للفرق الجاهزة." },
      { name: "04. التقديم الجماعي", desc: "قدم ملف الفريق بنقرة واحدة." },
      { name: "05. البدء بالعمل", desc: "استلم العروض وابدأ التنفيذ مباشرة." },
    ],
    previewTitle: "معاينة واجهة الفريق التخصصي",
    previewItems: [
      { label: "تغطية مهارات الفريق للمشروع", tag: "96% كفاءة مكتملة" },
      { label: "توزيع الأدوار وحقوق الأعضاء", tag: "حقوق موثقة" },
      { label: "عروض التوظيف الموجهة للفرق", tag: "تعاقد موحد" },
    ],
    highlights: ["خريطة مهارات تجميعية", "عروض موجهة للفرق الجاهزة", "تعاقد جماعي يحفظ الحقوق"],
  },
  university: {
    label: "الجامعات والتعليم",
    title: "ربط المخرجات بمتطلبات سوق العمل",
    subtitle: "تابِع جاهزية الخريجين وربط التخصصات التعليمية باحتياجات التوظيف.",
    icon: GraduationCap,
    ctaText: "تواصل مع المنظومة",
    ctaLink: ROUTES.PUBLIC.CONTACT,
    steps: [
      { name: "01. البروفايل الأكاديمي", desc: "عرض الكليات والبرامج التعليمية." },
      { name: "02. جاهزية الطلاب", desc: "قياس تلاؤم مهارات الخريجين مع السوق." },
      { name: "03. المهارات المطلوبة", desc: "معرفة أكثر المهارات طلباً لدى الشركات." },
      { name: "04. الشراكات المباشرة", desc: "ربط الخريجين بفرص التوظيف والتدريب." },
    ],
    previewTitle: "معاينة لوحة التخصصات والجامعات",
    previewItems: [
      { label: "مؤشر جاهزية خريجي الكليات التقنية", tag: "ربط بسوق العمل" },
      { label: "تقرير المهارات المطلوبة لدى الشركات", tag: "بيانات حية" },
      { label: "برامج التدريب والتأهيل المباشر", tag: "شراكات معتمدة" },
    ],
    highlights: ["مؤشرات جاهزية سوق العمل", "ربط مباشر مع أصحاب العمل", "رؤى توظيف حديثة"],
  },
}

export function InteractiveRoleExperienceSection() {
  const [activeRole, setActiveRole] = useState<PerspectiveRole>("candidate")

  const current = perspectives[activeRole]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Background Radial Element */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>تجربة المنظومة حسب دورك</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-3">
            منظومة واحدة، تجربة مخصصة لكل طرف
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            اختر دورك لاستكشاف كيف تسهل المنظومة مسارك العملي.
          </p>

          {/* Perspective Role Selector — Single Row Grid on Desktop */}
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

        {/* Dynamic Transforming Role Container */}
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

                {/* Header inside Transforming Box */}
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
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Split View: Steps Progression & Large UI Mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">

                  {/* Left: Steps List */}
                  <div className="lg:col-span-6 space-y-3.5">
                    {current.steps.map((st) => (
                      <div key={st.name} className="p-4 sm:p-4.5 rounded-xl bg-white/5 border border-white/5 text-start">
                        <span className="text-xs sm:text-sm font-bold text-primary block mb-0.5">{st.name}</span>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Right: Large UI Product Mockup */}
                  <div className="lg:col-span-6">
                    <div className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/10 shadow-xl text-start">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          <span className="text-xs sm:text-sm text-white/90 font-mono font-bold ms-2">{current.previewTitle}</span>
                        </div>
                        <span className="text-xs font-mono text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">مثال توضيحي</span>
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

                {/* Role Highlights Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-muted-foreground">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    مميزات هذا المسار:
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
