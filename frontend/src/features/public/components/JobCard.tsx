/**
 * features/public/components/JobCard.tsx
 *
 * Reusable job card for the public Jobs page and any other job list context.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, Clock, Bookmark, Calendar, Users, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import {
  getLocalizedWorkType,
  getLocalizedExperienceLevel,
  getLocalizedCompanyName,
  formatLocalizedSalary,
  formatLocalizedDate,
} from "@/lib/localization.utils"
import type { Job } from "@/features/jobs/types/job.types"

function CompanyAvatar({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-12 h-12 rounded-xl object-contain bg-white p-1"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = "none"
        }}
      />
    )
  }
  const letter = name.charAt(0).toUpperCase()
  return (
    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl font-heading shrink-0">
      {letter}
    </div>
  )
}

interface JobCardProps {
  job: Job
  index?: number
  className?: string
}

export function JobCard({ job, index = 0, className }: JobCardProps) {
  const { t, language, isRTL } = useTranslation()

  const companyName = getLocalizedCompanyName(job.company, language)
  const workTypeLabel = getLocalizedWorkType(job.workType, language)
  const expLabel = getLocalizedExperienceLevel(job.experienceLevel, language)
  const salaryText = job.salary?.isDisclosed
    ? formatLocalizedSalary(job.salary.min, job.salary.max, language)
    : null
  const postedDate = formatLocalizedDate(job.postedAt, language)

  const visibleSkills = job.skills.slice(0, 4)
  const remainingSkills = job.skills.length - visibleSkills.length
  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      className={cn(
        "group relative bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl text-start",
        "hover:border-white/10 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/10",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      <div className="p-6">
        {/* Header: Company + Title + Save */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyAvatar name={companyName} logoUrl={job.company.logoUrl} />
            <div className="min-w-0">
              <h3 className="font-bold font-heading text-white text-base leading-tight mb-1 group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{companyName}</p>
            </div>
          </div>

          <button
            className="shrink-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
            aria-label={t("jobs.card.save")}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Meta Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              {job.isRemote ? (language === "en" ? "Remote" : language === "hi" ? "रिमोट" : "عن بعد") : job.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            {workTypeLabel}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-muted-foreground">
            {expLabel}
          </span>
          {job.isTeamFriendly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-xs text-secondary font-semibold">
              <Users className="w-3 h-3 shrink-0" />
              {t("jobs.filters.teamFriendly")}
            </span>
          )}
        </div>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs">
                +{remainingSkills}
              </span>
            )}
          </div>
        )}

        {/* Footer: Salary + Date + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
          <div className="min-w-0">
            {salaryText ? (
              <p className="text-sm font-semibold text-white font-mono truncate">{salaryText}</p>
            ) : (
              <p className="text-xs text-muted-foreground/60">{t("jobs.card.salaryNotDisclosed")}</p>
            )}
            <div className="flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <span className="text-xs text-muted-foreground/50">
                {postedDate}
              </span>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 gap-1"
          >
            <Link to={ROUTES.JOBS.DETAIL(job.id)}>
              <span>{t("jobs.card.viewDetails")}</span>
              <ChevronIcon className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
