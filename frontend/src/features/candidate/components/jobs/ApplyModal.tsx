/**
 * ApplyModal.tsx — Profile-powered application confirmation modal.
 * Connects Candidate Identity → One-Click Profile Application with real data.
 */
import { useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { CandidateJobItem, CandidateReadiness } from "../../types/candidate.types"
import { useCandidateJobActions } from "../../hooks/useCandidateJobActions"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import {
  X,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react"

interface ApplyModalProps {
  job: CandidateJobItem
  readiness?: CandidateReadiness | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ApplyModal({
  job,
  readiness,
  isOpen,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const { isRTL } = useTranslation()
  const { applyToJob, isApplying } = useCandidateJobActions()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleApply = async () => {
    setErrorMsg(null)
    try {
      await applyToJob(job.id)
      setIsSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (isRTL ? "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة لاحقاً." : "An error occurred while submitting. Please try again.")
      setErrorMsg(msg)
    }
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
      >
        <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0c1322] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isApplying}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10 animate-scaleUp">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                {isRTL ? "تم تقديم طلبك بنجاح!" : "Application Submitted Successfully!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                {isRTL
                  ? `تم إرسال ملفك المهني وسيرتك الذاتية لشركة ${job.company.name}.`
                  : `Your verified professional identity was submitted to ${job.company.name}.`}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                to={ROUTES.CANDIDATE.APPLICATIONS}
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                <span>{isRTL ? "متابعة طلباتي" : "View My Applications"}</span>
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        ) : (
          /* Application Review Screen */
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>{isRTL ? "التقديم عبر هوية فائدة" : "Apply with Faeda Profile"}</span>
              </div>
              <h2 id="apply-modal-title" className="text-lg font-bold text-white font-heading">
                {job.title}
              </h2>
              <span className="text-xs text-slate-400 block mt-0.5">
                {job.company.name} • {job.location || "المملكة العربية السعودية"}
              </span>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Identity & Readiness Review Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {isRTL ? "بيانات ملفك التي سيتم إرسالها:" : "Profile Data to be submitted:"}
              </span>

              <div className="space-y-2 text-xs">
                {/* Candidate Name & Email */}
                {readiness?.fullName && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{isRTL ? "الاسم:" : "Name:"}</span>
                    </span>
                    <span className="font-semibold text-white">{readiness.fullName}</span>
                  </div>
                )}

                {/* CV Status */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isRTL ? "السيرة الذاتية (CV):" : "Resume (CV):"}</span>
                  </span>
                  <span className={`font-semibold ${readiness?.hasCv ? "text-emerald-400" : "text-amber-400"}`}>
                    {readiness?.hasCv
                      ? (isRTL ? "مرفوعة وجاهزة" : "Uploaded & Ready")
                      : (isRTL ? "غير مرفوعة (سيتم استخدام الملف الرقمي)" : "Not attached (Profile only)")}
                  </span>
                </div>

                {/* Education */}
                {readiness?.education && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRTL ? "المؤهل العلمي:" : "Education:"}</span>
                    </span>
                    <span className="font-semibold text-slate-200">{readiness.education}</span>
                  </div>
                )}
              </div>

              {/* Edit Profile quick link */}
              <div className="pt-2 border-t border-slate-800/80 text-end">
                <Link
                  to={ROUTES.CANDIDATE.PROFILE}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  {isRTL ? "تحديث بيانات الملف قبل التقديم" : "Edit profile before applying"}
                </Link>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRTL ? "جارٍ التقديم..." : "Submitting..."}</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>{isRTL ? "تأكيد التقديم الآن" : "Confirm & Submit Application"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isApplying}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ModalPortal>
  )
}
