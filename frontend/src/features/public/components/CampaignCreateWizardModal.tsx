/**
 * features/public/components/CampaignCreateWizardModal.tsx
 *
 * Persona-driven Campaign Creation & Publishing Wizard:
 * 1. Checks & validates account type (University, Company, Job Seeker)
 * 2. Dynamically loads account-specific campaign categories:
 *    - University: Research Paper, Job Fair, Achievement, Innovation, International Awards
 *    - Company: General Hiring, Specific Field (AI/Data), Brand Image, Talent Community, Team Spotlight, Innovation, Scientific Message
 *    - Job Seeker: Portfolio Showcase, Open to Work, Capstone Project, Specialized Skills
 * 3. Content + Image/Video Media + Call To Action (CTA)
 * 4. Target Audience Engine (Roles, Specializations, Locations)
 * 5. Instant Publishing with live preview
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Sparkles,
  GraduationCap,
  Building2,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Target,
  Rocket,
  ExternalLink,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import {
  ACCOUNT_POST_TYPES,
  type CreatePostDTO,
  type CampaignAudience,
  type BudgetType,
} from "../types/posts.types"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import toast from "react-hot-toast"

interface CampaignCreateWizardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newPost: any) => void
  initialAccountType?: "university" | "company" | "candidate"
}

// Preset banner images for quick selection
const PRESET_BANNERS = [
  {
    title: "AI & Tech",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop",
  },
  {
    title: "Career & Business",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
  },
  {
    title: "Research & Academic",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
  },
  {
    title: "Innovation & Future",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
  },
]

export function CampaignCreateWizardModal({
  isOpen,
  onClose,
  onSuccess,
  initialAccountType,
}: CampaignCreateWizardModalProps) {
  const { language } = useTranslation()
  const { user } = useAuthStore()

  // Detect account type from logged-in session, with option to test/switch personas
  const userRole = user?.role
  const detectedRole: "university" | "company" | "candidate" =
    userRole === "university" ? "university" : userRole === "candidate" ? "candidate" : "company"
  const [accountType, setAccountType] = useState<"university" | "company" | "candidate">(
    initialAccountType || detectedRole
  )

  // Current wizard step (1 to 6)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)

  // Form State
  const [selectedPostType, setSelectedPostType] = useState<string>(
    accountType === "university"
      ? "research_paper"
      : accountType === "company"
      ? "hiring_general"
      : "portfolio_showcase"
  )
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [ctaText, setCtaText] = useState("")
  const [ctaUrl, setCtaUrl] = useState("")

  // Media State
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const [coverImage, setCoverImage] = useState(PRESET_BANNERS[0].url)
  const [videoUrl, setVideoUrl] = useState("")

  // Target Audience State
  const [targetRoles, setTargetRoles] = useState<("candidate" | "company" | "university")[]>([
    accountType === "university"
      ? "candidate"
      : accountType === "company"
      ? "candidate"
      : "company",
  ])
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([
    "الذكاء الاصطناعي وهندسة البرمجيات",
  ])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "الرياض",
    "جميع مناطق المملكة",
  ])

  // ── Budget State ──
  const [budgetType, setBudgetType] = useState<BudgetType>("free")
  const [totalBudget, setTotalBudget] = useState<string>("")
  const [dailyBudget, setDailyBudget] = useState<string>("")
  const [currency] = useState("SAR")
  const [durationDays, setDurationDays] = useState<string>("7")

  // Derived: estimated proposed reach (never guaranteed)
  const computedReach = (() => {
    const tb = parseFloat(totalBudget) || 0
    const db = parseFloat(dailyBudget) || 0
    const days = parseInt(durationDays) || 1
    const numRoles = targetRoles.length
    const numLocs = selectedLocations.length
    const breadth = Math.max(1, (numRoles + numLocs) * 0.5)
    const effective = tb + db * days
    const mult = effective > 0 ? 1 + effective / 500 : 1
    const est = Math.round(5000 * breadth * mult)
    return { min: Math.max(100, Math.round(est * 0.7)), max: Math.round(est * 1.4) }
  })()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // When account type switches, adjust default sub-type
  const handleAccountTypeChange = (acc: "university" | "company" | "candidate") => {
    setAccountType(acc)
    if (acc === "university") {
      setSelectedPostType("research_paper")
      setTargetRoles(["candidate", "company"])
      setCtaText(language === "ar" ? "تحميل الورقة العلمية" : "Download Research Paper")
    } else if (acc === "company") {
      setSelectedPostType("hiring_general")
      setTargetRoles(["candidate"])
      setCtaText(language === "ar" ? "تقديم طلب التوظيف" : "Apply for Job")
    } else {
      setSelectedPostType("portfolio_showcase")
      setTargetRoles(["company"])
      setCtaText(language === "ar" ? "استعراض ملف الأعمال" : "View Portfolio")
    }
  }

  const toggleTargetRole = (role: "candidate" | "company" | "university") => {
    if (targetRoles.includes(role)) {
      if (targetRoles.length > 1) {
        setTargetRoles(targetRoles.filter((r) => r !== role))
      }
    } else {
      setTargetRoles([...targetRoles, role])
    }
  }

  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      if (selectedSpecializations.length > 1) {
        setSelectedSpecializations(selectedSpecializations.filter((s) => s !== spec))
      }
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec])
    }
  }

  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== loc))
      }
    } else {
      setSelectedLocations([...selectedLocations, loc])
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedPostType) {
      toast.error(language === "ar" ? "يرجى اختيار تصنيف الحملة" : "Please select a campaign category")
      return
    }
    if (currentStep === 2 && (!title.trim() || !content.trim())) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال عنوان الحملة ومحتواها"
          : "Please enter campaign title and content"
      )
      return
    }
    // Budget validation for non-free budgets
    if (currentStep === 5) {
      if (budgetType === "total" && (!totalBudget || parseFloat(totalBudget) <= 0)) {
        toast.error(language === "ar" ? "يرجى إدخال إجمالي الميزانية" : "Please enter a valid total budget")
        return
      }
      if (budgetType === "daily" && (!dailyBudget || parseFloat(dailyBudget) <= 0)) {
        toast.error(language === "ar" ? "يرجى إدخال الميزانية اليومية" : "Please enter a valid daily budget")
        return
      }
    }
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as any)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error(language === "ar" ? "العنوان والمحتوى مطلوبان" : "Title and content are required")
      return
    }

    setIsSubmitting(true)
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const targetAudience: CampaignAudience = {
        roles: targetRoles,
        targetSpecializations: selectedSpecializations,
        targetLocations: selectedLocations,
      }

      const dto: CreatePostDTO = {
        title: title.trim(),
        summary: summary.trim() || content.trim().slice(0, 140) + "...",
        content: content.trim(),
        category:
          accountType === "university"
            ? "الأبحاث والابتكار"
            : accountType === "company"
            ? "استقطاب كفاءات"
            : "المشاريع والأعمال",
        accountType,
        postType: selectedPostType,
        coverImage: mediaType === "image" ? coverImage : undefined,
        mediaType,
        videoUrl: mediaType === "video" ? videoUrl : undefined,
        ctaText: ctaText.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
        targetAudience,
        tags: parsedTags.length > 0 ? parsedTags : [title.trim().split(" ")[0]],
        authorName:
          user?.name ||
          (accountType === "university"
            ? "جامعة الملك فيصل"
            : accountType === "company"
            ? "شركة وطنية رائدة"
            : "مهندس برمجيات متميز"),
        // ── Budget fields ──
        budgetType,
        totalBudget: budgetType !== "free" && totalBudget ? parseFloat(totalBudget) : null,
        dailyBudget: budgetType === "daily" && dailyBudget ? parseFloat(dailyBudget) : null,
        currency,
        durationDays: durationDays ? parseInt(durationDays) : null,
      }

      onSuccess(dto)
      toast.success(
        language === "ar"
          ? "تم إطلاق ونشر الحملة بنجاح وستظهر للمستخدمين المستهدفين!"
          : "Campaign published successfully and targeted to relevant users!"
      )
      onClose()
    } catch {
      toast.error(language === "ar" ? "تعذر نشر الحملة" : "Failed to publish campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const availableCategories = ACCOUNT_POST_TYPES[accountType] || []
  const activeCategoryObj = availableCategories.find((c) => c.key === selectedPostType)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl bg-[#09152C] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-start max-h-[92vh] flex flex-col"
        >
          {/* Top Bar with Close */}
          <button
            onClick={onClose}
            className="absolute top-5 end-5 p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header & Persona Verification Badge */}
          <div className="space-y-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3 pe-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-secondary border border-primary/30">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>
                    {language === "ar"
                      ? "إطلاق ونشر حملة موجهة"
                      : "Create & Publish Targeted Campaign"}
                  </span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
                  {language === "ar"
                    ? "معالج إطلاق الحملات الذكية"
                    : "Smart Campaign Launch Wizard"}
                </h3>
              </div>

              {/* Persona Switcher / Simulator Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("university")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    accountType === "university"
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "جامعة" : "University"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("company")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    accountType === "company"
                      ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "شركة" : "Company"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccountTypeChange("candidate")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    accountType === "candidate"
                      ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "باحث عن عمل" : "Job Seeker"}</span>
                </button>
              </div>
            </div>

            {/* Stepper Wizard Bar */}
            <div className="grid grid-cols-6 gap-2 pt-2">
              {[
                { step: 1, label: language === "ar" ? "التصنيف" : "Category" },
                { step: 2, label: language === "ar" ? "المحتوى" : "Content" },
                { step: 3, label: language === "ar" ? "الوسائط" : "Media" },
                { step: 4, label: language === "ar" ? "الجمهور" : "Audience" },
                { step: 5, label: language === "ar" ? "الميزانية" : "Budget" },
                { step: 6, label: language === "ar" ? "النشر" : "Publish" },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step as any)}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    currentStep === s.step
                      ? "text-primary"
                      : s.step < currentStep
                      ? "text-emerald-400"
                      : "text-muted-foreground/60"
                  }`}
                >
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      currentStep === s.step
                        ? "bg-primary"
                        : s.step < currentStep
                        ? "bg-emerald-500"
                        : "bg-white/10"
                    }`}
                  />
                  <span className="text-[10px] font-bold truncate">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Content Body */}
          <div className="flex-1 overflow-y-auto py-5 space-y-5 pe-1">
            {/* ── STEP 1: Account Category & Objective ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/20 text-secondary">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {language === "ar"
                          ? `تصنيفات الحملات المخصصة لـ ${
                              accountType === "university"
                                ? "الجامعات والمراكز البحثية"
                                : accountType === "company"
                                ? "الشركات وأصحاب العمل"
                                : "الكفاءات والباحثين عن عمل"
                            }`
                          : `Campaign Categories for ${
                              accountType === "university"
                                ? "Universities"
                                : accountType === "company"
                                ? "Companies"
                                : "Job Seekers"
                            }`}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {language === "ar"
                          ? "تم فلترة التصنيفات آلياً لتناسب نوع حسابك النشط."
                          : "Categories are automatically tuned to your active account role."}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30 uppercase font-mono">
                    {accountType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedPostType === cat.key
                    const label = cat.labels[language] || cat.labels.en
                    const desc = cat.description ? (cat.description[language] || cat.description.en) : ""
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedPostType(cat.key)}
                        className={`p-3.5 rounded-2xl border text-start transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-card/40 border-white/5 text-muted-foreground hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-secondary" />
                            {label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {desc}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 2: Content & Details ── */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === "ar" ? "عنوان الحملة الرئيسي *" : "Campaign Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      accountType === "university"
                        ? "مثال: بحث علمي رائد في تقنيات الطاقة النظيفة والذكاء الاصطناعي 2026"
                        : accountType === "company"
                        ? "مثال: فتح باب التقديم لبرنامج استقطاب نخبة مهندسي الذكاء الاصطناعي"
                        : "مثال: مهندس حلول سحابية وبرمجيات متقدمة - متاح للفرص الوظيفية"
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === "ar" ? "الملخص أو الشعار التسويقي (Tagline)" : "Summary / Tagline"}
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={language === "ar" ? "نبذة سريعة تظهر في ملخص بطاقة الحملة" : "Short catchy summary"}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === "ar" ? "محتوى وتفاصيل الحملة الكاملة *" : "Campaign Content *"}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={language === "ar" ? "اشرح بالتفصيل أهداف الحملة، الشروط، المخرجات، أو كيفية التقديم..." : "Detail the campaign objectives, eligibility, and steps..."}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {language === "ar" ? "نص زر الإجراء (Call to Action)" : "CTA Button Label"}
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder={
                        accountType === "university"
                          ? "تحميل البحث / التسجيل"
                          : accountType === "company"
                          ? "التقديم الفوري على الوظيفة"
                          : "استعراض ملف الأعمال"
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {language === "ar" ? "رابط الإجراء (CTA Link)" : "CTA Action Link"}
                    </label>
                    <input
                      type="text"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="/jobs أو رابط خارجي https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {language === "ar" ? "الوسوم والكلمات المفتاحية (مفصولة بفاصلة)" : "Tags (comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="ذكاء اصطناعي, توظيف فوري, الرياض, تدريب تعاوني"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Media (Image Banner or Video) ── */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      mediaType === "image"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{language === "ar" ? "صورة غلاف (Banner Image)" : "Banner Image"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      mediaType === "video"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{language === "ar" ? "فيديو ترويجي (Video Campaign)" : "Video Campaign"}</span>
                  </button>
                </div>

                {mediaType === "image" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === "ar" ? "رابط الصورة (Image URL)" : "Image URL"}
                      </label>
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-2">
                        {language === "ar" ? "أو اختر غلافاً جاهزاً عالي الدقة:" : "Or select a curated cover:"}
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_BANNERS.map((preset) => (
                          <div
                            key={preset.title}
                            onClick={() => setCoverImage(preset.url)}
                            className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                              coverImage === preset.url ? "border-primary scale-[1.03]" : "border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white text-center py-0.5 font-bold truncate">
                              {preset.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview Image */}
                    {coverImage && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 h-44 relative mt-2">
                        <img src={coverImage} alt="Banner Preview" className="w-full h-full object-cover" />
                        <span className="absolute top-2 start-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                          {language === "ar" ? "معاينة الغلاف" : "Cover Preview"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === "ar" ? "رابط الفيديو (YouTube / MP4 / Vimeo)" : "Video URL"}
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                      <Video className="w-8 h-8 text-primary mx-auto" />
                      <p className="text-xs text-muted-foreground">
                        {language === "ar"
                          ? "سيتم تضمين الفيديو مباشرة في بطاقة الحملة مع زر تشغيل تفاعلي للمستخدمين المستهدفين."
                          : "The video will be seamlessly embedded with an interactive play button in user feeds."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Target Audience Definition (Targeting Engine) ── */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-secondary" />
                    <span>{language === "ar" ? "محرك الاستهداف الذكي (Audience Match)" : "Audience Match Engine"}</span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {language === "ar"
                      ? "ستظهر هذه الحملة تلقائياً في صفحة 'موجه لك' للمستخدمين الذين يطابقون هذه المعايير."
                      : "This campaign will auto-feed into the personalized stream of matching users."}
                  </p>
                </div>

                {/* 1. Target Role */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    {language === "ar" ? "1. من هم المستخدمون المستهدفون؟ (الفئة المستهدفة) *" : "1. Who should see this campaign? *"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { role: "candidate" as const, label: language === "ar" ? "باحثون عن عمل وخريجون" : "Job Seekers & Grads", icon: UserCheck },
                      { role: "company" as const, label: language === "ar" ? "شركات ومسؤولو توظيف" : "Companies & Recruiters", icon: Building2 },
                      { role: "university" as const, label: language === "ar" ? "جامعات وباحثون أكاديميون" : "Universities & Faculty", icon: GraduationCap },
                    ].map((item) => {
                      const isSelected = targetRoles.includes(item.role)
                      const Icon = item.icon
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => toggleTargetRole(item.role)}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-primary/20 border-primary text-white shadow-md shadow-primary/20"
                              : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-secondary" />
                            {item.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Target Specialization */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    {language === "ar" ? "2. التخصصات والمجالات المستهدفة:" : "2. Target Fields & Specializations:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "الذكاء الاصطناعي وهندسة البرمجيات",
                      "الأمن السيبراني",
                      "علم البيانات والحوسبة السحابية",
                      "إدارة الأعمال والتسويق",
                      "الهندسة الكهربائية والميكانيكية",
                      "التقنية الحيوية والزراعية",
                      "جميع التخصصات",
                    ].map((spec) => {
                      const isSelected = selectedSpecializations.includes(spec)
                      return (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialization(spec)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-secondary/25 border border-secondary text-secondary"
                              : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
                          }`}
                        >
                          {spec}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Target Region */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    {language === "ar" ? "3. المنطقة الجغرافية المستهدفة:" : "3. Target Location:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "الرياض",
                      "المنطقة الشرقية (الدمام والخبر والأحساء)",
                      "مكة المكرمة وجدة",
                      "عن بُعد (Remote)",
                      "جميع مناطق المملكة",
                    ].map((loc) => {
                      const isSelected = selectedLocations.includes(loc)
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleLocation(loc)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-emerald-500/25 border border-emerald-500 text-emerald-300"
                              : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
                          }`}
                        >
                          {loc}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5: Budget & Proposed Reach ── */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>{language === "ar" ? "الميزانية والوصول المقدر" : "Budget & Estimated Reach"}</span>
                  </h4>
                  <p className="text-[11px] text-amber-200/70">
                    {language === "ar"
                      ? "الميزانية اختيارية. الوصول المعروض تقديري فقط وليس مضموناً."
                      : "Budget is optional. Displayed reach is an estimate only — not guaranteed."}
                  </p>
                </div>

                {/* Budget Type */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    {language === "ar" ? "نوع الميزانية" : "Budget Type"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: "free", label: language === "ar" ? "بدون ميزانية" : "No Budget", desc: language === "ar" ? "نشر مجاني" : "Free publish" },
                      { key: "total", label: language === "ar" ? "ميزانية إجمالية" : "Total Budget", desc: language === "ar" ? "مبلغ ثابت" : "Fixed amount" },
                      { key: "daily", label: language === "ar" ? "ميزانية يومية" : "Daily Budget", desc: language === "ar" ? "يومياً × المدة" : "Per day × duration" },
                    ] as { key: BudgetType; label: string; desc: string }[]).map((bt) => (
                      <button
                        key={bt.key}
                        type="button"
                        onClick={() => setBudgetType(bt.key)}
                        className={`p-3 rounded-xl border text-start text-xs transition-all ${
                          budgetType === bt.key
                            ? "bg-amber-500/20 border-amber-500 text-white"
                            : "bg-white/5 border-white/5 text-muted-foreground hover:text-white"
                        }`}
                      >
                        <span className="font-bold block">{bt.label}</span>
                        <span className="text-[10px] opacity-70">{bt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Amount inputs */}
                {budgetType !== "free" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgetType === "total" && (
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          {language === "ar" ? "إجمالي الميزانية (SAR) *" : "Total Budget (SAR) *"}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(e.target.value)}
                          placeholder="1000"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}
                    {budgetType === "daily" && (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            {language === "ar" ? "الميزانية اليومية (SAR) *" : "Daily Budget (SAR) *"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={dailyBudget}
                            onChange={(e) => setDailyBudget(e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            {language === "ar" ? "مدة الحملة (أيام)" : "Duration (days)"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Proposed Reach Card (always labeled as ESTIMATE) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      {language === "ar" ? "الوصول المقدر / المتوقع" : "Estimated / Proposed Reach"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {language === "ar" ? "تقديري" : "Estimate"}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-200 font-mono">
                    {computedReach.min.toLocaleString()} — {computedReach.max.toLocaleString()}
                    <span className="text-xs font-normal text-amber-200/60 ms-2">
                      {language === "ar" ? "مستخدم" : "users"}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-200/60">
                      {language === "ar"
                        ? "الأرقام تقديرية تحسب من الميزانية وعدد الفئات والمناطق المستهدفة. الوصول الفعلي يختلف ويُقاس بعد النشر."
                        : "Numbers are estimates calculated from budget, target roles & locations. Actual reach is measured post-publish."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 6: Live Preview & Publish ── */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {language === "ar"
                      ? "اكتملت إعدادات الحملة بنجاح! هكذا ستبدو للمستخدمين في الصفحة الرئيسية وموجز الفيد."
                      : "Campaign configured! This is how targeted users will see it in their feed."}
                  </span>
                </div>

                {/* Preview Card */}
                <div className="rounded-3xl border border-white/15 bg-card/60 overflow-hidden shadow-2xl space-y-4 p-5 backdrop-blur-xl">
                  {/* Card Media */}
                  {coverImage && (
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                      <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                      {mediaType === "video" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="p-3 rounded-full bg-primary text-white shadow-xl">
                            <Video className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 start-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/10">
                          {accountType === "university"
                            ? "🏛️ جامعة"
                            : accountType === "company"
                            ? "🏢 شركة"
                            : "👤 باحث عن عمل"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/80 text-white backdrop-blur-md">
                          {activeCategoryObj?.labels[language] || activeCategoryObj?.labels.en}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white">{title || "عنوان الحملة التجريبي"}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {summary || content || "ملخص الحملة الترويجي..."}
                    </p>
                  </div>

                  {/* Targeting tags preview */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1 text-secondary font-bold">
                      <Target className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "موجه إلى:" : "Target:"}</span>
                    </span>
                    {targetRoles.map((r) => (
                      <span key={r} className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px]">
                        {r === "candidate" ? "الباحثين عن عمل" : r === "company" ? "الشركات" : "الجامعات"}
                      </span>
                    ))}
                    {selectedLocations.slice(0, 2).map((l) => (
                      <span key={l} className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 text-[10px]">
                        📍 {l}
                      </span>
                    ))}
                  </div>

                  {ctaText && (
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20">
                        <span>{ctaText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}

                  {/* Budget & Estimated Reach summary in preview */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                    {budgetType !== "free" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                        💰 {budgetType === "total"
                          ? `${parseFloat(totalBudget || "0").toLocaleString()} ${currency}`
                          : `${parseFloat(dailyBudget || "0").toLocaleString()} ${currency}/${language === "ar" ? "يوم" : "day"} × ${durationDays} ${language === "ar" ? "يوم" : "days"}`}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                      📊 {language === "ar" ? "الوصول المقدر (تقديري):" : "Est. Reach:"} {computedReach.min.toLocaleString()}–{computedReach.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{language === "ar" ? "السابق" : "Back"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-muted-foreground hover:text-white text-xs font-bold transition-all"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
                >
                  <span>{language === "ar" ? "التالي" : "Next"}</span>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-secondary text-white text-xs font-black transition-all shadow-lg shadow-primary/30 flex items-center gap-2 transform hover:scale-[1.02]"
                >
                  <Rocket className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? language === "ar"
                        ? "جاري النشر..."
                        : "Publishing..."
                      : language === "ar"
                      ? "إطلاق ونشر الحملة الآن 🚀"
                      : "Launch Campaign Now 🚀"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
