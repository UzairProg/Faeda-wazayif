/**
 * features/public/pages/UniversityDetailPage.tsx
 *
 * Public Academic Institution Profile & Research Showcase (/universities/:id).
 * Allows companies, students, and other institutions to browse:
 * - Published academic research, job fairs, and achievements
 * - Colleges, departments, and academic specializations
 * - Graduating cohorts and career-ready talents
 * - Interactive Follow button and direct partnership contact
 *
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  GraduationCap,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  Users,
  Sparkles,
  Building,
  UserPlus,
  UserCheck,
  Send,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  Briefcase,
  Globe2,
  Mail,
  ShieldCheck,
  Share2,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { postsService } from "@/features/public/services/posts.service"
import type { PostArticle } from "@/features/public/types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { formatLocalizedNumber } from "@/lib/localization.utils"
import toast from "react-hot-toast"

interface UniversityPublicData {
  id: number
  nameAr: string
  nameEn: string
  institutionType: string
  location: string
  country: string
  website: string
  logo?: string
  qsRank: string
  isVerified: boolean
  descriptionAr: string
  descriptionEn: string
  deanName: string
  contactEmail: string
  stats: {
    studentsCount: number
    graduatesCount: number
    departmentsCount: number
    researchCount: number
  }
  departments: Array<{
    id: number
    name: string
    nameEn: string
    degree: string
    studentsCount: number
  }>
}

const FALLBACK_UNIVERSITIES: Record<string, UniversityPublicData> = {
  "1": {
    id: 1,
    nameAr: "جامعة الملك فهد للبترول والمعادن",
    nameEn: "King Fahd University of Petroleum & Minerals (KFUPM)",
    institutionType: "جامعة حكومية رائدة",
    location: "الظهران، المنطقة الشرقية",
    country: "المملكة العربية السعودية",
    website: "https://www.kfupm.edu.sa",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&h=160&fit=crop",
    qsRank: "المرتبة 101 عالمياً (QS World)",
    isVerified: true,
    descriptionAr:
      "تعتبر جامعة الملك فهد للبترول والمعادن صرحاً أكاديمياً وبحثياً رائداً في مجالات الهندسة، الذكاء الاصطناعي، والعلوم التطبيقية. تخرّج سنوياً نخبة الكفاءات الوطنية التي تقود التحول الرقمي ومشاريع رؤية السعودية 2030.",
    descriptionEn:
      "King Fahd University of Petroleum and Minerals (KFUPM) is a premier academic institution renowned for engineering, computer science, and applied sciences leadership in the Middle East.",
    deanName: "د. محمد بن سعد القحطاني",
    contactEmail: "partnerships@kfupm.edu.sa",
    stats: {
      studentsCount: 12400,
      graduatesCount: 3100,
      departmentsCount: 14,
      researchCount: 48,
    },
    departments: [
      { id: 1, name: "علوم وهندسة الحاسب الآلي", nameEn: "Computer Science & Engineering", degree: "بكالوريوس / ماجستير / دكتوراه", studentsCount: 2100 },
      { id: 2, name: "الذكاء الاصطناعي والأنظمة الذكية", nameEn: "AI & Autonomous Systems", degree: "بكالوريوس / ماجستير", studentsCount: 1400 },
      { id: 3, name: "الأمن السيبراني والبنية السحابية", nameEn: "Cybersecurity & Cloud", degree: "بكالوريوس", studentsCount: 950 },
      { id: 4, name: "الهندسة الكهربائية والاتصالات", nameEn: "Electrical Engineering", degree: "بكالوريوس / دكتوراه", studentsCount: 1800 },
      { id: 5, name: "الهندسة الميكانيكية وتطبيقات الطاقة", nameEn: "Mechanical & Energy", degree: "بكالوريوس / ماجستير", studentsCount: 2200 },
    ],
  },
  "2": {
    id: 2,
    nameAr: "جامعة الملك سعود",
    nameEn: "King Saud University (KSU)",
    institutionType: "جامعة حكومية",
    location: "الرياض",
    country: "المملكة العربية السعودية",
    website: "https://www.ksu.edu.sa",
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=160&h=160&fit=crop",
    qsRank: "المرتبة 203 عالمياً (QS World)",
    isVerified: true,
    descriptionAr:
      "أقدم وأعرق الجامعات في المملكة العربية السعودية، تضم مجمعات بحثية وكليات تخصصية في تقنية المعلومات، الرعاية الصحية، وإدارة الأعمال مع شراكات وثيقة مع كبرى الشركات الوطنية والدولية.",
    descriptionEn:
      "The oldest and most prestigious university in Saudi Arabia, offering world-class programs in computing, business, and medicine.",
    deanName: "د. عبد الله بن عبد العزيز العثمان",
    contactEmail: "career-center@ksu.edu.sa",
    stats: {
      studentsCount: 42000,
      graduatesCount: 8900,
      departmentsCount: 28,
      researchCount: 76,
    },
    departments: [
      { id: 10, name: "كلية علوم الحاسب والمعلومات", nameEn: "College of Computer Science", degree: "بكالوريوس / ماجستير", studentsCount: 3800 },
      { id: 11, name: "إدارة الأعمال والمالية التقنية", nameEn: "FinTech & Business", degree: "بكالوريوس / ماجستير", studentsCount: 4200 },
      { id: 12, name: "الهندسة المدنية والمعمارية", nameEn: "Civil & Architecture", degree: "بكالوريوس", studentsCount: 3100 },
    ],
  },
}

export function UniversityDetailPage() {
  const { id = "1" } = useParams<{ id: string }>()
  const { language, isRTL } = useTranslation()

  const [activeTab, setActiveTab] = useState<"posts" | "departments" | "graduates" | "about">("posts")
  const [university, setUniversity] = useState<UniversityPublicData>(FALLBACK_UNIVERSITIES[id] || FALLBACK_UNIVERSITIES["1"])
  const [universityPosts, setUniversityPosts] = useState<PostArticle[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(380)

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  useEffect(() => {
    const selected = FALLBACK_UNIVERSITIES[id] || FALLBACK_UNIVERSITIES["1"]
    setUniversity(selected)

    setIsLoadingPosts(true)
    postsService
      .getUserPublishedCampaigns("university", selected.id)
      .then((res) => {
        if (res.campaigns && res.campaigns.length > 0) {
          setUniversityPosts(res.campaigns)
        } else {
          // Fallback to all university posts
          postsService
            .getPosts({ accountType: "university", pageSize: 6 })
            .then((allRes) => {
              setUniversityPosts(allRes.posts.slice(0, 4))
            })
            .catch(() => setUniversityPosts([]))
        }
      })
      .catch(() => setUniversityPosts([]))
      .finally(() => setIsLoadingPosts(false))
  }, [id])

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowersCount((prev) => Math.max(0, prev - 1))
      toast(language === "ar" ? "تم إلغاء متابعة المؤسسة التعليمية" : "Unfollowed university", { icon: "ℹ️" })
    } else {
      setIsFollowing(true)
      setFollowersCount((prev) => prev + 1)
      toast.success(
        language === "ar"
          ? "أنت الآن تتابع هذا الصرح الأكاديمي! ستظهر أبحاثه وفعالياته في شبكتك"
          : "You are now following this academic institution!"
      )
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success(language === "ar" ? "تم نسخ رابط الجامعة إلى الحافظة!" : "University profile link copied!")
    }
  }

  const universityName = language === "en" ? university.nameEn : university.nameAr

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 start-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-white transition-colors">
            {language === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/30" />
          <span className="text-primary font-medium">
            {language === "ar" ? "المؤسسات الأكاديمية والجامعات" : "Universities"}
          </span>
          <ChevronIcon className="w-4 h-4 text-white/30" />
          <span className="text-white font-bold truncate max-w-[240px]">{universityName}</span>
        </div>

        {/* ── University Header Card ───────────────────────────────── */}
        <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            <div className="flex items-start gap-5 min-w-0">
              {university.logo ? (
                <img
                  src={university.logo}
                  alt={universityName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/15 shrink-0 bg-black/40 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-700/20 border border-primary/30 flex items-center justify-center font-bold text-2xl font-heading text-primary shrink-0">
                  <GraduationCap className="w-10 h-10" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {university.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "صرح أكاديمي موثق" : "Verified Institution"}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                    <Building className="w-3.5 h-3.5" />
                    <span>{university.institutionType}</span>
                  </span>

                  {university.qsRank && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{university.qsRank}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
                  {universityName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{university.location}</span>
                  </span>
                  <span className="before:content-['•'] before:me-2 before:text-white/20">
                    {formatLocalizedNumber(followersCount, language)} {language === "ar" ? "متابع" : "Followers"}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end shrink-0">
              <Button
                onClick={handleToggleFollow}
                size="lg"
                variant={isFollowing ? "outline" : "default"}
                className={`rounded-xl px-5 font-bold text-xs sm:text-sm gap-2 transition-all ${
                  isFollowing
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>{language === "ar" ? "أنت تتابع الجامعة" : "Following"}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{language === "ar" ? "متابعة الجامعة" : "Follow"}</span>
                  </>
                )}
              </Button>

              {university.website && (
                <a href={university.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm gap-2 hover:bg-white/10">
                    <Globe2 className="w-4 h-4" />
                    <span>{language === "ar" ? "الموقع الرسمي" : "Official Website"}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </Button>
                </a>
              )}

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share University Profile"
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{language === "ar" ? "الأبحاث والمنشورات" : "Research Papers"}</span>
              <span className="font-bold text-primary flex items-center gap-1.5 text-base sm:text-lg">
                <BookOpen className="w-4 h-4" />
                <span>{formatLocalizedNumber(university.stats.researchCount, language)}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{language === "ar" ? "الكليات والأقسام" : "Departments"}</span>
              <span className="font-bold text-white flex items-center gap-1.5 text-base sm:text-lg">
                <Building className="w-4 h-4 text-sky-400" />
                <span>{formatLocalizedNumber(university.stats.departmentsCount, language)}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{language === "ar" ? "الخريجين السنويين" : "Annual Graduates"}</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-base sm:text-lg">
                <GraduationCap className="w-4 h-4" />
                <span>{formatLocalizedNumber(university.stats.graduatesCount, language)}+</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{language === "ar" ? "الاعتماد المؤسسي" : "Accreditation"}</span>
              <span className="font-bold text-amber-400 flex items-center gap-1 text-xs sm:text-sm truncate">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>ABET & NCAAA Full</span>
              </span>
            </div>
          </div>
        </GlassCard>

        {/* ── Tab Navigation ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card/60 backdrop-blur-md border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "posts"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === "ar" ? "الأبحاث والمنشورات الأكاديمية" : "Research & Posts"}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "posts" ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
            }`}>
              {formatLocalizedNumber(universityPosts.length, language)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("departments")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "departments"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{language === "ar" ? "الكليات والتخصصات" : "Colleges & Tracks"}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "departments" ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
            }`}>
              {formatLocalizedNumber(university.departments.length, language)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("graduates")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "graduates"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === "ar" ? "الكفاءات الجاهزة للتوظيف" : "Graduating Cohorts"}</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "about"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === "ar" ? "عن الصرح الأكاديمي" : "About University"}</span>
          </button>
        </div>

        {/* ── Main Tab Content Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* TAB: RESEARCH & POSTS */}
            {activeTab === "posts" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span>{language === "ar" ? "الأبحاث، ملتقيات التوظيف والابتكارات" : "Academic Research & Posts"}</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                        {formatLocalizedNumber(universityPosts.length, language)}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "ar"
                        ? "أوراق بحثية محكمة، إعلانات معارض التوظيف، وشراكات التدريب التعاوني مع القطاع الخاص"
                        : "Peer-reviewed research, career fair drives, and corporate coop partnerships"}
                    </p>
                  </div>

                  <Link to={ROUTES.POSTS.LIST}>
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 gap-1">
                      <span>{language === "ar" ? "تصفح شبكة المنشورات" : "Explore Posts"}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                {isLoadingPosts ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : universityPosts.length > 0 ? (
                  <div className="space-y-4">
                    {universityPosts.map((post) => (
                      <GlassCard
                        key={post.id}
                        className="p-6 bg-card/60 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all rounded-2xl shadow-xl space-y-4 group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-sm">{post.author.name}</span>
                                {post.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              </div>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(post.publishedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            {post.category}
                          </span>
                        </div>

                        <div>
                          <Link to={ROUTES.POSTS.DETAIL(String(post.id))}>
                            <h3 className="text-base sm:text-lg font-extrabold font-heading text-white hover:text-primary transition-colors leading-snug">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                            {post.summary || post.content}
                          </p>
                        </div>

                        {post.coverImage && (
                          <div className="rounded-xl overflow-hidden max-h-56 border border-white/10">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                              <Heart className="w-4 h-4 text-rose-400" />
                              <span>{formatLocalizedNumber(post.likes, language)}</span>
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                              <span>{formatLocalizedNumber(post.comments?.length || 0, language)}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="w-4 h-4" />
                              <span>{formatLocalizedNumber(post.views, language)}</span>
                            </span>
                          </div>

                          <Link to={ROUTES.POSTS.DETAIL(String(post.id))}>
                            <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-primary hover:text-white text-xs gap-1.5">
                              <span>{language === "ar" ? "قراءة الورقة / تفاعل" : "Read & Engage"}</span>
                              <ArrowIcon className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-3">
                    <BookOpen className="w-10 h-10 text-muted-foreground mx-auto opacity-60" />
                    <h3 className="text-base font-bold text-white">
                      {language === "ar" ? "لا توجد أوراق بحثية منشورة حالياً" : "No research papers yet"}
                    </h3>
                  </GlassCard>
                )}
              </div>
            )}

            {/* TAB: DEPARTMENTS */}
            {activeTab === "departments" && (
              <div className="space-y-4">
                <div className="px-1">
                  <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    <span>{language === "ar" ? "الكليات والتخصصات المعتمدة" : "Accredited Departments"}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === "ar" ? "برامج أكاديمية مصممة لمواءمة احتياجات سوق العمل الصناعي والتقني" : "Industry-aligned academic tracks"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {university.departments.map((dept) => (
                    <GlassCard key={dept.id} className="p-5 bg-card/60 border-white/10 rounded-2xl hover:border-primary/40 transition-colors space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {dept.degree}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {language === "en" ? dept.nameEn : dept.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-sky-400" />
                          <span>{formatLocalizedNumber(dept.studentsCount, language)} {language === "ar" ? "طالب وطالبة" : "Students"}</span>
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GRADUATES */}
            {activeTab === "graduates" && (
              <GlassCard className="p-8 bg-card/60 border-white/10 rounded-3xl space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{language === "ar" ? "دفعات الخريجين والجاهزية المهنية" : "Graduating Cohorts & Career Readiness"}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "ar"
                      ? "تتيح الجامعة للشركات استكشاف الخريجين المتفوقين ومرشحي التدريب التعاوني عبر منصة فائدة وظائف."
                      : "Direct recruiter access to verified graduates and cooperative training candidates."}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-white/5 to-white/5 border border-primary/25 space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {language === "ar" ? "استقطاب مباشر لخريجي الدفعة الحالية 2026" : "Direct Hiring for 2026 Graduates"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {language === "ar" ? "أكثر من 3,100 خريج معتمد في مجالات التقنية، الذكاء الاصطناعي والهندسة" : "Over 3,100 verified graduates"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link to={ROUTES.COMPANIES.LIST}>
                      <Button className="rounded-xl px-5 bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>{language === "ar" ? "طلب تنظيم يوم مهني / مع الشركاء" : "Request Career Day"}</span>
                      </Button>
                    </Link>

                    <Link to={ROUTES.PUBLIC.MARKET_TRENDS}>
                      <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>{language === "ar" ? "مؤشرات توظيف الخريجين" : "Graduate Employment KPIs"}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* TAB: ABOUT */}
            {activeTab === "about" && (
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-5">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span>{language === "ar" ? "نبذة عن الصرح الأكاديمي" : "About the Academic Institution"}</span>
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {language === "en" ? university.descriptionEn : university.descriptionAr}
                </p>

                <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1">{language === "ar" ? "عميد الكلية / المشرف" : "Dean / Provost"}</span>
                    <p className="font-bold text-white">{university.deanName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1">{language === "ar" ? "بريد مركز الخريجين والشراكات" : "Partnerships Email"}</span>
                    <p className="font-mono text-primary">{university.contactEmail}</p>
                  </div>
                </div>
              </GlassCard>
            )}

          </div>

          {/* Right Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            
            <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
              <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-white/10">
                {language === "ar" ? "معلومات المؤسسة" : "Institution Details"}
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "ar" ? "النوع" : "Type"}</span>
                  <p className="font-bold text-white">{university.institutionType}</p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "ar" ? "الموقع" : "Location"}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{university.location}</span>
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{language === "ar" ? "التصنيف الدولي" : "Global Ranking"}</span>
                  <p className="font-bold text-amber-400">{university.qsRank}</p>
                </div>

                {university.contactEmail && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-muted-foreground text-[11px] block mb-1">{language === "ar" ? "التواصل والشراكات" : "Direct Inquiries"}</span>
                    <a href={`mailto:${university.contactEmail}`} className="text-xs text-primary hover:underline font-mono flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{university.contactEmail}</span>
                    </a>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-start space-y-3">
              <h4 className="font-extrabold font-heading text-white text-base">
                {language === "ar" ? "شراكات التوظيف والتدريب التعاوني" : "Corporate & Coop Partnerships"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "هل تمثل شركة أو جهة توظيف وترغب بربط فرصك الوظيفية وبرامج التدريب مع الجامعة؟"
                  : "Are you an employer seeking to recruit graduates and supervise coop training?"}
              </p>
              <a href={`mailto:${university.contactEmail}?subject=شراكة توظيف مهنية مع جامعة ${university.nameAr}`}>
                <Button size="sm" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 mt-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "إرسال طلب شراكة" : "Send Partner Request"}</span>
                </Button>
              </a>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  )
}
