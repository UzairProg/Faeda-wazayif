/**
 * features/public/pages/CompaniesPage.tsx
 *
 * Public Companies discovery directory page.
 * Features search with autocomplete, location & verification filters,
 * URL query synchronization, responsive directory rows, and loading/error/empty states.
 */
import { useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Building2, Sparkles, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useCompanies } from "@/features/companies/hooks/useCompanies"
import { CompanyRow } from "@/features/companies/components/CompanyRow"
import { CompanySearch } from "@/features/companies/components/CompanySearch"
import { CompanyFilters } from "@/features/companies/components/CompanyFilters"
import { CompanyRowSkeleton } from "@/features/companies/components/CompanySkeleton"
import { ROUTES } from "@/config/routes"

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse filters from URL
  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""
  const verified = searchParams.get("verified") === "true"
  const hasJobs = searchParams.get("has_jobs") === "true"
  const page = parseInt(searchParams.get("page") || "1", 10)

  const filter = useMemo(
    () => ({
      query,
      location,
      verified,
      hasJobs,
      page,
      pageSize: 10,
    }),
    [query, location, verified, hasJobs, page]
  )

  const { data, isLoading, error, refetch } = useCompanies(filter)

  // Update URL helper
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === "false") {
        next.delete(key)
      } else {
        next.set(key, val)
      }
    })
    // Reset to page 1 on filter changes
    if (newParams.page === undefined) {
      next.delete("page")
    }
    setSearchParams(next)
  }

  const handleQueryChange = (q: string) => {
    updateUrlParams({ q })
  }

  const handleLocationChange = (loc: string) => {
    updateUrlParams({ location: loc })
  }

  const handleVerifiedChange = (v: boolean) => {
    updateUrlParams({ verified: v ? "true" : null })
  }

  const handleHasJobsChange = (h: boolean) => {
    updateUrlParams({ has_jobs: h ? "true" : null })
  }

  const handleResetFilters = () => {
    setSearchParams({})
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20">
      {/* Radial Washes */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* 01. Compact Header / Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Building2 className="w-4 h-4" />
            <span>منظومة الشركات وأصحاب العمل</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            الشركات والمؤسسات <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
              اكتشف الجهات التي تقود فرص العمل
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            تعرّف على الشركات المسجلة بالمنظومة، بيئة عملها، ونطاق الفرص المتاحة لديها.
          </p>
        </div>

        {/* 02. Discovery Controls (Search & Filters) */}
        <div className="space-y-4 mb-10">
          <CompanySearch
            query={query}
            location={location}
            onQueryChange={handleQueryChange}
            onLocationChange={handleLocationChange}
            onSearch={refetch}
          />

          <CompanyFilters
            verified={verified}
            hasJobs={hasJobs}
            location={location}
            onVerifiedChange={handleVerifiedChange}
            onHasJobsChange={handleHasJobsChange}
            onLocationChange={handleLocationChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* 03. Directory Results */}
        <div className="space-y-4 mb-10">
          {/* Results Count Header */}
          <div className="flex items-center justify-between px-2 text-xs sm:text-sm text-muted-foreground font-semibold">
            <span>
              {isLoading
                ? "جارٍ تحميل النتائج..."
                : data
                ? `عرض ${data.companies.length} من أصل ${data.total} شركة`
                : "النتائج"}
            </span>

            {query && (
              <span className="text-white font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                البحث: "{query}"
              </span>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="space-y-4">
              <CompanyRowSkeleton />
              <CompanyRowSkeleton />
              <CompanyRowSkeleton />
            </div>
          ) : error ? (
            /* Error State */
            <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-4 my-8">
              <p className="text-xl font-bold text-white">تعذر تحميل قائمة الشركات</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                حدثت مشكلة أثناء الإتصال بالخادم. يرجى التأكد من اتصال الشكبة والمحاولة مرة أخرى.
              </p>
              <Button
                onClick={() => refetch()}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </Button>
            </GlassCard>
          ) : data && data.companies.length > 0 ? (
            /* Companies List */
            <div className="space-y-4">
              {data.companies.map((comp) => (
                <CompanyRow key={comp.id} company={comp} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <GlassCard className="p-12 text-center bg-card/40 border-white/10 space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto mb-2">
                <Building2 className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-white">لم نجد شركات تطابق بحثك</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                جرّب تغيير اسم الشركة، الكلمة المفتاحية، أو المدينة، أو قم بإزالة الفلاتر المحددة.
              </p>
              <Button
                onClick={handleResetFilters}
                className="rounded-xl px-6 bg-primary/20 hover:bg-primary border border-primary/30 text-white font-bold text-xs sm:text-sm"
              >
                مسح جميع الفلاتر
              </Button>
            </GlassCard>
          )}
        </div>

        {/* 04. Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.page - 1)}
              disabled={data.page <= 1}
              className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
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
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 05. Small Employer CTA */}
        <GlassCard className="p-8 sm:p-10 bg-gradient-to-r from-primary/10 via-card to-card border-primary/20 text-start flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>أصحاب العمل والشركات</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mb-1">
              هل تملك شركة وترغب باستقطاب أفضل الكفاءات؟
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              سجل حساب منشأة، انشر وظائفك الفردية أو عروض الفرق التخصصية بالمنظومة.
            </p>
          </div>

          <Link to={`${ROUTES.AUTH.REGISTER}?role=company`} className="shrink-0">
            <Button size="lg" className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20">
              <span>سجل حساب شركة</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </GlassCard>

      </div>
    </div>
  )
}
