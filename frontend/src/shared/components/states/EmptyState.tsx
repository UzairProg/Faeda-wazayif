/**
 * shared/components/states/EmptyState.tsx
 * Reusable empty state — used when a list has no results.
 */
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { SearchX } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title = "لا توجد نتائج",
  description = "لم يتم العثور على أي نتائج تطابق معايير البحث.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold font-heading text-white mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
