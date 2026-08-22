/**
 * features/chat/pages/ChatPage.tsx
 *
 * Professional Chat workspace supporting Candidate, Company, and Team communication.
 * Responsive two-pane master-detail view with deep link orchestration.
 */
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { MessageSquare, ShieldCheck } from "lucide-react"
import { useTranslation } from "@/i18n"
import { useConversations, useChatActions } from "../hooks/useChat"
import { ConversationList } from "../components/ConversationList"
import { ChatWindow } from "../components/ChatWindow"
import type { ConversationType } from "../types/chat.types"

export function ChatPage() {
  const { t, isRTL } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: conversations = [], isLoading } = useConversations()
  const { createConversation } = useChatActions()

  const [activeConvId, setActiveConvId] = useState<number | null>(null)
  const [isMobileWindowOpen, setIsMobileWindowOpen] = useState(false)

  // Handle URL query parameters for deep linking
  useEffect(() => {
    const convIdParam = searchParams.get("conversationId")
    if (convIdParam && Number(convIdParam) > 0) {
      setActiveConvId(Number(convIdParam))
      setIsMobileWindowOpen(true)
      return
    }

    // Handle "new conversation" deep link trigger
    const isNew = searchParams.get("new")
    const targetType = searchParams.get("type") as ConversationType | null
    const targetId = searchParams.get("targetId")
    const contextType = searchParams.get("contextType") || "direct"
    const contextId = searchParams.get("contextId") || ""
    const subject = searchParams.get("subject") || ""

    if (isNew === "true" && targetType && targetId) {
      createConversation({
        type: targetType,
        targetId: Number(targetId),
        contextType,
        contextId,
        subject,
      }).then((res) => {
        if (res?.conversation?.id) {
          setActiveConvId(res.conversation.id)
          setIsMobileWindowOpen(true)
          // Clean URL params to standard conversation link
          setSearchParams({ conversationId: String(res.conversation.id) })
        }
      })
    }
  }, [searchParams, createConversation, setSearchParams])

  // Select conversation
  const handleSelectConversation = (id: number) => {
    setActiveConvId(id)
    setIsMobileWindowOpen(true)
    setSearchParams({ conversationId: String(id) })
  }

  // Back to list on mobile
  const handleMobileBack = () => {
    setIsMobileWindowOpen(false)
    setSearchParams({})
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t("chat.title")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t("chat.subtitle")}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{isRTL ? "مراسلات مشفرة وآمنة" : "Encrypted & Secure Messages"}</span>
        </div>
      </div>

      {/* Main Split-Pane Shell */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex h-[calc(100vh-210px)] min-h-[500px]">
        {/* Left Pane: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
            isMobileWindowOpen ? "hidden md:block" : "block"
          }`}
        >
          <ConversationList
            conversations={conversations}
            activeId={activeConvId}
            onSelect={handleSelectConversation}
            isLoading={isLoading}
          />
        </div>

        {/* Right Pane: Active Chat Window */}
        <div
          className={`flex-1 h-full ${
            !isMobileWindowOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatWindow
            conversationId={activeConvId}
            onBack={handleMobileBack}
          />
        </div>
      </div>
    </div>
  )
}
