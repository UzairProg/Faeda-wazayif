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
      user: null,
      token: null,
      isAuthenticated: false,
      isCheckingSession: true,

      login: (user, token) => set({ user, token, isAuthenticated: true, isCheckingSession: false }),

      logout: async () => {
        await authService.logout()
        set({ user: null, token: null, isAuthenticated: false, isCheckingSession: false })
      },

      checkSession: async () => {
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
