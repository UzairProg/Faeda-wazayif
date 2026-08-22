/**
 * features/public/components/about/AudienceSwitcher.tsx
 *
 * Interactive role switcher explaining who Faeda is built for.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserCheck, Building2, Users, GraduationCap, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { cn } from "@/lib/utils"

export function AudienceSwitcher() {
  const { t, language, isRTL } = useTranslation()
  const [activeTab, setActiveTab] = useState<"candidates" | "employers" | "teams" | "education">("candidates")

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const contentMap = {
    candidates: {
      title: t("about.audience.tabCandidates"),
      icon: UserCheck,
      badge: language === "en" ? "For Professionals" : "للكفاءات والباحثين",
      heading: language === "en" ? "Build your professional identity & discover your real market value." : "أنشئ هويتك المهنية واعرف قيمتك الحقيقية.",
      bullets: language === "en" ? [
        "ATS readiness check and skill coverage analysis",
        "Direct search across verified positions with explainable match",
        "Team creation to offer collective capabilities to employers"
      ] : [
        "فحص جاهزية السيرة الذاتية (ATS) وتحليل التغطية المهارية",
        "بحث مباشر في الفرص الموثوقة مع توضيح أسباب التوافق",
        "تأسيس فريق تخصصي لتقديم قدرات متكاملة لأصحاب العمل"
      ],
      ctaText: t("common.nav.jobs"),
      ctaLink: ROUTES.JOBS.LIST,
    },
    employers: {
      title: t("about.audience.tabEmployers"),
      icon: Building2,
      badge: language === "en" ? "For Companies & Employers" : "للشركات وأصحاب العمل",
      heading: language === "en" ? "Recruit top verified talent & whole specialized teams." : "استقطب الكفاءات الموثوقة والفرق التخصصية.",
      bullets: language === "en" ? [
        "Verified organization badge & clear employer presentation",
        "Publish open positions with transparent requirements",
        "Discover ready-to-execute specialized team capabilities"
      ] : [
        "توثيق حساب المنشأة وإبراز بيئة العمل بشكل احترافي",
        "نشر الفرص الوظيفية مع تحديد المعايير والمهارات بدقة",
        "استكشاف قدرات الفرق التخصصية الجاهزة للتنفيذ المباشر"
      ],
      ctaText: t("common.nav.companies"),
      ctaLink: ROUTES.COMPANIES.LIST,
    },
    teams: {
      title: t("about.audience.tabTeams"),
      icon: Users,
      badge: language === "en" ? "For Specialized Teams" : "للفرق التخصصية",
      heading: language === "en" ? "Hire capabilities, not just individual roles." : "استقطب قدرات متكاملة لتنفيذ المشاريع المعقدة.",
      bullets: language === "en" ? [
        "Form multi-disciplinary teams directly from candidate accounts",
        "Present combined skills and team portfolio to employers",
        "Discover job opportunities suited for team contracting"
      ] : [
        "تشكيل فريق متعدد التخصصات من حسابات مرشحين متعددة",
        "عرض السجل والمهارات المجمعة في بروفايل واحد عام",
        "اكتشاف الفرص المخصصة للفرق والاستجابة السريعة لها"
      ],
      ctaText: t("common.nav.teams"),
      ctaLink: ROUTES.TEAMS.LIST,
    },
    education: {
      title: t("about.audience.tabEducation"),
      icon: GraduationCap,
      badge: language === "en" ? "For Educational Institutions" : "للمؤسسات التعليمية والجامعات",
      heading: language === "en" ? "Bridge academic education with real labor market demands." : "ربط مخرجات التعليم باحتياجات سوق العمل الحقيقية.",
      bullets: language === "en" ? [
        "Skill-gap alignment between academic programs and live jobs",
        "Empower graduates to transition into active candidate profiles",
        "Comprehensive academic verification and student dossier management"
      ] : [
        "تحليل الفجوة بين المناهج الأكاديمية والمهارات المطلوبة بالسوق",
        "تمكين الخريجين من إبراز جاهزيتهم المهنية فور التخرج",
        "إدارة التحقق الأكاديمي الشامل وملفات الطلاب المعتمدة"
      ],
      ctaText: language === "en" ? "University Portal" : "بوابة المؤسسات التعليمية",
      ctaLink: ROUTES.AUTH.LOGIN,
    },
  }

  const current = contentMap[activeTab]
  const IconComp = current.icon

  return (
    <section className="py-16 text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <span>{t("about.audience.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight">
            {t("about.audience.title")}
          </h2>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(["candidates", "employers", "teams", "education"] as const).map((key) => {
            const item = contentMap[key]
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2",
                  active
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-card/40 border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Tab Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 sm:p-12 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{current.badge}</span>
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
                    {current.heading}
                  </h3>

                  <ul className="space-y-3 pt-2">
                    {current.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <Link to={current.ctaLink}>
                      <Button size="lg" className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2">
                        <span>{current.ctaText}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-primary/20 via-blue-600/10 to-accent/20 border border-primary/30 flex items-center justify-center text-primary shadow-2xl">
                    <IconComp className="w-16 h-16 opacity-90" />
                  </div>
                </div>

              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
