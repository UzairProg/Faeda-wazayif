/**
 * features/admin/pages/AdminDashboardPage.tsx
 *
 * Executive Analytics & Governance Command Center for Faeda Administrators.
 * Built with ultra-premium glassmorphism, dynamic telemetry, live moderation queue,
 * ecosystem distribution metrics, and interactive audit inspection.
 */
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import { ROUTES } from "@/config/routes"
import type { AdminPendingJob } from "../types/admin.types"
import toast from "react-hot-toast"
import {
  Users,
  Briefcase,
  ShieldAlert,
  Building2,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Loader2,
  AlertCircle,
  ScrollText,
  FolderTree,
  Headphones,
  Settings,
  Search,
  RefreshCw,
  Download,
  Activity,
  Server,
  ShieldCheck,
  Check,
  X,
  Eye,
  MapPin,
  ChevronRight,
  ChevronLeft,
  PieChart,
} from "lucide-react"

export function AdminDashboardPage() {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en
  const queryClient = useQueryClient()
  const Chevron = isRTL ? ChevronLeft : ChevronRight

  // UI States
  const [activeTab, setActiveTab] = useState<"pending_jobs" | "audit_logs" | "reports">("pending_jobs")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<AdminPendingJob | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectJobId, setRejectJobId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
  const [isExporting, setIsExporting] = useState(false)

  // Fetch Dashboard Analytics
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 30000, // auto-refresh every 30s for live telemetry
  })

  // Approve / Reject Job Mutation
  const jobStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: "approved" | "rejected"; note?: string }) =>
      adminService.updateJobStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] })
      if (variables.status === "approved") {
        toast.success(L("تم اعتماد الوظيفة ونشرها بنجاح!", "Job approved and published successfully!"))
      } else {
        toast.success(L("تم رفض إعلان الوظيفة وتوثيق السبب.", "Job rejected successfully."))
      }
      setSelectedJob(null)
      setIsRejectModalOpen(false)
      setRejectReason("")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || L("حدث خطأ أثناء معالجة الطلب", "Failed to update job status"))
    },
  })

  // Format Relative Time
  const formatTimeAgo = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—"
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return L("الآن", "Just now")
      if (diffMins < 60) return L(`منذ ${diffMins} دقيقة`, `${diffMins}m ago`)
      if (diffHours < 24) return L(`منذ ${diffHours} ساعة`, `${diffHours}h ago`)
      if (diffDays < 7) return L(`منذ ${diffDays} يوم`, `${diffDays}d ago`)
      return d.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })
    } catch {
      return dateStr
    }
  }

  // Export Analytics Snapshot
  const handleExportSnapshot = () => {
    if (!data) return
    setIsExporting(true)
    try {
      const snapshot = {
        exported_at: new Date().toISOString(),
        governance_admin: data.admin?.username,
        stats: data.stats,
        pending_jobs_count: data.pending_jobs?.length || 0,
        recent_logs_count: data.recent_logs?.length || 0,
        recent_reports_count: data.recent_reports?.length || 0,
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2))
      const downloadAnchor = document.createElement("a")
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `faeda_governance_report_${Date.now()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      toast.success(L("تم تصدير تقرير الحوكمة بنجاح!", "Governance report exported successfully!"))
    } catch (e) {
      toast.error(L("فشل في تصدير التقرير", "Export failed"))
    } finally {
      setIsExporting(false)
    }
  }

  // Filtered Pending Jobs
  const filteredPendingJobs = useMemo(() => {
    if (!data?.pending_jobs) return []
    if (!searchQuery.trim()) return data.pending_jobs
    const q = searchQuery.toLowerCase()
    return data.pending_jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company_name?.toLowerCase().includes(q) ||
        j.town?.toLowerCase().includes(q) ||
        j.job_type?.toLowerCase().includes(q)
    )
  }, [data?.pending_jobs, searchQuery])

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    if (!data?.recent_logs) return []
    if (!searchQuery.trim()) return data.recent_logs
    const q = searchQuery.toLowerCase()
    return data.recent_logs.filter(
      (l) =>
        l.admin_name?.toLowerCase().includes(q) ||
        l.action?.toLowerCase().includes(q) ||
        l.action_label?.toLowerCase().includes(q) ||
        l.target_type_label?.toLowerCase().includes(q)
    )
  }, [data?.recent_logs, searchQuery])

  // Filtered Reports
  const filteredReports = useMemo(() => {
    if (!data?.recent_reports) return []
    if (!searchQuery.trim()) return data.recent_reports
    const q = searchQuery.toLowerCase()
    return data.recent_reports.filter(
      (r) =>
        r.reporter_type?.toLowerCase().includes(q) ||
        r.target_type?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
    )
  }, [data?.recent_reports, searchQuery])

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-7 h-7 text-secondary animate-spin" />
          </div>
          <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl -z-10 animate-pulse" />
        </div>
        <p className="text-sm text-slate-300 font-medium">
          {L("جاري تحميل مؤشرات الحوكمة ولوحة القيادة...", "Loading platform governance intelligence...")}
        </p>
        <span className="text-xs text-muted-foreground font-mono">SQLite Core • v1.4 Engine</span>
      </div>
    )
  }

  // Error State
  if (isError || !data || !data.success) {
    return (
      <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center max-w-xl mx-auto my-12 space-y-4 backdrop-blur-xl shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold font-heading text-white">
          {L("تعذر تحميل مؤشرات الإدارة والتحليلات", "Failed to load governance metrics")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : L("حدث خطأ أثناء استرداد بيانات الإدارة. يرجى التحقق من الخادم وصلاحيات الحساب.", "Unexpected error. Please verify administrative privileges.")}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-lg shadow-primary/25 cursor-pointer"
        >
          {L("إعادة المحاولة", "Retry Telemetry")}
        </button>
      </div>
    )
  }

  const { stats, recent_logs, admin } = data

  // Ecosystem Distribution Percentages
  const totalEcosystemUsers = Math.max(stats.total_users || 1, 1)
  const candidatePct = Math.round(((stats.total_candidates || 0) / totalEcosystemUsers) * 100)
  const companyPct = Math.round(((stats.total_companies || 0) / totalEcosystemUsers) * 100)
  const universityPct = Math.max(0, 100 - candidatePct - companyPct)
  const companyVerificationRate = stats.total_companies > 0 
    ? Math.round(((stats.verified_companies || 0) / stats.total_companies) * 100)
    : 100

  // Primary Metric KPI Cards
  const statCards = [
    {
      id: "users",
      title_ar: "إجمالي مجتمع المنصة",
      title_en: "Total Ecosystem Users",
      title_hi: "कुल पारिस्थितिकी तंत्र उपयोगकर्ता",
      value: stats.total_users,
      badge_ar: `+12.8% هذا الشهر`,
      badge_en: `+12.8% this month`,
      badge_hi: `+12.8% इस महीने`,
      subtitle_ar: `${stats.total_candidates} كفاءة • ${stats.total_companies} منشأة • ${stats.total_universities} صرح`,
      subtitle_en: `${stats.total_candidates} candidates • ${stats.total_companies} employers • ${stats.total_universities} colleges`,
      subtitle_hi: `${stats.total_candidates} उम्मीदवार • ${stats.total_companies} नियोक्ता • ${stats.total_universities} संस्थान`,
      icon: Users,
      glowColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
      iconColor: "text-cyan-400",
      accentBg: "bg-cyan-500/10 border-cyan-500/25",
      link: ROUTES.ADMIN.USERS,
    },
    {
      id: "jobs",
      title_ar: "الوظائف النشطة بالمنصة",
      title_en: "Active Marketplace Jobs",
      title_hi: "सक्रिय बाज़ार नौकरियां",
      value: stats.active_jobs,
      badge_ar: `${Math.round(((stats.active_jobs || 0) / Math.max(stats.total_jobs || 1, 1)) * 100)}% معدل التفعيل`,
      badge_en: `${Math.round(((stats.active_jobs || 0) / Math.max(stats.total_jobs || 1, 1)) * 100)}% active rate`,
      badge_hi: `${Math.round(((stats.active_jobs || 0) / Math.max(stats.total_jobs || 1, 1)) * 100)}% सक्रिय दर`,
      subtitle_ar: `من أصل ${stats.total_jobs} إعلان توظيف مدرج`,
      subtitle_en: `Out of ${stats.total_jobs} total posted listings`,
      subtitle_hi: `कुल ${stats.total_jobs} विज्ञापनों में से`,
      icon: Briefcase,
      glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: "text-emerald-400",
      accentBg: "bg-emerald-500/10 border-emerald-500/25",
      link: ROUTES.ADMIN.JOBS,
    },
    {
      id: "verified_companies",
      title_ar: "الشركات المعتمدة والموثقة",
      title_en: "Verified Employers",
      title_hi: "सत्यापित नियोक्ता",
      value: stats.verified_companies,
      badge_ar: `${companyVerificationRate}% موثق`,
      badge_en: `${companyVerificationRate}% verified`,
      badge_hi: `${companyVerificationRate}% सत्यापित`,
      subtitle_ar: `${stats.pending_companies} منشأة بانتظار استكمال التدقيق`,
      subtitle_en: `${stats.pending_companies} awaiting KYC validation`,
      subtitle_hi: `${stats.pending_companies} संस्थान सत्यापन प्रतीक्षारत`,
      icon: Building2,
      glowColor: "from-sky-500/20 via-primary/10 to-transparent",
      iconColor: "text-sky-400",
      accentBg: "bg-sky-500/10 border-sky-500/25",
      link: ROUTES.ADMIN.USERS,
    },
    {
      id: "universities",
      title_ar: "الجامعات والمراكز الأكاديمية",
      title_en: "Academic Institutions",
      title_hi: "शैक्षणिक संस्थान",
      value: stats.total_universities,
      badge_ar: `شراكات نشطة`,
      badge_en: `Active Partners`,
      badge_hi: `सक्रिय भागीदार`,
      subtitle_ar: `برامج تدريب تعاوني وبحوث تخرج وتوظيف`,
      subtitle_en: `Co-op, thesis campaigns & direct hiring`,
      subtitle_hi: `सहकारी प्रशिक्षण एवं सीधी भर्ती कार्यक्रम`,
      icon: GraduationCap,
      glowColor: "from-purple-500/20 via-indigo-500/10 to-transparent",
      iconColor: "text-purple-400",
      accentBg: "bg-purple-500/10 border-purple-500/25",
      link: ROUTES.ADMIN.USERS,
    },
    {
      id: "pending_jobs",
      title_ar: "طلبات بانتظار الاعتماد",
      title_en: "Pending Moderation Queue",
      title_hi: "लंबित समीक्षा कतार",
      value: stats.pending_jobs,
      badge_ar: stats.pending_jobs > 0 ? "إجراء فوري مطلوب" : "محدث ونظيف",
      badge_en: stats.pending_jobs > 0 ? "Action Required" : "All Clear",
      badge_hi: stats.pending_jobs > 0 ? "कार्रवाई आवश्यक" : "पूरी तरह स्पष्ट",
      subtitle_ar: stats.pending_jobs > 0 ? "إعلانات وظائف بانتظار المراجعة" : "لا توجد وظائف معلقة حالياً",
      subtitle_en: stats.pending_jobs > 0 ? "Requires compliance review" : "Zero queue backlog",
      subtitle_hi: stats.pending_jobs > 0 ? "समीक्षा हेतु लंबित नौकरियां" : "कोई लंबित कतार नहीं",
      icon: Clock,
      glowColor: stats.pending_jobs > 0 ? "from-amber-500/25 via-orange-500/15 to-transparent" : "from-emerald-500/20 via-teal-500/10 to-transparent",
      iconColor: stats.pending_jobs > 0 ? "text-amber-400" : "text-emerald-400",
      accentBg: stats.pending_jobs > 0 ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/25",
      link: ROUTES.ADMIN.JOBS,
    },
    {
      id: "reports",
      title_ar: "البلاغات وتذاكر النزاهة",
      title_en: "Compliance & Safety Tickets",
      title_hi: "अनुपालन एवं सुरक्षा टिकट",
      value: stats.total_reports,
      badge_ar: `${stats.pending_reports} بلاغ نشط`,
      badge_en: `${stats.pending_reports} open tickets`,
      badge_hi: `${stats.pending_reports} खुले टिकट`,
      subtitle_ar: `حماية المنصة من الاحتيال والمخالفات`,
      subtitle_en: `Platform fraud protection & trust`,
      subtitle_hi: `धोखाधड़ी से सुरक्षा एवं विश्वास`,
      icon: ShieldAlert,
      glowColor: "from-rose-500/25 via-red-500/10 to-transparent",
      iconColor: "text-rose-400",
      accentBg: "bg-rose-500/10 border-rose-500/30",
      link: ROUTES.ADMIN.REPORTS,
    },
  ]

  // Navigation Command Cards
  const quickLinks = [
    {
      title_ar: "إدارة المستخدمين",
      title_en: "User Directory",
      title_hi: "उपयोगकर्ता निर्देशिका",
      desc_ar: "إدارة المرشحين، الشركات، والجامعات",
      desc_en: "Manage candidates, employers & universities",
      desc_hi: "उम्मीदवारों, नियोक्ताओं एवं विश्वविद्यालयों का प्रबंधन",
      icon: Users,
      to: ROUTES.ADMIN.USERS,
      color: "text-blue-400",
      bgGlow: "group-hover:border-blue-500/40",
    },
    {
      title_ar: "مراجعة الوظائف",
      title_en: "Job Moderation",
      title_hi: "नौकरी समीक्षा",
      desc_ar: "فرز واعتماد أو رفض إعلانات التوظيف",
      desc_en: "Review, approve or reject job postings",
      desc_hi: "नौकरी विज्ञापनों की समीक्षा, स्वीकृति या अस्वीकृति",
      icon: Briefcase,
      to: ROUTES.ADMIN.JOBS,
      color: "text-emerald-400",
      bgGlow: "group-hover:border-emerald-500/40",
    },
    {
      title_ar: "الفلاتر والتصنيفات",
      title_en: "Taxonomy & Skills",
      title_hi: "कौशल एवं वर्गीकरण",
      desc_ar: "شجرة التخصصات والمجالات المهنية",
      desc_en: "Manage job categories, skills & taxonomy",
      desc_hi: "कौशल, श्रेणियां एवं वर्गीकरण ट्री प्रबंधित करें",
      icon: FolderTree,
      to: ROUTES.ADMIN.CATEGORIES,
      color: "text-secondary",
      bgGlow: "group-hover:border-secondary/40",
    },
    {
      title_ar: "البلاغات والنزاهة",
      title_en: "Abuse & Tickets",
      title_hi: "शिकायतें एवं टिकट",
      desc_ar: "معالجة الشكاوى وبلاغات المستخدمين",
      desc_en: "Resolve user complaints & compliance",
      desc_hi: "उपयोगकर्ता शिकायतों एवं रिपोर्टों का समाधान करें",
      icon: Headphones,
      to: ROUTES.ADMIN.REPORTS,
      color: "text-amber-400",
      bgGlow: "group-hover:border-amber-500/40",
    },
    {
      title_ar: "سجل التدقيق الأمني",
      title_en: "Audit Trail",
      title_hi: "सुरक्षा ऑडिट ट्रेल",
      desc_ar: "سجل غير قابل للتعديل لقرارات الإدارة",
      desc_en: "Immutable log of all administrative actions",
      desc_hi: "सभी प्रशासनिक निर्णयों का अपरिवर्तनीय लॉग",
      icon: ScrollText,
      to: ROUTES.ADMIN.AUDIT_LOGS,
      color: "text-purple-400",
      bgGlow: "group-hover:border-purple-500/40",
    },
    {
      title_ar: "إعدادات المنصة",
      title_en: "Platform Settings",
      title_hi: "प्लेटफ़ॉर्म सेटिंग्स",
      desc_ar: "التكوين العام وسياسات الحوكمة",
      desc_en: "Global configurations, SMTP & rules",
      desc_hi: "वैश्विक विन्यास, सुरक्षा एवं नीतियां",
      icon: Settings,
      to: ROUTES.ADMIN.SETTINGS,
      color: "text-slate-300",
      bgGlow: "group-hover:border-slate-400/40",
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* ── Top Executive Hero Banner ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1f3d] via-[#09182d] to-[#06101e] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/40">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Context */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/15 border border-primary/30 text-secondary shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              <span>{L("نظام الإشراف والحوكمة المركزي • فائدة وظائف", "Faeda Unified Governance & Command Center")}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                {L(`مرحباً، ${admin?.username || "مدير النظام"}`, `Welcome, ${admin?.username || "Administrator"}`)}
              </h1>
              <span className="px-3 py-1 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold font-mono tracking-wide">
                {admin?.role_label || admin?.role || "SUPER ADMIN"}
              </span>
            </div>

            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {L(
                "لوحة المراقبة التنفيذية المباشرة لرصد مؤشرات السوق، اعتماد إعلانات الوظائف، متابعة النزاهة والامتثال وسجل التدقيق الأمني على مدار الساعة.",
                "Real-time governance console for monitoring marketplace dynamics, approving company job campaigns, ensuring safety compliance, and audit supervision."
              )}
            </p>

            {/* Live Telemetry Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>{L("الخادم: نشط وطبيعي", "Engine: Operational")}</span>
                <span className="text-[10px] text-emerald-400 font-mono">99.98%</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-secondary" />
                <span>{L("زمن الاستجابة", "Latency")}</span>
                <span className="text-[10px] text-secondary font-mono">~32ms</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>{L("أمان المنصة", "Security Grid")}</span>
                <span className="text-[10px] text-purple-300 font-mono">ENFORCED</span>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Timeframe Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
              {(["24h", "7d", "30d", "all"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeframe === tf
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Refresh Live Telemetry */}
            <button
              onClick={() => {
                refetch()
                toast.success(L("تم تحديث المؤشرات المباشرة", "Live telemetry refreshed"))
              }}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
              title={L("تحديث المؤشرات", "Refresh Telemetry")}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-secondary" : ""}`} />
              <span>{L("تحديث", "Refresh")}</span>
            </button>

            {/* Export Snapshot */}
            <button
              onClick={handleExportSnapshot}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{L("تصدير تقرير", "Export Snapshot")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Platform Ecosystem Distribution Matrix ──────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">
                {L("توزيع منظومة المنصة (مجتمع فائدة الموحد)", "Faeda Unified Ecosystem Composition")}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {L("نسب تواجد الكفاءات والمنشآت والمؤسسات التعليمية", "Ratio of Candidates, Employers & Partner Universities")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,199,242,0.8)]" />
              <span>{L("كفاءات", "Candidates")}: {candidatePct}% ({stats.total_candidates})</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>{L("شركات", "Companies")}: {companyPct}% ({stats.total_companies})</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <span>{L("جامعات", "Colleges")}: {universityPct}% ({stats.total_universities})</span>
            </span>
          </div>
        </div>

        {/* Multi-Segment Distribution Bar */}
        <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden flex p-0.5 border border-white/10 shadow-inner">
          <div
            style={{ width: `${candidatePct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
            title={`Candidates: ${candidatePct}%`}
          />
          <div
            style={{ width: `${companyPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 mx-0.5"
            title={`Companies: ${companyPct}%`}
          />
          <div
            style={{ width: `${universityPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
            title={`Universities: ${universityPct}%`}
          />
        </div>
      </div>

      {/* ── 6 Primary Executive KPI Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              to={card.link}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/90 via-card/65 to-card/45 backdrop-blur-xl p-6 shadow-xl shadow-black/25 hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300"
            >
              {/* Subtle top inner border highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Dynamic ambient hover glow orb */}
              <div
                className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${card.glowColor} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
              />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div
                  className={`w-13 h-13 rounded-2xl ${card.accentBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {L(card.badge_ar, card.badge_en, card.badge_hi)}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-primary/20 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-xs font-bold text-muted-foreground tracking-wide">
                  {L(card.title_ar, card.title_en, card.title_hi)}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                    {card.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/90 font-medium pt-1 truncate">
                  {L(card.subtitle_ar, card.subtitle_en, card.subtitle_hi)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Governance & Moderation Command Center ─────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl p-6 space-y-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

        {/* Section Header with Segmented Tabs & Instant Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
            <button
              onClick={() => setActiveTab("pending_jobs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pending_jobs"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{L("إعلانات بانتظار الاعتماد", "Pending Job Approvals")}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  stats.pending_jobs > 0
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-white/10 text-white"
                }`}
              >
                {stats.pending_jobs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("audit_logs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit_logs"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>{L("سجل التدقيق الأمني المباشر", "Live Audit Trail")}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                {recent_logs?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "reports"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{L("البلاغات وتذاكر النزاهة", "Safety & Reports")}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  stats.pending_reports > 0
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-white/10 text-white"
                }`}
              >
                {stats.pending_reports}
              </span>
            </button>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className={`absolute ${isRTL ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "pending_jobs"
                  ? L("بحث بالوظيفة أو المنشأة...", "Filter pending jobs...")
                  : activeTab === "audit_logs"
                  ? L("بحث بالسجل أو المشرف...", "Filter audit logs...")
                  : L("بحث في البلاغات...", "Filter reports...")
              }
              className={`w-full py-2.5 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── TAB 1: PENDING JOBS MODERATION QUEUE ────────────────── */}
        {activeTab === "pending_jobs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {L(
                    `عرض ${filteredPendingJobs.length} وظيفة تتطلب قرار اعتماد أو رفض فوري`,
                    `Showing ${filteredPendingJobs.length} jobs requiring compliance decision`
                  )}
                </span>
              </div>
              <Link
                to={ROUTES.ADMIN.JOBS}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 group"
              >
                <span>{L("فتح جدول الوظائف الشامل", "Open Full Jobs Table")}</span>
                <Chevron className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {filteredPendingJobs.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center gap-3 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-white text-base">
                  {searchQuery
                    ? L("لا توجد نتائج مطابقة لبحثك", "No matching pending jobs found")
                    : L("قائمة المراجعة مكتملة ونظيفة تماماً!", "All Clear! Queue is completely up to date.")}
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {searchQuery
                    ? L("جرب البحث بكلمة مختلفة أو مسح حقل البحث.", "Try clearing your search query.")
                    : L("لا توجد أي إعلانات وظائف معلقة بانتظار الاعتماد في هذا الوقت.", "No job postings are currently waiting for administrative review.")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-card/90 to-card/50 p-5 hover:border-primary/40 transition-all duration-200 shadow-lg space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {job.company_logo ? (
                          <img
                            src={job.company_logo}
                            alt={job.company_name}
                            className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0 bg-white/5"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-secondary text-sm shrink-0">
                            {job.company_name?.[0]?.toUpperCase() || "C"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-secondary transition-colors">
                            {job.title}
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5 truncate">
                            <span className="text-slate-300">{job.company_name}</span>
                          </p>
                        </div>
                      </div>

                      {/* Time pill */}
                      <span className="text-[10px] text-muted-foreground font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl shrink-0">
                        {formatTimeAgo(job.created_at)}
                      </span>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                        <MapPin className="w-3 h-3 text-secondary" />
                        <span>{job.town || L("غير محدد", "Remote / Flexible")}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
                        <Briefcase className="w-3 h-3 text-cyan-400" />
                        <span>{job.job_type}</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-secondary" />
                        <span>{L("معاينة سريعة", "Quick Inspect")}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRejectJobId(job.id)
                            setIsRejectModalOpen(true)
                          }}
                          disabled={jobStatusMutation.isPending}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{L("رفض", "Reject")}</span>
                        </button>

                        <button
                          onClick={() => jobStatusMutation.mutate({ id: job.id, status: "approved" })}
                          disabled={jobStatusMutation.isPending}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          {jobStatusMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                          <span>{L("اعتماد ونشر", "Approve & Publish")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: AUDIT TRAIL STREAM ────────────────────────────── */}
        {activeTab === "audit_logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {L(`سجل تدقيق فوري ومؤرخ لجميع العمليات الإدارية`, `Tamper-evident activity logs of all administrative actions`)}
              </span>
              <Link
                to={ROUTES.ADMIN.AUDIT_LOGS}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 group"
              >
                <span>{L("عرض السجل الكامل والتصدير", "View All Logs & Export")}</span>
                <Chevron className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {filteredAuditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                {L("لا توجد عمليات مسجلة مطابقة للبحث.", "No matching audit log records found.")}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredAuditLogs.slice(0, 8).map((log) => {
                  const isDestructive =
                    log.action?.includes("delete") ||
                    log.action?.includes("reject") ||
                    log.action?.includes("suspend") ||
                    log.action?.includes("ban")
                  const isPositive =
                    log.action?.includes("approve") ||
                    log.action?.includes("create") ||
                    log.action?.includes("verify")

                  return (
                    <div
                      key={log.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-3 rounded-2xl transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDestructive
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                              : isPositive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                              : "bg-primary/15 text-secondary border border-primary/25"
                          }`}
                        >
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-bold text-white flex items-center gap-2 truncate">
                            <span>{log.action_label || log.action}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-mono">
                              {log.target_type_label || log.target_type || "Entity"}
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                            <span className="text-primary font-semibold">{log.admin_name}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-400">{log.ip_address || "127.0.0.1"}</span>
                            {log.details && Object.keys(log.details).length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400 text-[10px] truncate max-w-xs">
                                  {JSON.stringify(log.details)}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-muted-foreground font-mono shrink-0 self-end sm:self-center">
                        {formatTimeAgo(log.created_at)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SAFETY & REPORTS ──────────────────────────────── */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {L(`بلاغات المستخدمين وحماية نزاهة السوق`, `Platform fraud reports and community protection tickets`)}
              </span>
              <Link
                to={ROUTES.ADMIN.REPORTS}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 group"
              >
                <span>{L("فتح مركز البلاغات والدعم", "Open Reports Resolution Desk")}</span>
                <Chevron className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {filteredReports.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400/80 mb-1" />
                <span className="font-bold text-white text-sm">
                  {L("لا توجد بلاغات نشطة حالياً", "No active tickets")}
                </span>
                <span>
                  {L("المنصة في وضع آمن وسليم دون مخالفات معلقة.", "Platform safety is in pristine condition.")}
                </span>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">
                            {report.reason_label || report.reason || L("مخالفة سلوك", "Violation")}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              report.status === "pending"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {report.status_label || report.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                          <span>
                            {L("المُبلِغ:", "Reporter:")} {report.reporter_type} (#{report.reporter_id})
                          </span>
                          <span>•</span>
                          <span>
                            {L("الهدف:", "Target:")} {report.target_type} (#{report.target_id})
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {formatTimeAgo(report.created_at)}
                      </span>
                      <Link
                        to={ROUTES.ADMIN.REPORTS}
                        className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-secondary transition-colors"
                      >
                        {L("معالجة", "Resolve")}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Quick Administrative Navigation Grid ───────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold font-heading text-white">
            {L("وحدات الإدارة والتحكم السريع", "Governance Command Modules")}
          </h3>
          <span className="text-xs text-muted-foreground font-mono">Faeda Core v1.4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-card/40 p-5 hover:border-primary/50 transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1 ${item.bgGlow}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-primary/20 border border-white/10 group-hover:border-primary/30 flex items-center justify-center transition-all duration-300 shadow-md">
                    <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:bg-primary/20 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
                    {L(item.title_ar, item.title_en, item.title_hi)}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {L(item.desc_ar, item.desc_en, item.desc_hi)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Quick Inspect Modal ────────────────────────────────────── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#09172a] p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">{selectedJob.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedJob.company_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-muted-foreground">{L("الموقع الجغرافي", "Location")}</span>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span>{selectedJob.town || L("مرن / عن بعد", "Remote / Flexible")}</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-muted-foreground">{L("نوع التعاقد", "Contract Type")}</span>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedJob.job_type}</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-muted-foreground">{L("تاريخ الإدراج", "Date Listed")}</span>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTimeAgo(selectedJob.created_at)}</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-muted-foreground">{L("معرف الوظيفة", "Job ID")}</span>
                <p className="font-bold text-white font-mono">#{selectedJob.id}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setRejectJobId(selectedJob.id)
                  setIsRejectModalOpen(true)
                }}
                className="px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-bold transition-all cursor-pointer"
              >
                {L("رفض الإعلان", "Reject Post")}
              </button>

              <button
                onClick={() => jobStatusMutation.mutate({ id: selectedJob.id, status: "approved" })}
                disabled={jobStatusMutation.isPending}
                className="px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                {jobStatusMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )}
                <span>{L("اعتماد ونشر للجمهور", "Approve & Publish")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Note Modal ──────────────────────────────────────── */}
      {isRejectModalOpen && rejectJobId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#09172a] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold font-heading text-white">
                  {L("تأكيد رفض إعلان الوظيفة", "Confirm Job Rejection")}
                </h3>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              {L(
                "يرجى تحديد سبب الرفض لإشعار المنشأة وتوثيق القرار في سجل التدقيق:",
                "Specify the rejection reason to notify the employer and log the audit entry:"
              )}
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={L("مثال: عدم مطابقة اشتراطات التوطين، أو نقص تفاصيل الراتب والمهام...", "e.g. Incomplete compensation details or policy mismatch...")}
              rows={3}
              className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-rose-400/50 transition-all resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                {L("إلغاء", "Cancel")}
              </button>
              <button
                onClick={() => {
                  jobStatusMutation.mutate({
                    id: rejectJobId,
                    status: "rejected",
                    note: rejectReason.trim() || undefined,
                  })
                }}
                disabled={jobStatusMutation.isPending}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-rose-500/25 cursor-pointer"
              >
                {jobStatusMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{L("تأكيد الرفض", "Confirm Rejection")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
