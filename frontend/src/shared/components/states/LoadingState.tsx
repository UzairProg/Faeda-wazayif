/**
 * shared/components/states/LoadingState.tsx
 * Reusable loading skeleton for list/page states.
 */
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  count?: number
  className?: string
  variant?: "cards" | "page" | "spinner"
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card/40 border border-white/5 p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-white/10 rounded-md w-3/4" />
          <div className="h-4 bg-white/5 rounded-md w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-white/5 rounded-full w-20" />
        <div className="h-6 bg-white/5 rounded-full w-24" />
        <div className="h-6 bg-white/5 rounded-full w-16" />
      </div>
      <div className="h-px bg-white/5 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-white/5 rounded-md w-24" />
        <div className="h-9 bg-white/10 rounded-full w-24" />
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
    </div>
  )
}

export function LoadingState({ count = 3, className, variant = "cards" }: LoadingStateProps) {
  if (variant === "spinner") return <Spinner />
  if (variant === "page") {
    return (
      <div className={cn("space-y-4 animate-pulse", className)}>
        <div className="h-10 bg-white/10 rounded-xl w-1/2 mb-2" />
        <div className="h-5 bg-white/5 rounded-md w-1/3" />
        <div className="h-px bg-white/5 my-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-white/5 rounded-md" style={{ width: `${85 - i * 10}%` }} />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
