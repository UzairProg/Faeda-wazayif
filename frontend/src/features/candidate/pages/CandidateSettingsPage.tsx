/**
 * features/candidate/pages/CandidateSettingsPage.tsx
 *
 * Candidate Account Settings — Notifications, Privacy, Security & Preferences.
 * Matches the existing Faeda dark design system exactly.
 */
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { candidateService, DEFAULT_CANDIDATE_SETTINGS } from "../services/candidate.service"
import type { CandidateSettingsData } from "../types/candidate.types"
import {
  Bell,
  Shield,
  Eye,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Mail,
  MessageSquare,
  BriefcaseBusiness,
  Megaphone,
  BarChart3,
  Clock,
  UserCheck,
  EyeOff,
} from "lucide-react"

/* --- Helpers --------------------------------------------------------------- */

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0b1220]/80 backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">{label}</p>
          {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          checked ? "bg-primary shadow-lg shadow-primary/30" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

function SelectRow({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  options: { value: string | number; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        <p className="text-xs font-semibold text-slate-200">{label}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary/60 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

/* --- Page ------------------------------------------------------------------ */

export function CandidateSettingsPage() {
  const { isRTL, language } = useTranslation()
  const queryClient = useQueryClient()

  const [settings, setSettings] = useState<CandidateSettingsData>(DEFAULT_CANDIDATE_SETTINGS)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" })
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null)
  const [pwdError, setPwdError] = useState<string | null>(null)

  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const { data: fetchedSettings, isLoading } = useQuery({
    queryKey: ["candidate", "settings"],
    queryFn: () => candidateService.getSettings(),
  })

  useEffect(() => {
    if (fetchedSettings) setSettings(fetchedSettings)
  }, [fetchedSettings])

  const saveMutation = useMutation({
    mutationFn: (s: Partial<CandidateSettingsData>) => candidateService.updateSettings(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "settings"] })
      setSuccessMsg(L("تم حفظ الإعدادات بنجاح", "Settings saved successfully"))
      setErrorMsg(null)
      setTimeout(() => setSuccessMsg(null), 4000)
    },
    onError: () => {
      setErrorMsg(L("حدث خطأ أثناء الحفظ. حاول مجدداً.", "Failed to save settings."))
      setTimeout(() => setErrorMsg(null), 4000)
    },
  })

  const pwdMutation = useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) =>
      candidateService.changePassword(current, next),
    onSuccess: () => {
      setPwdSuccess(L("تم تغيير كلمة المرور بنجاح", "Password changed successfully"))
      setPwdError(null)
      setPwdForm({ current: "", next: "", confirm: "" })
      setTimeout(() => setPwdSuccess(null), 4000)
    },
    onError: () => {
      setPwdError(L("كلمة المرور الحالية غير صحيحة.", "Current password is incorrect."))
      setTimeout(() => setPwdError(null), 4000)
    },
  })

  const setNotif = (key: keyof CandidateSettingsData["notifications"], val: boolean) =>
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: val } }))

  const setPrivacy = (key: keyof CandidateSettingsData["privacy"], val: boolean | string) =>
    setSettings((s) => ({ ...s, privacy: { ...s.privacy, [key]: val } }))

  const setSecurity = (key: keyof CandidateSettingsData["security"], val: boolean | number) =>
    setSettings((s) => ({ ...s, security: { ...s.security, [key]: val } }))

  const setPreference = (key: keyof CandidateSettingsData["preferences"], val: string) =>
    setSettings((s) => ({ ...s, preferences: { ...s.preferences, [key]: val } }))

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError(null)
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError(L("كلمتا المرور الجديدتان غير متطابقتين.", "New passwords do not match."))
      return
    }
    if (pwdForm.next.length < 8) {
      setPwdError(L("كلمة المرور 8 أحرف على الأقل.", "Password must be at least 8 characters."))
      return
    }
    pwdMutation.mutate({ current: pwdForm.current, next: pwdForm.next })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-slate-400">{L("جاري تحميل الإعدادات...", "Loading settings...")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-heading">{L("إعدادات الحساب", "Account Settings")}</h1>
          <p className="text-xs text-slate-400 mt-1">{L("تحكم في إشعاراتك وخصوصيتك وأمان حسابك.", "Manage your notifications, privacy, and security.")}</p>
        </div>
        <button type="button" onClick={() => saveMutation.mutate(settings)} disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {L("حفظ التغييرات", "Save Changes")}
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
        </div>
      )}

      <SectionCard icon={Bell} title={L("الإشعارات", "Notifications")} subtitle={L("اختر ما تريد أن يتم إعلامك به", "Choose what you get notified about")}>
        <ToggleRow icon={Mail} label={L("تنبيهات الوظائف بالبريد", "Email Job Alerts")} description={L("فرص وظيفية مطابقة لملفك", "Matched job opportunities")} checked={settings.notifications.emailJobAlerts} onChange={(v) => setNotif("emailJobAlerts", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={BriefcaseBusiness} label={L("تحديثات الطلبات", "Application Updates")} description={L("حالة طلباتك المقدمة", "Status of your applications")} checked={settings.notifications.applicationUpdates} onChange={(v) => setNotif("applicationUpdates", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={Megaphone} label={L("دعوات الحملات", "Campaign Invitations")} description={L("دعوات للحملات التوظيفية", "Recruitment campaign invites")} checked={settings.notifications.campaignInvitations} onChange={(v) => setNotif("campaignInvitations", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={MessageSquare} label={L("رسائل نصية", "SMS Alerts")} description={L("تنبيهات عاجلة بالرسائل", "Urgent text message alerts")} checked={settings.notifications.smsAlerts} onChange={(v) => setNotif("smsAlerts", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={BarChart3} label={L("رؤى السوق", "Market Insights")} description={L("تقارير دورية عن السوق", "Periodic market reports")} checked={settings.notifications.marketingInsights} onChange={(v) => setNotif("marketingInsights", v)} />
      </SectionCard>

      <SectionCard icon={Eye} title={L("الخصوصية", "Privacy")} subtitle={L("تحكم في من يرى ملفك الشخصي", "Control who sees your profile")}>
        <SelectRow icon={UserCheck} label={L("مستوى الظهور", "Profile Visibility")} value={settings.privacy.visibility}
          options={[
            { value: "public", label: L("عام", "Public") },
            { value: "employers_only", label: L("أصحاب العمل فقط", "Employers Only") },
            { value: "private", label: L("خاص", "Private") },
          ]}
          onChange={(v) => setPrivacy("visibility", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={MessageSquare} label={L("رسائل المجندين المباشرة", "Recruiter Direct Messages")} checked={settings.privacy.allowRecruiterDirectMessages} onChange={(v) => setPrivacy("allowRecruiterDirectMessages", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={BarChart3} label={L("مشاركة بيانات الراتب (مجهول)", "Share Salary Data Anonymously")} checked={settings.privacy.shareAnonymousSalaryInsights} onChange={(v) => setPrivacy("shareAnonymousSalaryInsights", v)} />
        <div className="border-t border-slate-800/60" />
        <ToggleRow icon={EyeOff} label={L("إخفاء عن صاحب العمل الحالي", "Hide from Current Employer")} checked={settings.privacy.hideFromCurrentEmployer} onChange={(v) => setPrivacy("hideFromCurrentEmployer", v)} />
      </SectionCard>

      <SectionCard icon={Shield} title={L("الأمان", "Security")} subtitle={L("حافظ على أمان حسابك", "Keep your account secure")}>
        <ToggleRow icon={Shield} label={L("المصادقة الثنائية (2FA)", "Two-Factor Authentication")} description={L("حماية إضافية لحسابك", "Extra account protection")} checked={settings.security.twoFactorEnabled} onChange={(v) => setSecurity("twoFactorEnabled", v)} />
        <div className="border-t border-slate-800/60" />
        <SelectRow icon={Clock} label={L("مهلة انتهاء الجلسة", "Session Timeout")} value={settings.security.sessionTimeoutMinutes}
          options={[
            { value: 30, label: L("30 دقيقة", "30 minutes") },
            { value: 60, label: L("ساعة", "1 hour") },
            { value: 120, label: L("ساعتان", "2 hours") },
            { value: 480, label: L("8 ساعات", "8 hours") },
          ]}
          onChange={(v) => setSecurity("sessionTimeoutMinutes", parseInt(v))} />
        <div className="border-t border-slate-800/60 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-bold text-slate-200">{L("تغيير كلمة المرور", "Change Password")}</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input type="password" placeholder={L("كلمة المرور الحالية", "Current password")} value={pwdForm.current}
              onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))} required
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            <input type="password" placeholder={L("كلمة المرور الجديدة", "New password")} value={pwdForm.next}
              onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))} required
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            <input type="password" placeholder={L("تأكيد كلمة المرور", "Confirm new password")} value={pwdForm.confirm}
              onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))} required
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            {pwdError && <div className="flex items-center gap-2 text-rose-400 text-xs"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{pwdError}</div>}
            {pwdSuccess && <div className="flex items-center gap-2 text-emerald-400 text-xs"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" />{pwdSuccess}</div>}
            <button type="submit" disabled={pwdMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-60">
              {pwdMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              {L("تحديث كلمة المرور", "Update Password")}
            </button>
          </form>
        </div>
      </SectionCard>

      <SectionCard icon={Globe} title={L("التفضيلات", "Preferences")} subtitle={L("خصّص تجربتك على المنصة", "Customize your experience")}>
        <SelectRow icon={Globe} label={L("اللغة", "Language")} value={settings.preferences.language}
          options={[{ value: "ar", label: "العربية" }, { value: "en", label: "English" }, { value: "hi", label: "हिंदी" }]}
          onChange={(v) => setPreference("language", v)} />
        <div className="border-t border-slate-800/60" />
        <SelectRow icon={BarChart3} label={L("العملة", "Currency")} value={settings.preferences.currency}
          options={[{ value: "SAR", label: "ريال سعودي (SAR)" }, { value: "INR", label: "روبية هندية (INR)" }]}
          onChange={(v) => setPreference("currency", v)} />
      </SectionCard>

      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <button type="button" onClick={() => saveMutation.mutate(settings)} disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {L("حفظ جميع الإعدادات", "Save All Settings")}
        </button>
      </div>
    </div>
  )
}
