import React from "react"
import { useTranslation } from "@/i18n"
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
}) => {
  const { language } = useTranslation()

  const cards = [
    {
      id: "students",
      title_ar: "إجمالي الطلاب والخريجين",
      title_en: "Connected Students",
      title_hi: "कुल छात्र एवं पूर्व छात्र",
      value: stats?.total_students ?? 0,
      icon: Users,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      id: "graduates",
      title_ar: "الخريجون المؤهلون",
      title_en: "Graduates",
      title_hi: "योग्य स्नातक",
      value: stats?.graduates_count ?? 0,
      icon: GraduationCap,
      color: "text-secondary bg-secondary/10 border-secondary/20",
    },
    {
      id: "verified",
      title_ar: "السجلات الأكاديمية الموثقة",
      title_en: "Verified Records",
      title_hi: "सत्यापित रिकॉर्ड",
      value: stats?.verified_count ?? 0,
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "pending",
      title_ar: "طلبات التوثيق المعلقة",
      title_en: "Pending Requests",
      title_hi: "लंबित सत्यापन",
      value: stats?.pending_verifications ?? 0,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "departments",
      title_ar: "الأقسام والبرامج الأكاديمية",
      title_en: "Academic Departments",
      title_hi: "शैक्षणिक विभाग",
      value: stats?.departments_count ?? 0,
      icon: Layers,
      color: "text-secondary bg-secondary/10 border-secondary/20",
    },
    {
      id: "projects",
      title_ar: "مشاريع التخرج والابتكار",
      title_en: "Graduation Projects",
      title_hi: "स्नातक परियोजनाएं",
      value: stats?.academic_projects_count ?? 0,
      icon: FolderGit2,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      id: "opportunities",
      title_ar: "الفرص الوظيفية المرتبطة",
      title_en: "Career Opportunities",
      title_hi: "करियर के अवसर",
      value: stats?.career_opportunities_count ?? 0,
      icon: Briefcase,
      color: "text-secondary bg-secondary/10 border-secondary/20",
    },
  ]

  const getCardTitle = (c: (typeof cards)[0]) => {
    if (language === "ar") return c.title_ar
    if (language === "hi") return c.title_hi
    return c.title_en
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card/85 p-4 backdrop-blur-md shadow-md transition-all hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {getCardTitle(c)}
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
