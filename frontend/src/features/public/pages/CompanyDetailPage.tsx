/**
 * features/public/pages/CompanyDetailPage.tsx
 *
 * Public company profile detail page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useRef } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Building2, MapPin, CheckCircle2, Briefcase, ExternalLink, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, ShieldCheck
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useCompanyDetail } from "@/features/companies/hooks/useCompanies"
import { CompanyDetailSkeleton } from "@/features/companies/components/CompanySkeleton"
import { JobCard } from "@/features/public/components/JobCard"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { getLocalizedCompanyName, formatLocalizedNumber } from "@/lib/localization.utils"

function getAvatarGradient(idStr: string): string {
  const gradients = [
    "from-primary/30 to-blue-600/20 border-primary/40 text-primary",
    "from-emerald-500/30 to-teal-700/20 border-emerald-500/40 text-emerald-400",
    "from-indigo-500/30 to-purple-700/20 border-indigo-500/40 text-indigo-400",
    "from-cyan-500/30 to-blue-700/20 border-cyan-500/40 text-cyan-400",
    "from-amber-500/30 to-orange-700/20 border-amber-500/40 text-amber-400",
  ]
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % gradients.length
  return gradients[idx]
}

function getCompanyInitials(name: string): string {
  const clean = name.trim().replace(/^(شركة|مركز|مؤسسة|مجموعة)\s+/, "")
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.substring(0, 2).toUpperCase()
}

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { company, isLoading, error } = useCompanyDetail(id)
  const { t, language, isRTL } = useTranslation()
  const jobsSectionRef = useRef<HTMLDivElement>(null)

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  if (isLoading) {
    return (
      <div className="flex flex-col w-full bg-background min-h-screen relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <CompanyDetailSkeleton />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-24 pb-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
            <Building2 className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">{t("companies.states.notFoundTitle")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("companies.states.notFoundSubtitle")}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={ROUTES.COMPANIES.LIST}>
              <Button className="rounded-xl px-6 bg-primary text-white font-bold text-xs sm:text-sm">
                {t("companies.detail.backToList")}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const companyName = getLocalizedCompanyName(company, language)
  const gradientStyle = getAvatarGradient(company.id)
  const initials = getCompanyInitials(companyName)

  const unspecLabel = language === "en" ? "Not specified" : language === "hi" ? "निर्दिष्ट नहीं" : "غير محدد"
  const saudiLabel = language === "en" ? "Saudi Arabia" : language === "hi" ? "सऊदी अरब" : "المملكة العربية السعودية"

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to={ROUTES.COMPANIES.LIST} className="hover:text-white transition-colors flex items-center gap-1">
            <span>{t("companies.header.title")}</span>
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/30" />
          <span className="text-white font-medium truncate">{companyName}</span>
        </div>

        {/* Company Header Card */}
        <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            <div className="flex items-start gap-5 min-w-0">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={companyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/10 shrink-0 bg-black/40 shadow-xl"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLElement).style.display = "none"
                  }}
                />
              ) : (
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-bold text-2xl sm:text-3xl font-heading shrink-0 shadow-inner ${gradientStyle}`}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {company.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("companies.detail.verified")}</span>
                    </span>
                  )}

                  {company.companyField && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{company.companyField}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
                  {companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{company.location || company.country || saudiLabel}</span>
                  </span>

                  {company.companySize && (
                    <span className="before:content-['•'] before:me-2 before:text-white/20">
                      {company.companySize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end shrink-0">
              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm gap-2 hover:bg-white/10">
                    <ExternalLink className="w-4 h-4" />
                    <span>{t("companies.detail.viewWebsite")}</span>
                  </Button>
                </a>
              )}

              <Button
                onClick={scrollToJobs}
                size="lg"
                className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20"
              >
                <Briefcase className="w-4 h-4" />
                <span>{t("companies.detail.viewJobsCta")} ({formatLocalizedNumber(company.jobs.length, language)})</span>
              </Button>
            </div>

          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.verificationStatus")}</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {company.isVerified ? t("companies.detail.verified") : t("companies.detail.unverified")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.openJobsTitle")}</span>
              <span className="font-bold text-white">{t("companies.list.openJobsCount", { count: company.jobs.length })}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.field")}</span>
              <span className="font-bold text-white truncate block">{company.companyField || unspecLabel}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.size")}</span>
              <span className="font-bold text-white truncate block">{company.companySize || unspecLabel}</span>
            </div>
          </div>
        </GlassCard>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* About */}
            <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-3">
              <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>{t("companies.detail.aboutTitle")}</span>
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">
                {company.description || t("companies.detail.noAboutText")}
              </p>
            </GlassCard>

            {/* Jobs */}
            <div ref={jobsSectionRef} className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>{t("companies.detail.openJobsTitle")}</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                    {formatLocalizedNumber(company.jobs.length, language)}
                  </span>
                </h2>
              </div>

              {company.jobs.length > 0 ? (
                <div className="space-y-4">
                  {company.jobs.map((job, idx) => (
                    <JobCard key={job.id} job={job} index={idx} />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-8 text-center bg-card/40 border-white/10 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
                    <Briefcase className="w-6 h-6 opacity-60" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{t("companies.detail.noOpenJobs")}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    {t("companies.detail.joinCtaSubtitle")}
                  </p>
                  <Link to={ROUTES.JOBS.LIST}>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                      {t("companies.detail.browseAllJobs")}
                    </Button>
                  </Link>
                </GlassCard>
              )}
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-5">
              <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-white/10">
                {t("companies.detail.infoTitle")}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.field")}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    {company.companyField || unspecLabel}
                  </p>
                </div>

                {company.companyType && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.type")}</span>
                    <p className="font-semibold text-white">{company.companyType}</p>
                  </div>
                )}

                {company.companySize && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.size")}</span>
                    <p className="font-bold text-white">{company.companySize}</p>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.location")}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {company.location || company.country || saudiLabel}
                  </p>
                </div>

                {company.website && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-muted-foreground text-[11px] block mb-1">{t("companies.detail.website")}</span>
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-mono truncate block"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-start space-y-3">
              <h4 className="font-extrabold font-heading text-white text-base">
                {t("companies.detail.joinCtaTitle")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("companies.detail.joinCtaSubtitle")}
              </p>
              <Button
                onClick={scrollToJobs}
                size="sm"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 mt-2"
              >
                <span>{t("companies.detail.viewJobsCta")}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Button>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  )
}
