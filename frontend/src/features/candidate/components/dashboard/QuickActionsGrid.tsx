/**
 * QuickActionsGrid.tsx — Quick shortcuts to key features and honest placeholders for upcoming modules.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import {
  Compass,
  User,
  FileText,
  Users,
  Briefcase,
  Bookmark,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export function QuickActionsGrid() {
  const { t, isRTL } = useTranslation()

  const actions = [
    {
      to: ROUTES.CANDIDATE.JOBS,
      icon: Compass,
      title: t("candidate.dashboard.quickActions.exploreJobs"),
      desc: t("candidate.dashboard.quickActions.exploreJobsDesc"),
      color: "text-primary bg-primary/10 border-primary/20",
      isLive: true,
    },
    {
      to: ROUTES.CANDIDATE.PROFILE,
      icon: User,
      title: t("candidate.dashboard.quickActions.editProfile"),
      desc: t("candidate.dashboard.quickActions.editProfileDesc"),
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      isLive: true,
    },
    {
      to: `${ROUTES.CANDIDATE.PROFILE}?section=cv`,
      icon: FileText,
      title: t("candidate.dashboard.quickActions.cvHub"),
      desc: t("candidate.dashboard.quickActions.cvHubDesc"),
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      isLive: true,
    },
    {
      to: ROUTES.CANDIDATE.TEAMS,
      icon: Users,
      title: t("candidate.dashboard.quickActions.myTeams"),
      desc: t("candidate.dashboard.quickActions.myTeamsDesc"),
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      isLive: true,
    },
    {
      to: ROUTES.CANDIDATE.APPLICATIONS,
      icon: Briefcase,
      title: t("candidate.dashboard.quickActions.applications"),
      desc: t("candidate.dashboard.quickActions.applicationsDesc"),
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      isLive: true,
    },
    {
      to: ROUTES.CANDIDATE.SAVED_JOBS,
      icon: Bookmark,
      title: t("candidate.dashboard.quickActions.savedJobs"),
      desc: t("candidate.dashboard.quickActions.savedJobsDesc"),
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      isLive: true,
    },
    {
      to: "#shop",
      icon: ShoppingBag,
      title: t("candidate.dashboard.quickActions.shop"),
      desc: t("candidate.dashboard.quickActions.shopDesc"),
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      isLive: false,
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white font-heading">
          {t("candidate.dashboard.quickActions.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon

          if (!act.isLive) {
            return (
              <div
                key={act.title}
                className="relative rounded-2xl border border-slate-800/60 bg-slate-900/30 p-4 flex flex-col justify-between opacity-75 select-none"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${act.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                    {t("common.states.comingSoon")}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300 block">{act.title}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{act.desc}</span>
                </div>
              </div>
            )
          }

          return (
            <Link
              key={act.title}
              to={act.to}
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700 p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${act.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors block">
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{act.desc}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
