import React from "react"
import { Briefcase, Users, UserCheck, Clock, CheckCircle2, Layers } from "lucide-react"
import type { CompanyStats } from "../types/company.types"

interface CompanyStatsGridProps {
  stats?: CompanyStats
  isRtl?: boolean
}

export const CompanyStatsGrid: React.FC<CompanyStatsGridProps> = ({
  stats,
  isRtl = true,
}) => {
  if (!stats) return null

  const cards = [
    {
      title: isRtl ? "الوظائف المفتوحة" : "Active Jobs",
      value: stats.activeJobs,
      sub: isRtl ? `من أصل ${stats.totalJobs} وظيفة` : `out of ${stats.totalJobs} total`,
      icon: Briefcase,
      color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400",
    },
    {
      title: isRtl ? "إجمالي المتقدمين" : "Total Applicants",
      value: stats.totalApplicants,
      sub: isRtl ? "طلبات تقديم مسجلة" : "registered submissions",
      icon: Users,
      color: "from-sky-600/20 to-blue-600/20 border-sky-500/30 text-sky-400",
    },
    {
      title: isRtl ? "قيد المراجعة" : "Under Review",
      value: stats.underReview,
      sub: isRtl ? "بانتظار الفرز الأولي" : "awaiting initial review",
      icon: Clock,
      color: "from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400",
    },
    {
      title: isRtl ? "المرشحون للمقابلة" : "Shortlisted",
      value: stats.shortlisted + stats.interview,
      sub: isRtl ? "مرحلة التقييم المتقدم" : "in interview stage",
      icon: UserCheck,
      color: "from-teal-600/20 to-emerald-600/20 border-teal-500/30 text-teal-400",
    },
    {
      title: isRtl ? "القبول النهائي" : "Accepted / Hired",
      value: stats.accepted,
      sub: isRtl ? "تم التعيين والاعتماد" : "hired candidates",
      icon: CheckCircle2,
      color: "from-emerald-600/20 to-emerald-800/20 border-emerald-500/40 text-emerald-300",
    },
    {
      title: isRtl ? "عروض الفرق المهنية" : "Team Offers",
      value: stats.teamOffers,
      sub: isRtl ? "مشاريع الفرق والفرق المتكاملة" : "squad opportunities",
      icon: Layers,
      color: "from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6" dir={isRtl ? "rtl" : "ltr"}>
      {cards.map((c, idx) => {
        const Icon = c.icon
        return (
          <div
            key={idx}
            className={`flex flex-col justify-between rounded-2xl border bg-gradient-to-b p-4 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 ${c.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{c.title}</span>
              <Icon className="h-4 w-4" />
            </div>

            <div className="mt-3">
              <span className="text-2xl font-black text-white">{c.value}</span>
              <p className="mt-1 text-[11px] text-slate-400 leading-tight">{c.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
