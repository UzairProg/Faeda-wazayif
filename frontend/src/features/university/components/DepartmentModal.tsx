import React, { useState, useEffect } from "react"
import { X, Loader2, Layers } from "lucide-react"
import type { UniversityDepartmentItem, CreateDepartmentPayload } from "../types/university.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department: UniversityDepartmentItem | null
  onSubmit: (payload: CreateDepartmentPayload) => Promise<void>
  isLoading?: boolean
  isRtl?: boolean
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
  onSubmit,
  isLoading = false,
  isRtl = true,
}) => {
  if (!isOpen) return null

  const isEdit = Boolean(department)

  const [nameAr, setNameAr] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [faculty, setFaculty] = useState("")
  const [degreeLevels, setDegreeLevels] = useState("بكالوريوس, ماجستير")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (department) {
      setNameAr(department.name_ar || "")
      setNameEn(department.name_en || "")
      setFaculty(department.faculty || "")
      setDegreeLevels(department.degree_levels || "بكالوريوس, ماجستير")
      setDescription(department.description || "")
    } else {
      setNameAr("")
      setNameEn("")
      setFaculty("")
      setDegreeLevels("بكالوريوس, ماجستير")
      setDescription("")
    }
  }, [department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameAr.trim()) return

    await onSubmit({
      name_ar: nameAr.trim(),
      name_en: nameEn.trim() || undefined,
      faculty: faculty.trim() || undefined,
      degree_levels: degreeLevels.trim(),
      description: description.trim() || undefined,
    })
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
        {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEdit
                  ? isRtl
                    ? "تعديل بيانات القسم الأكاديمي"
                    : "Edit Academic Department"
                  : isRtl
                  ? "إضافة قسم أكاديمي جديد"
                  : "Add Academic Department"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? "إدارة التخصصات والبرامج العلمية للجامعة" : "Manage university faculties and degrees"}
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "اسم القسم بالعربية *" : "Department Name (Arabic) *"}
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder={isRtl ? "مثال: علوم الحاسب والذكاء الاصطناعي" : "e.g. Computer Science"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "اسم القسم بالإنجليزية (اختياري)" : "Department Name (English)"}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Computer Science & AI"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "الكلية التابع لها" : "Faculty / College"}
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder={isRtl ? "كلية علوم الحاسب والمعلومات" : "College of Computer Science"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "الدرجات العلمية المتاحة" : "Degree Levels"}
              </label>
              <input
                type="text"
                value={degreeLevels}
                onChange={(e) => setDegreeLevels(e.target.value)}
                placeholder="بكالوريوس, ماجستير, دكتوراه"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "نبذة عن أهداف القسم ومجالاته" : "Department Description"}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? "وصف مخرجات التعلم والمجالات التخصصية..." : "Describe department outcomes..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
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
              disabled={isLoading || !nameAr.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-950/40 transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? (isRtl ? "حفظ التعديلات" : "Save Changes") : (isRtl ? "إضافة القسم" : "Add Department")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
