import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { useCompanyApplications } from "../hooks/useCompanyApplications"
import { useCompanyJobs } from "../hooks/useCompanyJobs"
import { useCompanyActions } from "../hooks/useCompanyActions"
import { ApplicationCard } from "../components/ApplicationCard"
import { ApplicationStatusModal } from "../components/ApplicationStatusModal"
import { EmployerCandidateModal } from "../components/EmployerCandidateModal"
import type {
  CompanyApplicationItem,
  CompanyTalentDetail,
} from "../types/company.types"
import {
  Users,
  Search,
  Loader2,
  Briefcase,
} from "lucide-react"

export function CompanyApplicationsPage() {
  const { isRTL } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const jobIdParam = searchParams.get("job_id")
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdParam || "all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Modals state
  const [selectedAppForStatus, setSelectedAppForStatus] =
    useState<CompanyApplicationItem | null>(null)
  const [selectedCandidate, setSelectedCandidate] =
    useState<CompanyTalentDetail | null>(null)

  const { data: jobsData } = useCompanyJobs()
  const { data: appsData, isLoading, error } = useCompanyApplications({
    job_id: selectedJobId === "all" ? undefined : Number(selectedJobId),
    status: statusFilter === "all" ? undefined : statusFilter,
    q: searchQuery || undefined,
  })

  const { updateApplicationStatusMutation } = useCompanyActions()

  useEffect(() => {
    if (jobIdParam) {
      setSelectedJobId(jobIdParam)
    }
  }, [jobIdParam])

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId)
    if (jobId === "all") {
      searchParams.delete("job_id")
    } else {
      searchParams.set("job_id", jobId)
    }
    setSearchParams(searchParams)
  }

  const handleUpdateStatus = async (status: string, note?: string) => {
    if (!selectedAppForStatus) return
    await updateApplicationStatusMutation.mutateAsync({
      id: selectedAppForStatus.id,
      status,
      note,
    })
    setSelectedAppForStatus(null)
  }

  const pipelineStages = [
    { id: "all", label_ar: "الكل", label_en: "All" },
    { id: "applied", label_ar: "جديد / تم التقديم", label_en: "Applied" },
    { id: "under_review", label_ar: "قيد المراجعة", label_en: "Under Review" },
    { id: "shortlisted", label_ar: "المرشحون للمقابلة", label_en: "Shortlisted" },
    { id: "interview", label_ar: "مرحلة المقابلات", label_en: "Interview" },
    { id: "accepted", label_ar: "تم التعيين", label_en: "Hired" },
    { id: "rejected", label_ar: "المستبعدون", label_en: "Rejected" },
  ]

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl flex items-center gap-2">
            <Users className="h-7 w-7 text-emerald-400" />
            <span>{isRTL ? "إدارة المتقدمين ومسار الفرز" : "Recruitment Pipeline"}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isRTL
              ? "مراجعة الكفاءات المتقدمة، تحديث مراحل التوظيف، وفحص السير الذاتية والمشاريع"
              : "Review applicants, evaluate credentials, manage hiring stages, and inspect profiles"}
          </p>
        </div>
      </div>

      {/* ── Filters: Job Selector, Pipeline Stages, Search ──────────── */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Job Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isRTL ? "تصفية حسب الوظيفة المعنية:" : "Filter by Job:"}</span>
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => handleJobChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">{isRTL ? "جميع الوظائف والفرص" : "All Opportunities"}</option>
              {jobsData?.jobs.map((j) => (
                <option key={j.id} value={String(j.id)}>
                  {j.title} ({j.applicantsCount} {isRTL ? "متقدم" : "applicants"})
                </option>
              ))}
            </select>
          </div>

          {/* Search by Candidate Name / Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isRTL ? "بحث في المتقدمين:" : "Search Candidate:"}</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "اسم المرشح، المسمى، أو المهارة..." : "Name, role, or skill..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          {pipelineStages.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {isRTL ? st.label_ar : st.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* ── Applications Stream ───────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs font-semibold">
              {isRTL ? "جاري تحميل قائمة المتقدمين..." : "Loading Pipeline..."}
            </span>
          </div>
        </div>
      ) : error || !appsData ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400 text-xs font-bold">
          {isRTL ? "تعذر تحميل طلبات التقديم" : "Failed to load applications"}
        </div>
      ) : appsData.applications.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 space-y-3">
          <Users className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            {isRTL ? "لا توجد طلبات تقديم مطابقة لمعايير البحث" : "No applications found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL
              ? "حاول تغيير الوظيفة المحددة أو مرحلة التوظيف لعرض باقي المتقدمين."
              : "Try switching stages or job filters to view candidates."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appsData.applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewCandidate={(a) => setSelectedCandidate(a.candidate as any)}
              onChangeStatus={(a) => setSelectedAppForStatus(a)}
              isRtl={isRTL}
            />
          ))}
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <ApplicationStatusModal
        isOpen={Boolean(selectedAppForStatus)}
        onClose={() => setSelectedAppForStatus(null)}
        application={selectedAppForStatus}
        onSubmit={handleUpdateStatus}
        isLoading={updateApplicationStatusMutation.isPending}
        isRtl={isRTL}
      />

      <EmployerCandidateModal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate}
        isRtl={isRTL}
      />
    </div>
  )
}
