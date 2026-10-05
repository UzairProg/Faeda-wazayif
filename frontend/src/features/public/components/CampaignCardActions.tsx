/**
 * features/public/components/CampaignCardActions.tsx
 *
 * Social Interaction Action Bar for Campaign Cards.
 * Implements the required 4-action row:
 * [Like] [Comment] [Share] [Save]
 * with counts, active states, and optional [Analytics] for the campaign author/admin.
 */
import { useState } from "react"
import { Heart, MessageSquare, Share2, Bookmark, BarChart3 } from "lucide-react"
import { postsService } from "../services/posts.service"
import type { PostArticle } from "../types/posts.types"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import toast from "react-hot-toast"

interface CampaignCardActionsProps {
  post: PostArticle
  onCommentClick?: (e: React.MouseEvent, post: PostArticle) => void
  onShareClick?: (e: React.MouseEvent, post: PostArticle) => void
  onAnalyticsClick?: (e: React.MouseEvent, post: PostArticle) => void
  onUpdate?: (updatedPost: Partial<PostArticle>) => void
  variant?: "card" | "featured" | "detail"
}

export function CampaignCardActions({
  post,
  onCommentClick,
  onShareClick,
  onAnalyticsClick,
  onUpdate,
  variant = "card",
}: CampaignCardActionsProps) {
  const { language } = useTranslation()
  const { user } = useAuthStore()

  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked))
  const [likesCount, setLikesCount] = useState(post.likes || 0)
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved))
  const [savesCount, setSavesCount] = useState(post.savesCount || 0)
  const sharesCount = post.sharesCount || 0
  const [isLikePending, setIsLikePending] = useState(false)
  const [isSavePending, setIsSavePending] = useState(false)

  // Can view analytics if user is the author or admin
  const isAuthorOrAdmin =
    user?.role === "admin" ||
    (user && post.author?.username && user.email?.includes(post.author.username)) ||
    (user && user.role === post.accountType)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLikePending) return

    const prevLiked = isLiked
    const prevCount = likesCount

    // Optimistic UI update
    const nextLiked = !prevLiked
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1)
    setIsLiked(nextLiked)
    setLikesCount(nextCount)
    setIsLikePending(true)

    try {
      const res = await postsService.toggleLike(post.id)
      setIsLiked(res.isLiked)
      setLikesCount(res.likes)
      if (onUpdate) {
        onUpdate({ isLiked: res.isLiked, likes: res.likes })
      }
    } catch {
      // Rollback on failure
      setIsLiked(prevLiked)
      setLikesCount(prevCount)
      toast.error(
        language === "ar" ? "تعذر تحديث الإعجاب" : "Failed to update like status"
      )
    } finally {
      setIsLikePending(false)
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSavePending) return

    const prevSaved = isSaved
    const prevCount = savesCount

    const nextSaved = !prevSaved
    const nextCount = nextSaved ? prevCount + 1 : Math.max(0, prevCount - 1)
    setIsSaved(nextSaved)
    setSavesCount(nextCount)
    setIsSavePending(true)

    try {
      const res = await postsService.toggleSave(post.id)
      setIsSaved(res.isSaved)
      setSavesCount(res.savesCount)
      toast.success(
        res.isSaved
          ? language === "ar"
            ? "تم حفظ الحملة في المحفوظات!"
            : "Campaign saved to bookmarks!"
          : language === "ar"
          ? "تمت إزالة الحملة من المحفوظات"
          : "Campaign removed from bookmarks"
      )
      if (onUpdate) {
        onUpdate({ isSaved: res.isSaved, savesCount: res.savesCount })
      }
    } catch {
      setIsSaved(prevSaved)
      setSavesCount(prevCount)
      toast.error(
        language === "ar" ? "تعذر حفظ الحملة" : "Failed to toggle campaign save"
      )
    } finally {
      setIsSavePending(false)
    }
  }

  const commentsCount =
    post.commentsCount !== undefined
      ? post.commentsCount
      : post.comments?.length || 0

  return (
    <div
      className={`w-full flex items-center justify-between border-t border-white/5 pt-3 mt-3 select-none ${
        variant === "featured" ? "sm:pt-4 sm:mt-4" : ""
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
        {/* 1. LIKE Button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isLikePending}
          title={isLiked ? "Unlike" : "Like"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isLiked
              ? "text-rose-400 bg-rose-500/15 border border-rose-500/30 shadow-sm"
              : "text-muted-foreground hover:text-rose-400 hover:bg-white/5"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
          <span className="font-mono text-[11px] sm:text-xs">{likesCount}</span>
          <span className="hidden sm:inline text-[11px]">
            {language === "ar" ? "إعجاب" : "Like"}
          </span>
        </button>

        {/* 2. COMMENT Button */}
        <button
          type="button"
          onClick={(e) => onCommentClick && onCommentClick(e, post)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-indigo-400 hover:bg-white/5 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] sm:text-xs">{commentsCount}</span>
          <span className="hidden sm:inline text-[11px]">
            {language === "ar" ? "تعليق" : "Comment"}
          </span>
        </button>

        {/* 3. SHARE Button */}
        <button
          type="button"
          onClick={(e) => onShareClick && onShareClick(e, post)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-emerald-400 hover:bg-white/5 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] sm:text-xs">{sharesCount}</span>
          <span className="hidden sm:inline text-[11px]">
            {language === "ar" ? "مشاركة" : "Share"}
          </span>
        </button>

        {/* 4. SAVE Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSavePending}
          title={isSaved ? "Saved" : "Save"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSaved
              ? "text-amber-400 bg-amber-500/15 border border-amber-500/30 shadow-sm"
              : "text-muted-foreground hover:text-amber-400 hover:bg-white/5"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-400 text-amber-400" : ""}`} />
          <span className="hidden sm:inline text-[11px]">
            {isSaved
              ? language === "ar"
                ? "محفوظ"
                : "Saved"
              : language === "ar"
              ? "حفظ"
              : "Save"}
          </span>
        </button>
      </div>

      {/* 5. Optional ANALYTICS Button (Owner / Admin) */}
      {isAuthorOrAdmin && onAnalyticsClick && (
        <button
          type="button"
          onClick={(e) => onAnalyticsClick(e, post)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-sky-400 hover:bg-sky-500/10 border border-sky-500/20 transition-all shrink-0"
          title="Campaign Analytics"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === "ar" ? "الإحصائيات" : "Analytics"}
          </span>
        </button>
      )}
    </div>
  )
}
