import React, { useState, useEffect } from "react"
import { useTranslation } from "@/i18n"
import { useUniversityProfile } from "../hooks/useUniversityProfile"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { UniversityProfileHealthCard } from "../components/UniversityProfileHealthCard"
import {
  GraduationCap,
  Save,
  Loader2,
  CheckCircle2,
  Upload,
  Globe,
  MapPin,
  Building,
  Phone,
  Mail,
  User,
} from "lucide-react"

export function UniversityProfilePage() {
  const { isRTL } = useTranslation()
  const { data, isLoading } = useUniversityProfile()
  const { updateProfile, isUpdatingProfile, uploadLogo, isUploadingLogo } = useUniversityActions()

  const [nameAr, setNameAr] = useState("")
  const [nameEn, setNameEn] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("المملكة العربية السعودية")
  const [website, setWebsite] = useState("")
  const [institutionType, setInstitutionType] = useState("جامعة حكومية")
  const [qsRank, setQsRank] = useState("")
  const [phone, setPhone] = useState("")
  const [deanName, setDeanName] = useState("")
  const [careerCenterEmail, setCareerCenterEmail] = useState("")

  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (data?.profile) {
      const p = data.profile
      setNameAr(p.name_ar || "")
      setNameEn(p.name_en || "")
      setDescriptionAr(p.description_ar || "")
      setDescriptionEn(p.description_en || "")
      setLocation(p.location || "")
      setCountry(p.country || "المملكة العربية السعودية")
      setWebsite(p.website || "")
      setInstitutionType(p.institution_type || "جامعة حكومية")
      setQsRank(p.qs_rank || "")
      setPhone(p.phone || "")
      setDeanName(p.dean_name || "")
      setCareerCenterEmail(p.career_center_email || "")
    }
  }, [data])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadLogo(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(false)

    await updateProfile({
      name_ar: nameAr,
      name_en: nameEn || undefined,
      description_ar: descriptionAr || undefined,
      description_en: descriptionEn || undefined,
      location: location || undefined,
      country: country || undefined,
      website: website || undefined,
      institution_type: institutionType,
      qs_rank: qsRank || undefined,
      phone: phone || undefined,
      dean_name: deanName || undefined,
      career_center_email: careerCenterEmail || undefined,
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 4000)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const profile = data?.profile

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
          {isRTL ? "الملف المؤسسي للصرح الأكاديمي" : "Institution Profile & Accreditation"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isRTL
            ? "إدارة الهوية الأكاديمية الرسمية، بيانات الاعتماد، ومعلومات مركز الخريجين والتوظيف."
            : "Manage official academic identity, accreditation info, and career center contacts."}
        </p>
      </div>

      {/* Health Card */}
      {profile?.completeness && (
        <UniversityProfileHealthCard completeness={profile.completeness} isRtl={isRTL} />
      )}

      {/* Logo & Identity Card */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-6 backdrop-blur-xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
          {isRTL ? "شعار المؤسسة التعليمية" : "Institution Official Logo"}
        </h3>

        <div className="flex flex-wrap items-center gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/80 text-white font-bold text-2xl shadow-inner overflow-hidden">
            {profile?.logo ? (
              <img
                src={profile.logo.startsWith("http") ? profile.logo : `/${profile.logo}`}
                alt="University Logo"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <GraduationCap className="h-10 w-10 text-indigo-400" />
            )}
          </div>

          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all">
              {isUploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              ) : (
                <Upload className="h-4 w-4 text-indigo-400" />
              )}
              <span>{isRTL ? "رفع شعار رسمي جديد" : "Upload New Logo"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={isUploadingLogo}
              />
            </label>
            <p className="text-[11px] text-slate-400">
              {isRTL ? "الصيغ المدعومة: PNG, JPG, WEBP, SVG (الحجم الأقصى: 5MB)" : "Supported formats: PNG, JPG, WEBP, SVG (Max: 5MB)"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            {isRTL ? "البيانات الأساسية والاعتماد" : "General & Accreditation Info"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRTL ? "اسم الصرح الأكاديمي (بالعربية) *" : "Institution Name (Arabic) *"}</span>
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRTL ? "اسم الصرح الأكاديمي (بالإنجليزية)" : "Institution Name (English)"}</span>
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. King Saud University"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? "نوع المؤسسة التعليمية" : "Institution Type"}
              </label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="جامعة حكومية">{isRTL ? "جامعة حكومية" : "Public University"}</option>
                <option value="جامعة أهلية">{isRTL ? "جامعة أهلية / خاصة" : "Private University"}</option>
                <option value="كلية تطبيقية">{isRTL ? "كلية تطبيقية / تقنية" : "Applied College"}</option>
                <option value="معهد تدريب عالي">{isRTL ? "معهد تدريب عالي" : "Higher Institute"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRTL ? "المدينة / المقر الرئيسي" : "City / Main Campus"}</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={isRTL ? "الرياض" : "Riyadh"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isRTL ? "الموقع الإلكتروني الرسمي" : "Official Website"}</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://ksu.edu.sa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? "التصنيف الأكاديمي والاعتمادات (مثل QS World Ranking)" : "Academic Ranking & Accreditations"}
            </label>
            <input
              type="text"
              value={qsRank}
              onChange={(e) => setQsRank(e.target.value)}
              placeholder="e.g. #203 QS World University Rankings"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? "نبذة عن الصرح الأكاديمي والرؤية التعليمية" : "Institution Overview & Vision"}
            </label>
            <textarea
              rows={4}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder={isRTL ? "اكتب نبذة عن تاريخ الجامعة، الأهداف الاستراتيجية، ومخرجات البرامج الأكاديمية..." : "Describe institution mission and outcomes..."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Career Center Info */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            {isRTL ? "إدارة القبول والتسجيل ومركز الخريجين" : "Admissions, Registry & Career Center"}
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>{isRTL ? "عميد القبول / المشرف على التوثيق" : "Dean / Registry Head"}</span>
              </label>
              <input
                type="text"
                value={deanName}
                onChange={(e) => setDeanName(e.target.value)}
                placeholder={isRTL ? "د. محمد التميمي" : "Dr. Name"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>{isRTL ? "بريد مركز التوظيف والخريجين" : "Career Center Email"}</span>
              </label>
              <input
                type="email"
                value={careerCenterEmail}
                onChange={(e) => setCareerCenterEmail(e.target.value)}
                placeholder="careers@university.edu.sa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{isRTL ? "هاتف التواصل المباشر" : "Direct Phone Line"}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966114670000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isRTL ? "تم حفظ وتحديث بيانات الجامعة بنجاح!" : "Profile updated successfully!"}</span>
            </div>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all disabled:opacity-50"
          >
            {isUpdatingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isRTL ? "حفظ وتحديث الملف الأكاديمي" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
