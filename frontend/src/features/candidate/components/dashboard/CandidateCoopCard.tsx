/**
 * features/candidate/components/dashboard/CandidateCoopCard.tsx
 *
 * Co-op Training & Academic Supervision Dashboard Widget for Candidates/Students.
 * Connects the candidate directly to their 400h Graduation Co-op Command Center.
 */
import { Link } from "react-router-dom"
import { GraduationCap, Building, Clock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/i18n"
import { ROUTES } from "@/config/routes"

export function CandidateCoopCard() {
  const { isRTL, language } = useTranslation()

  const tl = (ar: string, en: string, hi: string) => {
    return language === "ar" ? ar : language === "hi" ? hi : en
  }

  // Active student mock co-op state
  const completedHours = 340
  const totalHours = 400
  const progressPct = Math.round((completedHours / totalHours) * 100)
  const hostCompany = "أرامكو السعودية - مركز الابتكار الرقمي"
  const academicSupervisor = "د. خالد بن إبراهيم السليمان"
  const industryMentor = "م. طارق العتيبي"

  return (
    <div className="relative overflow-hidden rounded-3xl border border-secondary/35 bg-gradient-to-r from-secondary/15 via-[#0b1b36] to-card p-6 shadow-xl backdrop-blur-md">
      {/* Signature top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-emerald-400 to-primary" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/20 text-secondary border border-secondary/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{tl("التدريب التعاوني والإشراف الأكاديمي", "Cooperative Training & Academic Supervision", "सहकारी प्रशिक्षण और शैक्षणिक पर्यवेक्षण")}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{tl("تدريب نشط معتمد", "Active Accredited Co-op", "सक्रिय प्रशिक्षण")}</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-background/60 border border-border">
              {tl("جامعة الملك فيصل • كلية علوم الحاسب", "KFU • College of Computer Sciences", "केएफयू • कंप्यूटर विज्ञान")}
            </span>
          </div>

          <h3 className="text-base md:text-lg font-black text-white font-heading tracking-tight mt-1">
            {hostCompany}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {tl(
              "أنت مسجل حالياً في برنامج التدريب الميداني للتخرج. تابع ساعاتك المعتمدة وسجل الأسابيع، وتواصل مع الدكتور المشرف والمدرب بالشركة.",
              "Enrolled in graduating senior co-op internship. Track your verified hours, weekly logbook, and connect with your academic doctor and mentor.",
              "स्नातक इंटर्नशिप में नामांकित। अपने घंटे ट्रैक करें और अपने डॉक्टर और ट्रेनर से जुड़ें।"
            )}
          </p>

          {/* Quick Dual Mentorship Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-muted-foreground">{tl("المشرف الأكاديمي:", "Faculty Doctor:", "डॉक्टर:")}</span>
              <span className="font-bold text-white">{academicSupervisor}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Building className="w-3.5 h-3.5 text-secondary" />
              <span className="text-muted-foreground">{tl("المشرف المهني:", "Industry Mentor:", "मेंटर:")}</span>
              <span className="font-bold text-secondary">{industryMentor}</span>
            </div>
          </div>
        </div>

        {/* Progress & Direct Action */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-end">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>{tl("ساعات التخرج المنجزة:", "Logged Hours:", "पूरे किए गए घंटे:")}</span>
              <span className="font-black text-white font-mono">{completedHours} / {totalHours}h</span>
              <span className="text-secondary font-mono">({progressPct}%)</span>
            </div>
            <div className="w-48 h-2 rounded-full bg-background border border-border/80 overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Link
            to={ROUTES.CANDIDATE.COOP}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/90 text-primary-foreground text-xs font-black shadow-lg shadow-secondary/25 transition-all transform hover:scale-[1.02]"
          >
            <span>{tl("فتح بوابة التدريب التعاوني الشاملة", "Open Co-op Command Center", "कमांड सेंटर खोलें")}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  )
}
