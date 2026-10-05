import React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, CheckCircle2, Circle, ArrowLeft, ArrowRight } from "lucide-react"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"
import type { UniversityCompleteness } from "../types/university.types"

interface UniversityProfileHealthCardProps {
  completeness?: UniversityCompleteness
  isRtl?: boolean
}

export const UniversityProfileHealthCard: React.FC<UniversityProfileHealthCardProps> = ({
  completeness,
}) => {
  const { language, isRTL } = useTranslation()
  if (!completeness) return null

  const percentage = completeness.percentage || 0
  const isHealthy = percentage >= 80

  const checklistLabels: Record<string, { en: string; hi: string }> = {
    logo: { en: "Official Logo", hi: "आधिकारिक लोगो" },
    qs_rank: { en: "Academic Ranking", hi: "शैक्षणिक रैंकिंग" },
    dean_name: { en: "Dean / Registry Head", hi: "प्रवेश डीन" },
    career_email: { en: "Career Center Email", hi: "करियर सेंटर ईमेल" },
    phone: { en: "Direct Phone", hi: "सीधा फोन" },
    website: { en: "Official Website", hi: "आधिकारिक वेबसाइट" },
    overview: { en: "Institutional Overview", hi: "संस्थागत विवरण" },
  }

  const getItemLabel = (item: { key: string; label_ar: string }) => {
    if (language === "ar") return item.label_ar
    if (language === "hi") return checklistLabels[item.key]?.hi || item.label_ar
    return checklistLabels[item.key]?.en || item.label_ar
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-[#0F2247]/90 to-background p-6 backdrop-blur-xl shadow-xl" dir={isRTL ? "rtl" : "ltr"}>
      {/* Signature Faeda Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/25 shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-heading">
              {tl(
                language,
                "مؤشر اكتمال وهوية الصرح الأكاديمي",
                "Academic Profile Health & Verification",
                "शैक्षणिक प्रोफ़ाइल पूर्णता और सत्यापन"
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tl(
                language,
                `${completeness.completed_factors} من أصل ${completeness.total_factors} عناصر مكتملة في السجل الرسمي`,
                `${completeness.completed_factors} of ${completeness.total_factors} official institution fields complete`,
                `आधिकारिक रिकॉर्ड में ${completeness.total_factors} में से ${completeness.completed_factors} फ़ील्ड पूर्ण`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isHealthy
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-primary/20 text-secondary border-primary/30"
            }`}
          >
            {percentage}% {tl(language, "مكتمل", "Complete", "पूर्ण")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-background/80 p-0.5 border border-border/50">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isHealthy
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50"
                : "bg-gradient-to-r from-primary to-secondary shadow-sm shadow-primary/50"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {completeness.checklist?.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
              item.is_completed
                ? "border-border bg-card/80 text-white"
                : "border-border bg-card/40 text-muted-foreground"
            }`}
          >
            {item.is_completed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-[11px] font-medium truncate">{getItemLabel(item)}</span>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-[11px] text-muted-foreground">
          {tl(
            language,
            "الملفات الأكاديمية الموثقة تمنح خريجي الجامعة مصداقية وأولوية قصوى لدى الشركات.",
            "Verified academic profiles provide your graduates with certified credibility for top employers.",
            "सत्यापित शैक्षणिक प्रोफ़ाइल आपके स्नातकों को शीर्ष कंपनियों में प्राथमिकता और विश्वसनीयता प्रदान करती है।"
          )}
        </span>

        <Link
          to={ROUTES.UNIVERSITY.PROFILE}
          className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary/80"
        >
          <span>{tl(language, "تعديل الملف المؤسسي", "Edit Profile", "प्रोफ़ाइल संपादित करें")}</span>
          {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </div>
  )
}
