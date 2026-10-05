import React, { useState } from "react"
import { X, Loader2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"

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
  const { language } = useTranslation()
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
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl z-10">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-secondary border border-primary/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {tl(
                    language,
                    "التوثيق الأكاديمي الرسمي",
                    "Official Academic Verification",
                    "आधिकारिक शैक्षणिक सत्यापन"
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {studentName} — {degree} ({department})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-card/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Candidate Info Summary */}
            <div className="rounded-2xl border border-border bg-background/60 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {tl(language, "اسم الطالب / الخريج:", "Student Name:", "छात्र का नाम:")}
                </span>
                <span className="font-bold text-white">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {tl(language, "المؤهل الأكاديمي:", "Qualification:", "शैक्षणिक योग्यता:")}
                </span>
                <span className="font-medium text-slate-200">
                  {degree} — {department}
                </span>
              </div>
              {graduationYear && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {tl(language, "سنة التخرج:", "Graduation Year:", "स्नातक वर्ष:")}
                  </span>
                  <span className="font-medium text-slate-200 font-mono">
                    {graduationYear}
                  </span>
                </div>
              )}
              {gpa && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {tl(language, "المعدل التراكمي:", "GPA:", "जीपीए:")}
                  </span>
                  <span className="font-medium text-slate-200 font-mono">{gpa}</span>
                </div>
              )}
            </div>

            {/* Decision Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {tl(
                  language,
                  "قرار التوثيق الأكاديمي:",
                  "Verification Decision:",
                  "सत्यापन निर्णय:"
                )}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("verified")}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-start transition-all ${
                    status === "verified"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-950/40"
                      : "border-border bg-background/40 text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {tl(
                        language,
                        "اعتماد وتوثيق المؤهل",
                        "Approve & Verify",
                        "स्वीकृत और सत्यापित"
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {tl(
                        language,
                        "إصدار ختم التحقق الرقمي",
                        "Issue verified badge",
                        "सत्यापित बैज जारी करें"
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("rejected")}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-start transition-all ${
                    status === "rejected"
                      ? "border-rose-500 bg-rose-500/10 text-rose-300 shadow-md shadow-rose-950/40"
                      : "border-border bg-background/40 text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {tl(
                        language,
                        "رفض / عدم المطابقة",
                        "Reject / Mismatch",
                        "अस्वीकृत / बेमेल"
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {tl(
                        language,
                        "السجل لا يطابق قواعد البيانات",
                        "Record mismatch",
                        "रिकॉर्ड मेल नहीं खाता"
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {tl(
                  language,
                  "ملاحظات عمادة القبول والتسجيل (اختياري)",
                  "Official Academic Notes (Optional)",
                  "आधिकारिक शैक्षणिक नोट्स (वैकल्पिक)"
                )}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={tl(
                  language,
                  "مثال: تم التحقق من صحة الوثيقة وتطابق السجل الأكاديمي بالكامل...",
                  "e.g. Verified against official university registry...",
                  "उदा. आधिकारिक विश्वविद्यालय रजिस्ट्री से सत्यापित..."
                )}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/80 transition-colors"
              >
                {tl(language, "إلغاء", "Cancel", "रद्द करें")}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {tl(
                    language,
                    "حفظ واعتماد القرار",
                    "Confirm Decision",
                    "निर्णय की पुष्टि करें"
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}
