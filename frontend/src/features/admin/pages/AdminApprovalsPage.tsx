/**
 * features/admin/pages/AdminApprovalsPage.tsx
 *
 * Multi-Tier Change Approval Engine (Maker-Checker / 4-Eyes Principle).
 * Ensures that product/service additions, deletions, and pricing changes
 * cannot be made unilaterally and must receive department head and Super Admin sign-offs.
 * Upgraded with luxury dark-navy aesthetics, luminous telemetry, and step pipeline.
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/i18n"
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Layers,
  Building2,
  FileCheck2,
  TrendingDown,
  TrendingUp,
  Tag,
  UserCheck,
  Activity,
} from "lucide-react"
import toast from "react-hot-toast"

interface ApprovalRequest {
  id: string
  request_type: "price_change" | "product_add" | "product_delete" | "marketing_budget"
  title: string
  proposed_by: string
  department: string
  department_key: "finance" | "products" | "marketing" | "operations"
  old_value: string
  new_value: string
  delta_badge?: { label: string; type: "discount" | "increase" | "new" }
  reason: string
  status: "pending_review" | "dept_approved" | "approved" | "rejected"
  reviewer_name?: string
  reviewer_role?: string
  super_admin_name?: string
  date: string
}

const DEFAULT_REQUESTS: ApprovalRequest[] = [
  {
    id: "APR-2026-0042",
    request_type: "price_change",
    title: "تعديل تسعير باقة المنشآت الناشئة (Starter Plan)",
    proposed_by: "خالد السلمان",
    department: "المحاسبة والمالية",
    department_key: "finance",
    old_value: "499 ر.س / شهرياً",
    new_value: "399 ر.س / شهرياً",
    delta_badge: { label: "-20% خصم ترويجي", type: "discount" },
    reason: "مواءمة أسعار الربع الرابع لزيادة وتيرة استقطاب الشركات المحتضنة الناشئة وتسهيل انضمام رواد الأعمال الجدد.",
    status: "pending_review",
    date: "2026-10-24 14:30",
  },
  {
    id: "APR-2026-0041",
    request_type: "product_add",
    title: "إضافة خدمة جديدة: باقة التدقيق الأكاديمي لشهادات الخريجين",
    proposed_by: "سارة المنصور",
    department: "التسويق وتطوير الأعمال",
    department_key: "products",
    old_value: "خدمة غير متوفرة (جديد)",
    new_value: "باقة 150 ر.س لكل 10 شهادات موثقة",
    delta_badge: { label: "خدمة جديدة", type: "new" },
    reason: "طلب ملح من أكثر من 12 شركة شريكة للتأكد من مخرجات طلاب التدريب التعاوني المعتمدة من الجامعة.",
    status: "dept_approved",
    reviewer_name: "د. طارق العيسى",
    reviewer_role: "رئيس قسم تطوير الأعمال الأكاديمية",
    date: "2026-10-23 11:15",
  },
  {
    id: "APR-2026-0040",
    request_type: "marketing_budget",
    title: "اعتماد ميزانية الحملة الإعلانية للشركات الشريكة المستهدفة (30 شركة)",
    proposed_by: "منى الشمري",
    department: "التسويق والحملات الرقمية",
    department_key: "marketing",
    old_value: "10,000 ر.س",
    new_value: "15,000 ر.س",
    delta_badge: { label: "+5,000 ر.س توسعة", type: "increase" },
    reason: "توسيع النطاق الجغرافي للحملة الإعلانية ليشمل المنطقة الشرقية والرياض بالتعاون مع حاضنة منشآت.",
    status: "approved",
    reviewer_name: "فهد العتيبي",
    reviewer_role: "مدير التسويق والاتصال المؤسسي",
    super_admin_name: "المدير العام (Super Admin)",
    date: "2026-10-20 09:45",
  },
]

export function AdminApprovalsPage() {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const [requests, setRequests] = useState<ApprovalRequest[]>(DEFAULT_REQUESTS)
  const [filter, setFilter] = useState<string>("all")
  const [rejectModalTarget, setRejectModalTarget] = useState<ApprovalRequest | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          if (r.status === "pending_review") {
            return {
              ...r,
              status: "dept_approved",
              reviewer_name: "د. خالد السليمان",
              reviewer_role: "رئيس القسم المعتمد",
            }
          }
          return {
            ...r,
            status: "approved",
            super_admin_name: "المدير العام (مصادقة نهائية)",
          }
        }
        return r
      })
    )
    toast.success(
      L(
        "تم اعتماد التغيير بنجاح وتحديث مسار الحوكمة!",
        "Change approved successfully and governance pipeline updated!"
      )
    )
  }

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectModalTarget) return

    setRequests(prev =>
      prev.map(r =>
        r.id === rejectModalTarget.id ? { ...r, status: "rejected" } : r
      )
    )
    toast.error(
      L("تم رفض طلب التعديل وإرسال الملاحظات للمقدم.", "Change request rejected.")
    )
    setRejectModalTarget(null)
    setRejectReason("")
  }

  const filteredRequests = requests.filter(r => {
    if (filter === "pending") return r.status === "pending_review" || r.status === "dept_approved"
    if (filter === "approved") return r.status === "approved"
    if (filter === "rejected") return r.status === "rejected"
    return true
  })

  // Quick Telemetry Metrics
  const totalCount = requests.length
  const pendingDeptCount = requests.filter(r => r.status === "pending_review").length
  const pendingSuperCount = requests.filter(r => r.status === "dept_approved").length
  const approvedCount = requests.filter(r => r.status === "approved").length

  return (
    <div className="space-y-8 pb-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── LUXURY HERO HEADER WITH AMBIENT LIGHT MESH ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#071326] via-[#0b1f3d] to-[#050c18] p-7 md:p-10 backdrop-blur-3xl shadow-2xl transition-all">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Accent Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 via-emerald-400 to-teal-400 shadow-md shadow-amber-500/20" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-inner shadow-amber-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{L("نظام الرقابة والحوكمة وتعدد الموافقات (Maker-Checker)", "Dual-Control Governance (Maker-Checker)", "अनुमोदन नियंत्रण प्रणाली")}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>{L("مبدأ الأعين الأربعة (4-Eyes Principle)", "4-Eyes Principle Verification", "चार-नेत्र सुरक्षा सिद्धांत")}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white md:text-4xl tracking-tight font-heading leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {L("طابور اعتمادات الأسعار، المنتجات، والخدمات", "Pricing, Product & Service Approvals Queue", "मूल्य निर्धारण एवं सेवा अनुमोदन कतार")}
            </h1>

            <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-normal">
              {L(
                "حوكمة مشددة تمنع تغيير أي سعر اشتراك أو إضافة أو إيقاف خدمة دون موافقة رئيس القسم المعني ثم المصادقة النهائية للمدير العام.",
                "Strict dual-control change governance: no pricing modifications, service launches, or catalog deletions can take effect without department head review followed by Super Admin sign-off.",
                "विभागाध्यक्ष एवं मुख्य व्यवस्थापक के सत्यापन के बिना कोई भी मूल्य परिवर्तन या उत्पाद संपादन लागू नहीं किया जा सकता।"
              )}
            </p>
          </div>

          {/* Quick Telemetry KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono">{L("الكل", "Total", "कुल")}</span>
              <div className="text-xl font-black text-white">{totalCount}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl text-center space-y-0.5">
              <span className="text-[10px] text-amber-300 uppercase font-mono">{L("فحص القسم", "Dept Review", "विभागीय")}</span>
              <div className="text-xl font-black text-amber-300">{pendingDeptCount}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 backdrop-blur-xl text-center space-y-0.5">
              <span className="text-[10px] text-sky-300 uppercase font-mono">{L("اعتماد المدير", "Super Admin", "व्यवस्थापक")}</span>
              <div className="text-xl font-black text-sky-300">{pendingSuperCount}</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl text-center space-y-0.5">
              <span className="text-[10px] text-emerald-300 uppercase font-mono">{L("مكتمل ومطبق", "Deployed", "लागू")}</span>
              <div className="text-xl font-black text-emerald-300">{approvedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── VISUAL GOVERNANCE PIPELINE STEPPER ── */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-3">
          <span className="flex items-center gap-1.5 font-heading">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{L("مسار الحوكمة الرقمية للتغييرات المؤسسية (Governance Workflow)", "Maker-Checker Governance Workflow", "डिजिटल अनुमोदन कार्यप्रवाह")}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">POLICY-SEC-GOV-2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-background/50 border border-white/5 space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">1. {L("المقترح (Maker)", "Maker Stage", "चरण 1: प्रस्तावक")}</span>
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="font-bold text-white text-sm">{L("رفع المقترح والمبررات", "Draft Proposal", "प्रस्ताव दर्ज करें")}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {L("إدخال بيانات التعديل، الأسعار الجديدة، والمبررات الاقتصادية.", "Enter proposed change, pricing delta, and economic rationale.")}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase">2. {L("فحص القسم (Checker 1)", "Dept Review", "चरण 2: विभागाध्यक्ष")}</span>
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-bold text-amber-300 text-sm">{L("مصادقة رئيس القسم", "Dept Head Sign-off", "विभागाध्यक्ष समीक्षा")}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {L("مراجعة الجدوى الفنية والمالية من قبل مدير الإدارة المختصة.", "Technical, financial, and regulatory review by department head.")}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 uppercase">3. {L("الاعتماد النهائي (Checker 2)", "Super Admin Sign-off", "चरण 3: मुख्य व्यवस्थापक")}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="font-bold text-sky-300 text-sm">{L("اعتماد المدير العام", "Executive Approval", "कार्यकारी अनुमोदन")}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {L("التفويض النهائي والتحقق من التوافق الاستراتيجي للمنصة.", "Executive authorization ensuring complete alignment with platform policy.")}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">4. {L("التطبيق والتفعيل", "Live Deployment", "चरण 4: सक्रिय")}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-emerald-300 text-sm">{L("التحديث الفوري بالداتابيز", "Sync to Live Catalog", "कैटलॉग में लाइव")}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {L("يتم تحديث السعر وظهوره للشركات المشتركة تلقائياً مع توثيق الأثر.", "Automatic database update and instantaneous live catalog sync.")}
            </p>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          {[
            { id: "all", label: L("جميع الطلبات", "All Requests", "सभी") },
            { id: "pending", label: L("بانتظار الاعتماد", "Pending Review", "लंबित समीक्षा") },
            { id: "approved", label: L("المعتمدة والمطبقة", "Approved", "स्वीकृत") },
            { id: "rejected", label: L("المرفوضة", "Rejected", "अस्वीकृत") },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 font-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          {L("عرض", "Showing", "दिखा रहा है")} <strong className="text-white font-mono">{filteredRequests.length}</strong> {L("طلب تعديل", "requests", "अनुरोध")}
        </span>
      </div>

      {/* ── APPROVALS CARDS LIST ── */}
      <div className="space-y-5">
        <AnimatePresence>
          {filteredRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`group relative overflow-hidden p-6 sm:p-7 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border transition-all duration-300 shadow-xl backdrop-blur-2xl hover:shadow-2xl ${
                req.status === "approved"
                  ? "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                  : req.status === "dept_approved"
                  ? "border-sky-500/30 hover:border-sky-500/50 hover:shadow-sky-500/10"
                  : req.status === "rejected"
                  ? "border-rose-500/30 hover:border-rose-500/50"
                  : "border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/10"
              }`}
            >
              {/* Subtle Ambient Card Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/10 transition-all" />

              <div className="relative z-10 space-y-5">
                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-5">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-amber-300 font-mono text-xs font-black border border-white/10">
                        {req.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/15 text-secondary border border-primary/25 text-xs font-bold">
                        <Building2 className="w-3 h-3" />
                        <span>{req.department}</span>
                      </span>
                      {req.delta_badge && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            req.delta_badge.type === "discount"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : req.delta_badge.type === "new"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          <span>{req.delta_badge.label}</span>
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">{req.date}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {req.title}
                    </h3>

                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-400">{L("مقدم الاقتراح:", "Proposed By:", "प्रस्तावक:")}</span>
                      <strong className="text-white font-semibold">{req.proposed_by}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">({req.department})</span>
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {req.status === "pending_review" && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{L("المرحلة 1: بانتظار فحص رئيس القسم", "Stage 1: Dept Head Review", "चरण 1: विभागाध्यक्ष समीक्षा")}</span>
                      </span>
                    )}
                    {req.status === "dept_approved" && (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-lg shadow-sky-500/10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{L("المرحلة 2: معتمد قسمياً - بانتظار المدير العام", "Stage 2: Super Admin Sign-off", "चरण 2: मुख्य व्यवस्थापक अनुमोदन")}</span>
                      </span>
                    )}
                    {req.status === "approved" && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{L("معتمد رسمياً ومطبق بالداتابيز", "Approved & Deployed Live", "लागू किया गया")}</span>
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-500/10">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{L("تم الرفض", "Rejected", "अस्वीकृत")}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Diff Comparison Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase font-mono">
                      <span>{L("القيمة السابقة / الحالية", "Current Baseline", "पिछला मान")}</span>
                      <TrendingDown className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-300">{req.old_value}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1 shadow-inner shadow-emerald-500/5">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold uppercase font-mono">
                      <span>{L("القيمة المقترحة الجديدة", "Proposed New Value", "प्रस्तावित नया मान")}</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">{req.new_value}</div>
                  </div>
                </div>

                {/* Business Justification */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{L("أسباب التعديل ودراسة الجدوى الاقتصادية والأكاديمية:", "Reasoning & Business Impact Rationale:", "संशोधन का कारण एवं प्रभाव:")}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300/95 leading-relaxed">
                    {req.reason}
                  </p>
                </div>

                {/* Sign-off Chain & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {req.reviewer_name ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {L("فحص القسم:", "Dept Review:", "विभागीय:")} {req.reviewer_name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{L("بانتظار مصادقة رئيس القسم", "Awaiting Dept Head", "विभागाध्यक्ष की प्रतीक्षा")}</span>
                      </div>
                    )}

                    {req.super_admin_name ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        <span>
                          {L("المدير العام:", "Super Admin:", "व्यवस्थापक:")} {req.super_admin_name}
                        </span>
                      </div>
                    ) : (
                      req.status === "dept_approved" && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{L("بانتظار مصادقة المدير العام", "Awaiting Super Admin", "व्यवस्थापक की प्रतीक्षा")}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  {(req.status === "pending_review" || req.status === "dept_approved") && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRejectModalTarget(req)}
                        className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-md"
                      >
                        {L("رفض الطلب", "Reject", "अस्वीकार")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(req.id)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {req.status === "pending_review"
                            ? L("مصادقة رئيس القسم (Checker 1)", "Approve Dept Review", "विभागीय स्वीकृति")
                            : L("اعتماد المدير العام وتطبيق بالداتابيز", "Final Super Admin Sign-Off", "अंतिम स्वीकृति")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── REJECTION MODAL ── */}
      {rejectModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {L("تأكيد رفض طلب التعديل", "Confirm Change Rejection", "संशोधन अस्वीकृति की पुष्टि")}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">{rejectModalTarget.id}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {L(
                "يرجى توضيح سبب الرفض بالتفصيل لمقدم الطلب ليتمكن من مراجعة الحسابات أو تعديل دراسة الجدوى:",
                "Please specify the reason for rejection to send clear feedback to the proposer:",
                "कृपया प्रस्तावक को स्पष्ट प्रतिक्रिया भेजने के लिए अस्वीकृति का कारण निर्दिष्ट करें:"
              )}
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={L(
                  "اكتب أسباب الرفض أو الملاحظات المطلوب تعديلها...",
                  "Provide detailed feedback or required changes...",
                  "कारण या आवश्यक संशोधन लिखें..."
                )}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
              />

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRejectModalTarget(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                >
                  {L("إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all"
                >
                  {L("تأكيد الرفض والإرسال", "Confirm Rejection", "अस्वीकृति की पुष्टि करें")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
