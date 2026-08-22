/**
 * ApplicationStatusTimeline.tsx — Real status progress timeline for Candidate Applications.
 */
import { useTranslation } from "@/i18n"
import type { ApplicationTimelineStep } from "../../types/candidate.types"
import { CheckCircle2, Clock, Circle } from "lucide-react"

interface ApplicationStatusTimelineProps {
  timeline: ApplicationTimelineStep[]
}

export function ApplicationStatusTimeline({ timeline }: ApplicationStatusTimelineProps) {
  const { isRTL } = useTranslation()

  if (!timeline || timeline.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6">
        {timeline.map((step, idx) => {
          const isCompleted = step.isCompleted
          const isCurrent = step.isCurrent

          return (
            <div key={idx} className="relative group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCurrent
                    ? "bg-primary text-white border-primary ring-4 ring-primary/20 shadow-lg shadow-primary/30"
                    : isCompleted
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-900 text-slate-500 border-slate-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Step text content */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-bold font-heading ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {isRTL ? step.title_ar : step.title_en}
                  </h4>

                  {step.date && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(step.date).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {isCurrent && (
                  <span className="inline-block text-[10px] font-semibold text-primary/90 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    {isRTL ? "المرحلة الحالية" : "Current Stage"}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
