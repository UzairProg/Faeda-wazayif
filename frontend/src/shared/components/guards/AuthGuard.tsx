/**
 * shared/components/guards/AuthGuard.tsx
 *
 * Protects routes that require authentication.
 * Reads from useAuthStore — if checking session, shows a subtle loader.
 * If not authenticated, redirects to login, preserving intended destination.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"
import { Loader2 } from "lucide-react"

export function AuthGuard() {
  const { isAuthenticated, isCheckingSession } = useAuthStore()
  const location = useLocation()

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground font-heading">جاري التحقق من الجلسة...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return (
      <Navigate
        to={ROUTES.AUTH.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <Outlet />
}
