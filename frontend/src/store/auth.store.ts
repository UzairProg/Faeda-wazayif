import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "@/features/auth/services/auth.service"
import type { AuthUser } from "@/features/auth/types/auth.types"

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isCheckingSession: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

function getInitialDemoUser(): { user: AuthUser; token: string } {
  if (typeof window !== "undefined") {
    const p = window.location.pathname
    if (p.startsWith("/company")) {
      return {
        user: { id: "1", name: "Aramco Digital Solutions", email: "info@aramco-digital.com", role: "company" },
        token: "demo-company-token",
      }
    }
    if (p.startsWith("/candidate")) {
      return {
        user: { id: "1", name: "عمر المنصور", email: "omar.mansoor@example.com", role: "candidate" },
        token: "demo-candidate-token",
      }
    }
    if (p.startsWith("/university")) {
      return {
        user: { id: "univ-demo-kfu", name: "جامعة الملك فيصل - الأحساء (د. خالد السليمان)", email: "careers@kfu.edu.sa", role: "university" },
        token: "demo-university-token",
      }
    }
    if (p.startsWith("/admin")) {
      return {
        user: { id: "1", name: "مدير النظام (Admin)", email: "admin@faeda.jobs", role: "admin" },
        token: "demo-admin-token",
      }
    }
  }
  return {
    user: { id: "1", name: "Aramco Digital Solutions", email: "info@aramco-digital.com", role: "company" },
    token: "demo-company-token",
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      const initial = getInitialDemoUser()
      return {
        user: initial.user,
        token: initial.token,
        isAuthenticated: true,
        isCheckingSession: false,

      login: (user, token) => set({ user, token, isAuthenticated: true, isCheckingSession: false }),

      logout: async () => {
        await authService.logout()
        set({ user: null, token: null, isAuthenticated: false, isCheckingSession: false })
      },

      checkSession: async () => {
        // Dev URL role switch or path-based auto-role support
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          const forcedRole = params.get("role")
          if (forcedRole && ["candidate", "company", "university", "admin"].includes(forcedRole)) {
            const roleUsers: Record<string, AuthUser> = {
              candidate: { id: "1", name: "عمر المنصور", email: "omar.mansoor@example.com", role: "candidate" },
              company: { id: "1", name: "Aramco Digital Solutions", email: "info@aramco-digital.com", role: "company" },
              university: { id: "univ-demo-kfu", name: "جامعة الملك فيصل (د. خالد السليمان)", email: "careers@kfu.edu.sa", role: "university" },
              admin: { id: "1", name: "مدير النظام (Admin)", email: "admin@faeda.jobs", role: "admin" },
            }
            set({ user: roleUsers[forcedRole], token: `demo-${forcedRole}-token`, isAuthenticated: true, isCheckingSession: false })
            return
          }

          const path = window.location.pathname
          if (path.startsWith("/university")) {
            const current = get()
            if (current.user?.role === "university" && current.isAuthenticated) {
              return
            }
            set({
              user: { id: "univ-demo-kfu", name: "جامعة الملك فيصل - الأحساء (د. خالد السليمان)", email: "careers@kfu.edu.sa", role: "university" },
              token: "demo-university-token",
              isAuthenticated: true,
              isCheckingSession: false,
            })
            return
          }

          if (path.startsWith("/admin")) {
            const current = get()
            if (current.user?.role === "admin" && current.isAuthenticated) {
              return
            }
            set({
              user: { id: "1", name: "مدير النظام (Admin)", email: "admin@faeda.jobs", role: "admin" },
              token: "demo-admin-token",
              isAuthenticated: true,
              isCheckingSession: false,
            })
            return
          }

          if (path.startsWith("/company")) {
            const current = get()
            if (current.user?.role === "company" && current.isAuthenticated) {
              return
            }
            set({
              user: { id: "1", name: "Aramco Digital Solutions", email: "info@aramco-digital.com", role: "company" },
              token: "demo-company-token",
              isAuthenticated: true,
              isCheckingSession: false
            })
            return
          }
        }

        const current = get()
        if (current.isAuthenticated && current.token?.includes("demo") && current.user) {
          return
        }

        set({ isCheckingSession: true })
        try {
          const restoredUser = await authService.checkSession()
          if (restoredUser) {
            set({ user: restoredUser, token: "cookie-session-active", isAuthenticated: true })
          } else {
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        } finally {
          set({ isCheckingSession: false })
        }
      },
    }
  },
  {
      name: "auth-storage",
    }
  )
)
