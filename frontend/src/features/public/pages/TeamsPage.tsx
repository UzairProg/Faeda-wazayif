/**
 * features/public/pages/TeamsPage.tsx
 *
 * Public Team Marketplace page.
 * Implements Faeda's strategic differentiator: "Hire capabilities, not just individuals."
 * Features visual capability comparison, desktop Two-Pane split discovery (List + Live Preview),
 * search with debounced autocomplete, URL query sync, and responsive RTL layout.
 */
import { useMemo, useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
  Users, Sparkles, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft, User, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useTeams } from "@/features/teams/hooks/useTeams"
import { TeamRow } from "@/features/teams/components/TeamRow"
import { TeamPreview } from "@/features/teams/components/TeamPreview"
import { TeamSearch } from "@/features/teams/components/TeamSearch"
import { TeamFilters } from "@/features/teams/components/TeamFilters"
import { TeamRowSkeleton } from "@/features/teams/components/TeamSkeleton"
import { ROUTES } from "@/config/routes"

export function TeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""
  const page = parseInt(searchParams.get("page") || "1", 10)

  const filter = useMemo(
    () => ({
      query,
      location,
      page,
      pageSize: 10,
    }),
    [query, location, page]
  )

  const { data, isLoading, error, refetch } = useTeams(filter)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const teamList = data?.teams ?? []

  // Auto-select first team for desktop live preview
  useEffect(() => {
    if (teamList.length > 0 && (!selectedTeamId || !teamList.find((t) => t.id === selectedTeamId))) {
      setSelectedTeamId(teamList[0].id)
    }
  }, [teamList, selectedTeamId])

  const selectedTeam = teamList.find((t) => t.id === selectedTeamId) || teamList[0] || null

  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        next.delete(key)
      } else {
        next.set(key, val)
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
    updateUrlParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* 01. COMPACT HERO */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Users className="w-4 h-4" />
            <span>منظومة الفرق التخصصية</span>
          </div>

          <h1 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            فرق جاهزة لقدراتك القادمة <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
              استقطب قدرة متكاملة، لا مجرد تخصص فردي
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            بدلاً من البحث عن أربعة تخصصات منفصلة وتجميعها بنفسك، اكتشف فرقاً تغطي كافة المهارات التي يحتاجها مشروعك.
          </p>
        </div>

        {/* 02. CORE DIFFERENTIATOR VISUAL COMPARISON */}
        <GlassCard className="p-6 sm:p-8 bg-card/40 backdrop-blur-md border-white/10 mb-10 text-start shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-4">
            <Zap className="w-4 h-4" />
            <span>لماذا منظومة الفرق التخصصية؟</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Individual Hire Box */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                <User className="w-4 h-4" />
                <span>التوظيف الفردي التقليدي</span>
              </div>
              <h4 className="text-base font-extrabold font-heading text-white">تغطية تخصصية واحدة</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs">Frontend</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs opacity-50">Backend (مفقود)</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs opacity-50">UI/UX (مفقود)</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                يتطلب منك إدارة التنسيق وتجميع الأفراد بنفسك.
              </p>
            </div>

            {/* Integrated Team Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 space-y-3 relative">
              <div className="flex items-center gap-2 text-primary text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>فريق متكامل الأبعاد من فائدة</span>
              </div>
              <h4 className="text-base font-extrabold font-heading text-white">تغطية قدرات شاملة وجاهزة</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold">✓ Frontend</span>
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold">✓ Backend</span>
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold">✓ AI / ML</span>
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold">✓ UI/UX Design</span>
              </div>
              <p className="text-xs text-white/80 pt-1">
                فريق منسجم يملك خبرات تراكمية مشتركة وجاهزية فورية للتنفيذ.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* 03. DISCOVERY SEARCH & FILTERS */}
        <div className="space-y-4 mb-10">
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

        {/* 04. MARKETPLACE DIRECTORY (Two-Pane Desktop / 1-Col Mobile) */}
        <div className="space-y-4 mb-10">
          {/* Results Count Header */}
          <div className="flex items-center justify-between px-2 text-xs sm:text-sm text-muted-foreground font-semibold">
            <span>
              {isLoading
                ? "جارٍ تحميل الفرق..."
                : data
                ? `عرض ${data.teams.length} من أصل ${data.total} فريق تخصصي`
                : "النتائج"}
            </span>

            {query && (
              <span className="text-white font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                البحث: "{query}"
              </span>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="space-y-4">
              <TeamRowSkeleton />
              <TeamRowSkeleton />
              <TeamRowSkeleton />
            </div>
          ) : error ? (
            /* Error State */
            <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-4 my-8">
              <p className="text-xl font-bold text-white">تعذر تحميل سوق الفرق</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                حدثت مشكلة أثناء الاتصال بالخادم. يرجى التأكد من اتصال الشبكة والمحاولة مرة أخرى.
              </p>
              <Button
                onClick={() => refetch()}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white font-bold gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </Button>
            </GlassCard>
          ) : teamList.length > 0 ? (
            /* TWO-PANE LAYOUT: Directory List (Left 7 cols) + Sticky Live Preview (Right 5 cols) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Directory List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {teamList.map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    isSelected={selectedTeam?.id === team.id}
                    onSelect={() => setSelectedTeamId(team.id)}
                  />
                ))}
              </div>

              {/* Sticky Desktop Live Preview Panel (5 cols) */}
              <div className="hidden lg:block lg:col-span-5">
                <TeamPreview team={selectedTeam} />
              </div>

            </div>
          ) : (
            /* Empty Marketplace State */
            <GlassCard className="p-12 text-center bg-card/40 border-white/10 space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto mb-2">
                <Users className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-2xl font-extrabold font-heading text-white">لا توجد فرق منشورة بعد</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                ستظهر الفرق هنا عندما تُنشر ملفاتها العامة في المنظومة. يمكنك تصفح الفرص والوظائف المتاحة حالياً.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  onClick={handleResetFilters}
                  className="rounded-xl px-6 bg-primary/20 hover:bg-primary border border-primary/30 text-white font-bold text-xs sm:text-sm"
                >
                  مسح جميع الفلاتر
                </Button>
                <Link to={ROUTES.JOBS.LIST}>
                  <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                    تصفح جميع الوظائف
                  </Button>
                </Link>
              </div>
            </GlassCard>
          )}
        </div>

        {/* 05. PAGINATION */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.page - 1)}
              disabled={data.page <= 1}
              className="rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </Button>

            <div className="flex items-center gap-1.5 px-3">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                    p === data.page
                      ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/40"
                      : "bg-white/5 text-muted-foreground border border-white/5 hover:text-white hover:bg-white/10"
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
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 06. COMPACT EMPLOYER / CANDIDATE FOOTER CALLOUT */}
        <GlassCard className="p-8 sm:p-10 bg-gradient-to-r from-primary/10 via-card to-card border-primary/20 text-start flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>أصحاب العمل والشركات</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mb-1">
              تحتاج أكثر من تخصص واحد لإنجاز مشروعك؟
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              استكشف الفرق التخصصية بالمنظومة أو انشر فرصتك ليتقدم لها فريق متكامل بأكمله.
            </p>
          </div>

          <Link to={ROUTES.JOBS.LIST} className="shrink-0">
            <Button size="lg" className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20">
              <span>تصفح الفرص المتاحة</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </GlassCard>

      </div>
    </div>
  )
}
