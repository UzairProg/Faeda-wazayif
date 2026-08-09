/**
 * features/companies/components/CompanySearch.tsx
 *
 * Prominent search bar component for discovering companies.
 * Combines company query autocomplete input, location input, and submit button.
 */
import React from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompanyAutocompleteInput } from "./CompanyAutocompleteInput"

interface CompanySearchProps {
  query: string
  location: string
  onQueryChange: (q: string) => void
  onLocationChange: (loc: string) => void
  onSearch: () => void
}

export function CompanySearch({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSearch,
}: CompanySearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-full shadow-2xl">
        {/* Company Name / Keyword Autocomplete Input */}
        <div className="flex-1">
          <CompanyAutocompleteInput
            value={query}
            onChange={onQueryChange}
            onSubmitSearch={onSearch}
            placeholder="ابحث عن شركة، مهارة، أو مجال عمل..."
            className="w-full"
          />
        </div>

        {/* Location Input */}
        <div className="relative flex items-center w-full sm:w-56 shrink-0">
          <MapPin className="absolute start-4 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="المدينة..."
            className="w-full h-12 ps-12 pe-4 bg-card/60 border border-white/10 rounded-2xl text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-2xl sm:rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2 shadow-lg shadow-primary/20 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>بحث</span>
        </Button>
      </div>
    </form>
  )
}
