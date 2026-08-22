/**
 * CandidateApplicationDetailPage.tsx — Detailed view of a submitted application with real timeline and snapshot.
 */
import { useParams, Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useCandidateApplicationDetail } from "../hooks/useCandidateApplicationDetail"
import { ApplicationStatusTimeline } from "../components/applications/ApplicationStatusTimeline"
import { candidateService } from "../services/candidate.service"
import {
  Building2,
  Clock,
  Briefcase,
  AlertCircle,
  User,
  GraduationCap,
  ShieldCheck,
  Download,
  MessageSquare,
} from "lucide-react"

export function CandidateApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isRTL } = useTranslation()

  const { application, isLoading, isError } = useCandidateApplicationDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-44 rounded-3xl bg-slate-900/60 border border-slate-800" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-80 rounded-3xl bg-slate-900/50 border border-slate-800" />
          <div className="lg:col-span-5 h-80 rounded-3xl bg-slate-900/50 border border-slate-800" />
        </div>
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white font-heading">
          {isRTL ? "طلب التقديم غير موجود" : "Application Not Found"}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {isRTL ? "لم يتم العثور على تفاصيل هذا الطلب أو ليس لديك صلاحية الوصول إليه." : "Could not find application details or unauthorized."}
        </p>
        <Link
          to={ROUTES.CANDIDATE.APPLICATIONS}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
        >
          {isRTL ? "العودة لقائمة الطلبات" : "Back to Applications"}
        </Link>
      </div>
    )
  }

  const companyLogo = candidateService.getImageUrl(application.company.logoUrl || undefined)
  const snapshot = application.candidateSnapshot

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to={ROUTES.CANDIDATE.ROOT} className="hover:text-slate-200 transition-colors">
          {isRTL ? "لوحة التحكم" : "Dashboard"}
        </Link>
        <span>/</span>
        <Link to={ROUTES.CANDIDATE.APPLICATIONS} className="hover:text-slate-200 transition-colors">
          {isRTL ? "طلبات التقديم" : "Applications"}
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-medium truncate max-w-xs">
          {application.job?.title || `طلب #${application.id}`}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1322]/95 via-[#0a101d]/95 to-[#070b14]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 font-bold overflow-hidden shrink-0 shadow-lg">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={application.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  {application.company.name}
                </span>
                {application.company.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {application.job?.title || (isRTL ? "وظيفة شاغرة" : "Job Application")}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                {application.appliedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isRTL ? "تاريخ التقديم:" : "Applied:"}{" "}
                      {new Date(application.appliedAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {application.company?.id && (
              <Link
                to={`${ROUTES.CANDIDATE.CHAT}?new=true&type=CANDIDATE_COMPANY&targetId=${application.company.id}&contextType=job_application&contextId=${application.id}&subject=${encodeURIComponent(application.job?.title || 'طلب توظيف')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isRTL ? "مراسلة المنشأة" : "Contact Employer"}</span>
              </Link>
            )}
            {application.job?.id && (
              <Link
                to={ROUTES.CANDIDATE.JOB_DETAIL(application.job.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isRTL ? "عرض الإعلان" : "View Job Post"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid: Left Timeline + Right Candidate Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7-Cols: Real Status Progression Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-6">
            <h2 className="text-base font-bold text-white font-heading">
              {isRTL ? "مراحل طلب التوظيف" : "Application Status Timeline"}
            </h2>

            <ApplicationStatusTimeline timeline={application.timeline} />

            {/* Recruiter Note if any */}
            {application.note && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-300 block">
                  {isRTL ? "ملاحظة مسؤول التوظيف:" : "Recruiter Note:"}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{application.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 5-Cols: Candidate Profile Snapshot at Submission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white font-heading">
              {isRTL ? "ملف المرشح وقت التقديم" : "Submitted Candidate Snapshot"}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{isRTL ? "الاسم:" : "Name:"}</span>
                </span>
                <span className="font-semibold text-white">{snapshot?.name}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isRTL ? "المؤهل العلمي:" : "Education:"}</span>
                </span>
                <span className="font-semibold text-slate-200">{snapshot?.education || "—"}</span>
              </div>

              {/* Snapshot Skills */}
              {snapshot?.skills && snapshot.skills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-slate-400 block">{isRTL ? "المهارات المرفقة:" : "Attached Skills:"}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {snapshot.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CV File */}
              {snapshot?.cvFile && (
                <div className="pt-3">
                  <a
                    href={candidateService.getCVDownloadUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isRTL ? "تحميل السيرة الذاتية (CV)" : "Download Attached CV"}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
