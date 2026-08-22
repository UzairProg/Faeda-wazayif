/**
 * CandidateSavedJobsPage.tsx — Manage saved/bookmarked job opportunities.
 */
import { useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useCandidateSavedJobs } from "../hooks/useCandidateSavedJobs"
import { CandidateJobCard } from "../components/jobs/CandidateJobCard"
import { ApplyModal } from "../components/jobs/ApplyModal"
import type { CandidateJobItem } from "../types/candidate.types"
import { Bookmark, Compass, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"

export function CandidateSavedJobsPage() {
  const { isRTL } = useTranslation()
  const [page, setPage] = useState(1)
  const [selectedJobForApply, setSelectedJobForApply] = useState<CandidateJobItem | null>(null)

  const {
    jobs,
    total,
    totalPages,
    isLoading,
    isError,
    refetch,
  } = useCandidateSavedJobs({ page, page_size: 12 })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/90 via-[#0a101d]/90 to-[#070b14]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isRTL ? "الوظائف المحفوظة" : "Saved Opportunities"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {isRTL ? "قائمة الوظائف المحفوظة" : "Saved Jobs"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRTL
                ? "الوظائف التي قمت بحفظها للرجوع إليها والتقديم عليها لاحقاً."
                : "Opportunities you have bookmarked to review or apply for later."}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 self-start sm:self-auto">
            {total} {isRTL ? "وظائف محفوظة" : "saved jobs"}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 space-y-4">
              <div className="h-10 w-32 bg-slate-800 rounded-xl" />
              <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
              <div className="h-4 w-full bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center space-y-3">
          <h3 className="text-sm font-bold text-white">
            {isRTL ? "تعذر تحميل الوظائف المحفوظة" : "Unable to load saved jobs"}
          </h3>
          <p className="text-xs text-slate-400">
            {isRTL ? "حدث خطأ أثناء جلب الوظائف. يرجى المحاولة مرة أخرى." : "An error occurred while fetching saved jobs."}
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
                onClick={() => setPage((p) => p - 1)}
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
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                aria-label="Next Page"
              >
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            {isRTL ? "لا توجد وظائف محفوظة حالياً" : "No saved jobs yet"}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "يمكنك حفظ أي وظيفة تعجبك أثناء استكشاف الفرص للرجوع إليها لاحقاً بسهولة."
              : "Bookmark opportunities while browsing to easily access and apply for them later."}
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.CANDIDATE.JOBS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{isRTL ? "استكشاف الوظائف" : "Explore Jobs"}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Connected Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  )
}
