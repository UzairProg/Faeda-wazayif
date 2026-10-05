/**
 * features/admin/pages/AdminJobsPage.tsx
 *
 * Job Postings Governance & Content Moderation Console.
 */
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import type { AdminJob } from "../types/admin.types"
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Building2,
  MapPin,
  Users,
  Loader2,
  Archive,
  Eye,
  X,
  DollarSign,
  GraduationCap,
} from "lucide-react"

export function AdminJobsPage() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "jobs", statusFilter, searchQuery, page],
    queryFn: () =>
      adminService.getJobs({
        status: statusFilter === "all" ? undefined : statusFilter,
        q: searchQuery || undefined,
        page,
        per_page: 20,
      }),
  })

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: "approved" | "rejected" | "pending" | "archived"
    }) => adminService.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })

  const handleUpdateStatus = (job: AdminJob, nextStatus: "approved" | "rejected" | "archived") => {
    statusMutation.mutate({ id: job.id, status: nextStatus })
  }

  const handleDeleteJob = (job: AdminJob) => {
    const confirmMsg =
      language === "ar"
        ? `هل أنت متأكد من حذف وظيفة "${job.title}" نهائياً من المنصة؟`
        : `Are you sure you want to permanently delete job "${job.title}"?`

    if (window.confirm(confirmMsg)) {
      deleteMutation.mutate(job.id)
    }
  }

  const statusTabs = [
    { id: "all", label_ar: "جميع الوظائف", label_en: "All Jobs" },
    { id: "pending", label_ar: "قيد المراجعة", label_en: "Pending Moderation" },
    { id: "approved", label_ar: "النشطة والمقبولة", label_en: "Approved & Active" },
    { id: "rejected", label_ar: "المرفوضة", label_en: "Rejected" },
    { id: "archived", label_ar: "المؤرشفة", label_en: "Archived" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{language === "ar" ? "معتمدة ونشطة" : "Approved"}</span>
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>{language === "ar" ? "بانتظار المراجعة" : "Pending"}</span>
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>{language === "ar" ? "مرفوضة" : "Rejected"}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-muted-foreground border border-white/10">
            <Archive className="w-3 h-3" />
            <span>{status}</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {language === "ar" ? "مراجعة وإدارة الوظائف" : "Job Postings Moderation"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "ar"
              ? "مراقبة جودة عروض العمل، التحقق من نزاهة الوظائف واعتمادها للنشر الفوري."
              : "Quality control, verification of corporate postings, and publishing moderation."}
          </p>
        </div>
      </div>

      {/* ── Filters & Search ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-card/70 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id)
                  setPage(1)
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {language === "ar" ? tab.label_ar : tab.label_en}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-muted-foreground" />
          <input
            type="text"
            placeholder={language === "ar" ? "بحث بعنوان الوظيفة أو المدينة..." : "Search by title, location..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-background/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* ── Jobs Table ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">
              {language === "ar" ? "جاري تحميل الوظائف..." : "Loading jobs list..."}
            </p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400 text-xs">
            {error instanceof Error ? error.message : "حدث خطأ أثناء تحميل الوظائف."}
          </div>
        ) : !data?.jobs || data.jobs.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm space-y-2">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p>{language === "ar" ? "لا توجد وظائف تطابق خيارات التصفية." : "No jobs found matching your criteria."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-muted-foreground uppercase font-mono text-[11px]">
                  <th className="py-4 px-6 text-start">{language === "ar" ? "الوظيفة والمنشأة" : "Job Title & Company"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "الموقع والنوع" : "Location / Type"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "المتقدمين" : "Applicants"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "الحالة" : "Status"}</th>
                  <th className="py-4 px-6 text-end">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title & Company */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {j.company_name?.[0]?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm hover:text-primary transition-colors">
                            {j.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{j.company_name}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location & Type */}
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{j.town}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">{j.job_type}</div>
                    </td>

                    {/* Applicants count */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-white">
                        <Users className="w-3 h-3 text-primary" />
                        <span>{j.applicants_count}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(j.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-end">
                      <div className="inline-flex items-center gap-2">
                        {/* View Job Details */}
                        <button
                          onClick={() => setSelectedJob(j)}
                          className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          title={language === "ar" ? "معاينة الوظيفة" : "View Details"}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {j.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(j, "approved")}
                            disabled={statusMutation.isPending}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-bold transition-colors flex items-center gap-1"
                            title={language === "ar" ? "اعتماد الوظيفة ونشرها" : "Approve Job"}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{language === "ar" ? "قبول" : "Approve"}</span>
                          </button>
                        )}

                        {j.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(j, "rejected")}
                            disabled={statusMutation.isPending}
                            className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold transition-colors flex items-center gap-1"
                            title={language === "ar" ? "رفض الوظيفة" : "Reject Job"}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{language === "ar" ? "رفض" : "Reject"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteJob(j)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          title={language === "ar" ? "حذف نهائي" : "Delete Job"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {language === "ar"
                ? `الصفحة ${data.page} من ${data.total_pages} (${data.total} وظيفة)`
                : `Page ${data.page} of ${data.total_pages} (${data.total} total)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
              >
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Job Details Modal ───────────────────────────────────── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedJob.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-primary font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{selectedJob.company_name}</span>
                    </span>
                    {getStatusBadge(selectedJob.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-background/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 py-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-muted-foreground">{language === "ar" ? "المدينة: " : "Location: "}</span>
                  <span className="text-white font-medium">{selectedJob.town || "—"}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-muted-foreground">{language === "ar" ? "نوع العمل: " : "Job Type: "}</span>
                  <span className="text-white font-medium">{selectedJob.job_type || "—"}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">{language === "ar" ? "التخصص: " : "Specialty: "}</span>
                  <span className="text-white font-medium">{selectedJob.specialization || "—"}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-muted-foreground">{language === "ar" ? "المؤهل: " : "Education: "}</span>
                  <span className="text-white font-medium">{selectedJob.educational_qualification || "—"}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-muted-foreground">{language === "ar" ? "سنوات الخبرة: " : "Experience: "}</span>
                  <span className="text-white font-medium">{selectedJob.skills_years || "—"}</span>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-muted-foreground">{language === "ar" ? "الراتب: " : "Salary: "}</span>
                  <span className="text-white font-medium">
                    {selectedJob.salary_min && selectedJob.salary_max
                      ? `${selectedJob.salary_min} - ${selectedJob.salary_max} SAR`
                      : language === "ar" ? "يحدد لاحقاً" : "Negotiable"}
                  </span>
                </div>

                <div className="flex items-center gap-2 py-1 sm:col-span-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">{language === "ar" ? "عدد المتقدمين: " : "Applicants: "}</span>
                  <span className="text-white font-bold">{selectedJob.applicants_count}</span>
                  {selectedJob.created_at && (
                    <span className="text-muted-foreground/60 mr-auto ltr:ml-auto">
                      {new Date(selectedJob.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-5 mt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {selectedJob.status !== "approved" && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob, "approved")
                      setSelectedJob((prev) => (prev ? { ...prev, status: "approved" } : null))
                    }}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "اعتماد وقبول" : "Approve Job"}</span>
                  </button>
                )}

                {selectedJob.status !== "rejected" && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob, "rejected")
                      setSelectedJob((prev) => (prev ? { ...prev, status: "rejected" } : null))
                    }}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "رفض" : "Reject"}</span>
                  </button>
                )}

                {selectedJob.status !== "archived" && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedJob, "archived")
                      setSelectedJob((prev) => (prev ? { ...prev, status: "archived" } : null))
                    }}
                    disabled={statusMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-white/10 text-xs font-semibold transition-all"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "أرشفة" : "Archive"}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDeleteJob(selectedJob)
                    setSelectedJob(null)
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  title={language === "ar" ? "حذف نهائي" : "Delete Job"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
