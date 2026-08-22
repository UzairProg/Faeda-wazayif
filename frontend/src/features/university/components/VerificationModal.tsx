import React, { useState } from "react"
import { X, Loader2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  degree: string
  department: string
  graduationYear?: string
  gpa?: string
  initialStatus?: string
  onSubmit: (status: "verified" | "rejected", notes?: string) => Promise<void>
  isLoading?: boolean
  isRtl?: boolean
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  studentName,
  degree,
  department,
  graduationYear,
  gpa,
  initialStatus = "verified",
  onSubmit,
  isLoading = false,
  isRtl = true,
}) => {
  if (!isOpen) return null

  const [status, setStatus] = useState<"verified" | "rejected">(
    initialStatus === "rejected" ? "rejected" : "verified"
  )
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(status, notes)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isRtl ? "التوثيق الأكاديمي الرسمي" : "Official Academic Verification"}
              </h2>
              <p className="text-xs text-slate-400">
                {studentName} — {degree} ({department})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Candidate Info Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{isRtl ? "اسم الطالب / الخريج:" : "Student Name:"}</span>
              <span className="font-bold text-white">{studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isRtl ? "المؤهل الأكاديمي:" : "Qualification:"}</span>
              <span className="font-medium text-slate-200">{degree} — {department}</span>
            </div>
            {graduationYear && (
              <div className="flex justify-between">
                <span className="text-slate-400">{isRtl ? "سنة التخرج:" : "Graduation Year:"}</span>
                <span className="font-medium text-slate-200">{graduationYear}</span>
              </div>
            )}
            {gpa && (
              <div className="flex justify-between">
                <span className="text-slate-400">{isRtl ? "المعدل التراكمي:" : "GPA:"}</span>
                <span className="font-medium text-slate-200">{gpa}</span>
              </div>
            )}
          </div>

          {/* Decision Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {isRtl ? "قرار التوثيق الأكاديمي:" : "Verification Decision:"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("verified")}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-start transition-all ${
                  status === "verified"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-950/40"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {isRtl ? "اعتماد وتوثيق المؤهل" : "Approve & Verify"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? "إصدار ختم التحقق الرقمي" : "Issue verified badge"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus("rejected")}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-start transition-all ${
                  status === "rejected"
                    ? "border-rose-500 bg-rose-500/10 text-rose-300 shadow-md shadow-rose-950/40"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {isRtl ? "رفض / عدم المطابقة" : "Reject / Mismatch"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isRtl ? "السجل لا يطابق قواعد البيانات" : "Record mismatch"}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "ملاحظات عمادة القبول والتسجيل (اختياري)" : "Official Academic Notes (Optional)"}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isRtl
                  ? "مثال: تم التحقق من صحة الوثيقة وتطابق السجل الأكاديمي بالكامل..."
                  : "e.g. Verified against official university registry..."
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/40 transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isRtl ? "حفظ واعتماد القرار" : "Confirm Decision"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
