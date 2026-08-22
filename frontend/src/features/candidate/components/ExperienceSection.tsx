/**
 * ExperienceSection.tsx — Career Experience & Specialization Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile, UpdateExperienceDTO } from "../types/candidate.types"
import { Briefcase, Clock, Layers, Edit2, X, Loader2 } from "lucide-react"

interface ExperienceSectionProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdateExperienceDTO) => Promise<any>
}

const EXPERIENCE_YEARS_OPTIONS = [
  "أقل من سنة (حديث التخرج)",
  "سنة واحدة",
  "سنتان",
  "3 سنوات",
  "4 سنوات",
  "5 سنوات",
  "6 سنوات",
  "7-10 سنوات (خبير)",
  "أكثر من 10 سنوات (استشاري / قيادي)",
]

export function ExperienceSection({ profile, onUpdate }: ExperienceSectionProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [yearsOfSkills, setYearsOfSkills] = useState(profile.years_of_skills || "")
  const [fieldOfWork, setFieldOfWork] = useState(profile.preferred_field_of_work || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    try {
      await onUpdate({
        years_of_skills: yearsOfSkills,
        preferred_field_of_work: fieldOfWork,
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ الخبرة")
    } finally {
      setIsSaving(false)
    }
  }

  const hasExperienceData = Boolean(
    profile.years_of_skills || profile.preferred_field_of_work
  )

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.experience.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.experience.desc")}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setYearsOfSkills(profile.years_of_skills || "")
              setFieldOfWork(profile.preferred_field_of_work || "")
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
            <span>{hasExperienceData ? t("candidate.profile.actions.edit") : t("candidate.profile.experience.edit")}</span>
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
        {hasExperienceData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Years of skills card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">
                  {t("candidate.profile.experience.yearsLabel")}
                </span>
                <span className="text-sm font-bold text-white">
                  {profile.years_of_skills || "غير محدد"}
                </span>
              </div>
            </div>

            {/* Field of work card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">
                  {t("candidate.profile.experience.fieldLabel")}
                </span>
                <span className="text-sm font-bold text-white">
                  {profile.preferred_field_of_work || "غير محدد"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.experience.empty")}
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.experience.edit")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Experience Modal Dialog */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {t("candidate.profile.experience.edit")}
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.experience.yearsLabel")}
                </label>
                <select
                  value={yearsOfSkills}
                  onChange={(e) => setYearsOfSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">اختر سنوات الخبرة</option>
                  {EXPERIENCE_YEARS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.experience.fieldLabel")}
                </label>
                <input
                  type="text"
                  value={fieldOfWork}
                  onChange={(e) => setFieldOfWork(e.target.value)}
                  placeholder="مثال: تطوير البرمجيات والويب، إدارة المشاريع..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
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
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.experience.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
