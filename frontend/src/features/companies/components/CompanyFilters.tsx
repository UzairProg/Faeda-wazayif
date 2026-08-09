/**
 * features/companies/components/CompanyFilters.tsx
 *
 * Discovery filter controls for public companies.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { CheckCircle2, Briefcase, Filter, X } from "lucide-react"
import { useTranslation } from "@/i18n"

interface CompanyFiltersProps {
  verified: boolean
  hasJobs: boolean
  location: string
  onVerifiedChange: (v: boolean) => void
  onHasJobsChange: (v: boolean) => void
  onLocationChange: (loc: string) => void
  onReset: () => void
}

export function CompanyFilters({
  verified,
  hasJobs,
  location,
  onVerifiedChange,
  onHasJobsChange,
  onLocationChange,
  onReset,
}: CompanyFiltersProps) {
  const { t, language } = useTranslation()
  const hasActiveFilters = verified || hasJobs || Boolean(location)

  const popularCities = language === "en"
    ? ["Riyadh", "Jeddah", "Dammam", "Dhahran", "Khobar"]
    : language === "hi"
    ? ["रियाध", "जिद्दा", "दम्माम", "धाहरान", "अल खोबार"]
    : ["الرياض", "جدة", "الدمام", "الظهران", "الخبر"]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl text-start">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white me-2">
          <Filter className="w-4 h-4 text-primary" />
          <span>{t("companies.filters.title")}</span>
        </div>

        {/* Verified Only Pill */}
        <button
          type="button"
          onClick={() => onVerifiedChange(!verified)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            verified
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
              : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:bg-white/10"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t("companies.filters.verifiedOnly")}</span>
        </button>

        {/* Has Open Jobs Pill */}
        <button
          type="button"
          onClick={() => onHasJobsChange(!hasJobs)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            hasJobs
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
              : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:bg-white/10"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t("companies.filters.hasJobsOnly")}</span>
        </button>

        {/* City Quick Pills */}
        <div className="hidden md:flex items-center gap-1.5 ms-2 border-s border-white/10 ps-3">
          {popularCities.map((c) => {
            const isSelected = location === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => onLocationChange(isSelected ? "" : c)}
                className={`px-3 py-1 rounded-full text-xs transition-all border ${
                  isSelected
                    ? "bg-primary text-white border-primary/50 font-bold"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white text-xs font-semibold transition-colors ms-auto"
        >
          <X className="w-3.5 h-3.5" />
          <span>{t("companies.filters.clearAll")}</span>
        </button>
      )}
    </div>
  )
}
