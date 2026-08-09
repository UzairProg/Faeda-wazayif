/**
 * features/public/pages/TeamsPage.tsx
 *
 * Public Team Marketplace directory page.
 * Two-Pane Split Layout (Directory list + Sticky capability preview).
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Users, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useTeams } from "@/features/teams/hooks/useTeams"
import { TeamRow } from "@/features/teams/components/TeamRow"
import { TeamPreview } from "@/features/teams/components/TeamPreview"
import { TeamSearch } from "@/features/teams/components/TeamSearch"
import { TeamFilters } from "@/features/teams/components/TeamFilters"
import { TeamRowSkeleton } from "@/features/teams/components/TeamSkeleton"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"

export function TeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, language, isRTL } = useTranslation()

  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""
  const capability = searchParams.get("capability") || ""
  const remoteOnly = searchParams.get("remote") === "true"
  const page = parseInt(searchParams.get("page") || "1", 10)

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const filter = useMemo(
    () => ({
      query,
      location,
      capability,
      remoteOnly,
      page,
      pageSize: 10,
    }),
    [query, location, capability, remoteOnly, page]
  )

  const { data, isLoading, error, refetch } = useTeams(filter)

  const teamList = data?.teams ?? []

  useEffect(() => {
    if (teamList.length > 0 && (!selectedTeamId || !teamList.find((t) => t.id === selectedTeamId))) {
      setSelectedTeamId(teamList[0].id)
    }
  }, [teamList, selectedTeamId])

  const selectedTeam = teamList.find((t) => t.id === selectedTeamId) || teamList[0] || null

  const updateUrlParams = (newParams: Record<string, string | number | boolean | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === false) {
        next.delete(key)
      } else {
        next.set(key, String(val))
      }
    })
    if (newParams.page === undefined) {
      next.delete("page")
    }
    setSearchParams(next)
  }

  const handleQueryChange = (q: string) => updateUrlParams({ q })
  const handleLocationChange = (loc: string) => updateUrlParams({ location: loc })
  const handleResetFilters = () => setSearchParams({})

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const PrevChevron = isRTL ? ChevronRight : ChevronLeft
  const NextChevron = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Users className="w-4 h-4" />
            <span>{t("teams.header.badge")}</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            {t("teams.header.title")} <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
              {t("teams.header.subtitle")}
            </span>
          </h1>
        </div>

        {/* Strategic Value Card */}
        <GlassCard className="p-5 sm:p-6 bg-gradient-to-r from-primary/15 via-card to-card border-primary/20 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
            <div className="space-y-1">
              <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider block">
                {t("teams.header.valueComparisonTitle")}
              </span>
              <h2 className="text-lg font-bold text-white">
                {language === "en" ? "Hire capabilities, not just individuals." : "وظّف القدرات، لا الأفراد فقط."}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
                {t("teams.header.hireIndividualLabel")}
              </span>
              <span className="text-primary font-bold">vs</span>
              <span className="px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                {t("teams.header.hireTeamLabel")} ✨
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <TeamSearch
            query={query}
            location={location}
            onQueryChange={handleQueryChange}
            onLocationChange={handleLocationChange}
            onSearch={refetch}
          />

          <TeamFilters
            location={location}
            onLocationChange={handleLocationChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between px-2 text-xs sm:text-sm text-muted-foreground font-semibold mb-4">
          <span>
            {isLoading
              ? t("teams.states.loading")
              : data
              ? t("teams.list.resultsCount", { count: formatLocalizedNumber(data.total, language) })
              : ""}
          </span>
        </div>

        {/* Two-Pane Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Scrollable Team Directory List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <TeamRowSkeleton />
                <TeamRowSkeleton />
                <TeamRowSkeleton />
              </div>
            ) : error ? (
              <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-4 my-4">
                <p className="text-xl font-bold text-white">{t("teams.states.errorTitle")}</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("teams.states.errorSubtitle")}</p>
                <Button onClick={() => refetch()} className="rounded-xl px-6 bg-primary text-white font-bold gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t("teams.states.retryButton")}</span>
                </Button>
              </GlassCard>
            ) : teamList.length > 0 ? (
              teamList.map((team) => (
                <TeamRow
                  key={team.id}
                  team={team}
                  isSelected={selectedTeamId === team.id}
                  onSelect={() => setSelectedTeamId(team.id)}
                />
              ))
            ) : (
              <GlassCard className="p-12 text-center bg-card/40 border-white/10 space-y-4 my-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto mb-2">
                  <Users className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-2xl font-extrabold font-heading text-white">{t("teams.states.emptyTitle")}</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{t("teams.states.emptySubtitle")}</p>
                <div className="pt-2">
                  <Button onClick={handleResetFilters} className="rounded-xl px-6 bg-primary/20 border border-primary/30 text-white font-bold text-xs sm:text-sm">
                    {t("teams.filters.clearAll")}
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.page - 1)}
                  disabled={data.page <= 1}
                  className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
                >
                  <PrevChevron className="w-4 h-4" />
                  <span>{t("common.pagination.previous")}</span>
                </Button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                        p === data.page
                          ? "bg-primary text-white border border-primary/40"
                          : "bg-white/5 text-muted-foreground hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.page + 1)}
                  disabled={data.page >= data.totalPages}
                  className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
                >
                  <span>{t("common.pagination.next")}</span>
                  <NextChevron className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Desktop Capability Preview (5 cols) */}
          <div className="hidden lg:block lg:col-span-5">
            <TeamPreview team={selectedTeam} />
          </div>

        </div>

      </div>
    </div>
  )
}
