import { useTranslation } from "@/i18n"
import type { CandidateJobsFilterParams } from "../../types/candidate.types"
import { Search, MapPin, X } from "lucide-react"

interface CandidateJobFiltersProps {
  filters: CandidateJobsFilterParams
  onChange: (newFilters: CandidateJobsFilterParams) => void
  onReset: () => void
}

export function CandidateJobFilters({ filters, onChange, onReset }: CandidateJobFiltersProps) {
  const { isRTL } = useTranslation()

  const workTypes = [
    { value: "", label_ar: "كافة أنماط العمل", label_en: "All Work Types" },
    { value: "full_time", label_ar: "دوام كامل", label_en: "Full-time" },
    { value: "part_time", label_ar: "دوام جزئي", label_en: "Part-time" },
    { value: "remote", label_ar: "عن بعد", label_en: "Remote" },
    { value: "hybrid", label_ar: "هجين", label_en: "Hybrid" },
    { value: "contract", label_ar: "عقد", label_en: "Contract" },
  ]

  const expLevels = [
    { value: "", label_ar: "كافة مستويات الخبرة", label_en: "All Levels" },
    { value: "entry", label_ar: "مبتدئ (0-2 سنوات)", label_en: "Entry Level" },
    { value: "mid", label_ar: "متوسط (3-5 سنوات)", label_en: "Mid Level" },
    { value: "senior", label_ar: "خبير (5+ سنوات)", label_en: "Senior Level" },
  ]

  const hasActiveFilters = Boolean(
    filters.q ||
    filters.location ||
    filters.work_type ||
    filters.experience ||
    filters.salary_disclosed
  )

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
      {/* Search and Location input row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search keyword */}
        <div className="sm:col-span-7 relative">
          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3.5" : "left-3.5"} text-slate-400 pointer-events-none`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.q || ""}
            onChange={(e) => onChange({ ...filters, q: e.target.value, page: 1 })}
            placeholder={isRTL ? "ابحث بالمسمى، المهارة، أو التخصص..." : "Search by job title, skill, or field..."}
            className={`w-full bg-slate-800/70 border border-slate-700/60 rounded-xl py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors ${
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            }`}
          />
        </div>

        {/* Location input */}
        <div className="sm:col-span-5 relative">
          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3.5" : "left-3.5"} text-slate-400 pointer-events-none`}>
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.location || ""}
            onChange={(e) => onChange({ ...filters, location: e.target.value, page: 1 })}
            placeholder={isRTL ? "المدينة أو المنطقة..." : "City or location..."}
            className={`w-full bg-slate-800/70 border border-slate-700/60 rounded-xl py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors ${
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            }`}
          />
        </div>
      </div>

      {/* Dropdowns row: Work type, Experience, and Disclosed salary checkbox */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Work type selector */}
          <select
            value={filters.work_type || ""}
            onChange={(e) => onChange({ ...filters, work_type: e.target.value, page: 1 })}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {workTypes.map((wt) => (
              <option key={wt.value} value={wt.value} className="bg-slate-900 text-white">
                {isRTL ? wt.label_ar : wt.label_en}
              </option>
            ))}
          </select>

          {/* Experience level selector */}
          <select
            value={filters.experience || ""}
            onChange={(e) => onChange({ ...filters, experience: e.target.value, page: 1 })}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {expLevels.map((exp) => (
              <option key={exp.value} value={exp.value} className="bg-slate-900 text-white">
                {isRTL ? exp.label_ar : exp.label_en}
              </option>
            ))}
          </select>

          {/* Salary disclosed checkbox */}
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 cursor-pointer select-none text-xs text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.salary_disclosed)}
              onChange={(e) => onChange({ ...filters, salary_disclosed: e.target.checked, page: 1 })}
              className="rounded border-slate-700 text-primary focus:ring-primary h-3.5 w-3.5 bg-slate-900"
            />
            <span>{isRTL ? "رواتب معلنة فقط" : "Disclosed salary only"}</span>
          </label>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors py-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isRTL ? "إعادة الضبط" : "Reset filters"}</span>
          </button>
        )}
      </div>
    </div>
  )
}
