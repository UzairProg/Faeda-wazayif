import React, { useState } from "react"
import { Crown, Shield, Trash2, Calendar, Briefcase, Loader2, AlertTriangle } from "lucide-react"
import type { TeamMember } from "../../types/candidate.types"
import { useCandidateTeamActions } from "../../hooks/useCandidateTeamActions"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"

interface TeamMemberCardProps {
  member: TeamMember
  teamId: string | number
  isOwnerOfTeam: boolean
  isRtl?: boolean
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  teamId,
  isOwnerOfTeam,
  isRtl = true,
}) => {
  const { removeMemberMutation } = useCandidateTeamActions(teamId)
  const [showConfirmRemove, setShowConfirmRemove] = useState(false)

  const handleRemove = async () => {
    try {
      await removeMemberMutation.mutateAsync({ id: teamId, memberUserId: member.userId })
      setShowConfirmRemove(false)
    } catch (err) {
      // Error handled by mutation
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-600">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 text-base font-bold text-white shadow-inner">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 font-bold text-white">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white">{member.name}</h4>
              {member.isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                  <Crown className="h-3 w-3" />
                  {isRtl ? "مؤسس الفريق" : "Founder"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-400">
                  <Shield className="h-3 w-3" />
                  {isRtl ? "عضو" : "Member"}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-emerald-400">{member.role}</p>
          </div>
        </div>

        {/* Owner Remove Action (Not on self/owner) */}
        {isOwnerOfTeam && !member.isOwner && (
          <button
            type="button"
            onClick={() => setShowConfirmRemove(true)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            title={isRtl ? "استبعاد العضو من الفريق" : "Remove member from team"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        {member.experience && (
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-slate-500" />
            <span>{member.experience}</span>
          </div>
        )}
        {member.joinedAt && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {isRtl ? "انضم: " : "Joined: "}
              {new Date(member.joinedAt).toLocaleDateString("ar-SA")}
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div className="mt-3.5 border-t border-slate-700/50 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {member.skills.slice(0, 6).map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 6 && (
              <span className="rounded-md border border-slate-700/60 bg-slate-800/40 px-1.5 py-0.5 text-[10px] text-slate-400">
                +{member.skills.length - 6}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showConfirmRemove && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
            <div
              className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
              dir={isRtl ? "rtl" : "ltr"}
            >
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-bold text-white">
                {isRtl ? "تأكيد استبعاد العضو" : "Confirm Member Removal"}
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {isRtl
                ? `هل أنت متأكد من رغبتك في إزالة ${member.name} من الفريق؟ سيتم تحديث قدرات الفريق المجمعة فوراً.`
                : `Are you sure you want to remove ${member.name} from the team?`}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmRemove(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={removeMemberMutation.isPending}
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {removeMemberMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>{isRtl ? "تأكيد الإزالة" : "Confirm Remove"}</span>
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>
    )}
    </div>
  )
}
