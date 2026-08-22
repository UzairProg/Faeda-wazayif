import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { useUniversityDashboard } from "../hooks/useUniversityDashboard"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { UniversityProfileHealthCard } from "../components/UniversityProfileHealthCard"
import { UniversityStatsGrid } from "../components/UniversityStatsGrid"
import { StudentAcademicCard } from "../components/StudentAcademicCard"
import { VerificationModal } from "../components/VerificationModal"
import { ROUTES } from "@/config/routes"
import type { UniversityStudentItem } from "../types/university.types"
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react"

export function UniversityDashboardPage() {
  const { isRTL } = useTranslation()
  const { data, isLoading, error } = useUniversityDashboard()
  const { directVerifyStudent, isDirectVerifying } = useUniversityActions()

  const [verifyTarget, setVerifyTarget] = useState<UniversityStudentItem | null>(null)

  const handleConfirmDirectVerify = async (status: "verified" | "rejected", notes?: string) => {
    if (!verifyTarget) return
    if (status === "verified") {
      await directVerifyStudent({
        id: verifyTarget.id,
        payload: {
          degree: verifyTarget.educational_qualification,
          department: verifyTarget.department,
          graduation_year: verifyTarget.graduation_date,
          gpa: verifyTarget.gpa,
          notes,
        },
      })
    }
    setVerifyTarget(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center">
        <h3 className="text-base font-bold text-rose-400">
          {isRTL ? "تعذر تحميل لوحة التحكم الأكاديمية" : "Failed to load academic dashboard"}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {isRTL ? "يرجى التحقق من اتصالك بالإنترنت وتحديث الصفحة." : "Please check connection and refresh."}
        </p>
      </div>
    )
  }

  const { institution, stats, recent_students, recent_verifications } = data
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-[#090e1a] p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="h-4 w-4" />
                <span>{institution.institution_type || (isRTL ? "جامعة معتمدة" : "Accredited University")}</span>
              </span>

              {institution.qs_rank && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {institution.qs_rank}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight">
              {institution.name_ar || institution.name}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {institution.description_ar ||
                (isRTL
                  ? "منظومة الربط الأكاديمي والمهني لتوثيق مخرجات التعليم وتأهيل الخريجين لسوق العمل."
                  : "Connecting verified academic identity to employer opportunities and career intelligence.")}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.UNIVERSITY.VERIFICATIONS}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isRTL ? "معالجة طلبات التوثيق" : "Process Verifications"}</span>
            </Link>

            <Link
              to={ROUTES.UNIVERSITY.STUDENTS}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{isRTL ? "دليل الطلاب والخريجين" : "Student Directory"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Health Scorecard */}
      <UniversityProfileHealthCard completeness={institution.completeness} isRtl={isRTL} />

      {/* Live Aggregated Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {isRTL ? "مؤشرات المنظومة الأكاديمية والمهنية" : "Academic Ecosystem Metrics"}
          </h2>
          <span className="text-[11px] text-slate-400">
            {isRTL ? "إحصائيات حية مبنية على بيانات واقعية" : "Live verified statistics"}
          </span>
        </div>
        <UniversityStatsGrid stats={stats} isRtl={isRTL} />
      </div>

      {/* Two Column Section: Recent Verifications Queue & Recent Students */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Verification Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {isRTL ? "أحدث طلبات التوثيق الأكاديمي" : "Recent Verification Requests"}
              </h3>
            </div>

            <Link
              to={ROUTES.UNIVERSITY.VERIFICATIONS}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>{isRTL ? "عرض الكل" : "View All"}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recent_verifications && recent_verifications.length > 0 ? (
              recent_verifications.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-[#090e1a]/80 backdrop-blur-md"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {v.student_name}
                      </span>
                      {v.status === "verified" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {v.degree} — {v.department} ({v.graduation_year})
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      v.status === "verified"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : v.status === "rejected"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {v.status === "verified"
                      ? isRTL ? "معتمد" : "Verified"
                      : v.status === "rejected"
                      ? isRTL ? "مرفوض" : "Rejected"
                      : isRTL ? "معلق" : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">
                  {isRTL ? "لا توجد طلبات توثيق معلقة حالياً." : "No pending verification requests."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Connected Students (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                {isRTL ? "أحدث الطلاب والخريجين المتصلين" : "Recently Connected Students"}
              </h3>
            </div>

            <Link
              to={ROUTES.UNIVERSITY.STUDENTS}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300"
            >
              <span>{isRTL ? "استكشاف الدليل" : "Explore Directory"}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {recent_students && recent_students.length > 0 ? (
              recent_students.slice(0, 4).map((s) => (
                <StudentAcademicCard
                  key={s.id}
                  student={s}
                  onVerifyDirect={(target) => setVerifyTarget(target)}
                  isRtl={isRTL}
                />
              ))
            ) : (
              <div className="col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">
                  {isRTL ? "لم يسجل طلاب بعد في هذا الصرح الأكاديمي." : "No connected students yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Hub Cards: Departments & Opportunities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.UNIVERSITY.DEPARTMENTS}
          className="group p-5 rounded-3xl border border-slate-800 bg-[#090e1a]/80 backdrop-blur-md hover:border-sky-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                  {isRTL ? "الأقسام والتخصصات الأكاديمية" : "Academic Departments & Programs"}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? "إدارة الكليات، الدرجات العلمية، وربط المخرجات" : "Manage faculties and degree levels"}
                </p>
              </div>
            </div>
            <ArrowIcon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </Link>

        <Link
          to={ROUTES.UNIVERSITY.OPPORTUNITIES}
          className="group p-5 rounded-3xl border border-slate-800 bg-[#090e1a]/80 backdrop-blur-md hover:border-rose-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                  {isRTL ? "فرص التوظيف والشراكات" : "Career Opportunities & Partnerships"}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? "استعراض الوظائف النشطة المتوافقة مع تخصصات الطلاب" : "Active job listings aligned with majors"}
                </p>
              </div>
            </div>
            <ArrowIcon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* Verification Modal */}
      {verifyTarget && (
        <VerificationModal
          isOpen={Boolean(verifyTarget)}
          onClose={() => setVerifyTarget(null)}
          studentName={verifyTarget.fullname}
          degree={verifyTarget.educational_qualification}
          department={verifyTarget.department}
          graduationYear={verifyTarget.graduation_date}
          gpa={verifyTarget.gpa}
          onSubmit={handleConfirmDirectVerify}
          isLoading={isDirectVerifying}
          isRtl={isRTL}
        />
      )}
    </div>
  )
}
