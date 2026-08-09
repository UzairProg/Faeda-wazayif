/**
 * features/teams/components/TeamFilters.tsx
 *
 * Discovery filter controls for public team marketplace.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { Filter, X } from "lucide-react"
import { useTranslation } from "@/i18n"

interface TeamFiltersProps {
  location: string
  onLocationChange: (loc: string) => void
  onReset: () => void
}

export function TeamFilters({
  location,
  onLocationChange,
  onReset,
}: TeamFiltersProps) {
  const { t, language } = useTranslation()
  const hasActiveFilters = Boolean(location)

  const popularPills = language === "en"
    ? ["React", "Python", "Node.js", "Figma", "AI", "Riyadh", "Jeddah"]
    : language === "hi"
    ? ["React", "Python", "Node.js", "Figma", "AI", "रियाध", "जिद्दा"]
    : ["React", "Python", "Node.js", "Figma", "AI", "الرياض", "جدة"]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl text-start">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white me-2">
          <Filter className="w-4 h-4 text-primary" />
          <span>{t("teams.filters.title")}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {popularPills.map((pill) => {
            const isSelected = location === pill
            return (
              <button
                key={pill}
                type="button"
                onClick={() => onLocationChange(isSelected ? "" : pill)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  isSelected
                    ? "bg-primary text-white border-primary/50 font-bold"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                }`}
              >
                {pill}
              </button>
            )
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white text-xs font-semibold transition-colors ms-auto"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t("teams.filters.clearAll")}</span>
        </button>
      )}
    </div>
  )
}
