import React, { useState, useEffect } from "react"
import { X, Loader2, Layers } from "lucide-react"
import type { UniversityDepartmentItem, CreateDepartmentPayload } from "../types/university.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department: UniversityDepartmentItem | null
  onSubmit: (payload: CreateDepartmentPayload) => Promise<void>
  isLoading?: boolean
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
  onSubmit,
  isLoading = false,
}) => {
  const { isRTL, language } = useTranslation()
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
      setDegreeLevels(
        language === "hi"
          ? "बैचलर, मास्टर"
          : language === "en"
          ? "Bachelor, Master"
          : "بكالوريوس, ماجستير"
      )
      setDescription("")
    }
  }, [department, language])

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
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in"
        dir={isRTL ? "rtl" : "ltr"}
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
              <div className="p-2 rounded-xl bg-primary/15 text-secondary border border-primary/25">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {isEdit
                    ? tl(
                        language,
                        "تعديل بيانات القسم الأكاديمي",
                        "Edit Academic Department",
                        "शैक्षणिक विभाग संपादित करें"
                      )
                    : tl(
                        language,
                        "إضافة قسم أكاديمي جديد",
                        "Add Academic Department",
                        "नया शैक्षणिक विभाग जोड़ें"
                      )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {tl(
                    language,
                    "إدارة التخصصات والبرامج العلمية للجامعة",
                    "Manage university faculties and degrees",
                    "विश्वविद्यालय के संकायों और डिग्रियों का प्रबंधन करें"
                  )}
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
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {tl(
                  language,
                  "اسم القسم بالعربية *",
                  "Department Name (Arabic) *",
                  "विभाग का नाम (अरबी) *"
                )}
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={tl(
                  language,
                  "مثال: علوم الحاسب والذكاء الاصطناعي",
                  "e.g. Computer Science & AI",
                  "उदा. कंप्यूटर विज्ञान और एआई"
                )}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {tl(
                  language,
                  "اسم القسم بالإنجليزية (اختياري)",
                  "Department Name (English) (Optional)",
                  "विभाग का नाम (अंग्रेजी) (वैकल्पिक)"
                )}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Computer Science & AI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  {tl(
                    language,
                    "الكلية التابع لها",
                    "Faculty / College",
                    "संबंधित कॉलेज / संकाय"
                  )}
                </label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder={tl(
                    language,
                    "كلية علوم الحاسب والمعلومات",
                    "College of Computer Science",
                    "कंप्यूटर विज्ञान और सूचना कॉलेज"
                  )}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  {tl(
                    language,
                    "الدرجات العلمية المتاحة",
                    "Degree Levels",
                    "उपलब्ध डिग्री स्तर"
                  )}
                </label>
                <input
                  type="text"
                  value={degreeLevels}
                  onChange={(e) => setDegreeLevels(e.target.value)}
                  placeholder={tl(
                    language,
                    "بكالوريوس, ماجستير, دكتوراه",
                    "Bachelor, Master, PhD",
                    "बैचलर, मास्टर, पीएचडी"
                  )}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {tl(
                  language,
                  "نبذة عن أهداف القسم ومجالاته",
                  "Department Description",
                  "विभाग विवरण और उद्देश्य"
                )}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={tl(
                  language,
                  "وصف مخرجات التعلم والمجالات التخصصية...",
                  "Describe department learning outcomes and specializations...",
                  "सीखने के परिणामों और विशेषज्ञता का वर्णन करें..."
                )}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

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
                disabled={isLoading || !nameAr.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {isEdit
                    ? tl(language, "حفظ التعديلات", "Save Changes", "परिवर्तन सहेजें")
                    : tl(language, "إضافة القسم", "Add Department", "विभाग जोड़ें")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}
