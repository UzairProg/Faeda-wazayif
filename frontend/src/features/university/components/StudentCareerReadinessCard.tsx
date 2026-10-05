import React from "react"
import { CheckCircle2, Circle, Briefcase, FileText, Award, FolderGit2, GraduationCap } from "lucide-react"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"

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
  isRtl: _isRtl = true,
}) => {
  const { language } = useTranslation()

  const factors = [
    {
      id: "academic",
      label: tl(
        language,
        "المؤهل الأكاديمي والجامعة",
        "Academic Qualification",
        "शैक्षणिक योग्यता और विश्वविद्यालय"
      ),
      icon: GraduationCap,
      isComplete: true,
    },
    {
      id: "verification",
      label: tl(
        language,
        "التوثيق الرسمي من الجامعة",
        "University Official Verification",
        "विश्वविद्यालय आधिकारिक सत्यापन"
      ),
      icon: CheckCircle2,
      isComplete: isVerified,
    },
    {
      id: "cv",
      label: tl(
        language,
        "السيرة الذاتية (CV)",
        "Curriculum Vitae",
        "बायोडाटा (CV)"
      ),
      icon: FileText,
      isComplete: hasCv,
    },
    {
      id: "skills",
      label: `${tl(
        language,
        "المهارات التقنية",
        "Technical Skills",
        "तकनीकी कौशल"
      )} (${skillsCount})`,
      icon: Briefcase,
      isComplete: skillsCount > 0,
    },
    {
      id: "projects",
      label: `${tl(
        language,
        "مشاريع التخرج والعمل",
        "Projects & Portfolio",
        "प्रोजेक्ट्स और पोर्टफोलियो"
      )} (${projectsCount})`,
      icon: FolderGit2,
      isComplete: projectsCount > 0,
    },
    {
      id: "certs",
      label: `${tl(
        language,
        "الشهادات الاحترافية",
        "Certifications",
        "प्रमाणपत्र"
      )} (${certificationsCount})`,
      icon: Award,
      isComplete: certificationsCount > 0,
    },
  ]

  return (
    <div className="rounded-3xl border border-border bg-card/85 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-secondary border border-primary/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {tl(
                language,
                "مؤشر الجاهزية لسوق العمل",
                "Career Readiness Index",
                "कैरियर तत्परता सूचकांक"
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {tl(
                language,
                "تقييم العوامل المهنية والأكاديمية المكتملة",
                "Completed career identity factors",
                "पूर्ण किए गए कैरियर पहचान कारक"
              )}
            </p>
          </div>
        </div>

        <span className="text-base font-black text-secondary font-mono">
          {careerReadiness}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-background border border-border/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
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
                  ? "border-secondary/20 bg-primary/10 text-slate-200"
                  : "border-border bg-background/50 text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    f.isComplete ? "text-secondary" : "text-muted-foreground"
                  }`}
                />
                <span>{f.label}</span>
              </div>
              {f.isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
