import React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, CheckCircle2, Circle, ArrowLeft, ArrowRight } from "lucide-react"
import type { CompanyCompleteness } from "../types/company.types"
import { ROUTES } from "@/config/routes"

interface CompanyProfileHealthCardProps {
  completeness?: CompanyCompleteness
  isRtl?: boolean
}

export const CompanyProfileHealthCard: React.FC<CompanyProfileHealthCardProps> = ({
  completeness,
  isRtl = true,
}) => {
  if (!completeness) return null

  const { percentage, items, completedCount, totalCount, isComplete } = completeness

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              {isRtl ? "اكتمال وموثوقية ملف المنشأة" : "Company Profile Health"}
            </h3>
            <p className="text-xs text-slate-400">
              {isRtl
                ? `${completedCount} من أصل ${totalCount} متطلبات مكتملة`
                : `${completedCount} of ${totalCount} items completed`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right rtl:text-left">
            <span className="text-xl font-black text-emerald-400">{percentage}%</span>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-700 p-1 flex items-center justify-center">
            <div
              className={`h-full w-full rounded-full transition-all ${
                isComplete ? "bg-emerald-500" : "bg-emerald-500/40"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs transition-colors ${
              item.isCompleted
                ? "border-emerald-500/20 bg-emerald-500/5 text-slate-200"
                : "border-slate-800 bg-slate-900/40 text-slate-400"
            }`}
          >
            {item.isCompleted ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-slate-600" />
            )}
            <span className="truncate">{isRtl ? item.title_ar : item.title_en}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-700/50 pt-4">
        <span className="text-[11px] text-slate-400">
          {isRtl
            ? "الملفات المكتملة تحصل على ظهور مضاعف في نتائج استكشاف الكفاءات والوظائف."
            : "Complete profiles get higher visibility in talent search and job listings."}
        </span>

        <Link
          to={ROUTES.COMPANY.PROFILE}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
        >
          <span>{isRtl ? "استكمال البيانات" : "Complete Profile"}</span>
          {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </div>
  )
}
