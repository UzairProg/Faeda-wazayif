import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityStudents } from "../hooks/useUniversityStudents"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { StudentAcademicCard } from "../components/StudentAcademicCard"
import { VerificationModal } from "../components/VerificationModal"
import type { UniversityStudentItem } from "../types/university.types"
import {
  Users,
  Search,
  Loader2,
} from "lucide-react"

export function UniversityStudentsPage() {
  const { isRTL } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [qualificationFilter, setQualificationFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [verificationFilter, setVerificationFilter] = useState("")

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
          {isRTL ? "دليل الطلاب والخريجين" : "Students & Graduates Directory"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isRTL
            ? "استعراض الكفاءات الطلابية المتصلة بالجامعة، تتبع الجاهزية المهنية، وإصدار التوثيقات الرسمية."
            : "Browse connected university talents, track career readiness, and issue verified academic records."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-4 md:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3.5" : "left-3.5"} w-4 h-4 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث باسم الطالب، التخصص، أو مجال العمل..." : "Search by student name, major, skills..."}
              className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none`}
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-48">
            <input
              type="text"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder={isRTL ? "تصفية بالتخصص..." : "Filter by major..."}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Qualification Filter */}
          <select
            value={qualificationFilter}
            onChange={(e) => setQualificationFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{isRTL ? "جميع المؤهلات" : "All Degrees"}</option>
            <option value="بكالوريوس">{isRTL ? "بكالوريوس" : "Bachelor"}</option>
            <option value="ماجستير">{isRTL ? "ماجستير" : "Master"}</option>
            <option value="دكتوراه">{isRTL ? "دكتوراه" : "PhD"}</option>
            <option value="دبلوم">{isRTL ? "دبلوم" : "Diploma"}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{isRTL ? "جميع الحالات" : "All Status"}</option>
            <option value="خريج">{isRTL ? "خريج" : "Graduate"}</option>
            <option value="طالب">{isRTL ? "طالب" : "Student"}</option>
          </select>

          {/* Verification Status */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{isRTL ? "حالة التوثيق" : "Verification"}</option>
            <option value="verified">{isRTL ? "موثق" : "Verified"}</option>
            <option value="pending">{isRTL ? "معلق" : "Pending"}</option>
            <option value="unrequested">{isRTL ? "غير موثق" : "Unverified"}</option>
          </select>
        </div>
      </div>

      {/* Grid of Student Cards */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : data?.students && data.students.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.students.map((student) => (
            <StudentAcademicCard
              key={student.id}
              student={student}
              onVerifyDirect={(t) => setVerifyTarget(t)}
              isRtl={isRTL}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/80 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">
            {isRTL ? "لم يتم العثور على نتائج مطابقة" : "No students found"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "جرب تعديل معايير البحث أو تصفية التخصصات لعرض المزيد من الطلاب والخريجين."
              : "Try adjusting search criteria or clearing filters."}
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
