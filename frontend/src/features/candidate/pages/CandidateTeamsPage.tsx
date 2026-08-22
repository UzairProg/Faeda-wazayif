import React, { useState } from "react"
import { Users, Plus, Sparkles, Shield, Crown, Loader2 } from "lucide-react"
import { useCandidateTeams } from "../hooks/useCandidateTeams"
import { useCandidateTeamInvitations } from "../hooks/useCandidateTeamInvitations"
import { TeamCard } from "../components/teams/TeamCard"
import { TeamInvitationsCard } from "../components/teams/TeamInvitationsCard"
import { CreateTeamModal } from "../components/teams/CreateTeamModal"
import type { CandidateTeamSummary } from "../types/candidate.types"
import { useTranslation } from "@/i18n"

export const CandidateTeamsPage: React.FC = () => {
  const { isRTL: isRtl } = useTranslation()
  const { data: teamsData, isLoading: teamsLoading } = useCandidateTeams()
  const { data: invsData, isLoading: invsLoading } = useCandidateTeamInvitations()

  const [activeTab, setActiveTab] = useState<"all" | "owned" | "joined">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const ownedTeams = teamsData?.ownedTeams || []
  const joinedTeams = teamsData?.joinedTeams || []
  const allTeams: CandidateTeamSummary[] = [...ownedTeams, ...joinedTeams]
  const pendingInvitations = invsData?.invitations || []

  const filteredTeams: CandidateTeamSummary[] =
    activeTab === "owned"
      ? ownedTeams
      : activeTab === "joined"
      ? joinedTeams
      : allTeams

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      {/* 1. Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>{isRtl ? "الفرق المهنية المتكاملة • تيم فائدة" : "Professional Teams • Faeda Teams"}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
              {isRtl ? "إدارة وتأسيس الفرق المهنية" : "Candidate Professional Teams"}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 md:text-sm">
              {isRtl
                ? "كوّن فريق عمل متكامل يجمع بين خبراتك وخبرات الكفاءات الأخرى في المنصة. ادمجوا قدراتكم للمنافسة على عقود ومشاريع كبرى تفوق قدرة العمل الفردي."
                : "Form high-impact squads with complementary capabilities to compete for major enterprise projects."}
            </p>
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-900/50"
          >
            <Plus className="h-4 w-4" />
            <span>{isRtl ? "تأسيس فريق جديد" : "Create New Team"}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-slate-700/50 pt-6 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <span className="text-xs text-slate-400">{isRtl ? "إجمالي الفرق" : "Total Teams"}</span>
            <div className="mt-1 text-2xl font-black text-white">{allTeams.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <span className="text-xs text-slate-400">{isRtl ? "فرق تقودها (مؤسس)" : "Teams Founded"}</span>
            <div className="mt-1 text-2xl font-black text-amber-400">{ownedTeams.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <span className="text-xs text-slate-400">{isRtl ? "فرق منضم إليها" : "Joined Teams"}</span>
            <div className="mt-1 text-2xl font-black text-teal-400">{joinedTeams.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <span className="text-xs text-slate-400">{isRtl ? "دعوات معلقة" : "Pending Invites"}</span>
            <div className="mt-1 text-2xl font-black text-emerald-400">{pendingInvitations.length}</div>
          </div>
        </div>
      </div>

      {/* 2. Received Invitations Card */}
      <TeamInvitationsCard
        invitations={pendingInvitations}
        isLoading={invsLoading}
        isRtl={isRtl}
      />

      {/* 3. Team Filter Tabs & Counter */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex rounded-2xl border border-slate-700/80 bg-slate-900/80 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>{isRtl ? "جميع الفرق" : "All Teams"}</span>
            <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px]">
              {allTeams.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("owned")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "owned"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>{isRtl ? "فرق أقودها" : "Teams I Lead"}</span>
            <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px]">
              {ownedTeams.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("joined")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "joined"
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-teal-400" />
            <span>{isRtl ? "فرق منضم إليها" : "Joined Teams"}</span>
            <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px]">
              {joinedTeams.length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          {isRtl ? `عرض ${filteredTeams.length} فريق` : `Showing ${filteredTeams.length} teams`}
        </span>
      </div>

      {/* 4. Teams Grid / Empty State */}
      {teamsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team: CandidateTeamSummary) => (
            <TeamCard key={team.id} team={team} isRtl={isRtl} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-12 text-center backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            {activeTab === "owned"
              ? isRtl
                ? "لم تقم بتأسيس أي فريق حتى الآن"
                : "You haven't founded any teams yet"
              : activeTab === "joined"
              ? isRtl
                ? "لست عضواً في أي فريق آخر حالياً"
                : "You haven't joined any teams yet"
              : isRtl
              ? "ابدأ بتأسيس فريقك المهني الأول"
              : "Start by creating your first professional team"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400">
            {isRtl
              ? "الفرق المهنية في فائدة تمكنك من دمج قدراتك البرمجية أو التصميمية أو التحليلية مع زملاء متخصصين لبناء ملف مشترك ذو قيمة تسويقية عالية."
              : "Teams allow you to combine capabilities with complementary peers for higher visibility."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:from-emerald-500 hover:to-teal-500"
            >
              <Plus className="h-4 w-4" />
              <span>{isRtl ? "تأسيس فريق الآن" : "Create Team Now"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        isRtl={isRtl}
      />
    </div>
  )
}
