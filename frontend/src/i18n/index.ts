/**
 * i18n/index.ts
 *
 * Central i18n entry point for Faeda Jobs.
 *
 * CURRENT STATE: Lightweight translation object — all strings in Arabic.
 * This provides a centralized key structure so text is never scattered
 * through components as raw strings.
 *
 * FUTURE: Replace with react-i18next when multilingual support (AR/EN/Hindi)
 * is activated (Roadmap Phase 0 — see FAEDA_JOBS_FINAL_ROADMAP.md §10).
 *
 * Usage:
 *   import { t } from "@/i18n"
 *   t("jobs.search.placeholder")      // "المسمى الوظيفي أو المهارة..."
 *   t("common.actions.save")           // "حفظ"
 */
import { common } from "./namespaces/common"
import { jobs } from "./namespaces/jobs"
import { auth } from "./namespaces/auth"
import { publicNs } from "./namespaces/public"

export const translations = {
  common,
  jobs,
  auth,
  public: publicNs,
} as const

type TranslationsType = typeof translations

/**
 * Simple dot-notation path resolver.
 * Supports up to 3 levels deep: "namespace.group.key"
 *
 * @example t("jobs.search.placeholder") → "المسمى الوظيفي..."
 */
export function t(key: string): string {
  const parts = key.split(".")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key
    current = current[part]
  }
  if (typeof current === "string") return current
  // Return key as fallback if value is not a string (e.g., nested object or function)
  return key
}

export type { TranslationsType }
export { common, jobs, auth, publicNs as public }
