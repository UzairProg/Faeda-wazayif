/**
 * features/teams/components/TeamSkeleton.tsx
 *
 * Shimmer skeleton loading state for team directory rows, live preview, and detail views.
 */
import { GlassCard } from "@/components/ui/glass-card"

export function TeamRowSkeleton() {
  return (
    <GlassCard className="p-5 sm:p-6 bg-card/40 border-white/5 animate-pulse text-start">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4 sm:gap-5 w-full sm:w-auto flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-20 h-5 rounded-full bg-white/10" />
              <div className="w-28 h-5 rounded-full bg-white/10" />
            </div>
            <div className="w-48 sm:w-64 h-7 rounded-xl bg-white/10" />
            <div className="w-32 h-4 rounded-lg bg-white/10" />
            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-16 h-5 rounded-lg bg-white/10" />
              <div className="w-16 h-5 rounded-lg bg-white/10" />
              <div className="w-16 h-5 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-32 h-10 rounded-xl bg-white/10 shrink-0" />
      </div>
    </GlassCard>
  )
}

export function TeamDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-start">
      <GlassCard className="p-8 bg-card/40 border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 shrink-0" />
            <div className="space-y-3">
              <div className="w-24 h-5 rounded-full bg-white/10" />
              <div className="w-56 h-8 rounded-xl bg-white/10" />
              <div className="w-36 h-4 rounded-lg bg-white/10" />
            </div>
          </div>
          <div className="w-36 h-11 rounded-xl bg-white/10 shrink-0" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-32 h-6 rounded-lg bg-white/10" />
            <div className="w-full h-4 rounded-lg bg-white/5" />
            <div className="w-5/6 h-4 rounded-lg bg-white/5" />
          </GlassCard>

          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-40 h-6 rounded-lg bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-20 rounded-xl bg-white/5" />
              <div className="h-20 rounded-xl bg-white/5" />
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-36 h-6 rounded-lg bg-white/10" />
            <div className="space-y-3">
              <div className="w-full h-10 rounded-xl bg-white/5" />
              <div className="w-full h-10 rounded-xl bg-white/5" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
