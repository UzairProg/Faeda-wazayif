/**
 * features/company/pages/CompanyCampaignDetailPage.tsx
 *
 * LinkedIn Recruiter-style Talent Pipeline & AI Sourcing Command Board.
 * Features:
 *   - AI Talent Pool with real-time match scoring (65% - 98%)
 *   - 1-Click InMail Outreach modal sending messages to Faeda Chat
 *   - Interactive Kanban Pipeline (Discovered -> Contacted -> Replied -> Interviewing -> Hired)
 *   - Live AI talent re-scan trigger
 */
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Target,
  Users,
  Send,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Loader2,
  X,
  Layers,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { useTranslation } from "@/i18n"
import { campaignsService } from "@/features/campaigns/services/campaigns.service"
import type {
  CampaignCandidate,
  CampaignStage,
} from "@/features/campaigns/types/campaign.types"
import { ROUTES } from "@/config/routes"

const STAGES: { key: CampaignStage; label_ar: string; label_en: string; color: string }[] = [
  { key: "discovered", label_ar: "مكتشفين بالذكاء الاصطناعي", label_en: "AI Discovered", color: "border-slate-500/30 text-slate-300" },
  { key: "contacted", label_ar: "تم التواصل (InMail)", label_en: "Contacted", color: "border-blue-500/30 text-blue-400" },
  { key: "replied", label_ar: "استجابوا بالاهتمام", label_en: "Replied / Interested", color: "border-amber-500/30 text-amber-400" },
  { key: "interviewing", label_ar: "مرحلة المقابلات", label_en: "Interviewing", color: "border-purple-500/30 text-purple-400" },
  { key: "hired", label_ar: "تم التوظيف بنجاح", label_en: "Hired", color: "border-emerald-500/30 text-emerald-400" },
]

