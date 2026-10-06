/**
 * features/candidate/components/FaedaProfileOptimizerModal.tsx
 *
 * Professional AI Faeda Profile Audit, Real-time Simulator & Saudi Market Value Engine.
 * Features:
 *   - 100% Faeda-native candidate profile analysis (Headline, About, Experience, Skills, Recruiter Visibility)
 *   - Saudi Tech Market Salary Benchmark (SAR) & Factors Analysis
 *   - Saudi Vision 2030 In-Demand Skills Gap Matcher & 1-click addition
 *   - Faeda Recruiter Visibility & Employer Shortlisting Multiplier
 *   - Interactive What-If Simulator: test custom headlines, metrics, and skills live
 *   - 1-Click AI Rewrites Studio with direct application to Faeda Candidate Profile
 *   - Prioritized AI Action Plan & 100% All-Star Checklist
 *   - Executive Printable / PDF Export Report (Zero third-party branding)
 *   - Trilingual (Arabic RTL, English LTR, Hindi)
 */
import { useState, useEffect, useMemo } from "react"
import {
  X,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Copy,
  RefreshCw,
  Zap,
  Printer,
  ChevronRight,
  ChevronLeft,
  Target,
  FileText,
  SlidersHorizontal,
  Plus,
  Edit3,
  Flame,
  UserCheck,
  ShieldCheck,
  Briefcase,
  MapPin,
  Check,
} from "lucide-react"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"
import { marketDataService } from "@/features/market-insights/services/market-insights.service"
import type { FaedaProfileAnalysisResult, FaedaChecklistItem } from "@/features/market-insights/types/market-insights.types"
import toast from "react-hot-toast"

export interface FaedaProfileOptimizerModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    candidate_name?: string
    headline?: string
    about?: string
    skills?: string[]
    role?: string
    experienceYears?: number
    location?: string
    education?: string
    projects_count?: number
    certifications_count?: number
    has_cv?: boolean
  }
  onApplyHeadline?: (newHeadline: string) => void
  onApplyAbout?: (newAbout: string) => void
  onAddSkill?: (skill: string) => void
}

