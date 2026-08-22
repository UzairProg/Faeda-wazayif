import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useCompanyTalent } from "../hooks/useCompanyTalent"
import { TalentCard } from "../components/TalentCard"
import { EmployerCandidateModal } from "../components/EmployerCandidateModal"
import type { CompanyTalentDetail } from "../types/company.types"
import {
  Search,
  Loader2,
  Users,
} from "lucide-react"

export function CompanyTalentPage() {
  const { isRTL } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [fieldFilter, setFieldFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [selectedTalent, setSelectedTalent] = useState<CompanyTalentDetail | null>(null)

  const { data, isLoading, error } = useCompanyTalent({
    q: searchQuery || undefined,
    field: fieldFilter || undefined,
    experience: experienceFilter || undefined,
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl flex items-center gap-2">
            <Search className="h-7 w-7 text-emerald-400" />
            <span>{isRTL ? "سوق واستكشاف الكفاءات المهنية" : "Talent Discovery Hub"}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isRTL
              ? "ابحث عن أفضل الكفاءات الوطنية الموثقة والمصنفة بحسب القيمة السوقية ومصفوفة المهارات"
              : "Discover verified talent, benchmarked by market value and specialized capabilities"}
          </p>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Query input */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isRTL ? "البحث بالاسم أو المهارة:" : "Search Keywords:"}</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "مثال: Kubernetes, React, مهندس سحابي..." : "e.g. Python, DevOps..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Field Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {isRTL ? "المجال المهني:" : "Professional Field:"}
            </label>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="">{isRTL ? "جميع التخصصات والمجالات" : "All Fields"}</option>
              <option value="هندسة البرمجيات">هندسة البرمجيات والتقنية</option>
              <option value="الذكاء الاصطناعي">الذكاء الاصطناعي وعلم البيانات</option>
              <option value="الأمن السيبراني">الأمن السيبراني</option>
              <option value="إدارة المشاريع">إدارة المشاريع والمنتجات</option>
              <option value="تصميم واجهات">تصميم تجربة وواجهات المستخدم</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {isRTL ? "سنوات الخبرة:" : "Experience Level:"}
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="">{isRTL ? "جميع مستويات الخبرة" : "All Experience Levels"}</option>
              <option value="حديث تخرج">حديث تخرج (0-1 سنة)</option>
              <option value="1-3 سنوات">1-3 سنوات</option>
              <option value="4-7 سنوات">4-7 سنوات</option>
              <option value="أكثر من 8 سنوات">أكثر من 8 سنوات</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Talent Grid ──────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs font-semibold">
              {isRTL ? "جاري استكشاف الكفاءات المتاحة..." : "Discovering Candidates..."}
            </span>
          </div>
        </div>
      ) : error || !data ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400 text-xs font-bold">
          {isRTL ? "تعذر تحميل قائمة الكفاءات" : "Failed to load talent"}
        </div>
      ) : data.talent.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 space-y-3">
          <Users className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            {isRTL ? "لا توجد كفاءات مطابقة لمعايير البحث" : "No candidates found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL
              ? "يرجى تجربة كلمات بحث أخرى أو إزالة الفلاتر لعرض الكفاءات المهنية المتاحة."
              : "Try broadening your search terms or clearing filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.talent.map((t) => (
            <TalentCard
              key={t.id}
              talent={t}
              onView={(cand) => setSelectedTalent(cand as any)}
              isRtl={isRTL}
            />
          ))}
        </div>
      )}

      {/* ── Full Candidate Profile Modal ─────────────────────────────── */}
      <EmployerCandidateModal
        isOpen={Boolean(selectedTalent)}
        onClose={() => setSelectedTalent(null)}
        candidate={selectedTalent}
        isRtl={isRTL}
      />
    </div>
  )
}
