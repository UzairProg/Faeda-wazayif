/**
 * features/public/pages/TeamDetailPage.tsx
 *
 * Public Team Profile & Detail Page.
 * Displays real team information: logo/avatar, track/field, capability breakdown ("ماذا يستطيع الفريق أن ينجز؟"),
 * public team members grid ("أعضاء الفريق"), and linked team-friendly opportunities ("فرص مناسبة للفريق").
 */
import { useRef } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Users,
  MapPin,
  Layers,
  Sparkles,
  CheckCircle2,
  Briefcase,
  User,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useTeamDetail } from "@/features/teams/hooks/useTeams"
import { TeamDetailSkeleton } from "@/features/teams/components/TeamSkeleton"
import { JobCard } from "@/features/public/components/JobCard"
import { ROUTES } from "@/config/routes"

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

function getTeamInitials(name: string): string {
  const clean = name.trim().replace(/^(فريق|مجموعة|مختبر|استوديو)\s+/, "")
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return clean.substring(0, 2).toUpperCase()
}

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { team, isLoading, error } = useTeamDetail(id)
  const jobsSectionRef = useRef<HTMLDivElement>(null)

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col w-full bg-background min-h-screen relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <TeamDetailSkeleton />
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-24 pb-20 text-center">
        <GlassCard className="p-10 max-w-md bg-card/50 border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
            <Users className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">الفريق غير موجود</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            قد يكون الرابط غير صحيح، أو لم يعد ملف هذا الفريق منشوراً بالمنظومة حالياً.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={ROUTES.TEAMS.LIST}>
              <Button className="rounded-xl px-6 bg-primary text-white font-bold text-xs sm:text-sm">
                العودة للفرق التخصصية
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const gradientStyle = getAvatarGradient(team.id)
  const initials = getTeamInitials(team.name)
  const memberCount = team.members?.length || team.memberCount || 0
  const jobsCount = team.jobs?.length || 0

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-24 pb-20">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to={ROUTES.TEAMS.LIST} className="hover:text-white transition-colors flex items-center gap-1">
            <span>الفرق التخصصية</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-white/30 rotate-180" />
          <span className="text-white font-medium truncate">{team.name}</span>
        </div>

        {/* 01. TEAM HEADER CARD */}
        <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative text-start overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            
            <div className="flex items-start gap-5 min-w-0">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                    <Users className="w-3.5 h-3.5" />
                    <span>{memberCount === 1 ? "عضو واحد" : `${memberCount} أعضاء`}</span>
                  </span>

                  {team.generalProgram && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      <span>{team.generalProgram}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
                  {team.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-white/90 font-medium">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{team.location}</span>
                  </span>

                  {team.isRemote && (
                    <span className="inline-flex items-center gap-1 before:content-['•'] before:me-2 before:text-white/20 text-cyan-400 font-semibold">
                      متاح للعمل عن بعد
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end shrink-0">
              <Button
                onClick={scrollToJobs}
                size="lg"
                className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20"
              >
                <Briefcase className="w-4 h-4" />
                <span>الفرص المناسبة ({jobsCount})</span>
              </Button>
            </div>

          </div>

          {/* Quick Header Summary Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">حجم الطاقم</span>
              <span className="font-bold text-white">{memberCount} أعضاء متطابقين</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">نموذج التواجد</span>
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {team.isRemote ? "عن بعد / هجين" : "حضوري"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">المسار التخصصي</span>
              <span className="font-bold text-white truncate block">{team.generalProgram || "غير محدد"}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-muted-foreground block mb-0.5 text-[11px]">الموقع</span>
              <span className="font-bold text-white truncate block">{team.location}</span>
            </div>
          </div>
        </GlassCard>

        {/* MAIN BODY GRID: Left (Capabilities & Members & Jobs) | Right (Team Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ABOUT TEAM */}
            {team.about && (
              <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-3">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>عن الفريق</span>
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {team.about}
                </p>
              </GlassCard>
            )}

            {/* 02. TEAM CAPABILITIES */}
            <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>ماذا يستطيع الفريق أن ينجز؟</span>
                </h2>
                <span className="text-xs font-mono text-primary font-bold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {team.capabilities.length} قدرات
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                يغطي هذا الفريق المهارات والتخصصات التالية ضمن مظلة عمل واحدة:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {team.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cap}</span>
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* 03. TEAM MEMBERS GRID */}
            <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>أعضاء الفريق</span>
                </h2>
                <span className="text-xs font-mono text-white/80 font-bold">
                  {memberCount} أعضاء
                </span>
              </div>

              {team.members && team.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.members.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all"
                    >
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 bg-black/30"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLElement).style.display = "none"
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-base shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold font-heading text-white truncate">{m.name}</h4>
                        <p className="text-xs text-primary font-semibold truncate mb-1">{m.role}</p>

                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {m.skills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground italic">
                  لم يكتمل الملف العام لأعضاء الفريق بعد.
                </p>
              )}
            </GlassCard>

            {/* 04. TEAM OPPORTUNITIES */}
            <div ref={jobsSectionRef} className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>فرص مناسبة للفريق</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary">
                    {jobsCount}
                  </span>
                </h2>
              </div>

              {jobsCount > 0 ? (
                <div className="space-y-4">
                  {team.jobs.map((j, idx) => (
                    <JobCard key={j.id} job={j} index={idx} />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-8 text-center bg-card/40 border-white/10 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
                    <Briefcase className="w-6 h-6 opacity-60" />
                  </div>
                  <h3 className="text-lg font-bold text-white">لا توجد فرص مخصصة للفرق حالياً</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    يمكن لأعضاء الفريق التصفح والتقديم المباشر على كافة الفرص الشاغرة بالمنظومة.
                  </p>
                  <Link to={ROUTES.JOBS.LIST}>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                      تصفح جميع الوظائف
                    </Button>
                  </Link>
                </GlassCard>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN (4 cols): Team Specs Card */}
          <div className="lg:col-span-4 space-y-6">
            
            <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-xl space-y-5">
              <h3 className="text-base font-bold font-heading text-white pb-3 border-b border-white/10">
                مواصفات الفريق
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">المجال العام</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary shrink-0" />
                    {team.generalProgram || "تطوير المنتجات والبرمجيات"}
                  </p>
                </div>

                {team.semiSpecialProgram && (
                  <div>
                    <span className="text-muted-foreground text-[11px] block mb-0.5">التخصص الدقيق</span>
                    <p className="font-semibold text-white">{team.semiSpecialProgram}</p>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">إجمالي الأعضاء</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    {memberCount} أعضاء
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">الموقع الجغرافي</span>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {team.location}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground text-[11px] block mb-0.5">نموذج العمل</span>
                  <p className="font-bold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {team.isRemote ? "متاح للعمل عن بعد / هجين" : "حضوري"}
                  </p>
                </div>

                {team.achievements && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-muted-foreground text-[11px] block mb-1">الإنجازات</span>
                    <p className="text-xs text-emerald-300 font-semibold">✨ {team.achievements}</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Compact Callout */}
            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-start space-y-3">
              <h4 className="font-extrabold font-heading text-white text-base">
                هل ترغب باستقطاب هذا الفريق لمشروعك؟
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                استعرض الفرص المتاحة لديهم أو انشر فرصة تخصصية مخصصة للفرق من حساب الشركة.
              </p>
              <Button
                onClick={scrollToJobs}
                size="sm"
                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 mt-2"
              >
                <span>استعرض الفرص المناسبة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  )
}
