/**
 * features/public/pages/CompanyDetailPage.tsx
 *
 * Public company profile detail page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Building2, MapPin, CheckCircle2, Briefcase, ExternalLink, ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, ShieldCheck,
  Newspaper, UserPlus, UserCheck, Eye, Heart, MessageSquare, Sparkles, Clock
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useCompanyDetail } from "@/features/companies/hooks/useCompanies"
import { CompanyDetailSkeleton } from "@/features/companies/components/CompanySkeleton"
import { JobCard } from "@/features/public/components/JobCard"
import { postsService } from "@/features/public/services/posts.service"
import type { PostArticle } from "@/features/public/types/posts.types"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { getLocalizedCompanyName, formatLocalizedNumber } from "@/lib/localization.utils"
import toast from "react-hot-toast"

function getAvatarGradient(idStr: string): string {
  const gradients = [
    "from-primary/30 to-blue-600/20 border-primary/40 text-primary",
    "from-emerald-500/30 to-teal-700/20 border-emerald-500/40 text-emerald-400",
    "from-indigo-500/30 to-purple-700/20 border-indigo-500/40 text-indigo-400",
    "from-cyan-500/30 to-blue-700/20 border-cyan-500/40 text-cyan-400",
    "from-amber-500/30 to-orange-700/20 border-amber-500/40 text-amber-400",
  ]
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % gradients.length
  return gradients[idx]
}

function getCompanyInitials(name: string): string {
  const clean = name.trim().replace(/^(شركة|مركز|مؤسسة|مجموعة)\s+/, "")
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.substring(0, 2).toUpperCase()
}

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { company, isLoading, error } = useCompanyDetail(id)
  const { t, language, isRTL } = useTranslation()
  const jobsSectionRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<"jobs" | "posts" | "about">("jobs")
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(142)
  const [companyPosts, setCompanyPosts] = useState<PostArticle[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowerCount((prev) => Math.max(0, prev - 1))
      toast(
        language === "ar"
          ? "تم إلغاء متابعة الشركة"
          : language === "hi"
          ? "फॉलो रद्द किया गया"
          : "Unfollowed company",
        { icon: "ℹ️" }
      )
    } else {
      setIsFollowing(true)
      setFollowerCount((prev) => prev + 1)
      toast.success(
        language === "ar"
          ? "أنت الآن تتابع هذه الشركة! ستظهر منشوراتها في تغذية أخبارك"
          : language === "hi"
          ? "आप अब इस कंपनी को फॉलो कर रहे हैं!"
          : "You are now following this company! You'll see their updates in your feed."
      )
    }
  }

  useEffect(() => {
    if (!company) return
    setIsLoadingPosts(true)
    postsService
      .getUserPublishedCampaigns("company", company.id)
      .then((res) => {
        if (res.campaigns && res.campaigns.length > 0) {
          setCompanyPosts(res.campaigns)
        } else {
          // Fetch relevant company posts fallback
          postsService
            .getPosts({ accountType: "company", pageSize: 6 })
            .then((allRes) => {
              const companyArabic = (company as any).nameAr || (company as any).name_ar || ""
              const matched = allRes.posts.filter(
                (p) =>
                  p.author.name.toLowerCase().includes(company.name.toLowerCase()) ||
                  (companyArabic && p.author.name.includes(companyArabic))
              )
              setCompanyPosts(matched.length > 0 ? matched : allRes.posts.slice(0, 3))
            })
            .catch(() => setCompanyPosts([]))
        }
      })
      .catch(() => {
        setCompanyPosts([])
      })
      .finally(() => {
        setIsLoadingPosts(false)
      })
  }, [company])

  const scrollToJobs = () => {
    setActiveTab("jobs")
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  if (isLoading) {
    return (
      <div className="flex flex-col w-full bg-background min-h-screen relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <CompanyDetailSkeleton />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-24 pb-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
            <Building2 className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">{t("companies.states.notFoundTitle")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("companies.states.notFoundSubtitle")}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={ROUTES.COMPANIES.LIST}>
              <Button className="rounded-xl px-6 bg-primary text-white font-bold text-xs sm:text-sm">
                {t("companies.detail.backToList")}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const companyName = getLocalizedCompanyName(company, language)
  const gradientStyle = getAvatarGradient(company.id)
  const initials = getCompanyInitials(companyName)

  const unspecLabel = language === "en" ? "Not specified" : language === "hi" ? "निर्दिष्ट नहीं" : "غير محدد"
  const saudiLabel = language === "en" ? "Saudi Arabia" : language === "hi" ? "सऊदी अरब" : "المملكة العربية السعودية"

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20 text-start">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to={ROUTES.COMPANIES.LIST} className="hover:text-white transition-colors flex items-center gap-1">
            <span>{t("companies.header.title")}</span>
          </Link>
          <ChevronIcon className="w-4 h-4 text-white/30" />
          <span className="text-white font-medium truncate">{companyName}</span>
        </div>

        {/* Company Header Card */}
        <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            <div className="flex items-start gap-5 min-w-0">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={companyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/10 shrink-0 bg-black/40 shadow-xl"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLElement).style.display = "none"
                  }}
                />
              ) : (
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br border flex items-center justify-center font-bold text-2xl sm:text-3xl font-heading shrink-0 shadow-inner ${gradientStyle}`}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {company.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("companies.detail.verified")}</span>
                    </span>
                  )}

                  {company.companyField && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{company.companyField}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{formatLocalizedNumber(followerCount, language)} {language === "ar" ? "متابع" : "Followers"}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
                  {companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{company.location || company.country || saudiLabel}</span>
                  </span>

                  {company.companySize && (
                    <span className="before:content-['•'] before:me-2 before:text-white/20">
                      {company.companySize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end shrink-0">
              {/* Follow Button */}
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
                    <span>{language === "ar" ? "أنت تتابع الشركة" : language === "hi" ? "फॉलो कर रहे हैं" : "Following"}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{language === "ar" ? "متابعة الشركة" : language === "hi" ? "कंपनी फॉलो करा" : "Follow"}</span>
                  </>
                )}
              </Button>

              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm gap-2 hover:bg-white/10">
                    <ExternalLink className="w-4 h-4" />
                    <span>{t("companies.detail.viewWebsite")}</span>
                  </Button>
                </a>
              )}

              <Button
                onClick={scrollToJobs}
                size="lg"
                variant="outline"
                className="rounded-xl px-6 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm gap-2"
              >
                <Briefcase className="w-4 h-4 text-primary" />
                <span>{t("companies.detail.viewJobsCta")} ({formatLocalizedNumber(company.jobs.length, language)})</span>
              </Button>
            </div>

          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.verificationStatus")}</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {company.isVerified ? t("companies.detail.verified") : t("companies.detail.unverified")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.openJobsTitle")}</span>
              <span className="font-bold text-white">{t("companies.list.openJobsCount", { count: company.jobs.length })}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">
                {language === "ar" ? "المنشورات والتحديثات" : "Posts & Updates"}
              </span>
              <span className="font-bold text-primary flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5" />
                <span>{formatLocalizedNumber(companyPosts.length, language)}</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">{t("companies.detail.field")}</span>
              <span className="font-bold text-white truncate block">{company.companyField || unspecLabel}</span>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card/60 backdrop-blur-md border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "jobs"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t("companies.detail.openJobsTitle")}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "jobs" ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
            }`}>
              {formatLocalizedNumber(company.jobs.length, language)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "posts"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>{language === "ar" ? "المنشورات والأخبار المهنية" : language === "hi" ? "कंपनी पोस्ट्स व अपडेट्स" : "Posts & Updates"}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "posts" ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
            }`}>
              {formatLocalizedNumber(companyPosts.length, language)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === "about"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t("companies.detail.aboutTitle")}</span>
          </button>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* TAB: JOBS */}
            {activeTab === "jobs" && (
              <div ref={jobsSectionRef} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <span>{t("companies.detail.openJobsTitle")}</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                      {formatLocalizedNumber(company.jobs.length, language)}
                    </span>
                  </h2>
                </div>

                {company.jobs.length > 0 ? (
                  <div className="space-y-4">
                    {company.jobs.map((job, idx) => (
                      <JobCard key={job.id} job={job} index={idx} />
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-8 text-center bg-card/40 border-white/10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
                      <Briefcase className="w-6 h-6 opacity-60" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{t("companies.detail.noOpenJobs")}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                      {t("companies.detail.joinCtaSubtitle")}
                    </p>
                    <Link to={ROUTES.JOBS.LIST}>
                      <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                        {t("companies.detail.browseAllJobs")}
                      </Button>
                    </Link>
                  </GlassCard>
                )}
              </div>
            )}

            {/* TAB: POSTS & UPDATES */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-primary" />
                      <span>{language === "ar" ? "منشورات وأخبار الشركة" : language === "hi" ? "कंपनी पोस्ट्स व आर्टिकल्स" : "Company Posts & Articles"}</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                        {formatLocalizedNumber(companyPosts.length, language)}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "ar"
                        ? "استكشف أحدث المقالات، حملات الاستقطاب، وثقافة العمل التي تشاركها الشركة"
                        : "Explore latest thought leadership, recruitment drives, and culture updates from the company"}
                    </p>
                  </div>
                  <Link to={ROUTES.POSTS.LIST}>
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 gap-1">
                      <span>{language === "ar" ? "تصفح شبكة المنشورات" : "Browse All Posts"}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>

                {isLoadingPosts ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : companyPosts.length > 0 ? (
                  <div className="space-y-5">
                    {companyPosts.map((post) => (
                      <GlassCard
                        key={post.id}
                        className="p-6 bg-card/60 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all shadow-xl group space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                              {post.author.avatar ? (
                                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <Building2 className="w-5 h-5" />
                              )}
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
                          <div className="rounded-xl overflow-hidden max-h-60 border border-white/10">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
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
                              <span>{language === "ar" ? "قراءة وتفاعل" : language === "hi" ? "वाचा आणि प्रतिक्रिया द्या" : "Read & Engage"}</span>
                              <ArrowIcon className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <GlassCard className="p-10 text-center bg-card/40 border-white/10 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
                      <Newspaper className="w-6 h-6 opacity-60" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {language === "ar" ? "لا توجد منشورات منشورة حالياً" : "No posts published yet"}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {language === "ar"
                        ? "ستظهر منشورات وأخبار الشركة هنا فور نشرها. يمكنك متابعة الشركة ليصلك إشعار بالجديد!"
                        : "Company updates and articles will appear here once published. Follow the company to get notified!"}
                    </p>
                  </GlassCard>
                )}
              </div>
            )}

            {/* TAB: ABOUT */}
            {activeTab === "about" && (
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>{t("companies.detail.aboutTitle")}</span>
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {company.description || t("companies.detail.noAboutText")}
                </p>
              </GlassCard>
            )}

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-5">
              <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-white/10">
                {t("companies.detail.infoTitle")}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.field")}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    {company.companyField || unspecLabel}
                  </p>
                </div>

                {company.companyType && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.type")}</span>
                    <p className="font-semibold text-white">{company.companyType}</p>
                  </div>
                )}

                {company.companySize && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.size")}</span>
                    <p className="font-bold text-white">{company.companySize}</p>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">{t("companies.detail.location")}</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {company.location || company.country || saudiLabel}
                  </p>
                </div>

                {company.website && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-muted-foreground text-[11px] block mb-1">{t("companies.detail.website")}</span>
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-mono truncate block"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-start space-y-3">
              <h4 className="font-extrabold font-heading text-white text-base">
                {t("companies.detail.joinCtaTitle")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("companies.detail.joinCtaSubtitle")}
              </p>
              <Button
                onClick={scrollToJobs}
                size="sm"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 mt-2"
              >
                <span>{t("companies.detail.viewJobsCta")}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Button>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  )
}
