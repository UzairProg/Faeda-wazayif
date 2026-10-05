/**
 * features/public/components/CampaignAnalyticsModal.tsx
 *
 * Real-time Analytics Modal for Campaign Creators & Admins.
 * Displays:
 * - 👁️ Total Views
 * - ❤️ Total Likes
 * - 💬 Total Comments
 * - 🔄 Total Shares / Reposts
 * - 🔖 Total Saves / Bookmarks
 * - 📈 Engagement Rate % (Engagements / Views)
 * - Recent social interactions log
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import type { CampaignAnalyticsData } from "../types/posts.types"
import { useTranslation } from "@/i18n"

interface CampaignAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: number | string
  campaignTitle?: string
}

export function CampaignAnalyticsModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
}: CampaignAnalyticsModalProps) {
  const { language } = useTranslation()
  const [data, setData] = useState<CampaignAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !campaignId) return
    let isMounted = true
    setIsLoading(true)
    setError(null)

    postsService
      .getCampaignAnalytics(campaignId)
      .then((res) => {
        if (isMounted) {
          setData(res.analytics)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.error ||
              (language === "ar"
                ? "تعذر تحميل إحصائيات هذه الحملة. تأكد من صلاحيات الحساب."
                : "Failed to load campaign analytics. Please check your permissions.")
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, campaignId, language])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="relative p-6 sm:p-8 bg-card/95 border-white/15 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-white/10">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  {language === "ar"
                    ? "إحصائيات وتحليلات التفاعل"
                    : language === "hi"
                    ? "अभियान विश्लेषण और सहभागिता"
                    : "Campaign Social Analytics"}
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-md">
                  {campaignTitle || data?.title || `#${campaignId}`}
                </p>
              </div>
            </div>

            {/* Body */}
            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "جارٍ جمع مؤشرات الأداء..." : "Aggregating performance metrics..."}
                </p>
              </div>
            ) : error ? (
              <div className="py-10 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto opacity-80" />
                <p className="text-xs text-rose-300 font-medium">{error}</p>
                <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl border-white/10">
                  {language === "ar" ? "إغلاق" : "Close"}
                </Button>
              </div>
            ) : data ? (
              <div className="space-y-6 pt-5">
                {/* Engagement Rate Hero Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/20 via-sky-500/10 to-indigo-500/20 border border-primary/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-sky-200 font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                      {language === "ar"
                        ? "معدل التفاعل الإجمالي (Engagement Rate)"
                        : "Overall Engagement Rate"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {language === "ar"
                        ? "نسبة مجموع التفاعلات (إعجابات، تعليقات، مشاركات، حفظ) إلى المشاهدات"
                        : "Total interactions (Likes + Comments + Shares + Saves) divided by Views"}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="text-3xl sm:text-4xl font-black font-heading text-white">
                      {data.engagement_rate}%
                    </span>
                    <span className="block text-[10px] text-emerald-400 font-mono">
                      {data.total_engagements} {language === "ar" ? "تفاعل" : "actions"}
                    </span>
                  </div>
                </div>

                {/* 5 Core Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Views */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "المشاهدات" : "Views"}
                      </span>
                      <Eye className="w-4 h-4 text-sky-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{data.views}</p>
                  </div>

                  {/* Likes */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "الإعجابات" : "Likes"}
                      </span>
                      <Heart className="w-4 h-4 text-rose-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-rose-300">{data.likes}</p>
                  </div>

                  {/* Comments */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "التعليقات" : "Comments"}
                      </span>
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-indigo-300">{data.comments}</p>
                  </div>

                  {/* Shares */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "إعادة النشر" : "Shares"}
                      </span>
                      <Share2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-emerald-300">{data.shares}</p>
                  </div>

                  {/* Saves */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "الحفظ بالمفضلة" : "Saves"}
                      </span>
                      <Bookmark className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-amber-300">{data.saves}</p>
                  </div>

                  {/* Total Actions */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-semibold">
                        {language === "ar" ? "مجموع الإجراءات" : "Actions"}
                      </span>
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-purple-300">
                      {data.total_engagements}
                    </p>
                  </div>
                </div>

                {/* ── Estimated / Proposed Reach Section (labeled clearly as ESTIMATE) */}
                {data.estimated && (data.estimated.proposedReachMin || data.estimated.proposedReachMax || data.estimated.totalBudget) && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                        {language === "ar" ? "تقديري — غير مضمون" : "Estimate — Not Guaranteed"}
                      </span>
                      <span className="text-xs font-bold text-amber-200">
                        {language === "ar" ? "الوصول المقدر / المتوقع" : "Estimated / Proposed Reach"}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/70">
                      {language === "ar"
                        ? "هذه الأرقام تقديرية فقط محسوبة من الميزانية والاستهداف. الوصول الفعلي يظهر في قسم 'المشاهدات الحقيقية' أعلاه."
                        : "These figures are estimates only, calculated from budget & targeting. Actual reach is shown in 'Views' above."}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(data.estimated.proposedReachMin != null || data.estimated.proposedReachMax != null) && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                          <span className="text-[11px] text-amber-300 font-semibold block">
                            {language === "ar" ? "الوصول المتوقع" : "Proposed Reach"}
                          </span>
                          <span className="text-lg font-black text-amber-200 font-mono">
                            {data.estimated.proposedReachMin?.toLocaleString()}
                            {" — "}
                            {data.estimated.proposedReachMax?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {data.estimated.totalBudget != null && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                          <span className="text-[11px] text-amber-300 font-semibold block">
                            {language === "ar" ? "إجمالي الميزانية" : "Total Budget"}
                          </span>
                          <span className="text-lg font-black text-amber-200 font-mono">
                            {data.estimated.totalBudget.toLocaleString()} {data.estimated.currency || "SAR"}
                          </span>
                        </div>
                      )}
                      {data.estimated.dailyBudget != null && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                          <span className="text-[11px] text-amber-300 font-semibold block">
                            {language === "ar" ? "الميزانية اليومية" : "Daily Budget"}
                          </span>
                          <span className="text-lg font-black text-amber-200 font-mono">
                            {data.estimated.dailyBudget.toLocaleString()} {data.estimated.currency || "SAR"}/
                            {language === "ar" ? "يوم" : "day"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Interaction Feeds */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {language === "ar" ? "أحدث التفاعلات المسجلة" : "Recent Social Activity"}
                    </span>
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {data.recent_comments && data.recent_comments.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {language === "ar" ? "أحدث التعليقات:" : "Recent Comments:"}
                        </span>
                        {data.recent_comments.map((rc, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex items-center justify-between"
                          >
                            <span className="text-white font-medium">{rc.author}</span>
                            <span className="text-slate-300 truncate max-w-[200px] text-[11px]">
                              &ldquo;{rc.content}&rdquo;
                            </span>
                            <span className="text-[10px] text-muted-foreground">{rc.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.recent_shares && data.recent_shares.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {language === "ar" ? "أحدث المشاركات:" : "Recent Shares:"}
                        </span>
                        {data.recent_shares.map((rs, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex items-center justify-between"
                          >
                            <span className="text-white font-medium">{rs.user_name}</span>
                            <span className="text-slate-300 truncate max-w-[200px] text-[11px]">
                              {rs.quote ? `"${rs.quote}"` : "Reposted to network"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{rs.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(!data.recent_comments || data.recent_comments.length === 0) &&
                      (!data.recent_shares || data.recent_shares.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-4 bg-white/5 rounded-xl">
                          {language === "ar"
                            ? "لا توجد أنشطة تفاعل إضافية مسجلة بعد."
                            : "No additional interaction activity recorded yet."}
                        </p>
                      )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={onClose}
                    className="rounded-xl px-5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                  >
                    {language === "ar" ? "إغلاق" : "Close"}
                  </Button>
                </div>
              </div>
            ) : null}
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
