import React from "react"
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Clock,
  Layers,
  FolderGit2,
  Briefcase,
} from "lucide-react"
import type { UniversityStats } from "../types/university.types"

interface UniversityStatsGridProps {
  stats?: UniversityStats
  isRtl?: boolean
}

export const UniversityStatsGrid: React.FC<UniversityStatsGridProps> = ({
  stats,
  isRtl = true,
}) => {
  const cards = [
    {
      id: "students",
      title_ar: "إجمالي الطلاب والخريجين",
      title_en: "Connected Students",
      value: stats?.total_students ?? 0,
      icon: Users,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "graduates",
      title_ar: "الخريجون المؤهلون",
      title_en: "Graduates",
      value: stats?.graduates_count ?? 0,
      icon: GraduationCap,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
    {
      id: "verified",
      title_ar: "السجلات الأكاديمية الموثقة",
      title_en: "Verified Records",
      value: stats?.verified_count ?? 0,
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "pending",
      title_ar: "طلبات التوثيق المعلقة",
      title_en: "Pending Requests",
      value: stats?.pending_verifications ?? 0,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "departments",
      title_ar: "الأقسام والبرامج الأكاديمية",
      title_en: "Academic Departments",
      value: stats?.departments_count ?? 0,
      icon: Layers,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      id: "projects",
      title_ar: "مشاريع التخرج والابتكار",
      title_en: "Graduation Projects",
      value: stats?.academic_projects_count ?? 0,
      icon: FolderGit2,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "opportunities",
      title_ar: "الفرص الوظيفية المرتبطة",
      title_en: "Career Opportunities",
      value: stats?.career_opportunities_count ?? 0,
      icon: Briefcase,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#090e1a]/80 p-4 backdrop-blur-md shadow-lg transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">
                {isRtl ? c.title_ar : c.title_en}
              </span>
              <div className={`p-2 rounded-xl border ${c.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-black text-white font-mono">
                {c.value.toLocaleString()}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
