import React from "react"
import { Mail, Check, X, Sparkles, Loader2, Clock } from "lucide-react"
import type { ReceivedInvitationItem } from "../../types/candidate.types"
import { useCandidateTeamActions } from "../../hooks/useCandidateTeamActions"

interface TeamInvitationsCardProps {
  invitations: ReceivedInvitationItem[]
  isLoading?: boolean
  isRtl?: boolean
}

export const TeamInvitationsCard: React.FC<TeamInvitationsCardProps> = ({
  invitations,
  isLoading = false,
  isRtl = true,
}) => {
  const { respondInvitationMutation } = useCandidateTeamActions()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      </div>
    )
  }

  if (!invitations || invitations.length === 0) {
    return null
  }

  const handleRespond = (invId: number, action: "accept" | "reject") => {
    respondInvitationMutation.mutate({ invId, action })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-slate-900/90 p-6 shadow-xl backdrop-blur-md">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="mb-4 flex items-center justify-between border-b border-slate-700/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isRtl ? "دعوات الانضمام المعلقة للفرق" : "Pending Team Invitations"}
            </h3>
            <p className="text-xs text-slate-400">
              {isRtl
                ? `لديك ${invitations.length} دعوة للانضمام إلى فرق عمل احترافية`
                : `You have ${invitations.length} invitations to join professional teams`}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
          {invitations.length}
        </span>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-1 md:grid-cols-2">
        {invitations.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col justify-between rounded-xl border border-slate-700/80 bg-slate-800/80 p-4 transition-colors hover:border-slate-600"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-sm font-bold text-white shadow-inner">
                    {inv.teamLogoUrl ? (
                      <img
                        src={inv.teamLogoUrl}
                        alt={inv.teamName}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      inv.teamName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{inv.teamName}</h4>
                    <p className="text-xs font-medium text-emerald-400">
                      {inv.teamSpecialization}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  {inv.role}
                </span>
              </div>

              {inv.message && (
                <div className="mt-3 rounded-lg border border-slate-700/50 bg-slate-900/50 p-2.5 text-xs leading-relaxed text-slate-300">
                  <span className="font-semibold text-slate-400">{inv.inviterName}: </span>
                  &ldquo;{inv.message}&rdquo;
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-700/40 pt-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3 w-3" />
                {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("ar-SA") : ""}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={respondInvitationMutation.isPending}
                  onClick={() => handleRespond(inv.id, "reject")}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{isRtl ? "رفض" : "Decline"}</span>
                </button>
                <button
                  type="button"
                  disabled={respondInvitationMutation.isPending}
                  onClick={() => handleRespond(inv.id, "accept")}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                >
                  {respondInvitationMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{isRtl ? "قبول وانضمام" : "Accept & Join"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