export function CompanyCampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const campaignId = Number(id) || 1
  const { language, isRTL } = useTranslation()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<"pool" | "pipeline" | "settings">("pool")
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([])
  const [outreachModalCandidate, setOutreachModalCandidate] = useState<CampaignCandidate | null>(null)
  const [customMessage, setCustomMessage] = useState("")

  // Fetch Campaign Details
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["company", "campaign", campaignId],
    queryFn: () => campaignsService.getCampaignDetail(campaignId),
  })

  // Fetch Candidates in Pipeline
  const { data: candidates = [] } = useQuery({
    queryKey: ["company", "campaign", campaignId, "candidates"],
    queryFn: () => campaignsService.getCampaignCandidates(campaignId),
  })

  // Mutations
  const stageMutation = useMutation({
    mutationFn: ({ candidateId, stage }: { candidateId: number; stage: CampaignStage }) =>
      campaignsService.updateCandidateStage(campaignId, candidateId, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId] })
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId, "candidates"] })
    },
  })

  const scanMutation = useMutation({
    mutationFn: () => campaignsService.runTalentScan(campaignId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId] })
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId, "candidates"] })
      alert(data.message)
    },
  })

  const outreachMutation = useMutation({
    mutationFn: ({ ids, msg }: { ids: number[]; msg?: string }) =>
      campaignsService.sendOutreach(campaignId, ids, msg),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId] })
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId, "candidates"] })
      setOutreachModalCandidate(null)
      setSelectedCandidateIds([])
      alert(data.message)
    },
  })

  const campaign = detailData?.campaign

  const handleSelectAll = () => {
    if (selectedCandidateIds.length === candidates.length) {
      setSelectedCandidateIds([])
    } else {
      setSelectedCandidateIds(candidates.map((c) => c.customer_id))
    }
  }

  const handleToggleSelect = (customerId: number) => {
    if (selectedCandidateIds.includes(customerId)) {
      setSelectedCandidateIds(selectedCandidateIds.filter((id) => id !== customerId))
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, customerId])
    }
  }

  const openSingleOutreachModal = (cand: CampaignCandidate) => {
    setOutreachModalCandidate(cand)
    const template =
      campaign?.outreach_template ||
      `مرحباً ${cand.candidate.fullname}، لفتت انتباهنا خبراتك المتميزة في ${cand.candidate.title || "مجالك"}. يسعدنا دعوتك للانضمام إلى حملتنا الوظيفية.`
    setCustomMessage(template.replace("{{name}}", cand.candidate.fullname).replace("{{role}}", cand.candidate.title || "مجالك"))
  }

  const Arrow = isRTL ? ArrowLeft : ArrowRight

  if (isDetailLoading || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm font-mono">{language === "ar" ? "جاري تحميل تفاصيل الحملة..." : "Loading campaign..."}</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-start">
      
      {/* Top Breadcrumb & Back Link */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to={ROUTES.COMPANY.CAMPAIGNS} className="hover:text-white transition-colors flex items-center gap-1">
          <Arrow className="w-3.5 h-3.5" />
          <span>{language === "ar" ? "العودة لجميع الحملات" : "Back to Campaigns"}</span>
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate">{campaign.title}</span>
      </div>

      {/* Campaign Header Banner Card */}
      <GlassCard className="p-6 sm:p-8 bg-card/60 border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>{campaign.status.toUpperCase()}</span>
              </span>

              {campaign.target_location && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{campaign.target_location}</span>
                </span>
              )}

              {campaign.experience_level && (
                <span className="text-xs text-muted-foreground px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {campaign.experience_level}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {campaign.title}
            </h1>

            {campaign.tagline && (
              <p className="text-sm text-slate-300 max-w-2xl">{campaign.tagline}</p>
            )}

            {/* Target Skills Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                {language === "ar" ? "المهارات المستهدفة:" : "Target Skills:"}
              </span>
              {campaign.target_skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch lg:self-auto justify-end">
            <Button
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold gap-2 text-xs sm:text-sm"
            >
              {scanMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-400" />
              )}
              <span>{language === "ar" ? "إعادة الفرز الذكي (AI Scan)" : "Run AI Talent Scan"}</span>
            </Button>

            {selectedCandidateIds.length > 0 && (
              <Button
                onClick={() =>
                  outreachMutation.mutate({
                    ids: selectedCandidateIds,
                    msg: campaign.outreach_template,
                  })
                }
                disabled={outreachMutation.isPending}
                className="rounded-xl px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold gap-2 shadow-lg shadow-blue-500/20 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>
                  {language === "ar"
                    ? `إرسال دعوة جماعية (${selectedCandidateIds.length})`
                    : `Batch InMail Invite (${selectedCandidateIds.length})`}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Live Pipeline Funnel Counter */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-muted-foreground block mb-0.5">{language === "ar" ? "تم استكشافهم" : "Discovered"}</span>
            <span className="text-xl font-extrabold text-white font-mono">{candidates.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-muted-foreground block mb-0.5">{language === "ar" ? "تم التواصل (InMail)" : "Contacted"}</span>
            <span className="text-xl font-extrabold text-blue-400 font-mono">
              {candidates.filter((c) => c.stage !== "discovered").length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-muted-foreground block mb-0.5">{language === "ar" ? "استجابوا بالاهتمام" : "Replied / Interested"}</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">
              {candidates.filter((c) => ["replied", "interviewing", "hired"].includes(c.stage)).length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-muted-foreground block mb-0.5">{language === "ar" ? "في المقابلات" : "Interviewing"}</span>
            <span className="text-xl font-extrabold text-purple-400 font-mono">
              {candidates.filter((c) => c.stage === "interviewing").length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-muted-foreground block mb-0.5">{language === "ar" ? "تم توظيفهم" : "Hired"}</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {candidates.filter((c) => c.stage === "hired").length}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Tabs Switcher: Pool vs Kanban */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("pool")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "pool"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === "ar" ? "قائمة الكفاءات ونسب المطابقة" : "Talent Pool (AI Match List)"}</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-black/30 font-mono">
            {candidates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("pipeline")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "pipeline"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === "ar" ? "لوحة خط التوظيف (Kanban Board)" : "Pipeline Kanban Board"}</span>
        </button>
      </div>

      {/* ── TAB 1: TALENT POOL LIST VIEW ─────────────────────── */}
      {activeTab === "pool" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={selectedCandidateIds.length === candidates.length && candidates.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span>{language === "ar" ? "تحديد جميع الكفاءات" : "Select all candidates"}</span>
            </label>

            <span>
              {language === "ar"
                ? `مرتبة حسب نسبة المطابقة الذكية بالذكاء الاصطناعي`
                : `Ranked by AI Talent Match Score`}
            </span>
          </div>

          <div className="space-y-3">
            {candidates.map((item) => (
              <GlassCard
                key={item.id}
                className="p-5 bg-card/50 hover:bg-card/70 border-white/10 rounded-2xl transition-all shadow-md relative"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Candidate Profile Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedCandidateIds.includes(item.customer_id)}
                      onChange={() => handleToggleSelect(item.customer_id)}
                      className="w-4 h-4 mt-1.5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-0 cursor-pointer"
                    />

                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-white shrink-0 shadow-inner">
                      {item.candidate.fullname.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          {item.candidate.fullname}
                        </h4>

                        {item.candidate.is_verified && (
                          <span className="inline-flex items-center text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}

                        {/* Match Score Badge */}
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-extrabold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>{item.match_score}% {language === "ar" ? "تطابق" : "Match"}</span>
                        </span>

                        {/* Current Stage Pill */}
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-muted-foreground">
                          {STAGES.find((s) => s.key === item.stage)?.label_en || item.stage}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.candidate.title} • {item.candidate.location} • {item.candidate.years_of_experience}
                      </p>

                      {/* Candidate Skills */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {item.candidate.skills?.slice(0, 6).map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Stage Dropdown */}
                  <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 shrink-0">
                    <select
                      value={item.stage}
                      onChange={(e) =>
                        stageMutation.mutate({
                          candidateId: item.customer_id,
                          stage: e.target.value as CampaignStage,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#0b1322] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {STAGES.map((st) => (
                        <option key={st.key} value={st.key}>
                          {language === "ar" ? st.label_ar : st.label_en}
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={() => openSingleOutreachModal(item)}
                      size="sm"
                      className="rounded-xl px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "دعوة InMail" : "Send InMail"}</span>
                    </Button>

                    <Link to={`/portfolio/${item.candidate.user_id || item.candidate.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-white/10 bg-white/5 text-white text-xs hover:bg-white/10"
                      >
                        {language === "ar" ? "الملف" : "Profile"}
                      </Button>
                    </Link>
                  </div>

                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: KANBAN PIPELINE VIEW ──────────────────────── */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-6">
          {STAGES.map((col) => {
            const colCandidates = candidates.filter((c) => c.stage === col.key)
            return (
              <div key={col.key} className="flex flex-col rounded-2xl bg-card/40 border border-white/10 p-3 min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h4 className="text-xs font-bold text-white truncate">
                    {language === "ar" ? col.label_ar : col.label_en}
                  </h4>
                  <span className="w-5 h-5 rounded-full bg-white/10 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                    {colCandidates.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colCandidates.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-muted-foreground text-xs">
                      {language === "ar" ? "فارغ" : "Empty"}
                    </div>
                  ) : (
                    colCandidates.map((c) => (
                      <GlassCard
                        key={c.id}
                        className="p-3 bg-white/5 hover:bg-white/10 border-white/10 rounded-xl space-y-2 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {c.candidate.fullname}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {c.match_score}%
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {c.candidate.title}
                        </p>

                        <div className="pt-2 flex items-center justify-between border-t border-white/5">
                          <select
                            value={c.stage}
                            onChange={(e) =>
                              stageMutation.mutate({
                                candidateId: c.customer_id,
                                stage: e.target.value as CampaignStage,
                              })
                            }
                            className="text-[10px] bg-[#070b14] border border-white/10 rounded px-1.5 py-0.5 text-muted-foreground focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label_en}
                              </option>
                            ))}
                          </select>

                          {c.stage === "discovered" && (
                            <button
                              onClick={() => openSingleOutreachModal(c)}
                              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>InMail</span>
                            </button>
                          )}
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── 1-CLICK INMAIL OUTREACH MODAL ────────────────────── */}
      {outreachModalCandidate && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <GlassCard className="w-full max-w-lg bg-card border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-start space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {language === "ar" ? "إرسال دعوة استقطاب (InMail)" : "Send InMail Invitation"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "ar"
                        ? `إلى المرشح: ${outreachModalCandidate.candidate.fullname}`
                        : `To: ${outreachModalCandidate.candidate.fullname}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOutreachModalCandidate(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1.5">
                  {language === "ar" ? "نص رسالة الدعوة" : "Invitation Message"}
                </label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {language === "ar"
                    ? "سيتم إرسال هذه الرسالة مباشرة إلى صندوق محادثات المرشح ووضعه في مرحلة 'تم التواصل'."
                    : "This message will be dispatched directly into the candidate's chat inbox."}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOutreachModalCandidate(null)}
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    outreachMutation.mutate({
                      ids: [outreachModalCandidate.customer_id],
                      msg: customMessage,
                    })
                  }
                  disabled={outreachMutation.isPending}
                  className="rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
                >
                  {outreachMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{language === "ar" ? "إرسال الدعوة الآن" : "Dispatch InMail"}</span>
                </Button>
              </div>
            </GlassCard>
          </div>
        </ModalPortal>
      )}

    </div>
  )
}
