/**
 * features/candidate/components/dashboard/CandidateCampaignInvitesCard.tsx
 *
 * Displays exclusive recruitment campaign invitations received by the candidate.
 * Allows 1-click Accept & Connect (starts chat) or Decline.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Target, Star, CheckCircle2, Building2, MapPin } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"
import { campaignsService } from "@/features/campaigns/services/campaigns.service"

export function CandidateCampaignInvitesCard() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const { data: invites = [] } = useQuery({
    queryKey: ["candidate", "campaign-invites"],
    queryFn: () => campaignsService.getCandidateInvites(),
  })

  const respondMutation = useMutation({
    mutationFn: ({ campaignId, action }: { campaignId: number; action: "accept" | "decline" }) =>
      campaignsService.respondToInvite(campaignId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "campaign-invites"] })
      alert(data.message)
    },
  })

  if (invites.length === 0) return null

  return (
    <GlassCard className="p-6 bg-gradient-to-r from-emerald-950/40 via-card/70 to-card/70 border-emerald-500/30 rounded-3xl shadow-xl relative overflow-hidden text-start space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{language === "ar" ? "دعوات حصرية من حملات التوظيف النشطة" : "Exclusive Campaign Invitations"}</span>
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                {invites.length}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "تم ترشيحك بالذكاء الاصطناعي بناءً على مطابقة مهاراتك مع أهداف هذه المنشآت"
                : "You were pre-selected by company recruiters based on your market value and skills."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invites.map((inv) => (
          <div
            key={inv.id}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {inv.company_logo ? (
                  <img
                    src={inv.company_logo}
                    alt={inv.company_name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0 bg-black/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <span className="text-xs text-emerald-400 font-semibold block truncate">
                    {inv.company_name}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {inv.campaign_title}
                  </h4>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>{inv.match_score}%</span>
              </span>
            </div>

            {inv.tagline && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {inv.tagline}
              </p>
            )}

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{inv.location || "Saudi Arabia"}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => respondMutation.mutate({ campaignId: inv.campaign_id, action: "decline" })}
                  className="px-2.5 py-1 rounded-lg text-[11px] text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                  {language === "ar" ? "تجاهل" : "Dismiss"}
                </button>
                <Link to="/candidate/chat">
                  <Button
                    size="sm"
                    onClick={() => respondMutation.mutate({ campaignId: inv.campaign_id, action: "accept" })}
                    className="rounded-xl px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "قبول وتواصل" : "Accept & Connect"}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
