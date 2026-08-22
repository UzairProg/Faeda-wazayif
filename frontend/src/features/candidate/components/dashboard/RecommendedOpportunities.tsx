/**
 * RecommendedOpportunities.tsx — Real job recommendations for Candidate Command Center.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { RecommendedJobItem } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"
import {
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Coins,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

interface RecommendedOpportunitiesProps {
  jobs: RecommendedJobItem[]
}

export function RecommendedOpportunities({ jobs }: RecommendedOpportunitiesProps) {
  const { t, isRTL } = useTranslation()

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading leading-tight">
              {t("candidate.dashboard.recommendations.title")}
            </h2>
            <p className="text-[11px] text-slate-400">
              {t("candidate.dashboard.recommendations.subtitle")}
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.CANDIDATE.JOBS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/90 transition-colors self-start sm:self-auto"
        >
          <span>{t("candidate.dashboard.recommendations.viewAll")}</span>
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Link>
      </div>

      {/* Jobs Grid or Empty State */}
      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const companyLogo = candidateService.getImageUrl(job.company.logoUrl || undefined)

            return (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Top row: Company & Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
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

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-slate-300">
                            {job.company.name}
                          </span>
                          {job.company.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                        </div>
                        {job.location && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{job.location}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {job.matchScore && job.matchScore > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                        <Sparkles className="w-3 h-3" />
                        <span>{Math.round(job.matchScore)}%</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white font-heading group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
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
                </div>

                {/* Footer link to job detail */}
                <div className="pt-4 mt-3 border-t border-slate-800/80">
                  <Link
                    to={ROUTES.CANDIDATE.JOB_DETAIL(job.id)}
                    className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-primary text-slate-200 hover:text-white text-xs font-semibold transition-all group/link"
                  >
                    <span>{t("candidate.dashboard.recommendations.viewJob")}</span>
                    {isRTL ? (
                      <ChevronLeft className="w-4 h-4 group-link:-translate-x-1 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 group-link:translate-x-1 transition-transform" />
                    )}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white font-heading">
            {t("candidate.dashboard.recommendations.emptyTitle")}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t("candidate.dashboard.recommendations.emptyDesc")}
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.CANDIDATE.PROFILE}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              <span>{t("candidate.dashboard.recommendations.completeProfileBtn")}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
