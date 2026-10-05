import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityOpportunities } from "../hooks/useUniversityOpportunities"
import { tl, getLocalizedOpportunities } from "../utils/universityLocalization"
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
  const { isRTL, language } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [workTypeFilter, setWorkTypeFilter] = useState("")

  const { data, isLoading } = useUniversityOpportunities({
    q: searchQuery || undefined,
    work_type: workTypeFilter || undefined,
  })

  const rawOpportunities = data?.opportunities || []
  const opportunities = getLocalizedOpportunities(rawOpportunities, language)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
          {tl(
            language,
            "فرص التوظيف والشراكات المهنية",
            "Career Opportunities & Industry Links",
            "करियर के अवसर और उद्योग संबंध"
          )}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {tl(
            language,
            "استعراض الوظائف والفرص التدريبية المعتمدة في سوق العمل المتوافقة مع تخصصات خريجي الجامعة.",
            "Active corporate job listings and training programs aligned with university degrees.",
            "विश्वविद्यालय की डिग्रियों के अनुरूप सक्रिय कॉर्पोरेट नौकरियां और प्रशिक्षण कार्यक्रम।"
          )}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="rounded-3xl border border-border bg-card/85 p-4 md:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "right-3.5" : "left-3.5"
              } w-4 h-4 text-muted-foreground`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tl(
                language,
                "ابحث بالمسمى الوظيفي، اسم الشركة، أو المهارات المطلوبة...",
                "Search by job title, company name, skills...",
                "नौकरी का शीर्षक, कंपनी का नाम या कौशल द्वारा खोजें..."
              )}
              className={`w-full ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 rounded-2xl border border-border bg-background text-white text-xs placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors`}
            />
          </div>

          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="w-full md:w-52 px-3 py-2.5 rounded-2xl border border-border bg-background text-white text-xs focus:border-secondary focus:outline-none transition-colors"
          >
            <option value="">
              {tl(language, "جميع أنماط العمل", "All Work Types", "सभी कार्य प्रकार")}
            </option>
            <option value="دوام كامل">
              {tl(language, "دوام كامل", "Full Time", "पूर्णकालिक")}
            </option>
            <option value="دوام جزئي">
              {tl(language, "دوام جزئي", "Part Time", "अंशकालिक")}
            </option>
            <option value="عن بعد">
              {tl(language, "عن بعد", "Remote", "रिमोट")}
            </option>
            <option value="تدريب تعاوني">
              {tl(
                language,
                "تدريب تعاوني / صيفي",
                "Co-op / Internship",
                "को-ऑप / ग्रीष्मकालीन इंटर्नशिप"
              )}
            </option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card/85 p-5 backdrop-blur-xl shadow-xl transition-all hover:border-primary/40"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-white font-bold text-xs">
                      {opp.company_logo ? (
                        <img
                          src={
                            opp.company_logo.startsWith("http")
                              ? opp.company_logo
                              : `/${opp.company_logo}`
                          }
                          alt={opp.company_name}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        opp.company_name.charAt(0)
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-secondary" />
                        <span>{opp.company_name}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {opp.location && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-background/60 px-2 py-1">
                      <MapPin className="w-3 h-3 text-secondary" />
                      <span>{opp.location}</span>
                    </span>
                  )}
                  {opp.work_type && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-background/60 px-2 py-1">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>{opp.work_type}</span>
                    </span>
                  )}
                  {opp.salary_range && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-background/60 px-2 py-1 text-emerald-400 font-semibold">
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
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-primary/10 text-secondary border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {opp.date_posted ? opp.date_posted.split("T")[0] : ""}
                </span>

                <a
                  href={`/jobs/${opp.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-white transition-colors"
                >
                  <span>
                    {tl(
                      language,
                      "تفاصيل الفرصة",
                      "Opportunity Details",
                      "अवसर का विवरण"
                    )}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/85 p-12 text-center backdrop-blur-xl shadow-xl">
          <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-bold text-white">
            {tl(
              language,
              "لا توجد فرص وظيفية نشطة متوافقة حالياً",
              "No active matching opportunities",
              "वर्तमान में कोई सक्रिय मिलान अवसर नहीं हैं"
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {tl(
              language,
              "سيتم استعراض الشواغر الوظيفية وبرامج التدريب عند قيام الشركات بنشر فرص جديدة.",
              "New corporate job postings and training programs will automatically appear here.",
              "जब कंपनियां नए अवसर प्रकाशित करेंगी तो नौकरी के रिक्त पद और प्रशिक्षण कार्यक्रम यहां दिखाई देंगे।"
            )}
          </p>
        </div>
      )}
    </div>
  )
}
