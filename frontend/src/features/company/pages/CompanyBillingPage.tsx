/**
 * features/company/pages/CompanyBillingPage.tsx
 *
 * Company Subscription & Billing Management.
 * Fully integrated with Moyasar Payment Gateway (Saudi Mada, Credit Cards, Apple Pay)
 * and ZATCA VAT-compliant Electronic Tax Invoicing.
 */
import { useState, useEffect } from "react"
import { useTranslation } from "@/i18n"
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Lock,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import {
  billingService,
  type BillingPlan,
  type CompanySubscription,
  type InvoiceItem,
} from "../services/billing.service"
import { MoyasarCheckoutModal } from "../components/MoyasarCheckoutModal"
import { TaxInvoiceModal } from "../components/TaxInvoiceModal"

const DEFAULT_PLANS: BillingPlan[] = [
  {
    id: 1,
    slug: "starter",
    name_ar: "الباقة الأساسية",
    name_en: "Starter Plan",
    price_monthly: 199,
    price_yearly: 1990,
    currency: "SAR",
    billing_cycle: "monthly",
    max_jobs: 5,
    max_teams: 3,
    max_campaigns: 3,
    badge: null,
    features_ar: [
      "5 وظائف نشطة معلنة",
      "50 متقدم / شهرياً مع فحص السير",
      "3 حملات استقطاب كفاءات",
      "محادثات مباشرة مع المرشحين",
      "تقارير التوظيف الأساسية",
      "دعم فني عبر البريد"
    ],
    features_en: [
      "5 Active Job Postings",
      "50 Applications / month with ATS parsing",
      "3 Talent Discovery Campaigns",
      "Direct In-App Candidate Messaging",
      "Basic Recruitment Analytics",
      "Standard Email Support"
    ],
    sort_order: 1
  },
  {
    id: 2,
    slug: "professional",
    name_ar: "الباقة الاحترافية",
    name_en: "Professional Plan",
    price_monthly: 499,
    price_yearly: 4990,
    currency: "SAR",
    billing_cycle: "monthly",
    max_jobs: 25,
    max_teams: 10,
    max_campaigns: 20,
    badge: "POPULAR",
    features_ar: [
      "25 وظيفة نشطة معلنة",
      "500 متقدم / شهرياً مع مطابقة الذكاء الاصطناعي",
      "20 حملة توظيف متقدمة",
      "اكتشاف الكفاءات واستقطاب الفرق الجاهزة",
      "تقييم القيمة السوقية للمرشحين",
      "تحليلات توظيف متقدمة ومؤشرات أداء",
      "دعم أولوية مخصص على مدار الساعة"
    ],
    features_en: [
      "25 Active Job Postings",
      "500 Applications / month with AI matching",
      "20 Advanced Talent Campaigns",
      "Talent Pool & Ready-made Teams Discovery",
      "AI Candidate Market Value Scoring",
      "Advanced Hiring Pipeline & KPIs",
      "24/7 Priority Support"
    ],
    sort_order: 2
  },
  {
    id: 3,
    slug: "enterprise",
    name_ar: "باقة المؤسسات الكبرى",
    name_en: "Enterprise Elite",
    price_monthly: 0,
    price_yearly: 0,
    currency: "SAR",
    billing_cycle: "monthly",
    max_jobs: 9999,
    max_teams: 9999,
    max_campaigns: 9999,
    badge: "CUSTOM",
    features_ar: [
      "وظائف معلنة غير محدودة",
      "طلبات وتطبيقات غير محدودة",
      "حملات استقطاب وتوظيف غير محدودة",
      "تكامل كامل مع أنظمة المنشأة عبر API",
      "مدير حساب تقني مخصص",
      "اتفاقية مستوى خدمة (SLA) مضمونة 99.9%",
      "تقارير مخصصة وفواتير ضريبية مجدولة"
    ],
    features_en: [
      "Unlimited Active Job Postings",
      "Unlimited Candidate Applications",
      "Unlimited Talent Campaigns",
      "Full Corporate ATS API Integration",
      "Dedicated Enterprise Account Manager",
      "Guaranteed 99.9% Enterprise SLA",
      "Custom ZATCA-compliant Consolidated Invoicing"
    ],
    sort_order: 3
  }
]

