/**
 * i18n/index.ts
 *
 * Production-grade trilingual (Arabic ↔ English ↔ Hindi) translation engine for Faeda Jobs.
 * Exports:
 *   - `t(key, params?, lang?)`: Pure translation lookup function
 *   - `useTranslation()`: Reactive React hook that re-renders components on language switch
 */
import { useLanguageStore, type Language } from "@/store/language.store"
import { arLocale } from "./locales/ar"
import { enLocale } from "./locales/en"
import { hiLocale } from "./locales/hi"

export const locales = {
  ar: arLocale,
  en: enLocale,
  hi: hiLocale,
} as const

export type LocaleType = typeof arLocale

/**
 * Dot-notation translation key resolver with language fallback and parameters interpolation.
 *
 * @example t("jobs.search.button") → "بحث" / "Search" / "खोजें"
 * @example t("jobs.search.resultsCount", { count: 5 }) → "5 وظائف متاحة" / "5 jobs available" / "5 नौकरियां उपलब्ध हैं"
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  targetLang?: Language
): string {
  const lang: Language = targetLang || useLanguageStore.getState().language

  const resolve = (l: Language): unknown => {
    const parts = key.split(".")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = locales[l]
    for (const part of parts) {
      if (current == null || typeof current !== "object") return undefined
      current = current[part]
    }
    return current
  }

  let value = resolve(lang)
  if (value == null && lang !== "ar") {
    value = resolve("ar")
  }

  if (typeof value === "function") {
    try {
      const countVal = params?.count != null ? Number(params.count) : 0
      return String(value(countVal))
    } catch {
      return key
    }
  }

  if (typeof value === "string") {
    if (params) {
      let interpolated = value
      Object.entries(params).forEach(([pK, pV]) => {
        interpolated = interpolated.replace(new RegExp(`{${pK}}`, "g"), String(pV))
      })
      return interpolated
    }
    return value
  }

  return key
}

/**
 * Reactive hook for React components.
 * Automatically triggers component re-render when language changes in useLanguageStore.
 */
export function useTranslation() {
  const { language, direction, setLanguage, toggleLanguage } = useLanguageStore()

  const translate = (key: string, params?: Record<string, string | number>): string => {
    return t(key, params, language)
  }

  return {
    t: translate,
    language,
    direction,
    isRTL: direction === "rtl",
    setLanguage,
    toggleLanguage,
  }
}
