import React, { useState } from "react"
import { X, Settings, Loader2, Check } from "lucide-react"
import { useCandidateTeamActions } from "../../hooks/useCandidateTeamActions"
import type { CandidateTeamDetail, UpdateTeamPayload } from "../../types/candidate.types"

interface EditTeamModalProps {
  isOpen: boolean
  team: CandidateTeamDetail
  onClose: () => void
  onSuccess?: () => void
  isRtl?: boolean
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  team,
  onClose,
  onSuccess,
  isRtl = true,
}) => {
  const { updateTeamMutation } = useCandidateTeamActions(team.id)

  const [formData, setFormData] = useState<UpdateTeamPayload>({
    name: team.name,
    description: team.about,
    specialization: team.specialization,
    generalProgram: team.generalProgram || "",
    semiSpecialProgram: team.semiSpecialProgram || "",
    achievements: team.achievements || "",
  })

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!formData.name?.trim() || formData.name.trim().length < 2) {
      setErrorMsg(isRtl ? "يرجى كتابة اسم الفريق بشكل صحيح" : "Please enter a valid team name")
      return
    }

    try {
      const res = await updateTeamMutation.mutateAsync({ id: team.id, payload: formData })
      if (res.success) {
        onSuccess?.()
        onClose()
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (isRtl ? "تعذر حفظ التعديلات" : "Failed to update team")
      setErrorMsg(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRtl ? "تعديل بيانات الفريق" : "Edit Team Information"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? "تحديث هوية الفريق والمسارات والتخصصات" : "Update team identity and tracks"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "اسم الفريق *" : "Team Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  {isRtl ? "المجال العام" : "General Track"}
                </label>
                <input
                  type="text"
                  value={formData.generalProgram || ""}
                  onChange={(e) => setFormData({ ...formData, generalProgram: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  {isRtl ? "التخصص الدقيق" : "Specialization"}
                </label>
                <input
                  type="text"
                  value={formData.specialization || ""}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "نبذة عن الفريق" : "About Team"}
              </label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "الإنجازات" : "Achievements"}
              </label>
              <input
                type="text"
                value={formData.achievements || ""}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-700/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={updateTeamMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
            >
              {updateTeamMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span>{isRtl ? "حفظ التعديلات" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
