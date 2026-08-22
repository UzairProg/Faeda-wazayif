/**
 * features/chat/components/ConversationItem.tsx
 *
 * Conversation item card in the chat list.
 */
import React from "react"
import { Building2, Users, User, Check, CheckCheck } from "lucide-react"
import { useTranslation } from "@/i18n"
import { UnreadBadge } from "./UnreadBadge"
import type { ConversationSummary } from "../types/chat.types"

interface ConversationItemProps {
  conversation: ConversationSummary
  isActive: boolean
  onClick: () => void
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const { t, isRTL } = useTranslation()
  const counterpart = conversation.counterpart
  const lastMsg = conversation.lastMessage

  // Format relative timestamp
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ""
    try {
      const d = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffMin = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMin / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMin < 2) return t("chat.time.justNow")
      if (diffMin < 60) return t("chat.time.minutesAgo", { count: diffMin })
      if (diffHours < 24) return t("chat.time.hoursAgo", { count: diffHours })
      if (diffDays === 1) return t("chat.time.yesterday")
      return d.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
      })
    } catch {
      return ""
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-start p-3.5 sm:p-4 flex items-start gap-3 transition-all border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 relative ${
        isActive
          ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-emerald-600"
          : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0 mt-0.5">
        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center overflow-hidden font-bold text-slate-600 dark:text-slate-300">
          {counterpart.avatar ? (
            <img
              src={counterpart.avatar}
              alt={counterpart.name}
              className="w-full h-full object-cover"
            />
          ) : counterpart.type === "company" ? (
            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : counterpart.type === "team" ? (
            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          ) : (
            <User className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4
            className={`text-sm font-bold truncate ${
              conversation.unreadCount > 0
                ? "text-slate-900 dark:text-white font-extrabold"
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {counterpart.name}
          </h4>
          <span className="text-[11px] text-slate-400 shrink-0">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        {/* Subject or context tag */}
        <div className="text-xs text-emerald-700 dark:text-emerald-400/90 font-medium truncate mb-1">
          {conversation.subject}
        </div>

        {/* Latest message snippet & Unread count badge */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate flex items-center gap-1 ${
              conversation.unreadCount > 0
                ? "text-slate-900 dark:text-slate-100 font-semibold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {lastMsg?.isOwn && (
              <span className="shrink-0 text-slate-400">
                {lastMsg.isRead ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
            <span className="truncate">
              {lastMsg?.isDeleted
                ? t("chat.message.deleted")
                : lastMsg?.body || "بدء محادثة جديدة..."}
            </span>
          </p>

          <UnreadBadge count={conversation.unreadCount} size="sm" />
        </div>
      </div>
    </button>
  )
}
