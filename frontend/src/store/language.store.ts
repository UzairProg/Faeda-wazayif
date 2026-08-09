/**
 * store/language.store.ts
 *
 * Global Zustand store for persistent language selection (ar ↔ en)
 * and document direction (rtl ↔ ltr).
 */
import { create } from "zustand"

export type Language = "ar" | "en"
export type Direction = "rtl" | "ltr"

const STORAGE_KEY = "faeda-language"

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ar"
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "ar" || stored === "en") {
    return stored
  }
  return "ar"
}

function syncDocumentAttributes(lang: Language) {
  if (typeof document === "undefined") return
  const dir: Direction = lang === "ar" ? "rtl" : "ltr"
  document.documentElement.lang = lang
  document.documentElement.dir = dir
}

interface LanguageState {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const initialLang = getInitialLanguage()
syncDocumentAttributes(initialLang)

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: initialLang,
  direction: initialLang === "ar" ? "rtl" : "ltr",

  setLanguage: (lang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang)
    }
    syncDocumentAttributes(lang)
    set({
      language: lang,
      direction: lang === "ar" ? "rtl" : "ltr",
    })
  },

  toggleLanguage: () => {
    const nextLang: Language = get().language === "ar" ? "en" : "ar"
    get().setLanguage(nextLang)
  },
}))
