import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Sparkles, ArrowLeft, Building2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

const sampleOpportunities = [
  {
    id: "demo-1",
    title: "مهندس واجهات أُمامية أول (Senior Frontend)",
    company: "شركة طاقة وتقنية رائدة",
    location: "الظهران، السعودية",
    salary: "28,000 – 35,000 ر.س",
    type: "دوام كامل",
    fitReason: "تطابق ممتاز مع مهاراتك في React و TypeScript والأنظمة المعقدة.",
    fitBadge: "مطابقة عالية للمهارات",
    teamFriendly: true,
  },
  {
    id: "demo-2",
    title: "مصمم تجربة المستخدم (UI/UX Architect)",
    company: "مجموعة حلول رقمية",
    location: "الرياض، السعودية",
    salary: "20,000 – 26,000 ر.س",
    type: "دوام كامل",
    fitReason: "مناسب لخبرتك وتخصصك في تصميم الأنظمة الموحدة (Design Systems).",
    fitBadge: "مناسب لمسارك المفضل",
    teamFriendly: false,
  },
  {
    id: "demo-3",
    title: "محلل بيانات وذكاء اصطناعي",
    company: "مؤسسة ابتكار مستقبلي",
    location: "عن بعد",
    salary: "حسب المقابلة",
    type: "عقد مرن",
    fitReason: "فرصة ممتازة لتطوير مهارات التعلم العميق في بيئة عمل مرنة.",
    fitBadge: "فرصة نمو مهارية",
    teamFriendly: true,
  },
]

export function FeaturedJobsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sampleOpportunities.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [isPaused])

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
      className="py-20 bg-background border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-end justify-between mb-8 gap-4">
          <div className="text-start max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ترشيحات واضحة الأسباب</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              فرص تناسب هويتك ومسارك المهني
            </h2>
          </div>

          <Link to={ROUTES.JOBS.LIST}>
            <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white text-xs gap-1.5 font-bold">
              تصفح كل الفرص <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Single Primary Interactive Job UI Carousel Mockup */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOpp.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-6">

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl font-heading shrink-0">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
                          {currentOpp.fitBadge}
                        </span>
                        {currentOpp.teamFriendly && (
                          <span className="px-2.5 py-0.5 rounded-md bg-secondary/10 border border-secondary/20 text-[11px] font-bold text-secondary">
                            مناسب للفرق
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">{currentOpp.title}</h3>
                      <p className="text-xs text-muted-foreground">{currentOpp.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="text-sm font-mono text-white font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                      {currentOpp.salary}
                    </span>
                    <Link to={ROUTES.JOBS.LIST}>
                      <Button size="sm" className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                        تقدم للفرصة
                      </Button>
                    </Link>
                  </div>

                </div>

                {/* Qualitative Reason & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6">
                  <div className="md:col-span-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-primary block mb-0.5">سبب الترشيح:</span>
                      <p className="text-xs text-white/90 leading-relaxed">{currentOpp.fitReason}</p>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-wrap gap-2 justify-start md:justify-end text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {currentOpp.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {currentOpp.type}
                    </span>
                  </div>
                </div>

                {/* Convenient Prominent Bottom Carousel Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {sampleOpportunities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx)
                          setIsPaused(true)
                        }}
                        className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevJob}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                      aria-label="Previous job"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextJob}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                      aria-label="Next job"
                    >
                      <ChevronLeft className="w-4 h-4" />
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
