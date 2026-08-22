import { useState, useEffect } from "react"
import { useTranslation } from "@/i18n"
import { useCompanyProfile } from "../hooks/useCompanyProfile"
import { useCompanyActions } from "../hooks/useCompanyActions"
import { CompanyProfileHealthCard } from "../components/CompanyProfileHealthCard"
import type { UpdateCompanyProfilePayload } from "../types/company.types"
import {
  Building2,
  Upload,
  Globe,
  Users,
  Sparkles,
  Loader2,
  Save,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export function CompanyProfilePage() {
  const { isRTL } = useTranslation()
  const { data: profile, isLoading, error } = useCompanyProfile()
  const { updateProfileMutation, uploadLogoMutation } = useCompanyActions()

  const [formData, setFormData] = useState<UpdateCompanyProfilePayload>({
    arabicName: "",
    englishName: "",
    faedaName: "",
    descriptionAr: "",
    descriptionEn: "",
    country: "المملكة العربية السعودية",
    state: "الرياض",
    englishAddress: "",
    companyType: "شركة مساهمة",
    companySize: "50-200 موظف",
    companyField: "تقنية المعلومات والبرمجيات",
    hrName: "",
    hrMobile: "",
    hrEmail: "",
    website: "",
    twitter: "",
    instagram: "",
    metrics: {
      numberOfProjects: 0,
      successRate: 0,
      profitPercentage: 0,
    },
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        arabicName: profile.arabicName || "",
        englishName: profile.englishName || "",
        faedaName: profile.faedaName || "",
        descriptionAr: profile.descriptionAr || "",
        descriptionEn: profile.descriptionEn || "",
        country: profile.country || "المملكة العربية السعودية",
        state: profile.state || "الرياض",
        englishAddress: profile.englishAddress || "",
        companyType: profile.companyType || "شركة مساهمة",
        companySize: profile.companySize || "50-200 موظف",
        companyField: profile.companyField || "تقنية المعلومات والبرمجيات",
        hrName: profile.hrName || "",
        hrMobile: profile.hrMobile || "",
        hrEmail: profile.hrEmail || "",
        website: profile.website || "",
        twitter: profile.twitter || "",
        instagram: profile.instagram || "",
        metrics: {
          numberOfProjects: profile.metrics?.numberOfProjects || 0,
          successRate: profile.metrics?.successRate || 0,
          profitPercentage: profile.metrics?.profitPercentage || 0,
        },
      })
    }
  }, [profile])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadLogoMutation.mutateAsync(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(false)
    await updateProfileMutation.mutateAsync(formData)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 4000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <span className="text-xs font-semibold">
            {isRTL ? "جاري تحميل بيانات المنشأة..." : "Loading Company Profile..."}
          </span>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-rose-400">
        <p className="text-sm font-bold">
          {isRTL
            ? "تعذر تحميل بيانات ملف المنشأة. يرجى إعادة المحاولة."
            : "Failed to load company profile."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl flex items-center gap-2">
            <Building2 className="h-7 w-7 text-emerald-400" />
            <span>{isRTL ? "الهوية المؤسسية وملف المنشأة" : "Company Identity & Profile"}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {isRTL
              ? "إدارة بيانات المنشأة، معلومات الموارد البشرية، ومعايير الشفافية والموثوقية"
              : "Manage organization details, HR contacts, transparency metrics and brand identity"}
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>{isRTL ? "تم حفظ وتحديث البيانات بنجاح" : "Profile updated successfully"}</span>
          </div>
        )}
      </div>

      {/* ── Profile Completeness Health Card ─────────────────────────── */}
      <CompanyProfileHealthCard completeness={profile.completeness} isRtl={isRTL} />

      {/* ── Profile Form ─────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Logo & Brand Identity */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              {isRTL ? "شعار وهوية المنشأة" : "Brand & Logo"}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-24 w-24 shrink-0 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-2xl overflow-hidden shadow-inner">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-10 w-10" />
              )}

              {uploadLogoMutation.isPending && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-start">
              <label
                htmlFor="company-logo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                <Upload className="h-4 w-4 text-emerald-400" />
                <span>{isRTL ? "رفع شعار جديد" : "Upload New Logo"}</span>
              </label>
              <input
                id="company-logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-[11px] text-slate-400">
                {isRTL
                  ? "يُفضل استخدام صورة مربعة واضحة بصيغة PNG أو JPG بحجم لا يتجاوز 5 ميغابايت"
                  : "Square PNG/JPG recommended, max 5MB"}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Basic Company Information */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              {isRTL ? "البيانات الأساسية للمنشأة" : "Basic Organization Details"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "اسم المنشأة بالعربية *" : "Company Arabic Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.arabicName}
                onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "اسم المنشأة بالإنجليزية" : "Company English Name"}
              </label>
              <input
                type="text"
                value={formData.englishName}
                onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "القطاع ومجال العمل" : "Industry / Field"}
              </label>
              <input
                type="text"
                value={formData.companyField}
                onChange={(e) => setFormData({ ...formData, companyField: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "حجم المنشأة" : "Company Size"}
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="1-10 موظفين">1-10 موظفين (Startup)</option>
                <option value="10-50 موظف">10-50 موظف (Small)</option>
                <option value="50-200 موظف">50-200 موظف (Medium)</option>
                <option value="200-500 موظف">200-500 موظف (Large)</option>
                <option value="أكثر من 500 موظف">أكثر من 500 موظف (Enterprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "الدولة" : "Country"}
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "المدينة / المنطقة" : "City / State"}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? "نبذة تعريفية عن المنشأة (بالعربية)" : "About Company (Arabic)"}
            </label>
            <textarea
              rows={3}
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              placeholder={isRTL ? "اكتب نبذة عن رؤية الشركة، مشاريعها، وثقافة العمل..." : "About company..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. HR Contact Details */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Users className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              {isRTL ? "مسؤول الموارد البشرية والاستقطاب" : "HR & Talent Acquisition Contact"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "اسم مسؤول التوظيف" : "HR Representative Name"}
              </label>
              <input
                type="text"
                value={formData.hrName}
                onChange={(e) => setFormData({ ...formData, hrName: e.target.value })}
                placeholder={isRTL ? "مثال: سارة الشمري" : "e.g. Sarah"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "البريد الإلكتروني للتوظيف" : "HR Email"}
              </label>
              <input
                type="email"
                value={formData.hrEmail}
                onChange={(e) => setFormData({ ...formData, hrEmail: e.target.value })}
                placeholder="careers@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "رقم الهاتف / التواصل" : "HR Phone"}
              </label>
              <input
                type="tel"
                value={formData.hrMobile}
                onChange={(e) => setFormData({ ...formData, hrMobile: e.target.value })}
                placeholder="+966500000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Digital Presence */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              {isRTL ? "التواجد الرقمي والروابط" : "Digital Presence & Social"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "الموقع الإلكتروني" : "Website URL"}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.sa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "حساب منصة X (تويتر)" : "X (Twitter) Handle"}
              </label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@company"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "حساب إنستغرام" : "Instagram"}
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@company"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 5. Honest Operational Metrics (Data Honesty) */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                {isRTL ? "مؤشرات الشفافية والأداء التشغيلي" : "Operational Transparency Metrics"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isRTL
                  ? "يتم عرض هذه المؤشرات للمرشحين والفرق المهنية لتعزيز المصداقية دون أي تزييف"
                  : "Displayed to candidates and squads for genuine employer transparency"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "عدد المشاريع المنفذة" : "Executed Projects"}
              </label>
              <input
                type="number"
                min={0}
                value={formData.metrics?.numberOfProjects || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      numberOfProjects: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "نسبة نجاح التسليم (%)" : "Success Rate (%)"}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={formData.metrics?.successRate || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      successRate: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "هامش النمو / الربحية (%)" : "Growth / Profit Margin (%)"}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={formData.metrics?.profitPercentage || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      profitPercentage: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isRTL ? "حفظ وتحديث الملف المؤسسي" : "Save Organization Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
