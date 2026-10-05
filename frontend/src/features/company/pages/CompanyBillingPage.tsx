/**
 * features/company/pages/CompanyBillingPage.tsx
 *
 * Company Subscription & Billing Management.
 * Shows active plan, usage metrics, available plans to upgrade,
 * and payment history. Matches the dark Faeda design system.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import {
  CreditCard, CheckCircle2, Zap, Star, Crown,
  Calendar, ArrowUpRight, ShieldCheck, Loader2, ExternalLink,
} from "lucide-react"

/* ── Plan definitions ───────────────────────────────────────────────── */
const PLANS = [
  {
    id: "starter",
    nameAr: "الباقة الأساسية",
    nameEn: "Starter",
    priceMonthly: 199,
    priceYearly: 1990,
    currency: "SAR",
    icon: Zap,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    badge: null,
    featuresAr: ["5 وظائف نشطة", "50 طلب / شهر", "3 حملات توظيف", "محادثات مباشرة", "تقارير أساسية"],
    featuresEn: ["5 active jobs", "50 applications/mo", "3 talent campaigns", "Direct messaging", "Basic analytics"],
    maxJobs: 5, maxCampaigns: 3,
  },
  {
    id: "professional",
    nameAr: "الباقة الاحترافية",
    nameEn: "Professional",
    priceMonthly: 499,
    priceYearly: 4990,
    currency: "SAR",
    icon: Star,
    color: "text-primary bg-primary/10 border-primary/20",
    badge: "POPULAR",
    featuresAr: ["25 وظيفة نشطة", "500 طلب / شهر", "20 حملة توظيف", "اكتشاف الكفاءات", "تحليلات متقدمة", "دعم أولوية"],
    featuresEn: ["25 active jobs", "500 applications/mo", "20 talent campaigns", "Talent Discovery", "Advanced analytics", "Priority support"],
    maxJobs: 25, maxCampaigns: 20,
  },
  {
    id: "enterprise",
    nameAr: "باقة المؤسسات",
    nameEn: "Enterprise",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "SAR",
    icon: Crown,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "CUSTOM",
    featuresAr: ["وظائف غير محدودة", "طلبات غير محدودة", "حملات غير محدودة", "مدير حساب مخصص", "تكامل API", "SLA مضمون"],
    featuresEn: ["Unlimited jobs", "Unlimited applications", "Unlimited campaigns", "Dedicated account manager", "API integration", "Guaranteed SLA"],
    maxJobs: 999, maxCampaigns: 999,
  },
]

const PAYMENT_HISTORY = [
  { id: "INV-2026-009", date: "2026-09-01", plan: "Professional", amount: 499, status: "paid" },
  { id: "INV-2026-008", date: "2026-08-01", plan: "Professional", amount: 499, status: "paid" },
  { id: "INV-2026-007", date: "2026-07-01", plan: "Starter", amount: 199, status: "paid" },
  { id: "INV-2026-006", date: "2026-06-01", plan: "Starter", amount: 199, status: "refunded" },
]

/* ── Stat Card ─────────────────────────────────────────────────────── */
function UsageBar({ label, used, max, color }: { label: string; used: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((used / max) * 100))
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{used}/{max}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-card/50 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10px] text-muted-foreground">{pct}% {pct >= 80 ? "⚠️" : ""}</div>
    </div>
  )
}

