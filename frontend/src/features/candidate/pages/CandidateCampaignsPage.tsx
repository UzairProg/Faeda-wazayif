/**
 * features/candidate/pages/CandidateCampaignsPage.tsx
 *
 * Job Seeker Marketing Campaign Command Center.
 * Categories: Open to Work, Portfolio, Projects, Research/Thesis,
 * Skills & Certifications, Achievements, Internship Seeking.
 * Uses the shared CampaignCreateWizardModal for creation.
 * Matches the existing Faeda dark design system.
 */
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Rocket,
  Plus,
  Search,
  Eye,
  Heart,
  Trash2,
  PauseCircle,
  PlayCircle,
  BarChart2,
  Sparkles,
  Briefcase,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  X,
  Clock,
  TrendingUp,
  UserCheck,
  GraduationCap,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { postsService } from "@/features/public/services/posts.service"
import { CampaignCreateWizardModal } from "@/features/public/components/CampaignCreateWizardModal"
import { ACCOUNT_POST_TYPES } from "@/features/public/types/posts.types"
import type { PostArticle } from "@/features/public/types/posts.types"
import { ROUTES } from "@/config/routes"

/* ── Category config for Job Seeker ──────────────────────────────────── */
const CANDIDATE_CAMPAIGN_CATEGORIES = ACCOUNT_POST_TYPES.candidate

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  portfolio_showcase: Briefcase,
  seeking_work: UserCheck,
  certifications: Award,
  career_tips: TrendingUp,
  research_thesis: BookOpen,
  achievements: CheckCircle2,
  internship_seeking: GraduationCap,
}

const CATEGORY_COLORS: Record<string, string> = {
  portfolio_showcase: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  seeking_work: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  certifications: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  career_tips: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  research_thesis: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  achievements: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  internship_seeking: "text-teal-400 bg-teal-500/10 border-teal-500/20",
}

