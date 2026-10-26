/**
 * features/admin/pages/AdminFinancePage.tsx
 *
 * Accounting, Finance & Product Pricing Governance Center.
 * Handles subscription revenues, ZATCA VAT compliance, pricing catalog,
 * and structured Maker-Checker approval proposals for pricing and service changes.
 * Elevated with luxury dark-navy aesthetics, ambient telemetry cards, and ZATCA invoice inspection.
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import {
  DollarSign,
  TrendingUp,
  Receipt,
  FileCheck,
  Plus,
  ShieldCheck,
  Layers,
  Building2,
  Lock,
  Download,
  CreditCard,
  QrCode,
  X,
  CheckCircle2,
} from "lucide-react"
import toast from "react-hot-toast"

interface PricingPlan {
  id: number
  slug: string
  name_ar: string
  name_en: string
  price_sar: number
  yearly_price_sar: number
  billing_cycle: string
  max_jobs: number
  max_campaigns: number
  features: string[]
  badge?: string
  status: "active" | "under_review" | "draft"
  last_updated: string
}

interface InvoiceItem {
  id: string
  company_name: string
  company_cr: string
  plan_name: string
  amount_sar: number
  vat_sar: number
  total_sar: number
  payment_method: "Mada" | "Visa" | "Apple Pay" | "Bank Transfer"
  status: "paid" | "pending" | "refunded"
  date: string
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 1,
    slug: "starter",
    name_ar: "باقة المنشآت الناشئة (Starter)",
    name_en: "Starter Enterprise Plan",
    price_sar: 499,
    yearly_price_sar: 4990,
    billing_cycle: "شهري",
    max_jobs: 5,
    max_campaigns: 3,
    badge: "للشركات الناشئة",
    features: [
      "نشر حتى 5 وظائف نشطة متزامنة",
      "3 حملات استقطاب للكوادر التعاونية",
      "تصفية وفرز السير الذاتية آلياً",
      "دعم فني عبر البريد ولوحة التحكم",
    ],
    status: "active",
    last_updated: "2026-01-15",
  },
  {
    id: 2,
    slug: "professional",
    name_ar: "باقة النمو الاحترافي (Professional)",
    name_en: "Professional Growth Plan",
    price_sar: 1299,
    yearly_price_sar: 12990,
    billing_cycle: "شهري",
    max_jobs: 20,
    max_campaigns: 10,
    badge: "الأكثر طلباً",
    features: [
      "نشر حتى 20 وظيفة نشطة متزامنة",
      "10 حملات تسويقية للكوادر الشابة",
      "ربط مباشر مع حاضنات الجامعات",
      "تقارير مطابقة NCAAA والتدريب التعاوني",
      "أولوية في ترشيح الخريجين المتميزين",
    ],
    status: "active",
    last_updated: "2026-02-01",
  },
  {
    id: 3,
    slug: "enterprise",
    name_ar: "باقة الشركات الكبرى والمؤسسات (Enterprise)",
    name_en: "Enterprise Unlimited Plan",
    price_sar: 2899,
    yearly_price_sar: 28990,
    billing_cycle: "شهري",
    max_jobs: 100,
    max_campaigns: 50,
    badge: "للمجموعات الكبرى",
    features: [
      "وظائف غير محدودة واستقطاب شامل",
      "50 حملة تسويق توظيفية موجهة",
      "مدير حساب مخصص وفريق استشاري",
      "تكامل مخصص مع أنظمة الـ ERP والـ HRMS",
      "فواتير ضريبية مفلترة بنظام الربط المباشر",
    ],
    status: "active",
    last_updated: "2026-02-10",
  },
]

const DEFAULT_INVOICES: InvoiceItem[] = [
  {
    id: "INV-2026-0891",
    company_name: "شركة أرامكو الرقمية (Aramco Digital)",
    company_cr: "2050123456",
    plan_name: "Enterprise Unlimited",
    amount_sar: 2899,
    vat_sar: 434.85,
    total_sar: 3333.85,
    payment_method: "Mada",
    status: "paid",
    date: "2026-10-24",
  },
  {
    id: "INV-2026-0890",
    company_name: "شركة هكتار للتقنية الزراعية (Hectare)",
    company_cr: "2251098765",
    plan_name: "Professional Growth",
    amount_sar: 1299,
    vat_sar: 194.85,
    total_sar: 1493.85,
    payment_method: "Visa",
    status: "paid",
    date: "2026-10-23",
  },
  {
    id: "INV-2026-0889",
    company_name: "منصة تمور الأحساء (AhsaDates)",
    company_cr: "2251076543",
    plan_name: "Starter Enterprise",
    amount_sar: 499,
    vat_sar: 74.85,
    total_sar: 573.85,
    payment_method: "Apple Pay",
    status: "paid",
    date: "2026-10-22",
  },
  {
    id: "INV-2026-0888",
    company_name: "شركة واحة لوجستيك (Waha AI)",
    company_cr: "2251034211",
    plan_name: "Professional Growth",
    amount_sar: 1299,
    vat_sar: 194.85,
    total_sar: 1493.85,
    payment_method: "Bank Transfer",
    status: "pending",
    date: "2026-10-21",
  },
]

export function AdminFinancePage() {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const [activeTab, setActiveTab] = useState<"catalog" | "invoices">("catalog")
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [proposedPrice, setProposedPrice] = useState<number>(0)
  const [proposalReason, setProposalReason] = useState<string>("")
  const [proposerDepartment, setProposerDepartment] = useState<string>("المحاسبة والمالية")
  const [inspectedInvoice, setInspectedInvoice] = useState<InvoiceItem | null>(null)

  const handleOpenProposal = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setProposedPrice(plan.price_sar)
    setProposalReason("")
    setIsProposalModalOpen(true)
  }

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !proposalReason.trim()) return

    // Maker-Checker state change: mark under review
    setPlans(prev =>
      prev.map(p => (p.id === selectedPlan.id ? { ...p, status: "under_review" } : p))
    )

    toast.success(
      L(
        "تم رفع طلب تعديل التسعير بنجاح وتوجيهه لطابور الموافقات (Maker-Checker Queue)!",
        "Pricing change proposal submitted to the multi-tier approval workflow!"
      )
    )
    setIsProposalModalOpen(false)
  }

  // Calculate percentage difference
  const priceDiffPercent = selectedPlan && selectedPlan.price_sar > 0
    ? Math.round(((proposedPrice - selectedPlan.price_sar) / selectedPlan.price_sar) * 100)
    : 0

  return (
    <div className="space-y-8 pb-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── LUXURY HERO HEADER WITH AMBIENT LIGHT MESH ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#071326] via-[#0b1f3d] to-[#050c18] p-7 md:p-10 backdrop-blur-3xl shadow-2xl transition-all">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Accent Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 via-sky-400 to-amber-400 shadow-md shadow-emerald-500/20" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-inner shadow-emerald-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>{L("المالية والمحاسبة والامتثال الضريبي (ZATCA)", "Finance, Invoicing & ZATCA Tax Compliance", "वित्त एवं कर अनुपालन")}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-emerald-300 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{L("الفوترة الإلكترونية المرحلة 2 المعتمدة", "ZATCA Phase 2 E-Invoicing Ready", "इलेक्ट्रॉनिक इनवॉइसिंग फेज 2")}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white md:text-4xl tracking-tight font-heading leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {L("لوحة التحكم المالي وإدارة أسعار المنتجات والخدمات", "Financial Governance & Pricing Catalog", "वित्तीय नियंत्रण एवं सेवा मूल्य निर्धारण")}
            </h1>

            <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-normal">
              {L(
                "متابعة إيرادات الاشتراكات، فواتير ضريبة القيمة المضافة (15%) المتوافقة مع هيئة الزكاة والضريبة والجمارك، وحوكمة تعديل باقات الخدمات وفق مبدأ صانع القرار والمدقق.",
                "Real-time subscription ARR/MRR metrics, ZATCA Phase 2 compliant tax invoicing, and Maker-Checker governed pricing catalog operations.",
                "सब्सक्रिप्शन राजस्व, वैट चालान और मूल्य संशोधन अनुमोदन कार्यप्रवाह की निगरानी करें।"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedPlan(plans[0])
                setProposedPrice(plans[0].price_sar)
                setIsProposalModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{L("طلب تعديل تسعير / خدمة", "Propose Pricing Change", "मूल्य संशोधन का प्रस्ताव दें")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FINANCIAL TELEMETRY CARDS ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="font-heading">{L("إجمالي الإيرادات المحققة", "Total Revenue", "कुल राजस्व")}</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            184,520 <span className="text-xs text-slate-400 font-normal font-sans">{L("ر.س", "SAR", "SAR")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% {L("نمو مقارنة بالشهر السابق", "vs last month", "पिछले माह की तुलना में")}</span>
          </div>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-sky-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-sky-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-sky-400">
            <span className="font-heading">{L("الإيرادات الشهرية المتكررة (MRR)", "Monthly Recurring (MRR)", "मासिक आवर्ती राजस्व")}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <Receipt className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            42,850 <span className="text-xs text-slate-400 font-normal font-sans">{L("ر.س", "SAR", "SAR")}</span>
          </div>
          <p className="text-xs text-slate-400">
            {L("عبر 38 اشتراكاً مؤسسياً نشطاً", "Across 38 active corporate clients", "38 सक्रिय कंपनियों के माध्यम से")}
          </p>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-purple-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span className="font-heading">{L("ضريبة القيمة المضافة (15%)", "ZATCA VAT Collected (15%)", "एकत्रित वैट (15%)")}</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            27,678 <span className="text-xs text-slate-400 font-normal font-sans">{L("ر.س", "SAR", "SAR")}</span>
          </div>
          <p className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{L("إقرار ضريبي جاهز ومطابق", "Ready for quarterly filing", "तिमाही फाइलिंग हेतु तैयार")}</span>
          </p>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="font-heading">{L("حوكمة الأسعار (4-Eyes)", "Dual-Control Status", "मूल्य नियंत्रण")}</span>
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-xl font-black text-white">
            {L("نظام الرقابة مشدّد ونشط", "Enforced Dual-Control", "4-आँखों का सिद्धांत सक्रिय")}
          </div>
          <p className="text-xs text-slate-400">
            {L("لا تعديل إلا بمصادقة الإدارة والمدير", "Zero unilateral pricing changes allowed", "परिवर्तन के लिए अनुमोदन अनिवार्य")}
          </p>
        </div>
      </div>

      {/* ── SEGMENTED NAVIGATION TABS ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{L("كتالوج باقات المنتجات والأسعار", "Pricing Plans & Catalog", "उत्पाद एवं मूल्य निर्धारण")}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white font-mono">{plans.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "invoices"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{L("فواتير المبيعات وضريبة ZATCA", "Invoices & ZATCA Ledger", "चालान और खाता")}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white font-mono">{DEFAULT_INVOICES.length}</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          {L("العملة المعتمدة: الريال السعودي (SAR)", "All figures in Saudi Riyals (SAR)", "सऊदी रियाल (SAR)")}
        </span>
      </div>

      {/* ── TAB 1: PRICING CATALOG ── */}
      {activeTab === "catalog" && (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const isFeatured = plan.slug === "professional"
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`relative overflow-hidden p-7 rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border transition-all duration-300 shadow-xl backdrop-blur-2xl flex flex-col justify-between group hover:shadow-2xl ${
                  isFeatured
                    ? "border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Background glow on featured */}
                {isFeatured && (
                  <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                )}

                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {plan.badge && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider mb-2 ${
                            isFeatured
                              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                              : "bg-white/10 text-slate-300 border border-white/10"
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-lg font-black text-white">{plan.name_ar}</h3>
                      <p className="text-xs text-slate-400">{plan.name_en}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        plan.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {plan.status === "active" ? L("نشط ومعتمد", "Active", "सक्रिय") : L("قيد مراجعة الاعتماد", "Under Review", "समीक्षाधीन")}
                    </span>
                  </div>

                  {/* Price Box */}
                  <div className="p-5 rounded-3xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-[11px] text-slate-400 font-semibold">{L("قيمة الاشتراك الشهري:", "Monthly Billing:", "मासिक मूल्य:")}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white font-mono tracking-tight">
                        {plan.price_sar.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {L("ر.س / شهر", "SAR / month", "SAR / माह")}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{L("السنوي المخصوم (-20%):", "Annual (-20%):", "वार्षिक:")}</span>
                      <strong className="text-white font-mono">{plan.yearly_price_sar.toLocaleString()} SAR</strong>
                    </div>
                  </div>

                  {/* Quotas */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block">{L("سعة الوظائف", "Max Jobs", "नौकरियां")}</span>
                      <strong className="text-sm font-black text-white font-mono">{plan.max_jobs}</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block">{L("حملات الكوادر", "Campaigns", "अभियान")}</span>
                      <strong className="text-sm font-black text-white font-mono">{plan.max_campaigns}</strong>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {L("المزايا المشمولة في الباقة:", "Included Features:", "शामिल सुविधाएं:")}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {L("اعتماد:", "Approved:", "अनुमोदित:")} {plan.last_updated}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenProposal(plan)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{L("اقتراح تعديل السعر", "Propose Price", "मूल्य प्रस्ताव")}</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── TAB 2: INVOICES & LEDGER ── */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-4 text-start">{L("رقم الفاتورة الضريبية", "ZATCA Invoice #", "चालान संख्या")}</th>
                  <th className="px-5 py-4 text-start">{L("الشركة المشتركة والـ CR", "Company & CR", "कंपनी")}</th>
                  <th className="px-5 py-4 text-start">{L("نوع الباقة", "Plan", "प्लान")}</th>
                  <th className="px-5 py-4 text-center">{L("المبلغ (قبل الضريبة)", "Subtotal", "उप-योग")}</th>
                  <th className="px-5 py-4 text-center">{L("ضريبة VAT (15%)", "VAT (15%)", "वैट (15%)")}</th>
                  <th className="px-5 py-4 text-center">{L("الإجمالي الشامل", "Total SAR", "कुल")}</th>
                  <th className="px-5 py-4 text-center">{L("وسيلة الدفع", "Payment Method", "भुगतान विधि")}</th>
                  <th className="px-5 py-4 text-center">{L("الحالة", "Status", "स्थिति")}</th>
                  <th className="px-5 py-4 text-end">{L("الإجراء", "Action", "कार्रवाई")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DEFAULT_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-amber-300 block">{inv.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{inv.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{inv.company_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">س.ت: {inv.company_cr}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-semibold">{inv.plan_name}</td>
                    <td className="px-5 py-4 text-center font-mono text-slate-300">
                      {inv.amount_sar.toLocaleString()} SAR
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-purple-300 font-bold">
                      +{inv.vat_sar.toFixed(2)} SAR
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-black text-emerald-400 text-sm">
                      {inv.total_sar.toLocaleString()} SAR
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">
                        <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                        <span>{inv.payment_method}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          inv.status === "paid"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === "paid" ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span>{inv.status === "paid" ? L("مسددة بالكامل", "Paid", "भुगतान किया") : L("بانتظار التحويل", "Pending", "लंबित")}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <button
                        type="button"
                        onClick={() => setInspectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all inline-flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{L("عرض الفاتورة", "View Tax Invoice", "चालान देखें")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PROPOSAL MODAL (MAKER-CHECKER FLOW) ── */}
      {isProposalModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {L("تقديم طلب تعديل تسعير باقة (Maker-Checker)", "Submit Pricing Change Proposal", "मूल्य संशोधन प्रस्ताव")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {L("يتطلب موافقة رئيس القسم المالي ثم المدير العام", "Requires Department Head + Super Admin Sign-off", "विभागाध्यक्ष एवं व्यवस्थापक की स्वीकृति")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProposalModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              {/* Plan Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1.5">
                <div className="text-[11px] text-slate-400 font-semibold">{L("الباقة المستهدفة:", "Target Plan:", "चयनित प्लान:")}</div>
                <div className="text-base font-black text-white">{selectedPlan.name_ar}</div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">{L("السعر الحالي الأساسي:", "Current Baseline Price:", "वर्तमान मूल्य:")}</span>
                  <strong className="font-mono text-amber-400 font-bold">{selectedPlan.price_sar} SAR / شهر</strong>
                </div>
              </div>

              {/* Proposed Price Input & Delta Badge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    {L("السعر المقترح الجديد (ر.س شهرياً):", "New Proposed Price (SAR):", "नया प्रस्तावित मूल्य:")} *
                  </label>
                  {priceDiffPercent !== 0 && (
                    <span
                      className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                        priceDiffPercent < 0
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {priceDiffPercent > 0 ? `+${priceDiffPercent}% زيادة` : `${priceDiffPercent}% خصم`}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-all"
                  />
                  <span className="absolute left-4 top-3.5 text-xs text-slate-500 font-mono">SAR</span>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  {L("القسم مقدّم الطلب:", "Proposing Department:", "प्रस्तावित विभाग:")}
                </label>
                <select
                  value={proposerDepartment}
                  onChange={(e) => setProposerDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                >
                  <option value="المحاسبة والمالية">{L("المحاسبة والمالية (Finance & Accounting)", "Finance & Accounting", "वित्त एवं लेखा")}</option>
                  <option value="التسويق وتطوير الأعمال">{L("التسويق وتطوير الأعمال (Marketing & Growth)", "Marketing & BD", "मार्केटिंग")}</option>
                  <option value="الإدارة التنفيذية">{L("الإدارة التنفيذية والعمليات (Operations)", "Executive Operations", "संचालन")}</option>
                </select>
              </div>

              {/* Business Rationale */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  {L("مبررات التعديل ودراسة الجدوى الاقتصادية:", "Business Justification & Impact:", "संशोधन का कारण:")} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalReason}
                  onChange={(e) => setProposalReason(e.target.value)}
                  placeholder={L(
                    "اذكر أسباب التعديل بالتفصيل (مثل: مواءمة أسعار الربع الرابع لجذب المنشآت المحتضنة)...",
                    "Provide detailed rationale (e.g. Q4 competitive positioning for incubator startups)...",
                    "संशोधन का विस्तृत कारण लिखें..."
                  )}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 space-y-0.5">
                <strong className="block font-bold">⚠️ {L("تنبيه الحوكمة الرقابية:", "Governance Notice:", "चेतावनी:")}</strong>
                <span>{L("لن يتم تطبيق هذا السعر مباشرة، بل سيُرسل لطابور الموافقات المزدوجة.", "Price will not change live until two executive sign-offs occur.")}</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                >
                  {L("إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{L("إرسال لسلسلة الاعتمادات", "Submit to Approval Chain", "अनुमोदन के लिए भेजें")}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── INSPECT ZATCA TAX INVOICE MODAL ── */}
      {inspectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {L("فاتورة ضريبية مبسطة (ZATCA Tax Invoice)", "ZATCA Electronic Tax Invoice", "इलेक्ट्रॉनिक कर चालान")}
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400">{inspectedInvoice.id}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedInvoice(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated ZATCA Invoice Layout */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-black text-sm text-emerald-400">منصة فائدة وظائف (Faeda Platform)</h4>
                  <p className="text-[10px] text-slate-400">الرقم الضريبي للمنشأة: 310987654300003</p>
                  <p className="text-[10px] text-slate-400">سجل تجاري: 2050987123</p>
                </div>
                <div className="p-2 bg-white rounded-xl">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              <div className="border-t border-dashed border-white/15 pt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">العميل:</span>
                  <span className="font-bold">{inspectedInvoice.company_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">السجل التجاري للعميل:</span>
                  <span className="font-mono">{inspectedInvoice.company_cr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">تاريخ الإصدار:</span>
                  <span className="font-mono">{inspectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">طريقة السداد:</span>
                  <span>{inspectedInvoice.payment_method}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-white/15 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>قيمة الباقة ({inspectedInvoice.plan_name}):</span>
                  <span className="font-mono">{inspectedInvoice.amount_sar} SAR</span>
                </div>
                <div className="flex justify-between text-purple-400 font-semibold">
                  <span>ضريبة القيمة المضافة VAT (15%):</span>
                  <span className="font-mono">+{inspectedInvoice.vat_sar.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between text-base font-black text-emerald-400 pt-1 border-t border-white/10">
                  <span>الإجمالي المستحق شامل الضريبة:</span>
                  <span className="font-mono">{inspectedInvoice.total_sar.toLocaleString()} SAR</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  toast.success(L("تم تنزيل الفاتورة بصيغة PDF معتمدة من ZATCA!", "Invoice PDF downloaded!"))
                  setInspectedInvoice(null)
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{L("تحميل الفاتورة الضريبية (PDF)", "Download Invoice PDF", "डाउनलोड करें")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
