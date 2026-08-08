/**
 * features/public/pages/JobDetailPage.tsx
 *
 * Public job detail view.
 *
 * Information hierarchy (per roadmap §15):
 *   1. Job identity (title, company, location, type)
 *   2. Salary if disclosed (labeled as range, never fabricated)
 *   3. Description
 *   4. Responsibilities
 *   5. Requirements + Skills
 *   6. Company information
 *   7. Apply CTA (with auth gate for guests)
 *
 * Apply flow for guest:
 *   View Job → Apply → Auth Gate → Sign Up / Login → Candidate flow
 */
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  MapPin, Clock, Calendar, Users, ChevronRight,
  Building2, Briefcase, CheckCircle2, ArrowLeft, Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { EmptyState } from "@/shared/components/states/EmptyState"
import { useJobDetail } from "@/features/jobs/hooks/useJobDetail"
import { useAuthStore } from "@/store/auth.store"
import { ROUTES } from "@/config/routes"
import type { JobDetail } from "@/features/jobs/types/job.types"
import { cn } from "@/lib/utils"

/* ─── Helpers ───────────────────────────────────────────── */

const WORK_TYPE_LABELS: Record<JobDetail["workType"], string> = {
  full_time: "دوام كامل",
  part_time: "دوام جزئي",
  contract: "عقد",
  remote: "عن بعد",
  hybrid: "هجين",
}

const EXPERIENCE_LABELS: Record<JobDetail["experienceLevel"], string> = {
  entry: "مبتدئ",
  mid: "متوسط",
  senior: "أول",
  lead: "قيادي",
  executive: "تنفيذي",
}

function formatSalary(job: JobDetail): string | null {
  if (!job.salary || !job.salary.isDisclosed) return null
  const { min, max, currency, period } = job.salary
  const fmt = new Intl.NumberFormat("ar-SA")
  const periodLabel = period === "monthly" ? "شهرياً" : "سنوياً"
  return `${fmt.format(min)} – ${fmt.format(max)} ${currency} ${periodLabel}`
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate))
}

/* ─── Apply Gate ────────────────────────────────────────── */

function ApplyGate({ jobId }: { jobId: string }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    // Authenticated: show direct apply (will be wired to API when ready)
    return (
      <Button
        size="lg"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 h-12"
        // onClick={handleApply} — wired when /api/v1/jobs/:id/apply is ready
        onClick={() => {
          // API dependency: POST /api/v1/jobs/:id/apply
          // Not yet implemented in backend — see FAEDA_JOBS_FINAL_ROADMAP.md §3.3
          alert("خاصية التقديم قيد الإعداد. سيتم تفعيلها قريباً.")
        }}
      >
        تقديم الآن
      </Button>
    )
  }

  // Guest: show auth gate
  return (
    <div className="bg-card/60 border border-white/10 rounded-2xl p-6 text-center">
      <h3 className="font-bold font-heading text-white mb-2">للتقديم على هذه الوظيفة</h3>
      <p className="text-muted-foreground text-sm mb-6">
        يرجى تسجيل الدخول أو إنشاء حساب مرشح للتقديم على هذه الفرصة.
      </p>
      <div className="flex flex-col gap-3">
        <Button
          asChild
          size="lg"
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
        >
          <Link
            to={ROUTES.AUTH.REGISTER}
            state={{ from: `/jobs/${jobId}`, intent: "apply" }}
          >
            إنشاء حساب مجاناً
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <Link
            to={ROUTES.AUTH.LOGIN}
            state={{ from: `/jobs/${jobId}`, intent: "apply" }}
          >
            تسجيل الدخول
          </Link>
        </Button>
      </div>
    </div>
  )
}

/* ─── Detail Content ────────────────────────────────────── */

function JobDetailContent({ job }: { job: JobDetail }) {
  const salaryText = formatSalary(job)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to={ROUTES.PUBLIC.HOME} className="hover:text-white transition-colors">الرئيسية</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={ROUTES.JOBS.LIST} className="hover:text-white transition-colors">الوظائف</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate max-w-xs">{job.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 min-w-0"
        >
          {/* Job Header Card */}
          <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {/* Company avatar */}
              {job.company.logoUrl ? (
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="w-14 h-14 rounded-xl object-contain bg-white p-1 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-2xl font-heading shrink-0">
                  {job.company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-1 leading-tight">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground">{job.company.name}</p>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 mb-6">
              {job.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {job.isRemote ? `عن بعد (${job.location})` : job.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                {WORK_TYPE_LABELS[job.workType]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 shrink-0" />
                {EXPERIENCE_LABELS[job.experienceLevel]}
              </span>
              {job.isTeamFriendly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-secondary">
                  <Users className="w-4 h-4 shrink-0" />
                  مناسب للفرق
                </span>
              )}
            </div>

            {/* Salary — only if disclosed */}
            {salaryText && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 mb-6">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">الراتب المتوقع</p>
                <p className="text-xl font-extrabold text-white font-mono">{salaryText}</p>
                <p className="text-xs text-muted-foreground mt-1">* قد تختلف القيمة الفعلية حسب الخبرة والمؤهلات</p>
              </div>
            )}

            {/* Posted date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Calendar className="w-3.5 h-3.5" />
              نُشر في {formatDate(job.postedAt)}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-4">عن الوظيفة</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>
          )}

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-5">المهام والمسؤوليات</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-5">المتطلبات والمؤهلات</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {job.skills.length > 0 && (
            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold font-heading text-white mb-4">المهارات المطلوبة</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Company summary */}
          <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading text-white mb-4">عن الشركة</h2>
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-white font-semibold">{job.company.name}</span>
              {job.company.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  موثق
                </span>
              )}
            </div>
            {job.company.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.company.location}
              </p>
            )}
          </section>
        </motion.div>

        {/* Sticky Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn("w-full lg:w-80 shrink-0 lg:sticky lg:top-24 space-y-4")}
        >
          {/* Apply Gate */}
          <ApplyGate jobId={job.id} />

          {/* Share */}
          <button
            onClick={() => navigator.share?.({ title: job.title, url: window.location.href })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <Share2 className="w-4 h-4" />
            مشاركة الوظيفة
          </button>

          {/* Back to jobs */}
          <Link
            to={ROUTES.JOBS.LIST}
            className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لقائمة الوظائف
          </Link>
        </motion.aside>
      </div>
    </div>
  )
}

/* ─── Page Entry Point ──────────────────────────────────── */

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { job, isLoading, isError, isNotFound } = useJobDetail(id ?? "")

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <LoadingState variant="page" />
      </div>
    )
  }

  if (isNotFound) {
    return (
      <EmptyState
        title="الوظيفة غير موجودة"
        description="لم يتم العثور على هذه الوظيفة أو ربما انتهت صلاحيتها."
        action={
          <Button asChild className="rounded-full mt-2">
            <Link to={ROUTES.JOBS.LIST}>تصفح الوظائف</Link>
          </Button>
        }
      />
    )
  }

  if (isError || !job) {
    return (
      <ErrorState
        description="تعذر تحميل تفاصيل الوظيفة."
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <JobDetailContent job={job} />
    </div>
  )
}
