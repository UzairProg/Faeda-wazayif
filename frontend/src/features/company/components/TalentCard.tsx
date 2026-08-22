import React from "react"
import {
  MapPin,
  GraduationCap,
  Clock,
  CheckCircle2,
  Sparkles,
  Eye,
} from "lucide-react"
import type { CompanyTalentItem } from "../types/company.types"

interface TalentCardProps {
  talent: CompanyTalentItem
  onView: (talent: CompanyTalentItem) => void
  isRtl?: boolean
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  onView,
  isRtl = true,
}) => {
  return (
    <div
      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/90 shadow-md flex flex-col justify-between"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div>
        {/* Top bar: Avatar, Name & Headline */}
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl border border-slate-700 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm overflow-hidden">
            {talent.avatarUrl ? (
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="h-full w-full object-cover"
              />
            ) : (
              talent.name.slice(0, 2)
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {talent.name}
              </h3>
              {talent.isVerified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-emerald-400 line-clamp-1">{talent.headline}</p>
          </div>
        </div>

        {/* Credentials */}
        <div className="mt-3 flex flex-wrap gap-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>{talent.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {talent.yearsOfExperience} {isRtl ? "خبرة" : "exp"}
            </span>
          </div>
          {talent.education?.qualification && (
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
              <span>{talent.education.qualification}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {talent.skills && talent.skills.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {talent.skills.slice(0, 4).map((sk: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[11px]"
              >
                {sk}
              </span>
            ))}
            {talent.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                +{talent.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
        {talent.marketBenchmark ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold">{talent.marketBenchmark.tier}</span>
            <span className="text-slate-500 text-[10px]">
              ({talent.marketBenchmark.score}/100)
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">
            {isRtl ? "كفاءة جاهزة للعمل" : "Ready Talent"}
          </span>
        )}

        <button
          type="button"
          onClick={() => onView(talent)}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{isRtl ? "استعراض الملف" : "View Profile"}</span>
        </button>
      </div>
    </div>
  )
}
