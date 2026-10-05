/**
 * features/public/pages/PostsPage.tsx
 *
 * Career Articles, Research & Insights Hub (/posts).
 * Features multi-account segregation:
 * - 🏛️ Universities: Research papers, Job fairs, Academic achievements, Innovations, International awards
 * - 🏢 Companies: General candidate search, Specialized roles, Brand image & culture, Talent pool, Team spotlight, Innovations, Thought leadership
 * - 👤 Job Seekers: Projects & portfolio showcase, Open to work, Certifications & milestones, Career tips
 *
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  PlusCircle,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Eye,
  GraduationCap,
  Building2,
  UserCheck,
  Award,
  Globe,
  Filter,
  Target,
  Video,
  ExternalLink,
  Bookmark,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "../services/posts.service"
import { CampaignCreateWizardModal } from "../components/CampaignCreateWizardModal"
import { CampaignCardActions } from "../components/CampaignCardActions"
import { CampaignShareModal } from "../components/CampaignShareModal"
import { CampaignAnalyticsModal } from "../components/CampaignAnalyticsModal"
import { CampaignCommentsModal } from "../components/CampaignCommentsModal"
import { useAuthStore } from "@/store/auth.store"
import {
  ACCOUNT_POST_TYPES,
  type PostArticle,
  type TrendingTopic,
  type SuggestedAuthor,
  type CreatePostDTO,
  type AccountType,
} from "../types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import {
  getLocalizedPost,
  getLocalizedAccountType,
  getLocalizedPostType,
} from "@/lib/localization.utils"
import toast from "react-hot-toast"

export function PostsPage() {
  const { language } = useTranslation()
  const { user, login } = useAuthStore()

  // Detected Account Persona (University, Company, Job Seeker)
  const userRole = user?.role
  const initialRole: "university" | "company" | "candidate" =
    userRole === "university" ? "university" : userRole === "candidate" ? "candidate" : "company"
  const [activePersonaRole, setActivePersonaRole] = useState<"university" | "company" | "candidate">(initialRole)

  const [posts, setPosts] = useState<PostArticle[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedAuthors, setSuggestedAuthors] = useState<SuggestedAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Account Type Filter & Sub-category Post Type
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>("all")
  const [selectedPostType, setSelectedPostType] = useState<string>("all")

  // Targeted Audience Filters ("Relevant Users See the Campaign")
  const [isForYouActive, setIsForYouActive] = useState(false)
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<string>("all")

  // Saved Campaigns tab view
  const [isSavedViewActive, setIsSavedViewActive] = useState(false)

  // Interaction Modals
  const [shareModalPost, setShareModalPost] = useState<PostArticle | null>(null)
  const [commentsModalPost, setCommentsModalPost] = useState<PostArticle | null>(null)
  const [analyticsModalPost, setAnalyticsModalPost] = useState<PostArticle | null>(null)

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "likes">("newest")

  // Create Campaign Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  // 1-Click Persona Simulator
  const handleSwitchPersona = (role: "university" | "company" | "candidate") => {
    setActivePersonaRole(role)
    if (role === "university") {
      login(
        { id: "1", email: "kfu@kfu.edu.sa", name: "جامعة الملك فيصل", role: "university" },
        "demo-university-token"
      )
    } else if (role === "company") {
      login(
        { id: "2", email: "contact@aramcodigital.com", name: "أرامكو الرقمية (Aramco Digital)", role: "company" },
        "demo-company-token"
      )
    } else {
      login(
        { id: "1", email: "ahmed@example.com", name: "أحمد بن خالد المالكي", role: "candidate" },
        "demo-candidate-token"
      )
    }
    toast.success(
      language === "ar"
        ? `تم التحقق وتفعيل حساب: ${
            role === "university"
              ? "جامعة الملك فيصل (جامعة)"
              : role === "company"
              ? "أرامكو الرقمية (شركة)"
              : "أحمد المالكي (باحث عن عمل)"
          }`
        : `Switched active account to: ${role}`
    )
  }

  // When changing account type filter on feed, reset sub-type
  const handleAccountTabClick = (acc: AccountType) => {
    setSelectedAccountType(acc)
    setSelectedPostType("all")
  }

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        if (isSavedViewActive) {
          const res = await postsService.getSavedPosts()
          if (isMounted) {
            setPosts(res.posts || [])
          }
        } else {
          const targetAudienceRole = isForYouActive
            ? activePersonaRole
            : targetAudienceFilter !== "all"
            ? targetAudienceFilter
            : undefined

          const res = await postsService.getPosts({
            search: searchQuery,
            category: selectedCategory,
            accountType: selectedAccountType,
            postType: selectedPostType,
            targetAudienceRole,
            sort: sortBy,
          })
          if (isMounted) {
            setPosts(res.posts)
            if (res.trendingTopics) setTrendingTopics(res.trendingTopics)
            if (res.suggestedAuthors) setSuggestedAuthors(res.suggestedAuthors)
          }
        }
      } catch {
        if (isMounted) setPosts([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedAccountType,
    selectedPostType,
    isForYouActive,
    isSavedViewActive,
    activePersonaRole,
    targetAudienceFilter,
    sortBy,
  ])

  const handleCampaignCreated = (newPostDto: CreatePostDTO) => {
    postsService.createPost(newPostDto).then((res) => {
      setPosts((prev) => [res.post, ...prev])
    })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes("@")) return
    setIsSubscribed(true)
    toast.success(
      language === "ar"
        ? "شكراً لاشتراكك! ستصلك أحدث المقالات أسبوعياً."
        : language === "hi"
        ? "सदस्यता लेने के लिए धन्यवाद! आपको साप्ताहिक लेख प्राप्त होंगे।"
        : "Thank you for subscribing to Faeda Insights!"
    )
    setNewsletterEmail("")
  }

  // Localize posts dynamically
  const localizedPosts = posts.map((p) => getLocalizedPost(p, language))
  const featuredPost = localizedPosts[0]
  const feedPosts = localizedPosts.slice(1)

  // Account Type configuration options
  const accountTabs = [
    {
      key: "all" as AccountType,
      label: language === "ar" ? "جميع الحسابات" : language === "hi" ? "सभी खाते" : "All Accounts",
      icon: Globe,
      color: "from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-400",
    },
    {
      key: "university" as AccountType,
      label: language === "ar" ? "الجامعات" : language === "hi" ? "विश्वविद्यालय" : "Universities",
      icon: GraduationCap,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      description: language === "ar" ? "أبحاث، معارض، ابتكارات وجوائز" : language === "hi" ? "शोध, मेले, नवाचार" : "Research, job fairs & patents",
    },
    {
      key: "company" as AccountType,
      label: language === "ar" ? "الشركات والمنشآت" : language === "hi" ? "कंपनियां" : "Companies",
      icon: Building2,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
      description: language === "ar" ? "استقطاب، هوية، وقاعدة مواهب" : language === "hi" ? "भर्ती, ब्रांड और टैलेंट पूल" : "Hiring, culture & talent community",
    },
    {
      key: "candidate" as AccountType,
      label: language === "ar" ? "الباحثون عن عمل" : language === "hi" ? "नौकरी चाहने वाले" : "Job Seekers",
      icon: UserCheck,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      description: language === "ar" ? "مشاريع، متاح للعمل، وشهادات" : language === "hi" ? "प्रोजेक्ट्स, उपलब्धता, प्रमाणपत्र" : "Portfolios, open-to-work & certifications",
    },
  ]

  // Available sub-categories / post types based on active account type
  const activeSubtypes = useMemo(() => {
    if (selectedAccountType === "all") return []
    return ACCOUNT_POST_TYPES[selectedAccountType] || []
  }, [selectedAccountType])

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 relative selection:bg-primary/30">
      {/* Background Glows */}
      <div className="absolute top-20 start-1/3 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 end-1/4 w-[500px] h-[300px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-start space-y-8">

        {/* ── Active Account Verification & Testing Bar ─────────────── */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-card/90 via-primary/10 to-card/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/20 text-secondary border border-primary/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">
                  {language === "ar" ? "الحساب النشط المسجل حالياً:" : "Current Active Session:"}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-primary/30 text-secondary border border-primary/40">
                  {activePersonaRole === "university"
                    ? language === "ar"
                      ? "🏛️ جامعة (جامعة الملك فيصل)"
                      : "🏛️ University"
                    : activePersonaRole === "company"
                    ? language === "ar"
                      ? "🏢 شركة (أرامكو الرقمية)"
                      : "🏢 Company"
                    : language === "ar"
                    ? "👤 باحث عن عمل (أحمد المالكي)"
                    : "👤 Job Seeker"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {language === "ar"
                  ? "يتم فحص نوع الحساب آلياً لتحميل فئات الحملات المخصصة وتوجيه المنشورات للجمهور المستهدف."
                  : "Account type is automatically verified to load role-specific campaign categories and targeted feeds."}
              </p>
            </div>
          </div>

          {/* Quick Simulation Switches */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs font-bold">
            <span className="text-[11px] text-muted-foreground px-2 hidden sm:inline">
              {language === "ar" ? "تبديل الحساب للتجربة:" : "Switch persona to test:"}
            </span>
            <button
              type="button"
              onClick={() => handleSwitchPersona("university")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activePersonaRole === "university"
                  ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "جامعة" : "University"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPersona("company")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activePersonaRole === "company"
                  ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "شركة" : "Company"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPersona("candidate")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activePersonaRole === "candidate"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "باحث عن عمل" : "Job Seeker"}</span>
            </button>
          </div>
        </div>

        {/* ── Page Header & Action CTA ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === "ar"
                  ? "مجتمع فائدة للمحتوى المهني والأكاديمي والتوظيفي"
                  : language === "hi"
                  ? "फायदा व्यावसायिक, अकादमिक और भर्ती सामग्री समुदाय"
                  : "Faeda Career, Academic & Recruitment Content Hub"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {language === "ar"
                ? "المقالات، الأبحاث، ورؤى المنظومة"
                : language === "hi"
                ? "लेख, शोध और उद्योग अंतर्दृष्टि"
                : "Articles, Research & Ecosystem Insights"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "منصة محتوى متخصصة مقسمة حسب الحساب: أبحاث ومعارض الجامعات، حملات واستقطاب الشركات وهوية بيئة العمل، واستعراض مشاريع وجاهزية الكفاءات والباحثين عن عمل."
                : language === "hi"
                ? "खाता प्रकार के अनुसार विभाजित सामग्री: विश्वविद्यालय शोध व रोजगार मेले, कंपनी भर्ती अभियान व संस्कृति, और नौकरी चाहने वालों के प्रोजेक्ट और कौशल प्रदर्शन।"
                : "Segmented ecosystem feed: University research & job fairs, Company hiring campaigns & culture branding, and Job Seeker project portfolios & availability."}
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-2xl px-6 py-3.5 bg-gradient-to-r from-primary to-emerald-500 hover:opacity-95 text-white font-black text-sm flex items-center gap-2.5 shadow-xl shadow-primary/25 hover:scale-[1.02] transition-transform shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {language === "ar"
                ? "إطلاق ونشر حملة ذكية 🚀"
                : "Launch Targeted Campaign 🚀"}
            </span>
          </Button>
        </div>

        {/* ── Account Type Switcher Bar (University / Company / Job Seeker) ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-primary" />
              {language === "ar"
                ? "تصفح حسب نوع الحساب والمنظومة"
                : language === "hi"
                ? "खाते के प्रकार के आधार पर ब्राउज़ करें"
                : "Browse by Account Type"}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {accountTabs.map((tab) => {
              const Icon = tab.icon
              const isSelected = selectedAccountType === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => handleAccountTabClick(tab.key)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border text-start transition-all duration-300 group flex items-start gap-3 ${
                    isSelected
                      ? `bg-gradient-to-br ${tab.color} shadow-lg ring-1 ring-white/20`
                      : "bg-card/40 border-white/5 hover:border-white/20 hover:bg-card/70 text-slate-400"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? "bg-white/10 text-white shadow-inner"
                        : "bg-white/5 text-muted-foreground group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm sm:text-base font-bold block truncate ${
                        isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.description && (
                      <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {tab.description}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Dynamic Sub-category / Post Type Filter Pills ───────── */}
        {activeSubtypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card/30 border border-white/5 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {selectedAccountType === "university"
                  ? language === "ar"
                    ? "أهداف ومنشورات الجامعات:"
                    : language === "hi"
                    ? "विश्वविद्यालय पोस्ट श्रेणियां:"
                    : "University Objectives:"
                  : selectedAccountType === "company"
                  ? language === "ar"
                    ? "أهداف ومنشورات الشركات:"
                    : language === "hi"
                    ? "कंपनी पोस्ट श्रेणियां:"
                    : "Company Objectives:"
                  : language === "ar"
                  ? "مشاركات الكفاءات والباحثين عن عمل:"
                  : language === "hi"
                  ? "उम्मीदवार पोस्ट श्रेणियां:"
                  : "Job Seeker Content:"}
              </span>
              {selectedPostType !== "all" && (
                <button
                  onClick={() => setSelectedPostType("all")}
                  className="text-primary hover:underline font-bold text-[11px]"
                >
                  {language === "ar" ? "عرض الكل" : language === "hi" ? "सभी देखें" : "View All"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setSelectedPostType("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedPostType === "all"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                {language === "ar" ? "جميع المنشورات" : language === "hi" ? "सभी पोस्ट" : "All Posts"}
              </button>

              {activeSubtypes.map((st) => {
                const label = st.labels[language] || st.labels.en
                const isSelected = selectedPostType === st.key
                return (
                  <button
                    key={st.key}
                    onClick={() => setSelectedPostType(st.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-white/20 text-white border border-white/30 shadow-md shadow-black/30"
                        : "bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── Targeted Stream & Audience Filter ("Relevant Users See the Campaign") ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/40 border border-white/10 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            {/* For You Button */}
            <button
              type="button"
              onClick={() => {
                setIsForYouActive(!isForYouActive)
                if (!isForYouActive) setTargetAudienceFilter("all")
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                isForYouActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30 ring-2 ring-white/20"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isForYouActive ? "text-yellow-300" : ""}`} />
              <span>
                {language === "ar"
                  ? `🎯 حملات موجهة لحسابي (${
                      activePersonaRole === "university"
                        ? "كجامعة"
                        : activePersonaRole === "company"
                        ? "كشركة"
                        : "كباحث عن عمل"
                    })`
                  : `🎯 Targeted For Me (${activePersonaRole})`}
              </span>
            </button>

            {/* Audience Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] text-muted-foreground ps-2 pe-1 font-semibold hidden md:inline">
                {language === "ar" ? "أو تصفح حسب الجمهور المستهدف:" : "Target Audience:"}
              </span>
              {[
                { key: "all", label: language === "ar" ? "جميع الفئات" : "All Audiences" },
                { key: "candidate", label: language === "ar" ? "👥 موجه للباحثين عن عمل" : "For Job Seekers" },
                { key: "company", label: language === "ar" ? "🏢 موجه للشركات" : "For Companies" },
                { key: "university", label: language === "ar" ? "🏛️ موجه للجامعات" : "For Universities" },
              ].map((aud) => (
                <button
                  key={aud.key}
                  type="button"
                  onClick={() => {
                    setIsSavedViewActive(false)
                    setIsForYouActive(false)
                    setTargetAudienceFilter(aud.key)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    !isSavedViewActive && !isForYouActive && targetAudienceFilter === aud.key
                      ? "bg-secondary/25 border border-secondary text-secondary font-bold"
                      : "bg-white/5 border border-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  {aud.label}
                </button>
              ))}

              {/* Saved Campaigns Tab */}
              <button
                type="button"
                onClick={() => {
                  setIsSavedViewActive(!isSavedViewActive)
                  setIsForYouActive(false)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSavedViewActive
                    ? "bg-amber-500/25 border border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                    : "bg-white/5 border border-white/5 text-muted-foreground hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{language === "ar" ? "الحملات المحفوظة" : "Saved Campaigns"}</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-muted-foreground font-mono">
            {posts.length} {language === "ar" ? "حملة متوفرة" : "Campaigns"}
          </span>
        </div>

        {/* ── Search & Filter Controls ─────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedAccountType === "university"
                    ? language === "ar"
                      ? "ابحث في أبحاث الجامعات، معارض التوظيف، براءات الاختراع..."
                      : language === "hi"
                      ? "विश्वविद्यालय शोध, रोजगार मेलों में खोजें..."
                      : "Search university research, job fairs, patents..."
                    : selectedAccountType === "company"
                    ? language === "ar"
                      ? "ابحث في حملات التوظيف، استقطاب الكفاءات، بيئة العمل..."
                      : language === "hi"
                      ? "कंपनी भर्ती अभियानों, प्रतिभा खोज में खोजें..."
                      : "Search hiring drives, specialized roles, team spotlights..."
                    : selectedAccountType === "candidate"
                    ? language === "ar"
                      ? "ابحث في مشاريع الكفاءات، المتاحين للعمل، الشهادات..."
                      : language === "hi"
                      ? "उम्मीदवार प्रोजेक्ट्स और पोर्टफोलियो खोजें..."
                      : "Search candidate portfolios, open to work, certifications..."
                    : language === "ar"
                    ? "ابحث في المقالات، الجامعات، الشركات، أو الكفاءات..."
                    : language === "hi"
                    ? "लेख, विश्वविद्यालय, कंपनियां या उम्मीदवार खोजें..."
                    : "Search articles, universities, companies, or candidates..."
                }
                className="w-full ps-11 pe-10 py-3 rounded-2xl bg-card/60 border border-white/10 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                {language === "ar" ? "ترتيب حسب:" : language === "hi" ? "क्रमबद्ध करें:" : "Sort:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-card/60 border border-white/10 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="newest">{language === "ar" ? "الأحدث نشراً" : language === "hi" ? "नवीनतम" : "Newest"}</option>
                <option value="popular">{language === "ar" ? "الأكثر قراءة" : language === "hi" ? "सर्वाधिक देखे गए" : "Most Viewed"}</option>
                <option value="likes">{language === "ar" ? "الأكثر إعجاباً" : language === "hi" ? "सर्वाधिक पसंद किए गए" : "Most Liked"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Main Layout: Articles Feed + Sidebar ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {isLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-80 w-full bg-card/60 rounded-3xl border border-white/5" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-72 bg-card/40 rounded-2xl border border-white/5" />
                  ))}
                </div>
              </div>
            ) : localizedPosts.length === 0 ? (
              <div className="p-16 text-center bg-card/20 rounded-3xl border border-white/5 space-y-4">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-xl font-bold font-heading text-white">
                  {language === "ar"
                    ? "لا توجد منشورات تطابق تصفيتك"
                    : language === "hi"
                    ? "आपकी खोज से मेल खाता कोई पोस्ट नहीं मिला"
                    : "No posts found matching your filter"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ar"
                    ? "جرب اختيار نوع حساب آخر أو إعادة تعيين البحث."
                    : language === "hi"
                    ? "अन्य खाता प्रकार चुनें या फ़िल्टर रीसेट करें।"
                    : "Try selecting a different account type or resetting your filters."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedAccountType("all")
                    setSelectedPostType("all")
                    setSelectedCategory("all")
                  }}
                  className="rounded-xl px-5 bg-white/10 hover:bg-white/15 text-white text-xs"
                >
                  {language === "ar"
                    ? "إعادة ضبط التصفية"
                    : language === "hi"
                    ? "फ़िल्टर रीसेट करें"
                    : "Reset Filters"}
                </Button>
              </div>
            ) : (
              <>
                {/* Featured / Heroic Article Card */}
                {featuredPost && (
                  <Link to={`/posts/${featuredPost.id}`} className="block group">
                    <GlassCard className="relative overflow-hidden bg-card/60 border-white/10 rounded-3xl p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 h-56 sm:h-64 rounded-2xl overflow-hidden relative">
                          <img
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
                            {/* Account Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-md border ${
                                featuredPost.accountType === "university"
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                                  : featuredPost.accountType === "company"
                                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40"
                                  : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {featuredPost.accountType === "university" ? "🏛️ " : featuredPost.accountType === "company" ? "🏢 " : "👤 "}
                              {getLocalizedAccountType(featuredPost.accountType, language)}
                            </span>

                            {/* Personalized Match Badge */}
                            {featuredPost.targetAudience?.roles?.includes(activePersonaRole) && (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-md backdrop-blur-md flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>{language === "ar" ? "موجه لحسابك" : "Matched for you"}</span>
                              </span>
                            )}

                            {/* Video Campaign Badge */}
                            {featuredPost.mediaType === "video" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/80 text-white backdrop-blur-md flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>{language === "ar" ? "فيديو" : "Video"}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {featuredPost.postType && (
                              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-semibold text-[11px]">
                                {getLocalizedPostType(featuredPost.postType, language)}
                              </span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                              {featuredPost.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {featuredPost.views} {language === "ar" ? "قراءة" : language === "hi" ? "व्यूज" : "views"}
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white group-hover:text-primary transition-colors leading-snug">
                            {featuredPost.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {featuredPost.summary}
                          </p>

                          {/* Target Audience metadata */}
                          {featuredPost.targetAudience?.roles && featuredPost.targetAudience.roles.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1 text-secondary font-bold text-[10px]">
                                <Target className="w-3 h-3 text-secondary" />
                                <span>{language === "ar" ? "الجمهور المستهدف:" : "Target:"}</span>
                              </span>
                              {featuredPost.targetAudience.roles.map((r) => (
                                <span key={r} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300">
                                  {r === "candidate" ? (language === "ar" ? "باحثين عن عمل" : "Job Seekers") : r === "company" ? (language === "ar" ? "شركات" : "Companies") : (language === "ar" ? "جامعات" : "Universities")}
                                </span>
                              ))}
                              {featuredPost.targetAudience.targetLocations?.[0] && (
                                <span className="text-[10px] text-emerald-400 font-medium">
                                  📍 {featuredPost.targetAudience.targetLocations[0]}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Direct Call to Action Button */}
                          {featuredPost.ctaText && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (featuredPost.ctaUrl?.startsWith("http")) {
                                    window.open(featuredPost.ctaUrl, "_blank")
                                  } else {
                                    window.location.href = featuredPost.ctaUrl || `/posts/${featuredPost.id}`
                                  }
                                }}
                                className="px-4 py-2 rounded-xl bg-primary/25 hover:bg-primary text-secondary hover:text-white border border-primary/30 text-xs font-bold transition-all inline-flex items-center gap-2"
                              >
                                <span>{featuredPost.ctaText}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Author & Full Social Interaction Action Bar */}
                          <div className="pt-4 border-t border-white/5 flex flex-col space-y-3">
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.location.href = ROUTES.PORTFOLIO.PUBLIC(featuredPost.author.username)
                              }}
                              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={featuredPost.author.avatar}
                                alt={featuredPost.author.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                              />
                              <div>
                                <span className="text-xs font-bold text-white block hover:text-primary">
                                  {featuredPost.author.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">
                                  {featuredPost.author.title}
                                </span>
                              </div>
                            </div>

                            {/* [Like] [Comment] [Share] [Save] [Analytics] */}
                            <CampaignCardActions
                              post={featuredPost}
                              variant="featured"
                              onCommentClick={(_e, p) => setCommentsModalPost(p)}
                              onShareClick={(_e, p) => setShareModalPost(p)}
                              onAnalyticsClick={(_e, p) => setAnalyticsModalPost(p)}
                              onUpdate={(updated) => {
                                setPosts((prev) =>
                                  prev.map((p) => (p.id === featuredPost.id ? { ...p, ...updated } : p))
                                )
                              }}
                            />
                          </div>

                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                )}

                {/* Grid of Remaining Articles */}
                {feedPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {feedPosts.map((post) => (
                      <Link key={post.id} to={`/posts/${post.id}`} className="block group">
                        <GlassCard className="h-full bg-card/40 border-white/5 hover:border-primary/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl">
                          <div className="space-y-4">
                            {/* Card Image */}
                            <div className="h-44 w-full rounded-2xl overflow-hidden relative">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 start-3 flex flex-wrap gap-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md backdrop-blur-md border ${
                                    post.accountType === "university"
                                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                                      : post.accountType === "company"
                                      ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/40"
                                      : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                                  }`}
                                >
                                  {post.accountType === "university" ? "🏛️ " : post.accountType === "company" ? "🏢 " : "👤 "}
                                  {getLocalizedAccountType(post.accountType, language)}
                                </span>

                                {/* Personalized Match Badge */}
                                {post.targetAudience?.roles?.includes(activePersonaRole) && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm backdrop-blur-md flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                    <span>{language === "ar" ? "موجه لك" : "For you"}</span>
                                  </span>
                                )}

                                {/* Video Campaign Badge */}
                                {post.mediaType === "video" && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/80 text-white backdrop-blur-md flex items-center gap-1">
                                    <Video className="w-2.5 h-2.5" />
                                    <span>{language === "ar" ? "فيديو" : "Video"}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              {post.postType && (
                                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-medium border border-white/5">
                                  {getLocalizedPostType(post.postType, language)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-primary" />
                                {post.readTime}
                              </span>
                            </div>

                            {/* Title & Excerpt */}
                            <div className="space-y-2">
                              <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                {post.summary}
                              </p>
                            </div>

                            {/* Target Audience Metadata */}
                            {post.targetAudience?.roles && post.targetAudience.roles.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground pt-1">
                                <span className="text-secondary font-bold flex items-center gap-0.5">
                                  <Target className="w-2.5 h-2.5" />
                                  <span>{language === "ar" ? "موجه:" : "Target:"}</span>
                                </span>
                                {post.targetAudience.roles.map((r) => (
                                  <span key={r} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300">
                                    {r === "candidate" ? (language === "ar" ? "باحثين" : "Seekers") : r === "company" ? (language === "ar" ? "شركات" : "Companies") : (language === "ar" ? "جامعات" : "Universities")}
                                  </span>
                                ))}
                                {post.targetAudience.targetLocations?.[0] && (
                                  <span className="text-[9px] text-emerald-400 font-medium truncate max-w-[120px]">
                                    📍 {post.targetAudience.targetLocations[0]}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Direct CTA button */}
                            {post.ctaText && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (post.ctaUrl?.startsWith("http")) {
                                      window.open(post.ctaUrl, "_blank")
                                    } else {
                                      window.location.href = post.ctaUrl || `/posts/${post.id}`
                                    }
                                  }}
                                  className="w-full py-2 px-3 rounded-xl bg-primary/20 hover:bg-primary text-secondary hover:text-white border border-primary/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                >
                                  <span>{post.ctaText}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Footer: Author & Social Actions */}
                          <div className="pt-3 mt-3 border-t border-white/5 flex flex-col space-y-2">
                            <div
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.location.href = ROUTES.PORTFOLIO.PUBLIC(post.author.username)
                              }}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-200 truncate block max-w-[150px]">
                                  {post.author.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate block max-w-[150px]">
                                  {post.author.title}
                                </span>
                              </div>
                            </div>

                            {/* [Like] [Comment] [Share] [Save] */}
                            <CampaignCardActions
                              post={post}
                              variant="card"
                              onCommentClick={(_e, p) => setCommentsModalPost(p)}
                              onShareClick={(_e, p) => setShareModalPost(p)}
                              onAnalyticsClick={(_e, p) => setAnalyticsModalPost(p)}
                              onUpdate={(updated) => {
                                setPosts((prev) =>
                                  prev.map((item) => (item.id === post.id ? { ...item, ...updated } : item))
                                )
                              }}
                            />
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Sidebar Area (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Ecosystem Account Roles Card */}
            <GlassCard className="p-6 bg-card/40 border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>
                  {language === "ar" ? "أدوار منظومة فائدة" : language === "hi" ? "फायदा पारिस्थितिकी तंत्र" : "Faeda Ecosystem Roles"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "شبكة تفاعلية تربط الجامعات والمؤسسات الأكاديمية بكبرى الشركات الباحثة عن كفاءات، والكفاءات المهنية الباحثة عن نمو."
                  : language === "hi"
                  ? "एक नेटवर्क जो विश्वविद्यालयों को कंपनियों और नौकरी चाहने वालों से जोड़ता है।"
                  : "A linked tri-party network connecting higher education institutions, hiring enterprises, and job seekers."}
              </p>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div
                  onClick={() => handleAccountTabClick("university")}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      {language === "ar" ? "منشورات الجامعات" : language === "hi" ? "विश्वविद्यालय पोस्ट" : "University Posts"}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">5 {language === "ar" ? "مقالات" : "posts"}</span>
                </div>

                <div
                  onClick={() => handleAccountTabClick("company")}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      {language === "ar" ? "إعلانات وحملات الشركات" : language === "hi" ? "कंपनी अभियान" : "Company Campaigns"}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-bold">7 {language === "ar" ? "حملات" : "posts"}</span>
                </div>

                <div
                  onClick={() => handleAccountTabClick("candidate")}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      {language === "ar" ? "مشاريع الباحثين عن عمل" : language === "hi" ? "उम्मीदवार प्रोजेक्ट्स" : "Job Seeker Portfolios"}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold">4 {language === "ar" ? "مشاريع" : "posts"}</span>
                </div>
              </div>
            </GlassCard>

            {/* Trending Topics Widget */}
            <GlassCard className="p-6 bg-card/40 border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>
                  {language === "ar" ? "المواضيع الأكثر تداولاً" : language === "hi" ? "ट्रेंडिंग विषय" : "Trending Topics"}
                </span>
              </div>

              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => setSearchQuery(topic.title.replace("#", ""))}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-primary block">{topic.title}</span>
                      <span className="text-[10px] text-muted-foreground">{topic.category}</span>
                    </div>
                    <span className="text-xs font-semibold text-white/80">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Suggested Organizations & Authors */}
            <GlassCard className="p-6 bg-card/40 border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span>
                  {language === "ar" ? "جهات وكتاب مميزون" : language === "hi" ? "सुझाए गए लेखक व संगठन" : "Featured Contributors"}
                </span>
              </div>

              <div className="space-y-3">
                {suggestedAuthors.map((author) => (
                  <div
                    key={author.username}
                    onClick={() => {
                      window.location.href = ROUTES.PORTFOLIO.PUBLIC(author.username)
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate block">{author.name}</span>
                        {author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground block truncate">{author.title}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary shrink-0">
                      {author.articlesCount} {language === "ar" ? "منشور" : "posts"}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Newsletter Subscription */}
            <GlassCard className="p-6 bg-card/40 border-white/10 rounded-3xl space-y-3 text-start">
              <h4 className="text-sm font-bold text-white">
                {language === "ar" ? "نشرة فائدة المعرفية" : language === "hi" ? "ज्ञान न्यूज़लेटर" : "Faeda Weekly Digest"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === "ar"
                  ? "احصل على ملخص أسبوعي بأهم أبحاث الجامعات، وظائف الشركات، وتحديثات سوق العمل."
                  : language === "hi"
                  ? "साप्ताहिक शोध, नौकरियों और बाजार अंतर्दृष्टि का सारांश प्राप्त करें।"
                  : "Receive a curated weekly breakdown of university research, hiring campaigns, and market trends."}
              </p>

              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === "ar" ? "أنت مشترك الآن بنجاح!" : language === "hi" ? "सफलतापूर्वक सदस्यता ले ली गई!" : "Subscribed successfully!"}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder-muted-foreground text-xs focus:outline-none focus:border-primary"
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 shadow-md shadow-primary/20"
                  >
                    {language === "ar" ? "اشتراك مجاني" : language === "hi" ? "मुफ़्त सदस्यता लें" : "Subscribe"}
                  </Button>
                </form>
              )}
            </GlassCard>

          </div>

        </div>

      </div>

      {/* ── Smart Campaign Launch Wizard Modal ── */}
      <CampaignCreateWizardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialAccountType={activePersonaRole}
        onSuccess={handleCampaignCreated}
      />

      {/* ── Share / Repost Modal ── */}
      <CampaignShareModal
        isOpen={Boolean(shareModalPost)}
        onClose={() => setShareModalPost(null)}
        post={shareModalPost}
        onShared={(postId, count) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, sharesCount: count } : p))
          )
        }}
      />

      {/* ── Threaded Comments & Discussion Modal ── */}
      <CampaignCommentsModal
        isOpen={Boolean(commentsModalPost)}
        onClose={() => setCommentsModalPost(null)}
        post={commentsModalPost}
        onCommentsUpdated={(postId, count) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, commentsCount: count } : p))
          )
        }}
      />

      {/* ── Social Analytics Modal (Owner / Admin) ── */}
      <CampaignAnalyticsModal
        isOpen={Boolean(analyticsModalPost)}
        onClose={() => setAnalyticsModalPost(null)}
        campaignId={analyticsModalPost?.id || 0}
        campaignTitle={analyticsModalPost?.title}
      />

    </div>
  )
}
export default PostsPage
