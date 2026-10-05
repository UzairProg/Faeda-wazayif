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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        id: "1",
        name: "جامعة الملك فيصل",
        email: "kfu@kfu.edu.sa",
        role: "university" as const
      },
      token: "demo-university-token",
      isAuthenticated: true,
      isCheckingSession: false,

      login: (user, token) => set({ user, token, isAuthenticated: true, isCheckingSession: false }),

      logout: async () => {
        await authService.logout()
        set({ user: null, token: null, isAuthenticated: false, isCheckingSession: false })
      },

      checkSession: async () => {
        // Dev URL role switch support for preview / automated documentation
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          const forcedRole = params.get("role")
          if (forcedRole && ["candidate", "company", "university", "admin"].includes(forcedRole)) {
            const roleUsers: Record<string, AuthUser> = {
              candidate: { id: "1", name: "عمر المنصور", email: "omar.mansoor@example.com", role: "candidate" },
              company: { id: "1", name: "Aramco Digital Solutions", email: "info@aramco-digital.com", role: "company" },
              university: { id: "1", name: "جامعة الملك فيصل", email: "careers@kfu.edu.sa", role: "university" },
              admin: { id: "1", name: "مدير النظام (Admin)", email: "admin@faeda.jobs", role: "admin" },
            }
            set({ user: roleUsers[forcedRole], token: `demo-${forcedRole}-token`, isAuthenticated: true, isCheckingSession: false })
            return
          }
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
    }),
    {
      name: "auth-storage",
    }
  )
)
