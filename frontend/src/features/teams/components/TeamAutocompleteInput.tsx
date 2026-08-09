/**
 * features/teams/components/TeamAutocompleteInput.tsx
 *
 * Accessible autocomplete search input for team names and capabilities.
 * Supports debounced backend suggestions, keyboard navigation (ArrowUp/ArrowDown/Enter/Escape),
 * and ARIA combobox semantics. Fully localized.
 */
import React, { useState, useRef, useEffect, useId } from "react"
import { Search, Users, MapPin, Loader2, X } from "lucide-react"
import { useTeamAutocomplete } from "../hooks/useTeams"
import type { TeamSuggestion } from "../types/team.types"
import { useTranslation } from "@/i18n"

interface TeamAutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelectSuggestion?: (sug: TeamSuggestion) => void
  onSubmitSearch?: () => void
  placeholder?: string
  className?: string
}

export function TeamAutocompleteInput({
  value,
  onChange,
  onSelectSuggestion,
  onSubmitSearch,
  placeholder,
  className = "",
}: TeamAutocompleteInputProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const { suggestions, isLoading } = useTeamAutocomplete(value, 250)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const hasSuggestions = suggestions.length > 0 && isOpen
  const resolvedPlaceholder = placeholder || t("teams.search.placeholder")

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (suggestions.length > 0 && document.activeElement === inputRef.current) {
      setIsOpen(true)
    }
  }, [suggestions])

  const handleSelect = (sug: TeamSuggestion) => {
    onChange(sug.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (onSelectSuggestion) {
      onSelectSuggestion(sug)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true)
      }
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === "Enter") {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault()
        handleSelect(suggestions[highlightedIndex])
      } else {
        setIsOpen(false)
        if (onSubmitSearch) {
          onSubmitSearch()
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute start-4 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          className="w-full h-12 ps-12 pe-10 bg-card/60 border border-white/10 rounded-2xl text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-all text-start"
        />

        {isLoading ? (
          <Loader2 className="absolute end-4 w-4 h-4 text-primary animate-spin" />
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              onChange("")
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute end-4 p-1 rounded-lg text-muted-foreground hover:text-white transition-colors"
            aria-label={t("teams.search.clear")}
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {hasSuggestions && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute start-0 end-0 top-full mt-2 z-50 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-white/5 py-1"
        >
          <li className="px-4 py-2 text-[11px] font-bold text-muted-foreground font-mono uppercase tracking-wider bg-white/5 text-start">
            {t("teams.search.suggestionsHeader")}
          </li>
          {suggestions.map((sug, index) => {
            const isHighlighted = index === highlightedIndex
            return (
              <li
                key={sug.id}
                role="option"
                aria-selected={isHighlighted}
                onClick={() => handleSelect(sug)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-3 text-start ${
                  isHighlighted ? "bg-primary/20 text-white" : "hover:bg-white/5 text-white/90"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{sug.label}</p>
                    {sug.subLabel && (
                      <p className="text-[11px] text-muted-foreground truncate">{sug.subLabel}</p>
                    )}
                  </div>
                </div>

                {sug.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                    <MapPin className="w-3 h-3 text-primary" /> {sug.location}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
