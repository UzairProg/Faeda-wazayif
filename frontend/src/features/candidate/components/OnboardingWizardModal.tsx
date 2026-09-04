/**
 * OnboardingWizardModal.tsx — Progressive 6-Step Onboarding Flow.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type { CandidateProfile } from "../types/candidate.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import {
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  FileText,
  Compass,
  Shield,
  Cpu,
  Loader2,
  Plus,
} from "lucide-react"

interface OnboardingWizardModalProps {
  isOpen: boolean
  onClose: () => void
  profile: CandidateProfile
  onUpdateIdentity: (dto: any) => Promise<any>
  onUpdateSkills: (dto: any) => Promise<any>
  onUpdateEducation: (dto: any) => Promise<any>
  onUpdateExperience: (dto: any) => Promise<any>
  onUploadCV: (file: File) => Promise<any>
  onUpdatePreferences: (dto: any) => Promise<any>
  onUpdateVisibility: (dto: any) => Promise<any>
}

const STEPS = [
  { id: 1, label: "الأساسيات", icon: Briefcase },
  { id: 2, label: "المهارات", icon: Cpu },
  { id: 3, label: "المؤهلات والخبرة", icon: GraduationCap },
  { id: 4, label: "السيرة الذاتية", icon: FileText },
  { id: 5, label: "التفضيلات", icon: Compass },
  { id: 6, label: "الخصوصية", icon: Shield },
]

export function OnboardingWizardModal({
  isOpen,
  onClose,
  profile,
  onUpdateIdentity,
  onUpdateSkills,
  onUpdateEducation,
  onUpdateExperience,
  onUploadCV,
  onUpdatePreferences,
  onUpdateVisibility,
}: OnboardingWizardModalProps) {
  const { t, isRTL } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Basics state
  const [fullname, setFullname] = useState(profile.fullname || "")
  const [about, setAbout] = useState(profile.about || "")
  const [mobile, setMobile] = useState(profile.mobile || "")
  const [government, setGovernment] = useState(profile.government || "")

  // Step 2: Skills state
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [skillInput, setSkillInput] = useState("")

  // Step 3: Education & Experience state
  const [degree, setDegree] = useState(profile.educational_qualification || "")
  const [university, setUniversity] = useState(profile.university || "")
  const [yearsOfSkills, setYearsOfSkills] = useState(profile.years_of_skills || "")
  const [fieldOfWork, setFieldOfWork] = useState(profile.preferred_field_of_work || "")

  // Step 4: CV state
  const [cvFile, setCvFile] = useState<File | null>(null)

  // Step 5: Preferences state
  const [workType, setWorkType] = useState(profile.work_type || "دوام كامل")
  const [workStyle, setWorkStyle] = useState(profile.work_style || "مرن")
  const [expectedSalary, setExpectedSalary] = useState<number | "">(
    profile.expected_salary || ""
  )

  // Step 6: Visibility state
  const [visibility, setVisibility] = useState<any>(
    profile.visibility || "employers_only"
  )

  if (!isOpen) return null

  const handleNext = async () => {
    setIsSaving(true)
    setError(null)
    try {
      if (currentStep === 1) {
        await onUpdateIdentity({
          fullname: fullname.trim(),
          about: about.trim(),
          mobile: mobile.trim(),
          government: government.trim(),
        })
      } else if (currentStep === 2) {
        await onUpdateSkills({ skills })
      } else if (currentStep === 3) {
        await onUpdateEducation({
          educational_qualification: degree,
          university,
        })
        await onUpdateExperience({
          years_of_skills: yearsOfSkills,
          preferred_field_of_work: fieldOfWork,
        })
      } else if (currentStep === 4) {
        if (cvFile) {
          await onUploadCV(cvFile)
        }
      } else if (currentStep === 5) {
        await onUpdatePreferences({
          work_type: workType,
          work_style: workStyle,
          expected_salary: expectedSalary ? Number(expectedSalary) : null,
          preferred_field_of_work: fieldOfWork,
        })
      } else if (currentStep === 6) {
        await onUpdateVisibility({ visibility })
        onClose()
        return
      }

      setCurrentStep((prev) => Math.min(prev + 1, 6))
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "حدث خطأ أثناء الحفظ")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleAddSkill = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (tag: string) => {
    setSkills(skills.filter((s) => s.toLowerCase() !== tag.toLowerCase()))
  }

  const PrevIcon = isRTL ? ArrowRight : ArrowLeft
  const NextIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
        <div className="w-full max-w-2xl bg-[#0b1220] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {t("candidate.profile.onboarding.welcomeTitle")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("candidate.profile.onboarding.welcomeSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isCurrent = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div
                key={step.id}
                className="flex items-center gap-1.5 flex-1 min-w-[70px]"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-primary text-white ring-2 ring-primary/40"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[11px] font-semibold hidden sm:inline truncate ${
                    isCurrent
                      ? "text-white"
                      : isCompleted
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* ── Step 1: Basics ──────────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="أحمد المنصور"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                العنوان المهني / النبذة المختصرة
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="مطور واجهات أمامية بخبرة في React وTypeScript، أبحث عن فرص في الرياض..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">رقم الجوال</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  dir="ltr"
                  placeholder="0501112233"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary text-end"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">المدينة / المنطقة</label>
                <input
                  type="text"
                  value={government}
                  onChange={(e) => setGovernment(e.target.value)}
                  placeholder="الرياض"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Skills ──────────────────────────────────────────────── */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddSkill(skillInput)
                  }
                }}
                placeholder="اكتب مهارة واضغط إضافة (مثل: React, Python)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                disabled={!skillInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shrink-0 disabled:opacity-40"
              >
                إضافة
              </button>
            </div>

            {/* Added skills */}
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              {skills.length > 0 ? (
                skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30 text-xs font-semibold"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 self-center mx-auto">
                  أضف على الأقل 3 مهارات لتسهيل مطابقتك
                </span>
              )}
            </div>

            {/* Popular suggestions */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-semibold">مهارات مقترحة سريعة:</span>
              <div className="flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Python", "SQL", "Figma", "Node.js", "Docker"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                  >
                    <Plus className="w-3 h-3 text-slate-500" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Education & Experience ──────────────────────────────── */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">المؤهل الدراسي</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">اختر المؤهل</option>
                  <option value="بكالوريوس">بكالوريوس</option>
                  <option value="ماجستير">ماجستير</option>
                  <option value="دبلوم">دبلوم</option>
                  <option value="ثانوية عامة">ثانوية عامة</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">الجامعة / المؤسسة</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="جامعة الملك سعود"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">سنوات الخبرة</label>
                <select
                  value={yearsOfSkills}
                  onChange={(e) => setYearsOfSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">اختر سنوات الخبرة</option>
                  <option value="حديث التخرج">حديث التخرج (أقل من سنة)</option>
                  <option value="سنة إلى سنتين">1 - 2 سنوات</option>
                  <option value="3 إلى 5 سنوات">3 - 5 سنوات</option>
                  <option value="أكثر من 5 سنوات">أكثر من 5 سنوات</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">المجال الأساسي</label>
                <input
                  type="text"
                  value={fieldOfWork}
                  onChange={(e) => setFieldOfWork(e.target.value)}
                  placeholder="تطوير البرمجيات والويب"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: CV Upload ───────────────────────────────────────────── */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/40">
              <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-xs text-slate-300 font-medium mb-1">
                {cvFile ? cvFile.name : profile.cv ? `السيرة المسجلة: ${profile.cv}` : "ارفع سيرتك الذاتية (PDF أو DOCX)"}
              </p>
              <p className="text-[11px] text-slate-500 mb-4">
                يقوم محرك ATS بتحليل واستخراج المؤهلات تلقائياً
              </p>
              <input
                id="onboarding-cv-input"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCvFile(e.target.files[0])
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="onboarding-cv-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
              >
                <span>{cvFile || profile.cv ? "اختيار ملف آخر" : "تحديد ملف"}</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 5: Preferences ─────────────────────────────────────────── */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">نوع الوظيفة</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="دوام كامل">دوام كامل</option>
                  <option value="دوام جزئي">دوام جزئي</option>
                  <option value="عن بعد">عن بعد</option>
                  <option value="هجين (مكتبي وعن بعد)">هجين</option>
                  <option value="عقد / عمل حر">عقد / عمل حر</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">أسلوب العمل</label>
                <select
                  value={workStyle}
                  onChange={(e) => setWorkStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="مرن">مرن</option>
                  <option value="مكتبي فقط">مكتبي فقط</option>
                  <option value="عن بعد بالكامل">عن بعد بالكامل</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                الراتب الشهري المتوقع (ريال سعودي)
              </label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value ? Number(e.target.value) : "")}
                placeholder="15000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* ── Step 6: Visibility ──────────────────────────────────────────── */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <div
              onClick={() => setVisibility("employers_only")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                visibility === "employers_only"
                  ? "bg-primary/10 border-primary"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">
                مرئي للشركات المعتمدة فقط (موصى به)
              </h4>
              <p className="text-xs text-slate-400">
                يمكن لأصحاب العمل وصناع القرار المعتمدين اكتشاف ملفك والتواصل معك.
              </p>
            </div>

            <div
              onClick={() => setVisibility("public")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                visibility === "public"
                  ? "bg-primary/10 border-primary"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">عام للجميع</h4>
              <p className="text-xs text-slate-400">
                يظهر ملفك في دليل الكفاءات المهنية لجميع زوار المنصة.
              </p>
            </div>

            <div
              onClick={() => setVisibility("private")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                visibility === "private"
                  ? "bg-primary/10 border-primary"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">خاص (غير مدرج)</h4>
              <p className="text-xs text-slate-400">
                ملفك مخفي ولا يظهر إلا عند تقديمك المباشر على فرصة معينة.
              </p>
            </div>
          </div>
        )}

        {/* ── Footer Navigation Buttons ───────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <PrevIcon className="w-3.5 h-3.5" />
                <span>{t("candidate.profile.onboarding.back")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-slate-500 hover:text-slate-400 transition-colors"
              >
                {t("candidate.profile.onboarding.skip")}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {currentStep === 6
                ? t("candidate.profile.onboarding.finishBtn")
                : t("candidate.profile.onboarding.next")}
            </span>
            <NextIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </div>
    </ModalPortal>
  )
}