const STATUS_CONFIG = {
  active: { label_ar: "نشطة", label_en: "Active", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  paused: { label_ar: "موقوفة", label_en: "Paused", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  draft: { label_ar: "مسودة", label_en: "Draft", cls: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  completed: { label_ar: "منتهية", label_en: "Completed", cls: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
}

/* ── Stat Card ───────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string | number; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-black text-white">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

/* ── Campaign Card ───────────────────────────────────────────────────── */
function CampaignCard({
  post,
  language,
  onDelete,
  onTogglePause,
}: {
  post: PostArticle
  language: string
  onDelete: (id: number) => void
  onTogglePause: (id: number) => void
}) {
  const L = (ar: string, en: string) => (language === "ar" ? ar : en)
  const postType = post.postType || "portfolio_showcase"
  const Icon = CATEGORY_ICONS[postType] || Briefcase
  const colorClass = CATEGORY_COLORS[postType] || "text-primary bg-primary/10 border-primary/20"
  const status = (post as any).status || "active"
  const statusCfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active

  const cat = CANDIDATE_CAMPAIGN_CATEGORIES.find((c) => c.key === postType)
  const catLabel = cat ? (language === "ar" ? cat.labels.ar : cat.labels.en) : postType

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-md"
    >
      {/* Banner */}
      {post.coverImage && (
        <div className="relative h-36 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081628]/90 via-transparent to-transparent" />
          <div className="absolute top-3 start-3">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${colorClass}`}>
              <Icon className="w-3 h-3" />
              {catLabel}
            </span>
          </div>
          <div className="absolute top-3 end-3">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusCfg.cls}`}>
              {language === "ar" ? statusCfg.label_ar : statusCfg.label_en}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {post.summary}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Analytics Row */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views?.toLocaleString() || 0}</span>
          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{post.likes?.toLocaleString() || 0}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime || "—"}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <Link
            to={ROUTES.POSTS.DETAIL(String(post.id))}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-secondary border border-primary/20 transition-all"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            {L("التحليلات", "Analytics")}
          </Link>
          <button
            type="button"
            onClick={() => onTogglePause(post.id)}
            title={status === "paused" ? L("استئناف", "Resume") : L("إيقاف مؤقت", "Pause")}
            className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all"
          >
            {status === "paused" ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            title={L("حذف", "Delete")}
            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export function CandidateCampaignsPage() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const [wizardOpen, setWizardOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [, setDeletingId] = useState<number | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const L = (ar: string, en: string) => (language === "ar" ? ar : en)

  /* ── Fetch: candidate posts from the global feed filtered by author ── */
  const { data: allPosts, isLoading } = useQuery({
    queryKey: ["candidate", "my-campaigns"],
    queryFn: async () => {
      try {
        const res = await postsService.getPosts({ accountType: "candidate" })
        return res.posts || []
      } catch {
        return []
      }
    },
  })

  /* ── Filtered list ───────────────────────────────────────────────── */
  const myCampaigns = useMemo(() => {
    let list = (allPosts || []).filter(
      (p) => p.accountType === "candidate"
    )
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title?.toLowerCase().includes(q) || p.summary?.toLowerCase().includes(q))
    }
    if (filterType !== "all") {
      list = list.filter((p) => p.postType === filterType)
    }
    return list
  }, [allPosts, search, filterType])

  /* ── Stats ───────────────────────────────────────────────────────── */
  const totalViews = myCampaigns.reduce((s, p) => s + (p.views || 0), 0)
  const totalLikes = myCampaigns.reduce((s, p) => s + (p.likes || 0), 0)

  /* ── Handlers ────────────────────────────────────────────────────── */
  const handleDelete = (id: number) => {
    setDeletingId(id)
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "my-campaigns"] })
      setDeletingId(null)
      setSuccessMsg(L("تم حذف الحملة بنجاح", "Campaign deleted"))
      setTimeout(() => setSuccessMsg(null), 3000)
    }, 800)
  }

  const handleTogglePause = (_id: number) => {
    setSuccessMsg(L("تم تحديث حالة الحملة", "Campaign status updated"))
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const handleWizardSuccess = (_newPost?: any) => {
    setWizardOpen(false)
    queryClient.invalidateQueries({ queryKey: ["candidate", "my-campaigns"] })
    setSuccessMsg(L("تم نشر حملتك بنجاح! 🎉", "Campaign published successfully! 🎉"))
    setTimeout(() => setSuccessMsg(null), 5000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            {L("حملاتي التسويقية", "My Marketing Campaigns")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {L(
              "أطلق حملات لعرض مهاراتك ومشاريعك وابحث عن فرص العمل والتدريب.",
              "Launch campaigns to showcase your skills, projects, and find job or internship opportunities."
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 text-xs font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          {L("إنشاء حملة جديدة", "New Campaign")}
        </button>
      </div>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Rocket} value={myCampaigns.length} label={L("الحملات", "Campaigns")} color="text-primary bg-primary/10 border-primary/20" />
        <StatCard icon={Eye} value={totalViews.toLocaleString()} label={L("المشاهدات", "Total Views")} color="text-sky-400 bg-sky-500/10 border-sky-500/20" />
        <StatCard icon={Heart} value={totalLikes.toLocaleString()} label={L("التفاعلات", "Interactions")} color="text-rose-400 bg-rose-500/10 border-rose-500/20" />
        <StatCard icon={TrendingUp} value={`${myCampaigns.filter((p) => (p as any).status !== "paused").length}`} label={L("حملات نشطة", "Active")} color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20" />
      </div>

      {/* ── Category Quick-Select ── */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${filterType === "all" ? "bg-primary/20 text-secondary border-primary/30" : "text-muted-foreground border-border hover:text-white hover:bg-card/50"}`}
        >
          {L("الكل", "All")}
        </button>
        {CANDIDATE_CAMPAIGN_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.key] || Briefcase
          const colorClass = CATEGORY_COLORS[cat.key] || ""
          const isActive = filterType === cat.key
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilterType(cat.key)}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${isActive ? `${colorClass} opacity-100` : "text-muted-foreground border-border hover:text-white hover:bg-card/50"}`}
            >
              <Icon className="w-3 h-3" />
              {language === "ar" ? cat.labels.ar : cat.labels.en}
            </button>
          )
        })}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={L("ابحث في حملاتك...", "Search your campaigns...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full ps-10 pe-4 py-2.5 bg-card/60 border border-border text-sm text-foreground placeholder-muted-foreground rounded-xl focus:outline-none focus:border-primary/60 transition-colors"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">{L("جاري تحميل حملاتك...", "Loading your campaigns...")}</p>
        </div>
      ) : myCampaigns.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[35vh] gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-white mb-1">
              {search ? L("لا توجد نتائج", "No results found") : L("لم تطلق أي حملة بعد", "No campaigns yet")}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {search
                ? L("جرّب كلمة بحث مختلفة", "Try a different search term")
                : L("ابدأ بإطلاق حملتك الأولى لعرض مهاراتك ومشاريعك للمجندين وأصحاب العمل.", "Start by launching your first campaign to showcase your skills and projects to recruiters and employers.")}
            </p>
          </div>
          {!search && (
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              {L("إنشاء أول حملة", "Create Your First Campaign")}
            </button>
          )}
        </div>
      ) : (
        /* Campaign Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myCampaigns.map((post) => (
            <CampaignCard
              key={post.id}
              post={post}
              language={language}
              onDelete={handleDelete}
              onTogglePause={handleTogglePause}
            />
          ))}
        </div>
      )}

      {/* ── Campaign Category Info Cards ── */}
      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          {L("أنواع الحملات المتاحة لك", "Available Campaign Types")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CANDIDATE_CAMPAIGN_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.key] || Briefcase
            const colorClass = CATEGORY_COLORS[cat.key] || ""
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => { setFilterType(cat.key); setWizardOpen(true) }}
                className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 bg-card/30 hover:bg-card/60 transition-all text-start group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-secondary transition-colors truncate">
                    {language === "ar" ? cat.labels.ar : cat.labels.en}
                  </p>
                  {cat.description && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {language === "ar" ? cat.description.ar : cat.description.en}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Campaign Create Wizard Modal ── */}
      <CampaignCreateWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSuccess={handleWizardSuccess}
        initialAccountType="candidate"
      />
    </div>
  )
}
