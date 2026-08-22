import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { useUniversityStudentDetail } from "../hooks/useUniversityStudentDetail"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { StudentCareerReadinessCard } from "../components/StudentCareerReadinessCard"
import { VerificationModal } from "../components/VerificationModal"
import { ROUTES } from "@/config/routes"
import {
  GraduationCap,
  ShieldCheck,
  Award,
  FolderGit2,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react"

export function UniversityStudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isRTL } = useTranslation()
  const { data, isLoading, error } = useUniversityStudentDetail(id)
  const { directVerifyStudent, isDirectVerifying } = useUniversityActions()

  const [verifyModalOpen, setVerifyModalOpen] = useState(false)

  const student = data?.student

  const handleConfirmVerify = async (status: "verified" | "rejected", notes?: string) => {
    if (!student) return
    if (status === "verified") {
      await directVerifyStudent({
        id: student.id,
        payload: {
          degree: student.academic_profile.degree,
          department: student.academic_profile.department,
          graduation_year: student.academic_profile.graduation_date,
          gpa: student.academic_profile.gpa,
          notes,
        },
      })
    }
    setVerifyModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center">
        <h3 className="text-base font-bold text-rose-400">
          {isRTL ? "تعذر عرض ملف الطالب الأكاديمي" : "Unable to load student academic record"}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {isRTL
            ? "السجل غير موجود أو لا يملك الصرح الأكاديمي صلاحية الوصول إليه."
            : "Record not found or not authorized."}
        </p>
        <Link
          to={ROUTES.UNIVERSITY.STUDENTS}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
        >
          {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isRTL ? "العودة إلى دليل الطلاب" : "Back to Directory"}</span>
        </Link>
      </div>
    )
  }

  const isVerified = student.verification.status === "verified"
  const BackArrow = isRTL ? ArrowRight : ArrowLeft

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to={ROUTES.UNIVERSITY.STUDENTS}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <BackArrow className="w-4 h-4" />
        <span>{isRTL ? "العودة إلى دليل الطلاب والخريجين" : "Back to Students Directory"}</span>
      </Link>

      {/* Header Profile Dossier Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-[#090e1a] p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/80 text-white font-bold text-2xl shadow-inner overflow-hidden">
              {student.img ? (
                <img
                  src={student.img.startsWith("http") ? student.img : `/${student.img}`}
                  alt={student.fullname}
                  className="h-full w-full object-cover"
                />
              ) : (
                student.fullname.charAt(0)
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
                  {student.fullname}
                </h1>

                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isRTL ? "مؤهل أكاديمي معتمد وموثق" : "Verified Qualification"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-4 h-4" />
                    <span>{isRTL ? "بانتظار التوثيق الأكاديمي" : "Pending Verification"}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>{student.academic_profile.degree} — {student.academic_profile.department}</span>
                <span className="text-slate-600">•</span>
                <span>{student.academic_profile.university}</span>
              </p>

              {student.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{student.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action */}
          <div>
            {!isVerified ? (
              <button
                type="button"
                onClick={() => setVerifyModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isRTL ? "إصدار وثيقة التوثيق الأكاديمي" : "Issue Official Verification"}</span>
              </button>
            ) : (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-start space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {isRTL ? "رمز التحقق الرقمي الرسمي" : "Digital Verification Code"}
                </div>
                <div className="text-xs font-black text-white font-mono">
                  {student.verification.verification_code || "FAEDA-VERIF-KSU-8392"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Academic & Professional Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Academic Profile Details Card */}
          <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{isRTL ? "بيانات السجل والمؤهل الأكاديمي" : "Academic Records & Qualification"}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "الدرجة العلمية" : "Degree"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.academic_profile.degree}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "التخصص الدقيق" : "Department"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.academic_profile.department}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "سنة التخرج" : "Graduation Year"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.academic_profile.graduation_date}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "المعدل التراكمي (GPA)" : "Cumulative GPA"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.academic_profile.gpa}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "الحالة الأكاديمية" : "Academic Status"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.academic_profile.status}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <span className="text-[11px] text-slate-400">{isRTL ? "نمط العمل المفضل" : "Work Preference"}</span>
                <p className="text-xs font-bold text-white mt-1">{student.work_type || (isRTL ? "مرن" : "Flexible")}</p>
              </div>
            </div>
          </div>

          {/* Academic Projects & Thesis */}
          <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" />
              <span>{isRTL ? "مشاريع التخرج والابتكارات العملية" : "Graduation Projects & Innovations"}</span>
            </h3>

            {student.projects && student.projects.length > 0 ? (
              <div className="space-y-3">
                {student.projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{p.project_name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {isRTL ? `حجم المشروع: ${p.project_size}` : p.project_size}
                      </span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                    )}

                    {p.project_url && (
                      <a
                        href={p.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isRTL ? "رابط المشروع / المستودع" : "Project Link / Repository"}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                {isRTL ? "لم يسجل الطالب مشاريع إضافية بعد." : "No projects added yet."}
              </p>
            )}
          </div>

          {/* Technical Skills & Certifications */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Skills */}
            <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{isRTL ? "المهارات والكفاءات" : "Skills & Competencies"}</span>
              </h3>

              {student.skills && student.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">{isRTL ? "لا توجد مهارات مسجلة." : "No skills added."}</p>
              )}
            </div>

            {/* Certifications */}
            <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>{isRTL ? "الشهادات والاعتمادات" : "Certifications"}</span>
              </h3>

              {student.certifications && student.certifications.length > 0 ? (
                <div className="space-y-2">
                  {student.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{c.cert_name}</span>
                        <span className="text-[11px] text-slate-400 truncate">{c.issuing_org}</span>
                      </div>
                      {c.credential_url && (
                        <a
                          href={c.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">{isRTL ? "لا توجد شهادات مسجلة." : "No certifications added."}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Career Readiness & Market Benchmark (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Career Readiness Card */}
          <StudentCareerReadinessCard
            careerReadiness={student.career_readiness}
            hasCv={student.has_cv}
            skillsCount={student.skills.length}
            projectsCount={student.projects.length}
            certificationsCount={student.certifications.length}
            isVerified={isVerified}
            isRtl={isRTL}
          />

          {/* Market Benchmark Card (Informational only) */}
          {student.market_benchmark && (
            <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isRTL ? "المعيار السوقي الاسترشادي" : "Market Benchmark"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isRTL ? "مؤشر ذكاء الأعمال المعتمد" : "AI Market benchmark indicator"}
                    </p>
                  </div>
                </div>

                <span className="text-base font-black text-purple-400 font-mono">
                  {student.market_benchmark.score}/100
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isRTL ? "التخصص المالي:" : "Specialization:"}</span>
                  <span className="font-semibold text-slate-200">{student.market_benchmark.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isRTL ? "فئة الخبرة:" : "Tier:"}</span>
                  <span className="font-semibold text-slate-200">{student.market_benchmark.tier}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-tight">
                {isRTL
                  ? "هذا التقييم هو معيار سوقي استرشادي مستخلص من العرض والطلب ولا يمثل تقييماً أكاديمياً للجامعة."
                  : "This benchmark is derived from market indicators and does not represent an institutional grade."}
              </p>
            </div>
          )}

          {/* Official Verification Audit Details */}
          {isVerified && student.verification.verified_at && (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRTL ? "سجل الاعتماد الأكاديمي الرسمي" : "Official Verification Record"}</span>
              </div>
              <p className="text-slate-300">
                {isRTL
                  ? `تم الاعتماد بتاريخ ${student.verification.verified_at.split("T")[0]}`
                  : `Verified on ${student.verification.verified_at.split("T")[0]}`}
              </p>
              {student.verification.notes && (
                <p className="text-[11px] text-slate-400 italic">
                  "{student.verification.notes}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        studentName={student.fullname}
        degree={student.academic_profile.degree}
        department={student.academic_profile.department}
        graduationYear={student.academic_profile.graduation_date}
        gpa={student.academic_profile.gpa}
        onSubmit={handleConfirmVerify}
        isLoading={isDirectVerifying}
        isRtl={isRTL}
      />
    </div>
  )
}
