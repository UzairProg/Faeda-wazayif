/**
 * features/company/layouts/CompanyLayout.tsx
 *
 * Shell layout for the Company/Employer Command Center.
 * Currently a placeholder — will be built in Phase 3 of the roadmap
 * (Employer company/jobs/pipeline/decision module).
 *
 * Roadmap reference: FAEDA_JOBS_FINAL_ROADMAP.md §6.3
 */
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { Building2 } from "lucide-react"

export function CompanyLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Placeholder shell — replace with full Company sidebar/header in Phase 3 */}
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
          <Building2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold font-heading text-white">مركز التوظيف</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          لوحة التحكم الخاصة بالشركات قيد البناء. سيتم إطلاقها قريباً.
        </p>
        <Link
          to={ROUTES.PUBLIC.HOME}
          className="text-primary hover:text-white text-sm font-semibold transition-colors mt-2"
        >
          العودة للرئيسية ←
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
