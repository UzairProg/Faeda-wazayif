/**
 * CandidateApplicationsPage.tsx — Track submitted job applications and status in real-time.
 * Connects Candidate Application → Status Tracking → Career Pipeline.
 */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useCandidateApplications } from "../hooks/useCandidateApplications"
import { ApplicationCard } from "../components/applications/ApplicationCard"
import { ApplicationFilterTabs } from "../components/applications/ApplicationFilterTabs"
import { Briefcase, Clock, Compass, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"

export function CandidateApplicationsPage() {
  const { isRTL } = useTranslation()
  const [activeStatus, setActiveStatus] = useState("all")
  const [page, setPage] = useState(1)

  const {
    applications,
    total,
    totalPages,
    isLoading,
    isError,
    refetch,
  } = useCandidateApplications({
    status: activeStatus === "all" ? undefined : activeStatus,
    page,
    page_size: 10,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page, activeStatus])

  const handleStatusChange = (newStatus: string) => {
    setActiveStatus(newStatus)
    setPage(1)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/90 via-[#0a101d]/90 to-[#070b14]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{isRTL ? "متابعة مسار التوظيف" : "Application Pipeline"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {isRTL ? "طلبات التقديم الخاصة بي" : "My Job Applications"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRTL
                ? "تابع مسار وحالة طلبات التقديم وملاحظات مسؤولي التوظيف في الشركات."
                : "Track the real-time status of your applications and recruiter interactions."}
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 self-start sm:self-auto">
            {total} {isRTL ? "طلبات مسجلة" : "applications total"}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <ApplicationFilterTabs
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        totalCount={total}
      />

      {/* Applications Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-44 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 space-y-3">
              <div className="h-10 w-32 bg-slate-800 rounded-xl" />
              <div className="h-5 w-48 bg-slate-800 rounded-lg" />
              <div className="h-4 w-28 bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center space-y-3">
          <h3 className="text-sm font-bold text-white">
            {isRTL ? "تعذر تحميل طلبات التقديم" : "Unable to load applications"}
          </h3>
          <p className="text-xs text-slate-400">
            {isRTL ? "حدث خطأ أثناء جلب الطلبات. يرجى المحاولة مرة أخرى." : "An error occurred while fetching your applications."}
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
      ) : applications && applications.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
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
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            {activeStatus === "all"
              ? (isRTL ? "لم تقم بالتقديم على أي فرصة بعد" : "No applications submitted yet")
              : (isRTL ? "لا توجد طلبات بهذه الحالة" : "No applications with this status")}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "استكشف الفرص الوظيفية المتاحة وقدّم مباشرة باستخدام ملفك المهني المعتمد."
              : "Explore matching career opportunities and apply directly using your verified profile."}
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.CANDIDATE.JOBS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{isRTL ? "استكشاف الفرص الوظيفية" : "Explore Opportunities"}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
