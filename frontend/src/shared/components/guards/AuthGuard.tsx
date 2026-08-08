/**
 * shared/components/guards/AuthGuard.tsx
 *
 * Protects routes that require authentication.
 * Reads from useAuthStore — if not authenticated, redirects to login,
 * preserving the intended destination in location state.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"

export function AuthGuard() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

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
