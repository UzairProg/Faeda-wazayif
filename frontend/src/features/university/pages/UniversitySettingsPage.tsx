/**
 * features/university/pages/UniversitySettingsPage.tsx
 *
 * University / Academic Institution Settings — Notifications, Privacy, Security, Preferences.
 * Matches the existing Faeda dark design system (University layout style).
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import {
  Bell, Shield, Eye, Globe, Lock, Save,
  Loader2, AlertCircle, MessageSquare, Clock,
  GraduationCap, BarChart3, BookOpen, Rocket, CheckCircle2,
} from "lucide-react"

function SectionCard({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/40">
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: {
  icon: React.ElementType; label: string; description?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{label}</p>
          {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-200 focus:outline-none ${checked ? "bg-primary shadow-lg shadow-primary/30" : "bg-muted"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  )
}

function SelectRow({ icon: Icon, label, value, options, onChange }: {
  icon: React.ElementType; label: string; value: string | number;
  options: { value: string | number; label: string }[]; onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
        <p className="text-xs font-semibold text-foreground">{label}</p>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-card border border-border text-foreground text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary/60 transition-colors">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function UniversitySettingsPage() {
  const { language } = useTranslation()
  const L = (ar: string, en: string) => language === "ar" ? ar : en

  const [notif, setNotif] = useState({
    studentVerifications: true, coopSupervision: true, campaignActivity: true,
    messageAlerts: true, rankingUpdates: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public", allowDirectContact: true, shareResearchData: false,
  })
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: 60 })
  const [prefs, setPrefs] = useState({ language: language || "ar" })
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" })
  const [saving, setSaving] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [pwdMsg, setPwdMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSuccessMsg(L("تم حفظ إعدادات المؤسسة بنجاح", "Institution settings saved successfully"))
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handlePwd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdMsg({ text: L("كلمتا المرور غير متطابقتين", "Passwords do not match"), ok: false }); return
    }
    if (pwdForm.next.length < 8) {
      setPwdMsg({ text: L("8 أحرف على الأقل", "At least 8 characters"), ok: false }); return
    }
    setPwdSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setPwdSaving(false)
    setPwdMsg({ text: L("تم تحديث كلمة المرور", "Password updated"), ok: true })
    setPwdForm({ current: "", next: "", confirm: "" })
    setTimeout(() => setPwdMsg(null), 4000)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            {L("إعدادات المؤسسة الأكاديمية", "Academic Institution Settings")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {L("تحكم في إعدادات مؤسستك الأكاديمية وخصوصيتها.", "Manage your academic institution settings and privacy.")}
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 text-xs font-bold transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {L("حفظ التغييرات", "Save Changes")}
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}
        </div>
      )}

      {/* Notifications */}
      <SectionCard icon={Bell} title={L("الإشعارات", "Notifications")} subtitle={L("تحكم في تنبيهات مؤسستك", "Manage institutional notifications")}>
        <ToggleRow icon={CheckCircle2} label={L("طلبات التوثيق الأكاديمي", "Academic Verification Requests")} description={L("إشعار عند ورود طلبات توثيق الشهادات", "Alert when degree verification requests arrive")} checked={notif.studentVerifications} onChange={(v) => setNotif(p => ({ ...p, studentVerifications: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={BookOpen} label={L("التدريب التعاوني والإشراف", "Co-op Supervision & Training")} description={L("تحديثات إشراف الأساتذة والطلاب", "Professor supervision and student updates")} checked={notif.coopSupervision} onChange={(v) => setNotif(p => ({ ...p, coopSupervision: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={Rocket} label={L("نشاط الحملات البحثية", "Research Campaign Activity")} description={L("تفاعل مع حملات الأطروحات والابتكار", "Engagement on thesis and innovation campaigns")} checked={notif.campaignActivity} onChange={(v) => setNotif(p => ({ ...p, campaignActivity: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={MessageSquare} label={L("رسائل الشركاء والمستثمرين", "Partner & Investor Messages")} checked={notif.messageAlerts} onChange={(v) => setNotif(p => ({ ...p, messageAlerts: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={BarChart3} label={L("تحديثات التصنيفات الدولية", "International Rankings Updates")} description={L("تنبيهات تصنيفات QS و THE", "QS and THE rankings alerts")} checked={notif.rankingUpdates} onChange={(v) => setNotif(p => ({ ...p, rankingUpdates: v }))} />
      </SectionCard>

      {/* Privacy */}
      <SectionCard icon={Eye} title={L("الخصوصية", "Privacy")} subtitle={L("تحكم في ظهور ملف مؤسستك", "Control your institution profile visibility")}>
        <SelectRow icon={Eye} label={L("ظهور ملف المؤسسة", "Institution Profile Visibility")} value={privacy.profileVisibility}
          options={[
            { value: "public", label: L("عام للجميع", "Public — Everyone") },
            { value: "registered", label: L("للمستخدمين المسجلين", "Registered Users") },
            { value: "private", label: L("خاص", "Private") },
          ]} onChange={(v) => setPrivacy(p => ({ ...p, profileVisibility: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={MessageSquare} label={L("السماح بالتواصل المباشر مع الباحثين", "Allow Direct Contact with Researchers")} checked={privacy.allowDirectContact} onChange={(v) => setPrivacy(p => ({ ...p, allowDirectContact: v }))} />
        <div className="border-t border-border" />
        <ToggleRow icon={BarChart3} label={L("مشاركة بيانات الأبحاث (مجهول)", "Share Research Data Anonymously")} checked={privacy.shareResearchData} onChange={(v) => setPrivacy(p => ({ ...p, shareResearchData: v }))} />
      </SectionCard>

      {/* Security */}
      <SectionCard icon={Shield} title={L("الأمان", "Security")} subtitle={L("حافظ على أمان حساب مؤسستك", "Keep your institution account secure")}>
        <ToggleRow icon={Shield} label={L("المصادقة الثنائية (2FA)", "Two-Factor Authentication")} description={L("حماية مزدوجة لحساب الجامعة", "Double protection for the university account")} checked={security.twoFactor} onChange={(v) => setSecurity(p => ({ ...p, twoFactor: v }))} />
        <div className="border-t border-border" />
        <SelectRow icon={Clock} label={L("مهلة انتهاء الجلسة", "Session Timeout")} value={security.sessionTimeout}
          options={[
            { value: 30, label: L("30 دقيقة", "30 min") },
            { value: 60, label: L("ساعة", "1 hour") },
            { value: 120, label: L("ساعتان", "2 hours") },
            { value: 480, label: L("8 ساعات", "8 hours") },
          ]} onChange={(v) => setSecurity(p => ({ ...p, sessionTimeout: parseInt(v) }))} />
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-bold text-foreground">{L("تغيير كلمة المرور", "Change Password")}</p>
          </div>
          <form onSubmit={handlePwd} className="space-y-3">
            <input type="password" placeholder={L("كلمة المرور الحالية", "Current password")} value={pwdForm.current}
              onChange={(e) => setPwdForm(p => ({ ...p, current: e.target.value }))} required
              className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            <input type="password" placeholder={L("كلمة المرور الجديدة", "New password")} value={pwdForm.next}
              onChange={(e) => setPwdForm(p => ({ ...p, next: e.target.value }))} required
              className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            <input type="password" placeholder={L("تأكيد كلمة المرور", "Confirm new password")} value={pwdForm.confirm}
              onChange={(e) => setPwdForm(p => ({ ...p, confirm: e.target.value }))} required
              className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/60 transition-colors" />
            {pwdMsg && (
              <div className={`flex items-center gap-2 text-xs ${pwdMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
                {pwdMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}{pwdMsg.text}
              </div>
            )}
            <button type="submit" disabled={pwdSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-card/80 text-foreground text-xs font-semibold border border-border transition-colors disabled:opacity-60">
              {pwdSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              {L("تحديث كلمة المرور", "Update Password")}
            </button>
          </form>
        </div>
      </SectionCard>

      {/* Preferences */}
      <SectionCard icon={Globe} title={L("التفضيلات", "Preferences")} subtitle={L("خصّص تجربة مؤسستك", "Customize your institution experience")}>
        <SelectRow icon={Globe} label={L("اللغة", "Language")} value={prefs.language}
          options={[{ value: "ar", label: "العربية" }, { value: "en", label: "English" }, { value: "hi", label: "हिंदी" }]}
          onChange={(v) => setPrefs(p => ({ ...p, language: v as any }))} />
      </SectionCard>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 text-xs font-bold transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {L("حفظ جميع الإعدادات", "Save All Settings")}
        </button>
      </div>
    </div>
  )
}
