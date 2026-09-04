/**
 * WorkPreferencesSection.tsx — Work & Job Preferences Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile, UpdatePreferencesDTO } from "../types/candidate.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { Compass, Briefcase, Home, Banknote, Edit2, X, Loader2 } from "lucide-react"

interface WorkPreferencesSectionProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdatePreferencesDTO) => Promise<any>
}

const WORK_TYPES = [
  "دوام كامل",
  "دوام جزئي",
  "عن بعد",
  "هجين (مكتبي وعن بعد)",
  "عقد / عمل حر",
]

const WORK_STYLES = [
  "مرن",
  "مكتبي فقط",
  "عن بعد بالكامل",
]

export function WorkPreferencesSection({
  profile,
  onUpdate,
}: WorkPreferencesSectionProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [field, setField] = useState(profile.preferred_field_of_work || "")
  const [workType, setWorkType] = useState(profile.work_type || "")
  const [workStyle, setWorkStyle] = useState(profile.work_style || "")
  const [expectedSalary, setExpectedSalary] = useState<number | "">(
    profile.expected_salary || ""
  )
  const [targetCity, setTargetCity] = useState(profile.government || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      await onUpdate({
        preferred_field_of_work: field,
        work_type: workType,
        work_style: workStyle,
        expected_salary: expectedSalary ? Number(expectedSalary) : null,
        government: targetCity,
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ التفضيلات")
    } finally {
      setIsSaving(false)
    }
  }

  const hasPreferences = Boolean(
    profile.preferred_field_of_work ||
      profile.work_type ||
      profile.work_style ||
      profile.expected_salary
  )

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.preferences.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.preferences.desc")}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setField(profile.preferred_field_of_work || "")
              setWorkType(profile.work_type || "")
              setWorkStyle(profile.work_style || "")
              setExpectedSalary(profile.expected_salary || "")
              setTargetCity(profile.government || "")
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
            <span>{hasPreferences ? t("candidate.profile.actions.edit") : t("candidate.profile.preferences.edit")}</span>
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
        {hasPreferences ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Field of work */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                {t("candidate.profile.preferences.targetField")}
              </span>
              <span className="text-sm font-bold text-white">
                {profile.preferred_field_of_work || "غير محدد"}
              </span>
            </div>

            {/* Job Type */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-sky-400" />
                {t("candidate.profile.preferences.workType")}
              </span>
              <span className="text-sm font-bold text-white">
                {profile.work_type || "غير محدد"}
              </span>
            </div>

            {/* Work Style */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {t("candidate.profile.preferences.workStyle")}
              </span>
              <span className="text-sm font-bold text-white">
                {profile.work_style || "غير محدد"}
              </span>
            </div>

            {/* Expected Salary */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                {t("candidate.profile.preferences.expectedSalary")}
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {profile.expected_salary
                  ? `${profile.expected_salary.toLocaleString()} ر.س`
                  : "قابل للتفاوض"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.preferences.empty")}
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.preferences.edit")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsEditing(false)}
          >
            <div
              className="w-full max-w-lg bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {t("candidate.profile.preferences.edit")}
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
                  {t("candidate.profile.preferences.targetField")}
                </label>
                <input
                  type="text"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="مثال: هندسة البرمجيات، تصميم واجهات المستخدم، التسويق الرقمي..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.preferences.workType")}
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">اختر نوع الدوام</option>
                    {WORK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.preferences.workStyle")}
                  </label>
                  <select
                    value={workStyle}
                    onChange={(e) => setWorkStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">اختر أسلوب العمل</option>
                    {WORK_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.preferences.expectedSalary")}
                  </label>
                  <input
                    type="number"
                    value={expectedSalary}
                    onChange={(e) =>
                      setExpectedSalary(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="مثال: 15000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.preferences.targetLocation")}
                  </label>
                  <input
                    type="text"
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    placeholder="الرياض، جدة، الشرقية..."
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
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.preferences.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  )
}
