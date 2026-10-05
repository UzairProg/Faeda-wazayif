/**
 * features/company/pages/CompanyCampaignsPage.tsx
 *
 * LinkedIn Recruiter-style Hiring & Recruitment Campaigns Command Center.
 * Enables companies to define target talent personas, launch campaigns,
 * track outreach funnels, and manage talent pipelines.
 */
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import {
  Target,
  Plus,
  Users,
  Send,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Layers,
  TrendingUp,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { useTranslation } from "@/i18n"
import { campaignsService } from "@/features/campaigns/services/campaigns.service"
import type { CreateCampaignPayload } from "@/features/campaigns/types/campaign.types"
import { ROUTES } from "@/config/routes"

export function CompanyCampaignsPage() {
  const { language, isRTL } = useTranslation()
  const queryClient = useQueryClient()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    target_roles: "Senior Full-Stack Engineer, AI Specialist",
    target_skills: "React, TypeScript, Python, Docker",
    target_location: "Riyadh, Saudi Arabia",
    experience_level: "Mid level",
    min_salary: 18000,
    max_salary: 28000,
    outreach_template: "مرحباً {{name}}، لفتت انتباهنا مهاراتك المتميزة في {{role}}. يسعدنا دعوتك للانضمام إلى حملتنا الوظيفية الحصرية.",
  })

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["company", "campaigns"],
    queryFn: () => campaignsService.getCompanyCampaigns(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsService.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "campaigns"] })
      setCreateModalOpen(false)
      setFormData({
        title: "",
        tagline: "",
        description: "",
        target_roles: "Senior Full-Stack Engineer, AI Specialist",
        target_skills: "React, TypeScript, Python, Docker",
        target_location: "Riyadh, Saudi Arabia",
        experience_level: "Mid level",
        min_salary: 18000,
        max_salary: 28000,
        outreach_template: "مرحباً {{name}}، لفتت انتباهنا مهاراتك المتميزة في {{role}}.",
      })
    },
  })

  // Summary Metrics
  const totalCampaigns = campaigns.length
  const totalSourced = campaigns.reduce((acc, c) => acc + (c.stats?.total_talent || 0), 0)
  const totalContacted = campaigns.reduce((acc, c) => acc + (c.stats?.contacted || 0), 0)
  const totalHired = campaigns.reduce((acc, c) => acc + (c.stats?.hired || 0), 0)
  const avgResponseRate =
    campaigns.length > 0
      ? Math.round(
          campaigns.reduce((acc, c) => acc + (c.stats?.response_rate || 0), 0) / campaigns.length
        )
      : 0

  const Chevron = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-start">
      
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "نظام التنقيب والحملات النشطة" : "Active Sourcing & Campaign Engine"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {language === "ar" ? "الحملات الوظيفية وإدارة خط الاستقطاب" : "Recruitment Campaigns & Talent Pipelines"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {language === "ar"
              ? "أنشئ حملات مستهدفة بمواصفات دقيقة، ودع الذكاء الاصطناعي يطابق الكفاءات من قاعدة البيانات للتواصل الفوري وإدارة مراحل التوظيف."
              : "Define target candidate personas, let AI match qualified talent across the database, and execute 1-click InMail outreach with full pipeline tracking."}
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="rounded-xl px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold gap-2 shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === "ar" ? "إطلاق حملة استقطاب جديدة" : "Launch New Campaign"}</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <GlassCard className="p-4 sm:p-5 bg-card/60 border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{language === "ar" ? "إجمالي الحملات" : "Active Campaigns"}</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalCampaigns}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> {language === "ar" ? "نشطة الآن" : "Live now"}
          </span>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 bg-card/60 border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{language === "ar" ? "كفاءات تم مطابقتها" : "Discovered Talent"}</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalSourced}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {language === "ar" ? "مطابقة بالذكاء الاصطناعي" : "AI Persona Matched"}
          </span>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 bg-card/60 border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{language === "ar" ? "دعوات تم إرسالها" : "Outreach Sent"}</span>
            <Send className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalContacted}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {language === "ar" ? "عبر المحادثات الفورية" : "Via InMail Invites"}
          </span>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 bg-card/60 border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{language === "ar" ? "معدل الاستجابة" : "Response Rate"}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{avgResponseRate}%</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {language === "ar" ? "متوسط التفاعل الإيجابي" : "Candidate Engagement"}
          </span>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5 bg-card/60 border-white/10 rounded-2xl relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">{language === "ar" ? "تم توظيفهم" : "Hired Candidates"}</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{totalHired}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {language === "ar" ? "نجاح نهائي للحملات" : "Full Placement"}
          </span>
        </GlassCard>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{language === "ar" ? "الحملات الجارية وخطوط الفرز" : "Active Campaigns & Sourcing Pipelines"}</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm font-mono">{language === "ar" ? "جاري تحميل الحملات..." : "Loading campaigns..."}</p>
          </div>
        ) : campaigns.length === 0 ? (
          <GlassCard className="p-12 text-center bg-card/40 border-white/10 rounded-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-muted-foreground">
              <Target className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {language === "ar" ? "لا توجد حملات توظيف حتى الآن" : "No active hiring campaigns yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {language === "ar"
                ? "ابدأ حملتك الأولى لاكتشاف أفضل الكفاءات المطابقة لاحتياجات فريقك تلقائياً والتواصل معهم بدعوة مخصصة."
                : "Launch your first campaign to automatically discover top-tier talent matching your tech stack."}
            </p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="rounded-xl px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>{language === "ar" ? "إطلاق حملة الآن" : "Create First Campaign"}</span>
            </Button>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <GlassCard
                key={camp.id}
                className="p-6 bg-card/60 hover:bg-card/80 border-white/10 hover:border-emerald-500/30 transition-all rounded-2xl shadow-xl relative overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-700/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-extrabold text-xl shadow-inner">
                      <Target className="w-7 h-7" />
                    </div>

                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                          {camp.status.toUpperCase()}
                        </span>
                        {camp.experience_level && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-medium">
                            {camp.experience_level}
                          </span>
                        )}
                        {camp.target_location && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{camp.target_location}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-heading text-white group-hover:text-emerald-300 transition-colors">
                        {camp.title}
                      </h3>

                      {camp.tagline && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {camp.tagline}
                        </p>
                      )}

                      {/* Skills Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {camp.target_skills.slice(0, 5).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {camp.target_skills.length > 5 && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            +{camp.target_skills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Funnel Progress & Stats */}
                  <div className="flex flex-wrap items-center gap-6 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          {language === "ar" ? "مكتشفين" : "Sourced"}
                        </span>
                        <span className="text-base font-bold text-white font-mono">
                          {camp.stats?.total_talent || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          {language === "ar" ? "تم التواصل" : "Contacted"}
                        </span>
                        <span className="text-base font-bold text-blue-400 font-mono">
                          {camp.stats?.contacted || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          {language === "ar" ? "استجابوا" : "Replied"}
                        </span>
                        <span className="text-base font-bold text-amber-400 font-mono">
                          {camp.stats?.replied || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block mb-0.5">
                          {language === "ar" ? "تم التوظيف" : "Hired"}
                        </span>
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          {camp.stats?.hired || 0}
                        </span>
                      </div>
                    </div>

                    <Link to={ROUTES.COMPANY.CAMPAIGN_DETAIL(camp.id)}>
                      <Button className="rounded-xl px-5 bg-white/5 hover:bg-emerald-500 text-white font-bold border border-white/10 hover:border-emerald-500 transition-all gap-1.5 group/btn">
                        <span>{language === "ar" ? "فتح خط الفرز والكفاءات" : "Open Talent Pipeline"}</span>
                        <Chevron className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>

                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE CAMPAIGN MODAL ────────────────────────────── */}
      {createModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <GlassCard className="w-full max-w-2xl bg-card border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 text-start">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">
                      {language === "ar" ? "إطلاق حملة استقطاب مستهدفة" : "Launch Talent Campaign"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === "ar"
                        ? "حدد مواصفات المرشح المثالي وسيقوم النظام بمطابقة الكفاءات تلقائياً"
                        : "Specify the ideal candidate persona and let AI scan the talent database"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createMutation.mutate({
                    title: formData.title,
                    tagline: formData.tagline,
                    description: formData.description,
                    target_roles: formData.target_roles,
                    target_skills: formData.target_skills,
                    target_location: formData.target_location,
                    experience_level: formData.experience_level,
                    min_salary: formData.min_salary,
                    max_salary: formData.max_salary,
                    outreach_template: formData.outreach_template,
                  })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    {language === "ar" ? "عنوان الحملة الوظيفية *" : "Campaign Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === "ar" ? "مثال: حملة استقطاب مهندسي الذكاء الاصطناعي 2026" : "e.g. AI & Cloud Engineering Talent Drive"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    {language === "ar" ? "الشعار أو الهدف المختصر" : "Tagline / Target Objective"}
                  </label>
                  <input
                    type="text"
                    placeholder={language === "ar" ? "مثال: بناء حلول سحابية سيادية لمنظومات الطاقة" : "e.g. Building next-gen cloud platforms for enterprise"}
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      {language === "ar" ? "المسميات الوظيفية المستهدفة" : "Target Roles (comma separated)"}
                    </label>
                    <input
                      type="text"
                      placeholder="Frontend, AI Specialist, Full-Stack"
                      value={formData.target_roles}
                      onChange={(e) => setFormData({ ...formData, target_roles: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      {language === "ar" ? "المهارات التقنية المطلوبة" : "Target Skills (comma separated)"}
                    </label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Python, PyTorch"
                      value={formData.target_skills}
                      onChange={(e) => setFormData({ ...formData, target_skills: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      {language === "ar" ? "المنطقة / المدينة" : "Location"}
                    </label>
                    <input
                      type="text"
                      placeholder="Riyadh, Saudi Arabia"
                      value={formData.target_location}
                      onChange={(e) => setFormData({ ...formData, target_location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      {language === "ar" ? "مستوى الخبرة" : "Experience Level"}
                    </label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1726] border border-white/10 text-white focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    >
                      <option value="Entry level">{language === "ar" ? "مبتدئ (0-2 سنوات)" : "Entry level (0-2 yrs)"}</option>
                      <option value="Mid level">{language === "ar" ? "متوسط (3-5 سنوات)" : "Mid level (3-5 yrs)"}</option>
                      <option value="Senior">{language === "ar" ? "أول / محترف (5+ سنوات)" : "Senior (5+ yrs)"}</option>
                      <option value="Lead">{language === "ar" ? "قيادي (8+ سنوات)" : "Lead / Executive"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    {language === "ar" ? "نص رسالة التواصل الفوري (InMail Template)" : "Personalized InMail Outreach Message"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="مرحباً {{name}}، لفتت انتباهنا خبراتك في {{role}}..."
                    value={formData.outreach_template}
                    onChange={(e) => setFormData({ ...formData, outreach_template: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-medium"
                  />
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    {language === "ar" ? "المتغيرات المتاحة: {{name}} اسم المرشح، {{company}} اسم شركتك" : "Variables: {{name}} candidate name, {{company}} company"}
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateModalOpen(false)}
                    className="rounded-xl border-white/10 bg-white/5 text-white"
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="rounded-xl px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>{language === "ar" ? "تأكيد وإطلاق الحملة" : "Confirm & Launch"}</span>
                  </Button>
                </div>
              </form>

            </GlassCard>
          </div>
        </ModalPortal>
      )}

    </div>
  )
}