/* ── Stat Card ─────────────────────────────────────────────────────── */
function UsageBar({
  label,
  used,
  max,
  color,
}: {
  label: string
  used: number
  max: number
  color: string
}) {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground font-mono">
          {used}/{max >= 999 ? "∞" : max}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-card/60 overflow-hidden border border-border/50">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">
        {pct}% {pct >= 80 ? "⚠️" : ""}
      </div>
    </div>
  )
}

export function CompanyBillingPage() {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string) => (language === "ar" ? ar : en)

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<BillingPlan[]>(DEFAULT_PLANS)
  const [subscription, setSubscription] = useState<CompanySubscription | null>(null)
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(false)

  // Modals state
  const [checkoutPlan, setCheckoutPlan] = useState<BillingPlan | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null)

  // Fetch initial billing data
  const loadBillingData = async () => {
    setLoading(true)
    try {
      const [fetchedPlans, subData, fetchedInvoices] = await Promise.all([
        billingService.getPlans().catch(() => DEFAULT_PLANS),
        billingService.getCurrentSubscription().catch(() => null),
        billingService.getInvoices().catch(() => []),
      ])

      if (fetchedPlans && fetchedPlans.length > 0) {
        setPlans(fetchedPlans)
      }
      if (subData?.subscription) {
        setSubscription(subData.subscription)
      }
      setInvoices(fetchedInvoices || [])
    } catch (err) {
      console.error("Failed to load billing data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBillingData()
  }, [])

  const handleUpgradeClick = (plan: BillingPlan) => {
    if (plan.slug === "enterprise") {
      window.open(
        "mailto:sales@faeda.jobs?subject=Faeda Enterprise ATS Plan Inquiry&body=Hello Faeda Sales Team, we are interested in upgrading to the Enterprise Tier.",
        "_blank"
      )
      return
    }
    setCheckoutPlan(plan)
  }

  const handlePaymentSuccess = (invoice: InvoiceItem) => {
    setUpgradeSuccess(invoice?.plan_name || checkoutPlan?.name_en || "Plan")
    setSelectedInvoice(null) // Do not auto-open or auto-download PDF
    loadBillingData()
    setTimeout(() => setUpgradeSuccess(null), 8000)
  }

  // Active plan details
  const activePlanSlug = subscription?.plan?.slug || "professional"
  const activePlan = plans.find((p) => p.slug === activePlanSlug) || plans[1] || plans[0] || DEFAULT_PLANS[1]

  return (
    <div className="space-y-6 pb-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-secondary" />
              {L("الاشتراك والفوترة وبوابة الدفع", "Subscription & Moyasar Billing")}
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-secondary flex items-center gap-1">
              <Lock className="w-3 h-3" /> Moyasar Gateway
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {L(
              "تحكم في باقة اشتراك منشأتك، وسجل الفواتير الضريبية المعتمدة (ZATCA)، ومدفوعات مدى وApple Pay.",
              "Manage corporate tier subscriptions, ZATCA tax invoices, and Mada / Apple Pay payments."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={loadBillingData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card/70 hover:bg-card text-muted-foreground hover:text-white border border-border text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {L("تحديث البيانات", "Refresh")}
        </button>
      </div>

      {/* Saudi Compliance & Payment Trust Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-card/50 border border-border/80 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white font-heading truncate">{L("مرخص من ساما SAMA", "SAMA Licensed")}</p>
            <p className="text-[10px] text-muted-foreground truncate">{L("بوابة ميسر للمدفوعات", "Moyasar Payments")}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card/50 border border-border/80 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white font-heading truncate">{L("فوترة زاتكا ZATCA", "ZATCA Invoicing")}</p>
            <p className="text-[10px] text-muted-foreground truncate">{L("فواتير ضريبية 15% معتمدة", "15% VAT Compliant")}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card/50 border border-border/80 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white font-heading truncate">{L("مدى و Apple Pay", "Mada & Apple Pay")}</p>
            <p className="text-[10px] text-muted-foreground truncate">{L("دفع فوري بالريال السعودي", "Instant SAR Settlement")}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card/50 border border-border/80 flex items-center gap-3 shadow-sm hover:border-primary/40 transition-all">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white font-heading truncate">{L("تشفير فائق PCI-DSS", "PCI-DSS Level 1")}</p>
            <p className="text-[10px] text-muted-foreground truncate">{L("حماية مصرفية للمعلومات", "Bank-grade Security")}</p>
          </div>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              {L(
                `تمت ترقية وتفعيل اشتراك منشأتك بنجاح عبر بوابة ميسر! تم إصدار الفاتورة الضريبية.`,
                `Successfully upgraded to ${upgradeSuccess} via Moyasar Gateway! Tax invoice generated.`
              )}
            </span>
          </div>
          {selectedInvoice && (
            <button
              type="button"
              onClick={() => setSelectedInvoice(selectedInvoice)}
              className="text-xs underline hover:text-white ml-2"
            >
              {L("عرض الفاتورة الضريبية", "View Tax Invoice")}
            </button>
          )}
        </div>
      )}

      {/* Current Plan Card */}
      {loading && !activePlan ? (
        <div className="p-8 rounded-2xl border border-border bg-card/40 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-card/80 to-accent/5 backdrop-blur-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-secondary">
                <Star className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white font-heading">
                    {language === "ar" ? activePlan?.name_ar : activePlan?.name_en}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {L("نشط ومفعل", "Active Tier")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  <span className="font-mono font-bold text-white">
                    {billing === "yearly"
                      ? Math.round((activePlan?.price_yearly || 0) / 12)
                      : activePlan?.price_monthly}{" "}
                    SAR
                  </span>{" "}
                  / {L("شهر", "month")} · {L("التجديد في:", "Renewal on:")}{" "}
                  <span className="font-mono text-foreground font-bold">
                    {subscription?.end_date?.slice(0, 10) || "2026-11-14"}
                  </span>{" "}
                  ({subscription?.days_remaining || 30} {L("يوم متبقي", "days left")})
                </p>
              </div>
            </div>

            {/* Saudi Payments Badges */}
            <div className="flex items-center gap-2 bg-card/60 border border-border px-3 py-1.5 rounded-xl text-[11px] text-muted-foreground">
              <span>مدى Mada</span>
              <span>•</span>
              <span>Apple Pay</span>
              <span>•</span>
              <span>Visa / MC</span>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-border/50">
            <UsageBar
              label={L("الوظائف النشطة المعلنة", "Active Job Ads")}
              used={subscription?.usage?.active_jobs ?? 12}
              max={activePlan?.max_jobs || 25}
              color="bg-primary"
            />
            <UsageBar
              label={L("حملات استقطاب الكفاءات", "Talent Campaigns")}
              used={subscription?.usage?.campaigns ?? 8}
              max={activePlan?.max_campaigns || 20}
              color="bg-secondary"
            />
            <UsageBar
              label={L("طلبات التوظيف هذا الشهر", "Monthly Applications")}
              used={subscription?.usage?.monthly_applications ?? 234}
              max={subscription?.usage?.max_applications || 500}
              color="bg-accent"
            />
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex items-center gap-1 rounded-2xl bg-card/60 border border-border p-1.5 shadow-md">
          {(["monthly", "yearly"] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBilling(cycle)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                billing === cycle
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {cycle === "monthly" ? (
                L("اشتراك شهري", "Monthly Billing")
              ) : (
                <span className="flex items-center gap-2">
                  <span>{L("اشتراك سنوي", "Annual Billing")}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30">
                    {L("وفر 17%", "Save 17%")}
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = (subscription?.plan?.slug || "professional") === p.slug
          const price = billing === "yearly" ? Math.round(p.price_yearly / 12) : p.price_monthly
          const features = language === "ar" ? p.features_ar : p.features_en
          const Icon = p.slug === "starter" ? Zap : p.slug === "enterprise" ? Crown : Star

          return (
            <div
              key={p.id}
              className={`relative rounded-3xl border backdrop-blur-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isCurrent
                  ? "border-emerald-500/50 bg-gradient-to-b from-card/90 via-emerald-950/20 to-card/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                  : p.slug === "professional"
                  ? "border-secondary/60 bg-gradient-to-b from-card/95 via-primary/15 to-card/80 shadow-2xl shadow-primary/20 ring-1 ring-secondary/40"
                  : "border-border/80 bg-card/60 hover:border-primary/40 hover:bg-card/80"
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`text-[10px] font-black px-4 py-1 rounded-full border shadow-lg uppercase tracking-wider ${
                      isCurrent
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                        : p.slug === "professional"
                        ? "bg-gradient-to-r from-primary to-secondary text-white border-secondary/60 shadow-primary/40"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
                    p.slug === "starter"
                      ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
                      : p.slug === "enterprise"
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-secondary bg-primary/20 border-primary/30"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-black text-white font-heading">
                    {language === "ar" ? p.name_ar : p.name_en}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {L("باقتك المفعلة حالياً", "Current Active Plan")}
                    </p>
                  )}
                </div>
              </div>

              {p.price_monthly === 0 ? (
                <div className="mb-6">
                  <span className="text-2xl font-black text-white font-heading">
                    {L("تسعير مخصص", "Custom Pricing")}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {L("حلول مؤسسية للشركات الكبرى والجهات الحكومية", "Tailored ATS for large enterprises")}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white font-mono tracking-tight">{price}</span>
                    <span className="text-xs text-muted-foreground font-bold">
                      {L("ر.س / شهر", "SAR / mo")}
                    </span>
                  </div>
                  {billing === "yearly" && (
                    <p className="text-[11px] text-emerald-400 mt-1 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {L(`يُدفع ${p.price_yearly} ر.س سنوياً شامل التخفيض`, `Billed annually at ${p.price_yearly} SAR`)}
                    </p>
                  )}
                </div>
              )}

              <ul className="space-y-2.5 mb-6 flex-1 border-t border-border/50 pt-4">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default flex items-center justify-center gap-2 shadow-inner"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {L("باقتك الحالية النشطة", "Current Active Plan")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleUpgradeClick(p)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all shadow-md group cursor-pointer ${
                    p.slug === "professional"
                      ? "bg-gradient-to-r from-primary via-primary/90 to-secondary text-white hover:opacity-95 shadow-primary/30"
                      : "bg-card hover:bg-card/90 text-white border border-border hover:border-primary/40"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>
                    {p.slug === "enterprise"
                      ? L("تواصل مع المبيعات", "Contact Sales")
                      : L("ترقية ودفع فوري عبر ميسر", "Upgrade via Moyasar")}
                  </span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Payment History & Tax Invoices */}
      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/40 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-heading">
                {L("سجل المدفوعات والفواتير الضريبية", "Payment History & ZATCA Tax Invoices")}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {L(
                  "فواتيرك الضريبية الإلكترونية المعتمدة الصادرة عبر بوابة ميسر",
                  "Approved electronic invoices issued via Moyasar Payment Gateway"
                )}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {invoices.length} {L("فواتير مسجلة", "Invoices")}
          </span>
        </div>

        <div className="divide-y divide-border">
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {L("لا توجد فواتير سابقة مسجلة لمنشأتك حتى الآن.", "No previous invoices recorded for this company.")}
            </div>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-card/30 transition-colors flex-wrap gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-card/60 border border-border flex items-center justify-center text-muted-foreground">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-bold text-foreground">
                        {inv.invoice_number}
                      </p>
                      <span className="text-[10px] text-muted-foreground bg-card/60 px-2 py-0.5 rounded border border-border">
                        {inv.payment_method_label || "مدى / بطاقة"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      {inv.date} · {inv.plan_name} · VAT: {inv.vat_amount?.toFixed(2)} SAR
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right rtl:text-left">
                    <span className="text-sm font-black text-white font-mono">
                      {inv.amount.toFixed(2)} SAR
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {L("شامل ضريبة 15%", "Incl. 15% VAT")}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      inv.status === "completed" || inv.status === "paid"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    {inv.status === "completed" || inv.status === "paid"
                      ? L("مدفوع معتمد", "Paid")
                      : L("بانتظار", "Pending")}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-secondary border border-primary/20 text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{L("عرض الفاتورة", "Tax Invoice")}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Moyasar Checkout Modal */}
      {checkoutPlan && (
        <MoyasarCheckoutModal
          isOpen={Boolean(checkoutPlan)}
          onClose={() => setCheckoutPlan(null)}
          plan={checkoutPlan}
          billingCycle={billing}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* ZATCA Tax Invoice Modal */}
      {selectedInvoice && (
        <TaxInvoiceModal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  )
}
