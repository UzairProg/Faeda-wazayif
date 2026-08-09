/**
 * lib/localization.utils.ts
 *
 * Reusable localization mappers and formatting utilities.
 * Ensures dynamic database content, enums, dates, numbers, and currencies
 * render properly according to the selected language (ar | en).
 */
import type { Language } from "@/store/language.store"

/**
 * Returns company name localized by language preference with fallback.
 */
export function getLocalizedCompanyName(
  company: { company_arabic_name?: string; company_english_name?: string; name?: string },
  lang: Language
): string {
  if (lang === "en" && company.company_english_name?.trim()) {
    return company.company_english_name.trim()
  }
  if (company.company_arabic_name?.trim()) {
    return company.company_arabic_name.trim()
  }
  if (company.name?.trim()) {
    return company.name.trim()
  }
  return lang === "en" ? "Company" : "شركة"
}

/**
 * Maps database work_type / job_type enums to localized strings.
 */
export function getLocalizedWorkType(workType: string | null | undefined, lang: Language): string {
  if (!workType) return lang === "en" ? "Full-time" : "دوام كامل"
  const clean = workType.trim().toLowerCase()

  if (clean.includes("كامل") || clean.includes("full")) {
    return lang === "en" ? "Full-time" : "دوام كامل"
  }
  if (clean.includes("جزئي") || clean.includes("part")) {
    return lang === "en" ? "Part-time" : "دوام جزئي"
  }
  if (clean.includes("عن بعد") || clean.includes("remote")) {
    return lang === "en" ? "Remote" : "عن بعد"
  }
  if (clean.includes("هجين") || clean.includes("hybrid")) {
    return lang === "en" ? "Hybrid" : "هجين"
  }
  if (clean.includes("عقد") || clean.includes("contract")) {
    return lang === "en" ? "Contract" : "عقد"
  }

  return workType
}

/**
 * Maps experience levels to localized strings.
 */
export function getLocalizedExperienceLevel(level: string | null | undefined, lang: Language): string {
  if (!level) return lang === "en" ? "Mid level" : "مستوى متوسط"
  const clean = level.trim().toLowerCase()

  if (clean.includes("مبتدئ") || clean.includes("entry")) {
    return lang === "en" ? "Entry level" : "مبتدئ"
  }
  if (clean.includes("متوسط") || clean.includes("mid")) {
    return lang === "en" ? "Mid level" : "متوسط"
  }
  if (clean.includes("أول") || clean.includes("senior")) {
    return lang === "en" ? "Senior" : "أول"
  }
  if (clean.includes("قيادي") || clean.includes("lead")) {
    return lang === "en" ? "Lead" : "قيادي"
  }
  if (clean.includes("تنفيذي") || clean.includes("executive")) {
    return lang === "en" ? "Executive" : "تنفيذي"
  }

  return level
}

/**
 * Formats numbers according to the active locale using Intl.NumberFormat.
 */
export function formatLocalizedNumber(num: number, lang: Language): string {
  try {
    return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US").format(num)
  } catch {
    return String(num)
  }
}

/**
 * Formats salary range with local currency symbol.
 */
export function formatLocalizedSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  lang: Language
): string {
  if (!min && !max) {
    return lang === "en" ? "Salary undisclosed" : "الراتب غير محدد"
  }

  const minFormatted = min ? formatLocalizedNumber(min, lang) : null
  const maxFormatted = max ? formatLocalizedNumber(max, lang) : null

  if (minFormatted && maxFormatted) {
    return lang === "en"
      ? `SAR ${minFormatted} - ${maxFormatted}`
      : `${minFormatted} - ${maxFormatted} ر.س`
  }

  const single = minFormatted || maxFormatted
  return lang === "en" ? `SAR ${single}` : `${single} ر.س`
}

/**
 * Formats relative date or ISO date string according to locale.
 */
export function formatLocalizedDate(dateString: string | null | undefined, lang: Language): string {
  if (!dateString) return ""
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d)
  } catch {
    return dateString
  }
}
