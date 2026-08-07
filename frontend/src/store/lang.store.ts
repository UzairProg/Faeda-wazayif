import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LangStore {
  lang: "en" | "ar"
  setLang: (lang: "en" | "ar") => void
  isRTL: boolean
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: "ar",
      isRTL: true,
      setLang: (lang) => set({ lang, isRTL: lang === "ar" }),
    }),
    {
      name: "language-storage",
    }
  )
)
