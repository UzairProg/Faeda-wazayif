import { useState, useRef } from "react"
import { motion, useScroll, AnimatePresence } from "framer-motion"
import { User, FileText, CheckCircle2, Building2, Rocket, Users, Target, ShieldCheck } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"

type RoleTab = "candidate" | "employer" | "team"

interface StepItem {
  num: string
  title: string
  description: string
  icon: typeof FileText
  meta: string
}

const roleSteps: Record<RoleTab, { label: string; icon: typeof User; steps: StepItem[] }> = {
  candidate: {
    label: "للكفاءات والباحثين",
    icon: User,
    steps: [
      {
        num: "01",
        title: "بناء الملف وجاهزية ATS",
        description: "قم بإنشاء حسابك ودع الذكاء الاصطناعي يحلل سيرتك الذاتية ويحدد نقاط القوة والفجوات بدقة.",
        icon: FileText,
        meta: "تحليل ATS فوري ومُفسَّر",
      },
      {
        num: "02",
        title: "اكتشف قيمتك السوقية",
        description: "احصل على تقييم لمهاراتك وتوقع للراتب المستحق بناءً على طلب السوق السعودي والخبرات المشابهة.",
        icon: Target,
        meta: "تقدير سوقي محدَّث",
      },
      {
        num: "03",
        title: "المطابقة والتقدم بثقة",
        description: "احصل على ترشيحات وظيفية توضح لك أسباب المطابقة مع تتبع كامل لمراحل طلبك.",
        icon: CheckCircle2,
        meta: "ترشيحات واضحة الأسباب",
      },
    ],
  },
  employer: {
    label: "لجهات التوظيف",
    icon: Building2,
    steps: [
      {
        num: "01",
        title: "توثيق حساب الشركة",
        description: "أنشئ بروفايل الشركة، واحصل على علامة التوثيق لتعزيز الموثوقية وجذب أفضل الكفاءات.",
        icon: ShieldCheck,
        meta: "حساب مؤكد وموثوق",
      },
      {
        num: "02",
        title: "نشر الفرص أو استقطاب الفرق",
        description: "انشر الوظائف الفردية أو استقطب فرقاً تخصصية جاهزة لتنفيذ المشاريع المعقدة.",
        icon: Rocket,
        meta: "توظيف أفراد أو فرق",
      },
      {
        num: "03",
        title: "إدارة مسار التوظيف والقرارات",
        description: "استعرض المتقدمين المرتبين حسب المطابقة، ودَر مسار المقابلات والقرارات بأسلوب محترف.",
        icon: CheckCircle2,
        meta: "قرارات مسببة ومنظمة",
      },
    ],
  },
  team: {
    label: "للفرق التخصصية",
    icon: Users,
    steps: [
      {
        num: "01",
        title: "تشكيل الفريق وتحديد المهارات",
        description: "اجمع أعضاء الفريق، وابنِ ملفاً يوضح تغطية المهارات الجماعية والخبرات المشتركة.",
        icon: Users,
        meta: "خريطة مهارات جماعية",
      },
      {
        num: "02",
        title: "استكشاف فرص التوظيف الجماعي",
        description: "تصفح الوظائف والمشاريع المخصصة للفرق التي تبحث عن قدرات متكاملة وحلول جاهزة.",
        icon: Rocket,
        meta: "عروض موجهة للفرق",
      },
      {
        num: "03",
        title: "التقديم واستلام العروض",
        description: "تقدم كفريق واحد واستلم عروض التوظيف والمشاريع بشكل جماعي مع حفظ حقوق كافة الأعضاء.",
        icon: CheckCircle2,
        meta: "تعاقد واستقطاب جماعي",
      },
    ],
  },
}

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<RoleTab>("candidate")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const currentRole = roleSteps[activeTab]

  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
            رحلتك في المنظومة <span className="text-primary">خطوة بخطوة</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            سواء كنت كفاءة تبحث عن نمو، جهة توظيف تستقطب بثقة، أو فريقاً يبحث عن فرص جماعية.
          </p>

          {/* Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 p-1.5 bg-card/60 border border-white/10 rounded-2xl w-fit mx-auto backdrop-blur-md">
            {(Object.keys(roleSteps) as RoleTab[]).map((tabKey) => {
              const tab = roleSteps[tabKey]
              const Icon = tab.icon
              const isActive = activeTab === tabKey
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative" ref={containerRef}>
          {/* Vertical Timeline Background Line */}
          <div className="absolute top-0 bottom-0 end-[2.5rem] w-[2px] bg-white/5 hidden md:block" />

          {/* Vertical Animated Timeline Glowing Line */}
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            className="absolute top-0 bottom-0 end-[2.5rem] w-[2px] bg-primary hidden md:block shadow-[0_0_15px_rgba(18,75,201,1)]"
          />

          {/* Ambient Timeline Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none hidden md:block" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 relative z-10"
            >
              {currentRole.steps.map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                  className="relative flex flex-col md:flex-row items-center gap-12 group"
                >
                  {/* Connecting Node */}
                  <div className="hidden md:flex absolute end-[1.25rem] w-12 h-12 rounded-full border-2 border-white/10 bg-background items-center justify-center z-10 transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_30px_rgba(18,75,201,0.8)]">
                    <span className="text-muted-foreground font-bold font-mono text-base transition-colors duration-500 group-hover:text-white">
                      {step.num}
                    </span>
                  </div>

                  {/* Main Card */}
                  <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.15} className="w-full md:w-[calc(100%-6rem)] rounded-[2rem]">
                    <div className="flex flex-col sm:flex-row bg-card/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 sm:p-12 group-hover:border-primary/40 group-hover:bg-card/80 transition-all duration-500 ease-out shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-1">
                      {/* Right Content (Arabic Start) */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 order-first sm:order-last ms-auto sm:ms-0 sm:me-6">
                          <step.icon className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <div className="text-start flex-1">
                          <h3 className="text-2xl font-bold font-heading text-white mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hidden sm:block w-px bg-white/10 mx-6 self-stretch" />
                      <div className="sm:hidden h-px bg-white/10 my-6 w-full" />

                      {/* Left Content (Arabic End) */}
                      <div className="sm:w-52 flex items-center justify-start sm:justify-end text-start sm:text-end shrink-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-primary font-bold">{step.meta}</p>
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
