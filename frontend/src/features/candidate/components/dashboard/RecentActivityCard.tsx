/**
 * RecentActivityCard.tsx — Real career timeline and transparent activity history.
 */
import { useTranslation } from "@/i18n"
import type { DashboardActivityItem } from "../../types/candidate.types"
import { Clock, CheckCircle2, FileCheck, History } from "lucide-react"

interface RecentActivityCardProps {
  activity: DashboardActivityItem[]
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  const { t, isRTL } = useTranslation()

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return isoString
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading leading-tight">
              {t("candidate.dashboard.activity.title")}
            </h2>
            <span className="text-[11px] text-slate-400">
              {activity.length} {isRTL ? "أحداث مسجلة" : "events recorded"}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline or Empty State */}
      {activity && activity.length > 0 ? (
        <div className="space-y-3">
          {activity.map((item, idx) => {
            const isApp = item.type === "job_application"

            return (
              <div
                key={item.id || idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/70"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isApp
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {isApp ? <FileCheck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {isRTL ? item.title_ar : item.title_en}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.timestamp)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed truncate">
                    {isRTL ? item.desc_ar : item.desc_en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-6 text-center space-y-2">
          <History className="w-6 h-6 text-slate-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-300 font-heading">
            {t("candidate.dashboard.activity.emptyTitle")}
          </h4>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t("candidate.dashboard.activity.emptyDesc")}
          </p>
        </div>
      )}
    </div>
  )
}
