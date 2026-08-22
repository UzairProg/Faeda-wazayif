/**
 * DashboardWelcomeHeader.tsx — Top welcome and candidate summary banner for Command Center.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { CandidateSummaryData } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"
import {
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Briefcase,
  Layers,
} from "lucide-react"

interface DashboardWelcomeHeaderProps {
  candidate: CandidateSummaryData
  percentage: number
}

export function DashboardWelcomeHeader({
  candidate,
  percentage,
}: DashboardWelcomeHeaderProps) {
  const { t, isRTL } = useTranslation()
  const avatarUrl = candidateService.getImageUrl(candidate.avatar)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/90 via-[#0a101d]/90 to-[#070b14]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar & Candidate Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/30 via-slate-800 to-slate-900 border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-xl sm:text-2xl shadow-xl overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={candidate.name || "Candidate"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{candidate.name ? candidate.name.slice(0, 2).toUpperCase() : "FA"}</span>
              )}
            </div>
            {candidate.verification.is_verified && (
              <div
                className="absolute -bottom-1.5 -right-1.5 p-1 rounded-lg bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                title={t("candidate.shell.status.verified")}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Text details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                {t("candidate.dashboard.welcome", { name: candidate.name || "عزيزي المرشح" })}
              </h1>
              {candidate.verification.is_verified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t("candidate.shell.status.verified")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  {t("candidate.shell.status.active")}
                </span>
              )}
            </div>

            {/* Headline / About */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed line-clamp-2">
              {candidate.headline || candidate.about || t("candidate.dashboard.welcomeSub")}
            </p>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{percentage}% {isRTL ? "مكتمل" : "completed"}</span>
              </span>
              {candidate.specialization && (
                <span className="inline-flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/40">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="text-slate-200">{candidate.specialization}</span>
                </span>
              )}
              {candidate.experience && (
                <span className="inline-flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/40">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-200">{candidate.experience}</span>
                </span>
              )}
              {candidate.location && (
                <span className="inline-flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/40">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{candidate.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick CTA buttons */}
        <div className="flex flex-row sm:flex-wrap lg:flex-col gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
          <Link
            to={ROUTES.CANDIDATE.PROFILE}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <User className="w-4 h-4" />
            <span>{t("candidate.dashboard.viewProfileBtn")}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>

          <Link
            to={ROUTES.JOBS.LIST}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 text-slate-200 text-xs font-semibold border border-slate-700/60 hover:bg-slate-700/80 hover:text-white transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{t("candidate.dashboard.quickActions.exploreJobs")}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
