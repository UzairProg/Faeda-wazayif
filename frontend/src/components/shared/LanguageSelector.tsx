/**
 * components/shared/LanguageSelector.tsx
 *
 * Crystal-clear trilingual language selector (العربية ↔ English ↔ हिन्दी)
 * - Explicitly shows the CURRENT active language on the trigger.
 * - Opens a clean, branded dropdown showing all languages with active checkmark indicators.
 * - Immediately persists and applies document direction (RTL / LTR) and translations.
 */
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown, Check } from "lucide-react"
import { useTranslation } from "@/i18n"
import type { Language } from "@/store/language.store"
import { cn } from "@/lib/utils"

interface LanguageOption {
  code: Language
  nativeLabel: string
  englishLabel: string
  dir: "rtl" | "ltr"
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "ar",
    nativeLabel: "العربية",
    englishLabel: "Arabic",
    dir: "rtl",
    flag: "🇸🇦",
  },
  {
    code: "en",
    nativeLabel: "English",
    englishLabel: "English",
    dir: "ltr",
    flag: "🇺🇸",
  },
  {
    code: "hi",
    nativeLabel: "हिन्दी",
    englishLabel: "Hindi",
    dir: "ltr",
    flag: "🇮🇳",
  },
]

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "pill"
  className?: string
  dropdownAlign?: "start" | "end"
}

export function LanguageSelector({
  variant = "default",
  className,
  dropdownAlign = "end",
}: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentOption =
    LANGUAGES.find((opt) => opt.code === language) || LANGUAGES[0]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (code: Language) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative inline-block text-start", className)} ref={containerRef}>
      {/* Trigger Button showing EXACT active language */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language. Current language: ${currentOption.nativeLabel}`}
        className={cn(
          "group flex items-center gap-2 rounded-xl border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
          variant === "pill" &&
            "px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-xs text-white shadow-sm",
          variant === "compact" &&
            "px-2.5 py-1.5 bg-card/80 hover:bg-card border-border hover:border-primary/40 text-xs text-slate-200 hover:text-white shadow-sm",
          variant === "default" &&
            "px-3 py-2 bg-card/80 hover:bg-card border-border hover:border-primary/40 text-xs text-slate-200 hover:text-white shadow-sm"
        )}
      >
        <span className="text-sm leading-none shrink-0" aria-hidden="true">
          {currentOption.flag}
        </span>
        <Globe className="w-3.5 h-3.5 text-secondary shrink-0 transition-transform group-hover:rotate-12 duration-300" />
        
        {/* Active Language Label */}
        <span className="font-bold tracking-tight text-white">
          {currentOption.nativeLabel}
        </span>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-white"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className={cn(
              "absolute mt-2 w-52 rounded-2xl border border-border bg-[#0B1E38]/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50",
              dropdownAlign === "end" ? "end-0" : "start-0"
            )}
          >
            <div className="px-3 py-2 border-b border-border/60 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {language === "ar"
                  ? "اختر لغة العرض"
                  : language === "hi"
                  ? "भाषा चुनें (Select Language)"
                  : "Select Platform Language"}
              </span>
            </div>

            <div className="space-y-1">
              {LANGUAGES.map((option) => {
                const isSelected = option.code === language
                return (
                  <button
                    key={option.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all",
                      isSelected
                        ? "bg-primary/25 text-white font-bold border border-primary/40 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none shrink-0" aria-hidden="true">
                        {option.flag}
                      </span>
                      <div className="flex flex-col text-start">
                        <span className="font-bold text-white text-xs">
                          {option.nativeLabel}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {option.englishLabel}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/30 text-secondary">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
