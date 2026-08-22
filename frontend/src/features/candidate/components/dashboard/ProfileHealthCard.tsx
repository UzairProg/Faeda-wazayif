/**
 * ProfileHealthCard.tsx — Profile strength, ATS readiness score, and structured health metrics.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { ProfileHealthData } from "../../types/candidate.types"
import {
  Activity,
  FileText,
  Briefcase,
  FolderGit2,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react"

interface ProfileHealthCardProps {
  health: ProfileHealthData
}

export function ProfileHealthCard({ health }: ProfileHealthCardProps) {
  const { t, isRTL } = useTranslation()

  const percentage = health.percentage || 0
  const atsScore = health.ats_score || 0

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between h-full">
      {/* Top indicator bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-sky-400 opacity-80" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading leading-tight">
                {t("candidate.dashboard.profileHealth.title")}
              </h2>
              <span className="text-[11px] text-slate-400">
                {t("candidate.dashboard.profileHealth.strength")}
              </span>
            </div>
          </div>

          <span className="text-sm font-extrabold text-primary font-heading px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-5">
          <div className="h-3 w-full rounded-full bg-slate-800/80 p-0.5 overflow-hidden border border-slate-700/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{t("candidate.dashboard.profileHealth.strength")}</span>
            <span className="font-semibold text-slate-200">
              {isRTL ? `${percentage}% من 100%` : `${percentage}% of 100%`}
            </span>
          </div>
        </div>

        {/* Metric Chips (Skills, Projects, Certs, CV) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {/* Skills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center">
            <Briefcase className="w-4 h-4 text-primary mx-auto mb-1 opacity-80" />
            <span className="text-lg font-bold text-white font-heading block">
              {health.skills_count}
            </span>
            <span className="text-[10px] text-slate-400">
              {t("candidate.dashboard.profileHealth.metrics.skills")}
            </span>
          </div>

          {/* Projects */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center">
            <FolderGit2 className="w-4 h-4 text-sky-400 mx-auto mb-1 opacity-80" />
            <span className="text-lg font-bold text-white font-heading block">
              {health.projects_count}
            </span>
            <span className="text-[10px] text-slate-400">
              {t("candidate.dashboard.profileHealth.metrics.projects")}
            </span>
          </div>

          {/* Certifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1 opacity-80" />
            <span className="text-lg font-bold text-white font-heading block">
              {health.certifications_count}
            </span>
            <span className="text-[10px] text-slate-400">
              {t("candidate.dashboard.profileHealth.metrics.certifications")}
            </span>
          </div>

          {/* CV Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-center">
            <FileText className={`w-4 h-4 mx-auto mb-1 ${health.cv_uploaded ? "text-emerald-400" : "text-slate-400"}`} />
            <span className={`text-xs font-bold font-heading block mt-1 ${health.cv_uploaded ? "text-emerald-400" : "text-slate-400"}`}>
              {health.cv_uploaded
                ? t("candidate.dashboard.profileHealth.metrics.cvUploaded")
                : t("candidate.dashboard.profileHealth.metrics.cvMissing")}
            </span>
            <span className="text-[10px] text-slate-400">
              {t("candidate.dashboard.profileHealth.metrics.cv")}
            </span>
          </div>
        </div>

        {/* ATS Readiness Preview Pill */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-slate-900/40 to-sky-900/10 p-3.5 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-heading block">
                {t("candidate.dashboard.profileHealth.atsScore")}
              </span>
              <span className="text-[10px] text-slate-400">
                {t("candidate.dashboard.profileHealth.atsNote")}
              </span>
            </div>
          </div>

          <span className="text-sm font-extrabold text-sky-400 font-heading px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20">
            {health.cv_uploaded ? `${atsScore}/100` : "—"}
          </span>
        </div>
      </div>

      {/* Checklist footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <Link
          to={ROUTES.CANDIDATE.PROFILE}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all group"
        >
          <span>{t("candidate.dashboard.profileHealth.completeNow")}</span>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </div>
  )
}
