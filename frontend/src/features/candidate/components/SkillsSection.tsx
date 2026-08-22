/**
 * SkillsSection.tsx — Structured Skills Management Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile, UpdateSkillsDTO } from "../types/candidate.types"
import { Cpu, Plus, X, Tag, Sparkles, Loader2 } from "lucide-react"

interface SkillsSectionProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdateSkillsDTO) => Promise<any>
}

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Node.js",
  "Next.js",
  "FastAPI",
  "Flask",
  "SQL / PostgreSQL",
  "Docker",
  "Figma / UI-UX",
  "Git & GitHub",
  "Tailwind CSS",
  "REST APIs",
  "AI / LLMs",
]

export function SkillsSection({ profile, onUpdate }: SkillsSectionProps) {
  const { t } = useTranslation()
  const [newSkill, setNewSkill] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSkills = profile.skills || []

  const handleAddSkill = async (skillName: string) => {
    const trimmed = skillName.trim()
    if (!trimmed) return
    if (currentSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill("")
      return
    }

    const updated = [...currentSkills, trimmed]
    setIsUpdating(true)
    setError(null)
    try {
      await onUpdate({ skills: updated })
      setNewSkill("")
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل إضافة المهارة")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updated = currentSkills.filter(
      (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
    )
    setIsUpdating(true)
    setError(null)
    try {
      await onUpdate({ skills: updated })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حذف المهارة")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill(newSkill)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {t("candidate.profile.skills.title")}
              </h2>
              {currentSkills.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  {currentSkills.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.skills.desc")}
            </p>
          </div>
        </div>

        {isUpdating && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Input box */}
      <div className="pt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Tag className="w-4 h-4 text-slate-500 absolute top-3.5 start-3.5" />
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            placeholder={t("candidate.profile.skills.addPlaceholder")}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAddSkill(newSkill)}
          disabled={!newSkill.trim() || isUpdating}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t("candidate.profile.skills.addBtn")}</span>
        </button>
      </div>

      {/* Active Skills Tag Cloud */}
      <div className="pt-4">
        {currentSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={isUpdating}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-rose-500/10 transition-colors"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-2">
              {t("candidate.profile.skills.empty")}
            </p>
          </div>
        )}
      </div>

      {/* Quick Suggested Skills Pills */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{t("candidate.profile.skills.suggested")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.filter(
            (p) => !currentSkills.some((s) => s.toLowerCase() === p.toLowerCase())
          )
            .slice(0, 10)
            .map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => handleAddSkill(suggested)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-primary/20 border border-slate-800 hover:border-primary/40 text-[11px] text-slate-300 hover:text-primary transition-all font-medium"
              >
                <Plus className="w-3 h-3 text-slate-500" />
                <span>{suggested}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
