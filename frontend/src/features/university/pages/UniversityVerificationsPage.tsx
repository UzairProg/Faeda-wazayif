import { useState } from "react"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"
import { useUniversityVerifications } from "../hooks/useUniversityVerifications"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { VerificationModal } from "../components/VerificationModal"
import type { VerificationQueueItem } from "../types/university.types"
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Loader2,
  Check,
  X,
} from "lucide-react"

export function UniversityVerificationsPage() {
  const { isRTL, language } = useTranslation()
  const [statusFilter, setStatusFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [tokenSearch, setTokenSearch] = useState("")

  const [activeItem, setActiveItem] = useState<VerificationQueueItem | null>(null)
  const [actionType, setActionType] = useState<"verified" | "rejected">("verified")

  const { data, isLoading } = useUniversityVerifications({
    status: statusFilter || undefined,
    department: departmentFilter || undefined,
    q: searchQuery || undefined,
  })

  const { updateVerification, isUpdatingVerification } = useUniversityActions()

  const handleOpenAction = (item: VerificationQueueItem, type: "verified" | "rejected") => {
    setActiveItem(item)
    setActionType(type)
  }

  const handleConfirmDecision = async (status: "verified" | "rejected", notes?: string) => {
    if (!activeItem) return
    await updateVerification({
      id: activeItem.id,
      payload: { status, notes },
    })
    setActiveItem(null)
  }

  // Compute stats
  const verifications = data?.verifications || []
  const totalRequests = verifications.length
  const verifiedCount = verifications.filter((v) => v.status === "verified").length
  const pendingCount = verifications.filter((v) => v.status === "pending").length
  const rejectedCount = verifications.filter((v) => v.status === "rejected").length

  // Token search result
  const tokenResult = tokenSearch.trim()
    ? verifications.find((v) => v.verification_code?.toLowerCase().includes(tokenSearch.toLowerCase().trim()))
    : null

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-secondary to-primary opacity-80" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{tl(language, "نظام التحقق الرقمي المعتمد", "Official Digital Verification System", "आधिकारिक डिजिटल सत्यापन प्रणाली")}</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight font-heading">
            {tl(
              language,
              "منظومة التوثيق الأكاديمي والتحقق الرقمي",
              "Academic Verification & Digital Badging",
              "शैक्षणिक सत्यापन और डिजिटल बैजिंग"
            )}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
            {tl(
              language,
              "معالجة طلبات توثيق المؤهلات الأكاديمية والدرجات العلمية وإصدار أختام الاعتماد الرقمية.",
              "Review academic degree verification requests and issue verified credentials.",
              "डिग्री सत्यापन अनुरोधों की समीक्षा करें और डिजिटल क्रेडेंशियल जारी करें।"
            )}
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border border-border bg-card/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>{tl(language, "إجمالي الطلبات", "Total Requests", "कुल अनुरोध")}</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalRequests}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
            <span>{tl(language, "تم التوثيق", "Verified", "सत्यापित")}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{verifiedCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
            <span>{tl(language, "بانتظار المعالجة", "Pending Review", "समीक्षा लंबित")}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{pendingCount}</div>
        </div>
        <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-950/20 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-300">
            <span>{tl(language, "مرفوضة", "Rejected", "अस्वीकृत")}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{rejectedCount}</div>
        </div>
      </div>

      {/* Quick Token Verification */}
      <div className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>{tl(language, "التحقق بالرمز الرقمي", "Verify by Token", "टोकन द्वारा सत्यापन")}</span>
          </div>
          <input
            type="text"
            value={tokenSearch}
            onChange={(e) => setTokenSearch(e.target.value)}
            placeholder={tl(language, "أدخل رمز التحقق مثال: FAEDA-VERIF-KSU-8392", "Enter token e.g. FAEDA-VERIF-KSU-8392", "टोकन दर्ज करें जैसे FAEDA-VERIF-KSU-8392")}
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-white text-xs font-mono placeholder:text-muted-foreground focus:border-secondary focus:outline-none"
          />
        </div>
        {tokenSearch.trim() && (
          <div className="mt-3 p-3 rounded-xl border border-border bg-background/60">
            {tokenResult ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-emerald-400">{tl(language, "✓ تم التحقق بنجاح", "✓ Verified Successfully", "✓ सफलतापूर्वक सत्यापित")}</div>
                  <div className="text-white font-bold">{tokenResult.student_name}</div>
                  <div className="text-muted-foreground">{tokenResult.degree} — {tokenResult.department} ({tokenResult.graduation_year})</div>
                  {tokenResult.gpa && <div className="text-muted-foreground font-mono">GPA: {tokenResult.gpa}</div>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{tl(language, "لم يتم العثور على نتائج مطابقة لهذا الرمز", "No matching verification found for this token", "इस टोकन के लिए कोई मिलान नहीं मिला")}</span>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-border bg-card/85 p-4 md:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
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
                "ابحث باسم الطالب أو رقم الهوية...",
                "Search by student name...",
                "छात्र का नाम या आईडी से खोजें..."
              )}
              className={`w-full ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 rounded-2xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 rounded-2xl border border-border bg-background text-white text-xs focus:border-secondary focus:outline-none transition-colors"
          >
            <option value="">
              {tl(language, "جميع الحالات", "All Status", "सभी स्थितियां")}
            </option>
            <option value="pending">
              {tl(language, "بانتظار المعالجة", "Pending", "लंबित")}
            </option>
            <option value="verified">
              {tl(language, "تم التوثيق والاعتماد", "Verified", "सत्यापित")}
            </option>
            <option value="rejected">
              {tl(language, "مرفوضة / غير مطابقة", "Rejected", "अस्वीकृत")}
            </option>
          </select>

          {/* Department Filter */}
          <div className="w-full md:w-48">
            <input
              type="text"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder={tl(
                language,
                "تصفية بالتخصص...",
                "Filter department...",
                "विभाग फ़िल्टर करें..."
              )}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table / List of Verifications */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data?.verifications && data.verifications.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-border bg-card/85 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-border bg-background/60 text-muted-foreground">
                <tr>
                  <th className="p-4 text-start font-semibold">
                    {tl(language, "الطالب / الخريج", "Student", "छात्र / स्नातक")}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {tl(language, "المؤهل والتخصص", "Degree & Major", "योग्यता और मेजर")}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {tl(
                      language,
                      "سنة التخرج / المعدل",
                      "Grad Year / GPA",
                      "स्नातक वर्ष / जीपीए"
                    )}
                  </th>
                  <th className="p-4 text-start font-semibold">
                    {tl(
                      language,
                      "الحالة والرمز الرقمي",
                      "Status & Code",
                      "स्थिति और डिजिटल कोड"
                    )}
                  </th>
                  <th className="p-4 text-end font-semibold">
                    {tl(language, "الإجراءات", "Actions", "कार्रवाई")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.verifications.map((v) => {
                  const isVerified = v.status === "verified"
                  const isRejected = v.status === "rejected"
                  const isPending = v.status === "pending"

                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-card/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-white font-bold text-xs border border-border">
                            {v.student_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">
                              {v.student_name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {v.student_user_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-200 block">
                          {v.degree}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {v.department}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-300 block">
                          {v.graduation_year || "—"}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {v.gpa ? `GPA: ${v.gpa}` : "—"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isVerified
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : isRejected
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {isVerified ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : isRejected ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span>
                              {isVerified
                                ? tl(language, "معتمد وموثق", "Verified", "सत्यापित")
                                : isRejected
                                ? tl(language, "مرفوض", "Rejected", "अस्वीकृत")
                                : tl(
                                    language,
                                    "بانتظار التحقق",
                                    "Pending",
                                    "सत्यापन लंबित"
                                  )}
                            </span>
                          </span>

                          {v.verification_code && (
                            <div className="text-[10px] font-mono text-muted-foreground">
                              {v.verification_code}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenAction(v, "verified")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/40"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>
                                  {tl(language, "اعتماد", "Approve", "स्वीकृत करें")}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenAction(v, "rejected")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>
                                  {tl(language, "رفض", "Reject", "अस्वीकार करें")}
                                </span>
                              </button>
                            </>
                          )}

                          {!isPending && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenAction(
                                  v,
                                  isVerified ? "rejected" : "verified"
                                )
                              }
                              className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-white hover:bg-card/80 transition-colors"
                            >
                              {tl(
                                language,
                                "تعديل القرار",
                                "Modify Decision",
                                "निर्णय बदलें"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/85 p-12 text-center backdrop-blur-xl shadow-xl">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-bold text-white">
            {tl(
              language,
              "لا توجد طلبات توثيق مطابقة",
              "No verification records found",
              "कोई सत्यापन रिकॉर्ड नहीं मिला"
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {tl(
              language,
              "سيتم إدراج طلبات توثيق المؤهلات الأكاديمية الصادرة من الخريجين هنا تلقائياً.",
              "Degree verification requests submitted by students will appear here.",
              "छात्रों द्वारा सबमिट किए गए डिग्री सत्यापन अनुरोध यहां दिखाई देंगे।"
            )}
          </p>
        </div>
      )}

      {/* Verification Modal */}
      {activeItem && (
        <VerificationModal
          isOpen={Boolean(activeItem)}
          onClose={() => setActiveItem(null)}
          studentName={activeItem.student_name}
          degree={activeItem.degree}
          department={activeItem.department}
          graduationYear={activeItem.graduation_year}
          gpa={activeItem.gpa}
          initialStatus={actionType}
          onSubmit={handleConfirmDecision}
          isLoading={isUpdatingVerification}
          isRtl={isRTL}
        />
      )}
    </div>
  )
}
