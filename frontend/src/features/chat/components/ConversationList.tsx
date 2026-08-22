/**
 * features/chat/components/ConversationList.tsx
 *
 * Searchable conversation directory with category tabs and live filtering.
 */
import React, { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { useTranslation } from "@/i18n"
import { ConversationItem } from "./ConversationItem"
import { ConversationListSkeleton } from "./ChatSkeleton"
import { EmptyConversationState } from "./EmptyConversationState"
import type { ConversationSummary } from "../types/chat.types"

interface ConversationListProps {
  conversations: ConversationSummary[]
  activeId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
}

type TabType = "all" | "applications" | "teams" | "direct"

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  isLoading,
}) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<TabType>("all")

  // Filter conversations by tab and search text
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Tab filter
      if (activeTab === "applications") {
        if (c.type !== "CANDIDATE_COMPANY") return false
      } else if (activeTab === "teams") {
        if (c.type !== "TEAM_INTERNAL" && c.type !== "TEAM_COMPANY") return false
      } else if (activeTab === "direct") {
        if (c.type !== "DIRECT") return false
      }

      // Search query filter
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      const matchName = c.counterpart.name.toLowerCase().includes(q)
      const matchSubject = (c.subject || "").toLowerCase().includes(q)
      const matchLastMsg = (c.lastMessage?.body || "").toLowerCase().includes(q)
      return matchName || matchSubject || matchLastMsg
    })
  }, [conversations, activeTab, searchQuery])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-e border-slate-200 dark:border-slate-800">
      {/* Search Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("chat.searchPlaceholder")}
            className="w-full ps-9 pe-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            {t("chat.tabs.all")}
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center whitespace-nowrap ${
              activeTab === "applications"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            {t("chat.tabs.applications")}
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center whitespace-nowrap ${
              activeTab === "teams"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            {t("chat.tabs.teams")}
          </button>
        </div>
      </div>

      {/* Conversations Scroll Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : filteredConversations.length === 0 ? (
          searchQuery ? (
            <EmptyConversationState type="no_results" />
          ) : (
            <EmptyConversationState type="no_conversations" />
          )
        ) : (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeId === conv.id}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
