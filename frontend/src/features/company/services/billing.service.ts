/**
 * billing.service.ts
 *
 * Client-side HTTP service for Employer Subscriptions, Moyasar Gateway Checkout,
 * and ZATCA VAT-compliant Invoices.
 */
import { apiClient } from "@/lib/api-client"

export interface BillingPlan {
  id: number
  slug: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  price_monthly: number
  price_yearly: number
  currency: string
  billing_cycle: "monthly" | "yearly"
  max_jobs: number
  max_teams: number
  max_campaigns: number
  badge?: string | null
  features_ar: string[]
  features_en: string[]
  sort_order: number
}

export interface CompanyUsage {
  active_jobs: number
  max_jobs: number
  campaigns: number
  max_campaigns: number
  monthly_applications: number
  max_applications: number
}

export interface CompanySubscription {
  id: number
  subscriber_type: string
  subscriber_id: number
  plan_id: number
  plan: BillingPlan | null
  status: "active" | "expired" | "cancelled" | "trial"
  status_label: string
  billing_cycle: "monthly" | "yearly"
  start_date: string | null
  end_date: string | null
  auto_renew: boolean
  is_expired: boolean
  days_remaining: number
  usage: CompanyUsage
}

export interface InvoiceItem {
  id: number
  invoice_number: string
  subscription_id: number
  plan_name: string
  amount: number
  subtotal: number
  vat_amount: number
  vat_rate: string
  currency: string
  payment_method: string
  payment_method_label: string
  moyasar_payment_id?: string
  transaction_id: string
  status: "completed" | "paid" | "pending" | "failed" | "refunded"
  status_label: string
  date: string
  created_at: string
  company_vat_number: string
}

export interface CheckoutQuote {
  plan_id: number
  plan_slug: string
  plan_name: string
  billing_cycle: "monthly" | "yearly"
  subtotal: number
  vat_rate: string
  vat_amount: number
  total_amount: number
  currency: string
  amount_halalas: number
  moyasar_publishable_key: string
  supported_methods: string[]
}

export interface PaymentVerificationPayload {
  plan_id: string | number
  billing_cycle: "monthly" | "yearly"
  payment_method: "mada" | "creditcard" | "applepay"
  payment_id?: string
  cardholder_name?: string
  card_last4?: string
}

export const billingService = {
  /**
   * Fetch all active corporate tiers
   */
  async getPlans(): Promise<BillingPlan[]> {
    try {
      const resp = await apiClient.get<{ success: boolean; plans: BillingPlan[] }>("/api/v1/billing/plans")
      return resp.data.plans || []
    } catch (err) {
      console.warn("Falling back to standard plans:", err)
      return [
        {
          id: 1,
          slug: "starter",
          name_ar: "الباقة الأساسية",
          name_en: "Starter",
          price_monthly: 199,
          price_yearly: 1990,
          currency: "SAR",
          billing_cycle: "monthly",
          max_jobs: 5,
          max_teams: 3,
          max_campaigns: 3,
          badge: null,
          features_ar: ["5 وظائف نشطة", "50 طلب / شهر", "3 حملات توظيف", "محادثات مباشرة", "تقارير أساسية"],
          features_en: ["5 active jobs", "50 applications/mo", "3 talent campaigns", "Direct messaging", "Basic analytics"],
          sort_order: 1
        },
        {
          id: 2,
          slug: "professional",
          name_ar: "الباقة الاحترافية",
          name_en: "Professional",
          price_monthly: 499,
          price_yearly: 4990,
          currency: "SAR",
          billing_cycle: "monthly",
          max_jobs: 25,
          max_teams: 10,
          max_campaigns: 20,
          badge: "POPULAR",
          features_ar: ["25 وظيفة نشطة", "500 طلب / شهر", "20 حملة توظيف", "اكتشاف الكفاءات", "تحليلات متقدمة", "دعم أولوية"],
          features_en: ["25 active jobs", "500 applications/mo", "20 talent campaigns", "Talent Discovery", "Advanced analytics", "Priority support"],
          sort_order: 2
        },
        {
          id: 3,
          slug: "enterprise",
          name_ar: "باقة المؤسسات الكبرى",
          name_en: "Enterprise",
          price_monthly: 0,
          price_yearly: 0,
          currency: "SAR",
          billing_cycle: "monthly",
          max_jobs: 999,
          max_teams: 999,
          max_campaigns: 999,
          badge: "CUSTOM",
          features_ar: ["وظائف غير محدودة", "طلبات غير محدودة", "حملات غير محدودة", "مدير حساب مخصص", "تكامل API", "SLA مضمون"],
          features_en: ["Unlimited jobs", "Unlimited applications", "Unlimited campaigns", "Dedicated account manager", "API integration", "Guaranteed SLA"],
          sort_order: 3
        }
      ]
    }
  },

  /**
   * Fetch current subscription and usage limits
   */
  async getCurrentSubscription(): Promise<{ subscription: CompanySubscription; moyasar_publishable_key: string }> {
    const resp = await apiClient.get<{
      success: boolean
      subscription: CompanySubscription
      moyasar_publishable_key: string
    }>("/api/v1/billing/subscription")
    return resp.data
  },

  /**
   * Request checkout quote with 15% VAT breakdown
   */
  async initiateCheckout(planId: string | number, billingCycle: "monthly" | "yearly"): Promise<CheckoutQuote> {
    const resp = await apiClient.post<{
      success: boolean
      order: CheckoutQuote
    }>("/api/v1/billing/checkout", {
      plan_id: planId,
      billing_cycle: billingCycle
    })
    return resp.data.order
  },

  /**
   * Verify Moyasar payment and upgrade company tier in DB
   */
  async verifyPayment(payload: PaymentVerificationPayload): Promise<{
    success: boolean
    subscription: CompanySubscription
    invoice: InvoiceItem
    message: string
  }> {
    const resp = await apiClient.post<{
      success: boolean
      subscription: CompanySubscription
      invoice: InvoiceItem
      message: string
    }>("/api/v1/billing/verify", payload)
    return resp.data
  },

  /**
   * Retrieve historical invoices
   */
  async getInvoices(): Promise<InvoiceItem[]> {
    const resp = await apiClient.get<{
      success: boolean
      invoices: InvoiceItem[]
    }>("/api/v1/billing/invoices")
    return resp.data.invoices || []
  },

  /**
   * Retrieve single invoice with full ZATCA seller details
   */
  async getInvoiceDetails(invoiceId: number): Promise<{
    invoice: InvoiceItem
    seller: {
      name_ar: string
      name_en: string
      vat_number: string
      address: string
      cr_number: string
    }
  }> {
    const resp = await apiClient.get<{
      success: boolean
      invoice: InvoiceItem
      seller: any
    }>(`/api/v1/billing/invoices/${invoiceId}`)
    return resp.data
  }
}
