import React from "react"
import { CheckCircle2, Circle, Briefcase, FileText, Award, FolderGit2, GraduationCap } from "lucide-react"

interface StudentCareerReadinessCardProps {
  careerReadiness: number
  hasCv: boolean
  skillsCount: number
  projectsCount: number
  certificationsCount: number
  isVerified: boolean
  isRtl?: boolean
}

export const StudentCareerReadinessCard: React.FC<StudentCareerReadinessCardProps> = ({
  careerReadiness,
  hasCv,
  skillsCount,
  projectsCount,
  certificationsCount,
  isVerified,
  isRtl = true,
}) => {
  const factors = [
    {
      id: "academic",
      label: isRtl ? "المؤهل الأكاديمي والجامعة" : "Academic Qualification",
      icon: GraduationCap,
      isComplete: true,
    },
    {
      id: "verification",
      label: isRtl ? "التوثيق الرسمي من الجامعة" : "University Official Verification",
      icon: CheckCircle2,
      isComplete: isVerified,
    },
    {
      id: "cv",
      label: isRtl ? "السيرة الذاتية (CV)" : "Curriculum Vitae",
      icon: FileText,
      isComplete: hasCv,
    },
    {
      id: "skills",
      label: isRtl ? `المهارات التقنية (${skillsCount})` : `Technical Skills (${skillsCount})`,
      icon: Briefcase,
      isComplete: skillsCount > 0,
    },
    {
      id: "projects",
      label: isRtl ? `مشاريع التخرج والعمل (${projectsCount})` : `Projects & Portfolio (${projectsCount})`,
      icon: FolderGit2,
      isComplete: projectsCount > 0,
    },
    {
      id: "certs",
      label: isRtl ? `الشهادات الاحترافية (${certificationsCount})` : `Certifications (${certificationsCount})`,
      icon: Award,
      isComplete: certificationsCount > 0,
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {isRtl ? "مؤشر الجاهزية لسوق العمل" : "Career Readiness Index"}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRtl ? "تقييم العوامل المهنية والأكاديمية المكتملة" : "Completed career identity factors"}
            </p>
          </div>
        </div>

        <span className="text-base font-black text-teal-400 font-mono">
          {careerReadiness}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${careerReadiness}%` }}
          />
        </div>
      </div>

      {/* Factors List */}
      <div className="mt-4 space-y-2">
        {factors.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.id}
              className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-colors ${
                f.isComplete
                  ? "border-teal-500/20 bg-teal-500/5 text-slate-200"
                  : "border-slate-800 bg-slate-900/30 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${f.isComplete ? "text-teal-400" : "text-slate-600"}`} />
                <span>{f.label}</span>
              </div>
              {f.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
