/**
 * features/teams/components/TeamRow.tsx
 *
 * Information-dense directory row card component for the public Team Marketplace.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { Link } from "react-router-dom"
import { Users, Layers, MapPin, ArrowLeft, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"
import type { Team } from "../types/team.types"

interface TeamRowProps {
  team: Team
  isSelected?: boolean
  onSelect?: () => void
}

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

export function TeamRow({ team, isSelected = false, onSelect }: TeamRowProps) {
  const { t, language, isRTL } = useTranslation()
  const gradientStyle = getAvatarGradient(team.id)
  const initials = getTeamInitials(team.name)
  const visibleCaps = team.capabilities.slice(0, 4)
  const remainingCaps = team.capabilities.length - visibleCaps.length
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <GlassCard
      onClick={onSelect}
      className={cn(
        "p-5 sm:p-6 bg-card/60 backdrop-blur-md border-white/10 transition-all text-start cursor-pointer shadow-xl relative overflow-hidden group",
        isSelected
          ? "border-primary/60 bg-primary/10 shadow-primary/10"
          : "hover:border-primary/40 hover:bg-card/75"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        
        {/* Left Info: Avatar + Text */}
        <div className="flex items-start gap-4 sm:gap-5 min-w-0 w-full sm:w-auto flex-1">
          {team.logoUrl ? (
            <img
              src={team.logoUrl}
              alt={team.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/10 shrink-0 bg-black/30"
              onError={(e) => {
                ;(e.currentTarget as HTMLElement).style.display = "none"
              }}
            />
          ) : (
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-bold text-lg sm:text-xl font-heading shrink-0 shadow-inner ${gradientStyle}`}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                <Users className="w-3 h-3" />
                <span>{t("teams.list.memberCount", { count: formatLocalizedNumber(team.memberCount, language) })}</span>
              </span>

              {team.generalProgram && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold">
                  <Layers className="w-3 h-3 text-primary" />
                  <span className="truncate max-w-[150px]">{team.generalProgram}</span>
                </span>
              )}
            </div>

            {/* Team Name */}
            <Link to={ROUTES.TEAMS.DETAIL(team.id)} className="block group/link">
              <h3 className="text-lg sm:text-xl font-extrabold font-heading text-white group-hover/link:text-primary transition-colors truncate">
                {team.name}
              </h3>
            </Link>

            {/* Location & Remote */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-2">
              <span className="inline-flex items-center gap-1 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{team.location}</span>
              </span>
              {team.isRemote && (
                <span className="before:content-['•'] before:me-2 before:text-white/20 text-cyan-400 font-semibold">
                  {language === "en" ? "Remote Available" : language === "hi" ? "रिमोट उपलब्ध" : "متاح للعمل عن بعد"}
                </span>
              )}
            </div>

            {/* Capability Chips */}
            {visibleCaps.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {visibleCaps.map((cap) => (
                  <span
                    key={cap}
                    className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono"
                  >
                    {cap}
                  </span>
                ))}
                {remainingCaps > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 text-muted-foreground text-[10px] font-mono">
                    +{remainingCaps}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 flex items-center justify-end">
          <Link to={ROUTES.TEAMS.DETAIL(team.id)} className="w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full sm:w-auto rounded-xl px-5 py-2 bg-primary/20 hover:bg-primary border border-primary/30 text-white font-bold text-xs gap-1.5 transition-all shadow-md group-hover:bg-primary"
            >
              <span>{t("teams.list.exploreCta")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

      </div>
    </GlassCard>
  )
}
