import { useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useCompanyTeams } from "../hooks/useCompanyTeams"
import { CompanyTeamCard } from "../components/CompanyTeamCard"
import type { CompanyTeamItem } from "../types/company.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import {
  Layers,
  Search,
  Loader2,
  X,
  CheckCircle2,
  MessageSquare,
} from "lucide-react"

export function CompanyTeamsPage() {
  const { isRTL } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<CompanyTeamItem | null>(null)

  const { data, isLoading, error } = useCompanyTeams({
    q: searchQuery || undefined,
    specialization: specializationFilter || undefined,
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl flex items-center gap-2">
            <Layers className="h-7 w-7 text-emerald-400" />
            <span>{isRTL ? "استكشاف وتوظيف الفرق المهنية" : "Professional Squads & Teams"}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isRTL
              ? "تعاقد مع فرق تقنية ومهنية متكاملة ذات قدرات متناغمة لتسريع تسليم مشاريع منشأتك"
              : "Hire high-performing, cross-functional squads with complementary capabilities"}
          </p>
        </div>
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isRTL ? "البحث في الفرق:" : "Search Squads:"}</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "اسم الفريق، التخصص، أو القدرة..." : "Squad name, skill..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {isRTL ? "التخصص والبرنامج:" : "Specialization:"}
            </label>
            <input
              type="text"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              placeholder={isRTL ? "مثال: تطوير سحابي، ذكاء اصطناعي..." : "e.g. Full-stack, DevOps..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Teams Grid ───────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs font-semibold">
              {isRTL ? "جاري استكشاف الفرق المهنية..." : "Loading Squads..."}
            </span>
          </div>
        </div>
      ) : error || !data ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400 text-xs font-bold">
          {isRTL ? "تعذر تحميل قائمة الفرق" : "Failed to load teams"}
        </div>
      ) : data.teams.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 space-y-3">
          <Layers className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">
            {isRTL ? "لا توجد فرق مهنية مطابقة لمعايير البحث" : "No squads found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL
              ? "جرّب البحث بكلمات عامة أو إزالة الفلاتر لعرض الفرق المهنية المسجلة في المنصة."
              : "Try adjusting your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {data.teams.map((team) => (
            <CompanyTeamCard
              key={team.id}
              team={team}
              onView={(t) => setSelectedTeam(t)}
              isRtl={isRTL}
            />
          ))}
        </div>
      )}

      {/* ── Team Detail Modal for Employers ──────────────────────────── */}
      {selectedTeam && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in" dir={isRTL ? "rtl" : "ltr"}>
            <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTeam(null)}
          />

          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#090e1a] p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-800">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-2xl overflow-hidden shadow-inner">
                  {selectedTeam.logoUrl ? (
                    <img
                      src={selectedTeam.logoUrl}
                      alt={selectedTeam.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Layers className="h-8 w-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedTeam.specialization}
                  </span>
                  <h2 className="text-xl font-bold text-white">{selectedTeam.name}</h2>
                  <p className="text-xs text-slate-400">
                    {selectedTeam.memberCount} {isRTL ? "أعضاء متخصصين" : "squad members"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* About / Achievements */}
            {selectedTeam.about && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isRTL ? "عن الفريق والرؤية" : "About the Squad"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
                  {selectedTeam.about}
                </p>
              </div>
            )}

            {/* Combined Capabilities Matrix */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRTL ? "مصفوفة القدرات المشتركة" : "Capability Matrix"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTeam.capabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Members Roster */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRTL ? "أعضاء الفريق والتشكيلة" : "Squad Members"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl bg-slate-900/60 border border-slate-800 p-3.5"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs overflow-hidden">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        m.name.slice(0, 2)
                      )}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate">{m.name}</span>
                        {m.isVerified && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{m.headline}</p>
                      <span className="text-[10px] text-slate-500">
                        {m.yearsOfExperience} {isRTL ? "خبرة" : "exp"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <Link
                to={`${ROUTES.COMPANY.CHAT}?new=true&type=TEAM_COMPANY&targetId=${selectedTeam.id}&contextType=team&contextId=${selectedTeam.id}&subject=${encodeURIComponent('تواصل مع فريق ' + selectedTeam.name)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isRTL ? "مراسلة الفريق" : "Contact Squad"}</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>
    )}
    </div>
  )
}
