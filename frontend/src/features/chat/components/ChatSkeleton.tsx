/**
 * features/chat/components/ChatSkeleton.tsx
 *
 * Shimmer skeletons for loading state in conversation list and message stream.
 */
import React from "react"

export const ConversationListSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700/60 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-12" />
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-2/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const MessageStreamSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-4 animate-pulse flex-1 overflow-y-auto">
      <div className="flex justify-start">
        <div className="w-2/3 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tr-none" />
      </div>
      <div className="flex justify-end">
        <div className="w-1/2 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl rounded-tl-none" />
      </div>
      <div className="flex justify-start">
        <div className="w-3/4 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tr-none" />
      </div>
      <div className="flex justify-end">
        <div className="w-2/5 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl rounded-tl-none" />
      </div>
    </div>
  )
}
