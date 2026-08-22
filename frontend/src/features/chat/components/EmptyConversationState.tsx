/**
 * features/chat/components/EmptyConversationState.tsx
 *
 * Visual empty states for conversation list and unselected chat screen.
 */
import React from "react"
import { MessageSquare, ShieldCheck, Sparkles } from "lucide-react"
import { useTranslation } from "@/i18n"

interface EmptyConversationStateProps {
  type: "no_conversations" | "select_prompt" | "no_results"
  onStartNew?: () => void
}

export const EmptyConversationState: React.FC<EmptyConversationStateProps> = ({
  type,
}) => {
  const { t } = useTranslation()

  if (type === "select_prompt") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 ring-8 ring-emerald-50 dark:ring-emerald-950/40">
          <MessageSquare className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t("chat.empty.selectPromptTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
          {t("chat.empty.selectPromptDesc")}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>تواصل آمن وموثق ضمن بيئة منصة فائدة</span>
        </div>
      </div>
    )
  }

  if (type === "no_results") {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t("chat.empty.noSearchResults")}
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 ring-4 ring-emerald-100 dark:ring-emerald-900/20">
        <Sparkles className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">
        {t("chat.empty.noConversationsTitle")}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        {t("chat.empty.noConversationsDesc")}
      </p>
    </div>
  )
}
