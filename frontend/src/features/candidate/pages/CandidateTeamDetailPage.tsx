import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Users,
  Crown,
  Shield,
  UserPlus,
  Settings,
  Trash2,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Briefcase,
  Layers,
  AlertTriangle,
  Loader2,
  Mail,
  X,
} from "lucide-react"
import { useCandidateTeamDetail } from "../hooks/useCandidateTeamDetail"
import { useCandidateTeamActions } from "../hooks/useCandidateTeamActions"
import { TeamMemberCard } from "../components/teams/TeamMemberCard"
import { TeamCapabilityMatrix } from "../components/teams/TeamCapabilityMatrix"
import { TeamOpportunitiesList } from "../components/teams/TeamOpportunitiesList"
import { EditTeamModal } from "../components/teams/EditTeamModal"
import { TeamMemberSearchModal } from "../components/teams/TeamMemberSearchModal"
import type { TeamCapabilityGap, TeamMember, PendingInvitationItem } from "../types/candidate.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export const CandidateTeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isRTL: isRtl } = useTranslation()

  const { data: team, isLoading, isError } = useCandidateTeamDetail(id)
  const { deleteTeamMutation, leaveTeamMutation, cancelInvitationMutation } =
    useCandidateTeamActions(id)

  const [activeTab, setActiveTab] = useState<"members" | "capabilities" | "opportunities" | "about">("members")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [showDisbandConfirm, setShowDisbandConfirm] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (isError || !team) {
    return (
      <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-12 text-center backdrop-blur-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-400" />
        <h3 className="mt-4 text-lg font-bold text-white">
          {isRtl ? "لم يتم العثور على الفريق" : "Team Not Found"}
        </h3>
        <p className="mt-2 text-xs text-slate-400">
          {isRtl ? "الفريق غير موجود أو قد تم حله مسبقاً." : "This team does not exist or was deleted."}
        </p>
        <div className="mt-6">
          <Link
            to={ROUTES.CANDIDATE.TEAMS}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            <ChevronRight className={`h-4 w-4 ${!isRtl ? "rotate-180" : ""}`} />
            <span>{isRtl ? "العودة لقائمة الفرق" : "Back to Teams"}</span>
          </Link>
        </div>
      </div>
    )
  }

  const handleDisband = async () => {
    try {
      await deleteTeamMutation.mutateAsync(team.id)
      setShowDisbandConfirm(false)
      navigate(ROUTES.CANDIDATE.TEAMS)
    } catch (err) {
      // Error handled
    }
  }

  const handleLeave = async () => {
    try {
      await leaveTeamMutation.mutateAsync(team.id)
      setShowLeaveConfirm(false)
      navigate(ROUTES.CANDIDATE.TEAMS)
    } catch (err) {
      // Error handled
    }
  }

  const handleFindTalentForGap = (_gap: TeamCapabilityGap) => {
    setIsInviteOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to={ROUTES.CANDIDATE.TEAMS} className="transition-colors hover:text-emerald-400">
          {isRtl ? "الفرق المهنية" : "Teams"}
        </Link>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-white">{team.name}</span>
      </div>

      {/* 2. Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-800 text-2xl font-bold text-white shadow-xl">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 text-2xl font-bold text-white">
                  {team.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-white md:text-3xl">{team.name}</h1>
                {team.isOwner ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                    <Crown className="h-3.5 w-3.5" />
                    {isRtl ? "أنت قائد ومؤسس الفريق" : "Team Founder"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-400">
                    <Shield className="h-3.5 w-3.5" />
                    {isRtl ? "أنت عضو في هذا الفريق" : "Team Member"}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm font-medium text-emerald-400">
                {team.specialization}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />
                  {team.memberCount} {isRtl ? "أعضاء متخصصين" : "members"}
                </span>
                {team.generalProgram && (
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-300">
                    {team.generalProgram}
                  </span>
                )}
                {team.creationDate && (
                  <span>
                    {isRtl ? "تاريخ التأسيس: " : "Founded: "}
                    {new Date(team.creationDate).toLocaleDateString("ar-SA")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {team.isOwner ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isRtl ? "دعوة عضو جديد" : "Invite Member"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{isRtl ? "تعديل البيانات" : "Edit"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDisbandConfirm(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isRtl ? "حل الفريق" : "Disband"}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>{isRtl ? "مغادرة الفريق" : "Leave Team"}</span>
              </button>
            )}

            <Link
              to={ROUTES.TEAMS.DETAIL(team.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{isRtl ? "الملف العام" : "Public Profile"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-700/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "members"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isRtl ? "أعضاء الفريق والأدوار" : "Members & Roles"}</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">
              {team.members?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("capabilities")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "capabilities"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isRtl ? "مصفوفة القدرات المجمعة" : "Capability Matrix"}</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">
              {team.capabilities?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("opportunities")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "opportunities"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{isRtl ? "الفرص المتطابقة" : "Opportunities"}</span>
            {team.opportunities && team.opportunities.length > 0 && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {team.opportunities.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === "about"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{isRtl ? "عن الفريق والرؤية" : "About & Vision"}</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Contents */}

      {/* Tab 1: Members */}
      {activeTab === "members" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {team.members &&
              team.members.map((member: TeamMember) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  teamId={team.id}
                  isOwnerOfTeam={team.isOwner}
                  isRtl={isRtl}
                />
              ))}
          </div>

          {/* Pending Sent Invitations (Owner View) */}
          {team.isOwner && team.pendingInvitations && team.pendingInvitations.length > 0 && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-5 backdrop-blur-md">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>{isRtl ? "الدعوات المرسلة بانتظار موافقة المرشحين:" : "Pending Invitations Sent:"}</span>
              </div>
              <div className="space-y-2">
                {team.pendingInvitations.map((inv: PendingInvitationItem) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-white">
                        {inv.candidateName?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{inv.candidateName}</span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-amber-400">
                            {inv.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{inv.candidateHeadline}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={cancelInvitationMutation.isPending}
                      onClick={() => cancelInvitationMutation.mutate(inv.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                      <span>{isRtl ? "إلغاء الدعوة" : "Cancel"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Capabilities Matrix */}
      {activeTab === "capabilities" && (
        <TeamCapabilityMatrix
          team={team}
          onFindTalentForGap={handleFindTalentForGap}
          isOwnerOfTeam={team.isOwner}
          isRtl={isRtl}
        />
      )}

      {/* Tab 3: Opportunities */}
      {activeTab === "opportunities" && (
        <TeamOpportunitiesList opportunities={team.opportunities} isRtl={isRtl} />
      )}

      {/* Tab 4: About & Vision */}
      {activeTab === "about" && (
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white">
            {isRtl ? "رؤية الفريق وأهدافه" : "Team Vision & Goals"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {team.about || (isRtl ? "لم تتم إضافة نبذة مفصلة عن الفريق بعد." : "No detailed description added yet.")}
          </p>

          {team.achievements && (
            <div className="mt-6 border-t border-slate-700/50 pt-5">
              <h4 className="text-xs font-bold text-emerald-400">
                {isRtl ? "أبرز الإنجازات والمشاريع المنجزة:" : "Key Achievements & Projects:"}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {team.achievements}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <EditTeamModal
        isOpen={isEditOpen}
        team={team}
        onClose={() => setIsEditOpen(false)}
        isRtl={isRtl}
      />

      <TeamMemberSearchModal
        isOpen={isInviteOpen}
        teamId={team.id}
        teamName={team.name}
        onClose={() => setIsInviteOpen(false)}
        isRtl={isRtl}
      />

      {/* Disband Confirmation Dialog */}
      {showDisbandConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl" dir={isRtl ? "rtl" : "ltr"}>
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-bold text-white">
                {isRtl ? "تأكيد حل الفريق" : "Confirm Disband Team"}
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {isRtl
                ? "هل أنت متأكد من رغبتك في حل هذا الفريق نهائياً؟ سيتم إلغاء عضويات جميع الأعضاء وحذف مساحة عمل الفريق."
                : "Are you sure you want to permanently disband this team?"}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDisbandConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={deleteTeamMutation.isPending}
                onClick={handleDisband}
                className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleteTeamMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>{isRtl ? "تأكيد الحل" : "Confirm Disband"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Team Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl" dir={isRtl ? "rtl" : "ltr"}>
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-bold text-white">
                {isRtl ? "تأكيد مغادرة الفريق" : "Confirm Leave Team"}
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {isRtl
                ? "هل أنت متأكد من رغبتك في مغادرة الفريق؟"
                : "Are you sure you want to leave this team?"}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={leaveTeamMutation.isPending}
                onClick={handleLeave}
                className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {leaveTeamMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>{isRtl ? "مغادرة الفريق" : "Leave"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
