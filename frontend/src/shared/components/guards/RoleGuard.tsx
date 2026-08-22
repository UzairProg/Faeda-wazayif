/**
 * shared/components/guards/RoleGuard.tsx
 *
 * Protects routes that require a specific user role.
 * Must be used inside AuthGuard (assumes user is authenticated).
 * Shows an access-denied state instead of redirecting — preserves URL.
 */
import { Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

type AllowedRole = "candidate" | "company" | "university" | "admin"

interface RoleGuardProps {
  allowedRoles: AllowedRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuthStore()

  const userRole = user?.role as AllowedRole | undefined
  const hasAccess = userRole != null && allowedRoles.includes(userRole)

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-6">
          <ShieldOff className="w-8 h-8 text-warning-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold font-heading text-white mb-3">
          غير مصرح لك بالوصول
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
          ليس لديك صلاحية للوصول إلى هذه الصفحة. تأكد من أنك سجلت الدخول بالحساب الصحيح.
        </p>
        <Button asChild className="rounded-full">
          <Link to={ROUTES.PUBLIC.HOME}>العودة للرئيسية</Link>
        </Button>
      </div>
    )
  }

  return <Outlet />
}
