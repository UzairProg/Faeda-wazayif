import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Building2, Briefcase, Code, Loader2 } from "lucide-react"
import { getJobSuggestions } from "@/features/jobs/services/jobs.service"
import type { JobSuggestion } from "@/features/jobs/types/job.types"
import { cn } from "@/lib/utils"

interface SearchAutocompleteInputProps {
  value: string
  onChange: (val: string) => void
  onSearchSubmit: () => void
  placeholder: string
  type: "location" | "keyword"
  icon: React.ComponentType<{ className?: string }>
  ariaLabel: string
}

export function SearchAutocompleteInput({
  value,
  onChange,
  onSearchSubmit,
  placeholder,
  type,
  icon: Icon,
  ariaLabel,
}: SearchAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Debounced suggestion fetcher (250ms)
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      setIsLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await getJobSuggestions(value, type)
        if (isMountedRef.current) {
          setSuggestions(results)
          setIsOpen(results.length > 0)
          setHighlightedIndex(-1)
        }
      } catch {
        if (isMountedRef.current) {
          setSuggestions([])
          setIsOpen(false)
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [value, type])

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (sug: JobSuggestion) => {
    onChange(sug.value)
    setIsOpen(false)
    setSuggestions([])
    onSearchSubmit()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        onSearchSubmit()
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex])
      } else {
        setIsOpen(false)
        onSearchSubmit()
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const getCategoryIcon = (sugType: JobSuggestion["type"]) => {
    switch (sugType) {
      case "city":
        return <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
      case "company":
        return <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      case "job":
        return <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      case "skill":
        return <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2.5 w-full">
        <Icon className="w-4 h-4 text-primary shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="w-full bg-transparent outline-none text-white placeholder:text-muted-foreground/40 text-xs sm:text-sm"
        />
        {isLoading && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full start-0 end-0 mt-2.5 z-50 bg-[#0d1527]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto text-start"
            role="listbox"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {suggestions.map((sug, idx) => {
                const isHighlighted = idx === highlightedIndex
                return (
                  <div
                    key={sug.id}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => handleSelect(sug)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      "px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 text-start",
                      isHighlighted ? "bg-primary/20 text-white" : "hover:bg-white/5 text-muted-foreground hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getCategoryIcon(sug.type)}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate font-heading">{sug.label}</p>
                        {sug.subLabel && (
                          <p className="text-[10px] text-muted-foreground/70 truncate">{sug.subLabel}</p>
                        )}
                      </div>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-muted-foreground shrink-0">
                      {sug.category}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
