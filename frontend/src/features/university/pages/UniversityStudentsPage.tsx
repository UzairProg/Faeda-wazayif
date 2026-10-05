import { useState } from "react"
import { useTranslation } from "@/i18n"
import { tl, getLocalizedStudents } from "../utils/universityLocalization"
import { useUniversityStudents } from "../hooks/useUniversityStudents"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { StudentAcademicCard } from "../components/StudentAcademicCard"
import { VerificationModal } from "../components/VerificationModal"
import type { UniversityStudentItem } from "../types/university.types"
import {
  Users,
  Search,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Download,
  LayoutGrid,
  List,
} from "lucide-react"

export function UniversityStudentsPage() {
  const { isRTL, language } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [qualificationFilter, setQualificationFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [verificationFilter, setVerificationFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [verifyTarget, setVerifyTarget] = useState<UniversityStudentItem | null>(null)
  const { directVerifyStudent, isDirectVerifying } = useUniversityActions()

  const { data, isLoading } = useUniversityStudents({
    q: searchQuery || undefined,
    department: departmentFilter || undefined,
    qualification: qualificationFilter || undefined,
    status: statusFilter || undefined,
    verification_status: verificationFilter || undefined,
  })

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

  const rawStudents = data?.students || []
  const students = getLocalizedStudents(rawStudents, language)

  // Compute KPI stats from students data
  const totalStudents = students.length
  const verifiedStudents = students.filter((s: any) => s.verification?.status === "verified" || s.verification_status === "verified").length
  const graduates = students.filter((s: any) => s.education_statue === "خريج" || s.education_statue === "graduate" || s.status === "خريج").length
  const activeJobSeekers = students.filter((s: any) => s.work_type === "full_time" || s.preferred_field).length

  const kpiCards = [
    {
      label: tl(language, "إجمالي الطلاب والخريجين", "Total Students & Alumni", "कुल छात्र और पूर्व छात्र"),
      value: totalStudents,
      icon: Users,
      color: "primary",
      bgClass: "bg-primary/10 border-primary/20 text-primary",
    },
    {
      label: tl(language, "موثق أكاديمياً", "Verified Credentials", "सत्यापित क्रेडेंशियल"),
      value: verifiedStudents,
      icon: ShieldCheck,
      color: "emerald",
      bgClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      label: tl(language, "خريجون", "Graduates", "स्नातक"),
      value: graduates,
      icon: GraduationCap,
      color: "secondary",
      bgClass: "bg-secondary/10 border-secondary/20 text-secondary",
    },
    {
      label: tl(language, "باحثون عن عمل", "Active Job Seekers", "सक्रिय नौकरी चाहने वाले"),
      value: activeJobSeekers,
      icon: Briefcase,
      color: "amber",
      bgClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
  ]

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Users className="w-3.5 h-3.5" />
                <span>{tl(language, "منظومة الكفاءات الطلابية", "Enterprise Talent Directory", "उद्यम प्रतिभा निर्देशिका")}</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight font-heading">
              {tl(language, "دليل الطلاب والخريجين", "Students & Graduates Directory", "छात्र और स्नातक निर्देशिका")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {tl(
                language,
                "استعراض الكفاءات الطلابية المتصلة بالجامعة، تتبع الجاهزية المهنية، وإصدار التوثيقات الرسمية.",
                "Browse connected university talents, track career readiness, and issue verified academic records.",
                "विश्वविद्यालय से जुड़ी प्रतिभाओं को ब्राउज़ करें, कैरियर तत्परता ट्रैक करें, और सत्यापित शैक्षणिक रिकॉर्ड जारी करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card/80 text-white text-xs font-bold hover:bg-card transition-all"
            >
              <Download className="w-4 h-4 text-secondary" />
              <span>{tl(language, "تصدير البيانات", "Export", "निर्यात")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border bg-card/80 backdrop-blur-md space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">{kpi.label}</span>
                <div className={`p-1.5 rounded-xl border ${kpi.bgClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{kpi.value}</div>
            </div>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-border bg-card/85 p-4 md:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "right-3.5" : "left-3.5"
              } w-4 h-4 text-muted-foreground`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tl(
                language,
                "ابحث باسم الطالب، التخصص، أو مجال العمل...",
                "Search by student name, major, skills...",
                "छात्र का नाम, मेजर या कौशल से खोजें..."
              )}
              className={`w-full ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 rounded-2xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors`}
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-48">
            <input
              type="text"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder={tl(
                language,
                "تصفية بالتخصص...",
                "Filter by major...",
                "मेजर द्वारा फ़िल्टर करें..."
              )}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
            />
          </div>

          {/* Qualification Filter */}
          <select
            value={qualificationFilter}
            onChange={(e) => setQualificationFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-border bg-background text-white text-xs focus:border-secondary focus:outline-none transition-colors"
          >
            <option value="">
              {tl(language, "جميع المؤهلات", "All Degrees", "सभी डिग्रियां")}
            </option>
            <option value="بكالوريوس">
              {tl(language, "بكالوريوس", "Bachelor", "बैचलर")}
            </option>
            <option value="ماجستير">
              {tl(language, "ماجستير", "Master", "मास्टर")}
            </option>
            <option value="دكتوراه">
              {tl(language, "دكتوراه", "PhD", "पीएचडी")}
            </option>
            <option value="دبلوم">
              {tl(language, "دبلوم", "Diploma", "डिप्लोमा")}
            </option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-border bg-background text-white text-xs focus:border-secondary focus:outline-none transition-colors"
          >
            <option value="">
              {tl(language, "جميع الحالات", "All Status", "सभी स्थितियां")}
            </option>
            <option value="خريج">
              {tl(language, "خريج", "Graduate", "स्नातक")}
            </option>
            <option value="طالب">
              {tl(language, "طالب", "Student", "छात्र")}
            </option>
          </select>

          {/* Verification Status */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-border bg-background text-white text-xs focus:border-secondary focus:outline-none transition-colors"
          >
            <option value="">
              {tl(language, "حالة التوثيق", "Verification", "सत्यापन स्थिति")}
            </option>
            <option value="verified">
              {tl(language, "موثق", "Verified", "सत्यापित")}
            </option>
            <option value="pending">
              {tl(language, "معلق", "Pending", "लंबित")}
            </option>
            <option value="unrequested">
              {tl(language, "غير موثق", "Unverified", "असत्यापित")}
            </option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-background rounded-2xl border border-border p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {tl(language, `عرض ${students.length} نتيجة`, `Showing ${students.length} results`, `${students.length} परिणाम दिखा रहे हैं`)}
          </span>
          {(searchQuery || departmentFilter || qualificationFilter || statusFilter || verificationFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setDepartmentFilter("")
                setQualificationFilter("")
                setStatusFilter("")
                setVerificationFilter("")
              }}
              className="text-primary hover:text-primary/80 font-bold"
            >
              {tl(language, "مسح جميع المرشحات", "Clear All Filters", "सभी फ़िल्टर साफ़ करें")}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Student Cards */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : students.length > 0 ? (
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {students.map((student) => (
            <StudentAcademicCard
              key={student.id}
              student={student}
              onVerifyDirect={(t) => setVerifyTarget(t)}
              isRtl={isRTL}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/85 p-12 text-center backdrop-blur-xl shadow-xl">
          <Users className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-bold text-white">
            {tl(
              language,
              "لم يتم العثور على نتائج مطابقة",
              "No students found",
              "कोई छात्र नहीं मिला"
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {tl(
              language,
              "جرب تعديل معايير البحث أو تصفية التخصصات لعرض المزيد من الطلاب والخريجين.",
              "Try adjusting search criteria or clearing filters.",
              "अधिक छात्र देखने के लिए खोज मानदंड या फ़िल्टर समायोजित करें।"
            )}
          </p>
        </div>
      )}

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

