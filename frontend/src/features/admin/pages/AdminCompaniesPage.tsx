/**
 * features/admin/pages/AdminCompaniesPage.tsx
 *
 * Dedicated Company KYC & Commercial Registration Governance Console (/admin/companies).
 * Allows administrators to verify, audit, and regulate enterprise employers.
 */
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import type { AdminCompany } from "../types/admin.types"
import toast from "react-hot-toast"
import {
  Building2,
  Search,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Briefcase,
  ExternalLink,
  Copy,
  Check,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Download,
  RotateCcw,
  Globe,
  Ban,
  FileText,
} from "lucide-react"

export function AdminCompaniesPage() {
  const { language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en
  const queryClient = useQueryClient()

  // Filters & State
  const [activeTab, setActiveTab] = useState<string>("all") // "all" | "true" | "false" | "suspended"
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null)
  const [copiedCrId, setCopiedCrId] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)

  // Fetch Companies
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "companies", activeTab, searchQuery, page],
    queryFn: () =>
      adminService.getCompanies({
        verified: activeTab === "all" || activeTab === "suspended" ? undefined : activeTab,
        q: searchQuery.trim() || undefined,
        page,
        per_page: 25,
      }),
  })

  // Toggle Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: ({ companyId, is_verified }: { companyId: number; is_verified: boolean }) =>
      adminService.verifyCompanyDirect(companyId, is_verified),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success(
        res.is_verified
          ? L("تم توثيق المنشأة واعتماد شارة التحقق بنجاح!", "Company successfully verified with official trust badge!")
          : L("تم إلغاء توثيق المنشأة.", "Company verification revoked.")
      )
      if (selectedCompany && selectedCompany.id === res.company_id) {
        setSelectedCompany((prev) => (prev ? { ...prev, is_verified: res.is_verified } : null))
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || L("حدث خطأ أثناء تحديث حالة التوثيق", "Failed to update verification"))
    },
  })

  // Toggle Account Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "active" | "suspended" }) =>
      adminService.updateUserStatus("company", id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
      toast.success(
        variables.status === "active"
          ? L("تم تفعيل حساب المنشأة بنجاح", "Company account activated successfully")
          : L("تم تعليق حساب المنشأة", "Company account suspended")
      )
      if (selectedCompany && selectedCompany.id === variables.id) {
        setSelectedCompany((prev) => (prev ? { ...prev, status: variables.status } : null))
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || L("فشل تحديث حالة الحساب", "Failed to update account status"))
    },
  })

  // Filtered List based on client-side status (e.g. suspended tab)
  const displayCompanies = useMemo(() => {
    if (!data?.companies) return []
    let list = data.companies
    if (activeTab === "suspended") {
      list = list.filter((c) => c.status === "suspended")
    }
    return list
  }, [data?.companies, activeTab])

  // Copy CR Helper
  const handleCopyCr = (company: AdminCompany) => {
    if (!company.commercial_register) return
    navigator.clipboard.writeText(company.commercial_register)
    setCopiedCrId(company.id)
    toast.success(L("تم نسخ رقم السجل التجاري", "Commercial Registration Number copied"))
    setTimeout(() => setCopiedCrId(null), 2500)
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (!displayCompanies || displayCompanies.length === 0) {
      toast.error(L("لا توجد بيانات متاحة للتصدير", "No data to export"))
      return
    }
    setIsExporting(true)
    try {
      const headers = [
        "Company ID",
        "Company Name (AR)",
        "Company Name (EN)",
        "Email",
        "Mobile",
        "Commercial Register",
        "Field / Sector",
        "Location",
        "Status",
        "Verified",
        "Posted Jobs",
        "Created At",
      ]
      const rows = displayCompanies.map((c) => [
        c.id,
        `"${(c.company_arabic_name || "").replace(/"/g, '""')}"`,
        `"${(c.company_english_name || "").replace(/"/g, '""')}"`,
        c.email || "",
        c.mobile || "",
        `"${c.commercial_register || ""}"`,
        `"${(c.company_field || "").replace(/"/g, '""')}"`,
        `"${(c.location || "").replace(/"/g, '""')}"`,
        c.status,
        c.is_verified ? "Yes" : "No",
        c.jobs_count || 0,
        c.created_at || "",
      ])

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `faeda_companies_governance_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(L("تم تصدير ملف الشركات بنجاح!", "Companies exported to CSV successfully!"))
    } catch {
      toast.error(L("فشل تصدير الملف", "Failed to export CSV"))
    } finally {
      setIsExporting(false)
    }
  }

  // Stats derivation
  const stats = data?.stats || {
    total_companies: data?.total || 0,
    verified_companies: 0,
    pending_companies: 0,
    total_jobs: 0,
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Header Title & Actions ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight flex items-center gap-2">
                <span>{L("إدارة وتوثيق الشركات", "Enterprise Company Verification", "कंपनी सत्यापन एवं प्रबंधन")}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-mono font-semibold">
                  KYC & CR
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {L(
                  "لوحة تدقيق السجلات التجارية، فحص صلاحيات أصحاب الأعمال، واعتماد شارات المنشآت الموثوقة",
                  "Validate commercial registrations, review KYC compliance, and grant official enterprise trust badges",
                  "वाणिज्यिक पंजीकरण, केवाईसी अनुपालन और उद्यम सत्यापन बैज का प्रबंधन"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title={L("تحديث البيانات", "Refresh data")}
          >
            <RotateCcw className={`w-3.5 h-3.5 text-secondary ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{L("تحديث", "Refresh")}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-primary hover:from-sky-500 hover:to-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{L("تصدير CSV", "Export CSV", "निर्यात CSV")}</span>
          </button>
        </div>
      </div>

      {/* ── KPI Telemetry Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Companies */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-card/90 to-card/50 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {L("إجمالي المنشآت", "Total Employers", "कुल नियोक्ता")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {stats.total_companies.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {L("منشأة مسجلة في قاعدة البيانات", "Registered enterprises in database")}
            </p>
          </div>
        </div>

        {/* Card 2: Verified Companies */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-card/50 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              {L("المنشآت الموثقة", "Verified Companies", "सत्यापित कंपनियां")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-heading text-emerald-400">
              {stats.verified_companies.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              {stats.total_companies > 0
                ? `${Math.round((stats.verified_companies / stats.total_companies) * 100)}% ${L("معدل التوثيق الكلي", "overall trust rate")}`
                : "100%"}
            </p>
          </div>
        </div>

        {/* Card 3: Pending KYC Verification */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-card/50 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {L("بانتظار الاعتماد", "Pending KYC", "सत्यापन लंबित")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-heading text-amber-400">
              {stats.pending_companies.toLocaleString()}
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              {stats.pending_companies > 0
                ? L("يتطلب مراجعة السجل التجاري", "Requires commercial review")
                : L("جميع الطلبات معتمدة", "Zero review backlog")}
            </p>
          </div>
        </div>

        {/* Card 4: Total Job Postings */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-card/90 to-card/50 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {L("إعلانات التوظيف", "Active Job Posts", "सक्रिय नौकरियां")}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-heading text-white">
              {(stats.total_jobs || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {L("فرص عمل منشورة عبر هذه الشركات", "Posted by ecosystem employers")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters, Tabs & Instant Search ──────────────────────────── */}
      <div className="p-4 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            onClick={() => {
              setActiveTab("all")
              setPage(1)
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {L("الكل", "All", "सभी")}
          </button>

          <button
            onClick={() => {
              setActiveTab("true")
              setPage(1)
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "true"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{L("الموثقة", "Verified", "सत्यापित")}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("false")
              setPage(1)
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "false"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{L("بانتظار التحقق", "Pending KYC", "प्रतीक्षारत")}</span>
            {stats.pending_companies > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900/40 text-[10px] font-mono">
                {stats.pending_companies}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("suspended")
              setPage(1)
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "suspended"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>{L("المعلقة", "Suspended", "निलंबित")}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder={L(
              "بحث بالاسم، السجل التجاري، القطاع...",
              "Search company, CR number, sector...",
              "नाम, सीआर नंबर से खोजें..."
            )}
            className="w-full pr-9 pl-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Companies Data Table ────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-xs text-muted-foreground">
              {L("جاري تحميل بيانات الشركات المسجلة...", "Loading companies directory...")}
            </p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-3">
            <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-sm font-bold text-white">
              {L("حدث خطأ أثناء استرداد الشركات", "Failed to load companies")}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-white"
            >
              {L("إعادة المحاولة", "Retry")}
            </button>
          </div>
        ) : displayCompanies.length === 0 ? (
          <div className="py-20 text-center space-y-3 border border-dashed border-white/10 m-4 rounded-xl">
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {searchQuery
                ? L("لا توجد شركات مطابقة لمعايير البحث", "No companies match your search query")
                : L("لا توجد شركات مدرجة في هذا التبويب", "No companies found in this section")}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? L("جرب تعديل كلمة البحث أو مسح الفلاتر", "Try clearing your search filters")
                : L("سيتم إدراج أي شركات جديدة تلقائياً هنا بمجرد تسجيلها بالمنصة", "New enterprise registrations will appear here")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{L("المنشأة والاسم التجاري", "Company & Commercial Name")}</th>
                  <th className="px-4 py-3.5">{L("رقم السجل التجاري (CR)", "Commercial Register (CR)")}</th>
                  <th className="px-4 py-3.5">{L("القطاع والمقر", "Sector & Location")}</th>
                  <th className="px-4 py-3.5">{L("مسؤول التوظيف / الاتصال", "HR / Contact")}</th>
                  <th className="px-4 py-3.5 text-center">{L("الوظائف", "Jobs")}</th>
                  <th className="px-4 py-3.5 text-center">{L("حالة التوثيق", "Verification")}</th>
                  <th className="px-4 py-3.5 text-center">{L("حالة الحساب", "Account Status")}</th>
                  <th className="px-5 py-3.5 text-center">{L("الإجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayCompanies.map((comp) => {
                  return (
                    <tr
                      key={comp.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Company Name & Logo */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {comp.logo ? (
                            <img
                              src={comp.logo}
                              alt={comp.name}
                              className="w-10 h-10 rounded-xl object-cover bg-white/5 border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center font-bold text-sky-400 text-sm shrink-0">
                              {comp.name?.[0]?.toUpperCase() || "C"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white truncate max-w-[200px] text-sm">
                                {comp.name}
                              </span>
                              {comp.is_verified && (
                                <span title={L("منشأة موثقة", "Verified Employer")}>
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                              {comp.company_english_name !== comp.name ? comp.company_english_name : comp.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CR Number */}
                      <td className="px-4 py-4 font-mono">
                        {comp.commercial_register ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs">
                              {comp.commercial_register}
                            </span>
                            <button
                              onClick={() => handleCopyCr(comp)}
                              className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                              title="Copy CR"
                            >
                              {copiedCrId === comp.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60 italic text-[11px]">
                            {L("غير مدخل", "Not provided")}
                          </span>
                        )}
                      </td>

                      {/* Sector & Location */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-semibold">
                            {comp.company_field || L("القطاع الخاص", "Private Sector")}
                          </span>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-secondary shrink-0" />
                            <span className="truncate max-w-[130px]">{comp.location || "المملكة العربية السعودية"}</span>
                          </p>
                        </div>
                      </td>

                      {/* HR Contact */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="text-slate-200 font-medium truncate max-w-[140px]">
                            {comp.hr_name || comp.email || "—"}
                          </p>
                          {comp.mobile && (
                            <p className="text-muted-foreground font-mono truncate max-w-[140px] flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{comp.mobile}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Posted Jobs Count */}
                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold font-mono text-xs">
                          {comp.jobs_count || 0}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="px-4 py-4 text-center">
                        {comp.is_verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{L("موثقة", "Verified", "सत्यापित")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                            <ShieldAlert className="w-3 h-3" />
                            <span>{L("قيد المراجعة", "Pending", "लंबित")}</span>
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="px-4 py-4 text-center">
                        {comp.status === "active" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{L("نشط", "Active")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>{L("معلق", "Suspended")}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Inspect Modal Trigger */}
                          <button
                            onClick={() => setSelectedCompany(comp)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title={L("معاينة تفاصيل المنشأة", "Inspect Company Details")}
                          >
                            <Eye className="w-4 h-4 text-sky-400" />
                          </button>

                          {/* Toggle Verification Button */}
                          <button
                            onClick={() =>
                              verifyMutation.mutate({
                                companyId: comp.id,
                                is_verified: !comp.is_verified,
                              })
                            }
                            disabled={verifyMutation.isPending}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              comp.is_verified
                                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25"
                                : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25"
                            }`}
                            title={
                              comp.is_verified
                                ? L("إلغاء شارة التوثيق", "Revoke Verification")
                                : L("اعتماد وتوثيق المنشأة", "Approve & Verify")
                            }
                          >
                            {comp.is_verified ? (
                              <span>{L("إلغاء التوثيق", "Revoke")}</span>
                            ) : (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>{L("توثيق", "Verify")}</span>
                              </>
                            )}
                          </button>

                          {/* Toggle Account Suspension */}
                          <button
                            onClick={() => {
                              const nextStatus = comp.status === "active" ? "suspended" : "active"
                              const confirmMsg =
                                comp.status === "active"
                                  ? L(`هل أنت متأكد من تعليق حساب "${comp.name}"؟`, `Suspend "${comp.name}"?`)
                                  : L(`هل أنت متأكد من إعادة تفعيل حساب "${comp.name}"؟`, `Activate "${comp.name}"?`)
                              if (window.confirm(confirmMsg)) {
                                statusMutation.mutate({ id: comp.id, status: nextStatus })
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              comp.status === "active"
                                ? "text-rose-400 hover:bg-rose-500/10"
                                : "text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={comp.status === "active" ? L("تعليق الحساب", "Suspend") : L("تنشيط الحساب", "Activate")}
                          >
                            {comp.status === "active" ? <Ban className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Company Detail Inspection Modal ──────────────────────────── */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#09172a] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3.5">
                  {selectedCompany.logo ? (
                    <img
                      src={selectedCompany.logo}
                      alt={selectedCompany.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-white/5 border border-white/10"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-xl">
                      {selectedCompany.name?.[0]?.toUpperCase() || "C"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-heading text-white">{selectedCompany.name}</h2>
                      {selectedCompany.is_verified && (
                        <span title={L("منشأة موثقة", "Verified")}>
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedCompany.company_english_name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* CR Card */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>{L("رقم السجل التجاري (CR)", "Commercial Register")}</span>
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-white text-sm">
                      {selectedCompany.commercial_register || L("غير مسجل", "Not provided")}
                    </p>
                    {selectedCompany.commercial_register && (
                      <button
                        onClick={() => handleCopyCr(selectedCompany)}
                        className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sector / Field */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-secondary" />
                    <span>{L("القطاع والتصنيف", "Sector / Industry")}</span>
                  </span>
                  <p className="font-bold text-white">{selectedCompany.company_field || L("القطاع الخاص", "Private Sector")}</p>
                </div>

                {/* HR Email */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{L("البريد الإلكتروني", "Email Contact")}</span>
                  </span>
                  <p className="font-mono text-white truncate">{selectedCompany.email || "—"}</p>
                </div>

                {/* Mobile / Phone */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{L("رقم التواصل", "Phone Number")}</span>
                  </span>
                  <p className="font-mono text-white">{selectedCompany.mobile || selectedCompany.hr_mobile || "—"}</p>
                </div>

                {/* Location */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{L("المقر الجغرافي", "Location")}</span>
                  </span>
                  <p className="font-bold text-white">{selectedCompany.location || "المملكة العربية السعودية"}</p>
                </div>

                {/* Website */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>{L("الموقع الإلكتروني", "Website")}</span>
                  </span>
                  {selectedCompany.company_website ? (
                    <a
                      href={selectedCompany.company_website.startsWith("http") ? selectedCompany.company_website : `https://${selectedCompany.company_website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sky-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{selectedCompany.company_website}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{"—"}</p>
                  )}
                </div>
              </div>

              {/* About description if available */}
              {selectedCompany.about_arabic && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300">{L("نبذة عن المنشأة", "About Company")}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedCompany.about_arabic}
                  </p>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {L("معرف المنشأة:", "Company ID:")} #{selectedCompany.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      verifyMutation.mutate({
                        companyId: selectedCompany.id,
                        is_verified: !selectedCompany.is_verified,
                      })
                    }
                    disabled={verifyMutation.isPending}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCompany.is_verified
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                        : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25"
                    }`}
                  >
                    {selectedCompany.is_verified
                      ? L("إلغاء التوثيق", "Revoke Verification")
                      : L("توثيق واعتماد المنشأة", "Approve & Verify Employer")}
                  </button>

                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                  >
                    {L("إغلاق", "Close")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
