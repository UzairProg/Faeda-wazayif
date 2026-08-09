/**
 * features/public/components/about/AiPhilosophyVisualizer.tsx
 *
 * Interactive visualizer illustrating Faeda's AI agency philosophy ("الذكاء يساعدك، والقرار لك").
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { Bot, UserCheck, ShieldCheck, Sparkles, ArrowLeft, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function AiPhilosophyVisualizer() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const steps = [
    {
      num: "01",
      title: t("about.ai.suggest"),
      desc: language === "en"
        ? "Analyzes ATS readiness, skill coverage & job alignment."
        : language === "hi"
        ? "एटीएस तत्परता, कौशल कवरेज और नौकरी संरेखण का विश्लेषण करता है।"
        : "تحليل التوافق والمهارات وإبراز نقاط القوة والفجوات الفرعية.",
      icon: Bot,
      color: "from-blue-500/20 to-primary/20 border-primary/30 text-primary",
    },
    {
      num: "02",
      title: t("about.ai.review"),
      desc: language === "en"
        ? "User and employer inspect transparent reasoning."
        : language === "hi"
        ? "उपयोगकर्ता और नियोक्ता पारदर्शी तर्क का निरीक्षण करते हैं।"
        : "مراجعة شفافة للدلائل والتوصيات وإلغاء أي تحيز غير مبرر.",
      icon: UserCheck,
      color: "from-purple-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400",
    },
    {
      num: "03",
      title: t("about.ai.decide"),
      desc: language === "en"
        ? "Final hiring and career decisions remain 100% human."
        : language === "hi"
        ? "अंतिम भर्ती और करियर के निर्णय 100% मानवीय रहते हैं।"
        : "القرار النهائي بالتقديم أو الاستقطاب يظل حراً بيد الإنسان.",
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-card/20 to-transparent text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t("about.ai.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight mb-4">
            {t("about.ai.title")}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t("about.ai.subtitle")}
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon
            return (
              <GlassCard
                key={step.num}
                className={`p-6 sm:p-8 bg-gradient-to-br ${step.color} border text-start space-y-4 shadow-xl relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-white/30">{step.num}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold font-heading text-white">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute end-[-14px] top-1/2 -translate-y-1/2 z-20">
                    <div className="w-7 h-7 rounded-full bg-card border border-white/20 flex items-center justify-center text-primary shadow-lg">
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>

      </div>
    </section>
  )
}
