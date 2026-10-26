/**
 * features/auth/components/RoleSelector.tsx
 *
 * Role selector component for registration.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { User, Building2, GraduationCap, CheckCircle2 } from "lucide-react"
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
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
          className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border text-start transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer group outline-none ${
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
          className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border text-start transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer group outline-none ${
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

        {/* University / Academic Institution */}
        <div
          role="radio"
          aria-checked={selectedRole === "university"}
          tabIndex={0}
          onClick={() => onSelectRole("university")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectRole("university")
            }
          }}
          className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border text-start transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer group outline-none sm:col-span-2 lg:col-span-1 ${
            selectedRole === "university"
              ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(18,75,201,0.25)] scale-[1.02]"
              : "bg-card/40 border-white/10 hover:border-primary/40 hover:bg-white/5 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                selectedRole === "university" ? "bg-primary text-white shadow-md" : "bg-white/5 text-muted-foreground group-hover:text-white"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            {selectedRole === "university" && (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </div>
          <div>
            <h3 className={`font-bold text-sm mb-1 font-heading ${selectedRole === "university" ? "text-primary" : "text-white"}`}>
              {t("auth.roles.university.title")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("auth.roles.university.description")}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
