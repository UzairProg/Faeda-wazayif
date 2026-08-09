/**
 * features/public/pages/CompaniesPage.tsx
 *
 * Public companies discovery directory page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Building2, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useCompanies } from "@/features/companies/hooks/useCompanies"
import { CompanyRow } from "@/features/companies/components/CompanyRow"
import { CompanySearch } from "@/features/companies/components/CompanySearch"
import { CompanyFilters } from "@/features/companies/components/CompanyFilters"
import { CompanyRowSkeleton } from "@/features/companies/components/CompanySkeleton"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, language, isRTL } = useTranslation()

  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""
  const verifiedOnly = searchParams.get("verified") === "true"
  const hasJobsOnly = searchParams.get("has_jobs") === "true"
  const page = parseInt(searchParams.get("page") || "1", 10)

  const filter = useMemo(
    () => ({
      query,
      location,
      verifiedOnly,
      hasJobsOnly,
      page,
      pageSize: 10,
    }),
    [query, location, verifiedOnly, hasJobsOnly, page]
  )

  const { data, isLoading, error, refetch } = useCompanies(filter)

  const updateUrlParams = (newParams: Record<string, string | number | boolean | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === false) {
        next.delete(key)
      } else {
        next.set(key, String(val))
      }
    })
    if (newParams.page === undefined) {
      next.delete("page")
    }
    setSearchParams(next)
  }

  const handleQueryChange = (q: string) => updateUrlParams({ q })
  const handleLocationChange = (loc: string) => updateUrlParams({ location: loc })
  const handleVerifiedChange = (v: boolean) => updateUrlParams({ verified: v })
  const handleHasJobsChange = (v: boolean) => updateUrlParams({ has_jobs: v })
  const handleResetFilters = () => setSearchParams({})

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const companyList = data?.companies ?? []
  const PrevChevron = isRTL ? ChevronRight : ChevronLeft
  const NextChevron = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Building2 className="w-4 h-4" />
            <span>{t("companies.header.title")}</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            {t("companies.header.title")} <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
              {t("companies.header.subtitle")}
            </span>
          </h1>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-10">
          <CompanySearch
            query={query}
            location={location}
            onQueryChange={handleQueryChange}
            onLocationChange={handleLocationChange}
            onSearch={refetch}
          />

          <CompanyFilters
            location={location}
            verified={verifiedOnly}
            hasJobs={hasJobsOnly}
            onLocationChange={handleLocationChange}
            onVerifiedChange={handleVerifiedChange}
            onHasJobsChange={handleHasJobsChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between px-2 text-xs sm:text-sm text-muted-foreground font-semibold mb-4">
          <span>
            {isLoading
              ? t("companies.states.loading")
              : data
              ? t("companies.list.resultsCount", { count: formatLocalizedNumber(data.total, language) })
              : ""}
          </span>
        </div>

        {/* Directory List */}
        {isLoading ? (
          <div className="space-y-4 mb-10">
            <CompanyRowSkeleton />
            <CompanyRowSkeleton />
            <CompanyRowSkeleton />
          </div>
        ) : error ? (
          <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-4 my-8">
            <p className="text-xl font-bold text-white">{t("companies.states.errorTitle")}</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("companies.states.errorSubtitle")}</p>
            <Button onClick={() => refetch()} className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>{t("companies.states.retryButton")}</span>
            </Button>
          </GlassCard>
        ) : companyList.length > 0 ? (
          <div className="space-y-4 mb-10">
            {companyList.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center bg-card/40 border-white/10 space-y-4 my-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto mb-2">
              <Building2 className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-2xl font-extrabold font-heading text-white">{t("companies.states.emptyTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{t("companies.states.emptySubtitle")}</p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button onClick={handleResetFilters} className="rounded-xl px-6 bg-primary/20 hover:bg-primary border border-primary/30 text-white font-bold text-xs sm:text-sm">
                {t("companies.filters.clearAll")}
              </Button>
              <Link to={ROUTES.JOBS.LIST}>
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                  {t("companies.detail.browseAllJobs")}
                </Button>
              </Link>
            </div>
          </GlassCard>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.page - 1)}
              disabled={data.page <= 1}
              className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <PrevChevron className="w-4 h-4" />
              <span>{t("common.pagination.previous")}</span>
            </Button>

            <div className="flex items-center gap-1.5 px-3">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                    p === data.page
                      ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/40"
                      : "bg-white/5 text-muted-foreground border border-white/5 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <span>{t("common.pagination.next")}</span>
              <NextChevron className="w-4 h-4" />
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
