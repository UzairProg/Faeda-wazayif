import React, { useState } from "react"
import { Search, UserPlus, X, Loader2, Check, Sparkles, MapPin, Briefcase } from "lucide-react"
import { useCandidateTeamActions } from "../../hooks/useCandidateTeamActions"
import type { CandidateSearchItem, CandidateSearchResponse } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"

interface TeamMemberSearchModalProps {
  isOpen: boolean
  teamId: string | number
  teamName: string
  onClose: () => void
  onSuccess?: () => void
  isRtl?: boolean
}

export const TeamMemberSearchModal: React.FC<TeamMemberSearchModalProps> = ({
  isOpen,
  teamId,
  teamName,
  onClose,
  onSuccess,
  isRtl = true,
}) => {
  const { inviteMemberMutation } = useCandidateTeamActions(teamId)

  const [query, setQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<CandidateSearchItem[]>([])
  const [selectedCand, setSelectedCand] = useState<CandidateSearchItem | null>(null)
  const [roleText, setRoleText] = useState("عضو متخصص")
  const [messageText, setMessageText] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSearching(true)
    setErrorMsg(null)
    try {
      const res: CandidateSearchResponse = await candidateService.searchCandidatesForTeams({
        q: query.trim(),
        skill: skillFilter.trim(),
        team_id: Number(teamId),
      })
      setSearchResults(res.candidates || [])
    } catch (err: any) {
      setErrorMsg(isRtl ? "تعذر البحث عن المرشحين" : "Failed to search candidates")
    } finally {
      setSearching(false)
    }
  }

  const handleSendInvite = async () => {
    if (!selectedCand) return
    setErrorMsg(null)
    try {
      const res = await inviteMemberMutation.mutateAsync({
        id: teamId,
        payload: {
          candidateId: selectedCand.id,
          role: roleText.trim() || "عضو متخصص",
          message: messageText.trim() || `يدعوك فريق ${teamName} للانضمام كـ ${roleText}`,
        },
      })
      if (res.success) {
        setSuccessMsg(res.message || (isRtl ? "تم إرسال الدعوة بنجاح" : "Invitation sent successfully"))
        setSelectedCand(null)
        // Remove invited from search results
        setSearchResults((prev) => prev.filter((c) => c.id !== selectedCand.id))
        onSuccess?.()
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (isRtl ? "تعذر إرسال الدعوة" : "Failed to send invitation")
      setErrorMsg(msg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRtl ? "دعوة أعضاء وإكمال قدرات الفريق" : "Invite Members & Form Capabilities"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? `ابحث عن كفاءات متخصصة لدعوتهم إلى ${teamName}`
                  : `Find complementary candidates to invite to ${teamName}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
              {successMsg}
            </div>
          )}

          {/* Search Inputs */}
          <form onSubmit={handleSearch} className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
            <div className="relative sm:col-span-6">
              <Search className={`absolute top-3 h-4 w-4 text-slate-400 ${isRtl ? "right-3.5" : "left-3.5"}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isRtl ? "ابحث بالاسم أو المسمى الوظيفي..." : "Search by name or headline..."}
                className={`w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none ${isRtl ? "pr-9 pl-3.5" : "pl-9 pr-3.5"}`}
              />
            </div>

            <div className="sm:col-span-4">
              <input
                type="text"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                placeholder={isRtl ? "المهارة (مثال: React, Python)..." : "Skill (e.g. React)..."}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={searching}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>{isRtl ? "بحث" : "Find"}</span>
              </button>
            </div>
          </form>

          {/* Invitation Configuration Drawer (If candidate selected) */}
          {selectedCand && (
            <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 animate-in fade-in">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  {isRtl ? `إرسال دعوة للمرشح: ${selectedCand.name}` : `Invite: ${selectedCand.name}`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCand(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {isRtl ? "إلغاء التحديد" : "Cancel"}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {isRtl ? "الدور المقترح في الفريق *" : "Proposed Role in Team *"}
                  </label>
                  <input
                    type="text"
                    value={roleText}
                    onChange={(e) => setRoleText(e.target.value)}
                    placeholder={isRtl ? "مثال: كبير مطوري الواجهات (Lead Frontend)" : "e.g. Lead Frontend Engineer"}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    {isRtl ? "رسالة مخصصة مع الدعوة (اختياري)" : "Custom Invitation Message (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={
                      isRtl
                        ? `مرحباً ${selectedCand.name}، يسعدنا انضمامك لفريق ${teamName} للعمل سوياً على مشاريعنا.`
                        : `Hi ${selectedCand.name}, we would love to have you join ${teamName}.`
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={inviteMemberMutation.isPending}
                    onClick={handleSendInvite}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                  >
                    {inviteMemberMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>{isRtl ? "إرسال الدعوة الآن" : "Send Invitation"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
            {searchResults.length > 0 ? (
              searchResults.map((cand) => (
                <div
                  key={cand.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/60 p-3 transition-colors hover:border-slate-600 hover:bg-slate-800/90"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-sm font-bold text-white">
                      {cand.avatarUrl ? (
                        <img
                          src={cand.avatarUrl}
                          alt={cand.name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        cand.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{cand.name}</h4>
                      <p className="line-clamp-1 text-xs text-emerald-400">{cand.headline}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        {cand.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {cand.location}
                          </span>
                        )}
                        {cand.experience && (
                          <span className="flex items-center gap-0.5">
                            <Briefcase className="h-3 w-3" />
                            {cand.experience}
                          </span>
                        )}
                      </div>
                      {cand.skills && cand.skills.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {cand.skills.slice(0, 4).map((s, i) => (
                            <span
                              key={i}
                              className="rounded border border-slate-700 bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCand(cand)
                      setRoleText(cand.specialization || "عضو متخصص")
                      setSuccessMsg(null)
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{isRtl ? "دعوة" : "Invite"}</span>
                  </button>
                </div>
              ))
            ) : searching ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-400" />
                <p className="mt-2 text-xs">{isRtl ? "جاري البحث في قاعدة الكفاءات..." : "Searching candidate talent pool..."}</p>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Sparkles className="mx-auto h-8 w-8 text-slate-600" />
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {isRtl
                    ? "ابحث عن المهارات التكميلية (مثل: Backend, React, UI/UX, AI) لدعوة أفضل الكفاءات"
                    : "Search complementary skills to discover and invite candidates"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
