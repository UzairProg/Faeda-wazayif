/**
 * features/public/pages/JobDetailPage.tsx
 *
 * Public job detail view.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  MapPin, Clock, Calendar, Users, ChevronRight, ChevronLeft,
  Building2, Briefcase, CheckCircle2, ArrowLeft, ArrowRight, Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { EmptyState } from "@/shared/components/states/EmptyState"
import { useJobDetail } from "@/features/jobs/hooks/useJobDetail"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import {
  getLocalizedWorkType,
  getLocalizedExperienceLevel,
  getLocalizedCompanyName,
  formatLocalizedSalary,
  formatLocalizedDate,
} from "@/lib/localization.utils"
import type { JobDetail } from "@/features/jobs/types/job.types"
import { cn } from "@/lib/utils"

/* ─── Apply Gate ────────────────────────────────────────── */

function ApplyGate({ jobId }: { jobId: string }) {
  const { isAuthenticated } = useAuthStore()
  const { t, language } = useTranslation()

  if (isAuthenticated) {
    return (
      <Button
        size="lg"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 h-12"
        onClick={() => {
          alert(
            language === "en"
              ? "Application feature is being prepared. It will be enabled soon."
              : language === "hi"
              ? "आवेदन सुविधा तैयार की जा रही है। इसे जल्द ही सक्षम किया जाएगा।"
              : "خاصية التقديم قيد الإعداد. سيتم تفعيلها قريباً."
          )
        }}
      >
        {t("jobs.detail.applyNow")}
      </Button>
    )
  }

  return (
    <div className="bg-card/60 border border-white/10 rounded-2xl p-6 text-center">
      <h3 className="font-bold font-heading text-white mb-2">{t("jobs.detail.applyGate.title")}</h3>
      <p className="text-muted-foreground text-sm mb-6">
        {t("jobs.detail.applyGate.subtitle")}
      </p>
      <div className="flex flex-col gap-3">
        <Button
          asChild
          size="lg"
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm"
        >
          <Link
            to={ROUTES.AUTH.REGISTER}
            state={{ from: `/jobs/${jobId}`, intent: "apply" }}
          >
            {t("jobs.detail.applyGate.registerCta")}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs sm:text-sm"
        >
          <Link
            to={ROUTES.AUTH.LOGIN}
            state={{ from: `/jobs/${jobId}`, intent: "apply" }}
          >
            {t("jobs.detail.applyGate.loginCta")}
          </Link>
        </Button>
      </div>
    </div>
  )
}

/* ─── Detail Content ────────────────────────────────────── */

function JobDetailContent({ job }: { job: JobDetail }) {
  const { t, language, isRTL } = useTranslation()

  const companyName = getLocalizedCompanyName(job.company, language)
  const workTypeLabel = getLocalizedWorkType(job.workType, language)
  const expLabel = getLocalizedExperienceLevel(job.experienceLevel, language)
  const salaryText = job.salary?.isDisclosed
    ? formatLocalizedSalary(job.salary.min, job.salary.max, language)
    : null
  const postedDate = formatLocalizedDate(job.postedAt, language)

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const BackArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-start">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to={ROUTES.PUBLIC.HOME} className="hover:text-white transition-colors">{t("common.nav.home")}</Link>
        <ChevronIcon className="w-3 h-3 text-white/30" />
        <Link to={ROUTES.JOBS.LIST} className="hover:text-white transition-colors">{t("common.nav.jobs")}</Link>
        <ChevronIcon className="w-3 h-3 text-white/30" />
        <span className="text-white truncate max-w-xs">{job.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 min-w-0"
        >
          {/* Job Header Card */}
          <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {job.company.logoUrl ? (
                <img
                  src={job.company.logoUrl}
                  alt={companyName}
                  className="w-14 h-14 rounded-xl object-contain bg-white p-1 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl font-heading shrink-0">
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-1 leading-tight">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground">{companyName}</p>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 mb-6">
              {job.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {job.isRemote
                    ? (language === "en" ? `Remote (${job.location})` : language === "hi" ? `रिमोट (${job.location})` : `عن بعد (${job.location})`)
                    : job.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                {workTypeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 shrink-0" />
                {expLabel}
              </span>
              {job.isTeamFriendly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-secondary font-semibold">
                  <Users className="w-4 h-4 shrink-0" />
                  {t("jobs.filters.teamFriendly")}
                </span>
              )}
            </div>

            {/* Salary */}
            {salaryText && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{t("jobs.filters.salary")}</p>
                <p className="text-xl font-extrabold text-white font-mono">{salaryText}</p>
              </div>
            )}

            {/* Posted date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Calendar className="w-3.5 h-3.5" />
              {t("jobs.card.postedOn")} {postedDate}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-4">{t("jobs.detail.about")}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-5">{t("jobs.detail.responsibilities")}</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-5">{t("jobs.detail.requirements")}</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {job.skills.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-4">{t("jobs.detail.skills")}</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Company Summary */}
          <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading text-white mb-4">{t("jobs.detail.aboutCompany")}</h2>
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-white font-semibold">{companyName}</span>
              {job.company.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {t("companies.detail.verified")}
                </span>
              )}
            </div>
            {job.company.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {job.company.location}
              </p>
            )}
          </section>
        </motion.div>

        {/* Sticky Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn("w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4")}
        >
          <ApplyGate jobId={job.id} />

          <button
            onClick={() => navigator.share?.({ title: job.title, url: window.location.href })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <Share2 className="w-4 h-4" />
            {language === "en" ? "Share Job" : language === "hi" ? "नौकरी साझा करें" : "مشاركة الوظيفة"}
          </button>

          <Link
            to={ROUTES.JOBS.LIST}
            className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-white transition-colors font-semibold"
          >
            <BackArrowIcon className="w-4 h-4" />
            {language === "en" ? "Back to Jobs List" : language === "hi" ? "नौकरी सूची पर वापस जाएं" : "العودة لقائمة الوظائف"}
          </Link>
        </motion.aside>
      </div>
    </div>
  )
}

/* ─── Page Entry Point ──────────────────────────────────── */

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { job, isLoading, isError, isNotFound } = useJobDetail(id ?? "")
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <LoadingState variant="page" />
      </div>
    )
  }

  if (isNotFound) {
    return (
      <EmptyState
        title={t("jobs.detail.notFound")}
        description={t("jobs.detail.expired")}
        action={
          <Button asChild className="rounded-full mt-2">
            <Link to={ROUTES.JOBS.LIST}>{t("common.nav.jobs")}</Link>
          </Button>
        }
      />
    )
  }

  if (isError || !job) {
    return (
      <ErrorState
        description={t("jobs.search.error")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <JobDetailContent job={job} />
    </div>
  )
}
