/**
 * features/public/components/about/WhyFaedaExists.tsx
 *
 * Visual transformation flow comparing today's fragmented hiring tools with Faeda's unified ecosystem.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { Layers, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, FileText, Briefcase, Bot } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function WhyFaedaExists() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-card/20 to-transparent relative overflow-hidden text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Layers className="w-4 h-4" />
            <span>{t("about.why.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight mb-4">
            {t("about.why.title")}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t("about.why.subtitle")}
          </p>
        </div>

        {/* Transformation Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Today: Fragmented World (5 cols) */}
          <div className="lg:col-span-5">
            <GlassCard className="h-full p-6 sm:p-8 bg-rose-500/5 border-rose-500/20 text-start space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">{t("about.why.todayHeader")}</h3>
                    <span className="text-[11px] text-rose-300 font-mono">
                      {language === "en" ? "Isolated Tools & Silos" : "أدوات مبعثرة ومعزولة"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("about.why.todayDesc")}
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs text-rose-200">
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{language === "en" ? "CV stored isolated on hard drive or PDF" : "السيرة الذاتية مجرد ملف PDF منفصل في جهازك"}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs text-rose-200">
                  <Briefcase className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{language === "en" ? "Jobs posted on generic job boards" : "إعلانات الوظائف تائهة في مواقع الإعلانات العامة"}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs text-rose-200">
                  <Bot className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{language === "en" ? "Blackbox AI tools rating applicants without explanation" : "أدوات الفرز الآلي تحرم الباحث دون إبداء أسباب"}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Middle Transform Arrow Indicator (2 cols) */}
          <div className="lg:col-span-2 flex items-center justify-center py-4 lg:py-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-accent text-white flex items-center justify-center font-bold shadow-xl shadow-primary/30 border border-white/20">
              <ArrowIcon className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Faeda: Connected Ecosystem (5 cols) */}
          <div className="lg:col-span-5">
            <GlassCard className="h-full p-6 sm:p-8 bg-primary/10 border-primary/30 text-start space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">{t("about.why.faedaHeader")}</h3>
                    <span className="text-[11px] text-primary font-mono font-bold">
                      {language === "en" ? "One Connected Ecosystem" : "منظومة مترابطة شفافة"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/90 leading-relaxed font-medium">
                {t("about.why.faedaDesc")}
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-primary/20 flex items-center gap-3 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === "en" ? "Dynamic verified identity driving opportunities" : "هوية مهنية ديناميكية تقودك للفرص المناسبة"}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-primary/20 flex items-center gap-3 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === "en" ? "Explainable AI matching with real recommendations" : "ذكاء اصطناعي مفسر يوضح سبب التوافق بدقة"}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-primary/20 flex items-center gap-3 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === "en" ? "Integrated capabilities & team discovery" : "استقطاب قدرات تخصصية وفرق عمل متكاملة"}</span>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  )
}
