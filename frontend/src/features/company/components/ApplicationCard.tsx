import React from "react"
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle2,
  Eye,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import type { CompanyApplicationItem } from "../types/company.types"

interface ApplicationCardProps {
  application: CompanyApplicationItem
  onViewCandidate: (app: CompanyApplicationItem) => void
  onChangeStatus: (app: CompanyApplicationItem) => void
  isRtl?: boolean
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewCandidate,
  onChangeStatus,
  isRtl = true,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return {
          label_ar: "جديد / تم التقديم",
          label_en: "New Applied",
          cls: "bg-sky-500/10 border-sky-500/30 text-sky-400",
        }
      case "under_review":
        return {
          label_ar: "قيد المراجعة",
          label_en: "Under Review",
          cls: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        }
      case "shortlisted":
        return {
          label_ar: "مرشح للمقابلة",
          label_en: "Shortlisted",
          cls: "bg-teal-500/10 border-teal-500/30 text-teal-400",
        }
      case "interview":
        return {
          label_ar: "مرحلة المقابلة",
          label_en: "Interview",
          cls: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        }
      case "accepted":
        return {
          label_ar: "تم القبول النهائي",
          label_en: "Hired / Accepted",
          cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        }
      case "rejected":
      default:
        return {
          label_ar: "مستبعد / غير مؤهل",
          label_en: "Rejected",
          cls: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        }
    }
  }

  const badge = getStatusBadge(application.status)
  const cand = application.candidate

  return (
    <div
      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/90 shadow-md flex flex-col justify-between"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div>
        {/* Header: Candidate summary & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 rounded-2xl border border-slate-700 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm overflow-hidden">
              {cand.avatarUrl ? (
                <img
                  src={cand.avatarUrl}
                  alt={cand.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                cand.name.slice(0, 2)
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {cand.name}
                </h3>
                {cand.isVerified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{cand.headline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeStatus(application)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all hover:scale-105 ${badge.cls}`}
          >
            <span>{isRtl ? badge.label_ar : badge.label_en}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Applied for job banner */}
        <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-400">{isRtl ? "متقدم لوظيفة:" : "Applied for:"}</span>
            <span className="font-semibold text-white truncate">
              {application.job.title}
            </span>
          </div>
          {application.appliedAt && (
            <span className="text-[10px] text-slate-500 shrink-0">
              {new Date(application.appliedAt).toLocaleDateString(
                isRtl ? "ar-SA" : "en-US"
              )}
            </span>
          )}
        </div>

        {/* Meta credentials */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>{cand.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {cand.yearsOfExperience} {isRtl ? "خبرة" : "exp"}
            </span>
          </div>
          {cand.education?.qualification && (
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
              <span>{cand.education.qualification}</span>
            </div>
          )}
        </div>

        {/* Skills preview */}
        {cand.skills && cand.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {cand.skills.slice(0, 4).map((sk: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-300 text-[10px]"
              >
                {sk}
              </span>
            ))}
            {cand.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                +{cand.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: View Candidate profile */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
        {cand.marketBenchmark ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold">{cand.marketBenchmark.tier}</span>
            <span className="text-slate-500 text-[10px]">
              ({cand.marketBenchmark.score}/100)
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">
            {isRtl ? "ملف مهني موثق" : "Verified Profile"}
          </span>
        )}

        <button
          type="button"
          onClick={() => onViewCandidate(application)}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{isRtl ? "عرض السيرة والملف" : "View Details"}</span>
        </button>
      </div>
    </div>
  )
}
