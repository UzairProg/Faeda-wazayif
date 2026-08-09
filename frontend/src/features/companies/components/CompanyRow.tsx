/**
 * features/companies/components/CompanyRow.tsx
 *
 * Information-dense directory row/card component for public company discovery.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { Link } from "react-router-dom"
import { Building2, MapPin, CheckCircle2, Briefcase, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { getLocalizedCompanyName } from "@/lib/localization.utils"
import type { Company } from "../types/company.types"

interface CompanyRowProps {
  company: Company
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

function getCompanyInitials(name: string): string {
  const clean = name.trim().replace(/^(شركة|مركز|مؤسسة|مجموعة)\s+/, "")
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.substring(0, 2).toUpperCase()
}

export function CompanyRow({ company }: CompanyRowProps) {
  const { t, language, isRTL } = useTranslation()

  const companyName = getLocalizedCompanyName(company, language)
  const gradientStyle = getAvatarGradient(company.id)
  const initials = getCompanyInitials(companyName)
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <GlassCard className="p-5 sm:p-6 bg-card/60 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all text-start shadow-xl relative overflow-hidden group">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left Info: Avatar + Details */}
        <div className="flex items-start gap-4 sm:gap-5 min-w-0 w-full md:w-auto flex-1">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={companyName}
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

          {/* Text Metadata */}
          <div className="min-w-0 flex-1">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {company.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("companies.list.verifiedBadge")}</span>
                </span>
              )}

              {company.companyField && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  <Building2 className="w-3 h-3" />
                  <span>{company.companyField}</span>
                </span>
              )}

              {company.openJobsCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
                  <Briefcase className="w-3 h-3 text-cyan-400" />
                  <span>{t("companies.list.openJobsCount", { count: company.openJobsCount })}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs">
                  <span>{t("companies.list.openJobsCount", { count: 0 })}</span>
                </span>
              )}
            </div>

            {/* Company Name */}
            <Link to={ROUTES.COMPANIES.DETAIL(company.id)} className="block group/link">
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white group-hover/link:text-primary transition-colors truncate">
                {companyName}
              </h3>
            </Link>

            {/* Location & Secondary Specs */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground mt-1 mb-2">
              <span className="inline-flex items-center gap-1 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{company.location || company.country || (language === "en" ? "Saudi Arabia" : "المملكة العربية السعودية")}</span>
              </span>

              {company.companySize && (
                <span className="before:content-['•'] before:me-2 before:text-white/20">
                  {company.companySize}
                </span>
              )}

              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline ms-auto md:ms-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-[140px]">{company.website.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
            </div>

            {/* Description Excerpt */}
            {company.description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {company.description}
              </p>
            )}
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 self-end md:self-center w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 flex items-center justify-end">
          <Link to={ROUTES.COMPANIES.DETAIL(company.id)} className="w-full md:w-auto">
            <Button
              size="sm"
              className="w-full md:w-auto rounded-xl px-6 py-2.5 bg-primary/20 hover:bg-primary border border-primary/30 text-white font-bold text-xs sm:text-sm gap-2 transition-all shadow-md group-hover:bg-primary"
            >
              <span>{t("companies.list.exploreCta")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </GlassCard>
  )
}
