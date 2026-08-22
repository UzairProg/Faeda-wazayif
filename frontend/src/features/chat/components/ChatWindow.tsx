/**
 * features/chat/components/ChatWindow.tsx
 *
 * Active chat window containing conversation header, date-separated message stream, and message composer.
 */
import React, { useEffect, useRef } from "react"
import { useConversation, useChatActions } from "../hooks/useChat"
import { ChatHeader } from "./ChatHeader"
import { MessageBubble } from "./MessageBubble"
import { MessageComposer } from "./MessageComposer"
import { MessageStreamSkeleton } from "./ChatSkeleton"
import { EmptyConversationState } from "./EmptyConversationState"
import { useTranslation } from "@/i18n"

interface ChatWindowProps {
  conversationId: number | null
  onBack?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  onBack,
}) => {
  const { isRTL } = useTranslation()
  const { data, isLoading } = useConversation(conversationId)
  const { sendMessage, editMessage, deleteMessage, markAsRead } = useChatActions()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = data?.conversation
  const messages = data?.messages || []

  // Auto-mark conversation as read when active
  useEffect(() => {
    if (conversationId && conversation && conversation.unreadCount > 0) {
      markAsRead(conversationId)
    }
  }, [conversationId, conversation?.unreadCount, markAsRead])

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  if (!conversationId) {
    return <EmptyConversationState type="select_prompt" />
  }

  if (isLoading && !conversation) {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/40">
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />
        <MessageStreamSkeleton />
      </div>
    )
  }

  if (!conversation) {
    return <EmptyConversationState type="select_prompt" />
  }

  // Handle message sending
  const handleSendMessage = async (body: string) => {
    await sendMessage({
      convId: conversationId,
      payload: { body, messageType: "text" },
    })
  }

  // Handle message edit
  const handleEditMessage = async (msgId: number, newBody: string) => {
    await editMessage({
      msgId,
      body: newBody,
      convId: conversationId,
    })
  }

  // Handle message soft-delete
  const handleDeleteMessage = async (msgId: number) => {
    await deleteMessage({
      msgId,
      convId: conversationId,
    })
  }

  // Group messages by date
  const renderMessagesWithDates = () => {
    let lastDate = ""

    return messages.map((msg) => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString(
        isRTL ? "ar-SA" : "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )

      const showDateDivider = msgDate !== lastDate
      lastDate = msgDate

      return (
        <React.Fragment key={msg.id}>
          {showDateDivider && (
            <div className="flex items-center justify-center my-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-xs border border-slate-300/40 dark:border-slate-700/60">
                {msgDate}
              </span>
            </div>
          )}
          <MessageBubble
            message={msg}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        </React.Fragment>
      )
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/60 dark:bg-slate-900/30 overflow-hidden">
      {/* Header */}
      <ChatHeader conversation={conversation} onBack={onBack} />

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 bg-white/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 max-w-sm">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                هذه بداية المحادثة المهنية المباشرة. أرسل رسالة للبدء.
              </p>
            </div>
          </div>
        ) : (
          renderMessagesWithDates()
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <MessageComposer onSendMessage={handleSendMessage} />
    </div>
  )
}
