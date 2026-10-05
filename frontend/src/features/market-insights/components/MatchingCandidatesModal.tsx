/**
 * features/market-insights/components/MatchingCandidatesModal.tsx
 *
 * Modal that lets employers inspect available talent matching a selected skill.
 * Protects candidate privacy (contact details obscured).
 */

import React from "react"
import { X, Users, CheckCircle, MapPin, Briefcase, GraduationCap, ExternalLink } from "lucide-react"
import type { MatchingCandidate } from "../types/market-insights.types"
import { Link } from "react-router-dom"

interface MatchingCandidatesModalProps {
  skill: string
  candidates: MatchingCandidate[]
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
}

export const MatchingCandidatesModal: React.FC<MatchingCandidatesModalProps> = ({
  skill,
  candidates,
  isOpen,
  onClose,
  isLoading,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl text-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                Matching Talent: <span className="text-cyan-400">{skill}</span>
              </h3>
              <p className="text-xs text-white/60">Verified candidate pool ready for recruitment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="mt-4 overflow-y-auto space-y-3 pr-1 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-white/50 text-sm">Loading candidates...</div>
          ) : candidates.length === 0 ? (
            <div className="py-12 text-center text-white/50 text-sm">
              No matching profiles found for {skill} currently.
            </div>
          ) : (
            candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={cand.avatar}
                    alt={cand.fullname}
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">{cand.fullname}</h4>
                      {cand.is_verified && (
                        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                        {cand.job_role}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {cand.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                        {cand.educational_qualification}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/company/talent/${cand.id}`}
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-colors"
                  >
                    View Profile
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>Personal contact info is protected under platform privacy policies.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
