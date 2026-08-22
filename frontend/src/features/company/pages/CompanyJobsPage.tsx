import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useCompanyJobs } from "../hooks/useCompanyJobs"
import { useCompanyActions } from "../hooks/useCompanyActions"
import { JobCard } from "../components/JobCard"
import { JobModal } from "../components/JobModal"
import type { CompanyJob, CreateJobPayload } from "../types/company.types"
import {
  Briefcase,
  Plus,
  Search,
  Loader2,
} from "lucide-react"

export function CompanyJobsPage() {
  const { isRTL } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<CompanyJob | null>(null)

  const { data, isLoading, error } = useCompanyJobs({
    status: statusFilter === "all" ? undefined : statusFilter,
    q: searchQuery || undefined,
  })

  const { createJobMutation, updateJobMutation, deleteJobMutation } =
    useCompanyActions()

  const handleCreateOrUpdate = async (payload: CreateJobPayload) => {
    if (editingJob) {
      await updateJobMutation.mutateAsync({ id: editingJob.id, payload })
    } else {
      await createJobMutation.mutateAsync(payload)
    }
    setIsModalOpen(false)
    setEditingJob(null)
  }

  const handleEdit = (job: CompanyJob) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleDelete = async (jobId: number) => {
    if (
      window.confirm(
        isRTL
          ? "هل أنت متأكد من حذف هذه الوظيفة وجميع طلبات التقديم المرتبطة بها؟"
          : "Are you sure you want to delete this job and associated applications?"
      )
    ) {
      await deleteJobMutation.mutateAsync(jobId)
    }
  }

  const tabs = [
    { id: "all", label_ar: "جميع الوظائف", label_en: "All Jobs" },
    { id: "approved", label_ar: "النشطة والمنشورة", label_en: "Active" },
    { id: "pending", label_ar: "قيد المراجعة", label_en: "Pending" },
    { id: "draft", label_ar: "المسودات", label_en: "Drafts" },
    { id: "closed", label_ar: "المغلقة", label_en: "Closed" },
  ]

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-emerald-400" />
            <span>{isRTL ? "إدارة الوظائف والفرص المعلنة" : "Jobs & Opportunities"}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isRTL
              ? "نشر الشواغر، متابعة الإعلانات الوظيفية، واستعراض المتقدمين لكل شاغر"
              : "Post openings, manage listings, and review candidate applicant pipelines"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingJob(null)
            setIsModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{isRTL ? "نشر فرصة جديدة" : "Post Opportunity"}</span>
        </button>
      </div>

      {/* ── Filters & Search ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setStatusFilter(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === t.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {isRTL ? t.label_ar : t.label_en}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 rtl:left-auto left-auto rtl:right-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "بحث في المسمى أو التخصص..." : "Search jobs..."}
            className="w-full pl-3 pr-9 rtl:pr-9 rtl:pl-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Jobs Grid ────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs font-semibold">
              {isRTL ? "جاري تحميل الوظائف..." : "Loading Opportunities..."}
            </span>
          </div>
        </div>
      ) : error || !data ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400 text-xs font-bold">
          {isRTL ? "تعذر تحميل قائمة الوظائف" : "Failed to load jobs"}
        </div>
      ) : data.jobs.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 space-y-3">
          <Briefcase className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            {isRTL ? "لا توجد وظائف مطابقة للفلتر المحدد" : "No opportunities matching filters"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL
              ? "قم بنشر فرصة جديدة أو تغيير معايير البحث لاستعراض الوظائف السابقة."
              : "Post a new opportunity or adjust your search filters."}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingJob(null)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>{isRTL ? "نشر فرصة وظيفية" : "Post Opportunity"}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isRtl={isRTL}
            />
          ))}
        </div>
      )}

      {/* ── Job Modal ─────────────────────────────────────────────────── */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingJob(null)
        }}
        onSubmit={handleCreateOrUpdate}
        initialJob={editingJob}
        isLoading={createJobMutation.isPending || updateJobMutation.isPending}
        isRtl={isRTL}
      />
    </div>
  )
}
