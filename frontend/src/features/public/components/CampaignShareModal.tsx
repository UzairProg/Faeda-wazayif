/**
 * features/public/components/CampaignShareModal.tsx
 *
 * LinkedIn / Instagram style Share & Repost Modal.
 * Features:
 * - Repost to feed with optional quotation / thoughts
 * - Retains original campaign author and title
 * - Copy campaign URL to clipboard
 * - Instant social channels share (LinkedIn, Twitter / X, WhatsApp)
 * - Invokes backend tracking API (POST /api/v1/posts/:id/share)
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import type { PostArticle } from "../types/posts.types"
import { useTranslation } from "@/i18n"
import toast from "react-hot-toast"

interface CampaignShareModalProps {
  isOpen: boolean
  onClose: () => void
  post: PostArticle | null
  onShared?: (postId: number, newSharesCount: number) => void
}

export function CampaignShareModal({
  isOpen,
  onClose,
  post,
  onShared,
}: CampaignShareModalProps) {
  const { language } = useTranslation()
  const [quote, setQuote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen || !post) return null

  const campaignUrl = `${window.location.origin}/posts/${post.id}`

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(campaignUrl)
      setIsCopied(true)
      toast.success(
        language === "ar"
          ? "تم نسخ رابط الحملة إلى الحافظة!"
          : "Campaign link copied to clipboard!"
      )
      setTimeout(() => setIsCopied(false), 2500)
    }
  }

  const handleRepost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await postsService.shareCampaign(post.id, quote.trim())
      toast.success(
        language === "ar"
          ? "تمت مشاركة الحملة بنجاح في شبكتك المهنية!"
          : "Campaign shared to your network successfully!"
      )
      if (onShared) {
        onShared(post.id, res.sharesCount)
      }
      setQuote("")
      onClose()
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          (language === "ar" ? "تعذر مشاركة الحملة." : "Failed to share campaign.")
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialShare = (platform: "linkedin" | "twitter" | "whatsapp") => {
    const text = encodeURIComponent(`${post.title}\n\n${campaignUrl}`)
    let url = ""
    if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        campaignUrl
      )}`
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${text}`
    } else if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${text}`
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="relative p-6 sm:p-7 bg-card/95 border-white/15 rounded-3xl shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  {language === "ar"
                    ? "مشاركة وإعادة نشر الحملة"
                    : language === "hi"
                    ? "अभियान साझा और पुनः पोस्ट करें"
                    : "Share & Repost Campaign"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === "ar"
                    ? "شارك هذه الحملة مع شبكتك مع الاحتفاظ بصاحب المحتوى الأصلي."
                    : "Share with your network while preserving original author credentials."}
                </p>
              </div>
            </div>

            {/* Original Campaign Preview Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-primary block">
                  {post.author.name}
                </span>
                <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {post.summary}
                </p>
              </div>
            </div>

            {/* Repost Form */}
            <form onSubmit={handleRepost} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                {language === "ar"
                  ? "أضف أفكارك أو تعليقك (اختياري):"
                  : "Add your thoughts or quote (optional):"}
              </label>
              <textarea
                rows={3}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "اكتب ما أعجبك في هذه الحملة وشاركه مع زملائك..."
                    : "What did you find inspiring or valuable about this post?..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {language === "ar"
                      ? `${post.sharesCount || 0} مشاركات سابقة`
                      : `${post.sharesCount || 0} previous shares`}
                  </span>
                </span>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? language === "ar"
                        ? "جارٍ النشر..."
                        : "Posting..."
                      : language === "ar"
                      ? "إعادة النشر الآن"
                      : "Repost Now"}
                  </span>
                </Button>
              </div>
            </form>

            {/* Quick Share to External Platforms */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                {language === "ar" ? "أو شارك عبر المنصات الخارجية:" : "Or share via:"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialShare("linkedin")}
                  className="py-2 px-3 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#70B5F9] border border-[#0A66C2]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare("twitter")}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>X / Twitter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialShare("whatsapp")}
                  className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Copy Link Input */}
            <div className="pt-1">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={campaignUrl}
                  className="flex-1 bg-transparent px-2 text-xs text-muted-foreground font-mono focus:outline-none truncate"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyLink}
                  className={`rounded-xl text-xs font-bold px-3 transition-all ${
                    isCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 me-1" />
                      <span>{language === "ar" ? "تم النسخ" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 me-1" />
                      <span>{language === "ar" ? "نسخ الرابط" : "Copy Link"}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
