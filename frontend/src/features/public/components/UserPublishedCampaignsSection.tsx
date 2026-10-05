/**
 * features/public/components/UserPublishedCampaignsSection.tsx
 *
 * Reusable Published Campaigns & Posts Showcase Section.
 * Designed to be embedded into Company, University, and Candidate profile pages.
 * Features:
 * - Real-time campaign stats (Views, Likes, Comments, Shares, Saves)
 * - 1-Click Launch into CampaignAnalyticsModal
 * - Direct link to campaign detail view
 * - Filter by status (active / published)
 */
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Sparkles,
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ExternalLink,
  PlusCircle,
  Video,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import { CampaignAnalyticsModal } from "./CampaignAnalyticsModal"
import type { PostArticle } from "../types/posts.types"
import { useTranslation } from "@/i18n"

interface UserPublishedCampaignsSectionProps {
  userType: "company" | "university" | "candidate"
  userId?: number | string
  title?: string
  description?: string
}

export function UserPublishedCampaignsSection({
  userType,
  userId,
  title,
  description,
}: UserPublishedCampaignsSectionProps) {
  const { language } = useTranslation()
  const [campaigns, setCampaigns] = useState<PostArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnalyticsCampaign, setSelectedAnalyticsCampaign] = useState<PostArticle | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    postsService
      .getUserPublishedCampaigns(userType, userId)
      .then((res) => {
        if (isMounted) {
          setCampaigns(res.campaigns || [])
        }
      })
      .catch(() => {
        if (isMounted) setCampaigns([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [userType, userId])

  const defaultTitle =
    userType === "company"
      ? language === "ar"
        ? "حملات التوظيف والمنشورات المنشورة"
        : "Published Recruitment Campaigns & Posts"
      : userType === "university"
      ? language === "ar"
        ? "الأبحاث والفعاليات الأكاديمية المنشورة"
        : "Published Academic Research & Events"
      : language === "ar"
      ? "المشاريع والمنشورات المهنية المنشورة"
      : "Published Projects & Professional Posts"

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{title || defaultTitle}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/10 text-slate-300">
              {campaigns.length}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {description ||
              (language === "ar"
                ? "عرض وإدارة الحملات التي نشرتها ومتابعة تفاعل الجمهور معها مباشرة."
                : "Manage and inspect performance analytics for your live campaigns.")}
          </p>
        </div>

        <Link to="/posts">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "نشر حملة جديدة" : "Launch Campaign"}</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-44 bg-white/5 rounded-2xl" />
          <div className="h-44 bg-white/5 rounded-2xl" />
        </div>
      ) : campaigns.length === 0 ? (
        <GlassCard className="p-8 text-center bg-card/30 border-white/5 rounded-2xl space-y-3">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
          <p className="text-xs text-muted-foreground">
            {language === "ar"
              ? "لم تقم بنشر أي حملات أو منشورات تسويقية بعد."
              : "No marketing campaigns or articles published yet."}
          </p>
          <Link to="/posts">
            <Button size="sm" className="rounded-xl bg-primary text-xs text-white">
              {language === "ar" ? "استكشف الحملات وانشر الآن" : "Explore & Publish Now"}
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <GlassCard
              key={camp.id}
              className="p-4 bg-card/40 border-white/5 hover:border-primary/30 rounded-2xl flex flex-col justify-between space-y-3 transition-all"
            >
              <div className="space-y-2.5">
                {/* Header row with tags, budget badge & video badge */}
                <div className="flex items-center justify-between text-[11px] gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-primary font-bold text-[10px]">
                      {camp.category}
                    </span>
                    {camp.budget && camp.budget.budgetType && (
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[9px] ${
                        camp.budget.budgetType === "free"
                          ? "bg-slate-500/15 text-slate-300"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {camp.budget.budgetType === "free"
                          ? (language === "ar" ? "حملة مجانية" : "Free Reach")
                          : camp.budget.totalBudget
                          ? `${Number(camp.budget.totalBudget).toLocaleString()} ${camp.budget.currency || "SAR"}`
                          : `${Number(camp.budget.dailyBudget).toLocaleString()} ${camp.budget.currency || "SAR"}/${language === "ar" ? "يوم" : "day"}`}
                      </span>
                    )}
                  </div>
                  {camp.mediaType === "video" && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[9px] flex items-center gap-1 shrink-0">
                      <Video className="w-2.5 h-2.5" />
                      <span>{language === "ar" ? "فيديو" : "Video"}</span>
                    </span>
                  )}
                </div>

                {/* Title & Summary */}
                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {camp.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {camp.summary}
                </p>
              </div>

              {/* Stats & Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                {/* Interaction Counters */}
                <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1" title="Views">
                    <Eye className="w-3 h-3 text-sky-400" />
                    {camp.views}
                  </span>
                  <span className="flex items-center gap-1" title="Likes">
                    <Heart className="w-3 h-3 text-rose-400" />
                    {camp.likes}
                  </span>
                  <span className="flex items-center gap-1" title="Comments">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    {camp.commentsCount || 0}
                  </span>
                  <span className="flex items-center gap-1" title="Shares">
                    <Share2 className="w-3 h-3 text-emerald-400" />
                    {camp.sharesCount || 0}
                  </span>
                  <span className="flex items-center gap-1" title="Saves">
                    <Bookmark className="w-3 h-3 text-amber-400" />
                    {camp.savesCount || 0}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAnalyticsCampaign(camp)}
                    className="h-7 text-[11px] rounded-lg border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 px-2 flex items-center gap-1"
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>{language === "ar" ? "التحليلات" : "Analytics"}</span>
                  </Button>

                  <Link to={`/posts/${camp.id}`} target="_blank">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-white"
                      title="View Campaign"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      <CampaignAnalyticsModal
        isOpen={Boolean(selectedAnalyticsCampaign)}
        onClose={() => setSelectedAnalyticsCampaign(null)}
        campaignId={selectedAnalyticsCampaign?.id || 0}
        campaignTitle={selectedAnalyticsCampaign?.title}
      />
    </div>
  )
}
