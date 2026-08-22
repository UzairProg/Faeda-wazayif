/**
 * ApplicationFilterTabs.tsx — Filter tabs for Candidate Applications page.
 */
import { useTranslation } from "@/i18n"

interface ApplicationFilterTabsProps {
  activeStatus: string
  onStatusChange: (status: string) => void
  totalCount: number
}

export function ApplicationFilterTabs({
  activeStatus,
  onStatusChange,
  totalCount,
}: ApplicationFilterTabsProps) {
  const { isRTL } = useTranslation()

  const tabs = [
    { key: "all", label_ar: "كافة الطلبات", label_en: "All Applications" },
    { key: "applied", label_ar: "تم التقديم", label_en: "Applied" },
    { key: "under_review", label_ar: "قيد المراجعة", label_en: "Under Review" },
    { key: "shortlisted", label_ar: "مرشح نهائي", label_en: "Shortlisted" },
    { key: "accepted", label_ar: "تم القبول", label_en: "Accepted" },
    { key: "rejected", label_ar: "معتذر عنه", label_en: "Not Selected" },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.key

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onStatusChange(tab.key)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/25 font-bold"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80"
            }`}
          >
            <span>{isRTL ? tab.label_ar : tab.label_en}</span>
            {tab.key === "all" && totalCount > 0 && (
              <span className={`ms-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"}`}>
                {totalCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
