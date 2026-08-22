import React from "react"
import { Link } from "react-router-dom"
import {
  MapPin,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import type { CompanyJob } from "../types/company.types"
import { ROUTES } from "@/config/routes"

interface JobCardProps {
  job: CompanyJob
  onEdit?: (job: CompanyJob) => void
  onDelete?: (jobId: number) => void
  isRtl?: boolean
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  isRtl = true,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label_ar: "منشورة ونشطة",
          label_en: "Active & Published",
          cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        }
      case "pending":
        return {
          label_ar: "قيد المراجعة",
          label_en: "Pending Approval",
          cls: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        }
      case "draft":
        return {
          label_ar: "مسودة",
          label_en: "Draft",
          cls: "bg-slate-500/10 border-slate-500/30 text-slate-400",
        }
      case "closed":
      default:
        return {
          label_ar: "مغلقة",
          label_en: "Closed",
          cls: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        }
    }
  }

  const badge = getStatusBadge(job.status)

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/90 shadow-md flex flex-col justify-between"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div>
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${badge.cls}`}
              >
                {isRtl ? badge.label_ar : badge.label_en}
              </span>
              {job.isFeatured && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  {isRtl ? "مميزة" : "Featured"}
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
          </div>

          {/* Quick Actions Dropdown / Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(job)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isRtl ? "تعديل الوظيفة" : "Edit Job"}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(job.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={isRtl ? "حذف الوظيفة" : "Delete Job"}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-slate-500" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {job.town || job.location} ({job.workplace})
            </span>
          </div>
          {job.salary.isDisclosed && (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <DollarSign className="h-3.5 w-3.5" />
              <span>
                {job.salary.min ? `${job.salary.min.toLocaleString()}` : ""}{" "}
                {job.salary.max ? `- ${job.salary.max.toLocaleString()}` : ""}{" "}
                {job.salary.currency}
              </span>
            </div>
          )}
        </div>

        {/* Required skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {job.requiredSkills.slice(0, 5).map((sk: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[11px]"
              >
                {sk}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                +{job.requiredSkills.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Applicant statistics & Pipeline link */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-300 font-semibold">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              {job.applicantsCount}{" "}
              <span className="text-slate-400 font-normal">
                {isRtl ? "متقدم" : "applicants"}
              </span>
            </span>
          </div>

          {job.shortlistedCount > 0 && (
            <span className="hidden sm:inline text-teal-400 text-[11px]">
              {job.shortlistedCount} {isRtl ? "مرشح" : "shortlisted"}
            </span>
          )}
        </div>

        <Link
          to={`${ROUTES.COMPANY.APPLICATIONS}?job_id=${job.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>{isRtl ? "عرض المتقدمين والفرز" : "Review Pipeline"}</span>
          {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </div>
  )
}
