import React, { useState } from "react"
import { X, Users, Sparkles, Loader2, Check } from "lucide-react"
import { useCandidateTeamActions } from "../../hooks/useCandidateTeamActions"
import type { CreateTeamPayload } from "../../types/candidate.types"

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (teamId: number) => void
  isRtl?: boolean
}

const PRESET_TEMPLATES = [
  {
    titleAr: "فريق منتجات رقمية (Full-Stack & Product)",
    name: "فريق المنتجات الرقمية المتكاملة",
    specialization: "تطوير المنتجات الرقمية (Full-Stack Product)",
    generalProgram: "هندسة البرمجيات",
    description: "فريق تقني متكامل يجمع بين تطوير الواجهات الحديثة والأنظمة الخلفية وقواعد البيانات لبناء وتوسيع المنتجات الرقمية.",
  },
  {
    titleAr: "مختبر الذكاء الاصطناعي (AI & Data Science)",
    name: "مختبر حلول الذكاء الاصطناعي والبيانات",
    specialization: "هندسة الذكاء الاصطناعي وعلوم البيانات (AI & ML)",
    generalProgram: "الذكاء الاصطناعي",
    description: "فريق متخصص في تطوير نماذج الذكاء الاصطناعي التوليدي، معالجة اللغات الطبيعية، وهندسة البيانات وحلول الأتمتة الذكية.",
  },
  {
    titleAr: "استوديو تصميم تجربة المستخدم (UI/UX & Product Design)",
    name: "استوديو تصميم التجربة الرقمية",
    specialization: "تصميم واجهات وتجربة المستخدم (UI/UX Design)",
    generalProgram: "التصميم الرقمي",
    description: "فريق يركز على أبحاث المستخدم وتصميم النماذج التفاعلية وأنظمة التصميم لتقديم تجارب رقمية استثنائية وسلسة.",
  },
  {
    titleAr: "فريق تطبيقات الجوال (Mobile Apps Squad)",
    name: "فريق هندسة تطبيقات الجوال الذكية",
    specialization: "تطوير تطبيقات الهواتف الذكية (iOS & Android)",
    generalProgram: "تطبيقات الجوال",
    description: "فريق متخصص في بناء تطبيقات الجوال عالية الأداء باستخدام Flutter و React Native و Native Swift/Kotlin.",
  },
]

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isRtl = true,
}) => {
  const { createTeamMutation } = useCandidateTeamActions()

  const [formData, setFormData] = useState<CreateTeamPayload>({
    name: "",
    description: "",
    specialization: "هندسة البرمجيات وتطوير الحلول الرقمية",
    generalProgram: "تقنية المعلومات",
    semiSpecialProgram: "",
    achievements: "",
  })

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleApplyPreset = (preset: (typeof PRESET_TEMPLATES)[0]) => {
    setFormData({
      ...formData,
      name: preset.name,
      specialization: preset.specialization,
      generalProgram: preset.generalProgram,
      description: preset.description,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg(isRtl ? "يرجى إدخال اسم صحيح للفريق (حرفين على الأقل)" : "Please enter a valid team name (at least 2 characters)")
      return
    }

    try {
      const res = await createTeamMutation.mutateAsync(formData)
      if (res.success) {
        onSuccess?.(res.teamId)
        onClose()
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (isRtl ? "تعذر إنشاء الفريق. يرجى المحاولة مرة أخرى." : "Failed to create team.")
      setErrorMsg(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRtl ? "تأسيس فريق مهني جديد" : "Create a Professional Team"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? "قم بتشكيل فريق بقدرات متكاملة للمنافسة على الفرص والمشاريع الكبرى"
                  : "Form a team with complementary capabilities for major opportunities"}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Quick Presets */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-slate-300">
              {isRtl ? "قوالب سريعة مقترحة (اختر للبدء السريع):" : "Recommended Team Templates:"}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              {PRESET_TEMPLATES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/40 p-2.5 text-right text-xs transition-all hover:border-emerald-500/40 hover:bg-slate-800/90"
                >
                  <span className="font-semibold text-slate-200">{p.titleAr}</span>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "اسم الفريق *" : "Team Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isRtl ? "مثال: فريق الحلول الرقمية المتقدمة" : "e.g. Digital Solutions Squad"}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* General Program & Specialization */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  {isRtl ? "المجال العام" : "General Track"}
                </label>
                <input
                  type="text"
                  value={formData.generalProgram || ""}
                  onChange={(e) => setFormData({ ...formData, generalProgram: e.target.value })}
                  placeholder={isRtl ? "تقنية المعلومات، تصميم، ذكاء اصطناعي" : "IT, Design, AI"}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  {isRtl ? "التخصص الدقيق للفريق" : "Team Specialization"}
                </label>
                <input
                  type="text"
                  value={formData.specialization || ""}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder={isRtl ? "تطوير Full-Stack، تصميم تجربة المستخدم" : "Full-Stack, UI/UX"}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "نبذة عن الفريق ورؤيته" : "About & Team Vision"}
              </label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={
                  isRtl
                    ? "اشرح أهداف الفريق، القيمة المضافة التي تقدمونها، ونوع المشاريع التي تستهدفونها..."
                    : "Describe team vision, value proposition, and target projects..."
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                {isRtl ? "أبرز الإنجازات أو المشاريع السابقة (اختياري)" : "Key Achievements (Optional)"}
              </label>
              <input
                type="text"
                value={formData.achievements || ""}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                placeholder={isRtl ? "بناء 5 أنظمة سحابية، إطلاق 3 تطبيقات ناجحة..." : "Built 5 SaaS systems..."}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              disabled={createTeamMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
            >
              {createTeamMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span>{isRtl ? "إنشاء وتأسيس الفريق" : "Create Team"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
