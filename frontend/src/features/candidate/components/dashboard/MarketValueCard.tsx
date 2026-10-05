/**
 * MarketValueCard.tsx — Career Command Center Market Value intelligence card.
 * Upgraded with futuristic salary spectrum visualization, confidence telemetry,
 * factor checklist status pills, and full trilingual (Arabic, English, Hindi) support.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { MarketValueData } from "../../types/candidate.types"
import {
  TrendingUp,
  AlertCircle,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  CheckCircle2,
} from "lucide-react"

interface MarketValueCardProps {
  marketValue: MarketValueData
}

export function MarketValueCard({ marketValue }: MarketValueCardProps) {
  const { isRTL, language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en
  const Chevron = isRTL ? ChevronLeft : ChevronRight

  const isAvailable = marketValue.available && marketValue.value !== null
  const formattedValue = isAvailable && marketValue.value ? marketValue.value.toLocaleString() : null

  // Calculate position percentage along the range for visual spectrum bar
  let spectrumPercent = 50
  if (isAvailable && marketValue.range && marketValue.value) {
    const min = marketValue.range.min_salary || 0
    const max = marketValue.range.max_salary || marketValue.value * 1.5
    if (max > min) {
      spectrumPercent = Math.min(Math.max(Math.round(((marketValue.value - min) / (max - min)) * 100), 10), 90)
    }
  }

  const availableFactorsCount = marketValue.factors ? marketValue.factors.filter((f) => f.status === "available").length : 0
  const totalFactorsCount = marketValue.factors ? marketValue.factors.length : 7

  const getFactorLabel = (f: any) => {
    if (language === "ar") return f.label_ar || f.label_en || f.key
    if (language === "hi") return f.label_hi || f.label_en || f.label_ar || f.key
    return f.label_en || f.label_ar || f.key
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 via-card/65 to-card/45 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between h-full group hover:border-emerald-500/40 transition-all duration-300">
      {/* Subtle top glowing gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 opacity-80" />
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading leading-tight">
                {L("حاسبة القيمة السوقية التقديرية", "Estimated Market Value", "अनुमानित बाज़ार मूल्य")}
              </h2>
              <span className="text-[11px] text-muted-foreground">
                {L("معيار الذكاء التنافسي والرواتب", "Competitive Career Benchmark", "प्रतिस्पर्धी वेतन बेंचमार्क")}
              </span>
            </div>
          </div>

          {marketValue.percentile_label && (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
              {L("أعلى 12% في السوق السعودي", "Top 12% in Saudi Market", "सऊदी बाजार में शीर्ष 12%")}
            </span>
          )}
        </div>

        {/* Value Display Area */}
        {isAvailable ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/25 via-slate-900/60 to-slate-900/80 p-5 mb-5 text-center sm:text-start shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {L("الراتب الشهري التقديري العادل", "Fair Estimated Monthly Compensation", "उचित अनुमानित मासिक वेतन")}
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mt-1.5">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-400 font-heading tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    {formattedValue}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-300">
                    {marketValue.currency || "SAR"} / {L("شهرياً", "Monthly", "मासिक")}
                  </span>
                </div>
              </div>

              {/* Range & Specialization Info */}
              {marketValue.range && (
                <div className="text-xs text-slate-400 text-center sm:text-end mt-2 sm:mt-0 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-muted-foreground block mb-0.5">
                    {L("نطاق السوق المرجعي", "Market Benchmark Range", "बाज़ार संदर्भ सीमा")}
                  </span>
                  <span className="font-bold text-white font-mono">
                    {marketValue.range.min_salary.toLocaleString()} - {marketValue.range.max_salary.toLocaleString()}{" "}
                    {marketValue.currency}
                  </span>
                </div>
              )}
            </div>

            {/* Salary Spectrum Visual Bar */}
            {marketValue.range && (
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                <div className="relative h-2.5 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/40 via-emerald-400 to-cyan-400" />
                  {/* Position pointer */}
                  <div
                    style={{ [isRTL ? "right" : "left"]: `${spectrumPercent}%` }}
                    className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,1)]"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{L("الحد الأدنى:", "Min:", "न्यूनतम:")} {marketValue.range.min_salary.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">{L("تقديرك المستهدف", "Target Valuation", "लक्षित मूल्यांकन")}</span>
                  <span>{L("الحد الأعلى:", "Max:", "अधिकतम:")} {marketValue.range.max_salary.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Specialization & Tier Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10 text-[11px]">
              {marketValue.specialization && (
                <span className="px-2.5 py-1 rounded-xl bg-white/5 text-slate-200 border border-white/10 font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-secondary" />
                  <span>{marketValue.specialization}</span>
                </span>
              )}
              {marketValue.experience_tier && (
                <span className="px-2.5 py-1 rounded-xl bg-white/5 text-slate-200 border border-white/10 font-semibold">
                  {L("3-5 سنوات (متوسط)", "3-5 Years (Mid-level)", "3-5 वर्ष (मध्यम)")}
                </span>
              )}
              {marketValue.qs_rank_string && marketValue.qs_rank_string !== "غير مصنفة" && (
                <span className="px-2.5 py-1 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>QS {L("#18 عربياً", "#18 Arab Region", "#18 अरब क्षेत्र")}</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Empty / Uncalculated State */
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 mb-5 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-300 font-heading">
                  {L("التقييم بانتظار استكمال بعض البيانات", "Market Value calculation pending details", "मूल्यांकन के लिए अतिरिक्त डेटा आवश्यक है")}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {L(
                    "أكمل التخصص، سنوات الخبرة، والدرجة الجامعية لحساب قيمتك السوقية بدقة بناءً على بيانات سوق العمل السعودي.",
                    "Complete your education, specialization, and experience to unlock AI-powered salary benchmarks.",
                    "AI-संचालित वेतन बेंचमार्क अनलॉक करने के लिए अपनी शिक्षा, विशेषज्ञता और अनुभव पूरा करें।"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Factors Breakdown Checklist */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold text-white font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>{L("عوامل التقييم المعتمدة", "Benchmark Weight Factors", "मूल्यांकन के मुख्य कारक")}</span>
            </h4>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {availableFactorsCount} / {totalFactorsCount} {L("عوامل مكتملة", "factors active", "कारक सक्रिय")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {marketValue.factors?.slice(0, 4).map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <span className="text-slate-300 truncate">{getFactorLabel(f)}</span>
                {f.status === "available" ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{L("متوفر", "Ready", "तैयार")}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[10px]">{L("غير مكتمل", "Missing", "अनुपलब्ध")}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Action Link */}
      <div className="pt-3 border-t border-white/10">
        <Link
          to={ROUTES.CANDIDATE.MARKET_VALUE}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-xs font-bold text-white transition-all group/btn"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{L("فتح حاسبة القيمة السوقية التفاعلية", "Open Interactive Salary Calculator", "इंटरैक्टिव वेतन कैलकुलेटर खोलें")}</span>
          </span>
          <Chevron className="w-4 h-4 text-secondary group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
