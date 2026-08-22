/**
 * features/chat/components/UnreadBadge.tsx
 *
 * Polished animated badge for unread message counts in sidebar/navbar/conversation items.
 */
import React from "react"

interface UnreadBadgeProps {
  count?: number
  size?: "sm" | "md"
  className?: string
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  size = "md",
  className = "",
}) => {
  if (!count || count <= 0) return null

  const displayCount = count > 99 ? "99+" : count
  const sizeClasses =
    size === "sm"
      ? "min-w-[18px] h-[18px] text-[10px] px-1"
      : "min-w-[22px] h-[22px] text-xs px-1.5"

  return (
    <span
      className={`inline-flex items-center justify-center font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-sm ring-2 ring-white/20 animate-pulse ${sizeClasses} ${className}`}
      dir="ltr"
    >
      {displayCount}
    </span>
  )
}
