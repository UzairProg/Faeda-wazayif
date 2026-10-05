/**
 * DashboardWelcomeHeader.tsx — Top welcome and candidate summary banner for Command Center.
 * Upgraded with futuristic glassmorphism, career readiness telemetry, dynamic lighting, and trilingual support.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { CandidateSummaryData } from "../../types/candidate.types"
import { candidateService } from "../../services/candidate.service"
import {
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Briefcase,
  Layers,
  Compass,
  CheckCircle2,
} from "lucide-react"

interface DashboardWelcomeHeaderProps {
  candidate: CandidateSummaryData
  percentage: number
}

export function DashboardWelcomeHeader({
  candidate,
  percentage,
}: DashboardWelcomeHeaderProps) {
  const { isRTL, language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en
  const avatarUrl = candidateService.getImageUrl(candidate.avatar)
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return L("صباح الخير والتألق،", "Good morning,", "शुभ प्रभात,")
    } else if (hour >= 12 && hour < 18) {
      return L("طاب يومك بكل خير،", "Good afternoon,", "शुभ दोपहर,")
    }
    return L("مساء الإنجاز والفرص،", "Good evening,", "शुभ संध्या,")
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1f3d] via-[#09172d] to-[#06101e] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
      {/* Decorative ambient gradients & mesh glow */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar & Candidate Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 min-w-0">
          {/* Avatar with concentric glow ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary/30 via-card to-background border-2 border-primary/40 flex items-center justify-center text-secondary font-bold text-2xl sm:text-3xl shadow-2xl overflow-hidden group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={candidate.name || "Candidate"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span>{candidate.name ? candidate.name.slice(0, 2).toUpperCase() : "FA"}</span>
              )}
            </div>

            {/* Verification Badge */}
            {candidate.verification.is_verified && (
              <div
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-gradient-to-tr from-secondary to-primary text-slate-950 shadow-lg shadow-secondary/30 border border-white/20"
                title={L("كفاءة موثقة رسمياً", "Officially Verified Talent", "सत्यापित पेशेवर")}
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Text details */}
          <div className="space-y-2 min-w-0">
            {/* Live Career Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/[0.04] border border-white/10 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
              <span>{L("متاح للفرص الوظيفية • باحث نشط", "Open to Opportunities • Actively Seeking", "अवसरों के लिए उपलब्ध • सक्रिय खोजकर्ता")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                {getGreeting()} {candidate.name || L("عزيزي المرشح", "Candidate", "प्रिय उम्मीदवार")}
              </h1>

              {candidate.verification.is_verified ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{L("ملف موثق", "Verified Identity", "सत्यापित पहचान")}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  {L("نشط", "Active", "सक्रिय")}
                </span>
              )}
            </div>

            {/* Headline / About */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed line-clamp-2">
              {candidate.headline || candidate.about || L(
                "منصتك الذكية لاكتشاف الفرص، معرفة قيمتك السوقية، وبناء شراكات توظيف مثمرة.",
                "Your smart command center to uncover matched opportunities, evaluate market value, and advance your career.",
                "करियर अवसरों की खोज, बाजार मूल्य मूल्यांकन और करियर प्रगति के लिए आपका स्मार्ट कमांड सेंटर।"
              )}
            </p>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300">
              {/* Profile Completion Bar */}
              <div className="inline-flex items-center gap-2 bg-primary/15 text-secondary px-3 py-1.5 rounded-xl border border-primary/30 font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>{percentage}% {L("مكتمل", "Completed", "पूर्ण")}</span>
                <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {candidate.specialization && (
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="text-slate-200 font-medium">{candidate.specialization}</span>
                </span>
              )}

              {candidate.experience && (
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Layers className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-slate-200">{candidate.experience}</span>
                </span>
              )}

              {candidate.location && (
                <span className="inline-flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{candidate.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick CTA buttons */}
        <div className="flex flex-row sm:flex-wrap lg:flex-col gap-2.5 sm:gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <Link
            to={ROUTES.CANDIDATE.PROFILE}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white text-xs font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>{L("إدارة وتعديل الملف", "Manage Profile", "प्रोफ़ाइल प्रबंधित करें")}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={ROUTES.CANDIDATE.JOBS}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-bold border border-white/10 hover:border-primary/40 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-secondary" />
            <span>{L("استكشاف الوظائف", "Explore Matching Jobs", "सुसंगत नौकरियां देखें")}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
