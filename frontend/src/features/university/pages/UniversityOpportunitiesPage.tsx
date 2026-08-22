import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityOpportunities } from "../hooks/useUniversityOpportunities"
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Loader2,
  ExternalLink,
} from "lucide-react"

export function UniversityOpportunitiesPage() {
  const { isRTL } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [workTypeFilter, setWorkTypeFilter] = useState("")

  const { data, isLoading } = useUniversityOpportunities({
    q: searchQuery || undefined,
    work_type: workTypeFilter || undefined,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
          {isRTL ? "فرص التوظيف والشراكات المهنية" : "Career Opportunities & Industry Links"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isRTL
            ? "استعراض الوظائف والفرص التدريبية المعتمدة في سوق العمل المتوافقة مع تخصصات خريجي الجامعة."
            : "Active corporate job listings and training programs aligned with university degrees."}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-4 md:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3.5" : "left-3.5"} w-4 h-4 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث بالمسمى الوظيفي، اسم الشركة، أو المهارات المطلوبة..." : "Search by job title, company name, skills..."}
              className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-rose-500 focus:outline-none`}
            />
          </div>

          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-rose-500 focus:outline-none"
          >
            <option value="">{isRTL ? "جميع أنماط العمل" : "All Work Types"}</option>
            <option value="دوام كامل">{isRTL ? "دوام كامل" : "Full Time"}</option>
            <option value="دوام جزئي">{isRTL ? "دوام جزئي" : "Part Time"}</option>
            <option value="عن بعد">{isRTL ? "عن بعد" : "Remote"}</option>
            <option value="تدريب تعاوني">{isRTL ? "تدريب تعاوني / صيفي" : "Co-op / Internship"}</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
      ) : data?.opportunities && data.opportunities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.opportunities.map((opp) => (
            <div
              key={opp.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl transition-all hover:border-rose-500/30"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-white font-bold text-xs">
                      {opp.company_logo ? (
                        <img
                          src={opp.company_logo.startsWith("http") ? opp.company_logo : `/${opp.company_logo}`}
                          alt={opp.company_name}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        opp.company_name.charAt(0)
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>{opp.company_name}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {opp.location && (
                    <span className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{opp.location}</span>
                    </span>
                  )}
                  {opp.work_type && (
                    <span className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{opp.work_type}</span>
                    </span>
                  )}
                  {opp.salary_range && (
                    <span className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1 text-emerald-400">
                      <DollarSign className="w-3 h-3" />
                      <span>{opp.salary_range}</span>
                    </span>
                  )}
                </div>

                {opp.skills && opp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {opp.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {opp.date_posted ? opp.date_posted.split("T")[0] : ""}
                </span>

                <a
                  href={`/jobs/${opp.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <span>{isRTL ? "تفاصيل الفرصة" : "Opportunity Details"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/80 p-12 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">
            {isRTL ? "لا توجد فرص وظيفية نشطة متوافقة حالياً" : "No active matching opportunities"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            {isRTL
              ? "سيتم استعراض الشواغر الوظيفية وبرامج التدريب عند قيام الشركات بنشر فرص جديدة."
              : "New corporate job postings and training programs will automatically appear here."}
          </p>
        </div>
      )}
    </div>
  )
}
