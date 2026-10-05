/**
 * features/admin/pages/AdminSettingsPage.tsx
 *
 * System Configuration & Dynamic Platform Parameters Console.
 */
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import {
  Save,
  CheckCircle2,
  Loader2,
  Shield,
  Mail,
  Bot,
  Bell,
  ExternalLink,
} from "lucide-react"

export function AdminSettingsPage() {
  const { isRTL, language } = useTranslation()
  const queryClient = useQueryClient()

  const [formState, setFormState] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminService.getSettings(),
  })

  useEffect(() => {
    if (data?.settings) {
      const initial: Record<string, string> = {}
      Object.entries(data.settings).forEach(([key, spec]) => {
        initial[key] = spec.value ?? ""
      })
      setFormState(initial)
    }
  }, [data])

  const saveMutation = useMutation({
    mutationFn: (settings: Record<string, any>) =>
      adminService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] })
      setSuccessMessage(
        language === "ar"
          ? "تم حفظ الإعدادات بنجاح في قاعدة البيانات وتطبيقها فوراً."
          : "Settings updated and applied successfully."
      )
      setTimeout(() => setSuccessMessage(null), 4000)
    },
  })

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleToggle = (key: string) => {
    setFormState((prev) => {
      const current = prev[key] === "true"
      return { ...prev, [key]: current ? "false" : "true" }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formState)
  }

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-mono">
          {language === "ar" ? "جاري جلب إعدادات المنظومة..." : "Loading platform settings..."}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-400 text-sm">
        {error instanceof Error ? error.message : "حدث خطأ أثناء تحميل الإعدادات."}
      </div>
    )
  }

  const isMaintenanceActive = formState["maintenance_mode"] === "true"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16 max-w-4xl">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-2 shadow-inner">
            <Shield className="w-3.5 h-3.5 text-secondary" />
            <span>{language === "ar" ? "لوحة الإعدادات والتحكم" : "Platform Governance Config"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {language === "ar" ? "إعدادات المنصة والنظام" : "Platform Settings"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "ar"
              ? "التحكم في وضع الصيانة، تفعيل المساعد الذكي، الروابط القانونية، ومعلومات الدعم الفني."
              : "Configure maintenance mode, AI capabilities, legal terms, and operational contact channels."}
          </p>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs font-bold transition-all shadow-lg shadow-primary/30 flex items-center gap-2 shrink-0 self-start sm:self-auto active:scale-[0.98]"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{language === "ar" ? "حفظ التغييرات" : "Save Settings"}</span>
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-2 backdrop-blur-xl shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Maintenance Mode Alert Box */}
      <div
        className={`relative overflow-hidden p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl ${
          isMaintenanceActive
            ? "bg-gradient-to-b from-red-500/20 via-red-500/10 to-red-500/5 border-red-500/30 text-red-200 shadow-xl shadow-red-500/10"
            : "bg-gradient-to-b from-card/85 via-card/55 to-card/35 border-white/10 text-white shadow-2xl"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isMaintenanceActive ? "bg-red-500/20 text-red-400" : "bg-white/5 text-muted-foreground border border-white/10"
            }`}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">
              {language === "ar" ? "وضع الصيانة العام (Maintenance Mode)" : "Maintenance Mode"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              {language === "ar"
                ? "عند تفعيل وضع الصيانة، سيتم إيقاف وصول الزوار والشركات للمنصة وظهور صفحة الصيانة المؤقتة 503 مع استمرار وصول المديرين فقط."
                : "When enabled, visitors and employers receive a 503 maintenance page. Only admins have access."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleToggle("maintenance_mode")}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            isMaintenanceActive
              ? "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-lg shadow-red-500/30"
              : "bg-white/5 text-white border-white/10 hover:bg-white/10"
          }`}
        >
          {isMaintenanceActive
            ? language === "ar" ? "وضع الصيانة مفعل (إيقاف)" : "Active (Turn Off)"
            : language === "ar" ? "معطل (انقر للتفعيل)" : "Disabled (Turn On)"}
        </button>
      </div>

      {/* Core Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support & Contact Card */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-b from-card/85 via-card/55 to-card/35 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-white">
              {language === "ar" ? "قنوات الدعم والتواصل" : "Support & Operations"}
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                {language === "ar" ? "البريد الإلكتروني للدعم الفني" : "Support Email"}
              </label>
              <input
                type="email"
                value={formState["support_email"] || ""}
                onChange={(e) => handleChange("support_email", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                {language === "ar" ? "الحد الأقصى للوظائف لكل شركة" : "Max Jobs Per Company"}
              </label>
              <input
                type="number"
                value={formState["max_jobs_per_company"] || "50"}
                onChange={(e) => handleChange("max_jobs_per_company", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* AI Engine & Features Card */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-b from-card/85 via-card/55 to-card/35 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">
              {language === "ar" ? "محرك الذكاء الاصطناعي والميزات" : "AI & Feature Toggles"}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10">
              <div>
                <p className="text-xs font-bold text-white mb-0.5">
                  {language === "ar" ? "المساعد الذكي (AI Assistant)" : "AI Assistant Feature"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {language === "ar" ? "تفعيل روبوت الدردشة ومحرك التوصيات" : "Enable Groq LLM & matching recommendations"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("ai_assistant_active")}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  formState["ai_assistant_active"] === "true"
                    ? "bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/30"
                    : "bg-white/10 border border-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    formState["ai_assistant_active"] === "true"
                      ? isRTL
                        ? "-translate-x-7"
                        : "translate-x-7"
                      : isRTL
                      ? "-translate-x-1"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10">
              <div>
                <p className="text-xs font-bold text-white mb-0.5">
                  {language === "ar" ? "شريط الإعلانات العلوي" : "Top Announcement Banner"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {language === "ar" ? "إظهار شريط تنبيهات في أعلى صفحات المنصة" : "Display a global notification header banner"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("banner_active")}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  formState["banner_active"] === "true"
                    ? "bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/30"
                    : "bg-white/10 border border-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    formState["banner_active"] === "true"
                      ? isRTL
                        ? "-translate-x-7"
                        : "translate-x-7"
                      : isRTL
                      ? "-translate-x-1"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Global Announcement Text */}
        <div className="md:col-span-2 relative overflow-hidden p-6 rounded-3xl bg-gradient-to-b from-card/85 via-card/55 to-card/35 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {language === "ar" ? "نص الإعلان أو التنبيه العام" : "Notification Banner Text"}
            </h3>
          </div>
          <div>
            <textarea
              rows={2}
              value={formState["notification_banner"] || ""}
              onChange={(e) => handleChange("notification_banner", e.target.value)}
              placeholder={language === "ar" ? "اكتب هنا نص الإشعار العام الذي سيظهر لجميع الزوار..." : "Global notice text for all users..."}
              className="w-full px-3.5 py-2.5 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Legal Policies URLs */}
        <div className="md:col-span-2 relative overflow-hidden p-6 rounded-3xl bg-gradient-to-b from-card/85 via-card/55 to-card/35 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <ExternalLink className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">
              {language === "ar" ? "الروابط القانونية والسياسات الخارجية" : "Legal Policy URLs"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                {language === "ar" ? "رابط شروط الاستخدام (ToS URL)" : "Terms of Service URL"}
              </label>
              <input
                type="text"
                value={formState["tos_url"] || ""}
                onChange={(e) => handleChange("tos_url", e.target.value)}
                placeholder="/terms"
                className="w-full px-3.5 py-2.5 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                {language === "ar" ? "رابط سياسة الخصوصية (Privacy URL)" : "Privacy Policy URL"}
              </label>
              <input
                type="text"
                value={formState["privacy_url"] || ""}
                onChange={(e) => handleChange("privacy_url", e.target.value)}
                placeholder="/privacy"
                className="w-full px-3.5 py-2.5 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