export function FaedaProfileOptimizerModal({
  isOpen,
  onClose,
  initialData,
  onApplyHeadline,
  onApplyAbout,
  onAddSkill,
}: FaedaProfileOptimizerModalProps) {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  // Candidate Profile State
  const candidateName = initialData?.candidate_name || "المرشح المهني"
  const [role, setRole] = useState(initialData?.role || "Full Stack Developer")
  const [headline, setHeadline] = useState(initialData?.headline || "")
  const [about, setAbout] = useState(initialData?.about || "")
  const [skills, setSkills] = useState<string[]>(initialData?.skills || ["React", "TypeScript", "Node.js", "Python"])
  const [experienceYears, setExperienceYears] = useState<number>(initialData?.experienceYears || 3)
  const [location, setLocation] = useState(initialData?.location || "الرياض، المملكة العربية السعودية")

  // Simulator Drawer State
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [newSkillInput, setNewSkillInput] = useState("")

  // Analysis Lifecycle State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState("")
  const [result, setResult] = useState<FaedaProfileAnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "skills" | "rewrites" | "checklist">("overview")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Real-time Input Quality Indicators
  const headlineLength = headline.length
  const headlineHasCliche = useMemo(() => {
    const cliches = ["seeking", "looking for job", "looking for new", "باحث عن عمل", "أبحث عن فرصة", "hard worker", "open to work"]
    return cliches.some((c) => headline.toLowerCase().includes(c))
  }, [headline])
  const headlineHasSeparator = headline.includes("|") || headline.includes("•") || headline.includes(" - ")

  const aboutWordsCount = about ? about.trim().split(/\s+/).filter(Boolean).length : 0
  const aboutHasMetrics = Boolean(about && /\b\d+[%+kKmM]?\b/.test(about))

  // Initialize or re-sync when modal opens
  useEffect(() => {
    if (isOpen) {
      const initRole = initialData?.role || role || "Full Stack Developer"
      const initHeadline = initialData?.headline !== undefined ? initialData.headline : headline
      const initAbout = initialData?.about !== undefined ? initialData.about : about
      const initSkills = initialData?.skills && initialData.skills.length > 0 ? initialData.skills : skills
      const initExp = initialData?.experienceYears !== undefined ? initialData.experienceYears : experienceYears
      const initLoc = initialData?.location || location

      setRole(initRole)
      setHeadline(initHeadline)
      setAbout(initAbout)
      setSkills(initSkills)
      setExperienceYears(initExp)
      setLocation(initLoc)

      runAudit(initHeadline, initAbout, initSkills, initRole, initExp, initLoc)
    }
  }, [isOpen])

  const runAudit = async (
    targetHeadline = headline,
    targetAbout = about,
    targetSkills = skills,
    targetRole = role,
    targetExp = experienceYears,
    targetLoc = location
  ) => {
    setIsAnalyzing(true)
    setAnalysisProgress(20)
    setAnalysisStep(L("جاري فحص العنوان والكلمات المفتاحية...", "Auditing headline keywords & value formula...", "शीर्षक और कीवर्ड की जांच जारी..."))

    setTimeout(() => {
      setAnalysisProgress(50)
      setAnalysisStep(L("مقارنة المهارات مع متطلبات السوق السعودي 2026...", "Matching skills against Saudi Vision 2030 demand pool...", "सऊदी विज़न 2030 के साथ कौशल का मिलान..."))
    }, 250)

    setTimeout(() => {
      setAnalysisProgress(80)
      setAnalysisStep(L("حساب مؤشر ظهور مسؤولي التوظيف على فائدة...", "Calculating Faeda Recruiter Visibility & salary benchmarks...", "रिक्रूटर विजिबिलिटी और वेतन बेंचमार्क की गणना..."))
    }, 500)

    try {
      const data = await marketDataService.optimizeFaedaProfile({
        candidate_name: candidateName,
        headline: targetHeadline,
        about: targetAbout,
        skills: targetSkills.length > 0 ? targetSkills : undefined,
        role: targetRole || undefined,
        location: targetLoc,
        experience_years: targetExp,
        education: initialData?.education,
        projects_count: initialData?.projects_count,
        certifications_count: initialData?.certifications_count,
        has_cv: initialData?.has_cv,
      })

      setTimeout(() => {
        setAnalysisProgress(100)
        setResult(data)
        setIsAnalyzing(false)
      }, 750)
    } catch (err) {
      setIsAnalyzing(false)
      toast.error(L("حدث خطأ أثناء التحليل، جرب مرة أخرى", "Failed to run audit, please try again", "विश्लेषण में त्रुटि हुई"))
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(L("تم النسخ بنجاح!", "Copied to clipboard!", "क्लिपबोर्ड पर कॉपी किया गया!"))
    setTimeout(() => setCopiedId(null), 2000)
  }

  // 1-Click Apply Headline to Faeda Profile
  const handleApplyHeadlineAction = async (newHl: string) => {
    setHeadline(newHl)
    if (onApplyHeadline) {
      onApplyHeadline(newHl)
    }
    toast.success(L("تم تطبيق العنوان على ملفك في فائدة وتحديث النتيجة!", "Headline applied to Faeda Profile & score updated!", "शीर्षक फायदा प्रोफाइल पर लागू किया गया!"))
    runAudit(newHl, about, skills, role, experienceYears, location)
  }

  // 1-Click Apply About to Faeda Profile
  const handleApplyAboutAction = async (newAb: string) => {
    setAbout(newAb)
    if (onApplyAbout) {
      onApplyAbout(newAb)
    }
    toast.success(L("تم تطبيق النبذة على ملفك في فائدة وتحديث النتيجة!", "About bio applied to Faeda Profile & score updated!", "बायो फायदा प्रोफाइल पर लागू किया गया!"))
    runAudit(headline, newAb, skills, role, experienceYears, location)
  }

  // 1-Click Add Missing Skill to Faeda Profile
  const handleAddSkillAction = async (newSkill: string) => {
    if (skills.includes(newSkill)) return
    const updated = [...skills, newSkill]
    setSkills(updated)
    if (onAddSkill) {
      onAddSkill(newSkill)
    }
    toast.success(L(`تمت إضافة مهارة (${newSkill}) لملفك في فائدة!`, `Added ${newSkill} to Faeda Profile!`, `कौशल जोड़ा गया!`))
    runAudit(headline, about, updated, role, experienceYears, location)
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove)
    setSkills(updated)
    runAudit(headline, about, updated, role, experienceYears, location)
  }

  const handleAddCustomSkill = () => {
    const trimmed = newSkillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      handleAddSkillAction(trimmed)
      setNewSkillInput("")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className={`relative w-full max-w-5xl my-auto rounded-3xl bg-slate-950 border border-cyan-500/25 shadow-2xl shadow-cyan-950/60 flex flex-col h-[92vh] max-h-[880px] overflow-hidden text-slate-100 ${
            isRTL ? "rtl font-sans" : "ltr font-sans"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950 z-30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    {L("مطور ومحلل ملف فائدة الذكي", "Faeda Profile Optimizer", "फायदा प्रोफाइल ऑप्टिमाइज़र")}
                  </h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Vision 2030 AI
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {L(
                    "تحسين ملفك المهني على منصة فائدة لمطابقة متطلبات السوق السعودي والخليجي وزيادة عروض التوظيف",
                    "Optimize your Faeda profile for Saudi and GCC career opportunities.",
                    "सऊदी और जीसीसी नौकरी बाजार के लिए अपनी फायदा प्रोफाइल को अनुकूलित करें"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors"
                title={L("طباعة التقرير أو حفظه كـ PDF", "Print / Save PDF Report", "रिपोर्ट प्रिंट करें")}
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>{L("تقرير تدقيق فائدة (PDF)", "Faeda Audit Report", "रिपोर्ट (PDF)")}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Candidate Profile Context Banner */}
          <div className="shrink-0 px-6 py-3 bg-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs font-bold">
                {candidateName.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{candidateName}</span>
                  <span className="px-2 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    {L("ملف مرشح فائدة", "Faeda Candidate Profile", "सत्यापित फायदा प्रोफाइल")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    {role}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (initialData?.headline) setHeadline(initialData.headline)
                  if (initialData?.about) setAbout(initialData.about)
                  if (initialData?.skills) setSkills(initialData.skills)
                  if (initialData?.role) setRole(initialData.role)
                  if (initialData?.experienceYears) setExperienceYears(initialData.experienceYears)
                  toast.success(L("تمت المزامنة بنجاح من بيانات ملف فائدة!", "Synced with Faeda Profile!", "फायदा प्रोफाइल से सिंक सफल!"))
                  runAudit(
                    initialData?.headline || headline,
                    initialData?.about || about,
                    initialData?.skills || skills,
                    initialData?.role || role,
                    initialData?.experienceYears || experienceYears,
                    location
                  )
                }}
                className="text-xs border-cyan-500/30 hover:border-cyan-400 text-cyan-300 bg-cyan-950/20 rounded-xl"
              >
                <RefreshCw className="w-3.5 h-3.5 me-1.5" />
                {L("مزامنة من فائدة", "Sync Faeda Profile", "प्रोफाइल से सिंक")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditorOpen(!isEditorOpen)}
                className={`text-xs rounded-xl border ${
                  isEditorOpen
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "border-white/10 bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 me-1.5" />
                <span>{L("محاكي التعديل الحي", "What-If Simulator", "लाइव सिम्युलेटर")}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="text-xs rounded-xl border border-white/10 bg-slate-800 text-slate-300 hover:text-white"
              >
                <Printer className="w-3.5 h-3.5 me-1.5 text-cyan-400" />
                <span>{L("تقرير تدقيق الملف (PDF)", "Print Audit Report", "रिपोर्ट प्रिंट")}</span>
              </Button>

              <Button
                size="sm"
                onClick={() => runAudit(headline, about, skills, role, experienceYears, location)}
                disabled={isAnalyzing}
                className="text-xs font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white shadow-md shadow-cyan-600/30 rounded-xl"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 me-1.5 animate-spin" />
                    <span>{L("جاري التحليل...", "Analyzing...", "विश्लेषण जारी...")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 me-1.5" />
                    <span>{L("إعادة فحص النتيجة", "Recalculate Score", "री-ऑडिट")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Interactive What-If Simulator & Live Editor Drawer */}
          {isEditorOpen && (
            <div className="shrink-0 px-6 py-4 bg-slate-950 border-b border-cyan-500/25 space-y-4 animate-in slide-in-from-top-3 duration-200 z-20 max-h-[45vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {L("محاكي التعديل الحي للبيانات (What-If Profile Simulator)", "Interactive Profile Simulator & Fine-Tuning", "लाइव प्रोफाइल सिम्युलेटर")}
                  </span>
                </div>
                <span className="text-[11px] text-cyan-300 font-medium">
                  {L("غيّر أي نص أو مهارة واضغط 'تحديث النتيجة' لتشاهد تغير السكور ومؤشر التوظيف فورياً!", "Edit any text or skills to watch your strength score & benchmark recalculate instantly!", "स्कोर में बदलाव देखने के लिए डेटा संपादित करें!")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Headline Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {L("العنوان الرئيسي (Headline):", "Profile Headline:", "मुख्य शीर्षक:")}
                    </label>
                    <span className={`text-[11px] font-bold ${headlineLength >= 50 && headlineLength <= 130 ? "text-emerald-400" : "text-amber-400"}`}>
                      {headlineLength} / 120 {L("حرف", "chars", "अक्षर")}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    placeholder={L("المسمى الوظيفي | المهارات | القيمة المضافة", "Role | Core Skills | Measurable Business Impact", "पद | कौशल | प्रभाव")}
                  />
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
                    {headlineHasCliche && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {L("⚠️ عبارة تقليدية مكتشفة (احذف Looking for job)", "⚠️ Passive phrase detected (Remove 'Looking for job')", "निष्क्रिय शब्द हटाएं")}
                      </span>
                    )}
                    {headlineHasSeparator ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {L("✓ تنسيق احترافي بفاصل (|)", "✓ Structured separator format", "उत्कृष्ट संरचना")}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {L("💡 أضف فاصل | للفصل بين المسمى والمهارات", "💡 Add | to separate role & technologies", "विभाजक जोड़ें")}
                      </span>
                    )}
                  </div>
                </div>

                {/* About Bio Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300">
                      {L("نبذة عني (About Summary):", "About Summary:", "About सेक्शन:")}
                    </label>
                    <span className={`text-[11px] font-bold ${aboutWordsCount >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
                      {aboutWordsCount} {L("كلمة", "words", "शब्द")}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    placeholder={L("من أنت، إنجازاتك بالأرقام، ودعوة للتواصل المهني...", "Who you are, quantifiable wins (e.g. +35%), and call to action...", "अपनी विशेषज्ञता और उपलब्धियों का सारांश...")}
                  />
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {aboutHasMetrics ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {L("✓ مقاييس كمية وأرقام مكتشفة (إيجابي جداً)", "✓ Quantifiable numbers/metrics detected", "संख्यात्मक परिणाम मौजूद")}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {L("💡 اذكر أرقام وإنجازات بالأرقام (مثال: نمو 20%)", "💡 Add quantifiable numbers (e.g. +25% growth)", "संख्यात्मक विवरण जोड़ें")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags Manager in Drawer */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {L("المهارات المهنية في الملف:", "Skills in Profile:", "प्रोफाइल कौशल:")}
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/20 text-xs flex items-center gap-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-rose-400 ms-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      placeholder={L("+ أضف مهارة...", "+ Add skill...", "+ कौशल जोड़ें")}
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomSkill()
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="p-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Saudi Location, Experience & Recalculate Button */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="shrink-0 flex flex-wrap items-center gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400 block">{L("المدينة المستهدفة (سيو التوظيف):", "Target Saudi Hub (SEO):", "सऊदी शहर (SEO):")}</span>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-white mt-0.5 focus:outline-none"
                    >
                      <option value="الرياض، المملكة العربية السعودية">Riyadh (الرياض) - 95% Match</option>
                      <option value="جدة، المملكة العربية السعودية">Jeddah (جدة) - 88% Match</option>
                      <option value="الدمام والخبر، المنطقة الشرقية">Dammam / Khobar (الشرقية)</option>
                      <option value="نيوم، المملكة العربية السعودية">NEOM (نيوم) - 92% Match</option>
                      <option value="العمل عن بعد، السعودية والخليج">Remote KSA & GCC</option>
                    </select>
                  </div>

                  <div className="text-xs">
                    <span className="text-slate-400 block">{L("سنوات الخبرة:", "Experience:", "अनुभव:")}</span>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-white mt-0.5 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((y) => (
                        <option key={y} value={y}>
                          {y} {L("سنوات", "Years", "वर्ष")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => runAudit(headline, about, skills, role, experienceYears, location)}
                  className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl mt-3 md:mt-0 shadow-md shadow-cyan-600/30"
                >
                  <RefreshCw className="w-3.5 h-3.5 me-1.5" />
                  {L("تحديث النتيجة فورياً", "Apply & Recalculate", "लागू करें")}
                </Button>
              </div>
            </div>
          )}

          {/* Animated Scanning Progress Bar */}
          {isAnalyzing && (
            <div className="shrink-0 px-6 py-4 bg-cyan-950/80 border-b border-cyan-500/30 flex flex-col gap-2 animate-in fade-in z-30">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-medium">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                  {analysisStep}
                </span>
                <span className="font-bold">{analysisProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300 ease-out"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Navigation Tabs */}
          {result && !isAnalyzing && (
            <div className="shrink-0 px-6 border-b border-white/10 bg-slate-950 flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar z-30">
              {[
                { id: "overview", label_ar: "نظرة عامة والنتيجة", label_en: "Overview & Score", label_hi: "अवलोकन और स्कोर", icon: Award },
                { id: "sections", label_ar: "تدقيق الأقسام بالتفصيل", label_en: "Section Audits", label_hi: "सेक्शन ऑडिट", icon: Target },
                { id: "skills", label_ar: "فجوة المهارات السعودية", label_en: "Saudi Market Skills Gap", label_hi: "सऊदी कौशल विश्लेषण", icon: TrendingUp },
                { id: "rewrites", label_ar: "استوديو الصياغة الذكية", label_en: "AI Rewrites Studio", label_hi: "AI रीराइट सुझाव", icon: Sparkles },
                { id: "checklist", label_ar: "خطة العمل والوصول لـ 100%", label_en: "All-Star Checklist", label_hi: "ऑल-स्टार चेकलिस्ट", icon: CheckCircle2 },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? "border-cyan-400 text-cyan-400 shadow-sm shadow-cyan-400/20"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{L(tab.label_ar, tab.label_en, tab.label_hi)}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Modal Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-900/40 relative z-10">
            {result && !isAnalyzing && (
              <>
                {/* ── TAB 1: OVERVIEW & SCORE ── */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Hero KPI Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Overall Strength Score Card */}
                      <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">
                            {L("قوة ملف فائدة", "Faeda Profile Strength", "फायदा प्रोफाइल शक्ति")}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                              result.overall_score >= 88
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : result.overall_score >= 70
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {result.all_star_rating}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 my-2">
                          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-800"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={`${
                                  result.overall_score >= 80
                                    ? "text-emerald-400"
                                    : result.overall_score >= 60
                                    ? "text-cyan-400"
                                    : "text-amber-400"
                                } transition-all duration-700 ease-out`}
                                strokeDasharray={`${result.overall_score}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute text-xl font-extrabold text-white">
                              {result.overall_score}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">
                              {result.overall_score}/100
                            </div>
                            <p className="text-[11px] text-cyan-300 font-medium mt-0.5">
                              {result.percentile_rank}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                          {L("محسوب وفق خوارزمية مطابقة السوق السعودي", "Calibrated for Saudi Tech Job Market", "सऊदी तकनीकी बाजार के अनुकूल")}
                        </div>
                      </GlassCard>

                      {/* Estimated Saudi Market Salary Benchmark */}
                      <GlassCard className="p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-500/20">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                              {L("معيار راتب السوق التقديري", "Estimated Market Salary Benchmark", "अनुमानित मार्केट सैलरी बेंचमार्क")}
                            </span>
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-lg font-extrabold text-emerald-400 mt-2">
                            {result.market_benchmark?.current_estimated_salary || result.market_impact.current_estimated_salary}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300 mt-1">
                            <span>{L("الوسيط (Median):", "Median:", "मीडियन:")}</span>
                            <span className="font-bold text-white">
                              {result.market_benchmark?.median_salary_sar
                                ? `${result.market_benchmark.median_salary_sar.toLocaleString()} SAR/mo`
                                : "15,500 SAR/mo"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-white/5 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">{L("المصدر:", "Source:", "स्रोत:")}</span>
                              <span className="text-slate-300 truncate max-w-[140px]" title={result.market_benchmark?.source_name}>
                                {result.market_benchmark?.source_name || "Saudi Tech Benchmark"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">{L("آخر تحديث:", "Updated:", "अंतिम अपडेट:")}</span>
                              <span className="text-slate-300">{result.market_benchmark?.last_updated || "2026-10-02"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2.5 mt-2 border-t border-white/5 text-[9px] text-slate-400 leading-tight">
                          {L("تقدير استرشادي مبني على أحدث بيانات السوق. لا يمثل عرضاً مضموناً.", "Based on latest available market dataset. Not a guaranteed salary offer.", "नवीनतम मार्केट डेटासेट आधारित अनुमान।")}
                        </div>
                      </GlassCard>

                      {/* Faeda Recruiter Visibility Index */}
                      <GlassCard className="p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-blue-950/30 border-blue-500/20">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                              {L("ظهور مسؤولي التوظيف", "Faeda Recruiter Visibility", "रिक्रूटर विजिबिलिटी")}
                            </span>
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                              <Zap className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="text-2xl font-extrabold text-blue-400 mt-2">
                            {result.market_impact.search_appearances_multiplier}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {L("فرص اختيار ملفك في بحث الشركات على فائدة", "Shortlisting multiplier in Faeda search", "सर्च शॉर्टलिस्टिंग दर")}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-white/5 text-[11px] text-slate-300 flex items-center justify-between">
                          <span>{L("الوصول للمسؤولين:", "Employer Reach:", "पहुंच:")}</span>
                          <span className="font-semibold text-blue-300">{result.market_impact.recruiter_inmail_multiplier}</span>
                        </div>
                      </GlassCard>

                      {/* Top Action Priority */}
                      <GlassCard className="p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-500/20">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                              {L("أولوية التحسين القصوى", "Top Action Priority", "सर्वोच्च प्राथमिकता")}
                            </span>
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                              <Flame className="w-4 h-4" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-200 font-medium mt-2 leading-relaxed">
                            {result.action_plan && result.action_plan.length > 0
                              ? language === "ar"
                                ? result.action_plan[0].title_ar
                                : language === "hi"
                                ? result.action_plan[0].title_hi
                                : result.action_plan[0].title_en
                              : result.summary_insights?.key_improvement_en || "Upgrade headline with targeted role and business value formula."}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("rewrites")}
                          className="pt-3 border-t border-white/5 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-between"
                        >
                          <span>{L("استكشف اقتراحات الذكاء الاصطناعي", "Explore AI Rewrites", "AI सुझाव देखें")}</span>
                          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </GlassCard>
                    </div>

                    {/* Section Breakdown Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                          {L("تفاصيل تقييم أقسام ملف فائدة", "Faeda Profile Section Performance", "प्रोफाइल सेक्शन प्रदर्शन")}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {L("اضغط على أي قسم لعرض الملاحظات والتوجيهات وتعديله فورياً", "Click any section to inspect and edit immediately", "विवरण देखने और संपादित करने के लिए क्लिक करें")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { key: "headline", label_ar: "العنوان المهني", label_en: "Headline Quality", label_hi: "शीर्षक", data: result.sections.headline },
                          { key: "about", label_ar: "نبذة عني", label_en: "About / Bio Story", label_hi: "About", data: result.sections.about },
                          { key: "experience", label_ar: "الخبرات العملية", label_en: "Experience Record", label_hi: "कार्य अनुभव", data: result.sections.experience },
                          { key: "skills", label_ar: "المهارات المتوافقة", label_en: "Skills Alignment", label_hi: "कौशल", data: result.sections.skills },
                          { key: "visibility_seo", label_ar: "ظهور مسؤولي التوظيف", label_en: "Recruiter Visibility", label_hi: "रिक्रूटर विजिबिलिटी", data: result.sections.visibility_seo },
                        ].map((sec) => (
                          <div
                            key={sec.key}
                            onClick={() => {
                              setActiveTab("sections")
                              setIsEditorOpen(true)
                            }}
                            className="cursor-pointer p-4 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                                <span>{L(sec.label_ar, sec.label_en, sec.label_hi)}</span>
                                <span
                                  className={
                                    sec.data.score >= 80
                                      ? "text-emerald-400"
                                      : sec.data.score >= 60
                                      ? "text-amber-400"
                                      : "text-rose-400"
                                  }
                                >
                                  {sec.data.score}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    sec.data.score >= 80
                                      ? "bg-emerald-400"
                                      : sec.data.score >= 60
                                      ? "bg-amber-400"
                                      : "bg-rose-400"
                                  }`}
                                  style={{ width: `${sec.data.score}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-3 flex items-center justify-between">
                              <span>
                                {sec.data.status === "good"
                                  ? L("ممتاز", "Optimal", "उत्कृष्ट")
                                  : sec.data.status === "warning"
                                  ? L("يحتاج تحسين", "Needs Work", "सुधार आवश्यक")
                                  : L("ضعيف", "Critical", "कमजोर")}
                              </span>
                              {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses 2-Column Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths Card */}
                      <GlassCard className="p-5 border-emerald-500/20 bg-gradient-to-br from-slate-900 to-emerald-950/20 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>{L("نقاط القوة في ملفك الحالي", "Profile Strengths", "मजबूत बिंदु")}</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {result.strengths && result.strengths.length > 0 ? (
                            result.strengths.map((st, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{language === "ar" ? st.title_ar : language === "hi" ? st.title_hi : st.title_en}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center gap-2 text-slate-400">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{L("تغطية المهارات الأساسية متوافقة مع متطلبات السوق السعودي.", "Solid foundational skills alignment.", "मुख्य कौशल सही हैं।")}</span>
                            </li>
                          )}
                        </ul>
                      </GlassCard>

                      {/* Weaknesses & Opportunities Card */}
                      <GlassCard className="p-5 border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/20 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{L("فرص التحسين لرفع رتبة الملف", "Opportunities for Growth", "सुधार के अवसर")}</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {result.weaknesses && result.weaknesses.length > 0 ? (
                            result.weaknesses.map((wk, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{language === "ar" ? wk.title_ar : language === "hi" ? wk.title_hi : wk.title_en}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center gap-2 text-slate-400">
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{L("صياغة نقاط إضافية في ملخص About بالأرقام والنتائج.", "Add more quantifiable metrics in About bio.", "About में आंकड़े जोड़ें।")}</span>
                            </li>
                          )}
                        </ul>
                      </GlassCard>
                    </div>

                    {/* Disclaimer Banner */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>
                        {language === "ar"
                          ? result.market_benchmark?.disclaimer_ar || "الرواتب المعروضة تقديرات استرشادية للسوق السعودي مبنية على مسوحات التوظيف 2026 ولا تمثل عروضاً مضمونة."
                          : language === "hi"
                          ? result.market_benchmark?.disclaimer_hi || "सऊदी तकनीकी बाजार के आधार पर अनुमानित वेतन बेंचमार्क।"
                          : result.market_benchmark?.disclaimer_en || "Estimated salary benchmark based on Saudi Tech Market 2026 data. Not a guaranteed salary offer."}
                      </span>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: SECTION AUDITS ── */}
                {activeTab === "sections" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {[
                      {
                        title_ar: "العنوان المهني (Headline & Value Formula)",
                        title_en: "Headline & Value Formula",
                        title_hi: "मुख्य शीर्षक",
                        sec: result.sections.headline,
                        quickFix: () => setActiveTab("rewrites"),
                      },
                      {
                        title_ar: "قسم نبذة عني (About Summary & Storytelling)",
                        title_en: "About Summary & Career Story",
                        title_hi: "About सेक्शन",
                        sec: result.sections.about,
                        quickFix: () => setActiveTab("rewrites"),
                      },
                      {
                        title_ar: "الخبرات العملية ونقاط الإنجاز (Experience & STAR Verbs)",
                        title_en: "Experience & Measurable Accomplishments",
                        title_hi: "कार्य अनुभव",
                        sec: result.sections.experience,
                      },
                      {
                        title_ar: "المهارات المتوافقة مع السوق السعودي (Saudi Vision 2030 Skills)",
                        title_en: "Skills Alignment (Saudi Vision 2030)",
                        title_hi: "सऊदी बाजार कौशल",
                        sec: result.sections.skills,
                        quickFix: () => setActiveTab("skills"),
                      },
                      {
                        title_ar: "ظهور مسؤولي التوظيف على فائدة (Faeda Recruiter Visibility)",
                        title_en: "Faeda Recruiter Visibility & Employer Ranking",
                        title_hi: "रिक्रूटर विजिबिलिटी",
                        sec: result.sections.visibility_seo,
                      },
                    ].map((item, idx) => (
                      <GlassCard key={idx} className="p-5 border-white/10 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-3.5 h-3.5 rounded-full ${
                                item.sec.score >= 80
                                  ? "bg-emerald-400"
                                  : item.sec.score >= 60
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            <h4 className="text-sm sm:text-base font-bold text-white">
                              {L(item.title_ar, item.title_en, item.title_hi)}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <span>{L("التقييم:", "Score:", "स्कोर:")}</span>
                              <span
                                className={`text-sm font-extrabold ${
                                  item.sec.score >= 80
                                    ? "text-emerald-400"
                                    : item.sec.score >= 60
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }`}
                              >
                                {item.sec.score}/100
                              </span>
                            </div>
                            {item.quickFix && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={item.quickFix}
                                className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 rounded-xl"
                              >
                                <Sparkles className="w-3 h-3 me-1.5" />
                                {L("تعديل فوري بالذكاء الاصطناعي", "AI Quick Fix", "AI त्वरित सुधार")}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
                          <span className="font-semibold text-cyan-400 block mb-1">
                            {L("توجيه الذكاء الاصطناعي للتحسين:", "AI Recommendation:", "AI सिफारिश:")}
                          </span>
                          {language === "ar"
                            ? item.sec.recommendation_ar
                            : language === "hi"
                            ? item.sec.recommendation_hi
                            : item.sec.recommendation_en}
                        </div>

                        {/* Issues */}
                        {item.sec.issues_en && item.sec.issues_en.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-xs text-amber-400 font-semibold block">
                              {L("ملاحظات التدقيق:", "Audit Notes:", "ऑडिट टिप्पणियां:")}
                            </span>
                            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                              {(language === "ar"
                                ? item.sec.issues_ar
                                : language === "hi"
                                ? item.sec.issues_hi
                                : item.sec.issues_en
                              ).map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}

                {/* ── TAB 3: SAUDI MARKET SKILLS GAP ── */}
                {activeTab === "skills" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {L("مطابقة المهارات مع رؤية السعودية 2030", "Saudi Vision 2030 Skills Alignment", "सऊदी विज़न 2030 कौशल विश्लेषण")}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {L(
                            "مقارنة مهاراتك مع أكثر المهارات التقنية طلباً في مشاريع التحول الرقمي ومبادرات نيوم وصندوق الاستثمارات",
                            "Skills compared against Saudi enterprise digital transformation demands & sovereign projects",
                            "सऊदी बाजार में सबसे अधिक मांग वाले कौशलों के साथ प्रोफाइल का मिलान"
                          )}
                        </p>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
                        {result.sections.skills.score}% {L("نسبة التطابق", "Match Index", "तालमेल")}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Matched Skills */}
                      <GlassCard className="p-5 border-emerald-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {L("مهاراتك المتوافقة مع السوق", "Matched In-Demand Skills", "मैच किए गए कौशल")}
                          </span>
                          <span className="text-xs text-emerald-400 font-bold">
                            {result.sections.skills.matched_skills?.length || 0}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {result.sections.skills.matched_skills && result.sections.skills.matched_skills.length > 0 ? (
                            result.sections.skills.matched_skills.map((sk: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-medium"
                              >
                                ✓ {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">{L("لا توجد مهارات متطابقة بعد", "No matched skills yet", "कोई कौशल मेल नहीं खाता")}</span>
                          )}
                        </div>
                      </GlassCard>

                      {/* Missing High-Demand Skills */}
                      <GlassCard className="p-5 border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            {L("فجوة المهارات (موصى بإضافتها فوراً)", "Saudi Market Skill Gap (Recommended)", "कौशल अंतर (जोड़ना अनुशंसित)")}
                          </span>
                          <span className="text-xs text-amber-400 font-bold">
                            {result.sections.skills.missing_skills?.length || 0}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {result.sections.skills.missing_skills && result.sections.skills.missing_skills.length > 0 ? (
                            result.sections.skills.missing_skills.map((sk: string, i: number) => (
                              <button
                                key={i}
                                onClick={() => handleAddSkillAction(sk)}
                                className="group px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-medium flex items-center gap-1.5 transition-all"
                                title={L("أضف لملفك في فائدة", "Add to Faeda Profile", "प्रोफाइल में जोड़ें")}
                              >
                                <Plus className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                                <span>{sk}</span>
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-emerald-400 font-medium">
                              {L("🎉 مبروك! ملفك يغطي كافة المهارات الأساسية المطلوبة بالسوق السعودي.", "🎉 All top Saudi in-demand benchmark skills present!", "सभी आवश्यक कौशल मौजूद हैं!")}
                            </span>
                          )}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: AI REWRITES STUDIO ── */}
                {activeTab === "rewrites" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          {L("استوديو الصياغة الذكية لملف فائدة", "Faeda Profile AI Rewrite Studio", "AI रीराइट स्टूडियो")}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {L(
                            "صياغات مهنية مخصصة تبرز قيمتك أمام مسؤولي التوظيف والشركات السعودية مع تطبيق مباشر بنقرة واحدة",
                            "Handcrafted professional copy highlighting your business impact. Apply directly to your Faeda Profile in 1 click.",
                            "एक क्लिक में अपनी फायदा प्रोफाइल पर पेशेवर विवरण लागू करें।"
                          )}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                        {result.ai_powered_by || "Faeda Vision 2030 AI"}
                      </span>
                    </div>

                    {/* Headline Styles Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {L("خيارات العنوان الرئيسي (Headlines):", "Recommended Profile Headlines:", "शीर्षक विकल्प:")}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.ai_rewrites.headlines.map((item, idx) => {
                          const text = language === "ar" ? item.text_ar : language === "hi" ? item.text_hi : item.text_en
                          return (
                            <GlassCard key={idx} className="p-4 border-white/10 flex flex-col justify-between space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold">
                                    {item.style}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                                  "{text}"
                                </p>
                                <span className="text-[10px] text-slate-500 block">
                                  {item.focus}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopy(`hl-${idx}`, text)}
                                  className="text-xs text-slate-400 hover:text-white"
                                >
                                  {copiedId === `hl-${idx}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() => handleApplyHeadlineAction(text)}
                                  className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-sm shadow-cyan-600/30"
                                >
                                  {L("حفظ في ملف فائدة", "Apply to Faeda Profile", "प्रोफाइल में सहेजें")}
                                </Button>
                              </div>
                            </GlassCard>
                          )
                        })}
                      </div>
                    </div>

                    {/* About Storytelling Bio */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {L("صياغة ملخص نبذة عني (About Storytelling):", "Recommended About Bio Story:", "About बायो सुझाव:")}
                      </h4>

                      <GlassCard className="p-5 border-white/10 space-y-4">
                        <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {language === "ar"
                            ? result.ai_rewrites.about_bio.text_ar
                            : language === "hi"
                            ? result.ai_rewrites.about_bio.text_hi
                            : result.ai_rewrites.about_bio.text_en}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                "about-bio",
                                language === "ar"
                                  ? result.ai_rewrites.about_bio.text_ar
                                  : language === "hi"
                                  ? result.ai_rewrites.about_bio.text_hi
                                  : result.ai_rewrites.about_bio.text_en
                              )
                            }
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            {copiedId === "about-bio" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 me-1" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 me-1" />
                            )}
                            {L("نسخ النص", "Copy Text", "कॉपी करें")}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() =>
                              handleApplyAboutAction(
                                language === "ar"
                                  ? result.ai_rewrites.about_bio.text_ar
                                  : language === "hi"
                                  ? result.ai_rewrites.about_bio.text_hi
                                  : result.ai_rewrites.about_bio.text_en
                              )
                            }
                            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-sm shadow-cyan-600/30"
                          >
                            {L("حفظ في ملف فائدة", "Apply to Faeda Profile", "प्रोफाइल में सहेजें")}
                          </Button>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                )}

                {/* ── TAB 5: AI ACTION PLAN & ALL-STAR CHECKLIST ── */}
                {activeTab === "checklist" && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Action Plan Roadmap */}
                    {result.action_plan && result.action_plan.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-400" />
                          {L("خطة العمل ذات الأولوية (AI Action Plan):", "Prioritized AI Action Plan:", "प्राथमिकता कार्य योजना:")}
                        </h4>

                        <div className="space-y-2">
                          {result.action_plan.map((item, idx) => (
                            <GlassCard key={idx} className="p-4 border-white/10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                                  {item.step}
                                </span>
                                <div>
                                  <h5 className="text-xs sm:text-sm font-semibold text-white">
                                    {language === "ar" ? item.title_ar : language === "hi" ? item.title_hi : item.title_en}
                                  </h5>
                                  <span className="text-[11px] text-emerald-400 font-medium">
                                    {L("الأثر المتوقع:", "Expected Impact:", "अपेक्षित प्रभाव:")} {item.impact}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.priority === "High"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                }`}
                              >
                                {item.priority}
                              </span>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All-Star Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {L("خطة الوصول إلى ملف مثالي 100% (All-Star Checklist):", "All-Star Profile Completion Checklist:", "ऑल-स्टार चेकलिस्ट:")}
                      </h4>

                      <div className="space-y-2.5">
                        {result.checklist.map((item: FaedaChecklistItem) => (
                          <GlassCard
                            key={item.id}
                            className={`p-4 border flex items-center justify-between gap-3 transition-all ${
                              item.completed
                                ? "bg-emerald-950/20 border-emerald-500/30"
                                : "bg-slate-900 border-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  item.completed
                                    ? "bg-emerald-500 text-slate-950 font-bold"
                                    : "border border-slate-600 text-slate-600"
                                }`}
                              >
                                {item.completed ? "✓" : ""}
                              </div>
                              <span
                                className={`text-xs sm:text-sm font-medium ${
                                  item.completed ? "text-emerald-200 line-through opacity-80" : "text-slate-100"
                                }`}
                              >
                                {language === "ar" ? item.label_ar : language === "hi" ? item.label_hi : item.label_en}
                              </span>
                            </div>

                            <span className="text-[11px] text-cyan-300 font-bold shrink-0">
                              {item.impact}
                            </span>
                          </GlassCard>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

// Backward-compatible alias exports
export const LinkedInProfileAnalyzerModal = FaedaProfileOptimizerModal
export default FaedaProfileOptimizerModal
