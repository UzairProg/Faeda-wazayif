/**
 * NextBestActions.tsx — Dynamic prioritized recommended actions based on real candidate state.
 */
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import type { DashboardNextAction } from "../../types/candidate.types"
import {
  Sparkles,
  FileText,
  Briefcase,
  FolderGit2,
  GraduationCap,
  SlidersHorizontal,
  Compass,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

interface NextBestActionsProps {
  actions: DashboardNextAction[]
}

export function NextBestActions({ actions }: NextBestActionsProps) {
  const { t, isRTL } = useTranslation()

  if (!actions || actions.length === 0) {
    return null
  }

  const getActionIcon = (type: DashboardNextAction["type"]) => {
    switch (type) {
      case "cv":
        return FileText
      case "skills":
        return Briefcase
      case "projects":
        return FolderGit2
      case "education":
        return GraduationCap
      case "preferences":
        return SlidersHorizontal
      case "jobs":
        return Compass
      default:
        return Sparkles
    }
  }

  const getPriorityBadge = (priority: DashboardNextAction["priority"]) => {
    switch (priority) {
      case "urgent":
        return {
          label: t("candidate.dashboard.nextActions.urgentBadge"),
          className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        }
      case "high":
        return {
          label: t("candidate.dashboard.nextActions.highBadge"),
          className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        }
      case "medium":
        return {
          label: t("candidate.dashboard.nextActions.mediumBadge"),
          className: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        }
      case "low":
      default:
        return {
          label: t("candidate.dashboard.nextActions.lowBadge"),
          className: "bg-slate-800 text-slate-400 border-slate-700/50",
        }
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading leading-tight">
              {t("candidate.dashboard.nextActions.title")}
            </h2>
            <p className="text-[11px] text-slate-400">
              {t("candidate.dashboard.nextActions.subtitle")}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-medium self-start sm:self-auto">
          {actions.length} {isRTL ? "خطوات موصى بها" : "recommended moves"}
        </span>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = getActionIcon(action.type)
          const priority = getPriorityBadge(action.priority)

          return (
            <div
              key={action.id}
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${priority.className}`}
                  >
                    {priority.label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-heading group-hover:text-primary transition-colors">
                    {isRTL ? action.title_ar : action.title_en}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {isRTL ? action.desc_ar : action.desc_en}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80">
                <Link
                  to={action.action_url}
                  className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-primary text-slate-200 hover:text-white text-xs font-semibold transition-all group/btn"
                >
                  <span>{isRTL ? action.action_label_ar : action.action_label_en}</span>
                  {isRTL ? (
                    <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  )}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
