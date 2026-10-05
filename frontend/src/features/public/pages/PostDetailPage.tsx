/**
 * features/public/pages/PostDetailPage.tsx
 *
 * Full Article & Insight Detail view (/posts/:id).
 * Features rich formatted article content, author portfolio link,
 * interaction toolbar (likes, shares, bookmarks), interactive comment section,
 * and related articles recommendations.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Send,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  BookOpen,
  BarChart3,
  CornerDownLeft,
  Edit2,
  Trash2,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import { CampaignShareModal } from "../components/CampaignShareModal"
import { CampaignAnalyticsModal } from "../components/CampaignAnalyticsModal"
import type { PostArticle, PostComment } from "../types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import {
  getLocalizedPost,
  getLocalizedAccountType,
  getLocalizedPostType,
} from "@/lib/localization.utils"
import toast from "react-hot-toast"

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { language, isRTL } = useTranslation()
  const { user } = useAuthStore()

  const [post, setPost] = useState<PostArticle | null>(null)
  const [related, setRelated] = useState<PostArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Like & Bookmark state
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Comment state
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [commentAuthor, setCommentAuthor] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)

  // Reply & Edit state
  const [replyingToId, setReplyingToId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  useEffect(() => {
    let isMounted = true
    async function loadPost() {
      if (!id) return
      setIsLoading(true)
      try {
        const res = await postsService.getPostDetail(id)
        if (isMounted && res.post) {
          setPost(res.post)
          setIsLiked(Boolean(res.post.isLiked))
          setLikesCount(res.post.likes || 0)
          setIsBookmarked(Boolean(res.post.isSaved))
          setComments(res.post.comments || [])
          setRelated(res.related || [])
        }
      } catch {
        if (isMounted) setPost(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadPost()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleLike = async () => {
    if (!post) return
    const prevLiked = isLiked
    const prevCount = likesCount

    setIsLiked(!prevLiked)
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1)

    try {
      const res = await postsService.toggleLike(post.id)
      setIsLiked(res.isLiked)
      setLikesCount(res.likes)
    } catch {
      setIsLiked(prevLiked)
      setLikesCount(prevCount)
    }
  }

  const handleToggleBookmark = async () => {
    if (!post) return
    const prevBookmarked = isBookmarked
    setIsBookmarked(!prevBookmarked)

    try {
      const res = await postsService.toggleSave(post.id)
      setIsBookmarked(res.isSaved)
      toast.success(
        res.isSaved
          ? language === "ar"
            ? "تم حفظ المقال في قائمتك المفضلة!"
            : "Article saved to your bookmarks!"
          : language === "ar"
          ? "تمت إزالة المقال من المحفوظات"
          : "Removed from bookmarks"
      )
    } catch {
      setIsBookmarked(prevBookmarked)
      toast.error(
        language === "ar" ? "تعذر حفظ المقال" : "Failed to toggle bookmark"
      )
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !commentText.trim()) return

    setIsSubmittingComment(true)
    const authorNameToUse =
      commentAuthor.trim() ||
      (user ? user.name || (language === "ar" ? "عضو مسجل" : "Registered Member") : (language === "ar" ? "زائر مهتم" : "Guest Reader"))

    try {
      const res = await postsService.addComment(post.id, commentText.trim(), authorNameToUse)
      setComments((prev) => [...prev, res.comment])
      setCommentText("")
      toast.success(
        language === "ar"
          ? "تمت إضافة تعليقك بنجاح!"
          : "Comment posted successfully!"
      )
    } catch {
      toast.error(
        language === "ar" ? "تعذر إرسال التعليق." : "Failed to post comment."
      )
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleAddReply = async (parentId: number) => {
    if (!post || !replyText.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    const authorNameToUse = user?.name || (language === "ar" ? "عضو مسجل" : "Registered Member")

    try {
      const res = await postsService.addComment(post.id, replyText.trim(), authorNameToUse, parentId)
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), res.comment] }
            : c
        )
      )
      setReplyText("")
      setReplyingToId(null)
      toast.success(language === "ar" ? "تم إرسال ردك بنجاح!" : "Reply posted successfully!")
    } catch {
      toast.error(language === "ar" ? "تعذر إرسال الرد" : "Failed to post reply")
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleSaveEdit = async (commentId: number) => {
    if (!editText.trim() || isSubmittingEdit) return
    setIsSubmittingEdit(true)
    try {
      const res = await postsService.editComment(commentId, editText.trim())
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) return { ...c, text: res.comment.text, content: res.comment.text }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, text: res.comment.text, content: res.comment.text } : r
              ),
            }
          }
          return c
        })
      )
      setEditingCommentId(null)
      setEditText("")
      toast.success(language === "ar" ? "تم تعديل التعليق بنجاح" : "Comment edited successfully")
    } catch {
      toast.error(language === "ar" ? "تعذر تعديل التعليق" : "Failed to edit comment")
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    const confirmMsg =
      language === "ar"
        ? "هل أنت متأكد من رغبتك في حذف هذا التعليق؟"
        : "Are you sure you want to delete this comment?"
    if (!window.confirm(confirmMsg)) return

    try {
      await postsService.deleteComment(commentId)
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : [],
          }))
      )
      toast.success(language === "ar" ? "تم حذف التعليق" : "Comment deleted")
    } catch {
      toast.error(language === "ar" ? "تعذر حذف التعليق" : "Failed to delete comment")
    }
  }

  // Reactive localized versions
  const localizedPost = post ? getLocalizedPost(post, language) : null
  const localizedRelated = related.map((r) => getLocalizedPost(r, language))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-pulse text-start">
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <div className="h-10 w-3/4 bg-white/15 rounded-xl" />
        <div className="h-96 w-full bg-card/60 rounded-3xl border border-white/5" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
          <div className="h-4 w-4/6 bg-white/5 rounded" />
        </div>
      </div>
    )
  }

  if (!localizedPost) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-2xl font-bold font-heading text-white">
            {language === "ar" ? "المقال غير متوفر" : language === "hi" ? "लेख उपलब्ध नहीं है" : "Article Not Found"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "ar"
              ? "ربما تم نقل هذا المقال أو حذفه."
              : language === "hi"
              ? "शायद यह लेख हटा दिया गया है या मौजूद नहीं है।"
              : "This article does not exist or was removed."}
          </p>
          <Link to="/posts">
            <Button className="rounded-xl px-6 bg-primary text-white font-bold text-sm mt-2">
              {language === "ar" ? "العودة إلى المقالات" : language === "hi" ? "लेखों पर वापस जाएँ" : "Back to Articles"}
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 relative selection:bg-primary/30">
      {/* Background ambient lighting */}
      <div className="absolute top-20 start-1/4 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-start space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-white transition-colors">
            {language === "ar" ? "الرئيسية" : language === "hi" ? "होम" : "Home"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <Link to="/posts" className="hover:text-white transition-colors">
            {language === "ar" ? "المقالات والرؤى" : language === "hi" ? "लेख और अंतर्दृष्टि" : "Articles"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">{localizedPost.title}</span>
        </nav>

        {/* ── Article Header ───────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {localizedPost.accountType && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  localizedPost.accountType === "university"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    : localizedPost.accountType === "company"
                    ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40"
                    : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                }`}
              >
                {localizedPost.accountType === "university" ? "🏛️ " : localizedPost.accountType === "company" ? "🏢 " : "👤 "}
                {getLocalizedAccountType(localizedPost.accountType, language)}
              </span>
            )}

            {localizedPost.postType && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/10">
                {getLocalizedPostType(localizedPost.postType, language)}
              </span>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold">
              {localizedPost.category}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {localizedPost.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            {localizedPost.summary}
          </p>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Link to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)} className="group flex items-center gap-3">
                <img
                  src={localizedPost.author.avatar}
                  alt={localizedPost.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40 group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {localizedPost.author.name}
                    </span>
                    {localizedPost.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground block">{localizedPost.author.title}</span>
                </div>
              </Link>
              <Link
                to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)}
                className="ms-3 hidden sm:inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/20 transition-colors"
              >
                <span>{language === "ar" ? "المعرض المهني" : language === "hi" ? "पोर्टफोलियो" : "Portfolio"}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Read Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {new Date(localizedPost.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {localizedPost.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                {localizedPost.views} {language === "ar" ? "قراءة" : language === "hi" ? "बार देखा गया" : "views"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Cover Banner ────────────────────────────────────── */}
        <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
          <img
            src={localizedPost.coverImage}
            alt={localizedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── Article Body Content ─────────────────────────────────── */}
        <GlassCard className="p-6 sm:p-10 md:p-12 bg-card/40 border-white/5 rounded-3xl shadow-xl space-y-6">
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6 whitespace-pre-line font-normal">
            {localizedPost.content}
          </div>

          {/* Tags */}
          {localizedPost.tags && localizedPost.tags.length > 0 && (
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{language === "ar" ? "الكلمات المفتاحية:" : language === "hi" ? "टैग:" : "Tags:"}</span>
              {localizedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleLike}
                variant="outline"
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isLiked
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-red-400" : ""}`} />
                <span>{likesCount}</span>
                <span className="hidden sm:inline">{language === "ar" ? "إعجاب" : "Likes"}</span>
              </Button>

              <Button
                onClick={handleToggleBookmark}
                variant="outline"
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isBookmarked
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
                <span className="hidden sm:inline">
                  {isBookmarked
                    ? language === "ar"
                      ? "محفوظ"
                      : "Saved"
                    : language === "ar"
                    ? "حفظ"
                    : "Bookmark"}
                </span>
              </Button>

              <Button
                onClick={() => setIsShareOpen(true)}
                variant="outline"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm border-white/10 text-muted-foreground hover:text-white flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>{post?.sharesCount || 0}</span>
                <span className="hidden sm:inline">{language === "ar" ? "مشاركة" : "Share"}</span>
              </Button>
            </div>

            {(user?.role === "admin" ||
              (user && user.role === post?.accountType) ||
              (user && post?.author?.username && user.email?.includes(post.author.username))) && (
              <Button
                onClick={() => setIsAnalyticsOpen(true)}
                variant="outline"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{language === "ar" ? "إحصائيات الحملة" : "Campaign Analytics"}</span>
              </Button>
            )}
          </div>
        </GlassCard>

        {/* ── Author Spotlight Card ────────────────────────────────── */}
        <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-card/60 via-primary/10 to-card/60 border-white/10 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={localizedPost.author.avatar}
              alt={localizedPost.author.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-heading text-white">{localizedPost.author.name}</h3>
                {localizedPost.author.isVerified && <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />}
              </div>
              <p className="text-xs text-sky-200">{localizedPost.author.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {language === "ar"
                  ? "كاتب ومستشار معتمد في شبكة فائدة للمسارات المهنية."
                  : language === "hi"
                  ? "फायदा करियर नेटवर्क में प्रमाणित लेखक और सलाहकार।"
                  : "Verified contributor in the Faeda Career Ecosystem."}
              </p>
            </div>
          </div>

          <Link to={ROUTES.PORTFOLIO.PUBLIC(localizedPost.author.username)} className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-xl px-5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <span>{language === "ar" ? "زيارة المعرض المهني" : language === "hi" ? "पोर्टफोलियो देखें" : "View Portfolio"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </GlassCard>

        {/* ── Discussion & Comments Section ────────────────────────── */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold font-heading text-white">
              {language === "ar"
                ? `النقاش والتعليقات (${comments.length})`
                : language === "hi"
                ? `चर्चा और टिप्पणियाँ (${comments.length})`
                : `Discussion & Comments (${comments.length})`}
            </h3>
          </div>

          {/* Add Comment Form */}
          <GlassCard className="p-5 sm:p-6 bg-card/40 border-white/5 rounded-2xl space-y-4">
            <form onSubmit={handleAddComment} className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder={language === "ar" ? "اسمك (اختياري)" : language === "hi" ? "आपका नाम (वैकल्पिक)" : "Your name (optional)"}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "شارك برأيك أو تجربتك حول هذا الموضوع..."
                    : language === "hi"
                    ? "इस विषय पर अपने विचार या करियर अनुभव साझा करें..."
                    : "Share your thoughts or career experience on this topic..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="rounded-xl bg-primary text-white font-bold text-xs sm:text-sm px-5 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmittingComment
                      ? (language === "ar" ? "جارٍ النشر..." : language === "hi" ? "प्रकाशित हो रहा है..." : "Posting...")
                      : (language === "ar" ? "إضافة تعليق" : language === "hi" ? "टिप्पणी जोड़ें" : "Post Comment")}
                  </span>
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Existing Comments List with Threaded Replies */}
          <div className="space-y-3">
            {comments.map((comm) => {
              const canEdit =
                (comm as any).can_edit ||
                (user && comm.author === user.name) ||
                (user && user.role === "candidate" && comm.author.includes("أحمد"))
              const isOwnerOrAdmin =
                user?.role === "admin" ||
                (user && user.role === post?.accountType) ||
                (user && post?.author?.username && user.email?.includes(post.author.username))
              const canDelete =
                (comm as any).can_delete || canEdit || isOwnerOrAdmin

              return (
                <GlassCard key={comm.id} className="p-4 sm:p-5 bg-card/30 border-white/5 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        comm.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                      }
                      alt={comm.author}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{comm.author}</span>
                          {comm.userType && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/10 text-slate-300">
                              {comm.userType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">{comm.time}</span>
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingCommentId(comm.id)
                                setEditText(comm.text || comm.content || "")
                              }}
                              className="p-1 rounded text-muted-foreground hover:text-sky-300"
                              title="Edit comment"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comm.id)}
                              className="p-1 rounded text-muted-foreground hover:text-rose-400"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {editingCommentId === comm.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 rounded-xl bg-black/40 border border-primary/40 text-white text-xs focus:outline-none resize-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCommentId(null)}
                              className="h-7 text-xs text-muted-foreground"
                            >
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(comm.id)}
                              disabled={isSubmittingEdit}
                              className="h-7 text-xs bg-primary text-white"
                            >
                              {language === "ar" ? "حفظ" : "Save"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                          {comm.text || comm.content}
                        </p>
                      )}

                      {/* Reply button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToId(replyingToId === comm.id ? null : comm.id)
                            setReplyText("")
                          }}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CornerDownLeft className="w-3 h-3" />
                          <span>{language === "ar" ? "رد" : "Reply"}</span>
                        </button>
                      </div>

                      {/* Inline Reply Box */}
                      {replyingToId === comm.id && (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-primary/20 space-y-2 mt-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={language === "ar" ? `رد على ${comm.author}...` : `Reply to ${comm.author}...`}
                            className="w-full p-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs focus:outline-none resize-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReplyingToId(null)}
                              className="h-7 text-xs text-muted-foreground"
                            >
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddReply(comm.id)}
                              disabled={isSubmittingReply || !replyText.trim()}
                              className="h-7 text-xs bg-primary text-white"
                            >
                              {language === "ar" ? "إرسال" : "Reply"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {comm.replies && comm.replies.length > 0 && (
                        <div className="ps-4 pt-2 space-y-2 border-s-2 border-primary/30 mt-2">
                          {comm.replies.map((reply) => {
                            const canEditReply =
                              (reply as any).can_edit ||
                              (user && reply.author === user.name)
                            const canDeleteReply =
                              (reply as any).can_delete || canEditReply || isOwnerOrAdmin

                            return (
                              <div key={reply.id} className="p-2.5 rounded-xl bg-white/5 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={reply.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                                      alt={reply.author}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-[11px] font-bold text-white">{reply.author}</span>
                                    <span className="text-[9px] text-muted-foreground">{reply.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {canEditReply && (
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(reply.id)
                                          setEditText(reply.text || reply.content || "")
                                        }}
                                        className="p-0.5 text-muted-foreground hover:text-sky-300"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                    )}
                                    {canDeleteReply && (
                                      <button
                                        onClick={() => handleDeleteComment(reply.id)}
                                        className="p-0.5 text-muted-foreground hover:text-rose-400"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-200">{reply.text || reply.content}</p>
                              </div>
                            )
                          })}
                        </div>
                      )}

                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* ── Related Articles ─────────────────────────────────────── */}
        {localizedRelated.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>
                  {language === "ar"
                    ? "مقالات ذات صلة قد تهمك"
                    : language === "hi"
                    ? "संबंधित लेख जो आपको पसंद आ सकते हैं"
                    : "Related Articles"}
                </span>
              </h3>
              <Link to="/posts" className="text-xs sm:text-sm text-primary font-bold hover:underline">
                {language === "ar" ? "تصفح الكل" : language === "hi" ? "सभी देखें" : "View All"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {localizedRelated.map((rel) => (
                <Link key={rel.id} to={`/posts/${rel.id}`} className="block group">
                  <GlassCard className="h-full p-4 bg-card/40 border-white/5 hover:border-primary/40 rounded-2xl flex flex-col justify-between transition-all group-hover:-translate-y-1">
                    <div className="space-y-3">
                      <div className="h-32 w-full rounded-xl overflow-hidden">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-primary block">{rel.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{rel.readTime}</span>
                      <ArrowIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Share / Repost Modal */}
      <CampaignShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        post={post}
        onShared={(_id, count) => {
          if (post) setPost({ ...post, sharesCount: count })
        }}
      />

      {/* Analytics Modal */}
      <CampaignAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        campaignId={post?.id || 0}
        campaignTitle={post?.title}
      />
    </div>
  )
}
export default PostDetailPage

