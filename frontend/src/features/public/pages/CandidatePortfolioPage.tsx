/**
 * features/public/pages/CandidatePortfolioPage.tsx
 *
 * Comprehensive public candidate portfolio page (/portfolio/:username).
 * Provides a showcase of candidate achievements, verified skills, projects,
 * certifications, and direct contact options for recruiters and companies.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Download,
  Share2,
  GraduationCap,
  Award,
  Code2,
  Globe2,
  Send,
  Building,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Calendar,
  Lock,
  Edit3,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { portfolioService } from "../services/portfolio.service"
import type { CandidatePublicPortfolio, CandidateContactPayload } from "../types/portfolio.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import { getLocalizedPortfolio } from "@/lib/localization.utils"
import toast from "react-hot-toast"



export function CandidatePortfolioPage() {
  const { username } = useParams<{ username: string }>()
  const { language, isRTL } = useTranslation()
  const { user } = useAuthStore()

  const [portfolio, setPortfolio] = useState<CandidatePublicPortfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "skills" | "credentials">("overview")
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)

  // Inquiry Form State
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [opportunityType, setOpportunityType] = useState<"full_time" | "part_time" | "contract" | "team_invite" | "inquiry">("full_time")

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft

  useEffect(() => {
    let isMounted = true
    async function fetchPortfolio() {
      if (!username) return
      setIsLoading(true)
      try {
        const data = await portfolioService.getCandidatePortfolio(username)
        if (isMounted) setPortfolio(data)
      } catch {
        if (isMounted) setPortfolio(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchPortfolio()
    return () => {
      isMounted = false
    }
  }, [username])

  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success(
        language === "ar"
          ? "تم نسخ رابط المعرض المهني إلى الحافظة!"
          : language === "hi"
          ? "पोर्टफोलियो लिंक कॉपी कर लिया गया!"
          : "Portfolio link copied to clipboard!"
      )
    }
  }

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!portfolio) return
    if (!senderName || !senderEmail || !message) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع الحقول الإلزامية"
          : language === "hi"
          ? "कृपया सभी आवश्यक फ़ील्ड भरें"
          : "Please fill in all required fields"
      )
      return
    }

    setIsSubmittingInquiry(true)
    try {
      const payload: CandidateContactPayload = {
        candidateId: portfolio.id,
        senderName,
        senderEmail,
        companyName,
        subject: subject || (language === "ar" ? "فرصة مهنية عبر منصة فائدة" : "Career Opportunity via Faeda"),
        message,
        opportunityType,
      }
      const res = await portfolioService.sendCandidateInquiry(payload)
      toast.success(
        res.message ||
          (language === "ar"
            ? "تم إرسال رسالتك وعرضك للمرشح بنجاح!"
            : language === "hi"
            ? "उम्मीदवार को संदेश सफलतापूर्वक भेजा गया!"
            : "Opportunity sent successfully!")
      )
      setIsContactModalOpen(false)
      setMessage("")
      setSubject("")
    } catch {
      toast.error(language === "ar" ? "تعذر الإرسال حالياً. حاول ثانية." : "Failed to send inquiry.")
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-pulse text-start">
        <div className="h-6 w-48 bg-white/10 rounded-lg mb-6" />
        <div className="h-72 w-full bg-card/60 rounded-3xl border border-white/5" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card/40 rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="h-96 w-full bg-card/30 rounded-3xl border border-white/5" />
      </div>
    )
  }

  // Private profile state
  if (portfolio?.isPrivate) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {language === "ar" ? "هذا الملف المهني خاص" : "Private Portfolio"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {portfolio.message ||
              (language === "ar"
                ? "قام المرشح بضبط خصوصية ملفه على الوضع الخاص بناءً على رغبته."
                : "The candidate has set their profile visibility to private.")}
          </p>
          <Link to={ROUTES.JOBS.LIST}>
            <Button className="rounded-xl px-6 bg-primary text-white font-bold text-sm mt-3">
              {language === "ar" ? "تصفح الفرص المتاحة" : "Browse Opportunities"}
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  // Not found fallback
  if (!portfolio) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            {language === "ar" ? "لم يتم العثور على المرشح" : "Candidate Not Found"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "ar"
              ? "المعرض المهني المطلوب غير موجود أو ربما تم تغيير اسم المستخدم."
              : "The requested candidate portfolio could not be found."}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to={ROUTES.PUBLIC.HOME}>
              <Button className="rounded-xl px-6 bg-primary text-white font-bold text-sm">
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const isOwner = Boolean(portfolio.isOwner || (user && String(user.id) === String(portfolio.id)))
  const currentPortfolio = getLocalizedPortfolio(portfolio, language)

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 relative selection:bg-primary/30">
      {/* Background ambient lighting */}
      <div className="absolute top-20 start-1/4 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-80 end-1/4 w-[500px] h-[300px] bg-sky-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 text-start space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-white transition-colors">
            {language === "ar" ? "الرئيسية" : language === "hi" ? "मुख्य पृष्ठ" : "Home"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <span className="text-primary font-medium">
            {language === "ar" ? "المعرض المهني" : language === "hi" ? "उम्मीदवार पोर्टफोलियो" : "Candidate Portfolio"}
          </span>
          <ChevronIcon className="w-4 h-4 text-white/20" />
          <span className="text-white font-bold truncate max-w-[200px]">{currentPortfolio.fullName}</span>
        </nav>

        {/* ── Hero Profile Card ────────────────────────────────────── */}
        <GlassCard className="relative overflow-hidden bg-card/60 border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
          {/* Top Banner Gradient Mesh */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-primary/30 via-sky-600/20 to-primary/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-10 sm:pt-14">
            
            {/* Left/Start: Avatar & Core Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/20 bg-card shadow-xl ring-4 ring-primary/20">
                  {currentPortfolio.avatarUrl ? (
                    <img
                      src={currentPortfolio.avatarUrl}
                      alt={currentPortfolio.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/40 to-sky-700/30 text-white text-3xl font-extrabold font-heading">
                      {currentPortfolio.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                {currentPortfolio.isVerified && (
                  <div
                    title={language === "ar" ? "مرشح موثق الهوية والمهارات" : language === "hi" ? "सत्यापित पेशेवर" : "Verified Professional"}
                    className="absolute -bottom-2 -end-2 w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center text-white shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-white text-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                    {currentPortfolio.fullName}
                  </h1>
                  {currentPortfolio.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold">
                      <Sparkles className="w-3 h-3" />
                      {language === "ar" ? "موثق منصة فائدة" : language === "hi" ? "सत्यापित प्रतिभा" : "Verified Talent"}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-medium text-sky-200/90 max-w-2xl leading-relaxed">
                  {currentPortfolio.title || currentPortfolio.headline}
                </p>

                {/* Badges / Meta strip */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  {currentPortfolio.location && (
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {currentPortfolio.location}
                    </span>
                  )}
                  {currentPortfolio.experienceYears && (
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {currentPortfolio.experienceYears}
                    </span>
                  )}
                  {currentPortfolio.workStyle && (
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      {currentPortfolio.workStyle}
                    </span>
                  )}
                  {currentPortfolio.workType && (
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                      {currentPortfolio.workType}
                    </span>
                  )}
                </div>
              </div>
            </div>


            {/* Right/End: Quick Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto shrink-0 pt-4 md:pt-0">
              {isOwner ? (
                <Link to={ROUTES.CANDIDATE.PROFILE}>
                  <Button className="rounded-xl px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Edit3 className="w-4 h-4" />
                    <span>{language === "ar" ? "تعديل ملفي المهني" : language === "hi" ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="rounded-xl px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === "ar" ? "تقديم عرض وظيفي / تواصل" : language === "hi" ? "नौकरी का प्रस्ताव / संपर्क" : "Send Opportunity"}</span>
                </Button>
              )}

              {currentPortfolio.cvUrl && (
                <a
                  href={currentPortfolio.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>{language === "ar" ? "السيرة الذاتية (CV)" : language === "hi" ? "सीवी डाउनलोड (CV)" : "Download CV"}</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleShare}
                aria-label={language === "ar" ? "مشاركة الرابط" : language === "hi" ? "पोर्टफोलियो शेयर करें" : "Share Portfolio"}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </GlassCard>

        {/* ── Key Highlights / Metric Cards ────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard className="p-5 bg-card/40 border-white/5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ar" ? "سنوات الخبرة" : language === "hi" ? "कार्य अनुभव" : "Experience"}</p>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">{currentPortfolio.experienceYears || (language === "ar" ? "3+ سنوات" : language === "hi" ? "3+ वर्ष" : "3+ Years")}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-5 bg-card/40 border-white/5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ar" ? "مشاريع معتمدة" : language === "hi" ? "सत्यापित प्रोजेक्ट्स" : "Projects"}</p>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">{currentPortfolio.stats?.projectsCount || currentPortfolio.projects?.length || 0}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-5 bg-card/40 border-white/5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ar" ? "شهادات مهنية" : language === "hi" ? "व्यावसायिक प्रमाणपत्र" : "Certifications"}</p>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-white">{currentPortfolio.stats?.certificationsCount || currentPortfolio.certifications?.length || 0}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-5 bg-card/40 border-white/5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ar" ? "مؤشر ATS المعتمد" : language === "hi" ? "एटीएस स्कोर" : "ATS Score"}</p>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-emerald-400">{currentPortfolio.atsScore || 90}%</h3>
            </div>
          </GlassCard>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: language === "ar" ? "نظرة عامة والنبذة" : language === "hi" ? "अवलोकन और सारांश" : "Overview" },
            { id: "projects", label: `${language === "ar" ? "المشاريع والأعمال" : language === "hi" ? "प्रोजेक्ट्स और कार्य" : "Projects"} (${currentPortfolio.projects?.length || 0})` },
            { id: "skills", label: `${language === "ar" ? "المهارات واللغات" : language === "hi" ? "कौशल और भाषाएँ" : "Skills"} (${currentPortfolio.skills?.length || 0})` },
            { id: "credentials", label: `${language === "ar" ? "الشهادات والتعليم" : language === "hi" ? "प्रमाणपत्र और शिक्षा" : "Credentials"} (${currentPortfolio.certifications?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10 border border-primary/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="portfolio-tab-active"
                  className="absolute bottom-0 inset-x-2 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content Views ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Executive Summary */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl space-y-4">
                <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  <span>{language === "ar" ? "النبذة المهنية والملخص التنفيذي" : language === "hi" ? "व्यावसायिक सारांश और विवरण" : "About & Career Summary"}</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {currentPortfolio.about || (language === "ar" ? "لم تتم إضافة نبذة بعد." : language === "hi" ? "अभी तक कोई विवरण नहीं जोड़ा गया है।" : "No biography provided yet.")}
                </p>
              </GlassCard>

              {/* Work Preferences Box */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl">
                <h3 className="text-base font-bold font-heading text-white mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-400" />
                  <span>{language === "ar" ? "تفضيلات العمل والاستقطاب" : language === "hi" ? "कार्य प्राथमिकताएँ" : "Work Preferences"}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-muted-foreground block mb-1">{language === "ar" ? "المجال المفضل" : language === "hi" ? "पसंदीदा क्षेत्र" : "Target Role"}</span>
                    <span className="font-bold text-white">{currentPortfolio.preferredField || (language === "ar" ? "تقنية المعلومات" : language === "hi" ? "सूचना प्रौद्योगिकी" : "Information Technology")}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-muted-foreground block mb-1">{language === "ar" ? "طبيعة الدوام" : language === "hi" ? "कार्य का प्रकार" : "Work Model"}</span>
                    <span className="font-bold text-white">{currentPortfolio.workStyle || (language === "ar" ? "هجين / عن بُعد" : language === "hi" ? "हाइब्रिड / रिमोट" : "Hybrid / Remote")}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-muted-foreground block mb-1">{language === "ar" ? "نظام التعاقد" : language === "hi" ? "अनुबंध का प्रकार" : "Contract Type"}</span>
                    <span className="font-bold text-white">{currentPortfolio.workType || (language === "ar" ? "دوام كامل" : language === "hi" ? "पूर्णकालिक" : "Full-Time")}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Featured Projects Preview */}
              {currentPortfolio.projects && currentPortfolio.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      <span>{language === "ar" ? "أبرز الأعمال والمشاريع" : language === "hi" ? "प्रमुख कार्य और प्रोजेक्ट्स" : "Featured Projects"}</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-xs sm:text-sm text-primary font-bold hover:underline"
                    >
                      {language === "ar" ? "عرض جميع المشاريع" : language === "hi" ? "सभी प्रोजेक्ट्स देखें" : "View All"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPortfolio.projects.slice(0, 2).map((proj) => (
                      <GlassCard
                        key={proj.id}
                        className="p-6 bg-card/40 border-white/5 hover:border-primary/30 rounded-2xl flex flex-col justify-between transition-all"
                      >
                        <div className="space-y-3">
                          <h4 className="text-base font-bold text-white">{proj.project_name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>
                        {proj.project_url && (
                          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-primary font-bold">{language === "ar" ? "رابط المشروع" : language === "hi" ? "प्रोजेक्ट लिंक" : "Project Link"}</span>
                            <a
                              href={proj.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-primary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div
              key="tab-projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {currentPortfolio.projects && currentPortfolio.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPortfolio.projects.map((proj) => (
                    <GlassCard
                      key={proj.id}
                      className="p-6 sm:p-7 bg-card/40 border-white/5 hover:border-primary/40 rounded-2xl flex flex-col justify-between group transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                            <Code2 className="w-4 h-4" />
                          </span>
                          {proj.created_at && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(proj.created_at).toLocaleDateString(language === "ar" ? "ar-SA" : language === "hi" ? "hi-IN" : "en-US", { year: "numeric", month: "short" })}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-primary transition-colors">
                          {proj.project_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {proj.description}
                        </p>
                      </div>

                      {proj.project_url && (
                        <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{language === "ar" ? "معاينة المشروع / الكود" : language === "hi" ? "लाइव देखें / कोड" : "View Live / Repo"}</span>
                          <a
                            href={proj.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors"
                          >
                            <span>{language === "ar" ? "زيارة" : language === "hi" ? "देखें" : "Visit"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground bg-card/20 rounded-2xl border border-white/5">
                  <p>{language === "ar" ? "لم يقم المرشح بإضافة مشاريع بعد." : language === "hi" ? "उम्मीदवार ने अभी तक कोई प्रोजेक्ट नहीं जोड़ा है।" : "No projects published yet."}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="tab-skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Technical Skills */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <span>{language === "ar" ? "المهارات والتقنيات الأساسية" : language === "hi" ? "मुख्य तकनीकी कौशल" : "Core Technical Skills"}</span>
                </h3>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {currentPortfolio.skills && currentPortfolio.skills.length > 0 ? (
                    currentPortfolio.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/30 text-slate-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{language === "ar" ? "لا توجد مهارات مسجلة." : language === "hi" ? "कोई कौशल सूचीबद्ध नहीं है।" : "No skills listed."}</p>
                  )}
                </div>
              </GlassCard>

              {/* Languages */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-sky-400" />
                  <span>{language === "ar" ? "اللغات والتواصل" : language === "hi" ? "भाषाएँ और संचार" : "Languages"}</span>
                </h3>
                <div className="flex flex-wrap gap-3 pt-2">
                  {currentPortfolio.languages && currentPortfolio.languages.length > 0 ? (
                    currentPortfolio.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-500/10 border border-sky-500/20 text-sky-300"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">{language === "ar" ? "العربية" : language === "hi" ? "अरबी" : "Arabic"}</span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "credentials" && (
            <motion.div
              key="tab-credentials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Education Background */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span>{language === "ar" ? "المؤهل العلمي والتعليم" : language === "hi" ? "शैक्षणिक योग्यता और शिक्षा" : "Education & Academic Background"}</span>
                </h3>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-base font-bold text-white">
                      {currentPortfolio.education?.qualification || (language === "ar" ? "المؤهل الجامعي" : language === "hi" ? "विश्वविद्यालय डिग्री" : "Degree")}
                    </h4>
                    {currentPortfolio.education?.graduationDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {currentPortfolio.education.graduationDate}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sky-300 font-medium">
                    {[currentPortfolio.education?.university, currentPortfolio.education?.department].filter(Boolean).join(" - ")}
                  </p>
                  {currentPortfolio.education?.gpa && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {language === "ar" ? "المعدل التراكمي:" : language === "hi" ? "जीपीए (GPA):" : "GPA:"} <span className="text-white font-bold">{currentPortfolio.education.gpa}</span>
                    </p>
                  )}
                </div>
              </GlassCard>

              {/* Certifications */}
              <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/5 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>{language === "ar" ? "الشهادات والاعتمادات المهنية" : language === "hi" ? "प्रमाणपत्र और व्यावसायिक साख" : "Certifications & Credentials"}</span>
                </h3>

                {currentPortfolio.certifications && currentPortfolio.certifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPortfolio.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/30 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-sm sm:text-base font-bold text-white">{cert.cert_name}</h4>
                          <p className="text-xs text-sky-300">{cert.issuing_org}</p>
                          {cert.credential_id && (
                            <p className="text-[11px] font-mono text-muted-foreground pt-1">
                              ID: {cert.credential_id}
                            </p>
                          )}
                        </div>
                        {cert.credential_url && (
                          <div className="pt-3 mt-3 border-t border-white/5 flex justify-end">
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>{language === "ar" ? "التحقق من الشهادة" : language === "hi" ? "प्रमाणपत्र सत्यापित करें" : "Verify Credential"}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{language === "ar" ? "لا توجد شهادات مسجلة." : language === "hi" ? "कोई प्रमाणपत्र नहीं जोड़ा गया है।" : "No certifications added."}</p>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Direct Contact / Opportunity Modal ────────────────────── */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0F2247] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-start"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-5 end-5 p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold font-heading text-white">
                  {language === "ar"
                    ? `تقديم فرصة أو رسالة إلى ${currentPortfolio.fullName}`
                    : language === "hi"
                    ? `${currentPortfolio.fullName} को अवसर या संदेश भेजें`
                    : `Contact ${currentPortfolio.fullName}`}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === "ar"
                    ? "أرسل تفاصيل الفرصة الوظيفية أو التعاون المشترك مباشرة إلى المرشح."
                    : language === "hi"
                    ? "नौकरी के अवसर या सहयोग का विवरण सीधे उम्मीदवार को भेजें।"
                    : "Send details about an opportunity or collaborative role."}
                </p>
              </div>

              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "اسمك / جهة الاتصال *" : language === "hi" ? "आपका नाम / संपर्क *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={language === "ar" ? "مثال: م. فهد العلي" : language === "hi" ? "उदा: राहुल शर्मा" : "Your name"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "بريدك الإلكتروني *" : language === "hi" ? "आपका ईमेल *" : "Your Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="hr@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "اسم الشركة / المؤسسة" : language === "hi" ? "कंपनी का नाम" : "Company"}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={language === "ar" ? "اسم شركتك" : language === "hi" ? "आपकी कंपनी" : "Company name"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      {language === "ar" ? "نوع العرض" : language === "hi" ? "अवसर का प्रकार" : "Type"}
                    </label>
                    <select
                      value={opportunityType}
                      onChange={(e) => setOpportunityType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#081628] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="full_time">{language === "ar" ? "وظيفة دوام كامل" : language === "hi" ? "पूर्णकालिक नौकरी (Full-Time)" : "Full-Time Job"}</option>
                      <option value="contract">{language === "ar" ? "مشروع تعاقدي / استشاري" : language === "hi" ? "अनुबंध परियोजना / सलाहकार" : "Contract Project"}</option>
                      <option value="team_invite">{language === "ar" ? "دعوة للانضمام إلى فريق" : language === "hi" ? "टीम में शामिल होने का निमंत्रण" : "Team Invitation"}</option>
                      <option value="inquiry">{language === "ar" ? "استفسار مهني عام" : language === "hi" ? "सामान्य पूछताछ" : "General Inquiry"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {language === "ar" ? "عنوان الفرصة / الموضوع" : language === "hi" ? "विषय / पद शीर्षक" : "Subject"}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={language === "ar" ? "مثال: فرصة مهندس برمجيات أول بالرياض" : language === "hi" ? "उदा: वरिष्ठ सॉफ्टवेयर इंजीनियर अवसर" : "E.g. Senior Software Engineer role"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {language === "ar" ? "تفاصيل الرسالة أو العرض *" : language === "hi" ? "संदेश या विवरण *" : "Message details *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === "ar" ? "صف بإيجاز طبيعة الفرصة والمزايا المقترحة..." : language === "hi" ? "अवसर के विवरण और लाभों का संक्षेप में वर्णन करें..." : "Describe the role, timeline, and expectations..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsContactModalOpen(false)}
                    className="rounded-xl border-white/10 text-xs sm:text-sm"
                  >
                    {language === "ar" ? "إلغاء" : language === "hi" ? "रद्द करें" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="rounded-xl bg-primary text-white font-bold text-xs sm:text-sm px-6 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmittingInquiry
                        ? (language === "ar" ? "جارٍ الإرسال..." : language === "hi" ? "भेजा जा रहा है..." : "Sending...")
                        : (language === "ar" ? "إرسال العرض الآن" : language === "hi" ? "अभी भेजें" : "Send Now")}
                    </span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default CandidatePortfolioPage
