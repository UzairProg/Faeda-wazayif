/**
 * features/chat/components/ChatHeader.tsx
 *
 * Header bar for active conversation showing counterpart identity, role badge, and contextual navigation.
 */
import React from "react"
import { Link } from "react-router-dom"
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  User,
  ExternalLink,
  Briefcase,
  ShieldCheck,
} from "lucide-react"
import { useTranslation } from "@/i18n"
import { ROUTES } from "@/config/routes"
import type { ConversationSummary } from "../types/chat.types"

interface ChatHeaderProps {
  conversation: ConversationSummary
  onBack?: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
}) => {
  const { t, isRTL } = useTranslation()
  const counterpart = conversation.counterpart

  // Resolve contextual link if applicable
  const getContextLink = () => {
    if (!conversation.context.id) return null
    if (conversation.context.type === "job_application") {
      return {
        to: ROUTES.CANDIDATE.APPLICATION_DETAIL(conversation.context.id),
        label: t("chat.actions.viewApplication"),
        icon: Briefcase,
      }
    }
    if (conversation.context.type === "team" || counterpart.type === "team") {
      return {
        to: ROUTES.TEAMS.DETAIL(String(counterpart.id || conversation.context.id)),
        label: t("chat.actions.viewTeam"),
        icon: Users,
      }
    }
    if (counterpart.type === "company") {
      return {
        to: ROUTES.COMPANIES.DETAIL(String(counterpart.id)),
        label: "ملف المنشأة",
        icon: Building2,
      }
    }
    return null
  }

  const contextLink = getContextLink()

  return (
    <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 -mr-1 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isRTL ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden font-bold text-slate-600 dark:text-slate-300">
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
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        {/* Counterpart details */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-[320px]">
              {counterpart.name}
            </h3>
            {counterpart.badge && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                <span>{isRTL ? counterpart.badge : counterpart.badgeEn || counterpart.badge}</span>
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-[400px]">
            {conversation.subject}
          </div>
        </div>
      </div>

      {/* Action deep links */}
      {contextLink && (
        <Link
          to={contextLink.to}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/80 dark:border-slate-700/80"
        >
          <contextLink.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{contextLink.label}</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>
      )}
    </div>
  )
}
