import React, { useState } from "react"
import { X, Loader2, CheckCircle2 } from "lucide-react"
import type { CompanyApplicationItem } from "../types/company.types"

interface ApplicationStatusModalProps {
  isOpen: boolean
  onClose: () => void
  application: CompanyApplicationItem | null
  onSubmit: (status: string, note?: string) => Promise<void>
  isLoading?: boolean
  isRtl?: boolean
}

export const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
  isOpen,
  onClose,
  application,
  onSubmit,
  isLoading = false,
  isRtl = true,
}) => {
  if (!isOpen || !application) return null

  const [selectedStatus, setSelectedStatus] = useState<string>(application.status)
  const [note, setNote] = useState(application.note || "")

  const stages = [
    {
      id: "applied",
      title_ar: "جديد / تم التقديم",
      title_en: "New Applied",
      desc_ar: "الطلب مسجل في النظام ولم يبدأ الفرز بعد",
      desc_en: "Application received and awaiting initial review",
      cls: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    },
    {
      id: "under_review",
      title_ar: "قيد المراجعة والفرز",
      title_en: "Under Review",
      desc_ar: "فريق الموارد البشرية يراجع السيرة الذاتية والمؤهلات",
      desc_en: "Candidate profile is under HR evaluation",
      cls: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    },
    {
      id: "shortlisted",
      title_ar: "مرشح للمقابلة (Shortlisted)",
      title_en: "Shortlisted",
      desc_ar: "تم اجتياز الفرز الأولي وجاهز لجدولة المقابلة",
      desc_en: "Passed initial screening, ready for interview scheduling",
      cls: "border-teal-500/40 bg-teal-500/10 text-teal-400",
    },
    {
      id: "interview",
      title_ar: "مرحلة المقابلة والتقييم الفني",
      title_en: "Interview Stage",
      desc_ar: "المرشح حالياً في مرحلة المقابلات أو الاختبار الفني",
      desc_en: "Candidate is in interview or technical assessment",
      cls: "border-purple-500/40 bg-purple-500/10 text-purple-400",
    },
    {
      id: "accepted",
      title_ar: "القبول النهائي والتعيين",
      title_en: "Accepted / Hired",
      desc_ar: "تم تقديم العرض الوظيفي واعتماد التعيين",
      desc_en: "Job offer accepted and hired",
      cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
    {
      id: "rejected",
      title_ar: "استبعاد / غير مؤهل للشاغر",
      title_en: "Rejected",
      desc_ar: "الملف لا يتطابق مع متطلبات الوظيفة الحالية",
      desc_en: "Candidate does not match current requirements",
      cls: "border-rose-500/40 bg-rose-500/10 text-rose-400",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(selectedStatus, note)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              {isRtl ? "تحديث مرحلة التوظيف" : "Update Hiring Stage"}
            </h2>
            <p className="text-xs text-slate-400">
              {isRtl
                ? `المرشح: ${application.candidate.name} — ${application.job.title}`
                : `Candidate: ${application.candidate.name} — ${application.job.title}`}
            </p>
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
          <div className="grid gap-2 sm:grid-cols-2">
            {stages.map((st) => {
              const isSelected = selectedStatus === st.id
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`p-3 rounded-2xl border text-start transition-all ${
                    isSelected
                      ? `${st.cls} shadow-md`
                      : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {isRtl ? st.title_ar : st.title_en}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-tight">
                    {isRtl ? st.desc_ar : st.desc_en}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "ملاحظات داخلية للمسؤول (اختياري)" : "Internal Hiring Notes (Optional)"}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isRtl
                  ? "سجل سبب الترقية، نتيجة المقابلة، أو الملاحظات الفنية..."
                  : "Enter interview feedback, technical assessment notes..."
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isRtl ? "حفظ وتحديث المرحلة" : "Save & Update Stage"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
