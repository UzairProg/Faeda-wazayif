/**
 * features/public/components/FeaturedJobsSection.tsx
 *
 * Featured jobs interactive section for public home page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Sparkles, ArrowLeft, ArrowRight, Building2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function FeaturedJobsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { t, language, isRTL } = useTranslation()

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const NextChevron = isRTL ? ChevronLeft : ChevronRight
  const PrevChevron = isRTL ? ChevronRight : ChevronLeft

  const sampleOpportunities = [
    {
      id: "demo-1",
      title: language === "en" ? "Senior Frontend Engineer" : "مهندس واجهات أُمامية أول (Senior Frontend)",
      company: language === "en" ? "Leading Tech & Energy Co." : "شركة طاقة وتقنية رائدة",
      location: language === "en" ? "Dhahran, Saudi Arabia" : "الظهران، السعودية",
      salary: language === "en" ? "SAR 28,000 – 35,000" : "28,000 – 35,000 ر.س",
      type: language === "en" ? "Full-time" : "دوام كامل",
      fitReason: language === "en" ? "Great match with your React, TypeScript, and complex systems experience." : "تطابق ممتاز مع مهاراتك في React و TypeScript والأنظمة المعقدة.",
      fitBadge: language === "en" ? "High Skill Match" : "مطابقة عالية للمهارات",
      teamFriendly: true,
    },
    {
      id: "demo-2",
      title: language === "en" ? "UI/UX Architect" : "مصمم تجربة المستخدم (UI/UX Architect)",
      company: language === "en" ? "Digital Solutions Group" : "مجموعة حلول رقمية",
      location: language === "en" ? "Riyadh, Saudi Arabia" : "الرياض، السعودية",
      salary: language === "en" ? "SAR 20,000 – 26,000" : "20,000 – 26,000 ر.س",
      type: language === "en" ? "Full-time" : "دوام كامل",
      fitReason: language === "en" ? "Fits your expertise in Design Systems and unified architecture." : "مناسب لخبرتك وتخصصك في تصميم الأنظمة الموحدة (Design Systems).",
      fitBadge: language === "en" ? "Trajectory Fit" : "مناسب لمسارك المفضل",
      teamFriendly: false,
    },
    {
      id: "demo-3",
      title: language === "en" ? "Data & AI Analyst" : "محلل بيانات وذكاء اصطناعي",
      company: language === "en" ? "Future Innovation Inst." : "مؤسسة ابتكار مستقبلي",
      location: language === "en" ? "Remote" : "عن بعد",
      salary: language === "en" ? "Upon Interview" : "حسب المقابلة",
      type: language === "en" ? "Flexible Contract" : "عقد مرن",
      fitReason: language === "en" ? "Great growth opportunity to develop deep learning models." : "فرصة ممتازة لتطوير مهارات التعلم العميق في بيئة عمل مرنة.",
      fitBadge: language === "en" ? "Growth Opportunity" : "فرصة نمو مهارية",
      teamFriendly: true,
    },
  ]

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sampleOpportunities.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [isPaused, sampleOpportunities.length])

  const nextJob = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleOpportunities.length)
    setIsPaused(true)
  }

  const prevJob = () => {
    setCurrentIndex((prev) => (prev - 1 + sampleOpportunities.length) % sampleOpportunities.length)
    setIsPaused(true)
  }

  const currentOpp = sampleOpportunities[currentIndex]

  return (
    <section
      className="py-20 bg-background border-t border-white/5 relative overflow-hidden text-start"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-end justify-between mb-8 gap-4">
          <div className="text-start max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("public.jobs.sectionTitle")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {t("public.jobs.sectionSubtitle")}
            </h2>
          </div>

          <Link to={ROUTES.JOBS.LIST}>
            <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white text-xs gap-1.5 font-bold">
              <span>{t("public.jobs.viewAll")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Interactive Job Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOpp.id}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
            transition={{ duration: 0.35 }}
            className="max-w-6xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">

                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl font-heading shrink-0">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-3 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-xs sm:text-sm font-bold text-primary">
                          {currentOpp.fitBadge}
                        </span>
                        {currentOpp.teamFriendly && (
                          <span className="px-3 py-0.5 rounded-md bg-secondary/10 border border-secondary/20 text-xs sm:text-sm font-bold text-secondary">
                            {t("jobs.filters.teamFriendly")}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{currentOpp.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{currentOpp.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 self-end md:self-auto">
                    <span className="text-sm sm:text-base font-mono text-white font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                      {currentOpp.salary}
                    </span>
                    <Link to={ROUTES.JOBS.LIST}>
                      <Button size="sm" className="rounded-xl px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm">
                        {t("jobs.card.apply")}
                      </Button>
                    </Link>
                  </div>

                </div>

                {/* Qualitative Reason & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center mb-6">
                  <div className="md:col-span-8 p-5 sm:p-6 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-primary block mb-0.5">
                        {language === "en" ? "Recommendation Reasoning:" : "سبب الترشيح:"}
                      </span>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{currentOpp.fitReason}</p>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-wrap gap-2.5 justify-start md:justify-end text-xs sm:text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                      <MapPin className="w-4 h-4 text-primary" /> {currentOpp.location}
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                      <Clock className="w-4 h-4 text-primary" /> {currentOpp.type}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sampleOpportunities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx)
                          setIsPaused(true)
                        }}
                        className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? "w-10 bg-primary" : "w-2.5 bg-white/20 hover:bg-white/40"}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={prevJob}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                      aria-label="Previous job"
                    >
                      <PrevChevron className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextJob}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                      aria-label="Next job"
                    >
                      <NextChevron className="w-5 h-5" />
                    </button>
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
