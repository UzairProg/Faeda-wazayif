/**
 * features/auth/components/RoleSelector.tsx
 *
 * Role selector component for registration.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { User, Building2, GraduationCap, CheckCircle2, Clock } from "lucide-react"
import { useTranslation } from "@/i18n"
import type { RegisterRole } from "../types/auth.types"

interface RoleSelectorProps {
  selectedRole: RegisterRole | null
  onSelectRole: (role: RegisterRole) => void
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 w-full" role="radiogroup" aria-label={t("auth.register.step1Title")}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Candidate / Professional */}
        <div
          role="radio"
          aria-checked={selectedRole === "candidate"}
          tabIndex={0}
          onClick={() => onSelectRole("candidate")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectRole("candidate")
            }
          }}
          className={`relative overflow-hidden p-5 rounded-2xl border text-start transition-all duration-300 flex flex-col gap-3 cursor-pointer group outline-none ${
            selectedRole === "candidate"
              ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(18,75,201,0.25)] scale-[1.02]"
              : "bg-card/40 border-white/10 hover:border-primary/40 hover:bg-white/5 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                selectedRole === "candidate" ? "bg-primary text-white shadow-md" : "bg-white/5 text-muted-foreground group-hover:text-white"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            {selectedRole === "candidate" && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </div>
          <div>
            <h3 className={`font-bold text-sm mb-1 font-heading ${selectedRole === "candidate" ? "text-primary" : "text-white"}`}>
              {t("auth.roles.candidate.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("auth.roles.candidate.description")}
            </p>
          </div>
        </div>

        {/* Company / Employer */}
        <div
          role="radio"
          aria-checked={selectedRole === "company"}
          tabIndex={0}
          onClick={() => onSelectRole("company")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectRole("company")
            }
          }}
          className={`relative overflow-hidden p-5 rounded-2xl border text-start transition-all duration-300 flex flex-col gap-3 cursor-pointer group outline-none ${
            selectedRole === "company"
              ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(18,75,201,0.25)] scale-[1.02]"
              : "bg-card/40 border-white/10 hover:border-primary/40 hover:bg-white/5 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                selectedRole === "company" ? "bg-primary text-white shadow-md" : "bg-white/5 text-muted-foreground group-hover:text-white"
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            {selectedRole === "company" && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </div>
          <div>
            <h3 className={`font-bold text-sm mb-1 font-heading ${selectedRole === "company" ? "text-primary" : "text-white"}`}>
              {t("auth.roles.company.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("auth.roles.company.description")}
            </p>
          </div>
        </div>
      </div>

      {/* University Coming Soon */}
      <div className="relative overflow-hidden p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-start flex items-center justify-between opacity-80 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-bold text-xs text-white/90 font-heading">{t("auth.roles.university.title")}</h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                <Clock className="w-3 h-3" />
                {t("auth.roles.university.status")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/80 leading-normal">
              {t("auth.roles.university.description")}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
