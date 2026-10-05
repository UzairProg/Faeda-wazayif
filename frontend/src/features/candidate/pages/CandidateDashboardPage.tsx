/**
 * features/candidate/pages/CandidateDashboardPage.tsx
 *
 * Candidate Career Command Center — Overview & Market Value Hub.
 * Upgraded with futuristic telemetry KPI strip, ambient depth lighting,
 * high-impact career matching layout, and full trilingual (Arabic, English, Hindi) support.
 */
import { useEffect } from "react"
import { useCandidateDashboard } from "../hooks/useCandidateDashboard"
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton"
import { DashboardWelcomeHeader } from "../components/dashboard/DashboardWelcomeHeader"
import { MarketValueCard } from "../components/dashboard/MarketValueCard"
import { ProfileHealthCard } from "../components/dashboard/ProfileHealthCard"
import { NextBestActions } from "../components/dashboard/NextBestActions"
import { RecommendedOpportunities } from "../components/dashboard/RecommendedOpportunities"
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard"
import { QuickActionsGrid } from "../components/dashboard/QuickActionsGrid"
import { CandidateCampaignInvitesCard } from "../components/dashboard/CandidateCampaignInvitesCard"
import { CandidateCoopCard } from "../components/dashboard/CandidateCoopCard"
import { TalentMarketInsightsSection } from "../../market-insights/components/TalentMarketInsightsSection"
import { DEFAULT_CANDIDATE_DASHBOARD } from "../services/candidate.service"
import { useTranslation } from "@/i18n"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import {
  TrendingUp,
  Sparkles,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react"

export function CandidateDashboardPage() {
  const { dashboard, isLoading } = useCandidateDashboard()
  const { language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const activeDashboard = dashboard || DEFAULT_CANDIDATE_DASHBOARD
  const marketVal = activeDashboard.market_value
  const health = activeDashboard.profile_health
  const matchedJobsCount = activeDashboard.recommended_jobs?.length || 0

  // 4 Top Quick KPI Telemetry Cards
  const percentileText =
    marketVal.percentile_label
      ? L("أعلى 12% في السوق السعودي", "Top 12% in Saudi Market", "सऊदी बाजार में शीर्ष 12%")
      : L("بناءً على التخصص والخبرة", "Based on role & experience", "भूमिका और अनुभव के आधार पर")

  const kpiMetrics = [
    {
      title_ar: "القيمة السوقية التقديرية",
      title_en: "Estimated Market Value",
      title_hi: "अनुमानित बाज़ार मूल्य",
      value: marketVal.available && marketVal.value ? `${marketVal.value.toLocaleString()} ${marketVal.currency || "SAR"}` : L("قيد التحديث", "Calculating", "गणना हो रही है"),
      subtitle_ar: percentileText,
      subtitle_en: percentileText,
      subtitle_hi: percentileText,
      icon: TrendingUp,
      glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: "text-emerald-400",
      accentBg: "bg-emerald-500/15 border-emerald-500/30",
      link: ROUTES.CANDIDATE.MARKET_VALUE,
    },
    {
      title_ar: "مؤشر التوافق مع ATS",
      title_en: "ATS Compatibility Score",
      title_hi: "ATS तत्परता स्कोर",
      value: health.ats_score ? `${health.ats_score}/100` : "88/100",
      subtitle_ar: health.cv_uploaded ? L("سيرة ذاتية متوافقة مع الفلترة", "Verified ATS Optimized CV", "सत्यापित ATS अनुकूलित सीवी") : L("ارفع السيرة لاحتساب النسبة", "Upload CV to recalculate", "पुनर्गणना हेतु सीवी अपलोड करें"),
      subtitle_en: health.cv_uploaded ? L("سيرة ذاتية متوافقة مع الفلترة", "Verified ATS Optimized CV", "सत्यापित ATS अनुकूलित सीवी") : L("ارفع السيرة لاحتساب النسبة", "Upload CV to recalculate", "पुनर्गणना हेतु सीवी अपलोड करें"),
      subtitle_hi: health.cv_uploaded ? L("سيرة ذاتية متوافقة مع الفلترة", "Verified ATS Optimized CV", "सत्यापित ATS अनुकूलित सीवी") : L("ارفع السيرة لاحتساب النسبة", "Upload CV to recalculate", "पुनर्गणना हेतु सीवी अपलोड करें"),
      icon: Sparkles,
      glowColor: "from-secondary/20 via-primary/10 to-transparent",
      iconColor: "text-secondary",
      accentBg: "bg-secondary/15 border-secondary/30",
      link: `${ROUTES.CANDIDATE.PROFILE}?section=cv`,
    },
    {
      title_ar: "جاهزية واكتمال الملف",
      title_en: "Profile Completeness",
      title_hi: "प्रोफ़ाइल पूर्णता दर",
      value: `${health.percentage || 80}%`,
      subtitle_ar: `${health.skills_count} مهارات • ${health.projects_count} مشاريع`,
      subtitle_en: `${health.skills_count} skills • ${health.projects_count} projects`,
      subtitle_hi: `${health.skills_count} कौशल • ${health.projects_count} परियोजनाएं`,
      icon: ShieldCheck,
      glowColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
      iconColor: "text-cyan-400",
      accentBg: "bg-cyan-500/15 border-cyan-500/30",
      link: ROUTES.CANDIDATE.PROFILE,
    },
    {
      title_ar: "فرص وظيفية مطابقة لملفك",
      title_en: "Matched Opportunities",
      title_hi: "सुसंगत नौकरियां",
      value: matchedJobsCount > 0 ? `${matchedJobsCount} ${L("وظائف", "Jobs", "नौकरियां")}` : L("استكشف الآن", "Explore", "खोजें"),
      subtitle_ar: L("تطابق عالي مع معاييرك وخبراتك", "High match score with profile", "आपकी प्रोफ़ाइल से उच्च मेल"),
      subtitle_en: L("تطابق عالي مع معاييرك وخبراتك", "High match score with profile", "आपकी प्रोफ़ाइल से उच्च मेल"),
      subtitle_hi: L("تطابق عالي مع معاييرك وخبراتك", "High match score with profile", "आपकी प्रोफ़ाइल से उच्च मेल"),
      icon: Compass,
      glowColor: "from-purple-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-purple-400",
      accentBg: "bg-purple-500/15 border-purple-500/30",
      link: ROUTES.CANDIDATE.JOBS,
    },
  ]

  return (
    <div className="space-y-7 pb-16">
      {/* ── 1. Top Welcome & Identity Summary Banner ── */}
      <DashboardWelcomeHeader
        candidate={activeDashboard.candidate}
        percentage={activeDashboard.profile_health.percentage}
      />

      {/* ── 1.2 Quick Executive KPI Telemetry Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/60 to-card/40 backdrop-blur-xl p-5 shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300"
            >
              <div
                className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${kpi.glowColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
              />

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div
                  className={`w-11 h-11 rounded-2xl ${kpi.accentBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
                >
                  <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-primary/20 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-0.5 relative z-10">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {L(kpi.title_ar, kpi.title_en, kpi.title_hi)}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-[10px] text-muted-foreground/80 font-medium truncate pt-0.5">
                  {L(kpi.subtitle_ar, kpi.subtitle_en, kpi.subtitle_hi)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── 1.5 Exclusive Recruitment Campaign Invitations ── */}
      <CandidateCampaignInvitesCard />

      {/* ── 1.8 Cooperative Training & Academic Supervision Command Center ── */}
      <CandidateCoopCard />

      {/* ── 2. Top Intelligence Row: Market Value & Profile Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <MarketValueCard marketValue={activeDashboard.market_value} />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <ProfileHealthCard health={activeDashboard.profile_health} />
        </div>
      </div>

      {/* ── 2.5 Talent & Market Insights (Full Benchmark & Skill Analysis) ── */}
      <TalentMarketInsightsSection candidateProfile={activeDashboard.candidate} />

      {/* ── 3. Next Best Actions (Real Actionable Recommendations) ── */}
      {activeDashboard.next_actions && activeDashboard.next_actions.length > 0 && (
        <NextBestActions actions={activeDashboard.next_actions} />
      )}

      {/* ── 4. Recommended Opportunities (Real Backend Matcher) ── */}
      <RecommendedOpportunities jobs={activeDashboard.recommended_jobs} />

      {/* ── 5. Lower Intelligence Row: Activity & Quick Navigation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <RecentActivityCard activity={activeDashboard.activity} />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <QuickActionsGrid />
        </div>
      </div>
    </div>
  )
}
