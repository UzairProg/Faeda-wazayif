/**
 * VisibilitySection.tsx — Privacy & Discovery Controls Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type {
  CandidateProfile,
  UpdateVisibilityDTO,
  VisibilityLevel,
} from "../types/candidate.types"
import { Shield, Globe2, Building2, Lock, CheckCircle2, Loader2 } from "lucide-react"

interface VisibilitySectionProps {
  profile: CandidateProfile
  onUpdateVisibility: (dto: UpdateVisibilityDTO) => Promise<any>
}

export function VisibilitySection({
  profile,
  onUpdateVisibility,
}: VisibilitySectionProps) {
  const { t } = useTranslation()
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityLevel>(
    profile.visibility || "employers_only"
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSelect = async (level: VisibilityLevel) => {
    setSelectedVisibility(level)
    setIsUpdating(true)
    setSuccess(false)
    try {
      await onUpdateVisibility({ visibility: level })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const options: {
    level: VisibilityLevel
    title: string
    desc: string
    icon: any
    badgeText?: string
  }[] = [
    {
      level: "employers_only",
      title: t("candidate.profile.visibility.employersTitle"),
      desc: t("candidate.profile.visibility.employersDesc"),
      icon: Building2,
      badgeText: "موصى به",
    },
    {
      level: "public",
      title: t("candidate.profile.visibility.publicTitle"),
      desc: t("candidate.profile.visibility.publicDesc"),
      icon: Globe2,
    },
    {
      level: "private",
      title: t("candidate.profile.visibility.privateTitle"),
      desc: t("candidate.profile.visibility.privateDesc"),
      icon: Lock,
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.visibility.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.visibility.desc")}
            </p>
          </div>
        </div>

        {isUpdating && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        {success && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("candidate.profile.visibility.saved")}
          </span>
        )}
      </div>

      {/* Options Cards */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon
          const isSelected = selectedVisibility === opt.level

          return (
            <div
              key={opt.level}
              onClick={() => !isUpdating && handleSelect(opt.level)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {opt.badgeText && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {opt.badgeText}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {opt.desc}
                </p>
              </div>

              {/* Selection status indicator */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-700 bg-slate-800"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {isSelected ? "الحالة الحالية" : "تحديد هذا المستوى"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
