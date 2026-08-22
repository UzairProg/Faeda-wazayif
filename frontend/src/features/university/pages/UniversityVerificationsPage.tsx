import { useState } from "react"
import { useTranslation } from "@/i18n"
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
  const { isRTL } = useTranslation()
  const [statusFilter, setStatusFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
          {isRTL ? "منظومة التوثيق الأكاديمي والتحقق الرقمي" : "Academic Verification & Digital Badging"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isRTL
            ? "معالجة طلبات توثيق المؤهلات الأكاديمية والدرجات العلمية وإصدار أختام الاعتماد الرقمية."
            : "Review academic degree verification requests and issue verified credentials."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-4 md:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3.5" : "left-3.5"} w-4 h-4 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث باسم الطالب أو رقم الهوية..." : "Search by student name..."}
              className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="">{isRTL ? "جميع الحالات" : "All Status"}</option>
            <option value="pending">{isRTL ? "بانتظار المعالجة" : "Pending"}</option>
            <option value="verified">{isRTL ? "تم التوثيق والاعتماد" : "Verified"}</option>
            <option value="rejected">{isRTL ? "مرفوضة / غير مطابقة" : "Rejected"}</option>
          </select>

          {/* Department Filter */}
          <div className="w-full md:w-48">
            <input
              type="text"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              placeholder={isRTL ? "تصفية بالتخصص..." : "Filter department..."}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table / List of Verifications */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : data?.verifications && data.verifications.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#090e1a]/90 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="p-4 text-start font-semibold">{isRTL ? "الطالب / الخريج" : "Student"}</th>
                  <th className="p-4 text-start font-semibold">{isRTL ? "المؤهل والتخصص" : "Degree & Major"}</th>
                  <th className="p-4 text-start font-semibold">{isRTL ? "سنة التخرج / المعدل" : "Grad Year / GPA"}</th>
                  <th className="p-4 text-start font-semibold">{isRTL ? "الحالة والرمز الرقمي" : "Status & Code"}</th>
                  <th className="p-4 text-end font-semibold">{isRTL ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.verifications.map((v) => {
                  const isVerified = v.status === "verified"
                  const isRejected = v.status === "rejected"
                  const isPending = v.status === "pending"

                  return (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700">
                            {v.student_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{v.student_name}</span>
                            <span className="text-[10px] text-slate-400">ID: {v.student_user_id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-200 block">{v.degree}</span>
                        <span className="text-[11px] text-slate-400">{v.department}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-300 block">{v.graduation_year || "—"}</span>
                        <span className="text-[11px] text-slate-400">{v.gpa ? `GPA: ${v.gpa}` : "—"}</span>
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
                                ? isRTL ? "معتمد وموثق" : "Verified"
                                : isRejected
                                ? isRTL ? "مرفوض" : "Rejected"
                                : isRTL ? "بانتظار التحقق" : "Pending"}
                            </span>
                          </span>

                          {v.verification_code && (
                            <div className="text-[10px] font-mono text-slate-400">
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
                                <span>{isRTL ? "اعتماد" : "Approve"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenAction(v, "rejected")}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>{isRTL ? "رفض" : "Reject"}</span>
                              </button>
                            </>
                          )}

                          {!isPending && (
                            <button
                              type="button"
                              onClick={() => handleOpenAction(v, isVerified ? "rejected" : "verified")}
                              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              {isRTL ? "تعديل القرار" : "Modify Decision"}
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
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/80 p-12 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">
            {isRTL ? "لا توجد طلبات توثيق مطابقة" : "No verification records found"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "سيتم إدراج طلبات توثيق المؤهلات الأكاديمية الصادرة من الخريجين هنا تلقائياً."
              : "Degree verification requests submitted by students will appear here."}
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
