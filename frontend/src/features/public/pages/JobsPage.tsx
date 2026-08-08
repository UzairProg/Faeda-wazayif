/**
 * features/public/pages/JobsPage.tsx
 *
 * Public jobs search + filter + list page.
 * The first real product flow: Guest → Browse Jobs → Filter → View Card → Detail
 *
 * Architecture:
 *   - Filters are in URL search params (shareable/bookmarkable)
 *   - Search + filter state → useJobs hook → renders appropriate state
 *   - No fake data. If backend unavailable: shows unavailable state.
 *   - Filter panel designed for extensibility — add new filters without rewrite.
 */
import { useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobCard } from "../components/JobCard"
import { EmptyState } from "@/shared/components/states/EmptyState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { useJobs } from "@/features/jobs/hooks/useJobs"
import type { JobFilter, WorkType, ExperienceLevel } from "@/features/jobs/types/job.types"

/* ─── Filter Options ────────────────────────────────────── */

const WORK_TYPE_OPTIONS: { value: WorkType; label: string }[] = [
  { value: "full_time", label: "دوام كامل" },
  { value: "part_time", label: "دوام جزئي" },
  { value: "contract", label: "عقد" },
  { value: "remote", label: "عن بعد" },
  { value: "hybrid", label: "هجين" },
]

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "entry", label: "مبتدئ" },
  { value: "mid", label: "متوسط" },
  { value: "senior", label: "أول" },
  { value: "lead", label: "قيادي" },
  { value: "executive", label: "تنفيذي" },
]

/* ─── Helpers ───────────────────────────────────────────── */

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

/* ─── Filter Sidebar ────────────────────────────────────── */

interface FilterPanelProps {
  searchParams: URLSearchParams
  setSearchParams: (params: URLSearchParams) => void
  onClose?: () => void
}

function FilterPanel({ searchParams, setSearchParams, onClose }: FilterPanelProps) {
  const activeWorkTypes = (searchParams.get("work_type")?.split(",") ?? []) as WorkType[]
  const activeExperience = (searchParams.get("experience")?.split(",") ?? []) as ExperienceLevel[]
  const hasSalary = searchParams.get("salary_disclosed") === "true"
  const teamFriendly = searchParams.get("team_friendly") === "true"

  function toggleMultiFilter<T extends string>(
    key: string,
    value: T,
    active: T[]
  ) {
    const next = new URLSearchParams(searchParams)
    const updated = active.includes(value)
      ? active.filter((v) => v !== value)
      : [...active, value]
    if (updated.length > 0) {
      next.set(key, updated.join(","))
    } else {
      next.delete(key)
    }
    next.delete("page")
    setSearchParams(next)
  }

  function toggleBoolFilter(key: string, current: boolean) {
    const next = new URLSearchParams(searchParams)
    if (current) {
      next.delete(key)
    } else {
      next.set(key, "true")
    }
    next.delete("page")
    setSearchParams(next)
  }

  function clearAll() {
    setSearchParams(new URLSearchParams())
  }

  const hasActive =
    activeWorkTypes.length > 0 ||
    activeExperience.length > 0 ||
    hasSalary ||
    teamFriendly

  return (
    <aside className="w-full bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white font-heading">التصفية</h2>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:text-white transition-colors font-semibold"
          >
            مسح الكل
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Work Type */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">نوع العمل</h3>
        <div className="flex flex-col gap-2">
          {WORK_TYPE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeWorkTypes.includes(value)}
                onChange={() => toggleMultiFilter("work_type", value, activeWorkTypes)}
                className="w-4 h-4 rounded border-white/20 bg-transparent accent-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">مستوى الخبرة</h3>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeExperience.includes(value)}
                onChange={() => toggleMultiFilter("experience", value, activeExperience)}
                className="w-4 h-4 rounded border-white/20 bg-transparent accent-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Disclosed */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={hasSalary}
            onChange={() => toggleBoolFilter("salary_disclosed", hasSalary)}
            className="w-4 h-4 rounded border-white/20 bg-transparent accent-primary"
          />
          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
            يُعلن عن الراتب
          </span>
        </label>
      </div>

      {/* Team Friendly */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={teamFriendly}
            onChange={() => toggleBoolFilter("team_friendly", teamFriendly)}
            className="w-4 h-4 rounded border-white/20 bg-transparent accent-primary"
          />
          <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
            مناسب للفرق
          </span>
        </label>
      </div>
    </aside>
  )
}

