/**
 * features/candidate/layouts/CandidateLayout.tsx
 *
 * Shell layout for the Candidate Command Center.
 * Currently a placeholder — will be built in Phase 2 of the roadmap
 * (Candidate profile/CV/jobs/applications module).
 *
 * Roadmap reference: FAEDA_JOBS_FINAL_ROADMAP.md §6.2
 */
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { Briefcase } from "lucide-react"

export function CandidateLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Placeholder shell — replace with full Candidate sidebar/header in Phase 2 */}
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
          <Briefcase className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold font-heading text-white">مركز القيادة المهنية</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          مساحة المرشح قيد البناء. سيتم إطلاقها قريباً.
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
