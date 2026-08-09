import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { FileText, Target, Search, Clock, MessageSquare, TrendingUp, CheckCircle2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

const journeySteps = [
  {
    step: "01",
    title: "بناء الهوية المهنية",
    subtitle: "إبراز مهاراتك وخبراتك الحقيقية",
    description: "أنشئ بروفايلك الشامل مع حفظ المشاريع والمهارات بطريقة احترافية تعكس قيمتك الفعلية.",
    icon: FileText,
    badge: "الهوية",
    previewTitle: "واجهة الهوية المهنية",
    previewDetails: ["سجل المشاريع المنجزة", "شهادات المهارات المعتمدة", "رابط ملف عام مشارك"],
  },
  {
    step: "02",
    title: "فحص جاهزية ATS",
    subtitle: "تحليل ذكي للسيرة الذاتية",
    description: "قيّم سيرتك الذاتية مقابل معايير الفرز العالمية، واكتشف الكلمات المفتاحية وفجوات التأثير.",
    icon: Target,
    badge: "الجاهزية",
    previewTitle: "تقرير فحص جاهزية ATS",
    previewDetails: ["درجة التوافق المعياري", "الكلمات المفتاحية المفقودة", "تحسينات الصياغة والتأثير"],
  },
  {
    step: "03",
    title: "تقدير القيمة السوقية",
    subtitle: "فهم موضعك في السوق السعودي",
    description: "اعرف نطاق الراتب المستحق لخبراتك وفق معطيات السوق الحية والمؤهلات الأكاديمية والمهارية.",
    icon: TrendingUp,
    badge: "الموقع السوقي",
    previewTitle: "تقرير القيمة السوقية",
    previewDetails: ["نطاق الراتب المستحق شهرياً", "مقارنة الطلب بالرياض والمدن", "قوائم تحسين الراتب (+15%)"],
  },
  {
    step: "04",
    title: "اكتشاف الفرص والمطابقة",
    subtitle: "ترشيحات واضحة الأسباب",
    description: "تصفح وظائف تناسب مؤهلاتك مع شرح شفاف لأسباب الملاءمة وعوامل القوة ونقاط النمو.",
    icon: Search,
    badge: "الفرص",
    previewTitle: "شاشة الترشيحات المفسرة",
    previewDetails: ["أسباب المطابقة الدقيقة", "تغطية مهارات الوظيفة", "إمكانية التقديم كفريق أو فرد"],
  },
  {
    step: "05",
    title: "التقديم وتتبع المسار",
    subtitle: "شفافية كاملة في حالات الطلب",
    description: "تابع حالة طلبك خطوة بخطوة من التقديم وحتى المقابلة والقرار النهائي دون انتظار مجهول.",
    icon: Clock,
    badge: "التتبع",
    previewTitle: "لوحة تتبع طلبات التوظيف",
    previewDetails: ["سجل وموعد كل مرحلة", "تنسيق المقابلات والاختبارات", "إشعار القرار النهائي المسبب"],
  },
  {
    step: "06",
    title: "المحاكاة والنمو المهني",
    subtitle: "تجهيز للمقابلات وتحديد المسار",
    description: "تدرب على مقابلات حية افتراضية واحصل على خطة تحسين مستمرة لرفع تنافسيتك المهنية.",
    icon: MessageSquare,
    badge: "النمو المستمر",
    previewTitle: "بيئة التدريب والنمو المهني",
    previewDetails: ["محاكاة أسئلة المقابلة", "خطة تطوير مهارية مخصصة", "توجيه مهني مستمر"],
  },
]

export function ProfessionalJourneySection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % journeySteps.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [isPaused])

  const activeStep = journeySteps[activeStepIndex]

  return (
    <section
      className="py-20 bg-background border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مسار النمو المهني المتسلسل</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-3">
            رحلة متكاملة تنقلك من فهم ذاتك إلى اقتناص الفرصة
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            خطوات متسلسلة تبدأ بتعريف هويتك وتحديد قيمتك، وصولاً للتقديم والتطور.
          </p>
        </div>

        {/* Step Selector Horizontal Timeline Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {journeySteps.map((st, idx) => {
            const isActive = idx === activeStepIndex
            const Icon = st.icon
            return (
              <button
                key={st.step}
                onClick={() => {
                  setActiveStepIndex(idx)
                  setIsPaused(true)
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/40 scale-105"
                  : "bg-card/50 text-muted-foreground border border-white/10 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className="font-mono text-xs opacity-80">{st.step}</span>
                <Icon className="w-4.5 h-4.5" />
                <span>{st.badge}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Single Interface Preview Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="max-w-6xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.1} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                  {/* Step Description Column */}
                  <div className="md:col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xl font-bold">
                          {activeStep.step}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm text-primary font-semibold">{activeStep.subtitle}</span>
                          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">{activeStep.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                        {activeStep.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={ROUTES.AUTH.REGISTER}>
                        <Button size="sm" className="rounded-xl px-6 py-2.5 bg-primary text-white font-bold text-xs sm:text-sm gap-1.5">
                          <span>تجربة هذه الخطوة</span>
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </Link>
                      <span className="text-xs sm:text-sm text-muted-foreground font-mono">الخطوة {activeStep.step} من 06</span>
                    </div>
                  </div>

                  {/* Single Interactive Interface Preview Mockup */}
                  <div className="md:col-span-6">
                    <div className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/10 shadow-xl">
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          <span className="text-xs sm:text-sm text-white/90 font-mono font-bold ms-2">{activeStep.previewTitle}</span>
                        </div>
                        <span className="text-xs font-mono text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">مثال توضيحي</span>
                      </div>

                      <div className="space-y-3">
                        {activeStep.previewDetails.map((det) => (
                          <div key={det} className="p-4 sm:p-4.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-white font-medium">{det}</span>
                            <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
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
