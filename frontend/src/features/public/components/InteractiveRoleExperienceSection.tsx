import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { User, Building2, Users, GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Layers, ShieldCheck } from "lucide-react"
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
  highlights: string[]
}

const perspectives: Record<PerspectiveRole, RoleData> = {
  candidate: {
    label: "الكفاءات والباحثين",
    title: "منظومة نمو وتوجيه مهني متكاملة",
    subtitle: "فهم ذاتك المهنية، تقييم جاهزية سيرتك الذاتية، واكتشاف قيمتك في السوق",
    icon: User,
    ctaText: "ابدأ مسارك كمرشح",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=candidate`,
    steps: [
      { name: "01. الهوية المهنية", desc: "بناء بروفايل شامل يُبرز المهارات، الخبرات، والمشاريع بكفاءة." },
      { name: "02. جاهزية ATS", desc: "تحليل السيرة الذاتية واكتشاف الكلمات المفتاحية وفجوات التأثير." },
      { name: "03. القيمة السوقية", desc: "اعرف نطاق الراتب المستحق بناءً على طلب السوق الحقيقي." },
      { name: "04. الفرص المشفوعة ببيانات", desc: "تلقي ترشيحات وظيفية توضح لك أسباب المطابقة بالتفصيل." },
      { name: "05. التتبع المباشر", desc: "متابعة مسار التقديم من القبول وحتى المقابلة دون انتظار مجهول." },
    ],
    highlights: ["فحص فوري للسيرة الذاتية (ATS)", "تقدير النطاق الراتبي بالسوق", "تتبع شفاف لكل طلب"],
  },
  company: {
    label: "الشركات وأصحاب العمل",
    title: "استقطاب احترافي وإدارة توظيف شفافة",
    subtitle: "توثيق حضور الشركة، نشر الوظائف، واكتشاف الكفاءات والفرق التخصصية",
    icon: Building2,
    ctaText: "أنشئ بروفايل شركة",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=company`,
    steps: [
      { name: "01. الحضور المؤسسي", desc: "توثيق بروفايل الشركة وحساب درجة الموثوقية بالسوق." },
      { name: "02. نشر الفرص والفرق", desc: "نشر إعلانات الوظائف الفردية أو طلب فرق تخصصية كاملة." },
      { name: "03. اكتشاف المهارات", desc: "البحث في قاعدة الكفاءات المتاحة وتصفية المتقدمين." },
      { name: "04. مسار الفرز والمقابلة", desc: "شاشات تقييم موحدة تتيح لفريق التوظيف اتخاذ قرارات مدروسة." },
      { name: "05. القرار والتقرير المحترم", desc: "تقديم العروض أو مشاركة أسباب الاستبعاد بأسلوب محترف." },
    ],
    highlights: ["توثيق معتمد للسجلات التجارية", "إمكانية توظيف فرق كاملة", "أدوات تقييم وفرز مسببة"],
  },
  team: {
    label: "الفرق التخصصية",
    title: "استعراض القدرات المركبة والتقدم الجماعي",
    subtitle: "تجميع الكفاءات، تحديد تغطية المهارات، والتقدم للمشاريع ككتلة واحدة",
    icon: Users,
    ctaText: "أسس فريق عمل",
    ctaLink: `${ROUTES.AUTH.REGISTER}?role=team`,
    steps: [
      { name: "01. تشكيل الفريق", desc: "دعوة الأعضاء وتوزيع المسؤوليات والأدوار الفردية." },
      { name: "02. خريطة المهارات", desc: "حساب نسبة تغطية الفريق لمتطلبات المشاريع المعقدة." },
      { name: "03. الفرص الجماعية", desc: "استكشاف الوظائف والمشاريع المخصصة للفرق الجاهزة." },
      { name: "04. التقديم كفريق", desc: "تقديم ملف الفريق بنقرة واحدة وحفظ حقوق كل عضو." },
      { name: "05. التعاقد والاستقطاب", desc: "استلام عروض العمل والبدء في تنفيذ المشاريع." },
    ],
    highlights: ["خريطة مهارات تجميعية", "عروض موجهة للفرق الجاهزة", "تعاقد جماعي حفظ للحقوق"],
  },
  university: {
    label: "الجامعات والمؤسسات التعليمية",
    title: "جسر بين المخرجات التعليمية واحتياجات التوظيف",
    subtitle: "تتبع مؤشرات جاهزية الخريجين ومواءمة البرامج مع متطلبات السوق",
    icon: GraduationCap,
    ctaText: "استكشف شراكات الجامعات",
    ctaLink: ROUTES.PUBLIC.CONTACT,
    steps: [
      { name: "01. بروفايل الجامعة", desc: "تمثيل المؤسسة التعليمية والكليات الأكاديمية." },
      { name: "02. جاهزية الطلاب", desc: "قياس مؤشرات ملاءمة الخريجين للفرص المتاحة." },
      { name: "03. مواءمة المهارات", desc: "تحديد المهارات الأكثر طلباً من أصحاب العمل." },
      { name: "04. الشراكات المباشرة", desc: "ربط برامج التدريب والتأهيل ببيئات العمل." },
    ],
    highlights: ["مؤشرات جاهزية سوق العمل", "ربط مباشر مع أصحاب العمل", "رؤى توظيف مستقبلية"],
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
            <span>تجربة المنظومة من منظورك</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
            منظومة واحدة، لكل طرف تجربة مخصصة
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            اختر دورك لاستكشاف كيف تخدمك فائدة وتسهل مسارك المهني أو التوظيفي.
          </p>

          {/* Perspective Role Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-card/60 border border-white/10 rounded-2xl w-fit mx-auto backdrop-blur-md">
            {(Object.keys(perspectives) as PerspectiveRole[]).map((roleKey) => {
              const role = perspectives[roleKey]
              const Icon = role.icon
              const isActive = activeRole === roleKey
              return (
                <button
                  key={roleKey}
                  onClick={() => setActiveRole(roleKey)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{role.label}</span>
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
            className="max-w-5xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.1} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-10 bg-card/50 backdrop-blur-md border-white/10 shadow-2xl relative text-start">

                {/* Header inside Transforming Box */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <current.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-2xl font-extrabold font-heading text-white">{current.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{current.subtitle}</p>
                  </div>
                  <Link to={current.ctaLink} className="shrink-0">
                    <Button size="sm" className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5">
                      <span>{current.ctaText}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                {/* Steps Progression inside Box */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {current.steps.map((st, idx) => (
                    <div key={st.name} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-primary block mb-1">{st.name}</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role Highlights Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-muted-foreground">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    المميزات الفنية لهذا المسار:
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {current.highlights.map((h) => (
                      <span key={h} className="flex items-center gap-1 text-white/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
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
