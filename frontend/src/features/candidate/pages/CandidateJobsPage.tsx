/**
 * CandidateJobsPage.tsx — Explore and discover opportunities tailored for the candidate.
 * Connects Candidate Identity → Relevant Opportunities with real search & filters.
 */
import { useState, useEffect } from "react"
import { useTranslation } from "@/i18n"
import { useCandidateJobs } from "../hooks/useCandidateJobs"
import { CandidateJobCard } from "../components/jobs/CandidateJobCard"
import { CandidateJobFilters } from "../components/jobs/CandidateJobFilters"
import { ApplyModal } from "../components/jobs/ApplyModal"
import type { CandidateJobItem, CandidateJobsFilterParams } from "../types/candidate.types"
import { Briefcase, Sparkles, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"

export function CandidateJobsPage() {
  const { isRTL } = useTranslation()
  const [filters, setFilters] = useState<CandidateJobsFilterParams>({
    page: 1,
    page_size: 12,
  })

  const [selectedJobForApply, setSelectedJobForApply] = useState<CandidateJobItem | null>(null)

  const {
    jobs,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    refetch,
  } = useCandidateJobs(filters)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [filters.page])

  const handleResetFilters = () => {
    setFilters({ page: 1, page_size: 12 })
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/90 via-[#0a101d]/90 to-[#070b14]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRTL ? "الفرص الوظيفية النشطة" : "Active Career Opportunities"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {isRTL ? "استكشاف الوظائف المتاحة" : "Explore Opportunities"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRTL
                ? "تصفح أحدث الوظائف المعتمدة في السوق السعودي وقدّم مباشرة باستخدام ملفك المهني."
                : "Browse verified opportunities in Saudi Arabia and apply seamlessly using your profile."}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 self-start sm:self-auto">
            {total} {isRTL ? "وظيفة متاحة" : "opportunities available"}
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <CandidateJobFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Job Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 space-y-4">
              <div className="h-10 w-32 bg-slate-800 rounded-xl" />
              <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
              <div className="h-4 w-full bg-slate-800/60 rounded" />
              <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center space-y-3">
          <h3 className="text-sm font-bold text-white">
            {isRTL ? "تعذر تحميل الفرص الوظيفية" : "Unable to load opportunities"}
          </h3>
          <p className="text-xs text-slate-400">
            {isRTL ? "حدث خطأ أثناء جلب الوظائف. يرجى المحاولة مرة أخرى." : "An error occurred while fetching jobs. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRTL ? "إعادة المحاولة" : "Try Again"}</span>
          </button>
        </div>
      ) : jobs && jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <CandidateJobCard
                key={job.id}
                job={job}
                onApplyClick={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setFilters({ ...filters, page: page - 1 })}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                aria-label="Previous Page"
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <span className="text-xs text-slate-400 px-3 py-1">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setFilters({ ...filters, page: page + 1 })}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                aria-label="Next Page"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            {isRTL ? "لا توجد وظائف مطابقة للبحث" : "No matching opportunities found"}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "جرب تعديل كلمات البحث أو تصفية أنماط العمل لعرض المزيد من الفرص."
              : "Try adjusting your search criteria or resetting filters to see more opportunities."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>{isRTL ? "إعادة ضبط الفلاتر" : "Reset Filters"}</span>
          </button>
        </div>
      )}

      {/* Connected Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  )
}