export function CompanyBillingPage() {
  const { language } = useTranslation()
  const L = (ar: string, en: string) => language === "ar" ? ar : en
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [currentPlan] = useState("professional")
  const [upgrading, setUpgrading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === "enterprise") {
      window.open("mailto:sales@faeda.jobs?subject=Enterprise Plan Inquiry", "_blank")
      return
    }
    setUpgrading(planId)
    await new Promise(r => setTimeout(r, 1200))
    setUpgrading(null)
  }

  const activePlan = PLANS.find(p => p.id === currentPlan)!

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-secondary" />
          {L("الاشتراك والفوترة", "Subscription & Billing")}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {L("تحكم في باقة الاشتراك والمدفوعات لمنشأتك.", "Manage your company subscription plan and payment history.")}
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/80 to-accent/5 backdrop-blur-md p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <activePlan.icon className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  {L(activePlan.nameAr, activePlan.nameEn)}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {L("نشط", "Active")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activePlan.priceMonthly} SAR / {L("شهر", "month")} · {L("تجديد تلقائي في", "Renews on")} 2026-11-01
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
            {L("إدارة الفاتورة", "Manage Billing")}
          </button>
        </div>

        {/* Usage */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UsageBar label={L("الوظائف النشطة", "Active Jobs")} used={12} max={activePlan.maxJobs} color="bg-primary" />
          <UsageBar label={L("الحملات الوظيفية", "Campaigns")} used={8} max={activePlan.maxCampaigns} color="bg-secondary" />
          <UsageBar label={L("الطلبات هذا الشهر", "Monthly Applications")} used={234} max={500} color="bg-accent" />
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 rounded-xl bg-card/60 border border-border p-1">
          {(["monthly", "yearly"] as const).map((cycle) => (
            <button key={cycle} type="button" onClick={() => setBilling(cycle)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billing === cycle ? "bg-primary/20 text-secondary border border-primary/30" : "text-muted-foreground hover:text-white"}`}>
              {cycle === "monthly" ? L("شهري", "Monthly") : (
                <span className="flex items-center gap-1.5">
                  {L("سنوي", "Yearly")}
                  <span className="text-[10px] text-emerald-400 font-bold">{L("وفّر 17%", "Save 17%")}</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const isCurrent = plan.id === currentPlan
          const price = billing === "yearly" ? Math.round(plan.priceYearly / 12) : plan.priceMonthly
          const features = language === "ar" ? plan.featuresAr : plan.featuresEn

          return (
            <div key={plan.id}
              className={`relative rounded-2xl border bg-card/60 backdrop-blur-md p-5 flex flex-col transition-all hover:shadow-xl ${isCurrent ? "border-primary/40 shadow-lg shadow-primary/10" : "border-border hover:border-primary/20"}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${isCurrent || plan.badge === "POPULAR" ? "bg-primary/20 border-primary/30 text-secondary" : "bg-amber-500/15 border-amber-500/30 text-amber-400"}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${plan.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{L(plan.nameAr, plan.nameEn)}</p>
                  {isCurrent && <p className="text-[10px] text-emerald-400 font-bold">{L("باقتك الحالية", "Current Plan")}</p>}
                </div>
              </div>

              {plan.priceMonthly === 0 ? (
                <div className="mb-4">
                  <span className="text-xl font-black text-white">{L("حسب الطلب", "Custom Pricing")}</span>
                </div>
              ) : (
                <div className="mb-4">
                  <span className="text-2xl font-black text-white">{price}</span>
                  <span className="text-xs text-muted-foreground ml-1">SAR/{L("شهر", "mo")}</span>
                  {billing === "yearly" && (
                    <p className="text-[11px] text-emerald-400 mt-0.5">{L("يُدفع سنوياً", "Billed annually")}</p>
                  )}
                </div>
              )}

              <ul className="space-y-2 mb-5 flex-1">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-secondary border border-primary/20 cursor-default">
                  {L("باقتك الحالية", "Current Plan")}
                </button>
              ) : (
                <button type="button" onClick={() => handleUpgrade(plan.id)} disabled={upgrading === plan.id}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-card hover:bg-card/80 text-foreground border border-border hover:border-primary/30 transition-all">
                  {upgrading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                  {plan.id === "enterprise" ? L("تواصل معنا", "Contact Sales") : L("ترقية الباقة", "Upgrade")}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/40">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{L("سجل المدفوعات", "Payment History")}</h2>
            <p className="text-[11px] text-muted-foreground">{L("فواتيرك السابقة", "Your previous invoices")}</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {PAYMENT_HISTORY.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-card/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-card/50 border border-border flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{inv.id}</p>
                  <p className="text-[11px] text-muted-foreground">{inv.date} · {inv.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">{inv.amount} SAR</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  inv.status === "paid" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}>
                  {inv.status === "paid" ? L("مدفوع", "Paid") : L("مسترد", "Refunded")}
                </span>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
