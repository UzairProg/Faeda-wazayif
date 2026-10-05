/**
 * features/admin/pages/AdminReportsPage.tsx
 *
 * User & Content Abuse Moderation & Support Tickets Console.
 * Matches original reports and tickets.html functionality.
 */
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import type { AdminReport, AdminTicket } from "../types/admin.types"
import {
  ShieldAlert,
  Headphones,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Check,
  Send,
  MessageSquare,
  Clock,
  Mail,
} from "lucide-react"

type ViewSection = "reports" | "tickets"

export function AdminReportsPage() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const [activeSection, setActiveSection] = useState<ViewSection>("reports")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>("all")
  const [page, setPage] = useState<number>(1)

  // Selected Ticket for Reply Modal
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null)
  const [adminReplyText, setAdminReplyText] = useState("")

  // Query for Reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ["admin", "reports", statusFilter, page],
    queryFn: () =>
      adminService.getReports({
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        per_page: 20,
      }),
    enabled: activeSection === "reports",
  })

  // Query for Tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["admin", "tickets", ticketStatusFilter, page],
    queryFn: () =>
      adminService.getTickets({
        status: ticketStatusFilter === "all" ? undefined : ticketStatusFilter,
        page,
        per_page: 20,
      }),
    enabled: activeSection === "tickets",
  })

  const reportStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: number
      status: "resolved" | "dismissed" | "reviewing"
      notes?: string
    }) => adminService.updateReportStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
    },
  })

  const ticketReplyMutation = useMutation({
    mutationFn: ({
      id,
      status,
      admin_reply,
    }: {
      id: number
      status?: "open" | "closed"
      admin_reply?: string
    }) => adminService.updateTicket(id, { status, admin_reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] })
      setSelectedTicket(null)
      setAdminReplyText("")
    },
  })

  const handleUpdateStatus = (report: AdminReport, status: "resolved" | "dismissed") => {
    reportStatusMutation.mutate({ id: report.id, status })
  }

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return
    ticketReplyMutation.mutate({
      id: selectedTicket.id,
      status: "closed",
      admin_reply: adminReplyText.trim(),
    })
  }

  const statusTabs = [
    { id: "all", label_ar: "جميع البلاغات", label_en: "All Reports" },
    { id: "pending", label_ar: "بانتظار المراجعة", label_en: "Pending" },
    { id: "resolved", label_ar: "تم الحل", label_en: "Resolved" },
    { id: "dismissed", label_ar: "المرفوضة", label_en: "Dismissed" },
  ]

  const ticketTabs = [
    { id: "all", label_ar: "جميع التذاكر", label_en: "All Tickets" },
    { id: "open", label_ar: "تذاكر مفتوحة", label_en: "Open" },
    { id: "closed", label_ar: "تذاكر مغلقة", label_en: "Closed" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{language === "ar" ? "تم الحل / مغلقة" : "Resolved / Closed"}</span>
          </span>
        )
      case "dismissed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 text-muted-foreground border border-white/10">
            <XCircle className="w-3 h-3" />
            <span>{language === "ar" ? "مرفوض" : "Dismissed"}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>{language === "ar" ? "معلق / مفتوحة" : "Pending / Open"}</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-3">
            {activeSection === "reports" ? (
              <ShieldAlert className="w-7 h-7 text-destructive" />
            ) : (
              <Headphones className="w-7 h-7 text-primary" />
            )}
            <span>
              {activeSection === "reports"
                ? language === "ar" ? "البلاغات وإدارة المخالفات" : "Abuse Reports & Moderation"
                : language === "ar" ? "تذاكر الدعم الفني" : "Support Tickets"}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activeSection === "reports"
              ? language === "ar"
                ? "معالجة بلاغات المستخدمين والشركات، التحقق من الانتهاكات واتخاذ الإجراءات التأديبية."
                : "Review reports submitted by users and employers, investigate violations, and enforce policies."
              : language === "ar"
                ? "متابعة استفسارات ومشاكل المستخدمين والرد عليها مباشرة عبر المنصة."
                : "Handle technical support inquiries and respond directly to users."}
          </p>
        </div>

        {/* Section Switcher (Reports vs Support Tickets) */}
        <div className="flex items-center bg-card/70 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveSection("reports")
              setPage(1)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === "reports"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{language === "ar" ? "بلاغات المخالفات" : "Abuse Reports"}</span>
          </button>
          <button
            onClick={() => {
              setActiveSection("tickets")
              setPage(1)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === "tickets"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>{language === "ar" ? "تذاكر الدعم" : "Support Tickets"}</span>
          </button>
        </div>
      </div>

      {/* ── Sub Tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {activeSection === "reports"
          ? statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                  statusFilter === tab.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-card/40 text-muted-foreground border-white/5 hover:bg-card hover:text-white"
                }`}
              >
                {language === "ar" ? tab.label_ar : tab.label_en}
              </button>
            ))
          : ticketTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTicketStatusFilter(tab.id)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                  ticketStatusFilter === tab.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-card/40 text-muted-foreground border-white/5 hover:bg-card hover:text-white"
                }`}
              >
                {language === "ar" ? tab.label_ar : tab.label_en}
              </button>
            ))}
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      {activeSection === "reports" ? (
        /* REPORTS SECTION */
        reportsLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-muted-foreground text-sm">
              {language === "ar" ? "جارٍ جلب البلاغات..." : "Loading abuse reports..."}
            </p>
          </div>
        ) : !reportsData?.reports || reportsData.reports.length === 0 ? (
          <div className="p-16 text-center bg-card/40 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">
              {language === "ar" ? "لا توجد بلاغات حالياً" : "Queue is Clean"}
            </h3>
            <p className="text-muted-foreground text-xs max-w-sm mx-auto">
              {language === "ar"
                ? "لا توجد بلاغات مخالفات معلقة ضمن الفلتر المختار حالياً."
                : "No violation reports match the active filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reportsData.reports.map((report) => (
              <div
                key={report.id}
                className="relative overflow-hidden bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl p-5 rounded-3xl border border-white/10 hover:border-primary/40 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(report.status)}
                    <span className="text-xs font-mono text-muted-foreground">
                      #{report.id}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {report.created_at ? new Date(report.created_at).toLocaleDateString() : "—"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300">
                      {report.reason}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-white">
                    <span className="text-muted-foreground">{language === "ar" ? "المُبلِغ: " : "Reporter: "}</span>
                    <span className="text-primary font-bold">{report.reporter_name}</span>
                    <span className="mx-2 text-muted-foreground">➔</span>
                    <span className="text-muted-foreground">{language === "ar" ? "الهدف: " : "Target: "}</span>
                    <span className="text-rose-400 font-bold">{report.target_name} ({report.target_type})</span>
                  </div>

                  {report.description && (
                    <p className="text-xs text-muted-foreground/90 bg-background/50 p-3 rounded-xl border border-white/5">
                      {report.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {report.status !== "resolved" && (
                    <button
                      onClick={() => handleUpdateStatus(report, "resolved")}
                      disabled={reportStatusMutation.isPending}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "حل البلاغ" : "Resolve"}</span>
                    </button>
                  )}

                  {report.status !== "dismissed" && (
                    <button
                      onClick={() => handleUpdateStatus(report, "dismissed")}
                      disabled={reportStatusMutation.isPending}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white text-xs font-bold transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "رفض" : "Dismiss"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* TICKETS SECTION */
        ticketsLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-muted-foreground text-sm">
              {language === "ar" ? "جارٍ جلب تذاكر الدعم..." : "Loading support tickets..."}
            </p>
          </div>
        ) : !ticketsData?.tickets || ticketsData.tickets.length === 0 ? (
          <div className="p-16 text-center bg-card/40 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">
              {language === "ar" ? "لا توجد تذاكر دعم" : "No Support Tickets"}
            </h3>
            <p className="text-muted-foreground text-xs max-w-sm mx-auto">
              {language === "ar"
                ? "جميع تذاكر الدعم الفني تم الرد عليها وحلها بنجاح."
                : "All support tickets have been processed."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {ticketsData.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="relative overflow-hidden bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl p-5 rounded-3xl border border-white/10 hover:border-primary/40 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {getStatusBadge(ticket.status)}
                    <span className="text-xs font-mono text-muted-foreground">
                      #{ticket.id}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "—"}
                    </span>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {ticket.email}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {ticket.subject}
                  </h4>

                  <p className="text-xs text-muted-foreground/90 bg-background/50 p-3 rounded-xl border border-white/5">
                    {ticket.description}
                  </p>

                  {ticket.admin_reply && (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <strong>{language === "ar" ? "رد الإدارة: " : "Admin Reply: "}</strong>
                      <span>{ticket.admin_reply}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setAdminReplyText(ticket.admin_reply || "")
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "عرض والرد" : "View & Reply"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Ticket Reply Modal ─────────────────────────────────── */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/95 via-card/85 to-card/75 p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" />
              <span>
                {language === "ar" ? `تذكرة #${selectedTicket.id} - ${selectedTicket.subject}` : `Ticket #${selectedTicket.id}`}
              </span>
            </h3>

            <div className="my-3 p-3.5 bg-background/60 rounded-2xl border border-white/10 text-xs space-y-1.5 backdrop-blur-sm">
              <div>
                <strong className="text-white">{language === "ar" ? "المرسل: " : "Sender: "}</strong>
                <span className="text-primary font-mono">{selectedTicket.email}</span>
              </div>
              <div>
                <strong className="text-white">{language === "ar" ? "الوصف: " : "Issue: "}</strong>
                <p className="text-muted-foreground mt-1">{selectedTicket.description}</p>
              </div>
            </div>

            <form onSubmit={handleSendTicketReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1.5">
                  {language === "ar" ? "رد الإدارة على التذكرة *" : "Official Admin Reply *"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "اكتب الرد الرسمي للمستخدم هنا. سيتم تحديث حالة التذكرة إلى مغلقة..."
                      : "Type official reply. Ticket will be marked as resolved..."
                  }
                  className="w-full p-3 text-xs rounded-xl bg-background/60 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                  {language === "ar" ? "إغلاق" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={ticketReplyMutation.isPending}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/30 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {ticketReplyMutation.isPending
                      ? language === "ar" ? "جارٍ الإرسال..." : "Sending..."
                      : language === "ar" ? "إرسال الرد وإغلاق" : "Send Reply & Close"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
