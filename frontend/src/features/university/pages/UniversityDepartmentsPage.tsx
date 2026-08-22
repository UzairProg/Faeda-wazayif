import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityDepartments } from "../hooks/useUniversityDepartments"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { DepartmentModal } from "../components/DepartmentModal"
import type { UniversityDepartmentItem, CreateDepartmentPayload } from "../types/university.types"
import {
  Layers,
  Plus,
  Users,
  ShieldCheck,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react"

export function UniversityDepartmentsPage() {
  const { isRTL } = useTranslation()
  const { data, isLoading } = useUniversityDepartments()
  const {
    createDepartment,
    isCreatingDepartment,
    updateDepartment,
    isUpdatingDepartment,
    deleteDepartment,
    isDeletingDepartment,
  } = useUniversityActions()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<UniversityDepartmentItem | null>(null)

  const handleOpenCreate = () => {
    setEditingDepartment(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (dept: UniversityDepartmentItem) => {
    setEditingDepartment(dept)
    setModalOpen(true)
  }

  const handleDepartmentSubmit = async (payload: CreateDepartmentPayload) => {
    if (editingDepartment) {
      await updateDepartment({ id: editingDepartment.id, payload })
    } else {
      await createDepartment(payload)
    }
    setModalOpen(false)
    setEditingDepartment(null)
  }

  const handleDeleteConfirm = async (id: number) => {
    if (confirm(isRTL ? "هل أنت متأكد من حذف هذا القسم الأكاديمي؟" : "Are you sure you want to delete this department?")) {
      await deleteDepartment(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
            {isRTL ? "الأقسام والبرامج الأكاديمية" : "Academic Departments & Programs"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRTL
              ? "إدارة البرامج الدراسية، الكليات، وتتبع الخريجين والتوثيقات لكل تخصص."
              : "Manage university faculties, degrees, and track students and verifications per major."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? "إضافة قسم جديد" : "Add Department"}</span>
        </button>
      </div>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      ) : data?.departments && data.departments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.departments.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl transition-all hover:border-slate-700"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Layers className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isRTL ? "تعديل" : "Edit"}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteConfirm(dept.id)}
                      disabled={isDeletingDepartment}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={isRTL ? "حذف" : "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{dept.name_ar}</h3>
                  {dept.name_en && (
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{dept.name_en}</p>
                  )}
                  {dept.faculty && (
                    <p className="text-xs text-sky-400/80 font-medium mt-1">{dept.faculty}</p>
                  )}
                </div>

                {dept.description && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                )}

                {dept.degree_levels && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {dept.degree_levels.split(",").map((lvl, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {lvl.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Metrics Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">
                    {dept.candidates_count} {isRTL ? "طلاب / خريجين" : "Students"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {dept.verified_count} {isRTL ? "موثق" : "Verified"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/80 p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">
            {isRTL ? "لم تتم إضافة أقسام أكاديمية بعد" : "No departments added yet"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "أضف الكليات والتخصصات المعتمدة لتنظيم وتسهيل توثيق خريجي الجامعة."
              : "Add accredited departments and degrees to streamline candidate verification."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRTL ? "إضافة قسم جديد" : "Add Department"}</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        department={editingDepartment}
        onSubmit={handleDepartmentSubmit}
        isLoading={isCreatingDepartment || isUpdatingDepartment}
        isRtl={isRTL}
      />
    </div>
  )
}
