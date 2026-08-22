/**
 * features/chat/components/MessageBubble.tsx
 *
 * Renders individual chat message bubble with sender avatar, read status, edit & delete options.
 */
import React, { useState } from "react"
import { Check, CheckCheck, Edit2, Trash2, X } from "lucide-react"
import { useTranslation } from "@/i18n"
import type { ChatMessage } from "../types/chat.types"

interface MessageBubbleProps {
  message: ChatMessage
  onEdit?: (messageId: number, newBody: string) => Promise<void>
  onDelete?: (messageId: number) => Promise<void>
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  onDelete,
}) => {
  const { t, isRTL } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(message.body)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOwn = message.isOwn
  const isDeleted = message.isDeleted

  // Format message time
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString(isRTL ? "ar-SA" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }

  const handleSaveEdit = async () => {
    if (!editBody.trim() || editBody === message.body || !onEdit) return
    setIsSubmitting(true)
    try {
      await onEdit(message.id, editBody)
      setIsEditing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (window.confirm(t("chat.message.deleteConfirm"))) {
      await onDelete(message.id)
    }
  }

  return (
    <div
      className={`group flex items-end gap-2.5 my-2.5 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar for counterpart */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-full h-full object-cover"
            />
          ) : (
            message.senderName.charAt(0)
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl p-3.5 shadow-sm transition-all ${
          isOwn
            ? "bg-emerald-600 text-white rounded-br-none dark:bg-emerald-600"
            : "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/60"
        } ${isDeleted ? "italic opacity-70" : ""}`}
      >
        {/* Sender Name if in group/team */}
        {!isOwn && (
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {message.senderName}
          </div>
        )}

        {/* Message Content or Inline Edit */}
        {isEditing ? (
          <div className="space-y-2 min-w-[240px]">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full p-2 text-sm rounded-lg bg-white/20 dark:bg-slate-900/60 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
              rows={2}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white"
                title={t("chat.message.cancel")}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="px-2.5 py-1 text-xs rounded bg-white text-emerald-700 font-bold hover:bg-emerald-50 shadow-sm"
              >
                {t("chat.message.save")}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.body}
          </div>
        )}

        {/* Footer info: time, edited tag, read check */}
        <div
          className={`flex items-center gap-1.5 mt-1.5 text-[10px] ${
            isOwn ? "text-emerald-100 justify-end" : "text-slate-400 justify-end"
          }`}
        >
          {message.editedAt && !isDeleted && (
            <span className="opacity-80">({t("chat.message.edited")})</span>
          )}
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && !isDeleted && (
            <span className="inline-flex items-center">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-200/70" />
              )}
            </span>
          )}
        </div>

        {/* Hover action menu for sender */}
        {isOwn && !isDeleted && !isEditing && (
          <div className="absolute top-1 -left-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700"
              title={t("chat.message.edit")}
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700"
              title={t("chat.message.delete")}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
