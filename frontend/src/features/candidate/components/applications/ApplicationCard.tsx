/**
 * ApplicationCard.tsx — Single submitted application card for Candidate Applications list.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { CandidateApplicationItem } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"
import {
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Briefcase,
} from "lucide-react"

interface ApplicationCardProps {
  application: CandidateApplicationItem
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { isRTL } = useTranslation()

  const companyLogo = candidateService.getImageUrl(application.company.logoUrl || undefined)

  const formatAppliedDate = (isoString: string | null) => {
    if (!isoString) return "—"
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return isoString
    }
  }

  const getStatusBadgeClass = (key: CandidateApplicationItem["statusKey"]) => {
    switch (key) {
      case "under_review":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30"
      case "shortlisted":
        return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
      case "interview":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30"
      case "accepted":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      case "rejected":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30"
      case "applied":
      default:
        return "bg-sky-500/15 text-sky-400 border-sky-500/30"
    }
  }

  return (
    <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-850 hover:border-slate-700/80 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Top: Company Logo & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={application.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {application.company.name}
                </span>
                {application.company.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                )}
              </div>

              {application.job?.location && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{application.job.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${getStatusBadgeClass(
              application.statusKey
            )}`}
          >
            {isRTL ? application.statusLabelAr : application.statusLabelEn}
          </span>
        </div>

        {/* Job Title */}
        <div>
          <Link
            to={ROUTES.CANDIDATE.APPLICATION_DETAIL(application.id)}
            className="text-base font-bold text-white font-heading group-hover:text-primary transition-colors line-clamp-1 block mb-1"
          >
            {application.job?.title || (isRTL ? "وظيفة شاغرة" : "Opportunity")}
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isRTL ? "تاريخ التقديم:" : "Applied on:"} {formatAppliedDate(application.appliedAt)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer link to detail */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        {application.job?.id ? (
          <Link
            to={ROUTES.CANDIDATE.JOB_DETAIL(application.job.id)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isRTL ? "عرض الإعلان" : "View Job"}</span>
          </Link>
        ) : <div />}

        <Link
          to={ROUTES.CANDIDATE.APPLICATION_DETAIL(application.id)}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/90 transition-colors"
        >
          <span>{isRTL ? "تفاصيل الطلب" : "Application Details"}</span>
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  )
}
