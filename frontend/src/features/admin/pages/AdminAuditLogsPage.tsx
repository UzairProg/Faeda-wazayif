/**
 * features/admin/pages/AdminAuditLogsPage.tsx
 *
 * Immutable Security Audit Trail & Administrative Activity Log.
 */
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import {
  ScrollText,
  Search,
  ShieldCheck,
  Loader2,
} from "lucide-react"

export function AdminAuditLogsPage() {
  const { language } = useTranslation()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "audit-logs", searchQuery, page],
    queryFn: () =>
      adminService.getAuditLogs({
        q: searchQuery || undefined,
        page,
        per_page: 25,
      }),
  })

  const getActionBadgeColor = (action: string) => {
    if (action.includes("approve") || action.includes("verify") || action.includes("activate")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    }
    if (action.includes("delete") || action.includes("reject") || action.includes("ban")) {
      return "bg-red-500/10 text-red-400 border-red-500/20"
    }
    if (action.includes("suspend") || action.includes("warn")) {
      return "bg-amber-500/10 text-amber-300 border-amber-500/20"
    }
    return "bg-blue-500/10 text-blue-400 border-blue-500/20"
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-2 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>{language === "ar" ? "سجل التدقيق غير القابل للتعديل" : "Immutable Audit Trail"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {language === "ar" ? "سجل العمليات الإدارية" : "Administrative Audit Trail"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "ar"
              ? "توثيق رسمي لجميع الإجراءات المتخذة من قبل المسؤولين لضمان الشفافية والمساءلة."
              : "Full accountability log tracking every administrative action, IP address, and metadata."}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-muted-foreground" />
          <input
            type="text"
            placeholder={language === "ar" ? "بحث بالإجراء، المدير، أو العنوان..." : "Search action, admin, IP..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 bg-background/60 border border-white/10 rounded-2xl text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 shadow-sm backdrop-blur-xl transition-all"
          />
        </div>
      </div>

      {/* ── Logs Table ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">
              {language === "ar" ? "جاري تحميل سجل التدقيق..." : "Loading audit records..."}
            </p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400 text-xs">
            {error instanceof Error ? error.message : "حدث خطأ أثناء تحميل السجلات."}
          </div>
        ) : !data?.logs || data.logs.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm space-y-2">
            <ScrollText className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p>{language === "ar" ? "لا توجد سجلات تدقيق تطابق البحث." : "No audit logs found matching criteria."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-muted-foreground uppercase font-mono text-[11px]">
                  <th className="py-4 px-6 text-start">{language === "ar" ? "الوقت والتاريخ" : "Timestamp"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "المسؤول" : "Administrator"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "الإجراء" : "Action"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "الهدف" : "Target"}</th>
                  <th className="py-4 px-6 text-start">{language === "ar" ? "التفاصيل" : "Details"}</th>
                  <th className="py-4 px-6 text-end">{language === "ar" ? "عنوان IP" : "IP Address"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Timestamp */}
                    <td className="py-4 px-6 font-mono text-muted-foreground whitespace-nowrap">
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString(
                            language === "ar" ? "ar-SA" : "en-US",
                            { dateStyle: "short", timeStyle: "medium" }
                          )
                        : "—"}
                    </td>

                    {/* Admin User */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{log.admin_name}</span>
                        {log.admin_role && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-muted-foreground">
                            {log.admin_role}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action_label}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-4 text-muted-foreground">
                      {log.target_type ? (
                        <span>
                          {log.target_type_label}: #{log.target_id}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Details JSON preview */}
                    <td className="py-4 px-6 text-muted-foreground font-mono text-[11px] max-w-xs truncate">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <span title={JSON.stringify(log.details)}>
                          {Object.entries(log.details)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* IP Address */}
                    <td className="py-4 px-6 text-end font-mono text-[11px] text-muted-foreground/80">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {language === "ar"
                ? `عرض الصفحة ${data.page} من ${data.total_pages} (إجمالي ${data.total} عملية مسجلة)`
                : `Page ${data.page} of ${data.total_pages} (${data.total} total logs)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all disabled:opacity-40"
              >
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all disabled:opacity-40"
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
