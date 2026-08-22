/**
 * CandidateJobCard.tsx — Specialized Job Card for Candidate Workspace.
 * Displays real job data, match score (if computed), save bookmark toggle, and application status.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { CandidateJobItem } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"
import { useCandidateJobActions } from "../../hooks/useCandidateJobActions"
import {
  Building2,
  MapPin,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Coins,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Briefcase,
  Clock,
} from "lucide-react"

interface CandidateJobCardProps {
  job: CandidateJobItem
  onApplyClick?: (job: CandidateJobItem) => void
}

export function CandidateJobCard({ job, onApplyClick }: CandidateJobCardProps) {
  const { isRTL } = useTranslation()
  const { saveJob, unsaveJob, isSaving, isUnsaving } = useCandidateJobActions()

  const companyLogo = candidateService.getImageUrl(job.company.logoUrl || undefined)
  const isBookmarked = Boolean(job.isSaved)
  const hasApplied = Boolean(job.hasApplied)

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isBookmarked) {
      await unsaveJob(job.id)
    } else {
      await saveJob(job.id)
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
      })
    } catch {
      return ""
    }
  }

  return (
    <div className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-850 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Top row: Company details + Match score + Bookmark */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={job.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {job.company.name}
                </span>
                {job.company.isVerified && (
                  <span title="شركة موثقة">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {job.location && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </span>
                )}
                {job.postedAt && (
                  <span className="flex items-center gap-1 shrink-0 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(job.postedAt)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {job.matchScore && job.matchScore > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                <Sparkles className="w-3 h-3" />
                <span>{Math.round(job.matchScore)}%</span>
              </span>
            ) : null}

            <button
              type="button"
              onClick={handleBookmarkToggle}
              disabled={isSaving || isUnsaving}
              className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                isBookmarked
                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700"
              }`}
              title={isBookmarked ? (isRTL ? "إزالة من المحفوظات" : "Remove bookmark") : (isRTL ? "حفظ الوظيفة" : "Save job")}
              aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Job Title & Excerpt */}
        <div>
          <Link
            to={ROUTES.CANDIDATE.JOB_DETAIL(job.id)}
            className="text-sm sm:text-base font-bold text-white font-heading group-hover:text-primary transition-colors line-clamp-1 block mb-1"
          >
            {job.title}
          </Link>
          {job.excerpt && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {job.excerpt}
            </p>
          )}
        </div>

        {/* Tags (Workplace, Work Type, Salary) */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
          {job.workType && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
              {job.workType}
            </span>
          )}
          {job.isRemote && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {isRTL ? "عن بعد" : "Remote"}
            </span>
          )}
          {job.salary && job.salary.isDisclosed && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 font-medium border border-slate-700/50 flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-400" />
              <span>
                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} SAR
              </span>
            </span>
          )}
        </div>

        {/* Skills Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {job.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/40"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[10px] text-slate-400">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA and Application Status */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {hasApplied ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{job.applicationStatus || (isRTL ? "تم التقديم" : "Applied")}</span>
          </div>
        ) : onApplyClick ? (
          <button
            type="button"
            onClick={() => onApplyClick(job)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isRTL ? "تقديم سريع" : "Quick Apply"}</span>
          </button>
        ) : (
          <div />
        )}

        <Link
          to={ROUTES.CANDIDATE.JOB_DETAIL(job.id)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <span>{isRTL ? "التفاصيل" : "Details"}</span>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </div>
  )
}
