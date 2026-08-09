/**
 * features/public/components/MarketValueShowcaseSection.tsx
 *
 * Market value estimation showcase section for Home page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { TrendingUp, CheckCircle2, AlertCircle, Info, Sparkles, Layers, ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function MarketValueShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "why" | "actions">("overview")
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const demoInputs = language === "en" ? [
    { label: "Work Experience", val: "5 Years (Software Engineering)", status: "Strong" },
    { label: "Verified Skills", val: "React, TypeScript, Node.js, Python", status: "High Demand" },
    { label: "Academic Degree", val: "B.Sc. Computer Science", status: "Completed" },
    { label: "Market Demand", val: "Saudi Market (Riyadh / Remote)", status: "Very High" },
  ] : [
    { label: "الخبرة العملية", val: "5 سنوات (تطوير برمجيات)", status: "قوي" },
    { label: "المهارات المحققة", val: "React, TypeScript, Node.js, Python", status: "مطلوب جداً" },
    { label: "المؤهل الأكاديمي", val: "بكالوريوس علوم حاسب", status: "مكتمل" },
    { label: "حجم الطلب بالسوق", val: "السوق السعودي (الرياض/عن بعد)", status: "مرتفع" },
  ]

  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col items-start text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>{t("public.marketValueShowcase.badge")}</span>
            </div>

            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              {t("public.marketValueShowcase.title")}
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("public.marketValueShowcase.subtitle")}
            </p>

            <div className="space-y-4 mb-8 w-full">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card/40 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {language === "en" ? "Real Data Benchmark" : "تقدير مبني على البيانات الحقيقية"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Matches qualifications with real market standards without opaque algorithms." : "ربط مؤهلاتك ومعايير سوق العمل الإقليمي دون خوارزميات مجهولة."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card/40 border border-white/5">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {language === "en" ? "'Why This Score?' Section" : "قسم 'لماذا هذه النتيجة؟'"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Transparent explanation of strengths and growth points impacting salary." : "شرح شفاف لنقاط القوة ونقاط النمو التي تؤثر مباشرة على راتبك."}
                  </p>
                </div>
              </div>
            </div>

            <Link to={ROUTES.AUTH.REGISTER}>
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
                <span>{t("public.marketValueShowcase.cta")}</span>
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right Product Demo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <TiltCard className="rounded-[2rem]" tiltMaxAngle={5} shineOpacityMax={0.15}>
              <GlassCard className="p-7 sm:p-10 bg-card/60 border-white/10 shadow-2xl relative overflow-hidden text-start">
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold font-heading text-white text-lg sm:text-xl">
                        {language === "en" ? "Market Value Report" : "تقرير القيمة السوقية"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {language === "en" ? "Senior Frontend Engineer • Riyadh" : "مهندس برمجيات واجهات قدير • الرياض"}
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground font-mono">
                    {language === "en" ? "Live Sample" : "مثال توضيحي"}
                  </span>
                </div>

                <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-card to-card border border-primary/30 mb-6 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm text-primary font-bold tracking-wider uppercase block mb-1">
                        {language === "en" ? "Expected Monthly Salary (SAR / Month)" : "نطاق الراتب المتوقع بالسوق (SAR / شهرياً)"}
                      </span>
                      <p className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                        22,000 – 28,000 <span className="text-base font-sans font-normal text-muted-foreground">{language === "en" ? "SAR" : "ر.س"}</span>
                      </p>
                    </div>
                    <div className="px-3.5 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-bold shrink-0">
                      {language === "en" ? "High Market Competitiveness" : "مستوى تنافسي مرتفع"}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-3">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "overview" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {language === "en" ? "Evaluation Inputs" : "مدخلات التقييم"}
                  </button>
                  <button
                    onClick={() => setActiveTab("why")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "why" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {language === "en" ? "Why this score?" : "لماذا هذه النتيجة؟"}
                  </button>
                  <button
                    onClick={() => setActiveTab("actions")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "actions" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {language === "en" ? "Growth Actions (+15%)" : "فرص زيادة القيمة (+15%)"}
                  </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                    >
                      {demoInputs.map((inp) => (
                        <div key={inp.label} className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-xs sm:text-sm text-muted-foreground block mb-1">{inp.label}</span>
                          <p className="text-sm sm:text-base font-bold text-white mb-1">{inp.val}</p>
                          <span className="text-xs text-primary font-semibold">{inp.status}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "why" && (
                    <motion.div
                      key="why"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3.5 mb-4 text-xs sm:text-sm"
                    >
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-white flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>
                          {language === "en"
                            ? "High proficiency in React & TypeScript matching in-demand Tech specs in Riyadh."
                            : "امتلاك مهارات React و TypeScript المطلوبة بشدة في مشاريع النواحي التقنية بالرياض."}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-white flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>
                          {language === "en"
                            ? "Missing documented System Architecture leadership experience limits upper ceiling."
                            : "عدم توثيق مشاريع سابقة في إدارة تصميم الأنظمة (System Architecture) يقلل السقف الأعلى."}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "actions" && (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3.5 mb-4 text-xs sm:text-sm"
                    >
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-primary shrink-0" />
                          <span>{language === "en" ? "Add certified Cloud Architecture credential (AWS/Azure)" : "إضافة شهادة معتمدة في Cloud Architecture (AWS/Azure)"}</span>
                        </div>
                        <span className="text-primary font-mono font-bold shrink-0">+2,500 SAR</span>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-primary shrink-0" />
                          <span>{language === "en" ? "Highlight team lead experience in past roles" : "إبراز قيادة فرق برمجية صغيرة في خانة الخبرات"}</span>
                        </div>
                        <span className="text-primary font-mono font-bold shrink-0">+1,800 SAR</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </GlassCard>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
