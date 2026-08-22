/**
 * features/candidate/pages/CandidateDashboardPage.tsx
 *
 * Candidate Career Command Center — Overview & Market Value Hub.
 * Connects Candidate Identity → Market Value → Opportunities → Actions.
 */
import { useEffect } from "react"
import { useTranslation } from "@/i18n"
import { useCandidateDashboard } from "../hooks/useCandidateDashboard"
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton"
import { DashboardWelcomeHeader } from "../components/dashboard/DashboardWelcomeHeader"
import { MarketValueCard } from "../components/dashboard/MarketValueCard"
import { ProfileHealthCard } from "../components/dashboard/ProfileHealthCard"
import { NextBestActions } from "../components/dashboard/NextBestActions"
import { RecommendedOpportunities } from "../components/dashboard/RecommendedOpportunities"
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard"
import { QuickActionsGrid } from "../components/dashboard/QuickActionsGrid"
import { AlertCircle, RefreshCw } from "lucide-react"

export function CandidateDashboardPage() {
  const { t } = useTranslation()
  const { dashboard, isLoading, isError, refetch } = useCandidateDashboard()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !dashboard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-heading mb-2">
          {t("candidate.dashboard.errorTitle")}
        </h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          {t("candidate.dashboard.errorDesc")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("candidate.dashboard.retryBtn")}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Top Welcome & Identity Summary Banner ── */}
      <DashboardWelcomeHeader
        candidate={dashboard.candidate}
        percentage={dashboard.profile_health.percentage}
      />

      {/* ── 2. Top Intelligence Row: Market Value & Profile Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <MarketValueCard marketValue={dashboard.market_value} />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <ProfileHealthCard health={dashboard.profile_health} />
        </div>
      </div>

      {/* ── 3. Next Best Actions (Real Actionable Recommendations) ── */}
      {dashboard.next_actions && dashboard.next_actions.length > 0 && (
        <NextBestActions actions={dashboard.next_actions} />
      )}

      {/* ── 4. Recommended Opportunities (Real Backend Matcher) ── */}
      <RecommendedOpportunities jobs={dashboard.recommended_jobs} />

      {/* ── 5. Lower Intelligence Row: Activity & Quick Navigation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <RecentActivityCard activity={dashboard.activity} />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <QuickActionsGrid />
        </div>
      </div>
    </div>
  )
}
