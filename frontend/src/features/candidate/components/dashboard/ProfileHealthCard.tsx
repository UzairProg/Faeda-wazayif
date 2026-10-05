/**
 * ProfileHealthCard.tsx — Profile strength, ATS readiness score, and structured health metrics.
 * Upgraded with SVG circular completion gauge, high-contrast metric tiles, ATS optimization telemetry,
 * and full trilingual (Arabic, English, Hindi) support.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { ProfileHealthData } from "../../types/candidate.types"
import {
  Activity,
  FileText,
  Briefcase,
  FolderGit2,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

interface ProfileHealthCardProps {
  health: ProfileHealthData
}

export function ProfileHealthCard({ health }: ProfileHealthCardProps) {
  const { isRTL, language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en
  const Chevron = isRTL ? ChevronLeft : ChevronRight

  const percentage = Math.min(Math.max(health.percentage || 0, 0), 100)
  const atsScore = health.ats_score || 0

  // SVG circular calculation (radius = 36, circumference = 2 * PI * 36 = ~226.2)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Strength label
  const getStrengthLabel = () => {
    if (percentage >= 85) return { label: L("ممتاز جداً", "Exceptional", "असाधारण"), color: "text-emerald-400" }
    if (percentage >= 70) return { label: L("قوي ومكتمل", "Strong", "मजबूत"), color: "text-secondary" }
    if (percentage >= 50) return { label: L("متوسط", "Moderate", "मध्यम"), color: "text-amber-400" }
    return { label: L("بحاجة للتطوير", "Needs Work", "सुधार आवश्यक"), color: "text-rose-400" }
  }

  const strength = getStrengthLabel()

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 via-card/65 to-card/45 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all duration-300">
      {/* Top indicator bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-secondary opacity-80" />
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/15 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      <div>
        {/* Card Header with Circular Strength Gauge */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading leading-tight">
                {L("صحة وجاهزية الملف المهني", "Profile Health & Readiness", "प्रोफ़ाइल स्वास्थ्य एवं तत्परता")}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {L("مقياس الجاذبية لمسؤولي التوظيف", "Recruiter Attractiveness Index", "नियोक्ता आकर्षण सूचकांक")}
              </span>
            </div>
          </div>

          {/* SVG Circular Progress Meter */}
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
              {/* Background circle */}
              <circle
                cx="44"
                cy="44"
                r={radius}
                className="stroke-white/10"
                strokeWidth="7"
                fill="none"
              />
              {/* Gradient defs */}
              <defs>
                <linearGradient id="profileHealthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#124BC9" />
                  <stop offset="50%" stopColor="#22C7F2" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Animated Progress circle */}
              <circle
                cx="44"
                cy="44"
                r={radius}
                stroke="url(#profileHealthGradient)"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-extrabold text-white font-heading leading-none">
                {percentage}%
              </span>
              <span className={`text-[9px] font-bold ${strength.color} mt-0.5`}>
                {strength.label}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Enhanced Glass Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Skills */}
          <Link
            to={`${ROUTES.CANDIDATE.PROFILE}?section=skills`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-primary/40 p-3.5 text-center transition-all group/tile"
          >
            <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-1.5 text-primary group-hover/tile:scale-110 transition-transform">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-xl font-extrabold text-white font-heading block">
              {health.skills_count}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {L("مهارات مضافة", "Skills", "कौशल")}
            </span>
          </Link>

          {/* Projects */}
          <Link
            to={`${ROUTES.CANDIDATE.PROFILE}?section=projects`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-secondary/40 p-3.5 text-center transition-all group/tile"
          >
            <div className="w-7 h-7 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-1.5 text-secondary group-hover/tile:scale-110 transition-transform">
              <FolderGit2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xl font-extrabold text-white font-heading block">
              {health.projects_count}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {L("مشاريع منجزة", "Projects", "परियोजनाएं")}
            </span>
          </Link>

          {/* Certifications */}
          <Link
            to={`${ROUTES.CANDIDATE.PROFILE}?section=certifications`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-amber-500/40 p-3.5 text-center transition-all group/tile"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-1.5 text-amber-400 group-hover/tile:scale-110 transition-transform">
              <Award className="w-3.5 h-3.5" />
            </div>
            <span className="text-xl font-extrabold text-white font-heading block">
              {health.certifications_count}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {L("شهادات معتمدة", "Certifications", "प्रमाणपत्र")}
            </span>
          </Link>

          {/* CV Status */}
          <Link
            to={`${ROUTES.CANDIDATE.PROFILE}?section=cv`}
            className={`rounded-2xl border p-3.5 text-center transition-all group/tile ${
              health.cv_uploaded
                ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                : "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-1.5 text-white group-hover/tile:scale-110 transition-transform">
              <FileText className={`w-3.5 h-3.5 ${health.cv_uploaded ? "text-emerald-400" : "text-amber-400"}`} />
            </div>
            <span className={`text-xs font-bold font-heading block mt-0.5 ${health.cv_uploaded ? "text-emerald-400" : "text-amber-300"}`}>
              {health.cv_uploaded ? L("مرفوعة", "Attached", "अपलोड की गई") : L("غير مرفوعة", "Missing", "अनुपलब्ध")}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {L("السيرة الذاتية", "Resume / CV", "बायोडाटा / सीवी")}
            </span>
          </Link>
        </div>

        {/* ATS Readiness Preview Pill with AI Badge */}
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/15 via-card/70 to-secondary/15 p-4 flex items-center justify-between gap-3 mb-2 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary/30 to-secondary/30 flex items-center justify-center text-secondary border border-secondary/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-heading block">
                  {L("مؤشر التوافق مع أنظمة التوظيف (ATS Score)", "Applicant Tracking System (ATS) Score", "ATS तत्परता स्कोर")}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  AI POWERED
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {health.cv_uploaded
                  ? L(
                      "تم فحص الكلمات المفتاحية ومطابقتها مع فرص السوق",
                      "Keywords and qualifications parsed against market jobs",
                      "कीवर्ड और योग्यताएं बाज़ार नौकरियों से जांची गईं"
                    )
                  : L(
                      "ارفع سيرتك الذاتية لاحتساب نسبة التوافق الآلي",
                      "Upload your CV to compute your real ATS score",
                      "अपना वास्तविक ATS स्कोर जानने के लिए बायोडाटा अपलोड करें"
                    )}
              </span>
            </div>
          </div>

          <span className="text-base font-extrabold text-secondary font-heading px-3 py-1.5 rounded-xl bg-secondary/15 border border-secondary/30 font-mono shadow-sm">
            {health.cv_uploaded ? `${atsScore}/100` : "—"}
          </span>
        </div>
      </div>

      {/* Bottom CTA Action Link */}
      <div className="pt-3 border-t border-white/10">
        <Link
          to={ROUTES.CANDIDATE.PROFILE}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-xs font-bold text-white transition-all group/btn"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>{L("استكمال وتحديث محاور الملف المهني", "Complete All Profile Sections", "प्रोफ़ाइल के सभी अनुभाग पूरे करें")}</span>
          </span>
          <Chevron className="w-4 h-4 text-secondary group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
