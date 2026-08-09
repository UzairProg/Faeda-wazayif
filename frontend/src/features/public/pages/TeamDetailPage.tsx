/**
 * features/public/pages/TeamDetailPage.tsx
 *
 * Public Team profile detail page.
 * Displays capability breakdown, team members roster, opportunities suited for teams,
 * and leadership specs. Fully localized for Arabic (RTL) and English (LTR).
 */
import { useParams, Link } from "react-router-dom"
import {
  Users, MapPin, Layers, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, UserCheck
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useTeamDetail } from "@/features/teams/hooks/useTeams"
import { TeamDetailSkeleton } from "@/features/teams/components/TeamSkeleton"
import { JobCard } from "@/features/public/components/JobCard"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"
import type { Job } from "@/features/jobs/types/job.types"

function getAvatarGradient(idStr: string): string {
  const gradients = [
    "from-primary/30 to-blue-600/20 border-primary/40 text-primary",
    "from-emerald-500/30 to-teal-700/20 border-emerald-500/40 text-emerald-400",
    "from-indigo-500/30 to-purple-700/20 border-indigo-500/40 text-indigo-400",
    "from-cyan-500/30 to-blue-700/20 border-cyan-500/40 text-cyan-400",
    "from-amber-500/30 to-orange-700/20 border-amber-500/40 text-amber-400",
  ]
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % gradients.length
  return gradients[idx]
}

function getTeamInitials(name: string): string {
  const clean = name.trim().replace(/^(فريق|مجموعة|مختبر|استوديو)\s+/, "")
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.substring(0, 2).toUpperCase()
}

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { team, isLoading, error } = useTeamDetail(id)
  const { t, language, isRTL } = useTranslation()

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft

  if (isLoading) {
    return (
      <div className="flex flex-col w-full bg-background min-h-screen relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <TeamDetailSkeleton />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-24 pb-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
            <Users className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">{t("teams.states.notFoundTitle")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("teams.states.notFoundSubtitle")}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={ROUTES.TEAMS.LIST}>
              <Button className="rounded-xl px-6 bg-primary text-white font-bold text-xs sm:text-sm">
                {t("teams.detail.backToList")}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const gradientStyle = getAvatarGradient(team.id)
  const initials = getTeamInitials(team.name)

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to={ROUTES.TEAMS.LIST} className="hover:text-white transition-colors flex items-center gap-1">
            <span>{t("teams.header.title")}</span>
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/30" />
          <span className="text-white font-medium truncate">{team.name}</span>
        </div>

        {/* Team Header Card */}
        <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            <div className="flex items-start gap-5 min-w-0">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/10 shrink-0 bg-black/40 shadow-xl"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLElement).style.display = "none"
                  }}
                />
              ) : (
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-bold text-2xl sm:text-3xl font-heading shrink-0 shadow-inner ${gradientStyle}`}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                    <Users className="w-3.5 h-3.5" />
                    <span>{t("teams.list.memberCount", { count: formatLocalizedNumber(team.memberCount, language) })}</span>
                  </span>

                  {team.generalProgram && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      <span>{team.generalProgram}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
                  {team.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{team.location}</span>
                  </span>

                  {team.isRemote && (
                    <span className="before:content-['•'] before:me-2 before:text-white/20 text-cyan-400 font-semibold">
                      {language === "en" ? "Remote Available" : "متاح للعمل عن بعد"}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Achievements Ribbon */}
          {team.achievements && (
            <div className="pt-4 text-xs sm:text-sm text-emerald-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{team.achievements}</span>
            </div>
          )}
        </GlassCard>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Team */}
            {team.about && (
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-3">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{language === "en" ? "About Team" : "عن الفريق"}</span>
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {team.about}
                </p>
              </GlassCard>
            )}

            {/* Capabilities */}
            {team.capabilities && team.capabilities.length > 0 && (
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>{t("teams.detail.capabilitiesTitle")}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {team.capabilities.map((cap) => (
                    <div
                      key={cap}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs sm:text-sm font-semibold text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Members Roster */}
            <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <span>{t("teams.detail.membersTitle")}</span>
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                  {formatLocalizedNumber(team.members.length, language)}
                </span>
              </div>

              {team.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors"
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-base font-heading shrink-0">
                          {member.name.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
                        <p className="text-xs text-primary font-medium truncate">{member.role}</p>
                        {member.skills && member.skills.length > 0 && (
                          <p className="text-[11px] text-muted-foreground truncate mt-1">
                            {member.skills.slice(0, 2).join(" • ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground py-4">{t("teams.detail.noMembers")}</p>
              )}
            </GlassCard>

            {/* Suited Opportunities */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>{t("teams.detail.opportunitiesTitle")}</span>
              </h2>

              {team.jobs && team.jobs.length > 0 ? (
                <div className="space-y-4">
                  {team.jobs.map((job: Job, idx: number) => (
                    <JobCard key={job.id} job={job} index={idx} />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-8 text-center bg-card/40 border-white/10 space-y-3">
                  <p className="text-sm font-bold text-white">{t("teams.detail.noOpportunities")}</p>
                  <Link to={ROUTES.JOBS.LIST}>
                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs">
                      {t("teams.detail.browseJobsCta")}
                    </Button>
                  </Link>
                </GlassCard>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
              <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-white/10">
                {language === "en" ? "Team Overview" : "معلومات الفريق الأساسية"}
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "en" ? "Location" : "المقر والجغرافيا"}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {team.location}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "en" ? "Team Members" : "عدد أعضاء الفريق"}</span>
                  <p className="font-bold text-white font-mono">
                    {t("teams.list.memberCount", { count: formatLocalizedNumber(team.memberCount, language) })}
                  </p>
                </div>

                {team.generalProgram && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "en" ? "Track / Program" : "المسار التخصصي العام"}</span>
                    <p className="font-semibold text-white">{team.generalProgram}</p>
                  </div>
                )}
              </div>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  )
}
