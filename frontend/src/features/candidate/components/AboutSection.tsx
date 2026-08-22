/**
 * AboutSection.tsx — Professional Summary / About Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile, UpdateAboutDTO } from "../types/candidate.types"
import { AlignLeft, Edit2, Check, X, Loader2 } from "lucide-react"

interface AboutSectionProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdateAboutDTO) => Promise<any>
}

export function AboutSection({ profile, onUpdate }: AboutSectionProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [aboutText, setAboutText] = useState(profile.about || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await onUpdate({ about: aboutText.trim() })
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ النبذة")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setAboutText(profile.about || "")
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <AlignLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.about.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.about.desc")}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setAboutText(profile.about || "")
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
            <span>{profile.about ? t("candidate.profile.actions.edit") : t("candidate.profile.about.edit")}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="pt-4">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder={t("candidate.profile.about.placeholder")}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t("candidate.profile.actions.cancel")}</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.about.save")}</span>
              </button>
            </div>
          </div>
        ) : profile.about ? (
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
            {profile.about}
          </p>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.about.empty")}
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.about.edit")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
