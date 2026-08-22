import React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, CheckCircle2, Circle, ArrowLeft, ArrowRight } from "lucide-react"
import { ROUTES } from "@/config/routes"
import type { UniversityCompleteness } from "../types/university.types"

interface UniversityProfileHealthCardProps {
  completeness?: UniversityCompleteness
  isRtl?: boolean
}

export const UniversityProfileHealthCard: React.FC<UniversityProfileHealthCardProps> = ({
  completeness,
  isRtl = true,
}) => {
  if (!completeness) return null

  const percentage = completeness.percentage || 0
  const isHealthy = percentage >= 80

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900/50 to-[#070b14]/80 p-6 backdrop-blur-xl shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {isRtl ? "مؤشر اكتمال وهوية الصرح الأكاديمي" : "Academic Profile Health & Verification"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl
                ? `${completeness.completed_factors} من أصل ${completeness.total_factors} عناصر مكتملة في السجل الرسمي`
                : `${completeness.completed_factors} of ${completeness.total_factors} official institution fields complete`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isHealthy
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            }`}
          >
            {percentage}% {isRtl ? "مكتمل" : "Complete"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isHealthy
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50"
                : "bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400 shadow-sm shadow-indigo-500/50"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {completeness.checklist?.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
              item.is_completed
                ? "border-indigo-500/20 bg-indigo-500/5 text-slate-200"
                : "border-slate-800 bg-slate-900/30 text-slate-500"
            }`}
          >
            {item.is_completed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-600 shrink-0" />
            )}
            <span className="text-[11px] font-medium truncate">{item.label_ar}</span>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4">
        <span className="text-[11px] text-slate-400">
          {isRtl
            ? "الملفات الأكاديمية الموثقة تمنح خريجي الجامعة مصداقية وأولوية قصوى لدى الشركات."
            : "Verified academic profiles provide your graduates with certified credibility for top employers."}
        </span>

        <Link
          to={ROUTES.UNIVERSITY.PROFILE}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
        >
          <span>{isRtl ? "تعديل الملف المؤسسي" : "Edit Profile"}</span>
          {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </div>
  )
}
