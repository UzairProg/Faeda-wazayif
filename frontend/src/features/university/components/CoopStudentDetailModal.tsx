/**
 * features/university/components/CoopStudentDetailModal.tsx
 *
 * Comprehensive Co-op Student Detail Dossier & Academic Command Center.
 * Dedicated multi-tab dossier for supervising professors and university administrators:
 * - Tab 1: Overview & Company Placement (Host Company, Workplace Trainer, Progress Gauge, Timeline)
 * - Tab 2: Hours & Weekly Logbook (Weekly training entries, tasks, technologies, approval badges)
 * - Tab 3: Academic Evaluation & Grades (Midterm 30pts, Final 70pts, Letter Grade, Fast Evaluation Editor)
 * - Tab 4: Field Visits & Supervision Meetings (Scheduled visits, meeting modes, agendas, quick scheduler)
 * - Tab 5: Official Documents & Accreditation (Certified Letters, Logbooks, Official Printable Certificate)
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import { tl } from "../utils/universityLocalization"
import { universityService } from "../services/university.service"
import type {
  CoopSupervisedStudent,
  ProfessorSupervisionScheduleItem,
  ProfessorInfo,
  CoopEvaluationPayload,
} from "../types/university.types"
import {
  GraduationCap,
  Building,
  UserCheck,
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Phone,
  Mail,
  Copy,
  Check,
  Printer,
  X,
  FileText,
  ShieldCheck,
  Star,
  ExternalLink,
  Edit3,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
} from "lucide-react"

interface CoopStudentDetailModalProps {
  student: CoopSupervisedStudent | null
  isOpen: boolean
  onClose: () => void
  schedules?: ProfessorSupervisionScheduleItem[]
  professor?: ProfessorInfo | null
  onScheduleVisit?: (student: CoopSupervisedStudent) => void
  onUpdateEvaluation?: (student: CoopSupervisedStudent) => void
  onRefreshStudent?: (updatedStudent: CoopSupervisedStudent) => void
  onViewAsStudent?: (student: CoopSupervisedStudent) => void
}

type TabType = "overview" | "logbook" | "evaluation" | "visits" | "documents"

export function CoopStudentDetailModal({
  student,
  isOpen,
  onClose,
  schedules = [],
  professor,
  onScheduleVisit,
  onUpdateEvaluation,
  onRefreshStudent,
  onViewAsStudent,
}: CoopStudentDetailModalProps) {
  const { isRTL, language } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isPrintMode, setIsPrintMode] = useState(false)
  const [isEditingEval, setIsEditingEval] = useState(false)
  const [isSavingEval, setIsSavingEval] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Local evaluation edit state
  const [editForm, setEditForm] = useState<CoopEvaluationPayload>({
    midterm_score: student?.midterm_score ?? 28,
    final_score: student?.final_score ?? 65,
    completed_hours: student?.completed_hours ?? 340,
    status: student?.status ?? "تدريب نشط",
    notes: student?.notes ?? "",
  })

  // Synchronize editForm when student changes
  useState(() => {
    if (student) {
      setEditForm({
        midterm_score: student.midterm_score ?? 28,
        final_score: student.final_score ?? 65,
        completed_hours: student.completed_hours ?? 340,
        status: student.status ?? "تدريب نشط",
        notes: student.notes ?? "",
      })
    }
  })

  if (!isOpen || !student) return null

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Filter scheduled visits for this student
  const studentVisits = schedules.filter(
    (s) =>
      s.student_name.trim().toLowerCase() === student.student_name.trim().toLowerCase() ||
      s.company_name.trim().toLowerCase() === student.company_name.trim().toLowerCase()
  )

  // Calculate Cumulative Academic Score & Grade
  const midterm = student.midterm_score ?? 28
  const finalScore = student.final_score ?? (student.status.includes("مكتمل") ? 66 : null)
  const totalScore = finalScore !== null ? midterm + finalScore : null

  const getLetterGrade = (score: number) => {
    if (score >= 95) return { grade: "A+", label_ar: "ممتاز مرتفع", label_en: "High Distinction", label_hi: "सर्वोच्च विशिष्टता", color: "text-emerald-400" }
    if (score >= 90) return { grade: "A", label_ar: "ممتاز", label_en: "Excellent", label_hi: "उत्कृष्ट", color: "text-emerald-400" }
    if (score >= 85) return { grade: "B+", label_ar: "جيد جداً مرتفع", label_en: "Very Good+", label_hi: "बहुत अच्छा+", color: "text-secondary" }
    if (score >= 80) return { grade: "B", label_ar: "جيد جداً", label_en: "Very Good", label_hi: "बहुत अच्छा", color: "text-secondary" }
    if (score >= 75) return { grade: "C+", label_ar: "جيد مرتفع", label_en: "Good+", label_hi: "अच्छा+", color: "text-amber-400" }
    return { grade: "C", label_ar: "جيد", label_en: "Pass", label_hi: "उत्तीर्ण", color: "text-amber-400" }
  }

  const gradeInfo = totalScore !== null ? getLetterGrade(totalScore) : null

  // Fast evaluation save
  const handleSaveEvaluation = async () => {
    try {
      setIsSavingEval(true)
      const res = await universityService.submitCoopEvaluation(student.id, editForm)
      if (res.success && res.student) {
        onRefreshStudent?.(res.student)
        setSaveSuccess(true)
        setIsEditingEval(false)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save evaluation:", err)
    } finally {
      setIsSavingEval(false)
    }
  }

  // Structured 12-week logbook generated based on student training hours
  const generateWeeklyLogs = () => {
    const weeksCount = Math.min(12, Math.max(8, Math.round(student.completed_hours / 32)))
    const majorLower = student.student_major.toLowerCase()
    
    // Domain-tailored topics
    const taskTemplates = majorLower.includes("برمج") || majorLower.includes("software")
      ? [
          { task_ar: "تهيئة بيئة العمل والتحقق من صلاحيات السحابة ومعايير CI/CD", task_en: "Environment onboarding, cloud access setup and CI/CD validation", hours: 35, tech: ["Git", "Docker", "Linux"] },
          { task_ar: "تحليل وتصميم معمارية واجهات برمجة التطبيقات (REST APIs)", task_en: "Architectural design and modeling of RESTful backend services", hours: 35, tech: ["FastAPI", "PostgreSQL", "Swagger"] },
          { task_ar: "تطوير وحدات المصادقة وإدارة الهوية الرقمية للأنظمة السحابية", task_en: "Implementing authentication and role-based access control modules", hours: 32, tech: ["OAuth2", "JWT", "Redis"] },
          { task_ar: "كتابة اختبارات الوحدة واختبارات التكامل المؤتمتة (Unit & Integration)", task_en: "Writing comprehensive automated unit and integration tests", hours: 30, tech: ["PyTest", "Postman", "Jest"] },
          { task_ar: "تحسين استعلامات قواعد البيانات والتعامل مع الأحمال المتزامنة", task_en: "Query optimization, indexing and concurrency benchmarks", hours: 34, tech: ["PostgreSQL", "Redis Cache", "pgAdmin"] },
          { task_ar: "تسليم تقرير منتصف التدريب وعقد جلسة المراجعة مع المشرف الأكاديمي", task_en: "Midterm milestone report submission and supervisor review session", hours: 25, tech: ["Documentation", "Technical Writing"] },
          { task_ar: "بناء واجهات المستخدم التفاعلية والربط مع الخدمات الخلفية", task_en: "Developing responsive frontend views and API consumer integration", hours: 36, tech: ["React", "TypeScript", "TailwindCSS"] },
          { task_ar: "فحص الأداء وتصحيح الثغرات البرمجية والتعامل مع الحالات الحدية", task_en: "Performance profiling, bug triage and edge-case handling", hours: 33, tech: ["Sentry", "Chrome DevTools"] },
          { task_ar: "نشر الإصدار التجريبي على بيئة التدقيق ومراجعة ملاحظات المدرب", task_en: "Staging deployment, canary rollout and trainer feedback review", hours: 32, tech: ["Kubernetes", "AWS EKS", "GitHub Actions"] },
          { task_ar: "إعداد وثائق الأنظمة والمستخدمين ومخططات معمارية البرمجيات", task_en: "Documenting architecture schemas, user guides and API contracts", hours: 30, tech: ["Mermaid", "Markdown", "Confluence"] },
          { task_ar: "إجراء اختبارات القبول الشاملة (UAT) مع فريق ضمان الجودة", task_en: "User Acceptance Testing (UAT) with quality engineering team", hours: 28, tech: ["QA Matrix", "Jira"] },
          { task_ar: "استكمال التقرير الفني النهائي والتحضير لمناقشة لجنة التقييم الجامعية", task_en: "Final comprehensive technical dossier and capstone presentation prep", hours: 20, tech: ["Final Dossier", "Presentation"] },
        ]
      : majorLower.includes("ذكاء") || majorLower.includes("بيانات") || majorLower.includes("ai") || majorLower.includes("data")
      ? [
          { task_ar: "استكشاف البيانات الميدانية والتحقق من اتساقها ومعالجة القيم المفقودة", task_en: "Exploratory data analysis, cleaning and missing value imputation", hours: 35, tech: ["Pandas", "NumPy", "Jupyter"] },
          { task_ar: "بناء مسارات هندسة الخصائص وإعداد مجموعات التدريب والاختبار", task_en: "Feature engineering pipelines and dataset partitioning", hours: 35, tech: ["Scikit-Learn", "Feature Stores"] },
          { task_ar: "تدريب نماذج التعلم الآلي الأولية وتحديد معايير الأداء والمقارنة", task_en: "Baseline machine learning model training and metric benchmarking", hours: 34, tech: ["XGBoost", "LightGBM", "MLflow"] },
          { task_ar: "معايرة المعاملات الفائقة (Hyperparameter Tuning) للنموذج الأفضل", task_en: "Hyperparameter tuning and cross-validation execution", hours: 32, tech: ["Optuna", "Cross-Validation"] },
          { task_ar: "بناء وتدريب نموذج تعلم عميق للتعرف على الأنماط المعقدة", task_en: "Deep neural network design and training for complex pattern recognition", hours: 33, tech: ["PyTorch", "TensorFlow"] },
          { task_ar: "تسليم التقرير النصفي ومناقشة النتائج مع المدرب والمشرف الأكاديمي", task_en: "Midterm report delivery and technical findings review with mentor", hours: 26, tech: ["Reports", "Technical Dossier"] },
          { task_ar: "نشر النموذج كواجهة برمجية وتكامل مع النظام التشغيلي للشركة", task_en: "Model containerization and microservice deployment", hours: 35, tech: ["FastAPI", "Docker", "Triton"] },
          { task_ar: "مراقبة دقة النموذج في بيئة الإنتاج والتعامل مع انحراف البيانات (Data Drift)", task_en: "Production drift monitoring and model observability", hours: 32, tech: ["Evidently AI", "Prometheus"] },
          { task_ar: "تصميم لوحات بيانات تفاعلية لاستعراض الرؤى التنبؤية للإدارة", task_en: "Executive predictive analytics dashboard implementation", hours: 30, tech: ["PowerBI", "Streamlit"] },
          { task_ar: "توثيق المنهجية البحثية ونتائج التجارب والأثر المالي والتشغيلي", task_en: "Research methodology documentation and business ROI analysis", hours: 28, tech: ["Technical Paper", "LaTeX"] },
          { task_ar: "مراجعة شاملة للامتثال لحوكمة وحماية البيانات الوطنية (NDMO)", task_en: "National Data Governance compliance and privacy audits", hours: 25, tech: ["NDMO Policy", "Data Privacy"] },
          { task_ar: "تجهيز العرض النهائي وملف التخرج لمناقشة اللجنة الأكاديمية", task_en: "Final defense slide deck and capstone graduation presentation", hours: 25, tech: ["Keynote", "Capstone Dossier"] },
        ]
      : [
          { task_ar: "التعريف ببيئة العمل والأنظمة الإدارية وسياسات الأمان المعتمدة", task_en: "Corporate orientation, internal workflows and security compliance", hours: 35, tech: ["Orientation", "Compliance"] },
          { task_ar: "مراجعة وتوثيق إجراءات العمل الحالية وتحديد فرص الأتمتة والتحسين", task_en: "Business workflow review and digital process mapping", hours: 34, tech: ["BPMN", "Visio", "Excel"] },
          { task_ar: "المشاركة في إعداد التقارير التشغيلية ومؤشرات الأداء الرئيسية", task_en: "Operational KPI tracking and metric scorecard synthesis", hours: 32, tech: ["ERP Systems", "KPI Dashboards"] },
          { task_ar: "تطبيق معايير الجودة والحوكمة ومطابقة السياسات المؤسسية", task_en: "Governance standard operating procedure and quality verification", hours: 33, tech: ["ISO Standards", "Audit Matrix"] },
          { task_ar: "التنسيق بين الفرق الميدانية والإدارات المعنية لمتابعة المخرجات", task_en: "Cross-functional team coordination and milestone follow-ups", hours: 30, tech: ["Project Management", "Jira"] },
          { task_ar: "تسليم التقرير النصفي لمشرف الجامعة وتوثيق ساعات التدريب", task_en: "Midterm academic report submission and hours audit", hours: 26, tech: ["Midterm Evaluation"] },
          { task_ar: "تحليل البيانات التشغيلية واقتراح حلول رقمية لتسريع دورة العمل", task_en: "Operational analytics and business optimization recommendations", hours: 34, tech: ["Tableau", "SQL", "Excel"] },
          { task_ar: "إعداد دراسة جدوى مبسطة لمشروع الأتمتة الميداني بالشركة", task_en: "Feasibility and ROI assessment for field automation initiative", hours: 32, tech: ["Cost Analysis", "ROI Models"] },
          { task_ar: "حضور ورش العمل التخصصية والمحاضرات التوجيهية مع خبراء القطاع", task_en: "Industry masterclasses and specialized professional workshops", hours: 30, tech: ["Professional Training"] },
          { task_ar: "متابعة تنفيذ التوصيات وإعداد تقارير الأثر والنتائج المرحلية", task_en: "Implementation monitoring and impact metric reporting", hours: 28, tech: ["Impact Analysis"] },
          { task_ar: "إعداد مسودة التقرير الفني النهائي ومراجعتها مع المدرب الميداني", task_en: "Final technical capstone draft review with workplace mentor", hours: 26, tech: ["Draft Review"] },
          { task_ar: "استكمال كافة متطلبات الاعتماد وتجهيز ملف المناقشة النهائية", task_en: "Final institutional accreditation dossiers and defense readiness", hours: 25, tech: ["Final Defense"] },
        ]

    return taskTemplates.slice(0, weeksCount).map((item, idx) => ({
      week_num: idx + 1,
      dates: `2026-0${Math.floor(idx / 4) + 6}-${((idx % 4) * 7 + 1).toString().padStart(2, "0")} إلى 2026-0${Math.floor(idx / 4) + 6}-${((idx % 4) * 7 + 7).toString().padStart(2, "0")}`,
      task_ar: item.task_ar,
      task_en: item.task_en,
      hours: item.hours,
      tech: item.tech,
      is_approved_trainer: true,
      is_approved_professor: idx < weeksCount - 1 || student.status.includes("مكتمل"),
    }))
  }

  const weeklyLogs = generateWeeklyLogs()

  // PRINT / OFFICIAL CERTIFICATE VIEW
  if (isPrintMode) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 p-4 md:p-8 backdrop-blur-xl print:p-0 print:bg-white print:text-black">
        <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 relative print:border-none print:shadow-none print:rounded-none">
          {/* Print Controls (Hidden when printing) */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8 print:hidden">
            <button
              type="button"
              onClick={() => setIsPrintMode(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{tl(language, "العودة للملف التفصيلي", "Back to Dossier", "डोज़ियर पर वापस जाएं")}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>{tl(language, "طباعة الوثيقة الرسمية (PDF)", "Print Official Certificate (PDF)", "आधिकारिक दस्तावेज़ प्रिंट करें")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintMode(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Official University Header */}
          <div className="flex items-center justify-between border-b-2 border-primary/20 pb-6 mb-8 text-center md:text-start">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-primary font-mono">
                المملكة العربية السعودية • وزارة التعليم
              </div>
              <div className="text-lg font-black text-slate-900 font-heading">
                جامعة الملك فيصل • وكالة الجامعة للشؤون الأكاديمية
              </div>
              <div className="text-xs text-slate-600 font-medium">
                وحدة التدريب التعاوني والتأهيل المهني لسوق العمل (رؤية 2030)
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <GraduationCap className="w-8 h-8 text-primary mb-1" />
              <span className="text-[10px] font-black text-primary font-mono tracking-wider">KFU CO-OP</span>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-8 space-y-2">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
              وثيقة اعتماد رسمي • OFFICIAL CO-OP DOSSIER
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
              شهادة استيفاء متطلبات التدريب التعاوني الأكاديمي
            </h1>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              تشهد وكالة الشؤون الأكاديمية بجامعة الملك فيصل بأن الطالب الموضحة بياناته أدناه قد أتم فترة التدريب التعاوني المقررة للتخرج واستوفى كافة الساعات والتقارير الأكاديمية والميدانية المعتمدة.
            </p>
          </div>

          {/* Student & Program Dossier Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">اسم الطالب الرباعي:</span>
              <span className="font-black text-slate-900 text-sm block mt-0.5">{student.student_name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">الرقم الجامعي المعتمد:</span>
              <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">{student.student_id_number}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">الكلية والتخصص الأكاديمي:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{student.student_major}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">القسم العلمي المشرف:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{student.professor_department}</span>
            </div>

            <div className="col-span-2 pt-3 border-t border-slate-200">
              <span className="text-slate-500 text-[10px] block">جهة التدريب الميداني والفرع:</span>
              <span className="font-bold text-primary text-sm block mt-0.5">{student.company_name}</span>
              <span className="text-slate-600 text-[11px] block">{student.company_location}</span>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <span className="text-slate-500 text-[10px] block">المدرب الميداني بالشركة:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{student.trainer_name}</span>
              <span className="text-slate-600 text-[11px] block">{student.trainer_specialization}</span>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <span className="text-slate-500 text-[10px] block">المشرف الأكاديمي للجامعة:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{student.professor_name}</span>
              <span className="text-slate-600 text-[11px] block">{student.professor_title}</span>
            </div>
          </div>

          {/* Academic Scoring & Progress Matrix */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8 text-xs">
            <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
              <span>سجل التقييم الأكاديمي واعتماد الساعات (400 ساعة)</span>
              <span className="text-emerald-600 font-black">{student.status}</span>
            </div>
            <div className="grid grid-cols-4 p-4 text-center gap-2 divide-x divide-x-reverse divide-slate-200">
              <div>
                <span className="text-slate-500 text-[11px] block">الساعات المنجزة</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-1 block">
                  {student.completed_hours} / {student.total_required_hours}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">({student.progress_percentage}% مكتمل)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">التقييم النصفي (30)</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-1 block">{midterm} / 30</span>
                <span className="text-[10px] text-slate-500">تقييم المشرف الميداني</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">التقييم النهائي (70)</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-1 block">{finalScore ?? "—"} / 70</span>
                <span className="text-[10px] text-slate-500">لجنة المناقشة والتقرير</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">المعدل النهائي التراكمي</span>
                <span className="text-xl font-black text-primary font-mono mt-1 block">
                  {totalScore !== null ? `${totalScore} / 100` : "قيد الترصيد"}
                </span>
                {gradeInfo && <span className={`text-[10px] font-bold ${gradeInfo.color}`}>تقدير: {gradeInfo.label_ar} ({gradeInfo.grade})</span>}
              </div>
            </div>
          </div>

          {/* Qualitative Endorsement */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 space-y-2 text-xs">
            <div className="font-bold text-slate-800">توصية المشرف الأكاديمي واللجنة العلمية:</div>
            <p className="text-slate-600 leading-relaxed italic">
              "{student.notes || "أظهر الطالب كفاءة تقنية استثنائية والتزاماً رفيعاً بأخلاقيات بيئة العمل خلال كامل فترة التدريب التعاوني. يوصى باعتماد سجله الأكاديمي وتخريجه بمرتبة الشرف."}"
            </p>
          </div>

          {/* Official Signatures & QR Code */}
          <div className="grid grid-cols-3 items-end pt-8 border-t-2 border-slate-200 text-xs text-center">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">المشرف الأكاديمي للتدريب:</span>
              <span className="font-black text-slate-900 block">{student.professor_name}</span>
              <div className="h-10 flex items-center justify-center text-slate-400 italic text-[11px]">
                [التوقيع الرقمي معتمد]
              </div>
            </div>

            {/* Official QR Verification */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 border-2 border-slate-300 rounded-xl flex items-center justify-center p-1 bg-white shadow-sm">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <span className="font-mono text-[9px] text-slate-500">FAEDA-COOP-{student.student_id_number || "8392"}</span>
              <span className="text-[8px] text-slate-400">توثيق رقمي فوري</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">عميد الكلية / وكيل الشؤون الأكاديمية:</span>
              <span className="font-black text-slate-900 block">أ.د. عبد الله بن خالد الدوسري</span>
              <div className="h-10 flex items-center justify-center text-slate-400 italic text-[11px]">
                [الختم الأكاديمي الرسمي]
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl rounded-3xl border border-border bg-[#0b162c] shadow-2xl max-h-[94vh] flex flex-col overflow-hidden"
      >
        {/* DOSSIER HEADER */}
        <div className="p-6 md:p-7 border-b border-border bg-gradient-to-r from-primary/15 via-card to-background relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Student Avatar / Monogram */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 border border-primary/40 text-white font-black text-xl shadow-lg">
                <GraduationCap className="w-7 h-7 text-secondary" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b162c]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg md:text-xl font-black text-white font-heading tracking-tight">
                    {student.student_name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleCopy(student.student_id_number, "id")}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg bg-background/80 hover:bg-white/10 text-muted-foreground hover:text-white border border-border transition-colors"
                    title={tl(language, "نسخ الرقم الجامعي", "Copy Student ID", "छात्र आईडी कॉपी करें")}
                  >
                    <span>ID: {student.student_id_number}</span>
                    {copiedKey === "id" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      student.status.includes("ناجح") || student.status.includes("مكتمل")
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="text-xs text-secondary font-semibold mt-1 flex flex-wrap items-center gap-2">
                  <span>{student.student_major}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-slate-300">{student.professor_department}</span>
                </div>
              </div>
            </div>

            {/* Header Right Actions: View as Student, Print Dossier & Close */}
            <div className="flex items-center gap-2">
              {onViewAsStudent && (
                <button
                  type="button"
                  onClick={() => {
                    onViewAsStudent(student)
                    onClose()
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-secondary/40 bg-secondary/20 hover:bg-secondary/30 text-white text-xs font-bold transition-all shadow-sm"
                  title={tl(language, "عرض لوحة تحكم هذا المتدرب كطالب", "View as Student Portal", "छात्र के रूप में देखें")}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                  <span className="hidden sm:inline">
                    {tl(language, "معاينة كطالب", "View as Student", "छात्र के रूप में देखें")}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsPrintMode(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold transition-all"
                title={tl(language, "عرض وطباعة الوثيقة الرسمية", "Print Official Dossier", "आधिकारिक डोज़ियर प्रिंट करें")}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {tl(language, "طباعة السجل الرسمي", "Print Dossier", "डोज़ियर प्रिंट करें")}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-border/70 text-xs">
            <div className="p-2.5 rounded-xl bg-background/50 border border-border/80 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-secondary shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground block">{tl(language, "الساعات المنجزة", "Logged Hours", "पूरे किए गए घंटे")}</span>
                <span className="font-bold text-white font-mono">
                  {student.completed_hours} / {student.total_required_hours} ({student.progress_percentage}%)
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-background/50 border border-border/80 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground block">{tl(language, "التقييم النصفي", "Midterm Score", "मिडटर्म")}</span>
                <span className="font-bold text-white font-mono">{midterm} / 30</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-background/50 border border-border/80 flex items-center gap-2.5">
              <Star className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground block">{tl(language, "التقييم النهائي", "Final Score", "फाइनल")}</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {finalScore !== null ? `${finalScore} / 70` : tl(language, "بانتظار المناقشة", "Pending Defense", "लंबित")}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-background/50 border border-border/80 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground block">{tl(language, "الزيارات الميدانية", "Field Visits", "विज़िट")}</span>
                <span className="font-bold text-white font-mono">
                  {studentVisits.length} {tl(language, "مجدولة", "Scheduled", "शेड्यूल")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION STRIP */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border bg-[#081224] shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label_ar: "نظرة عامة وجهة التدريب", label_en: "Overview & Placement", label_hi: "अवलोकन और कंपनी", icon: Building },
            { id: "logbook", label_ar: "الساعات والتقارير الأسبوعية", label_en: "Hours & Weekly Logbook", label_hi: "घंटे और साप्ताहिक लॉग", icon: Clock, badge: `${weeklyLogs.length}` },
            { id: "evaluation", label_ar: "التقييم الأكاديمي والدرجات", label_en: "Academic Evaluation", label_hi: "शैक्षणिक मूल्यांकन", icon: Award },
            { id: "visits", label_ar: "الزيارات الميدانية والإشراف", label_en: "Field Visits", label_hi: "फील्ड विज़िट", icon: Calendar, badge: `${studentVisits.length}` },
            { id: "documents", label_ar: "الوثائق والاعتماد الرسمي", label_en: "Official Documents", label_hi: "आधिकारिक दस्तावेज़", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "border-primary text-white bg-primary/10 rounded-t-xl"
                    : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5 rounded-t-xl"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-secondary" : "text-muted-foreground"}`} />
                <span>{tl(language, tab.label_ar, tab.label_en, tab.label_hi)}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? "bg-primary text-white" : "bg-card text-muted-foreground border border-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB CONTENTS (SCROLLABLE) */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW & PLACEMENT DOSSIER */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Host Company & Workplace Trainer Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Host Company Card */}
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-primary" />
                      <span>{tl(language, "جهة التدريب الميداني المعتمدة:", "Host Company Placement:", "प्रशिक्षण कंपनी:")}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-secondary border border-primary/20">
                      {tl(language, "شريك معتمد", "Accredited Partner", "भागीदार")}
                    </span>
                  </div>

                  <div className="text-sm font-black text-white">{student.company_name}</div>

                  <div className="text-xs text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{student.company_location}</span>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{tl(language, "القطاع والنشاط:", "Sector:", "क्षेत्र:")}</span>
                    <span className="font-semibold text-slate-200">
                      {tl(language, "التقنية السحابية والابتكار الرقمي", "Cloud & Digital Innovation", "क्लाउड और नवाचार")}
                    </span>
                  </div>
                </div>

                {/* Workplace Trainer Card */}
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-secondary" />
                      <span>{tl(language, "المدرب الميداني بالشركة:", "Workplace Industry Trainer:", "कार्यस्थल ट्रेनर:")}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>5.0</span>
                    </span>
                  </div>

                  <div className="text-sm font-black text-white">{student.trainer_name}</div>

                  <div className="text-xs text-slate-300">
                    <span className="text-muted-foreground">{tl(language, "التخصص:", "Specialization:", "विशेषज्ञता:")} </span>
                    <span className="font-semibold text-secondary">{student.trainer_specialization}</span>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
                    {student.trainer_phone && (
                      <a
                        href={`tel:${student.trainer_phone}`}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-background/80 hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-all font-mono"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{student.trainer_phone}</span>
                      </a>
                    )}
                    {student.trainer_email && (
                      <a
                        href={`mailto:${student.trainer_email}`}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-background/80 hover:bg-secondary/10 text-secondary border border-secondary/20 transition-all font-mono"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{student.trainer_email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Partnership, Job Title & Work Schedule Information */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-border/80 pb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-secondary" />
                    <span>{tl(language, "بيانات الوظيفة ومقر الشراكة وأوقات الدوام", "Position, Partnership Location & Work Hours", "पद, साझेदारी स्थान और कार्य समय")}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20">
                    {student.job_title || tl(language, "متدرب مهني متخصص", "Specialized Intern", "विशेषज्ञ इंटर्न")}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  {/* Job Title */}
                  <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
                    <span className="text-[10px] text-muted-foreground block">{tl(language, "المسمى الوظيفي الميداني", "Job Title / Role", "कार्य पद")}</span>
                    <span className="font-bold text-white block">{student.job_title || tl(language, "مهندس برمجيات سحابية متدرب", "Cloud Software Intern", "सॉफ्टवेयर इंटर्न")}</span>
                  </div>

                  {/* Partnership Location */}
                  <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
                    <span className="text-[10px] text-muted-foreground block">{tl(language, "مقر الشراكة والتدريب", "Partnership Location", "साझेदारी स्थान")}</span>
                    <span className="font-semibold text-slate-200 block truncate" title={student.partnership_location || student.company_location}>
                      {student.partnership_location || student.company_location}
                    </span>
                  </div>

                  {/* Daily Work Hours */}
                  <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
                    <span className="text-[10px] text-muted-foreground block">{tl(language, "ساعات الدوام اليومية", "Work Start & End Time", "दैनिक कार्य समय")}</span>
                    <span className="font-bold text-secondary font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span>{student.work_start_time || "08:00 ص"} - {student.work_end_time || "04:00 م"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 400-Hour Mandatory Progress Bar & Milestones */}
              <div className="p-5 rounded-2xl bg-[#081628] border border-border space-y-4 shadow-xl">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>{tl(language, "ساعات التدريب المعتمدة (الهدف الوطني: 400 ساعة):", "Required Hours Progress (Target: 400 hrs):", "प्रशिक्षण घंटे प्रगति (लक्ष्य: 400 घंटे):")}</span>
                  </span>
                  <span className="font-black text-secondary font-mono text-sm">
                    {student.completed_hours} / {student.total_required_hours} {tl(language, "ساعة", "hrs", "घंटे")} ({student.progress_percentage}%)
                  </span>
                </div>

                {/* Progress track */}
                <div className="h-3.5 w-full rounded-full bg-background overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-emerald-400 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${student.progress_percentage}%` }}
                  />
                </div>

                {/* 4 Milestones */}
                <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="text-start">
                    <div className="font-bold text-white">100 {tl(language, "ساعة", "hrs", "घंटे")}</div>
                    <div className="text-[10px] text-muted-foreground">{tl(language, "التهيئة والأدوات", "Orientation", "ओरिएंटेशन")}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">200 {tl(language, "ساعة", "hrs", "घंटे")}</div>
                    <div className="text-[10px] text-secondary font-bold">{tl(language, "التقييم النصفي", "Midterm Review", "मिडटर्म")}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">300 {tl(language, "ساعة", "hrs", "घंटे")}</div>
                    <div className="text-[10px] text-muted-foreground">{tl(language, "التنفيذ المتقدم", "Advanced Systems", "उन्नत")}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-bold text-emerald-400">400 {tl(language, "ساعة", "hrs", "घंटे")}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{tl(language, "التخرج والاعتماد", "Final Completion", "अंतिम")}</div>
                  </div>
                </div>
              </div>

              {/* Training Timeline & Academic Supervisor */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Timeline */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    {tl(language, "الجدول الزمني للتدريب:", "Training Timeline:", "प्रशिक्षण समयरेखा:")}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{tl(language, "تاريخ البدء", "Start Date", "शुरू")}</span>
                      <span className="font-bold text-white font-mono">{student.training_start_date || "2026-06-01"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{tl(language, "تاريخ الانتهاء", "End Date", "समाप्त")}</span>
                      <span className="font-bold text-white font-mono">{student.training_end_date || "2026-10-30"}</span>
                    </div>
                  </div>
                </div>

                {/* Supervising Professor */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    {tl(language, "المشرف الأكاديمي للجامعة:", "Academic Supervisor:", "अकादमिक पर्यवेक्षक:")}
                  </div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>{student.professor_name || professor?.name || "د. خالد بن إبراهيم السليمان"}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {student.professor_title || professor?.title || "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: HOURS & WEEKLY LOGBOOK */}
          {/* ========================================================================= */}
          {activeTab === "logbook" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {tl(language, "سجل التقارير الأسبوعية المعتمدة للتدريب الميداني", "Certified Weekly Field Training Logbook", "साप्ताहिक फील्ड प्रशिक्षण लॉग")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tl(
                      language,
                      "يوثق المهام المنفذة أسبوعياً، الساعات المعتمدة، واعتماد المدرب الميداني والمشرف الأكاديمي.",
                      "Documents weekly completed engineering tasks, logged hours, and trainer sign-offs.",
                      "साप्ताहिक पूरे किए गए कार्यों और घंटों को प्रमाणित करता है।"
                    )}
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-secondary px-3 py-1 rounded-xl bg-card border border-border">
                  {tl(language, "إجمالي الأسابيع المسجلة:", "Logged Weeks:", "दर्ज सप्ताह:")} {weeklyLogs.length}
                </span>
              </div>

              {/* Log items list */}
              <div className="space-y-3">
                {weeklyLogs.map((log) => (
                  <div
                    key={log.week_num}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-border/70 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-primary/20 text-secondary font-black font-mono text-[11px]">
                          {tl(language, `الأسبوع ${log.week_num}`, `Week ${log.week_num}`, `सप्ताह ${log.week_num}`)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">{log.dates}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white bg-background/60 px-2 py-0.5 rounded-md border border-border text-[11px]">
                          {log.hours} {tl(language, "ساعة", "hrs", "घंटे")}
                        </span>
                        {log.is_approved_trainer ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{tl(language, "معتمد من المدرب", "Trainer Approved", "स्वीकृत")}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {tl(language, "قيد المراجعة", "Under Review", "समीक्षाधीन")}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {isRTL ? log.task_ar : log.task_en}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {log.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-background text-slate-300 border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ACADEMIC EVALUATION & GRADES */}
          {/* ========================================================================= */}
          {activeTab === "evaluation" && (
            <div className="space-y-6">
              {saveSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{tl(language, "تم حفظ وتحديث التقييم الأكاديمي بنجاح!", "Evaluation saved successfully!", "मूल्यांकन सफलतापूर्वक सहेजा गया!")}</span>
                </div>
              )}

              {/* Evaluation Breakdown Scorecards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Midterm Card (30 Pts) */}
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-heading">
                      {tl(language, "التقييم النصفي (Midterm)", "Midterm Evaluation", "मिडटर्म मूल्यांकन")}
                    </span>
                    <span className="text-base font-black text-secondary font-mono">{midterm} / 30</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "الانضباط والالتزام ببيئة العمل:", "Workplace Attendance & Ethics:", "उपस्थिति और नैतिकता:")}</span>
                      <span className="font-bold text-white font-mono">10 / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "الكفاءة البرمجية وجودة المهام:", "Technical Competency & Tasks:", "तकनीकी दक्षता:")}</span>
                      <span className="font-bold text-white font-mono">10 / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "التقارير الأسبوعية وتوثيق الإنجاز:", "Weekly Reports & Dossier:", "साप्ताहिक रिपोर्ट:")}</span>
                      <span className="font-bold text-white font-mono">{midterm >= 29 ? "10 / 10" : "9 / 10"}</span>
                    </div>
                  </div>
                </div>

                {/* Final Card (70 Pts) */}
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-heading">
                      {tl(language, "التقييم النهائي (Final Defense)", "Final Evaluation", "अंतिम मूल्यांकन")}
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {finalScore !== null ? `${finalScore} / 70` : "قيد الترصيد"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "تقييم المشرف الميداني بالشركة:", "Workplace Trainer Appraisal:", "ट्रेनर मूल्यांकन:")}</span>
                      <span className="font-bold text-white font-mono">25 / 25</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "التقرير الفني الختامي للتدريب:", "Final Technical Capstone Report:", "अंतिम तकनीकी रिपोर्ट:")}</span>
                      <span className="font-bold text-white font-mono">{finalScore ? Math.round(finalScore * 0.42) : 28} / 30</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{tl(language, "مناقشة لجنة التقييم الأكاديمية:", "Academic Defense Committee:", "अकादमिक समिति रक्षा:")}</span>
                      <span className="font-bold text-white font-mono">{finalScore ? Math.round(finalScore * 0.21) : 14} / 15</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cumulative Grade Banner */}
              {totalScore !== null && gradeInfo && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-card to-background border border-primary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-secondary font-mono text-lg">
                      {gradeInfo.grade}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">
                        {tl(language, "المعدل التراكمي النهائي للتدريب التعاوني", "Cumulative Co-op Grade", "संचयी ग्रेड")}
                      </div>
                      <div className="text-xs text-slate-300">
                        {tl(language, "التقدير الأكاديمي العام:", "Official Standing:", "आधिकारिक स्थिति:")}{" "}
                        <span className={`font-bold ${gradeInfo.color}`}>{tl(language, gradeInfo.label_ar, gradeInfo.label_en, gradeInfo.label_hi)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xl font-black text-white font-mono">
                    {totalScore} / 100
                  </div>
                </div>
              )}

              {/* Trainer & Professor Comments */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-secondary" />
                    <span>{tl(language, "ملاحظات المدرب الميداني بالشركة:", "Workplace Trainer Feedback:", "ट्रेनर फीडबैक:")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{student.notes || tl(language, "التزام ممتاز ببيئة العمل، إتقان لتقنيات الفريق ومبادرة متميزة في إنجاز المهام البرمجية.", "High commitment, fast learner, and great team player.", "उत्कृष्ट प्रतिबद्धता और कार्य प्रदर्शन।")}"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                  <div className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>{tl(language, "توصيات المشرف الأكاديمي (الجامعة):", "Professor Recommendation:", "पर्यवेक्षक सिफारिश:")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tl(
                      language,
                      "يوصى باعتماد الساعات واستيفاء متطلبات التخرج وتجهيز تقرير التدريب النهائي للمناقشة العلنية.",
                      "Recommended to approve logged hours and prepare final capstone dossier for defense.",
                      "घंटों को स्वीकृत करने और स्नातक आवश्यकताओं को पूरा करने की सिफारिश की गई।"
                    )}
                  </p>
                </div>
              </div>

              {/* Inline Evaluation Editor Toggle */}
              <div className="p-5 rounded-2xl bg-background/60 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-secondary" />
                    <h4 className="text-xs font-bold text-white font-heading">
                      {tl(language, "تعديل ورصد درجات التقييم الأكاديمي", "Edit & Log Academic Evaluation", "मूल्यांकन संपादित करें")}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingEval(!isEditingEval)}
                    className="text-xs font-bold text-secondary hover:text-white transition-colors"
                  >
                    {isEditingEval
                      ? tl(language, "إلغاء التعديل", "Cancel", "रद्द करें")
                      : tl(language, "فتح نموذج التعديل", "Open Form", "फॉर्म खोलें")}
                  </button>
                </div>

                {isEditingEval && (
                  <div className="space-y-4 pt-3 border-t border-border">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">
                          {tl(language, "درجة النصفي (من 30)", "Midterm (out of 30)", "मिडटर्म (30 में से)")}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={editForm.midterm_score}
                          onChange={(e) => setEditForm({ ...editForm, midterm_score: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white text-xs font-mono focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">
                          {tl(language, "درجة النهائي (من 70)", "Final (out of 70)", "फाइनल (70 में से)")}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={editForm.final_score}
                          onChange={(e) => setEditForm({ ...editForm, final_score: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white text-xs font-mono focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">
                          {tl(language, "الساعات المنجزة (من 400)", "Completed Hours (out of 400)", "पूरे किए गए घंटे")}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="400"
                          value={editForm.completed_hours}
                          onChange={(e) => setEditForm({ ...editForm, completed_hours: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white text-xs font-mono focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">
                        {tl(language, "حالة التدريب الأكاديمية", "Academic Status", "शैक्षणिक स्थिति")}
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white text-xs focus:outline-none focus:border-primary"
                      >
                        <option value="تدريب نشط">{tl(language, "تدريب نشط", "Active Training", "सक्रिय प्रशिक्षण")}</option>
                        <option value="تدريب نشط - بانتظار التقييم النهائي">
                          {tl(language, "تدريب نشط - بانتظار التقييم النهائي", "Active - Pending Final Defense", "सक्रिय - अंतिम रक्षा लंबित")}
                        </option>
                        <option value="مكتمل وناجح - تقييم ممتاز">
                          {tl(language, "مكتمل وناجح - تقييم ممتاز", "Completed with Honors", "सफलतापूर्वक पूर्ण")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">
                        {tl(language, "الملاحظات والتوصيات", "Notes & Recommendations", "नोट्स और टिप्पणियाँ")}
                      </label>
                      <textarea
                        rows={2}
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveEvaluation}
                        disabled={isSavingEval}
                        className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25 transition-all flex items-center gap-1.5"
                      >
                        {isSavingEval ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{tl(language, "حفظ وتحديث التقييم الأكاديمي", "Save Evaluation", "मूल्यांकन सहेजें")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FIELD VISITS & SUPERVISION MEETINGS */}
          {/* ========================================================================= */}
          {activeTab === "visits" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {tl(language, "الزيارات الميدانية وجلسات المتابعة للمشرف", "Field Visits & Supervision Sessions", "फील्ड विज़िट और सत्र")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tl(language, "جدول اللقاءات الميدانية والافتراضية مع جهة التدريب والطالب.", "Supervision schedule and site inspection appointments.", "कंपनी और छात्र के साथ निरीक्षण नियुक्तियां।")}
                  </p>
                </div>

                {onScheduleVisit && (
                  <button
                    type="button"
                    onClick={() => onScheduleVisit(student)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{tl(language, "+ جدولة زيارة جديدة لهذا الطالب", "+ Schedule New Visit", "+ नई विज़िट शेड्यूल करें")}</span>
                  </button>
                )}
              </div>

              {studentVisits.length > 0 ? (
                <div className="space-y-3">
                  {studentVisits.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-card border border-border space-y-2 hover:border-secondary/40 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{v.event_type}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                            {v.status}
                          </span>
                        </div>
                        <span className="font-mono text-slate-300">{v.date_time}</span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{v.location}</span>
                      </div>

                      {v.notes && (
                        <p className="text-xs text-slate-400 bg-background/50 p-2.5 rounded-xl border border-border/60">
                          {v.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-card/40 border border-border text-center space-y-3">
                  <Calendar className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {tl(language, "لا توجد زيارات مجدولة حالياً لهذا الطالب.", "No field visits scheduled yet.", "वर्तमान में कोई निर्धारित विज़िट नहीं है।")}
                  </p>
                  {onScheduleVisit && (
                    <button
                      type="button"
                      onClick={() => onScheduleVisit(student)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold border border-secondary/20 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{tl(language, "جدولة أول زيارة إشرافية", "Schedule First Visit", "पहली विज़िट शेड्यूल करें")}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: OFFICIAL DOCUMENTS & ACCREDITATION */}
          {/* ========================================================================= */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {tl(language, "ملف الوثائق والاعتمادات الرسمية للتدريب", "Official Accreditation Dossier", "आधिकारिक दस्तावेज़ और प्रमाणन")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tl(language, "المستندات القانونية والأكاديمية المعتمدة رسمياً في أرشيف الجامعة.", "Official legal and academic records archived in university registry.", "विश्वविद्यालय रिकॉर्ड में कानूनी और शैक्षणिक दस्तावेज़।")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrintMode(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>{tl(language, "عرض وطباعة الوثيقة الرسمية", "Print Certificate View", "प्रमाणपत्र प्रिंट करें")}</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title_ar: "خطاب التوجيه والمباشرة للتدريب التعاوني",
                    title_en: "Official University Placement Letter",
                    title_hi: "आधिकारिक नियुक्ति पत्र",
                    meta: "KFU-COOP-DIR-2026-892",
                    status_ar: "معتمد ومختوم",
                    status_en: "Endorsed",
                  },
                  {
                    title_ar: "اتفاقية التدريب الميداني والسرية (NDA)",
                    title_en: "Field Training & Confidentiality NDA",
                    title_hi: "गोपनीयता समझौता",
                    meta: "ARAMCO-NDA-STU-481",
                    status_ar: "موقعة وموثقة",
                    status_en: "Signed & Filed",
                  },
                  {
                    title_ar: "دفتر التقارير الأسبوعية الميدانية المعتمدة",
                    title_en: "Certified Weekly Logbook Dossier",
                    title_hi: "प्रमाणित साप्ताहिक लॉगबुक",
                    meta: "12 Weeks Completed • 400h Target",
                    status_ar: "معتمد رقمياً",
                    status_en: "Digitally Verified",
                  },
                  {
                    title_ar: "التقرير الفني الختامي للتدريب (Capstone)",
                    title_en: "Final Technical Capstone Dossier",
                    title_hi: "अंतिम तकनीकी डोज़ियर",
                    meta: "PDF • 38 Pages • Full Systems Architecture",
                    status_ar: "جاهز للمناقشة",
                    status_en: "Ready for Defense",
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border flex items-start justify-between gap-3 hover:border-secondary/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-secondary mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">
                          {tl(language, doc.title_ar, doc.title_en, doc.title_hi)}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono block">{doc.meta}</span>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tl(language, doc.status_ar, doc.status_en)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPrintMode(true)}
                      className="p-1.5 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      title={tl(language, "تحميل المستند", "Download Document", "दस्तावेज़ डाउनलोड करें")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS BAR */}
        <div className="p-4 md:p-5 border-t border-border bg-[#081224] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onScheduleVisit && (
              <button
                type="button"
                onClick={() => onScheduleVisit(student)}
                className="px-4 py-2 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{tl(language, "جدولة زيارة ميدانية", "Schedule Field Visit", "विज़िट शेड्यूल करें")}</span>
              </button>
            )}

            {onUpdateEvaluation && (
              <button
                type="button"
                onClick={() => onUpdateEvaluation(student)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-primary/25"
              >
                <Award className="w-4 h-4" />
                <span>{tl(language, "رصد التقييم الأكاديمي", "Log Evaluation", "मूल्यांकन दर्ज करें")}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrintMode(true)}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-secondary" />
              <span>{tl(language, "طباعة الوثيقة الرسمية", "Print Certificate", "प्रमाणपत्र")}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all"
            >
              {tl(language, "إغلاق", "Close", "बंद करें")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
