/**
 * features/admin/pages/AdminMarketingPage.tsx
 *
 * Marketing Operations & Creative Assets Governance Center.
 * Organizes:
 * 1. Content Writing (Drafting blogs, articles, employer announcements)
 * 2. Design Assets Hub (Creative repository, banners, branding)
 * 3. Advertising Campaigns (Paid ad tracking, budgets & ROI)
 * Elevated with luxury dark-navy aesthetics, luminous telemetry, and rich creative previews.
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import {
  FileText,
  Palette,
  Megaphone,
  Plus,
  Users,
  Eye,
  Download,
  TrendingUp,
  Sparkles,
  Copy,
  X,
  Target,
} from "lucide-react"
import toast from "react-hot-toast"

interface ContentArticle {
  id: number
  title_ar: string
  title_en: string
  author: string
  category: string
  status: "published" | "draft" | "review"
  views: number
  read_time: string
  updated_at: string
}

interface DesignAsset {
  id: number
  title: string
  designer: string
  dimensions: string
  format: string
  file_url: string
  usage_tag: string
  downloads_count: number
  created_at: string
}

interface AdCampaign {
  id: number
  name: string
  platform: string
  platform_key: "linkedin" | "google" | "x" | "meta"
  budget_sar: number
  spent_sar: number
  impressions: number
  clicks: number
  ctr: string
  status: "active" | "planned" | "completed"
  roi: string
}

const DEFAULT_ARTICLES: ContentArticle[] = [
  {
    id: 1,
    title_ar: "دليل التوظيف في واحة الأحساء: كيف تجذب الكفاءات التقنية الصاعدة وتستبقيها؟",
    title_en: "Employer Guide: Attracting Tech Talent in Al-Ahsa Innovation Oasis",
    author: "أحمد بن عبد الله",
    category: "أدلة أصحاب الأعمال",
    status: "published",
    views: 1420,
    read_time: "5 دقائق",
    updated_at: "2026-10-20",
  },
  {
    id: 2,
    title_ar: "أهم المهارات المطلوبة في خريجي التدريب التعاوني لعام 2026 وفق معايير NCAAA",
    title_en: "Top In-Demand Skills for Co-op Graduates in 2026",
    author: "سارة المنصور",
    category: "إرشاد مهني وأكاديمي",
    status: "published",
    views: 890,
    read_time: "4 دقائق",
    updated_at: "2026-10-23",
  },
  {
    id: 3,
    title_ar: "قصة نجاح حاضنة منشآت جامعة الملك فيصل: من مشروع تخرج إلى تمويل 2.6 مليون",
    title_en: "Success Story: From Graduation Project to SAR 2.6M Funding",
    author: "د. طارق العيسى",
    category: "قصص نجاح وابتكار",
    status: "draft",
    views: 310,
    read_time: "6 دقائق",
    updated_at: "2026-10-24",
  },
]

const DEFAULT_DESIGNS: DesignAsset[] = [
  {
    id: 1,
    title: "بانر إطلاق حاضنة الأعمال والشركات المتخرجة والشركات الشريكة",
    designer: "منى الشمري (مصممة واجهات)",
    dimensions: "1920x1080 px",
    format: "PNG / WebP",
    file_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    usage_tag: "حملات لينكد إن وجوجل",
    downloads_count: 58,
    created_at: "2026-10-18",
  },
  {
    id: 2,
    title: "مجموعة أيقونات ورموز القطاعات التنموية (Vision 2030 Icons)",
    designer: "فهد العتيبي (مصمم هويات)",
    dimensions: "Vector SVG",
    format: "SVG / AI",
    file_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    usage_tag: "واجهات الموقع والتقارير",
    downloads_count: 142,
    created_at: "2026-10-15",
  },
  {
    id: 3,
    title: "دليل الهوية البصرية للشركات المحتضنة (Brand Guidelines & Social Kit)",
    designer: "نورة القحطاني (مصممة جرافيك)",
    dimensions: "PDF / Figma",
    format: "Figma / PDF",
    file_url: "https://images.unsplash.com/photo-1542744094-3a3172720a63?w=800&auto=format&fit=crop&q=80",
    usage_tag: "قوالب السوشيال ميديا",
    downloads_count: 94,
    created_at: "2026-10-10",
  },
]

const DEFAULT_CAMPAIGNS: AdCampaign[] = [
  {
    id: 1,
    name: "حملة استقطاب الشركات الشريكة المستهدفة (مستهدف 30 شركة)",
    platform: "LinkedIn Ads + X Pro",
    platform_key: "linkedin",
    budget_sar: 15000,
    spent_sar: 11200,
    impressions: 89400,
    clicks: 3420,
    ctr: "3.82%",
    status: "active",
    roi: "3.8x",
  },
  {
    id: 2,
    name: "حملة استقطاب الكوادر الوطنية لبرنامج التدريب التعاوني المرموق",
    platform: "Google Search + Instagram Ads",
    platform_key: "google",
    budget_sar: 8000,
    spent_sar: 7850,
    impressions: 124000,
    clicks: 8190,
    ctr: "6.60%",
    status: "active",
    roi: "4.5x",
  },
  {
    id: 3,
    name: "حملة الترويج لخدمة باقة المنشآت الناشئة (Starter Plan Q4)",
    platform: "Meta Ads (Facebook & IG)",
    platform_key: "meta",
    budget_sar: 5000,
    spent_sar: 2100,
    impressions: 45000,
    clicks: 1850,
    ctr: "4.11%",
    status: "active",
    roi: "3.2x",
  },
]

export function AdminMarketingPage() {
  const { language, isRTL } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const [activeTab, setActiveTab] = useState<"content" | "design" | "ads">("content")
  const [articles, setArticles] = useState<ContentArticle[]>(DEFAULT_ARTICLES)
  const [designs] = useState<DesignAsset[]>(DEFAULT_DESIGNS)
  const [campaigns] = useState<AdCampaign[]>(DEFAULT_CAMPAIGNS)

  // Draft article modal
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [articleForm, setArticleForm] = useState({
    title_ar: "",
    title_en: "",
    category: "أدلة أصحاب الأعمال",
    author: "أحمد بن عبد الله (محرر محتوى)",
    read_time: "5 دقائق",
  })

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleForm.title_ar.trim()) return

    const newArticle: ContentArticle = {
      id: Date.now(),
      title_ar: articleForm.title_ar,
      title_en: articleForm.title_en,
      author: articleForm.author,
      category: articleForm.category,
      status: "draft",
      views: 0,
      read_time: articleForm.read_time,
      updated_at: new Date().toISOString().split("T")[0],
    }

    setArticles([newArticle, ...articles])
    setIsArticleModalOpen(false)
    setArticleForm({
      title_ar: "",
      title_en: "",
      category: "أدلة أصحاب الأعمال",
      author: "أحمد بن عبد الله (محرر محتوى)",
      read_time: "5 دقائق",
    })
    toast.success(L("تم حفظ مسودة المقال التسويقي بنجاح!", "Content draft created successfully!"))
  }

  const handleCopyLink = (title: string) => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(L(`تم نسخ رابط "${title}" إلى الحافظة!`, "Link copied to clipboard!"))
  }

  // Aggregate stats
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
  const totalBudget = campaigns.reduce((acc, c) => acc + c.budget_sar, 0)
  const totalDownloads = designs.reduce((acc, d) => acc + d.downloads_count, 0)

  return (
    <div className="space-y-8 pb-16" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── LUXURY HERO HEADER WITH AMBIENT LIGHT MESH ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#071326] via-[#0b1f3d] to-[#050c18] p-7 md:p-10 backdrop-blur-3xl shadow-2xl transition-all">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-purple-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Accent Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 via-sky-400 to-amber-400 shadow-md shadow-indigo-500/20" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-inner shadow-indigo-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{L("مركز العمليات التسويقية والمحتوى البصري", "Marketing & Creative Operations Hub", "विपणन एवं रचनात्मक संचालन")}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-purple-300 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{L("صناعة الهوية ونمو الاستقطاب", "Brand Identity & Talent Acquisition Growth", "ब्रांड पहचान और विकास")}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white md:text-4xl tracking-tight font-heading leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {L("إدارة كتابة المحتوى، التصاميم، والحملات الإعلانية", "Content Studio, Creative Assets & Ad Campaigns", "सामग्री, डिज़ाइन और विज्ञापन प्रबंधन")}
            </h1>

            <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-normal">
              {L(
                "مركز تنفيذي متكامل يربط بين كتّاب المحتوى، مصممي الهوية البصرية، ومديري الحملات الإعلانية المدفوعة لحوكمة التسويق ومضاعفة العائد الاستثماري (ROI).",
                "Unified command center orchestrating content copywriters, visual branding designers, and paid ad media buyers for maximum marketing ROI and compliance.",
                "लेखकों, डिजाइनरों और विज्ञापन प्रबंधकों के लिए पूरक अनुमतियों کے साथ एकीकृत केंद्र।"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsArticleModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 text-white text-xs font-black shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{L("إنشاء مسودة محتوى جديدة", "Draft New Content", "नया ड्राफ्ट बनाएं")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MARKETING TELEMETRY CARDS ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-indigo-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
            <span className="font-heading">{L("المقالات المنشورة والمسودات", "Articles & Content Hub", "लेख और सामग्री")}</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {articles.length} <span className="text-xs text-slate-400 font-normal font-sans">{L("مقالات", "articles", "लेख")}</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>2,620 {L("مشاهدة تراكمية", "cumulative reads", "कुल पाठक")}</span>
          </p>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-purple-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span className="font-heading">{L("الأصول البصرية والتصاميم", "Design & Brand Assets", "डिज़ाइन फ़ाइलें")}</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
              <Palette className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {designs.length} <span className="text-xs text-slate-400 font-normal font-sans">{L("أصول معتمدة", "creative kits", "फ़ाइलें")}</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>{totalDownloads} {L("عملية تحميل واستخدام", "downloads", "डाउनलोड")}</span>
          </p>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-sky-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-sky-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-sky-400">
            <span className="font-heading">{L("إجمالي وصول الحملات", "Total Ad Impressions", "कुल विज्ञापन पहुंच")}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <Users className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {totalImpressions.toLocaleString()}+
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-400" />
            <span>13,460 {L("نقرة وتحويل تفاعلي", "engaged clicks", "क्लिक")}</span>
          </p>
        </div>

        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-3 group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="font-heading">{L("الميزانية ومتوسط العائد (ROI)", "Blended Budget & ROI", "विज्ञापन बजट एवं आरओआई")}</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {totalBudget.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">{L("ر.س", "SAR", "SAR")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              3.8x {L("عائد استثماري مدمج", "blended ROI", "आरओआई")}
            </span>
          </div>
        </div>
      </div>

      {/* ── SEGMENTED NAVIGATION TABS ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "content"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{L("كتابة المحتوى والمدونات", "Content & Articles", "सामग्री लेखन")}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white font-mono">{articles.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("design")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "design"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{L("مكتبة التصاميم والهوية البصرية", "Design Assets Library", "डिज़ाइन हब")}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white font-mono">{designs.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ads")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ads"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-black"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{L("الحملات الإعلانية والميزانيات", "Paid Ad Campaigns", "विज्ञापन अभियान")}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white font-mono">{campaigns.length}</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          {L("نظام إدارة التسويق الرقمي الموحد", "Unified Marketing Operations System", "एकीकृत विपणन प्रणाली")}
        </span>
      </div>

      {/* ── TAB 1: CONTENT & ARTICLES ── */}
      {activeTab === "content" && (
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((art, index) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group p-6 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl backdrop-blur-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                    {art.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      art.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {art.status === "published" ? L("منشور رسمي", "Published", "प्रकाशित") : L("مسودة قيد التحرير", "Draft", "ड्राफ्ट")}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {art.title_ar}
                </h3>
                {art.title_en && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {art.title_en}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{art.author}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-slate-500">{art.read_time}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 font-mono">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{art.views}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── TAB 2: DESIGN ASSETS ── */}
      {activeTab === "design" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((des, index) => (
            <motion.div
              key={des.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-[2.5rem] border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between p-5 backdrop-blur-2xl hover:shadow-2xl"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/30 transition-all">
                  <img
                    src={des.file_url}
                    alt={des.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-black/75 text-white backdrop-blur-md border border-white/15">
                    {des.dimensions}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-purple-500 text-white font-mono shadow-md">
                    {des.format}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {des.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{des.designer}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{des.created_at}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{des.usage_tag}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(des.title)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                    title={L("نسخ الرابط", "Copy link", "लिंक कॉपी करें")}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success(L("جاري تنزيل الملف الأصلي...", "Downloading file..."))}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{des.downloads_count}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── TAB 3: AD CAMPAIGNS ── */}
      {activeTab === "ads" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-4 text-start">{L("اسم الحملة التسويقية", "Campaign Name", "अभियान")}</th>
                  <th className="px-5 py-4 text-start">{L("المنصة الإعلانية", "Platform", "मंच")}</th>
                  <th className="px-5 py-4 text-center">{L("الميزانية المعتمدة", "Allocated Budget", "बजट")}</th>
                  <th className="px-5 py-4 text-center">{L("المصروف الفعلي", "Spent Amount", "खर्च")}</th>
                  <th className="px-5 py-4 text-center">{L("الوصول (Impressions)", "Impressions", "दिखाया गया")}</th>
                  <th className="px-5 py-4 text-center">{L("النقرات وCTR", "Clicks & CTR", "क्लिक")}</th>
                  <th className="px-5 py-4 text-center">{L("العائد الاستثماري ROI", "ROI Multiplier", "आरओआई")}</th>
                  <th className="px-5 py-4 text-end">{L("الحالة", "Status", "स्थिति")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {campaigns.map((camp) => {
                  const percentSpent = Math.round((camp.spent_sar / camp.budget_sar) * 100)
                  return (
                    <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <span>{camp.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-semibold">
                          {camp.platform}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-mono font-bold text-white">
                        {camp.budget_sar.toLocaleString()} SAR
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="font-mono text-slate-300 font-semibold">
                          {camp.spent_sar.toLocaleString()} SAR
                        </div>
                        <div className="w-24 mx-auto mt-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${percentSpent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{percentSpent}% مستهلك</span>
                      </td>
                      <td className="px-5 py-4 text-center font-mono text-slate-300">
                        {camp.impressions.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-mono font-bold text-emerald-400 block">{camp.clicks.toLocaleString()}</span>
                        <span className="text-[10px] font-mono text-slate-500">CTR {camp.ctr}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm">
                          {camp.roi}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-end">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{L("نشطة", "Active", "सक्रिय")}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE CONTENT MODAL ── */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {L("إنشاء مسودة محتوى تسويقي جديد", "Draft New Content", "नया कंटेंट ड्राफ्ट")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {L("يتم الحفظ كمسودة قبل المراجعة والاعتماد للنشر", "Drafts are reviewed before publication", "प्रकाशन से पहले समीक्षा")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {L("عنوان المقال (بالعربية)", "Article Title (Arabic)", "शीर्षक (अरबी)")} *
                </label>
                <input
                  type="text"
                  required
                  value={articleForm.title_ar}
                  onChange={(e) => setArticleForm({ ...articleForm, title_ar: e.target.value })}
                  placeholder={L("عنوان المقال التسويقي...", "Title in Arabic...", "शीर्षक...")}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {L("العنوان بالإنجليزية (اختياري)", "Title (English)", "शीर्षक (अंग्रेजी)")}
                </label>
                <input
                  type="text"
                  value={articleForm.title_en}
                  onChange={(e) => setArticleForm({ ...articleForm, title_en: e.target.value })}
                  placeholder="English title..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {L("التصنيف", "Category", "श्रेणी")}
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="أدلة أصحاب الأعمال">{L("أدلة أصحاب الأعمال", "Employer Guides", "गाइड")}</option>
                    <option value="إرشاد مهني وأكاديمي">{L("إرشاد مهني وأكاديمي", "Career & Academic", "मार्गदर्शन")}</option>
                    <option value="قصص نجاح وابتكار">{L("قصص نجاح وابتكار", "Success Stories", "सफलता")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {L("وقت القراءة التقديري", "Estimated Read Time", "समय")}
                  </label>
                  <input
                    type="text"
                    value={articleForm.read_time}
                    onChange={(e) => setArticleForm({ ...articleForm, read_time: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                >
                  {L("إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all"
                >
                  {L("حفظ كمسودة", "Save Draft", "ड्राफ्ट सहेजें")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
