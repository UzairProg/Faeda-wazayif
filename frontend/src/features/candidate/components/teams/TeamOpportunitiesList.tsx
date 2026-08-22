import React from "react"
import { Link } from "react-router-dom"
import { Briefcase, Building2, MapPin, ChevronLeft, DollarSign } from "lucide-react"
import { ROUTES } from "@/config/routes"

interface TeamOpportunitiesListProps {
  opportunities: any[]
  isRtl?: boolean
}

export const TeamOpportunitiesList: React.FC<TeamOpportunitiesListProps> = ({
  opportunities,
  isRtl = true,
}) => {
  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-8 text-center backdrop-blur-md">
        <Briefcase className="mx-auto h-10 w-10 text-slate-600" />
        <h4 className="mt-3 text-sm font-bold text-white">
          {isRtl ? "لا توجد فرص متطابقة حالياً" : "No matching opportunities yet"}
        </h4>
        <p className="mt-1 text-xs text-slate-400">
          {isRtl
            ? "سيتم عرض الفرص والمشاريع التي تتوافق مع قدرات فريقكم هنا تلقائياً عند اعتمادها."
            : "Opportunities matching your team capabilities will appear here."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3.5 sm:grid-cols-1 md:grid-cols-2">
        {opportunities.map((job) => (
          <div
            key={job.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-5 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-emerald-500/40"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800 font-bold text-white shadow-inner">
                    {job.company?.logoUrl ? (
                      <img
                        src={job.company.logoUrl}
                        alt={job.company.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="line-clamp-1 font-bold text-white transition-colors group-hover:text-emerald-400">
                      {job.title}
                    </h4>
                    <p className="text-xs text-slate-400">{job.company?.name}</p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  {isRtl ? "ملائم للفريق" : "Team Friendly"}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary?.isDisclosed && (
                  <div className="flex items-center gap-1 font-medium text-emerald-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>
                      {job.salary.min} - {job.salary.max} {job.salary.currency}
                    </span>
                  </div>
                )}
              </div>

              {/* Skills preview */}
              {job.skills && job.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {job.skills.slice(0, 4).map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">
              <span className="text-xs text-slate-500">
                {isRtl ? "تقديم كفريق عمل متكامل" : "Apply as a team"}
              </span>

              <Link
                to={ROUTES.CANDIDATE.JOB_DETAIL(job.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>{isRtl ? "عرض تفاصيل الفرصة" : "View Job Detail"}</span>
                <ChevronLeft className={`h-3.5 w-3.5 ${!isRtl ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
