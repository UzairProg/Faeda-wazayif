import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { ROUTES } from "@/config/routes"
import { useCompanyDashboard } from "../hooks/useCompanyDashboard"
import { useCompanyActions } from "../hooks/useCompanyActions"
import { CompanyStatsGrid } from "../components/CompanyStatsGrid"
import { CompanyProfileHealthCard } from "../components/CompanyProfileHealthCard"
import { JobCard } from "../components/JobCard"
import { ApplicationCard } from "../components/ApplicationCard"
import { JobModal } from "../components/JobModal"
import { ApplicationStatusModal } from "../components/ApplicationStatusModal"
import { EmployerCandidateModal } from "../components/EmployerCandidateModal"
import type {
  CompanyApplicationItem,
  CreateJobPayload,
  CompanyTalentDetail,
} from "../types/company.types"
import {
  Sparkles,
  Plus,
  Briefcase,
  Users,
  Search,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Building2,
  MessageSquare,
} from "lucide-react"

export function CompanyDashboardPage() {
  const { isRTL } = useTranslation()
  const { data: dashboard, isLoading, error } = useCompanyDashboard()
  const { createJobMutation, updateApplicationStatusMutation, deleteJobMutation } =
    useCompanyActions()

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedAppForStatus, setSelectedAppForStatus] =
    useState<CompanyApplicationItem | null>(null)
  const [selectedCandidate, setSelectedCandidate] =
    useState<CompanyTalentDetail | null>(null)

  const handleCreateJob = async (payload: CreateJobPayload) => {
    await createJobMutation.mutateAsync(payload)
    setIsJobModalOpen(false)
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

  const handleDeleteJob = async (jobId: number) => {
    if (
      window.confirm(
        isRTL
          ? "هل أنت متأكد من رغبتك في حذف هذه الفرصة الوظيفية؟"
          : "Are you sure you want to delete this opportunity?"
      )
    ) {
      await deleteJobMutation.mutateAsync(jobId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">
            {isRTL ? "جاري تحميل مركز عمليات المنشأة..." : "Loading Command Center..."}
          </span>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400">
        <p className="text-sm font-bold">
          {isRTL
            ? "تعذر تحميل بيانات لوحة المنشأة. يرجى التأكد من تسجيل الدخول والمحاولة لاحقاً."
            : "Failed to load company dashboard. Please verify your session."}
        </p>
      </div>
    )
  }

  const { company, stats, profileCompleteness, recentApplications, recentJobs } = dashboard

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl overflow-hidden shadow-inner">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {company.name}
                </h1>
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    <span>{isRTL ? "منشأة موثقة" : "Verified"}</span>
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {isRTL
                  ? "مرحباً بك في مركز قيادة استقطاب الكفاءات والفرق المهنية"
                  : "Welcome to your Talent Acquisition & Team Hiring Command Center"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.COMPANY.CHAT}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>{isRTL ? "الرسائل المهنية" : "Messages"}</span>
            </Link>

            <Link
              to={ROUTES.COMPANY.TALENT}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Search className="h-4 w-4 text-emerald-400" />
              <span>{isRTL ? "استكشاف الكفاءات" : "Discover Talent"}</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsJobModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{isRTL ? "نشر فرصة جديدة" : "Post Opportunity"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Statistics Grid ───────────────────────────────────────── */}
      <CompanyStatsGrid stats={stats} isRtl={isRTL} />

      {/* ── Profile Health Banner ─────────────────────────────────────── */}
      <CompanyProfileHealthCard completeness={profileCompleteness} isRtl={isRTL} />

      {/* ── Two Column Sections: Recent Applications & Active Jobs ─────── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                {isRTL ? "أحدث المتقدمين للوظائف" : "Recent Applications"}
              </h2>
            </div>

            <Link
              to={ROUTES.COMPANY.APPLICATIONS}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>{isRTL ? "عرض كل المتقدمين" : "View Pipeline"}</span>
              {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
              <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                {isRTL ? "لا توجد طلبات تقديم حديثة حالياً" : "No recent applications yet"}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {isRTL
                  ? "عندما يتقدم المرشحون لوظائفك ستظهر طلباتهم هنا فوراً للفرز والمراجعة"
                  : "New applicants will appear here in real-time for evaluation"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app as any}
                  onViewCandidate={(a) => setSelectedCandidate(a.candidate as any)}
                  onChangeStatus={(a) => setSelectedAppForStatus(a)}
                  isRtl={isRTL}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Company Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                {isRTL ? "الوظائف والفرص المعلنة" : "Your Opportunities"}
              </h2>
            </div>

            <Link
              to={ROUTES.COMPANY.JOBS}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>{isRTL ? "إدارة كل الوظائف" : "Manage All Jobs"}</span>
              {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
              <Briefcase className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                {isRTL ? "لم تقم بنشر أي وظائف بعد" : "No opportunities posted yet"}
              </p>
              <button
                type="button"
                onClick={() => setIsJobModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-600/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isRTL ? "نشر أول فرصة وظيفية" : "Post First Job"}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  onDelete={handleDeleteJob}
                  isRtl={isRTL}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={handleCreateJob}
        isLoading={createJobMutation.isPending}
        isRtl={isRTL}
      />

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
