/**
 * CandidateJobDetailPage.tsx — Comprehensive Candidate Job Detail & One-Click Application view.
 * Connects Job Understanding → Profile-based Application → Status Tracking.
 */
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useCandidateJobDetail } from "../hooks/useCandidateJobDetail"
import { useCandidateJobActions } from "../hooks/useCandidateJobActions"
import { candidateService } from "../services/candidate.service"
import { ApplyModal } from "../components/jobs/ApplyModal"
import {
  Building2,
  MapPin,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export function CandidateJobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isRTL } = useTranslation()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const { job, isLoading, isError, refetch } = useCandidateJobDetail(id)
  const { saveJob, unsaveJob, isSaving, isUnsaving } = useCandidateJobActions()

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-48 rounded-3xl bg-slate-900/60 border border-slate-800" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 rounded-3xl bg-slate-900/50 border border-slate-800" />
          <div className="lg:col-span-4 h-80 rounded-3xl bg-slate-900/50 border border-slate-800" />
        </div>
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white font-heading">
          {isRTL ? "الوظيفة غير متاحة حالياً" : "Opportunity Not Available"}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {isRTL
            ? "قد تكون هذه الوظيفة قد اكتملت أو تم إيقاف استقبال الطلبات عليها."
            : "This opportunity might have been closed or is no longer accepting applications."}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to={ROUTES.CANDIDATE.JOBS}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            {isRTL ? "استكشاف الوظائف الأخرى" : "Browse Other Jobs"}
          </Link>
        </div>
      </div>
    )
  }

  const companyLogo = candidateService.getImageUrl(job.company.logoUrl || undefined)
  const isBookmarked = Boolean(job.isSaved)
  const hasApplied = Boolean(job.hasApplied)
  const readiness = job.candidateReadiness

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      await unsaveJob(job.id)
    } else {
      await saveJob(job.id)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to={ROUTES.CANDIDATE.ROOT} className="hover:text-slate-200 transition-colors">
          {isRTL ? "لوحة التحكم" : "Dashboard"}
        </Link>
        <span>/</span>
        <Link to={ROUTES.CANDIDATE.JOBS} className="hover:text-slate-200 transition-colors">
          {isRTL ? "الفرص الوظيفية" : "Opportunities"}
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-medium truncate max-w-xs">{job.title}</span>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/95 via-[#0a101d]/95 to-[#070b14]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company & Title details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0 shadow-lg">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={job.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  {job.company.name}
                </span>
                {job.company.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isRTL ? "شركة موثقة" : "Verified Company"}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                {job.title}
              </h1>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-400">
                {job.location && (
                  <span className="inline-flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/40">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{job.location}</span>
                  </span>
                )}
                {job.workType && (
                  <span className="inline-flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/40">
                    <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                    <span>{job.workType}</span>
                  </span>
                )}
                {job.isRemote && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
                    <span>{isRTL ? "عن بعد" : "Remote"}</span>
                  </span>
                )}
                {job.salary && job.salary.isDisclosed && (
                  <span className="inline-flex items-center gap-1 bg-slate-800/60 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700/40 font-semibold">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} SAR
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (Bookmark & Apply CTA) */}
          <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              disabled={isSaving || isUnsaving}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isBookmarked
                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">
                {isBookmarked ? (isRTL ? "محفوظة" : "Saved") : (isRTL ? "حفظ" : "Save")}
              </span>
            </button>

            {hasApplied ? (
              <Link
                to={job.applicationId ? ROUTES.CANDIDATE.APPLICATION_DETAIL(job.applicationId) : ROUTES.CANDIDATE.APPLICATIONS}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "تم التقديم (عرض الطلب)" : "Applied (View Application)"}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>{isRTL ? "التقديم باستخدام الملف المهني" : "Apply with Profile"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8-Cols: Role Description, Responsibilities, Requirements */}
        <div className="lg:col-span-8 space-y-6">
          {/* About the Role */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white font-heading">
              {isRTL ? "عن الوظيفة والمهام" : "About the Role"}
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description || (isRTL ? "لا يوجد وصف تفصيلي متوفر حالياً." : "No detailed description provided.")}
            </div>
          </div>

          {/* Skills / What You'll Work With */}
          {job.skills && job.skills.length > 0 && (
            <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
              <h2 className="text-base font-bold text-white font-heading">
                {isRTL ? "المهارات والتقنيات المطلوبة" : "Skills & Technologies"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700/60 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
              <h2 className="text-base font-bold text-white font-heading">
                {isRTL ? "المتطلبات والمؤهلات" : "Requirements"}
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 4-Cols: Sticky Application Box & Company Overview */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Quick Profile Readiness Panel */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-slate-900/60 to-slate-900/80 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  {isRTL ? "التقديم المباشر" : "Direct Profile Apply"}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isRTL ? "بياناتك المعتمدة على فائدة" : "Your verified Faeda identity"}
                </span>
              </div>
            </div>

            {readiness && (
              <div className="space-y-2.5 text-xs text-slate-300 py-2 border-y border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRTL ? "اكتمال الملف:" : "Profile completeness:"}</span>
                  <span className="font-bold text-primary">{readiness.profilePercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRTL ? "السيرة الذاتية (CV):" : "Resume (CV):"}</span>
                  <span className={`font-semibold ${readiness.hasCv ? "text-emerald-400" : "text-amber-400"}`}>
                    {readiness.hasCv ? (isRTL ? "مرفوعة" : "Uploaded") : (isRTL ? "غير متوفرة" : "Missing")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isRTL ? "المهارات المسجلة:" : "Registered skills:"}</span>
                  <span className="font-semibold text-white">{readiness.skillsCount}</span>
                </div>
              </div>
            )}

            {hasApplied ? (
              <Link
                to={job.applicationId ? ROUTES.CANDIDATE.APPLICATION_DETAIL(job.applicationId) : ROUTES.CANDIDATE.APPLICATIONS}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "تم تقديم طلبك لهذه الوظيفة" : "Application Already Submitted"}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>{isRTL ? "تقديم الطلب الآن" : "Apply Now"}</span>
              </button>
            )}
          </div>

          {/* About Company Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0">
                {companyLogo ? (
                  <img src={companyLogo} alt={job.company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-heading">{job.company.name}</h4>
                {job.company.location && (
                  <span className="text-[11px] text-slate-400">{job.company.location}</span>
                )}
              </div>
            </div>

            {job.company.about && (
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {job.company.about}
              </p>
            )}

            {job.company.id && (
              <div className="pt-2">
                <Link
                  to={ROUTES.COMPANIES.DETAIL(job.company.id)}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>{isRTL ? "عرض ملف الشركة الكامل" : "View Company Profile"}</span>
                  {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connected Apply Modal */}
      <ApplyModal
        job={job}
        readiness={readiness}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
