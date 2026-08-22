/**
 * ProfileCompletionCard.tsx — Transparent Profile Completeness & Strength Module.
 */
import { useTranslation } from "@/i18n"
import type { CandidateProfile } from "../types/candidate.types"
import { CheckCircle2, Circle, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react"

interface ProfileCompletionCardProps {
  profile: CandidateProfile
  onActionClick?: (key: string) => void
}

export function ProfileCompletionCard({
  profile,
  onActionClick,
}: ProfileCompletionCardProps) {
  const { t } = useTranslation()
  const completion = profile.completion || {
    percentage: 30,
    checklist: [],
  }

  const checklist = completion.checklist || []
  const percentage = completion.percentage || 0
  const isComplete = percentage >= 100

  // Find first uncompleted task
  const nextTask = checklist.find((item) => !item.completed)

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1424] to-[#0a101d] p-6 sm:p-7 shadow-xl">
      {/* Header with circular / progress display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-[14px] bg-[#0c1424] flex items-center justify-center font-black text-sm text-primary font-heading">
              {percentage}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {t("candidate.profile.completion.title")}
              </h2>
              {isComplete && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  مكتمل 100%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
              {isComplete
                ? t("candidate.profile.completion.allComplete")
                : t("candidate.profile.completion.desc")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-44 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {t("candidate.profile.completion.strength")}
            </span>
            <span className="font-bold text-white">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isComplete
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-primary to-sky-400"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Next Step Banner if not complete */}
      {!isComplete && nextTask && (
        <div className="mt-4 p-3.5 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <span className="font-bold text-primary">
                {t("candidate.profile.completion.nextAction")}
              </span>
              <span>{nextTask.label}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onActionClick?.(nextTask.key)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shrink-0"
          >
            <span>إكمال الآن</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Transparent Criteria Checklist */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {checklist.map((item) => (
          <div
            key={item.key}
            onClick={() => !item.completed && onActionClick?.(item.key)}
            className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
              item.completed
                ? "bg-slate-900/40 border-slate-800/80 text-slate-300"
                : "bg-slate-900/80 border-slate-800 hover:border-primary/40 hover:bg-slate-800/60 text-slate-200 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={item.completed ? "font-medium line-through text-slate-400" : "font-semibold"}>
                {item.label}
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              +{item.weight}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
