import React from "react"
import { Sparkles, CheckCircle2, AlertCircle, UserPlus, Layers, Zap } from "lucide-react"
import type { CandidateTeamDetail, TeamCapabilityGap } from "../../types/candidate.types"

interface TeamCapabilityMatrixProps {
  team: CandidateTeamDetail
  onFindTalentForGap?: (gap: TeamCapabilityGap) => void
  isOwnerOfTeam: boolean
  isRtl?: boolean
}

export const TeamCapabilityMatrix: React.FC<TeamCapabilityMatrixProps> = ({
  team,
  onFindTalentForGap,
  isOwnerOfTeam,
  isRtl = true,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Combined Capabilities Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="mb-4 flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isRtl ? "مصفوفة القدرات والمهارات المجمعة" : "Combined Capability Matrix"}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? "يتم اشتقاق هذه القدرات تلقائياً من المهارات الموثقة لجميع أعضاء الفريق"
                  : "Automatically derived from verified member skills across the team"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            {team.capabilities?.length || 0} {isRtl ? "قدرة مجمعة" : "capabilities"}
          </span>
        </div>

        {/* Capabilities Grid */}
        <div className="flex flex-wrap gap-2">
          {team.capabilities && team.capabilities.length > 0 ? (
            team.capabilities.map((cap, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm transition-transform hover:scale-105 hover:border-emerald-500/40"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {cap}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400">
              {isRtl ? "لا توجد مهارات مجمعة بعد. قم بدعوة أعضاء للفريق لتفعيل القدرات." : "No capabilities yet."}
            </p>
          )}
        </div>

        {/* Member-Derived vs Declared Legend */}
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-700/50 pt-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isRtl ? "المسارات الرسمية للفريق:" : "Team Focus Tracks:"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[team.generalProgram, team.specialProgram, team.semiSpecialProgram]
                .filter(Boolean)
                .map((track, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                  >
                    {track}
                  </span>
                ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>{isRtl ? "المهارات المشتقة من الأعضاء:" : "Member-Derived Skills:"}</span>
            </div>
            <p className="line-clamp-2 text-xs text-slate-400">
              {team.memberDerivedCapabilities && team.memberDerivedCapabilities.length > 0
                ? team.memberDerivedCapabilities.join(" • ")
                : isRtl
                ? "مستمدة من سير الأعضاء الذاتية"
                : "Derived from member profiles"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Complementary Gaps & Opportunity Recommendations */}
      {team.potentialGaps && team.potentialGaps.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isRtl ? "فرص التكامل واكتمال قدرات الفريق (Capability Gaps)" : "Complementary Capability Opportunities"}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? "توصيات ذكية لإكمال المهارات الناقصة في الفريق لتأهيلكم لمشاريع أوسع"
                  : "Smart recommendations to complete your squad capabilities"}
              </p>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-1 md:grid-cols-3">
            {team.potentialGaps.map((gap, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 p-4 transition-colors hover:border-amber-500/40"
              >
                <div>
                  <span className="inline-block rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                    {gap.trackAr}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {gap.reasonAr}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {gap.suggestedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded border border-slate-700 bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-400"
                      >
                        +{s}
                      </span>
                    ))}
                  </div>
                </div>

                {isOwnerOfTeam && onFindTalentForGap && (
                  <div className="mt-4 border-t border-slate-700/50 pt-3">
                    <button
                      type="button"
                      onClick={() => onFindTalentForGap(gap)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{isRtl ? "بحث عن كفاءات في هذا المسار" : "Find Talent for Gap"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
