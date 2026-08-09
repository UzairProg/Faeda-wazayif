/**
 * features/public/components/about/ProductDirection.tsx
 *
 * Roadmap section showing what is live today vs future expansion direction.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { CheckCircle2, Sparkles, Compass } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function ProductDirection() {
  const { t, language } = useTranslation()

  const todayItems = language === "en" ? [
    "Professional Identity & ATS Readiness Analysis",
    "Jobs Discovery & Explainable Match",
    "Verified Companies Directory & Culture Profiles",
    "Team Capability Marketplace"
  ] : [
    "الهوية المهنية وفحص جاهزية السيرة الذاتية (ATS)",
    "استكشاف الفرص مع إبراز أسباب التوافق المفسر",
    "دليل الشركات الموثوقة واستكشاف بيئات العمل",
    "سوق الفرق التخصصية واستقطاب القدرات"
  ]

  const nextItems = language === "en" ? [
    "Deeper Career Intelligence & Mentorship Simulations",
    "Education ↔ Market Demand Direct Integration",
    "Advanced Project Capability Matching for Enterprise"
  ] : [
    "ذكاء توجيهي أعمق ومحاكاة المقابلات التفاعلية",
    "ربط أعمق بين مخرجات الجامعات واحتياجات السوق الحية",
    "مطابقة التكليفات الكبرى مع الفرق التخصصية المتقدمة"
  ]

  return (
    <section className="py-16 text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Compass className="w-4 h-4" />
            <span>{t("about.direction.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight">
            {t("about.direction.title")}
          </h2>
        </div>

        {/* 2 Column Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Today */}
          <GlassCard className="p-6 sm:p-8 bg-emerald-500/5 border-emerald-500/20 text-start space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold font-heading text-white text-lg">{t("about.direction.todayTitle")}</h3>
                <span className="text-xs text-emerald-300 font-mono font-bold">
                  {language === "en" ? "Phase 1 Launched & Active" : "المرحلة الحالية المتاحة"}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {todayItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Future Direction */}
          <GlassCard className="p-6 sm:p-8 bg-primary/10 border-primary/30 text-start space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold font-heading text-white text-lg">{t("about.direction.nextTitle")}</h3>
                <span className="text-xs text-primary font-mono font-bold">
                  {language === "en" ? "Future Expansion Roadmap" : "التوسع المستقبلي في المنظومة"}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {nextItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

        </div>

      </div>
    </section>
  )
}
