/**
 * features/public/components/about/EcosystemMap.tsx
 *
 * Interactive connected participant map section for the About page.
 * Explains how Candidates, Employers, Teams, and Educational Institutions connect inside Faeda.
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Building2, UserCheck, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const ECOSYSTEM_PARTICIPANTS = [
  {
    id: "candidates",
    title: "الكفاءات والجهات المهنية",
    subtitle: "يقودون مسارهم المهني باحترافية وشفافية",
    icon: UserCheck,
    color: "from-blue-500/20 to-primary/20 border-primary/40 text-primary",
    points: [
      "بناء هوية مهنية موثقة تحاكي متطلبات التوظيف الحديثة.",
      "فحص جاهزية السيرة الذاتية (ATS) ومحاكاة المقابلات بالذكاء الاصطناعي.",
      "اكتشاف القيمة السوقية المستحقة بناءً على مؤشرات حقيقية.",
      "تلقي ترشيحات وظيفية مفسرة توضح سبب ملاءمة كل فرصة.",
    ],
  },
  {
    id: "companies",
    title: "الشركات وأصحاب العمل",
    subtitle: "يبنون بيئات عمل موثقة ويستقطبون أفضل الكفاءات",
    icon: Building2,
    color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-400",
    points: [
      "إبراز حضور المنشأة وثقافة بيئة العمل الرسمية بالمنظومة.",
      "نشر الوظائف ومتابعة طلبات التقديم عبر مسار منظم.",
      "توثيق حساب المنشأة لتعزيز الموثوقية واستقطاب الكفاءات النوعية.",
      "الوصول المباشر إلى الفرق التخصصية الجاهزة للتنفيذ.",
    ],
  },
  {
    id: "teams",
    title: "الفرق التخصصية",
    subtitle: "تجميع المهارات التراكمية وعرض قدرة الفريق ككل",
    icon: Users,
    color: "from-emerald-500/20 to-teal-700/20 border-emerald-500/40 text-emerald-400",
    points: [
      "تنسيق طاقات الكفاءات تحت مظلة عمل وفريق تخصصي واحد.",
      "إبراز المهارات التراكمية التي تتجاوز قدرة الفرد الواحد.",
      "التقدم الجماعي للفرص والمشاريع التي تتطلب أكثر من تخصص.",
      "سوق متاح لاكتشاف الفرق المكتملة من قِبل الشركات.",
    ],
  },
  {
    id: "education",
    title: "المؤسسات التعليمية",
    subtitle: "ربط مخرجات التعليم والتدريب باحتياجات السوق الحقيقية",
    isFuture: true,
    icon: GraduationCap,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400",
    points: [
      "التكامل القادم لربط مخرجات البرامج الأكاديمية والتدريبية.",
      "تزويد الطلاب والخريجين بإشارات واضحة حول مهارات السوق المطلوبة.",
      "متابعة مسارات الخريجين وتسهيل انتقالهم لسوق العمل.",
    ],
  },
]

export function EcosystemMap() {
  const [activeId, setActiveId] = useState<string>("candidates")
  const activeParticipant = ECOSYSTEM_PARTICIPANTS.find((p) => p.id === activeId) || ECOSYSTEM_PARTICIPANTS[0]

  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-3">
            <Sparkles className="w-4 h-4" />
            <span>الربط والتكامل</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight mb-4">
            بيئة واحدة تجمع أطراف العمل والنمو
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            انقر على أي جزء من المنظومة للاطلاع على دوره وكيف يتصل بغيره داخل فائدة.
          </p>
        </div>

        {/* Interactive Node Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {ECOSYSTEM_PARTICIPANTS.map((part) => {
            const IconComp = part.icon
            const isSelected = part.id === activeId
            return (
              <button
                key={part.id}
                onClick={() => setActiveId(part.id)}
                className={`p-4 rounded-2xl border text-start transition-all ${
                  isSelected
                    ? "bg-primary/20 border-primary/60 shadow-lg shadow-primary/10 scale-[1.02]"
                    : "bg-card/40 border-white/10 hover:border-white/20 hover:bg-card/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${part.color} flex items-center justify-center`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  {part.isFuture && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      قريباً
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold font-heading text-white truncate">{part.title}</h3>
              </button>
            )
          })}
        </div>

        {/* Selected Participant Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeParticipant.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeParticipant.color} flex items-center justify-center shrink-0`}>
                  <activeParticipant.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                    {activeParticipant.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary font-semibold">
                    {activeParticipant.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {activeParticipant.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90 leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
