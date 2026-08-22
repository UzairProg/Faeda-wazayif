import React from "react"
import { Users, Layers, Sparkles, ArrowLeft, ArrowRight } from "lucide-react"
import type { CompanyTeamItem } from "../types/company.types"

interface CompanyTeamCardProps {
  team: CompanyTeamItem
  onView: (team: CompanyTeamItem) => void
  isRtl?: boolean
}

export const CompanyTeamCard: React.FC<CompanyTeamCardProps> = ({
  team,
  onView,
  isRtl = true,
}) => {
  return (
    <div
      className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-emerald-500/40 hover:bg-slate-900/90 shadow-lg flex flex-col justify-between"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-lg overflow-hidden shadow-inner">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Layers className="h-7 w-7" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                {team.specialization}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {team.name}
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
            <Users className="h-3.5 w-3.5" />
            <span>
              {team.memberCount} {isRtl ? "أعضاء" : "members"}
            </span>
          </span>
        </div>

        {/* About */}
        {team.about && (
          <p className="mt-4 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {team.about}
          </p>
        )}

        {/* Combined Capabilities Matrix */}
        {team.capabilities && team.capabilities.length > 0 && (
          <div className="mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {isRtl ? "مصفوفة القدرات المشتركة" : "Combined Capability Matrix"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {team.capabilities.slice(0, 6).map((cap: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium"
                >
                  {cap}
                </span>
              ))}
              {team.capabilities.length > 6 && (
                <span className="px-2 py-0.5 text-slate-500 text-[11px]">
                  +{team.capabilities.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Members Avatars preview */}
        {team.members && team.members.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
              {team.members.slice(0, 5).map((m: any, idx: number) => (
                <div
                  key={idx}
                  title={`${m.name} (${m.headline})`}
                  className="h-8 w-8 rounded-full border-2 border-[#090e1a] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-200 overflow-hidden"
                >
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    m.name.slice(0, 2)
                  )}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-slate-400">
              {team.members.map((m: any) => m.name.split(" ")[0]).join("، ")}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{isRtl ? "فريق مهني جاهز للتعاقد" : "Contract-ready Squad"}</span>
        </span>

        <button
          type="button"
          onClick={() => onView(team)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>{isRtl ? "تفاصيل الفريق والأعضاء" : "Squad Details"}</span>
          {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
