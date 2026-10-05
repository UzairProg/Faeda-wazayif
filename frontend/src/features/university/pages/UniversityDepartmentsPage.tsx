import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityDepartments } from "../hooks/useUniversityDepartments"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { DepartmentModal } from "../components/DepartmentModal"
import type { UniversityDepartmentItem, CreateDepartmentPayload } from "../types/university.types"
import { tl, getLocalizedDepartments } from "../utils/universityLocalization"
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
  const { language, isRTL } = useTranslation()
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
    const confirmMsg = tl(
      language,
      "هل أنت متأكد من حذف هذا القسم الأكاديمي؟",
      "Are you sure you want to delete this department?",
      "क्या आप वाकई इस शैक्षणिक विभाग को हटाना चाहते हैं?"
    )
    if (confirm(confirmMsg)) {
      await deleteDepartment(id)
    }
  }

  const rawDepartments = data?.departments || []
  const departments = getLocalizedDepartments(rawDepartments, language)

  // KPI computations
  const totalDepts = departments.length
  const totalStudents = departments.reduce((sum, d) => sum + (d.candidates_count || 0), 0)
  const totalVerified = departments.reduce((sum, d) => sum + (d.verified_count || 0), 0)
  const totalPrograms = departments.reduce((sum, d) => sum + (d.degree_levels ? d.degree_levels.split(",").length : 0), 0)

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/15 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Layers className="w-3.5 h-3.5" />
                <span>{tl(language, "البنية الأكاديمية والتخصصات", "Academic Structure & Majors", "शैक्षणिक संरचना और विशेषज्ञता")}</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight font-heading">
              {tl(language, "الأقسام والبرامج الأكاديمية", "Academic Departments & Programs", "शैक्षणिक विभाग और कार्यक्रम")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
              {tl(language, "إدارة البرامج الدراسية، الكليات، وتتبع الخريجين والتوثيقات لكل تخصص.", "Manage university faculties, degrees, and track students and verifications per major.", "विश्वविद्यालय के संकायों, डिग्री का प्रबंधन करें।")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{tl(language, "إضافة قسم جديد", "Add Department", "नया विभाग जोड़ें")}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-2xl border border-border bg-card/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>{tl(language, "إجمالي الأقسام", "Total Departments", "कुल विभाग")}</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-white">{totalDepts}</div>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>{tl(language, "إجمالي الطلاب", "Total Students", "कुल छात्र")}</span>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-black text-white">{totalStudents}</div>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
            <span>{tl(language, "موثق أكاديمياً", "Verified", "सत्यापित")}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalVerified}</div>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>{tl(language, "البرامج الدراسية", "Degree Programs", "डिग्री प्रोग्राम")}</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalPrograms}</div>
        </div>
      </div>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : departments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card/85 p-5 backdrop-blur-xl shadow-xl transition-all hover:border-primary/40"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-secondary border border-primary/20">
                    <Layers className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-card transition-colors"
                      title={tl(language, "تعديل", "Edit", "संपादित करें")}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteConfirm(dept.id)}
                      disabled={isDeletingDepartment}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={tl(language, "حذف", "Delete", "हटाएं")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{dept.name_ar}</h3>
                  {dept.name_en && (
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{dept.name_en}</p>
                  )}
                  {dept.faculty && (
                    <p className="text-xs text-secondary font-medium mt-1">{dept.faculty}</p>
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
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-secondary border border-primary/20"
                      >
                        {lvl.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Metrics Footer */}
              <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="truncate">
                    {dept.candidates_count}{" "}
                    {tl(language, "طلاب / خريجين", "Students", "छात्र / पूर्व छात्र")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {dept.verified_count}{" "}
                    {tl(language, "موثق", "Verified", "सत्यापित")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/85 p-12 text-center backdrop-blur-xl shadow-xl">
          <Layers className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-bold text-white">
            {tl(
              language,
              "لم تتم إضافة أقسام أكاديمية بعد",
              "No departments added yet",
              "अभी तक कोई शैक्षणिक विभाग नहीं जोड़ा गया"
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {tl(
              language,
              "أضف الكليات والتخصصات المعتمدة لتنظيم وتسهيل توثيق خريجي الجامعة.",
              "Add accredited departments and degrees to streamline candidate verification.",
              "उम्मीदवार सत्यापन को सुव्यवस्थित करने के लिए मान्यता प्राप्त विभाग और डिग्री जोड़ें।"
            )}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{tl(language, "إضافة قسم جديد", "Add Department", "नया विभाग जोड़ें")}</span>
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
      />
    </div>
  )
}
