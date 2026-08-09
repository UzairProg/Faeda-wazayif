/**
 * features/public/pages/JobsPage.tsx
 *
 * Public jobs search + filter + discovery page.
 * Two-Pane Split Discovery Layout on Desktop (Scrollable List + Sticky Opportunity Preview).
 * Single Column List on Mobile. Fully localized AR/EN & RTL/LTR.
 */
import { useState, useCallback, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
  Search, MapPin, SlidersHorizontal, RotateCcw, ChevronRight, ChevronLeft, Clock, Users, Building2, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/shared/components/states/EmptyState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { useJobs } from "@/features/jobs/hooks/useJobs"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"
import { SearchAutocompleteInput } from "../components/SearchAutocompleteInput"
import { JobCard } from "../components/JobCard"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"
import {
  getLocalizedWorkType,
  getLocalizedExperienceLevel,
  getLocalizedCompanyName,
  formatLocalizedSalary,
  formatLocalizedDate,
  formatLocalizedNumber,
} from "@/lib/localization.utils"
import type { Job, JobFilter, WorkType, ExperienceLevel } from "@/features/jobs/types/job.types"
import { cn } from "@/lib/utils"

const WORK_TYPES: WorkType[] = ["full_time", "part_time", "contract", "remote", "hybrid"]
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["entry", "mid", "senior", "lead", "executive"]

function buildFilterFromParams(params: URLSearchParams): JobFilter {
  const workType = params.get("work_type")
  const experience = params.get("experience")
  return {
    query: params.get("q") || undefined,
    location: params.get("location") || undefined,
    workType: workType ? (workType.split(",") as WorkType[]) : undefined,
    experienceLevel: experience ? (experience.split(",") as ExperienceLevel[]) : undefined,
    hasDisclosedSalary: params.get("salary_disclosed") === "true" ? true : undefined,
    isTeamFriendly: params.get("team_friendly") === "true" ? true : undefined,
    page: Number(params.get("page") || "1"),
  }
}

/* ─── Apply Gate Panel ─────────────────────────────────── */

function ApplyGatePanel({ job }: { job: Job }) {
  const { t, language } = useTranslation()
  const companyName = getLocalizedCompanyName(job.company, language)

  return (
    <div className="p-4 rounded-xl bg-card/80 border border-primary/20 backdrop-blur-md text-start space-y-3 shadow-lg">
      <div>
        <p className="text-xs font-bold text-white mb-0.5">{t("jobs.detail.applyGate.title")}</p>
        <p className="text-[11px] text-muted-foreground">{t("jobs.detail.applyGate.subtitle")}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs">
          <Link to={ROUTES.AUTH.LOGIN}>{t("jobs.detail.applyGate.loginCta")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl border-white/10 text-white font-bold text-xs hover:bg-white/5">
          <Link to={ROUTES.AUTH.REGISTER}>{t("jobs.detail.applyGate.registerCta")}</Link>
        </Button>
      </div>

      <div className="pt-2 border-t border-white/5 text-[11px] text-muted-foreground flex items-center justify-between">
        <span>{companyName}</span>
        <Link to={ROUTES.JOBS.DETAIL(job.id)} className="text-primary hover:underline font-semibold">
          {t("jobs.card.viewDetails")} →
        </Link>
      </div>
    </div>
  )
}

/* ─── Sticky Opportunity Preview ───────────────────────── */

function OpportunityPreview({ job }: { job: Job | undefined }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { t, language } = useTranslation()

  if (!job) {
    return (
      <GlassCard className="p-8 bg-card/40 border-white/10 text-center space-y-4">
        <p className="text-sm font-bold text-white">{t("jobs.search.noResults")}</p>
      </GlassCard>
    )
  }

  const companyName = getLocalizedCompanyName(job.company, language)
  const workTypeLabel = getLocalizedWorkType(job.workType, language)
  const expLabel = getLocalizedExperienceLevel(job.experienceLevel, language)
  const salaryText = job.salary?.isDisclosed
    ? formatLocalizedSalary(job.salary.min, job.salary.max, language)
    : null
  const postedDate = formatLocalizedDate(job.postedAt, language)

  return (
    <GlassCard className="p-6 bg-card/70 backdrop-blur-xl border-primary/30 shadow-2xl sticky top-28 text-start space-y-6 overflow-hidden">
      
      {/* Header Info */}
      <div className="flex items-start gap-4 pb-5 border-b border-white/10">
        {job.company.logoUrl ? (
          <img
            src={job.company.logoUrl}
            alt={companyName}
            className="w-16 h-16 rounded-2xl object-contain bg-white p-1 border border-white/10 shrink-0"
            onError={(e) => {
              ;(e.currentTarget as HTMLElement).style.display = "none"
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xl text-primary shrink-0">
            {companyName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-1">
            <Building2 className="w-3 h-3" />
            <span>{companyName}</span>
          </span>

          <h3 className="text-xl font-extrabold font-heading text-white truncate mb-1">
            {job.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {job.location && (
              <span className="inline-flex items-center gap-1 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{job.isRemote ? (language === "en" ? "Remote" : "عن بعد") : job.location}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <span>{postedDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Meta Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white">
          <Clock className="w-3.5 h-3.5 text-primary inline-block me-1" />
          {workTypeLabel}
        </span>
        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white">
          {expLabel}
        </span>
        {job.isTeamFriendly && (
          <span className="px-3 py-1 rounded-xl bg-secondary/10 border border-secondary/20 text-xs font-semibold text-secondary">
            <Users className="w-3.5 h-3.5 inline-block me-1" />
            {t("jobs.filters.teamFriendly")}
          </span>
        )}
      </div>

      {/* Salary Display */}
      {salaryText && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">
            {t("jobs.filters.salary")}
          </span>
          <span className="text-base font-bold font-mono text-primary">{salaryText}</span>
        </div>
      )}

      {/* Skills Coverage */}
      {job.skills.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-white block">{t("jobs.detail.skills")}</span>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Excerpt Snippet */}
      {job.excerpt && (
        <div className="space-y-1">
          <span className="text-xs font-bold text-white block">{t("jobs.detail.about")}</span>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {job.excerpt}
          </p>
        </div>
      )}

      {/* Primary CTA / Apply Gate */}
      <div className="pt-2">
        {isAuthenticated ? (
          <Link to={ROUTES.JOBS.DETAIL(job.id)} className="block w-full">
            <Button size="lg" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-lg shadow-primary/20">
              {t("jobs.card.apply")}
            </Button>
          </Link>
        ) : (
          <ApplyGatePanel job={job} />
        )}
      </div>

    </GlassCard>
  )
}

/* ─── Main Jobs Page ─────────────────────────────────────── */

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "")
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const { t, language, isRTL } = useTranslation()

  useEffect(() => {
    setSearchInput(searchParams.get("q") || "")
    setLocationInput(searchParams.get("location") || "")
  }, [searchParams])

  const filter = buildFilterFromParams(searchParams)
  const { jobs, isLoading, isError, isUnavailable, refetch } = useJobs(filter)

  const jobList = jobs?.jobs ?? []
  const totalResults = jobs?.total ?? 0

  useEffect(() => {
    if (jobList.length > 0 && (!selectedJobId || !jobList.find((j) => j.id === selectedJobId))) {
      setSelectedJobId(jobList[0].id)
    }
  }, [jobList, selectedJobId])

  const selectedJob = jobList.find((j) => j.id === selectedJobId) || jobList[0]

  const handleSearch = useCallback(() => {
    const next = new URLSearchParams(searchParams)
    if (searchInput.trim()) {
      next.set("q", searchInput.trim())
    } else {
      next.delete("q")
    }
    if (locationInput.trim()) {
      next.set("location", locationInput.trim())
    } else {
      next.delete("location")
    }
    next.delete("page")
    setSearchParams(next)
  }, [searchInput, locationInput, searchParams, setSearchParams])

  const activeWorkTypes = (searchParams.get("work_type")?.split(",") ?? []) as WorkType[]
  const activeExperience = (searchParams.get("experience")?.split(",") ?? []) as ExperienceLevel[]
  const hasSalary = searchParams.get("salary_disclosed") === "true"

  const toggleMultiFilter = <T extends string>(key: string, val: T, activeList: T[]) => {
    const next = new URLSearchParams(searchParams)
    const updated = activeList.includes(val)
      ? activeList.filter((item) => item !== val)
      : [...activeList, val]
    if (updated.length > 0) {
      next.set(key, updated.join(","))
    } else {
      next.delete(key)
    }
    next.delete("page")
    setSearchParams(next)
  }

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters =
    activeWorkTypes.length > 0 ||
    activeExperience.length > 0 ||
    hasSalary ||
    searchParams.has("q") ||
    searchParams.has("location")

  const PrevChevron = isRTL ? ChevronRight : ChevronLeft
  const NextChevron = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background text-start">
      
      {/* Search Header Bar */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-card/40 to-transparent py-8 sm:py-10">
        <div className="absolute top-0 end-0 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-0 translate-x-1/3 -translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary mb-2">
                {t("jobs.search.title")}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-1">
                {t("jobs.search.subtitle")}
              </h1>
            </div>

            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-2 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 w-full md:w-auto md:min-w-[580px] shadow-lg">
              <div className="flex flex-1 items-center px-3 py-2 border-b sm:border-b-0 sm:border-e border-white/10">
                <SearchAutocompleteInput
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearchSubmit={handleSearch}
                  placeholder={t("jobs.search.placeholder")}
                  type="keyword"
                  icon={Search}
                  ariaLabel={t("jobs.search.placeholder")}
                />
              </div>

              <div className="flex flex-1 items-center px-3 py-2">
                <SearchAutocompleteInput
                  value={locationInput}
                  onChange={setLocationInput}
                  onSearchSubmit={handleSearch}
                  placeholder={t("jobs.search.locationPlaceholder")}
                  type="location"
                  icon={MapPin}
                  ariaLabel={t("jobs.search.locationPlaceholder")}
                />
              </div>

              <Button
                onClick={handleSearch}
                className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
              >
                <Search className="w-4 h-4 me-1.5" />
                {t("jobs.search.button")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">
              {isLoading
                ? t("jobs.search.loading")
                : t("jobs.search.resultsCount", { count: formatLocalizedNumber(totalResults, language) })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-white gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t("jobs.filters.clear")}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              className="lg:hidden rounded-xl border-white/10 bg-white/5 text-white gap-1.5 text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t("jobs.filters.title")}
            </Button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {WORK_TYPES.map((wt) => {
            const active = activeWorkTypes.includes(wt)
            return (
              <button
                key={wt}
                onClick={() => toggleMultiFilter("work_type", wt, activeWorkTypes)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-bold"
                    : "bg-card/40 border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                )}
              >
                {getLocalizedWorkType(wt, language)}
              </button>
            )
          })}

          {EXPERIENCE_LEVELS.map((exp) => {
            const active = activeExperience.includes(exp)
            return (
              <button
                key={exp}
                onClick={() => toggleMultiFilter("experience", exp, activeExperience)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-bold"
                    : "bg-card/40 border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                )}
              >
                {getLocalizedExperienceLevel(exp, language)}
              </button>
            )
          })}
        </div>

        {/* Two-Pane Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Scrollable Job List (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-44 rounded-2xl bg-card/40 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : isError || isUnavailable ? (
              <ErrorState title={t("jobs.search.error")} onRetry={refetch} />
            ) : jobList.length === 0 ? (
              <EmptyState title={t("jobs.search.noResults")} />
            ) : (
              jobList.map((job, idx) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl transition-all",
                    selectedJobId === job.id ? "ring-2 ring-primary/60 shadow-lg shadow-primary/10" : ""
                  )}
                >
                  <JobCard job={job} index={idx} />
                </div>
              ))
            )}

            {/* Pagination */}
            {jobs && jobs.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filter.page === 1}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set("page", String((filter.page || 1) - 1))
                    setSearchParams(next)
                  }}
                  className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
                >
                  <PrevChevron className="w-4 h-4" />
                  <span>{t("common.pagination.previous")}</span>
                </Button>

                <span className="text-xs text-muted-foreground px-3 font-mono">
                  {filter.page} {t("common.pagination.of")} {jobs.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={filter.page === jobs.totalPages}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set("page", String((filter.page || 1) + 1))
                    setSearchParams(next)
                  }}
                  className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
                >
                  <span>{t("common.pagination.next")}</span>
                  <NextChevron className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Desktop Preview Panel (Right 5 cols) */}
          <div className="hidden lg:block lg:col-span-5">
            <OpportunityPreview job={selectedJob} />
          </div>

        </div>

      </div>
    </div>
  )
}
