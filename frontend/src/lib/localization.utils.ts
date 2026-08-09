/**
 * lib/localization.utils.ts
 *
 * Reusable localization mappers and formatting utilities.
 * Ensures dynamic database content, enums, dates, numbers, and currencies
 * render properly according to the selected language (ar | en | hi).
 */
import type { Language } from "@/store/language.store"

/**
 * Returns company name localized by language preference with fallback.
 */
export function getLocalizedCompanyName(
  company: { company_arabic_name?: string; company_english_name?: string; name?: string },
  lang: Language
): string {
  if ((lang === "en" || lang === "hi") && company.company_english_name?.trim()) {
    return company.company_english_name.trim()
  }
  if (company.company_arabic_name?.trim()) {
    return company.company_arabic_name.trim()
  }
  if (company.name?.trim()) {
    return company.name.trim()
  }
  if (lang === "en") return "Company"
  if (lang === "hi") return "कंपनी"
  return "شركة"
}

/**
 * Maps database work_type / job_type enums to localized strings.
 */
export function getLocalizedWorkType(workType: string | null | undefined, lang: Language): string {
  if (!workType) {
    if (lang === "en") return "Full-time"
    if (lang === "hi") return "पूर्णकालिक"
    return "دوام كامل"
  }
  const clean = workType.trim().toLowerCase()

  if (clean.includes("كامل") || clean.includes("full")) {
    if (lang === "en") return "Full-time"
    if (lang === "hi") return "पूर्णकालिक"
    return "دوام كامل"
  }
  if (clean.includes("جزئي") || clean.includes("part")) {
    if (lang === "en") return "Part-time"
    if (lang === "hi") return "अंशकालिक"
    return "دوام جزئي"
  }
  if (clean.includes("عن بعد") || clean.includes("remote")) {
    if (lang === "en") return "Remote"
    if (lang === "hi") return "रिमोट"
    return "عن بعد"
  }
  if (clean.includes("هجين") || clean.includes("hybrid")) {
    if (lang === "en") return "Hybrid"
    if (lang === "hi") return "हाइब्रिड"
    return "هجين"
  }
  if (clean.includes("عقد") || clean.includes("contract")) {
    if (lang === "en") return "Contract"
    if (lang === "hi") return "अनुबंध"
    return "عقد"
  }

  return workType
}

/**
 * Maps experience levels to localized strings.
 */
export function getLocalizedExperienceLevel(level: string | null | undefined, lang: Language): string {
  if (!level) {
    if (lang === "en") return "Mid level"
    if (lang === "hi") return "मध्यम स्तर"
    return "مستوى متوسط"
  }
  const clean = level.trim().toLowerCase()

  if (clean.includes("مبتدئ") || clean.includes("entry")) {
    if (lang === "en") return "Entry level"
    if (lang === "hi") return "प्रारंभिक स्तर"
    return "مبتدئ"
  }
  if (clean.includes("متوسط") || clean.includes("mid")) {
    if (lang === "en") return "Mid level"
    if (lang === "hi") return "मध्यम स्तर"
    return "متوسط"
  }
  if (clean.includes("أول") || clean.includes("senior")) {
    if (lang === "en") return "Senior"
    if (lang === "hi") return "वरिष्ठ"
    return "أول"
  }
  if (clean.includes("قيادي") || clean.includes("lead")) {
    if (lang === "en") return "Lead"
    if (lang === "hi") return "नेतृत्व"
    return "قيادي"
  }
  if (clean.includes("تنفيذي") || clean.includes("executive")) {
    if (lang === "en") return "Executive"
    if (lang === "hi") return "कार्यकारी"
    return "تنفيذي"
  }

  return level
}

/**
 * Formats numbers according to the active locale using Intl.NumberFormat.
 */
export function formatLocalizedNumber(num: number, lang: Language): string {
  try {
    const localeCode = lang === "ar" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US"
    return new Intl.NumberFormat(localeCode).format(num)
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
    if (lang === "en") return "Salary undisclosed"
    if (lang === "hi") return "वेतन का खुलासा नहीं किया गया"
    return "الراتب غير محدد"
  }

  const minFormatted = min ? formatLocalizedNumber(min, lang) : null
  const maxFormatted = max ? formatLocalizedNumber(max, lang) : null

  if (minFormatted && maxFormatted) {
    if (lang === "en" || lang === "hi") {
      return `SAR ${minFormatted} - ${maxFormatted}`
    }
    return `${minFormatted} - ${maxFormatted} ر.س`
  }

  const single = minFormatted || maxFormatted
  if (lang === "en" || lang === "hi") {
    return `SAR ${single}`
  }
  return `${single} ر.س`
}

/**
 * Formats relative date or ISO date string according to locale.
 */
export function formatLocalizedDate(dateString: string | null | undefined, lang: Language): string {
  if (!dateString) return ""
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    const localeCode = lang === "ar" ? "ar-SA" : lang === "hi" ? "hi-IN" : "en-US"
    return new Intl.DateTimeFormat(localeCode, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d)
  } catch {
    return dateString
  }
}
