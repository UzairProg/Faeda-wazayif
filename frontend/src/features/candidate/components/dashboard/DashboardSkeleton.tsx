/**
 * DashboardSkeleton.tsx — Structured loading skeleton for Career Command Center.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading dashboard">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3 w-full max-w-lg">
          <div className="h-7 w-48 bg-slate-800 rounded-xl" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-lg" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="h-10 w-32 bg-slate-800 rounded-xl" />
          <div className="h-10 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Main 2-column grid: Profile Health & Market Value */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
          <div className="h-6 w-40 bg-slate-800 rounded-lg" />
          <div className="h-4 w-full bg-slate-800/50 rounded-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="h-16 bg-slate-800/60 rounded-2xl" />
            <div className="h-16 bg-slate-800/60 rounded-2xl" />
            <div className="h-16 bg-slate-800/60 rounded-2xl" />
            <div className="h-16 bg-slate-800/60 rounded-2xl" />
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-12 w-56 bg-slate-800/80 rounded-2xl" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-800/40 rounded" />
            <div className="h-4 w-3/4 bg-slate-800/40 rounded" />
          </div>
        </div>
      </div>

      {/* Next Actions Skeleton */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-800/50 rounded-2xl" />
          <div className="h-32 bg-slate-800/50 rounded-2xl" />
          <div className="h-32 bg-slate-800/50 rounded-2xl" />
        </div>
      </div>

      {/* Recommended Jobs Skeleton */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-4">
        <div className="h-6 w-44 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-slate-800/50 rounded-2xl" />
          <div className="h-36 bg-slate-800/50 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
