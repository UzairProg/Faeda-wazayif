/**
 * shared/components/states/ErrorState.tsx
 * Reusable error state — used when a request fails.
 */
import { cn } from "@/lib/utils"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "حدث خطأ",
  description = "تعذر تحميل البيانات. يرجى المحاولة مرة أخرى.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-danger" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold font-heading text-white mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <RefreshCcw className="w-4 h-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}
