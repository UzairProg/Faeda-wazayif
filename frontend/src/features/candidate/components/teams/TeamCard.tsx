import React from "react"
import { Link } from "react-router-dom"
import { Users, Sparkles, Briefcase, ChevronLeft, Crown, Shield } from "lucide-react"
import type { CandidateTeamSummary } from "../../types/candidate.types"
import { ROUTES } from "@/config/routes"

interface TeamCardProps {
  team: CandidateTeamSummary
  isRtl?: boolean
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, isRtl = true }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10">
      {/* Background Accent Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-teal-500/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700/80 bg-slate-800 font-bold text-white shadow-inner">
            {team.logoUrl ? (
              <img
                src={team.logoUrl}
                alt={team.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-lg font-bold text-white">
                {team.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-emerald-400">
                {team.name}
              </h3>
              {team.isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                  <Crown className="h-3 w-3" />
                  {isRtl ? "قائد ومؤسس" : "Owner"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                  <Shield className="h-3 w-3" />
                  {isRtl ? "عضو فريق" : "Member"}
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-400">
              {team.specialization}
            </p>
          </div>
        </div>

        {/* Member Count Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
          <Users className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            {team.memberCount} {isRtl ? "أعضاء" : "members"}
          </span>
        </div>
      </div>

      {/* Description */}
      {team.about && (
        <p className="relative z-10 mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">
          {team.about}
        </p>
      )}

      {/* Capabilities Tags */}
      {team.capabilities && team.capabilities.length > 0 && (
        <div className="relative z-10 mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isRtl ? "القدرات والمهارات المجمعة:" : "Combined Capabilities:"}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {team.capabilities.slice(0, 5).map((cap, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-xs font-medium text-slate-300"
              >
                {cap}
              </span>
            ))}
            {team.capabilities.length > 5 && (
              <span className="rounded-md border border-slate-700/60 bg-slate-800/30 px-2 py-0.5 text-xs text-slate-400">
                +{team.capabilities.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Info & Actions */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {team.openOpportunitiesCount > 0 ? (
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <Briefcase className="h-3.5 w-3.5" />
              {team.openOpportunitiesCount} {isRtl ? "فرصة ملائمة" : "compatible jobs"}
            </span>
          ) : (
            <span className="text-slate-500">
              {isRtl ? "مساحة عمل احترافية" : "Professional workspace"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.CANDIDATE.TEAM_DETAIL(team.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500"
          >
            <span>{isRtl ? "إدارة الفريق" : "Manage Team"}</span>
            <ChevronLeft className={`h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 ${!isRtl ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </div>
  )
}