/* ─── Main Page ─────────────────────────────────────────── */

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "")
  const [showFilters, setShowFilters] = useState(false)

  const filter = buildFilterFromParams(searchParams)
  const { jobs, isLoading, isError, isUnavailable, refetch } = useJobs(filter)

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const totalResults = jobs?.total ?? 0
  const jobList = jobs?.jobs ?? []

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header + Search Bar */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-card/30 to-transparent">
        {/* Ambient */}
        <div className="absolute top-0 end-0 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-0 translate-x-1/3 -translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-3">
              الوظائف المتاحة
            </h1>
            <p className="text-muted-foreground mb-8">
              اكتشف الفرص المهنية المناسبة لمهاراتك وطموحاتك
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 max-w-3xl shadow-xl">
              <div className="flex flex-1 items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-e border-white/10">
                <Search className="h-5 w-5 text-primary shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="المسمى الوظيفي أو المهارة..."
                  className="w-full bg-transparent outline-none text-white placeholder:text-muted-foreground/60 text-sm"
                  aria-label="بحث عن وظيفة"
                />
              </div>
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="المدينة أو عن بعد..."
                  className="w-full bg-transparent outline-none text-white placeholder:text-muted-foreground/60 text-sm"
                  aria-label="بحث بالموقع"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content: Filter Sidebar + Jobs Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              "جارٍ البحث..."
            ) : isUnavailable ? (
              ""
            ) : (
              <span>
                <span className="font-semibold text-white">{totalResults.toLocaleString("ar-SA")}</span>{" "}
                وظيفة متاحة
              </span>
            )}
          </p>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-2 rounded-full border-white/10 bg-white/5 text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            التصفية
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterPanel
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>

          {/* Mobile Filter Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md p-4 overflow-y-auto lg:hidden"
              >
                <div className="max-w-sm mx-auto mt-8">
                  <FilterPanel
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            {isLoading && (
              <LoadingState count={6} />
            )}

            {isUnavailable && (
              <EmptyState
                title="الوظائف غير متاحة حالياً"
                description="قاعدة بيانات الوظائف قيد الإعداد. يرجى المحاولة لاحقاً أو تصفح الشركات المتاحة."
              />
            )}

            {isError && (
              <ErrorState
                description="تعذر تحميل الوظائف. يرجى التحقق من اتصالك والمحاولة مرة أخرى."
                onRetry={refetch}
              />
            )}

            {!isLoading && !isError && !isUnavailable && jobList.length === 0 && (
              <EmptyState
                title="لا توجد وظائف مطابقة"
                description="لم يتم العثور على وظائف تطابق معايير البحث. جرب تغيير كلمات البحث أو مسح التصفية."
              />
            )}

            {!isLoading && !isError && !isUnavailable && jobList.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {jobList.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
            )}

            {/* Pagination — simple prev/next for now */}
            {jobs && jobs.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white"
                  disabled={(filter.page ?? 1) <= 1}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set("page", String((filter.page ?? 1) - 1))
                    setSearchParams(next)
                  }}
                >
                  السابق
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filter.page ?? 1} / {jobs.totalPages}
                </span>
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white"
                  disabled={(filter.page ?? 1) >= jobs.totalPages}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set("page", String((filter.page ?? 1) + 1))
                    setSearchParams(next)
                  }}
                >
                  التالي
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
