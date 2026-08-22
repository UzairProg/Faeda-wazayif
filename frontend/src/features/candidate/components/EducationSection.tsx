/**
 * EducationSection.tsx — Education & Academic Qualifications Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile, UpdateEducationDTO } from "../types/candidate.types"
import { GraduationCap, Building, BookOpen, Calendar, Award, Edit2, X, Loader2 } from "lucide-react"

interface EducationSectionProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdateEducationDTO) => Promise<any>
}

const QUALIFICATION_OPTIONS = [
  "ثانوية عامة",
  "دبلوم",
  "بكالوريوس",
  "ماجستير",
  "دكتوراه",
  "شهادة مهنية متقدمة",
]

const STATUS_OPTIONS = [
  "خريج",
  "طالب حالي",
  "على وشك التخرج",
]

export function EducationSection({ profile, onUpdate }: EducationSectionProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [qualification, setQualification] = useState(profile.educational_qualification || "")
  const [university, setUniversity] = useState(profile.university || "")
  const [department, setDepartment] = useState(profile.department_university || "")
  const [graduationDate, setGraduationDate] = useState(
    profile.graduation_date ? profile.graduation_date.slice(0, 10) : ""
  )
  const [gpa, setGpa] = useState(profile.gpa || "")
  const [educationStatue, setEducationStatue] = useState(profile.education_statue || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      await onUpdate({
        educational_qualification: qualification,
        university,
        department_university: department,
        graduation_date: graduationDate || undefined,
        gpa,
        education_statue: educationStatue,
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ التعليم")
    } finally {
      setIsSaving(false)
    }
  }

  const hasEducation = Boolean(
    profile.educational_qualification || profile.university || profile.department_university
  )

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.education.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.education.desc")}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setQualification(profile.educational_qualification || "")
              setUniversity(profile.university || "")
              setDepartment(profile.department_university || "")
              setGraduationDate(profile.graduation_date ? profile.graduation_date.slice(0, 10) : "")
              setGpa(profile.gpa || "")
              setEducationStatue(profile.education_statue || "")
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
            <span>{hasEducation ? t("candidate.profile.actions.edit") : t("candidate.profile.education.edit")}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="pt-4">
        {hasEducation ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Qualification & Major */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1 sm:col-span-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <BookOpen className="w-4 h-4" />
                <span>{profile.educational_qualification || "المؤهل الدراسي"}</span>
                {profile.education_statue && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {profile.education_statue}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {profile.department_university || "التخصص غير محدد"}
              </h3>
              {profile.university && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{profile.university}</span>
                </div>
              )}
            </div>

            {/* GPA & Graduation Date Capsule */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3">
              {profile.gpa && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {t("candidate.profile.education.gpaLabel")}
                  </span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {profile.gpa}
                  </span>
                </div>
              )}

              {profile.graduation_date && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {t("candidate.profile.education.gradDateLabel")}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {profile.graduation_date.slice(0, 10)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.education.empty")}
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.education.edit")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Education Modal Dialog */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {t("candidate.profile.education.edit")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.education.degreeLabel")}
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">اختر المؤهل الدراسي</option>
                    {QUALIFICATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.education.statusLabel")}
                  </label>
                  <select
                    value={educationStatue}
                    onChange={(e) => setEducationStatue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">اختر الحالة</option>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.education.uniLabel")}
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="مثال: جامعة الملك سعود، جامعة الملك فهد..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.education.majorLabel")}
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="مثال: علوم الحاسب، هندسة البرمجيات، إدارة الأعمال..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.education.gradDateLabel")}
                  </label>
                  <input
                    type="date"
                    value={graduationDate}
                    onChange={(e) => setGraduationDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.education.gpaLabel")}
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="مثال: 4.85 / 5 أو 3.8 / 4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  {t("candidate.profile.actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.education.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
