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
      lang: "en",
      isRTL: false,
      setLang: (lang) => set({ lang, isRTL: lang === "ar" }),
    }),
    {
      name: "language-storage",
    }
  )
)
