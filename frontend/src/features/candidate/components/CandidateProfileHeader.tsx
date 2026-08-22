/**
 * CandidateProfileHeader.tsx — Top Hero Card for Candidate Identity.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import { candidateService } from "../services/candidate.service"
import type { CandidateProfile, UpdateIdentityDTO } from "../types/candidate.types"
import {
  MapPin,
  Briefcase,
  Clock,
  ShieldCheck,
  Edit3,
  Camera,
  Globe2,
  Lock,
  Building2,
  X,
  Loader2,
} from "lucide-react"

interface CandidateProfileHeaderProps {
  profile: CandidateProfile
  onUpdate: (dto: UpdateIdentityDTO) => Promise<any>
  onOpenOnboarding?: () => void
}

export function CandidateProfileHeader({
  profile,
  onUpdate,
  onOpenOnboarding,
}: CandidateProfileHeaderProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [fullname, setFullname] = useState(profile.fullname || "")
  const [about, setAbout] = useState(profile.about || "")
  const [mobile, setMobile] = useState(profile.mobile || "")
  const [country, setCountry] = useState(profile.country || "المملكة العربية السعودية")
  const [government, setGovernment] = useState(profile.government || "")
  const [sex, setSex] = useState(profile.sex || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      await onUpdate({
        fullname,
        about,
        mobile,
        country,
        government,
        sex,
        avatar: avatarFile || undefined,
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل تحديث البيانات الشخصية")
    } finally {
      setIsSaving(false)
    }
  }

  const avatarSrc = avatarPreview || candidateService.getImageUrl(profile.img)

  const getVisibilityBadge = () => {
    switch (profile.visibility) {
      case "public":
        return {
          label: t("candidate.profile.header.publicBadge"),
          icon: Globe2,
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        }
      case "private":
        return {
          label: t("candidate.profile.header.privateBadge"),
          icon: Lock,
          className: "bg-slate-800/80 text-slate-400 border-slate-700/50",
        }
      case "employers_only":
      default:
        return {
          label: t("candidate.profile.header.employersBadge"),
          icon: Building2,
          className: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        }
    }
  }

  const visibilityInfo = getVisibilityBadge()
  const VisIcon = visibilityInfo.icon

  return (
    <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0c1424] to-[#090e1a] p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left identity block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 w-full md:w-auto">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-primary/30 via-slate-800 to-sky-400/20 border-2 border-primary/40 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={profile.fullname || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {profile.fullname ? profile.fullname.trim().slice(0, 2) : "FA"}
                </span>
              )}
            </div>

            {/* Quick photo change button */}
            <label
              htmlFor="header-avatar-upload"
              className="absolute -bottom-2 -end-2 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer shadow-lg"
              title={t("candidate.profile.header.uploadPhoto")}
            >
              <Camera className="w-4 h-4" />
              <input
                id="header-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    await onUpdate({ avatar: file })
                  }
                }}
              />
            </label>
          </div>

          {/* Text & Meta details */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight truncate">
                {profile.fullname || "مرشح منصة فائدة"}
              </h1>

              {profile.is_verified && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  title={t("candidate.shell.status.verified")}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t("candidate.shell.status.verified")}</span>
                </span>
              )}

              {/* Visibility Badge */}
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${visibilityInfo.className}`}
              >
                <VisIcon className="w-3.5 h-3.5" />
                <span>{visibilityInfo.label}</span>
              </span>
            </div>

            {/* Headline / Summary */}
            <p className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-2 max-w-2xl">
              {profile.about || (
                <span className="text-slate-500 italic">
                  {t("candidate.profile.header.headlinePlaceholder")}
                </span>
              )}
            </p>

            {/* Quick meta pills */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-xs text-slate-400">
              {/* Location */}
              {(profile.government || profile.country) && (
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    {[profile.government, profile.country].filter(Boolean).join("، ")}
                  </span>
                </div>
              )}

              {/* Field */}
              {profile.preferred_field_of_work && (
                <div className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{profile.preferred_field_of_work}</span>
                </div>
              )}

              {/* Years of skills / Experience */}
              {profile.years_of_skills && (
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {profile.years_of_skills.includes("سنوات")
                      ? profile.years_of_skills
                      : `${profile.years_of_skills} سنوات خبرة`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex flex-row md:flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <button
            type="button"
            onClick={() => {
              setFullname(profile.fullname || "")
              setAbout(profile.about || "")
              setMobile(profile.mobile || "")
              setCountry(profile.country || "المملكة العربية السعودية")
              setGovernment(profile.government || "")
              setSex(profile.sex || "")
              setIsEditing(true)
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t("candidate.profile.header.editProfile")}</span>
          </button>

          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <span>{t("candidate.profile.onboarding.startBtn")}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Edit Identity Modal Dialog ─────────────────────────────────── */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    {t("candidate.profile.header.editProfile")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    تعديل الاسم والنبذة وبيانات التواصل الأساسية
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Avatar file upload preview inside modal */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarPreview || avatarSrc ? (
                    <img
                      src={avatarPreview || avatarSrc!}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-white">
                    {t("candidate.profile.header.uploadPhoto")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-xs text-slate-400 file:me-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Headline / About */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  العنوان المهني / النبذة المختصرة
                </label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={t("candidate.profile.header.headlinePlaceholder")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Mobile Phone & City in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    رقم الجوال
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors text-end"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    المدينة / المنطقة
                  </label>
                  <input
                    type="text"
                    value={government}
                    onChange={(e) => setGovernment(e.target.value)}
                    placeholder="الرياض، جدة، الدمام..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Country & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    الدولة
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    الجنس
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">غير محدد</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
              </div>

              {/* Dialog Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t("candidate.profile.actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.actions.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
