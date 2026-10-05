/**
 * features/public/components/CampaignCommentsModal.tsx
 *
 * Full Interactive Comment Section & Threaded Replies Modal.
 * Supports:
 * - Threaded nested replies (`parent_id`)
 * - Editing own comments (`postsService.editComment`)
 * - Deleting own comments or moderation by campaign owner/admin (`postsService.deleteComment`)
 * - Posting new comments and replying to existing comments
 * - Real-time count update
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  MessageSquare,
  Send,
  CornerDownLeft,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import type { PostComment, PostArticle } from "../types/posts.types"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import toast from "react-hot-toast"

interface CampaignCommentsModalProps {
  isOpen: boolean
  onClose: () => void
  post: PostArticle | null
  onCommentsUpdated?: (postId: number, count: number) => void
}

export function CampaignCommentsModal({
  isOpen,
  onClose,
  post,
  onCommentsUpdated,
}: CampaignCommentsModalProps) {
  const { language } = useTranslation()
  const { user } = useAuthStore()

  const [comments, setComments] = useState<PostComment[]>(post?.comments || [])
  const [newCommentText, setNewCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reply state
  const [replyingToId, setReplyingToId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  if (!isOpen || !post) return null

  const authorName =
    user?.name || (language === "ar" ? "مستخدم فائدة" : "Faeda Member")

  // Handle adding top-level comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await postsService.addComment(post.id, newCommentText.trim(), authorName)
      const updated = [...comments, res.comment]
      setComments(updated)
      setNewCommentText("")
      toast.success(
        language === "ar" ? "تمت إضافة تعليقك بنجاح!" : "Comment posted successfully!"
      )
      if (onCommentsUpdated) {
        onCommentsUpdated(post.id, res.commentsCount || updated.length)
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          (language === "ar" ? "تعذر إضافة التعليق" : "Failed to post comment")
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding reply to a comment
  const handleAddReply = async (parentId: number) => {
    if (!replyText.trim() || isSubmittingReply) return

    setIsSubmittingReply(true)
    try {
      const res = await postsService.addComment(
        post.id,
        replyText.trim(),
        authorName,
        parentId
      )
      // Attach reply under parent comment
      const updated = comments.map((comm) => {
        if (comm.id === parentId) {
          return {
            ...comm,
            replies: [...(comm.replies || []), res.comment],
          }
        }
        return comm
      })
      setComments(updated)
      setReplyText("")
      setReplyingToId(null)
      toast.success(language === "ar" ? "تم إرسال ردك بنجاح!" : "Reply submitted!")
      if (onCommentsUpdated) {
        onCommentsUpdated(post.id, res.commentsCount || updated.length)
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          (language === "ar" ? "تعذر إرسال الرد" : "Failed to post reply")
      )
    } finally {
      setIsSubmittingReply(false)
    }
  }

  // Handle editing a comment
  const handleSaveEdit = async (commentId: number) => {
    if (!editText.trim() || isSubmittingEdit) return

    setIsSubmittingEdit(true)
    try {
      const res = await postsService.editComment(commentId, editText.trim())
      const updated = comments.map((comm) => {
        if (comm.id === commentId) {
          return { ...comm, text: res.comment.text, content: res.comment.text }
        }
        if (comm.replies) {
          return {
            ...comm,
            replies: comm.replies.map((r) =>
              r.id === commentId
                ? { ...r, text: res.comment.text, content: res.comment.text }
                : r
            ),
          }
        }
        return comm
      })
      setComments(updated)
      setEditingCommentId(null)
      setEditText("")
      toast.success(language === "ar" ? "تم تعديل التعليق بنجاح" : "Comment edited")
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          (language === "ar" ? "تعذر تعديل التعليق" : "Failed to edit comment")
      )
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  // Handle deleting a comment (moderation or self-delete)
  const handleDeleteComment = async (commentId: number) => {
    const confirmMsg =
      language === "ar"
        ? "هل أنت متأكد من رغبتك في حذف هذا التعليق؟"
        : "Are you sure you want to delete this comment?"
    if (!window.confirm(confirmMsg)) return

    try {
      const res = await postsService.deleteComment(commentId)
      const updated = comments
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : [],
        }))
      setComments(updated)
      toast.success(
        language === "ar" ? "تم حذف التعليق بنجاح" : "Comment deleted successfully"
      )
      if (onCommentsUpdated) {
        onCommentsUpdated(post.id, res.commentsCount !== undefined ? res.commentsCount : updated.length)
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          (language === "ar" ? "تعذر حذف التعليق" : "Failed to delete comment")
      )
    }
  }

  // Check if current user is campaign owner or admin
  const isOwnerOrAdmin =
    user?.role === "admin" ||
    (user && user.role === post.accountType) ||
    (user && post.author?.username && user.email?.includes(post.author.username))

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
          <GlassCard className="relative p-6 sm:p-7 bg-card/95 border-white/15 rounded-3xl shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 end-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  {language === "ar"
                    ? `التعليقات والمناقشات (${comments.length})`
                    : `Comments & Discussion (${comments.length})`}
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-md">
                  {post.title}
                </p>
              </div>
            </div>

            {/* Comments List (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[45vh]">
              {comments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs">
                    {language === "ar"
                      ? "لا توجد تعليقات بعد. كن أول من يشارك برأيه!"
                      : "No comments yet. Be the first to share your thoughts!"}
                  </p>
                </div>
              ) : (
                comments.map((comm) => {
                  const canEdit =
                    (comm as any).can_edit ||
                    (user && comm.author === user.name) ||
                    (user && user.role === "candidate" && comm.author.includes("أحمد"))
                  const canDelete =
                    (comm as any).can_delete || canEdit || isOwnerOrAdmin

                  return (
                    <div
                      key={comm.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              comm.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                            }
                            alt={comm.author}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">
                                {comm.author}
                              </span>
                              {comm.userType && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-slate-300">
                                  {comm.userType}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground block">
                              {comm.time}
                            </span>
                          </div>
                        </div>

                        {/* Comment Action Icons */}
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingCommentId(comm.id)
                                setEditText(comm.text || comm.content || "")
                              }}
                              className="p-1 rounded-lg text-muted-foreground hover:text-sky-300 hover:bg-white/10 transition-colors"
                              title="Edit comment"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comm.id)}
                              className="p-1 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-white/10 transition-colors"
                              title={
                                isOwnerOrAdmin && !canEdit
                                  ? "Moderate / Delete comment"
                                  : "Delete comment"
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content or Edit Form */}
                      {editingCommentId === comm.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-primary/40 text-white text-xs focus:outline-none resize-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCommentId(null)}
                              className="h-7 text-xs rounded-lg text-muted-foreground"
                            >
                              <RotateCcw className="w-3 h-3 me-1" />
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(comm.id)}
                              disabled={isSubmittingEdit}
                              className="h-7 text-xs rounded-lg bg-primary text-white"
                            >
                              <Check className="w-3 h-3 me-1" />
                              {language === "ar" ? "حفظ التعديل" : "Save"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                          {comm.text || comm.content}
                        </p>
                      )}

                      {/* Reply button */}
                      <div className="pt-1 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingToId(replyingToId === comm.id ? null : comm.id)
                            setReplyText("")
                          }}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CornerDownLeft className="w-3 h-3" />
                          <span>{language === "ar" ? "رد على التعليق" : "Reply"}</span>
                        </button>
                      </div>

                      {/* Inline Reply Input */}
                      {replyingToId === comm.id && (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-primary/20 space-y-2 mt-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={
                              language === "ar"
                                ? `اكتب ردك على ${comm.author}...`
                                : `Write your reply to ${comm.author}...`
                            }
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
                              <Send className="w-3 h-3 me-1" />
                              {language === "ar" ? "إرسال الرد" : "Reply"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies List */}
                      {comm.replies && comm.replies.length > 0 && (
                        <div className="ps-4 sm:ps-6 pt-2 space-y-2 border-s-2 border-primary/30 mt-2">
                          {comm.replies.map((reply) => {
                            const canEditReply =
                              (reply as any).can_edit ||
                              (user && reply.author === user.name)
                            const canDeleteReply =
                              (reply as any).can_delete || canEditReply || isOwnerOrAdmin

                            return (
                              <div
                                key={reply.id}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={
                                        reply.avatar ||
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                      }
                                      alt={reply.author}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-[11px] font-bold text-white">
                                      {reply.author}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">
                                      {reply.time}
                                    </span>
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
                                <p className="text-xs text-slate-200">
                                  {reply.text || reply.content}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Bottom Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "أضف تعليقك على هذه الحملة..."
                      : "Write a comment on this campaign..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-all"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !newCommentText.trim()}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {language === "ar" ? "نشر" : "Post"}
                  </span>
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
