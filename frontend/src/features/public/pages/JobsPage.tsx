/**
 * features/public/pages/JobsPage.tsx
 *
 * Public jobs search + filter + discovery page.
 * Two-Pane Split Discovery Layout on Desktop (Scrollable List + Sticky Opportunity Preview).
 * Single Column List on Mobile.
 */
import { useState, useCallback, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, MapPin, SlidersHorizontal, X, Loader2, RotateCcw,
  Clock, Briefcase, ChevronRight, Share2, CheckCircle2, Building2, Calendar, Bookmark, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/shared/components/states/EmptyState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { useJobs } from "@/features/jobs/hooks/useJobs"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"
import { SearchAutocompleteInput } from "../components/SearchAutocompleteInput"
import type { Job, JobFilter, WorkType, ExperienceLevel } from "@/features/jobs/types/job.types"
import { cn } from "@/lib/utils"

/* ─── Work & Experience Labels ───────────────────────────── */

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

function formatSalary(job: Job): string | null {
  if (!job.salary || !job.salary.isDisclosed) return null
  const { min, max, currency, period } = job.salary
  const fmt = new Intl.NumberFormat("ar-SA")
  const periodLabel = period === "monthly" ? "شهرياً" : "سنوياً"
  return `${fmt.format(min)} – ${fmt.format(max)} ${currency} ${periodLabel}`
}

function formatDate(isoDate: string): string {
  if (!isoDate) return ""
  return new Intl.DateTimeFormat("ar-SA", {
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate))
}

/* ─── Apply Gate Button ──────────────────────────────────── */

function ApplyGateButton({ jobId }: { jobId: string }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return (
      <Button
        size="lg"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 h-11 text-xs"
        onClick={() => {
          alert("خاصية التقديم المباشر قيد الإعداد. سيتم التحديث في المرحلة القادمة.")
        }}
      >
        تقديم الآن
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Button
        asChild
        size="lg"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs h-11 shadow-md shadow-primary/20"
      >
        <Link to={ROUTES.AUTH.REGISTER} state={{ from: `/jobs/${jobId}`, intent: "apply" }}>
          إنشاء حساب مرشح للتقديم
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs h-10"
      >
        <Link to={ROUTES.AUTH.LOGIN} state={{ from: `/jobs/${jobId}`, intent: "apply" }}>
          تسجيل الدخول
        </Link>
      </Button>
    </div>
  )
}

/* ─── Main Jobs Page ─────────────────────────────────────── */

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "")
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  // Sync inputs on URL params change
  useEffect(() => {
    setSearchInput(searchParams.get("q") || "")
    setLocationInput(searchParams.get("location") || "")
  }, [searchParams])

  const filter = buildFilterFromParams(searchParams)
  const { jobs, isLoading, isError, isUnavailable, refetch } = useJobs(filter)

  const jobList = jobs?.jobs ?? []
  const totalResults = jobs?.total ?? 0

  // Set default selected job for Two-Pane preview
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  // Active Filter Helpers
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

  const toggleBoolFilter = (key: string, current: boolean) => {
    const next = new URLSearchParams(searchParams)
    if (current) next.delete(key)
    else next.set(key, "true")
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

  return (
    <div className="min-h-screen bg-background text-start" dir="rtl">
      
      {/* Search Header Bar */}
      <div className="relative border-b border-white/5 bg-gradient-to-b from-card/40 to-transparent py-8 sm:py-10">
        <div className="absolute top-0 end-0 w-[500px] h-[250px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-0 translate-x-1/3 -translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary mb-2">
                الوظائف والفرص
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-1">
                اكتشف فرصتك القادمة
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ابحث في آلاف الوظائف من الشركات الرائدة وتواصل مباشرة.
              </p>
            </div>

            {/* Compact Search Box with Autocomplete */}
            <div className="flex flex-col sm:flex-row gap-2 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 w-full md:w-auto md:min-w-[580px] shadow-lg">
              <div className="flex flex-1 items-center px-3 py-2 border-b sm:border-b-0 sm:border-e border-white/10">
                <SearchAutocompleteInput
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearchSubmit={handleSearch}
                  placeholder="المسمى الوظيفي، المهارة، أو الشركة"
                  type="keyword"
                  icon={Search}
                  ariaLabel="بحث المسمى أو المهارة أو الشركة"
                />
              </div>

              <div className="flex flex-1 items-center px-3 py-2">
                <SearchAutocompleteInput
                  value={locationInput}
                  onChange={setLocationInput}
                  onSearchSubmit={handleSearch}
                  placeholder="المدينة أو عن بعد"
                  type="location"
                  icon={MapPin}
                  ariaLabel="بحث بالموقع أو المدينة"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="rounded-xl px-6 h-9 bg-primary hover:bg-primary/90 text-white text-xs font-bold shrink-0 self-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "بحث"}
              </Button>
            </div>
          </div>

          {/* Compact Filter Toolbar */}
          <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-white/5 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-semibold pe-1 shrink-0">التصفية السريعة:</span>
              
              {/* Work Type Pills */}
              {WORK_TYPE_OPTIONS.map((opt) => {
                const active = activeWorkTypes.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleMultiFilter("work_type", opt.value, activeWorkTypes)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                      active
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}

              {/* Salary Disclosed Pill */}
              <button
                onClick={() => toggleBoolFilter("salary_disclosed", hasSalary)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  hasSalary
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                يُعلن عن الراتب
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>مسح الكل</span>
                </button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="lg:hidden gap-1.5 rounded-full border-white/10 bg-white/5 text-white text-xs h-8"
                onClick={() => setShowFiltersDrawer(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>خيارات التصفية</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Two-Pane Split Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              "جارٍ تحميل الوظائف..."
            ) : isUnavailable ? (
              ""
            ) : (
              <span>
                الفرص المناسبة لبحثك: <strong className="text-white font-mono">{totalResults}</strong> وظيفة
              </span>
            )}
          </p>
        </div>

        {/* States handling */}
        {isLoading && <LoadingState count={4} />}

        {isUnavailable && (
          <EmptyState
            title="تعذر الوصول لقاعدة الوظائف"
            description="يرجى التأكد من تشغيل خادم فائدة الداخلي ومحاولة التنشيط."
          />
        )}

        {isError && (
          <ErrorState
            description="حدث خطأ في جلب الفرص الوظيفية. تحقق من الاتصال وحاول مجدداً."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && !isUnavailable && jobList.length === 0 && (
          <div className="p-10 rounded-2xl bg-card/40 border border-white/5 text-center flex flex-col items-center justify-center my-6">
            <h3 className="font-extrabold text-white text-lg mb-2 font-heading">لم نجد وظائف مطابقة لبحثك</h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed mb-6">
              جرّب تغيير كلمات البحث أو تغيير الفلاتر المحددة لعرض المزيد من الفرص.
            </p>
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>عرض كافة الوظائف</span>
            </Button>
          </div>
        )}

        {/* Two-Pane Layout Container */}
        {!isLoading && !isError && !isUnavailable && jobList.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Pane (Scrollable Job List) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {jobList.map((job) => {
                const isSelected = selectedJob?.id === job.id
                const salaryText = formatSalary(job)

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={cn(
                      "p-4 rounded-2xl border text-start transition-all cursor-pointer relative group",
                      isSelected
                        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(18,75,201,0.2)]"
                        : "bg-card/40 border-white/5 hover:border-white/15 hover:bg-card/60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className={cn("font-bold text-sm font-heading mb-0.5", isSelected ? "text-primary" : "text-white group-hover:text-primary transition-colors")}>
                          {job.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{job.company.name}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 font-mono">
                        {formatDate(job.postedAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 my-2.5 text-[11px]">
                      {job.location && (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.isRemote ? "عن بعد" : job.location}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-muted-foreground">
                        {WORK_TYPE_OPTIONS.find((w) => w.value === job.workType)?.label || job.workType}
                      </span>
                      {salaryText && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-semibold font-mono">
                          {salaryText}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-muted-foreground/60 truncate max-w-[200px]">
                        {job.skills.slice(0, 3).join(" • ")}
                      </span>
                      <Link
                        to={ROUTES.JOBS.DETAIL(job.id)}
                        className="lg:hidden text-primary font-semibold flex items-center gap-0.5"
                      >
                        <span>التفاصيل</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {jobs && jobs.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/10 bg-white/5 text-white text-xs px-3 h-8"
                    disabled={(filter.page ?? 1) <= 1}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams)
                      next.set("page", String((filter.page ?? 1) - 1))
                      setSearchParams(next)
                    }}
                  >
                    السابق
                  </Button>
                  <span className="text-xs text-muted-foreground font-mono">
                    صفحة {filter.page ?? 1} من {jobs.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/10 bg-white/5 text-white text-xs px-3 h-8"
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

            {/* Right Pane (Sticky Selected Job Preview — Desktop Only) */}
            <div className="hidden lg:block lg:col-span-7 sticky top-24">
              {selectedJob ? (
                <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-start">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl font-heading shrink-0">
                        {selectedJob.company.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold font-heading text-white mb-1">{selectedJob.title}</h2>
                        <p className="text-sm text-muted-foreground">{selectedJob.company.name}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/80">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {selectedJob.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {WORK_TYPE_OPTIONS.find((w) => w.value === selectedJob.workType)?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs shrink-0 gap-1"
                    >
                      <Link to={ROUTES.JOBS.DETAIL(selectedJob.id)}>
                        <span>صفحة خاصة</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Salary Disclosure */}
                  {formatSalary(selectedJob) && (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                      <span className="text-xs text-primary font-bold">الراتب المعلن:</span>
                      <span className="text-sm font-extrabold text-white font-mono">{formatSalary(selectedJob)}</span>
                    </div>
                  )}

                  {/* Description Excerpt */}
                  <div>
                    <h4 className="text-xs font-bold text-white font-heading mb-2">نبذة عن الوظيفة</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedJob.excerpt || "نبحث عن كفاءة مميزة للانضمام للفريق وتطوير حلول ومنتجات فائقة الجودة."}
                    </p>
                  </div>

                  {/* Required Skills */}
                  {selectedJob.skills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-white font-heading mb-2">المهارات المطلوبة</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="pt-4 border-t border-white/5">
                    <ApplyGateButton jobId={selectedJob.id} />
                  </div>

                </div>
              ) : (
                <div className="p-12 border border-white/5 rounded-2xl bg-card/20 text-center text-muted-foreground text-xs">
                  اختر وظيفة من القائمة لعرض التفاصيل
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
