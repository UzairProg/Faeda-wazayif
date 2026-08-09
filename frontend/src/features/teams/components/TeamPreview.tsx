/**
 * features/teams/components/TeamPreview.tsx
 *
 * Sticky Desktop Preview panel for the selected team in the two-pane layout.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { Link } from "react-router-dom"
import { Users, Layers, MapPin, Sparkles, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"
import type { Team } from "../types/team.types"

interface TeamPreviewProps {
  team: Team | null
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

export function TeamPreview({ team }: TeamPreviewProps) {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  if (!team) {
    return (
      <GlassCard className="p-8 bg-card/40 border-white/10 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
          <Users className="w-7 h-7 opacity-50" />
        </div>
        <p className="text-base font-bold text-white">{t("teams.preview.title")}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("teams.preview.selectPrompt")}
        </p>
      </GlassCard>
    )
  }

  const gradientStyle = getAvatarGradient(team.id)
  const initials = getTeamInitials(team.name)

  return (
    <GlassCard className="p-6 bg-card/70 backdrop-blur-xl border-primary/30 shadow-2xl sticky top-28 text-start space-y-6 overflow-hidden">
      
      {/* Header Info */}
      <div className="flex items-start gap-4 pb-5 border-b border-white/10">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0 bg-black/40 shadow-md"
            onError={(e) => {
              ;(e.currentTarget as HTMLElement).style.display = "none"
            }}
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-bold text-xl font-heading shrink-0 shadow-inner ${gradientStyle}`}
          >
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono mb-1">
            <Users className="w-3 h-3" />
            <span>{t("teams.list.memberCount", { count: formatLocalizedNumber(team.memberCount, language) })}</span>
          </span>

          <h3 className="text-xl font-extrabold font-heading text-white truncate mb-1">
            {team.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-white/80">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{team.location}</span>
            </span>
            {team.isRemote && (
              <span className="before:content-['•'] before:me-2 before:text-white/20 text-cyan-400 font-semibold">
                {language === "en" ? "Remote" : "عن بعد"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {team.about && (
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
            {language === "en" ? "About Team" : "نبذة عن الفريق"}
          </span>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-4">
            {team.about}
          </p>
        </div>
      )}

      {/* Track & Program */}
      {(team.generalProgram || team.semiSpecialProgram) && (
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Layers className="w-4 h-4 text-primary" />
            <span>{t("teams.preview.trackTitle")}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            {[team.generalProgram, team.semiSpecialProgram].filter(Boolean).join(" — ")}
          </p>
        </div>
      )}

      {/* Capability Breakdown List */}
      {team.capabilities.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t("teams.preview.capabilitiesTitle")}</span>
            </span>
            <span className="text-[11px] font-mono text-primary font-bold">
              {formatLocalizedNumber(team.capabilities.length, language)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {team.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{cap}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {team.achievements && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          ✨ {team.achievements}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2">
        <Link to={ROUTES.TEAMS.DETAIL(team.id)} className="block w-full">
          <Button
            size="lg"
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20"
          >
            <span>{t("teams.preview.viewFullProfile")}</span>
            <ArrowIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>

    </GlassCard>
  )
}
