/**
 * features/companies/components/CompanySkeleton.tsx
 *
 * Shimmer skeleton loading state for company directory rows and company details.
 */
import { GlassCard } from "@/components/ui/glass-card"

export function CompanyRowSkeleton() {
  return (
    <GlassCard className="p-5 sm:p-6 bg-card/40 border-white/5 animate-pulse text-start">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 sm:gap-5 w-full md:w-auto flex-1">
          {/* Avatar Skeleton */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 shrink-0" />

          {/* Lines Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-20 h-5 rounded-full bg-white/10" />
              <div className="w-24 h-5 rounded-full bg-white/10" />
            </div>
            <div className="w-48 sm:w-64 h-7 rounded-xl bg-white/10" />
            <div className="w-32 h-4 rounded-lg bg-white/10" />
            <div className="w-full sm:w-3/4 h-4 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="w-full md:w-32 h-10 rounded-xl bg-white/10 shrink-0" />
      </div>
    </GlassCard>
  )
}

export function CompanyDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-start">
      {/* Header Skeleton */}
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

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-32 h-6 rounded-lg bg-white/10" />
            <div className="w-full h-4 rounded-lg bg-white/5" />
            <div className="w-5/6 h-4 rounded-lg bg-white/5" />
            <div className="w-4/6 h-4 rounded-lg bg-white/5" />
          </GlassCard>

          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-40 h-6 rounded-lg bg-white/10" />
            <div className="w-full h-24 rounded-xl bg-white/5" />
          </GlassCard>
        </div>

        <div className="lg:col-span-4">
          <GlassCard className="p-6 bg-card/40 border-white/5 space-y-4">
            <div className="w-36 h-6 rounded-lg bg-white/10" />
            <div className="space-y-3">
              <div className="w-full h-10 rounded-xl bg-white/5" />
              <div className="w-full h-10 rounded-xl bg-white/5" />
              <div className="w-full h-10 rounded-xl bg-white/5" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
