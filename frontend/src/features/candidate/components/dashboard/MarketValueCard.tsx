/**
 * MarketValueCard.tsx — Career Command Center Market Value intelligence card.
 * Explainable, transparent, and grounded in real candidate factors.
 */
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { MarketValueData } from "../../types/candidate.types"
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Award,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

interface MarketValueCardProps {
  marketValue: MarketValueData
}

export function MarketValueCard({ marketValue }: MarketValueCardProps) {
  const { t, isRTL } = useTranslation()

  const isAvailable = marketValue.available && marketValue.value !== null
  const formattedValue = isAvailable && marketValue.value
    ? marketValue.value.toLocaleString()
    : null

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-[#0b1220]/80 p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between h-full">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-sky-400 to-emerald-400 opacity-80" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading leading-tight">
                {t("candidate.dashboard.marketValue.title")}
              </h2>
              <span className="text-[11px] text-slate-400">
                {t("candidate.dashboard.marketValue.badge")}
              </span>
            </div>
          </div>

          {marketValue.percentile_label && (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {marketValue.percentile_label}
            </span>
          )}
        </div>

        {/* Value Display Area */}
        {isAvailable ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-900/80 p-4 sm:p-5 mb-5 text-center sm:text-start">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  {t("candidate.dashboard.marketValue.estimatedMonthly")}
                </span>
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight text-emerald-400">
                    {formattedValue}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-300">
                    {marketValue.currency || "SAR"} / {t("candidate.dashboard.marketValue.monthly")}
                  </span>
                </div>
              </div>

              {/* Range & Specialization Info */}
              {marketValue.range && (
                <div className="text-xs text-slate-400 text-center sm:text-end mt-2 sm:mt-0">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {t("candidate.dashboard.marketValue.rangeLabel")}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {marketValue.range.min_salary.toLocaleString()} - {marketValue.range.max_salary.toLocaleString()}{" "}
                    {marketValue.currency}
                  </span>
                </div>
              )}
            </div>

            {/* Specialization & Tier Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
              {marketValue.specialization && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50 font-medium">
                  {marketValue.specialization}
                </span>
              )}
              {marketValue.experience_tier && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50 font-medium">
                  {marketValue.experience_tier} {isRTL ? "سنوات خبرة" : "yrs experience"}
                </span>
              )}
              {marketValue.qs_rank_string && marketValue.qs_rank_string !== "غير مصنفة" && (
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>QS #{marketValue.qs_rank_string}</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Empty / Uncalculated State */
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 mb-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-300 font-heading">
                  {t("candidate.dashboard.marketValue.notAvailableTitle")}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t("candidate.dashboard.marketValue.notAvailableDesc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Factors Breakdown Checklist */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 font-heading">
              {t("candidate.dashboard.marketValue.factorsTitle")}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {isRTL
                ? `${marketValue.factors ? marketValue.factors.filter((f) => f.status === "available").length : 0} من ${marketValue.factors ? marketValue.factors.length : 7} عوامل متوفرة`
                : `${marketValue.factors ? marketValue.factors.filter((f) => f.status === "available").length : 0} of ${marketValue.factors ? marketValue.factors.length : 7} factors available`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {marketValue.factors.map((factor) => {
              const isReady = factor.status === "available"
              return (
                <div
                  key={factor.key}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border transition-colors ${
                    isReady
                      ? "bg-slate-800/40 border-slate-700/60 text-slate-200"
                      : "bg-slate-900/30 border-slate-800/60 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isReady ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className="truncate">
                      {isRTL ? factor.label_ar : factor.label_en}
                    </span>
                  </div>

                  {factor.value && (
                    <span className="text-[10px] text-slate-400 truncate max-w-[90px] font-medium ms-2">
                      {factor.value}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer / CTA & Transparent Disclaimer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <Link
          to={ROUTES.CANDIDATE.PROFILE}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all group"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>{t("candidate.dashboard.marketValue.improveBtn")}</span>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </Link>

        <p className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
          <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
          <span>{t("candidate.dashboard.marketValue.disclaimer")}</span>
        </p>
      </div>
    </div>
  )
}
