/**
 * features/admin/layouts/AdminLayout.tsx
 *
 * Shell layout for the Admin Governance Console.
 * Currently a placeholder — will be built in Phase 4 of the roadmap.
 *
 * Roadmap reference: FAEDA_JOBS_FINAL_ROADMAP.md §6.4
 * Note: The Flask backend already has a complete admin RBAC system
 * (Admin model, 4 real roles, @require_permission decorator, AuditLog).
 * This shell is where the React admin UI will connect to those endpoints.
 */
import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { ShieldCheck } from "lucide-react"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Placeholder shell — replace with full Admin sidebar/header in Phase 4 */}
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
          <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold font-heading text-white">لوحة الإدارة</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          وحدة الإدارة قيد البناء.
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
