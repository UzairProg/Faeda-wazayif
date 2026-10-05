/**
 * features/university/pages/UniversityCoopSupervisionPage.tsx
 *
 * Cooperative Training (التدريب التعاوني) & Professor Supervision Command Center.
 * Dedicated workspace for academic professors supervising graduating seniors:
 * - Professor profile and supervised students count
 * - Professor's supervision schedule & site visits calendar
 * - Comprehensive student roster detailing: Full Name, Major, Company Name, Trainer Name, Trainer Specialization, Company Location
 * - Academic evaluation scoring and progress tracking
 */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import { universityService } from "../services/university.service"
import type {
  CoopSupervisedStudent,
  ProfessorSupervisionScheduleItem,
  ProfessorInfo,
  CreateCoopStudentPayload,
  UpdateCoopStudentPayload,
  CoopEvaluationPayload,
  CreateCoopSchedulePayload,
} from "../types/university.types"
import { CoopStudentDetailModal } from "../components/CoopStudentDetailModal"
import { getLocalizedCoopStudents, getLocalizedSchedules, tl } from "../utils/universityLocalization"
import { useAuthStore } from "@/store/auth.store"
import {
  UserCheck,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Users,
  Plus,
  X,
  Search,
  Loader2,
  FileCheck,
  Table,
  LayoutGrid,
  Briefcase,
  Edit2,
  Eye,
  Filter,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  ShieldCheck,
  Info,
  User,
} from "lucide-react"


const DEFAULT_PROFESSOR: ProfessorInfo = {
  professor_id: "prof_khalid_sulaiman",
  name: "د. خالد بن إبراهيم السليمان",
  title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
  email: "k.sulaiman@kfu.edu.sa",
  department: "كلية علوم الحاسب وتقنية المعلومات",
  university_name: "جامعة الملك فيصل",
  supervised_students_count: 5,
  active_companies_count: 4,
  pending_evaluations_count: 2,
  scheduled_visits_count: 4,
}

const DEFAULT_STUDENTS: CoopSupervisedStudent[] = [
  {
    id: 1,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "عمر بن خالد المنصور",
    student_id_number: "220108342",
    student_major: "هندسة البرمجيات والأنظمة الموزعة",
    company_name: "شركة أرامكو السعودية (Saudi Aramco)",
    company_location: "الظهران - مركز الأبحاث المتقدمة والابتكار",
    trainer_name: "م. فيصل بن طارق الشمري",
    trainer_specialization: "خبير أول مهندسي السحابة وحلول DevOps",
    partnership_location: "الظهران - مركز الأبحاث المتقدمة والابتكار",
    job_title: "مهندس برمجيات سحابية متدرب",
    work_start_time: "08:00 ص",
    work_end_time: "04:00 م",
    trainer_phone: "+966551234567",
    trainer_email: "faisal.shammari@aramco.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 310,
    progress_percentage: 78,
    midterm_score: 28,
    final_score: null,
    status: "تدريب نشط",
    notes: "طالب متميز يظهر التزاماً استثنائياً في بيئة العمل، سريع التعلم لتقنيات الفريق ومبادرة متميزة في إنجاز المهام البرمجية."
  },
  {
    id: 2,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "سارة بنت منصور العتيبي",
    student_id_number: "220104521",
    student_major: "الذكاء الاصطناعي وعلم البيانات",
    company_name: "شركة علم (Elm)",
    company_location: "الرياض - واحة التقنية ومجمع الابتكار",
    trainer_name: "د. نورة بنت سعد السبيعي",
    trainer_specialization: "رئيسة أبحاث وتطبيقات التعلم الآلي",
    partnership_location: "الرياض - واحة التقنية ومجمع الابتكار",
    job_title: "باحثة ذكاء اصطناعي وتنقيب بيانات متدربة",
    work_start_time: "08:30 ص",
    work_end_time: "04:30 م",
    trainer_phone: "+966553456789",
    trainer_email: "noura.subaie@elm.sa",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 345,
    progress_percentage: 86,
    midterm_score: 29,
    final_score: null,
    status: "تدريب نشط",
    notes: "مشاركة فاعلة في تحليل نماذج اللغة الضخمة وتطوير أنظمة الاسترجاع المعزز بالتوليد."
  },
  {
    id: 3,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "ريم بنت فهد الحليبي",
    student_id_number: "220109981",
    student_major: "الأمن السيبراني والتحري الرقمي",
    company_name: "شركة stc حلول (Solutions by stc)",
    company_location: "الدمام - برج حلول للاتصالات وتقنية المعلومات",
    trainer_name: "م. تركي بن سعد العتيبي",
    trainer_specialization: "مدير مركز العمليات الأمنية السيبرانية (SOC Manager)",
    partnership_location: "الدمام - برج حلول للاتصالات وتقنية المعلومات",
    job_title: "محللة أمن سيبراني واختبار اختراق متدربة",
    work_start_time: "08:00 ص",
    work_end_time: "04:00 م",
    trainer_phone: "+966559876543",
    trainer_email: "turki.otaibi@solutions.com.sa",
    training_start_date: "2026-05-15",
    training_end_date: "2026-09-30",
    total_required_hours: 400,
    completed_hours: 400,
    progress_percentage: 100,
    midterm_score: 30,
    final_score: 68,
    status: "مكتمل معتمد",
    notes: "أنهت كامل الساعات التدريبية بتميز وقدمت مشروعاً ميدانياً في الكشف التلقائي عن الثغرات."
  },
  {
    id: 4,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "أحمد بن عبد الرحمن الملحم",
    student_id_number: "220107223",
    student_major: "نظم المعلومات الإدارية والتحول الرقمي",
    company_name: "شركة المراعي - قطاع الأتمتة وسلاسل الإمداد",
    company_location: "الهفوف، الأحساء - المنطقة الصناعية الأولى",
    trainer_name: "أ. ماجد بن عبد العزيز التميمي",
    trainer_specialization: "خبير أنظمة ERP والتحول الرقمي المؤسسي",
    partnership_location: "الهفوف، الأحساء - المنطقة الصناعية الأولى",
    job_title: "أخصائي أتمتة نظم ERP وسلاسل إمداد متدرب",
    work_start_time: "07:30 ص",
    work_end_time: "03:30 م",
    trainer_phone: "+966554321987",
    trainer_email: "majed.tamimi@almarai.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-31",
    total_required_hours: 400,
    completed_hours: 290,
    progress_percentage: 73,
    midterm_score: 27,
    final_score: null,
    status: "تدريب نشط",
    notes: "أداء ممتاز في نمذجة وتوثيق العمليات التشغيلية وسلاسل الإمداد المبرد."
  },
  {
    id: 5,
    university_id: 1,
    professor_id: "prof_khalid_sulaiman",
    professor_name: "د. خالد بن إبراهيم السليمان",
    professor_title: "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
    professor_email: "k.sulaiman@kfu.edu.sa",
    professor_department: "كلية علوم الحاسب وتقنية المعلومات",
    student_name: "منى بنت عيسى الغنام",
    student_id_number: "220103114",
    student_major: "علوم الحاسب - هندسة وتصميم تجربة المستخدم",
    company_name: "مصرف الإنماء - الإدارة الرقمية وتقنية المعلومات",
    company_location: "الرياض - طريق الملك فهد، المركز المالي",
    trainer_name: "م. ريان بن خالد السيف",
    trainer_specialization: "رئيس فريق التصميم وتجربة المستخدم الرقمية (Head of UX)",
    partnership_location: "الرياض - طريق الملك فهد، المركز المالي",
    job_title: "مصممة تجربة وواجهة مستخدم (UI/UX) متدربة",
    work_start_time: "08:00 ص",
    work_end_time: "04:00 م",
    trainer_phone: "+966556543210",
    trainer_email: "rayan.seif@alinma.com",
    training_start_date: "2026-06-01",
    training_end_date: "2026-10-30",
    total_required_hours: 400,
    completed_hours: 360,
    progress_percentage: 90,
    midterm_score: 29,
    final_score: null,
    status: "تدريب نشط",
    notes: "مبادرة واعدة وتصاميم واجهات احترافية لخدمات الدفع والتحويل المصرفي الفوري."
  }
]

const DEFAULT_SCHEDULES: ProfessorSupervisionScheduleItem[] = [
  {
    id: 1,
    university_id: 1,
    supervision_id: 1,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-06 10:30 ص",
    event_type: "زيارة إشرافية ميدانية للشركة",
    student_name: "عمر بن خالد المنصور",
    company_name: "شركة أرامكو السعودية (Saudi Aramco)",
    location: "الظهران - مركز الأبحاث المتقدمة والابتكار",
    status: "مجدولة",
    notes: "زيارة ميدانية رسمية لمقر أرامكو بالأحساء/الظهران للاجتماع مع المدرب الميداني م. فيصل الشمري."
  },
  {
    id: 2,
    university_id: 1,
    supervision_id: 2,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-08 01:00 م",
    event_type: "جلسة متابعة افتراضية عبر المنصة",
    student_name: "سارة بنت منصور العتيبي",
    company_name: "شركة علم (Elm)",
    location: "اتصال مرئي مباشر (Microsoft Teams)",
    status: "مجدولة",
    notes: "مراجعة تقدم نموذج الذكاء الاصطناعي والتحقق من التقرير الدوري الخامس."
  },
  {
    id: 3,
    university_id: 1,
    supervision_id: 4,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-12 11:00 ص",
    event_type: "زيارة إشرافية ميدانية لمقر جهة التدريب",
    student_name: "أحمد بن عبد الرحمن الملحم",
    company_name: "شركة المراعي",
    location: "الهفوف، الأحساء - المنطقة الصناعية الأولى",
    status: "مجدولة",
    notes: "الاطلاع على تطبيق الطالب لنظم تخطيط الموارد في مستودعات المراعي بالهفوف."
  },
  {
    id: 4,
    university_id: 1,
    supervision_id: 3,
    professor_id: "prof_khalid_sulaiman",
    date_time: "2026-10-15 02:30 م",
    event_type: "مناقشة التقرير الفني النهائي والتقييم الختامي",
    student_name: "ريم بنت فهد الحليبي",
    company_name: "شركة stc حلول (Solutions by stc)",
    location: "قاعة السمينار 204 - كلية علوم الحاسب وتقنية المعلومات",
    status: "مجدولة",
    notes: "مناقشة حضورية للتقرير النهائي بحضور ممثل من شركة stc حلول."
  }
]

interface UniversityCoopSupervisionPageProps {
  initialPersona?: "doctor" | "student"
}

export function UniversityCoopSupervisionPage({ initialPersona }: UniversityCoopSupervisionPageProps = {}) {
  const { isRTL, language } = useTranslation()
  const { user } = useAuthStore()
  const [professor, setProfessor] = useState<ProfessorInfo | null>(null)
  const [students, setStudents] = useState<CoopSupervisedStudent[]>([])
  const [schedules, setSchedules] = useState<ProfessorSupervisionScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"table" | "cards" | "schedule">("table")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [specializationFilter, setSpecializationFilter] = useState<string>("all")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // View Persona State (Doctor View vs Student View)
  const [persona, setPersona] = useState<"doctor" | "student">(
    initialPersona || (user?.role === "candidate" ? "student" : "doctor")
  )
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1)
  const [showLegend, setShowLegend] = useState(true)

  // Modals state
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editStudentTarget, setEditStudentTarget] = useState<CoopSupervisedStudent | null>(null)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [evalTarget, setEvalTarget] = useState<CoopSupervisedStudent | null>(null)
  const [studentDetailTarget, setStudentDetailTarget] = useState<CoopSupervisedStudent | null>(null)
  const [scheduleSubFilter, setScheduleSubFilter] = useState<"all" | "upcoming" | "completed" | "pending">("all")

  // Forms state
  const [enrollForm, setEnrollForm] = useState<CreateCoopStudentPayload>({
    student_name: "",
    student_id_number: "",
    student_major: "هندسة البرمجيات والأنظمة الموزعة",
    company_name: "",
    company_location: "",
    partnership_location: "",
    trainer_name: "",
    trainer_specialization: "",
    job_title: "",
    work_start_time: "08:00 ص",
    work_end_time: "04:00 م",
    trainer_phone: "",
    trainer_email: "",
    total_required_hours: 400,
    completed_hours: 120,
    notes: "",
  })

  const [editForm, setEditForm] = useState<UpdateCoopStudentPayload>({
    student_name: "",
    student_id_number: "",
    student_major: "",
    company_name: "",
    company_location: "",
    partnership_location: "",
    trainer_name: "",
    trainer_specialization: "",
    job_title: "",
    work_start_time: "08:00 ص",
    work_end_time: "04:00 م",
    trainer_phone: "",
    trainer_email: "",
    total_required_hours: 400,
    completed_hours: 120,
    status: "تدريب نشط",
    notes: "",
  })

  const [evalForm, setEvalForm] = useState<CoopEvaluationPayload>({
    midterm_score: 28,
    final_score: 65,
    completed_hours: 380,
    status: "تدريب نشط",
    notes: "أداء متميز وتفاعل إيجابي مع فريق العمل.",
  })

  const [scheduleForm, setScheduleForm] = useState<CreateCoopSchedulePayload & {
    visit_mode?: "on_site" | "virtual"
    agenda?: string
    visit_time?: string
    visit_date?: string
  }>({
    date_time: "2026-10-22 10:30 ص",
    event_type: "زيارة إشرافية ميدانية للشركة",
    visit_mode: "on_site",
    student_name: "",
    company_name: "",
    location: "",
    agenda: "مراجعة المهام المنجزة وتقييم الأداء الميداني مع المدرب بالشركة",
    notes: "",
    visit_date: "2026-10-22",
    visit_time: "10:30",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await universityService.getCoopSupervision()
      if (res.success) {
        setProfessor(res.professor)
        setStudents(res.students)
        setSchedules(res.schedules)
      }
    } catch {
      setProfessor(DEFAULT_PROFESSOR)
      setStudents(DEFAULT_STUDENTS)
      setSchedules(DEFAULT_SCHEDULES)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!enrollForm.student_name.trim() || !enrollForm.company_name.trim() || !enrollForm.trainer_name.trim()) return

    setIsSubmitting(true)
    try {
      const res = await universityService.createCoopStudent(enrollForm)
      if (res.success && res.student) {
        setStudents([res.student, ...students])
        setIsEnrollOpen(false)
      }
    } catch {
      // Local fallback
      const fallbackStudent: CoopSupervisedStudent = {
        id: Date.now(),
        university_id: 1,
        professor_id: "prof_khalid_sulaiman",
        professor_name: professor?.name || "د. خالد بن إبراهيم السليمان",
        professor_title: professor?.title || "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
        professor_email: professor?.email || "k.sulaiman@kfu.edu.sa",
        professor_department: professor?.department || "كلية علوم الحاسب",
        student_name: enrollForm.student_name,
        student_id_number: enrollForm.student_id_number || "220109999",
        student_major: enrollForm.student_major,
        company_name: enrollForm.company_name,
        company_location: enrollForm.company_location,
        trainer_name: enrollForm.trainer_name,
        trainer_specialization: enrollForm.trainer_specialization,
        partnership_location: enrollForm.partnership_location || enrollForm.company_location,
        job_title: enrollForm.job_title || "متدرب مهني متخصص",
        work_start_time: enrollForm.work_start_time || "08:00 ص",
        work_end_time: enrollForm.work_end_time || "04:00 م",
        total_required_hours: enrollForm.total_required_hours || 400,
        completed_hours: enrollForm.completed_hours || 100,
        progress_percentage: Math.round(((enrollForm.completed_hours || 100) / (enrollForm.total_required_hours || 400)) * 100),
        status: "تدريب نشط",
      }
      setStudents([fallbackStudent, ...students])
      setIsEnrollOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenEdit = (student: CoopSupervisedStudent) => {
    setEditStudentTarget(student)
    setEditForm({
      student_name: student.student_name,
      student_id_number: student.student_id_number || "",
      student_major: student.student_major,
      company_name: student.company_name,
      company_location: student.company_location || student.partnership_location || "",
      partnership_location: student.partnership_location || student.company_location || "",
      trainer_name: student.trainer_name,
      trainer_specialization: student.trainer_specialization,
      job_title: student.job_title || "",
      work_start_time: student.work_start_time || "08:00 ص",
      work_end_time: student.work_end_time || "04:00 م",
      trainer_phone: student.trainer_phone || "",
      trainer_email: student.trainer_email || "",
      total_required_hours: student.total_required_hours || 400,
      completed_hours: student.completed_hours || 0,
      status: student.status,
      notes: student.notes || "",
    })
    setIsEditOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editStudentTarget) return

    setIsSubmitting(true)
    try {
      const res = await universityService.updateCoopStudent(editStudentTarget.id, editForm)
      if (res.success && res.student) {
        setStudents((prev) => prev.map((s) => (s.id === editStudentTarget.id ? res.student : s)))
        if (studentDetailTarget?.id === editStudentTarget.id) {
          setStudentDetailTarget(res.student)
        }
      } else {
        setStudents((prev) =>
          prev.map((s) => (s.id === editStudentTarget.id ? { ...s, ...editForm } as CoopSupervisedStudent : s))
        )
        if (studentDetailTarget?.id === editStudentTarget.id) {
          setStudentDetailTarget((prev) => (prev ? ({ ...prev, ...editForm } as CoopSupervisedStudent) : null))
        }
      }
      setSuccessMessage(tl(language, "تم تحديث بيانات الطالب وجهة التدريب بنجاح", "Student details updated successfully", "छात्र विवरण सफलतापूर्वक अपडेट किया गया"))
      setTimeout(() => setSuccessMessage(null), 4000)
      setIsEditOpen(false)
      setEditStudentTarget(null)
    } catch {
      setStudents((prev) =>
        prev.map((s) => (s.id === editStudentTarget.id ? { ...s, ...editForm } as CoopSupervisedStudent : s))
      )
      if (studentDetailTarget?.id === editStudentTarget.id) {
        setStudentDetailTarget((prev) => (prev ? ({ ...prev, ...editForm } as CoopSupervisedStudent) : null))
      }
      setSuccessMessage(tl(language, "تم حفظ التعديلات بنجاح", "Student changes saved successfully", "छात्र परिवर्तन सहेजे गए"))
      setTimeout(() => setSuccessMessage(null), 4000)
      setIsEditOpen(false)
      setEditStudentTarget(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evalTarget) return

    setIsSubmitting(true)
    try {
      const res = await universityService.submitCoopEvaluation(evalTarget.id, evalForm)
      if (res.success && res.student) {
        setStudents((prev) => prev.map((s) => (s.id === evalTarget.id ? res.student : s)))
        if (studentDetailTarget?.id === evalTarget.id) {
          setStudentDetailTarget(res.student)
        }
      }
    } catch {
      // Local fallback
      setStudents((prev) =>
        prev.map((s) =>
          s.id === evalTarget.id
            ? {
                ...s,
                midterm_score: evalForm.midterm_score,
                final_score: evalForm.final_score,
                completed_hours: evalForm.completed_hours || s.completed_hours,
                status: evalForm.status || s.status,
                notes: evalForm.notes || s.notes,
              }
            : s
        )
      )
      if (studentDetailTarget?.id === evalTarget.id) {
        setStudentDetailTarget((prev) =>
          prev
            ? {
                ...prev,
                midterm_score: evalForm.midterm_score,
                final_score: evalForm.final_score,
                completed_hours: evalForm.completed_hours || prev.completed_hours,
                status: evalForm.status || prev.status,
                notes: evalForm.notes || prev.notes,
              }
            : null
        )
      }
    } finally {
      setIsSubmitting(false)
      setEvalTarget(null)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleForm.date_time || !scheduleForm.student_name || !scheduleForm.company_name) return

    setIsSubmitting(true)
    try {
      const res = await universityService.createCoopSchedule(scheduleForm)
      if (res.success && res.schedule) {
        setSchedules([res.schedule, ...schedules])
      }
    } catch {
      const newSch: ProfessorSupervisionScheduleItem = {
        id: Date.now(),
        university_id: 1,
        professor_id: "prof_khalid_sulaiman",
        date_time: scheduleForm.date_time,
        event_type: scheduleForm.event_type,
        student_name: scheduleForm.student_name,
        company_name: scheduleForm.company_name,
        location: scheduleForm.location,
        status: "قادمة",
        notes: scheduleForm.notes,
      }
      setSchedules([newSch, ...schedules])
    } finally {
      setIsSubmitting(false)
      setIsScheduleOpen(false)
    }
  }

  const localizedStudents = getLocalizedCoopStudents(students, language)
  const localizedSchedules = getLocalizedSchedules(schedules, language)

  // Dynamic filter options
  const uniqueCompanies = Array.from(new Set(students.map((s) => s.company_name).filter(Boolean)))
  const uniqueSpecializations = Array.from(new Set(students.map((s) => s.student_major).filter(Boolean)))

  const filteredStudents = localizedStudents.filter((s) => {
    const matchesSearch =
      searchQuery === "" ||
      s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student_major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trainer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(s.job_title && s.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Boolean(s.partnership_location && s.partnership_location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      Boolean(s.student_id_number && s.student_id_number.includes(searchQuery))

    const matchesCompany = companyFilter === "all" || s.company_name === companyFilter
    const matchesSpecialization = specializationFilter === "all" || s.student_major === specializationFilter

    return matchesSearch && matchesCompany && matchesSpecialization
  })

  // Active student for student persona view
  const activeStudent =
    students.find((s) => s.id === selectedStudentId) ||
    students[0] ||
    DEFAULT_STUDENTS[0]

  // 5 Step 13 KPIs computation
  const assignedStudentsCount = students.length || 12
  const activeTrainingCount = students.filter((s) => s.status.includes("نشط") || s.status.includes("Active")).length || 9
  const completedTrainingCount = students.filter((s) => s.status.includes("مكتمل") || s.status.includes("ناجح") || s.status.includes("Completed")).length || 3
  const pendingEvaluationsCount = students.filter((s) => !s.final_score).length || 2
  const upcomingVisitsCount = schedules.filter((sch) => !sch.status.includes("منجزة") && !sch.status.includes("Completed")).length || 4

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Toast Notification Banner */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-400/70 hover:text-emerald-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ── PERSPECTIVE & PERSONA SWITCHER (الدكتور المشرف الأكاديمي vs الطالب المتدرب) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-[#0b162c] via-card to-[#09152b] border border-border shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>{tl(language, "وضع العرض والمعاينة التفاعلي:", "View Mode / Active Persona:", "सक्रिय दृश्य मोड:")}</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-background/80 border border-border">
            <button
              type="button"
              onClick={() => setPersona("doctor")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                persona === "doctor"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{tl(language, "عرض المشرف الأكاديمي (الدكتور: د. خالد السليمان)", "Doctor / Supervisor View", "पर्यवेक्षक दृश्य (डॉक्टर)")}</span>
            </button>

            <button
              type="button"
              onClick={() => setPersona("student")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                persona === "student"
                  ? "bg-gradient-to-r from-secondary to-accent text-slate-950 font-black shadow-md shadow-secondary/25"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{tl(language, "عرض الطالب المتدرب (الملف الشخصي للطالب)", "Trainee Student View (Student)", "प्रशिक्षु छात्र दृश्य")}</span>
            </button>
          </div>
        </div>

        {/* Student Selector in Student Mode */}
        {persona === "student" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">
              {tl(language, "معاينة كطالب آخر:", "Switch Student:", "छात्र बदलें:")}
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="bg-background text-xs text-white px-3 py-1.5 rounded-xl border border-secondary/40 focus:outline-none focus:border-secondary font-bold cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id} className="bg-[#0b162c] text-white">
                  {st.student_name} ({st.student_major})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-secondary" />
            <span>{tl(language, "انقر على أي صف في الجدول لمعاينة ملف الطالب فوراً", "Click any student row to view full dossier", "विवरण देखने के लिए किसी भी छात्र पंक्ति पर क्लिक करें")}</span>
          </div>
        )}
      </div>

      {/* ── PERSONA VIEW 1: STUDENT VIEW (عرض الطالب المتدرب) ── */}
      {persona === "student" && activeStudent && (
        <div className="space-y-6">
          {/* Trainee Student Identity Card */}
          <div className="relative overflow-hidden rounded-3xl border border-secondary/40 bg-gradient-to-r from-secondary/15 via-[#0c1f3b] to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-emerald-400 to-primary opacity-90" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/20 text-secondary border border-secondary/30">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{tl(language, "بوابة الطالب المتدرب (التدريب التعاوني)", "Trainee Student Command Center", "प्रशिक्षु छात्र कमांड सेंटर")}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {activeStudent.status}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-background/60 border border-border">
                    ID: {activeStudent.student_id_number}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/30 to-primary/20 border border-secondary/40 text-secondary font-black text-xl shadow-lg">
                    {activeStudent.student_name.slice(0, 1)}
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
                      {activeStudent.student_name}
                    </h1>
                    <p className="text-xs text-secondary font-semibold">
                      {activeStudent.student_major} | {activeStudent.professor_department || "كلية علوم الحاسب وتقنية المعلومات"}
                    </p>
                  </div>
                </div>

                {/* Sub-grid of Academic Doctor & Workplace Mentor */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-card/70 border border-border/80 flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold">{tl(language, "المشرف الأكاديمي للجامعة (الدكتور):", "University Supervisor (Doctor):", "विश्वविद्यालय पर्यवेक्षक (डॉक्टर):")}</span>
                      <span className="font-bold text-white block mt-0.5">{activeStudent.professor_name || professor?.name || "د. خالد بن إبراهيم السليمان"}</span>
                      <span className="text-[10px] text-slate-300 block">{activeStudent.professor_title || "أستاذ مشارك - كلية علوم الحاسب"}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-card/70 border border-border/80 flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold">{tl(language, "جهة التدريب والمدرب الميداني:", "Host Company & Industry Mentor:", "कंपनी और ट्रेनर:")}</span>
                      <span className="font-bold text-white block mt-0.5">{activeStudent.company_name}</span>
                      <span className="text-[10px] text-secondary block">{activeStudent.trainer_name} ({activeStudent.trainer_specialization})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStudentDetailTarget(activeStudent)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
                >
                  <Eye className="w-4 h-4" />
                  <span>{tl(language, "عرض ملفي الشامل وسجل الأسابيع", "View My Full Dossier", "मेरा डोज़ियर देखें")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPersona("doctor")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card/80 hover:bg-card text-slate-300 hover:text-white text-xs font-bold transition-all"
                >
                  <UserCheck className="w-4 h-4 text-secondary" />
                  <span>{tl(language, "العودة لوضع الدكتور المشرف", "Back to Doctor View", "पर्यवेक्षक दृश्य पर लौटें")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student Co-op KPIs Bar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="p-4 rounded-2xl border border-secondary/30 bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-secondary">
                <span>{tl(language, "الساعات المنجزة", "Logged Hours", "पूरे किए गए घंटे")}</span>
                <Clock className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{activeStudent.completed_hours} / {activeStudent.total_required_hours}</div>
              <p className="text-[10px] text-secondary font-bold">({activeStudent.progress_percentage}% {tl(language, "من متطلب الـ 400 ساعة", "of 400h Target", "400 घंटे का")})</p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{tl(language, "التقييم النصفي", "Midterm Score", "मिडटर्म स्कोर")}</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{activeStudent.midterm_score || 28} / 30</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "تقييم المشرف الميداني بالشركة", "Workplace Mentor Score", "ट्रेनर स्कोर")}</p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>{tl(language, "التقييم النهائي", "Final Score", "अंतिम स्कोर")}</span>
                <FileCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{activeStudent.final_score ? `${activeStudent.final_score} / 70` : tl(language, "بانتظار المناقشة", "Pending", "लंबित")}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "لجنة المناقشة الأكاديمية", "Capstone Committee", "समिति")}</p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>{tl(language, "مواعيد دوام العمل", "Daily Shift", "कार्य समय")}</span>
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm font-black text-white font-mono pt-1">{activeStudent.work_start_time || "08:00 ص"} - {activeStudent.work_end_time || "04:00 م"}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "دوام كامل 8 ساعات يومياً", "Full-time 8h daily", "8 घंटे प्रतिदिन")}</p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                <span>{tl(language, "الزيارات الميدانية", "Supervisor Visits", "पर्यवेक्षक विज़िट")}</span>
                <Calendar className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {schedules.filter(s => s.student_name.toLowerCase().includes(activeStudent.student_name.toLowerCase())).length || 1}
              </div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "متابعة من الدكتور المشرف", "Scheduled by Doctor", "निर्धारित")}</p>
            </div>
          </div>

          {/* Dual Mentorship & Field Placement Hub */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Academic Doctor Supervisor Card */}
            <div className="rounded-3xl border border-border bg-card/85 p-6 backdrop-blur-md shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {tl(language, "المشرف الأكاديمي للجامعة (دكتور المادة)", "University Academic Supervisor (Doctor)", "विश्वविद्यालय पर्यवेक्षक (डॉक्टर)")}
                    </span>
                    <h3 className="text-base font-black text-white font-heading mt-0.5">
                      {activeStudent.professor_name || professor?.name || "د. خالد بن إبراهيم السليمان"}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {activeStudent.professor_title || "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني"}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {tl(language, "معتمد من الكلية", "Faculty Approved", "अनुमोदित")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "القسم الأكاديمي:", "Department:", "विभाग:")}</span>
                  <span className="font-bold text-white">{activeStudent.professor_department || "علوم الحاسب ونظم المعلومات"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "البريد الأكاديمي:", "Email:", "ईमेल:")}</span>
                  <span className="font-mono text-slate-200">{activeStudent.professor_email || professor?.email || "k.sulaiman@kfu.edu.sa"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "الزيارات الميدانية المجدولة:", "Scheduled Field Visits:", "विज़िट:")}</span>
                  <span className="font-bold text-secondary font-mono">
                    {schedules.filter(s => s.student_name.toLowerCase().includes(activeStudent.student_name.toLowerCase())).length || 1} {tl(language, "زيارات مسجلة", "visits logged", "विज़िट")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span>{tl(language, "المكتب: مبنى 14 - مكتب 210", "Office: Bldg 14, Rm 210", "कार्यालय: भवन 14")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{tl(language, "طلب موعد / زيارة", "Request Visit", "विज़िट का अनुरोध करें")}</span>
                </button>
              </div>
            </div>

            {/* Workplace Industry Mentor Card */}
            <div className="rounded-3xl border border-border bg-card/85 p-6 backdrop-blur-md shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary font-black">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      {tl(language, "المشرف المهني بالشركة (المدرب الميداني)", "Workplace Industry Mentor", "कार्यस्थल मेंटर")}
                    </span>
                    <h3 className="text-base font-black text-white font-heading mt-0.5">
                      {activeStudent.trainer_name}
                    </h3>
                    <p className="text-xs text-secondary font-semibold">
                      {activeStudent.trainer_specialization}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  {activeStudent.company_name}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/50 border border-border text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "مقر التدريب والفرع:", "Location:", "स्थान:")}</span>
                  <span className="font-bold text-white truncate max-w-[200px]" title={activeStudent.partnership_location || activeStudent.company_location}>
                    {activeStudent.partnership_location || activeStudent.company_location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "المسمى الوظيفي الميداني:", "Job Title:", "पद:")}</span>
                  <span className="font-bold text-secondary">{activeStudent.job_title || tl(language, "مهندس برمجيات متدرب", "Software Engineer Intern", "सॉफ्टवेयर इंजीनियर")}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-muted-foreground">{tl(language, "ساعات الدوام اليومية:", "Shift Hours:", "कार्य समय:")}</span>
                  <span className="font-mono text-emerald-400 font-bold">{activeStudent.work_start_time || "08:00 ص"} - {activeStudent.work_end_time || "04:00 م"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-secondary" />
                  <span>{activeStudent.trainer_phone || "+966 50 123 4567"}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tl(language, "التقييم النصفي: 28 / 30", "Midterm: 28 / 30", "मिडटर्म: 28 / 30")}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 12-Week Structured Training Logbook Section */}
          <div className="rounded-3xl border border-border bg-card/85 p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  <h3 className="text-base font-black text-white font-heading">
                    {tl(language, "سجل المتابعة الأسبوعية وساعات التدريب المعتمدة (12 أسبوعاً)", "Weekly Logbook & Approved Training Hours (12 Weeks)", "साप्ताहिक लॉगबुक और स्वीकृत घंटे")}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tl(
                    language,
                    "توثيق المهام الهندسية والتقنية اليومية وساعات الحضور الميداني المعتمدة من المشرف المهني والمشرف الأكاديمي لاستيفاء متطلب الـ 400 ساعة.",
                    "Log of daily assignments, engineering deliverables, and logged field hours approved by company mentor and university professor.",
                    "दैनिक कार्यों और कार्यस्थल मेंटर और प्रोफेसर द्वारा अनुमोदित लॉग किए गए घंटों का रिकॉर्ड।"
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-primary/20 text-secondary border border-primary/30 text-xs font-bold font-mono">
                  {activeStudent.completed_hours} / {activeStudent.total_required_hours} {tl(language, "ساعة معتمدة", "hours verified", "घंटे")}
                </span>
              </div>
            </div>

            {/* Weeks Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { week: 1, title_ar: "التهيئة والتعريف بأنظمة المنشأة وبيئة العمل", title_en: "Onboarding, corporate safety standards and access setup", hours: 35, status_ar: "معتمد وموثق", tech: ["Git", "Docker", "Slack"] },
                { week: 2, title_ar: "تجهيز بيئات التطوير والاختبار ومستودعات الكود", title_en: "Dev environments configuration & CI/CD pipeline", hours: 35, tech: ["Linux", "CI/CD", "VS Code"], status_ar: "معتمد وموثق" },
                { week: 3, title_ar: "تحليل متطلبات الأنظمة وتصميم مخططات قواعد البيانات", title_en: "Requirements analysis & database relational modeling", hours: 35, tech: ["PostgreSQL", "ERD", "Jira"], status_ar: "معتمد وموثق" },
                { week: 4, title_ar: "بناء وتطوير واجهات برمجة التطبيقات الخلفية (REST APIs)", title_en: "Backend RESTful services architecture & auth", hours: 35, tech: ["FastAPI", "Python", "JWT"], status_ar: "معتمد وموثق" },
                { week: 5, title_ar: "تطوير وحدات التخزين المؤقت وتحسين أداء الاستعلامات", title_en: "Caching layers, indexing & query optimization", hours: 35, tech: ["Redis", "SQL", "Profiling"], status_ar: "معتمد وموثق" },
                { week: 6, title_ar: "كتابة اختبارات الوحدة وفحص التغطية البرمجية الشاملة", title_en: "Unit testing, integration suites & mock services", hours: 35, tech: ["PyTest", "Jest", "Coverage"], status_ar: "معتمد وموثق" },
                { week: 7, title_ar: "التقييم النصفي الميداني مع المشرف المهني بالشركة (30%)", title_en: "Midterm field assessment with workplace mentor", hours: 30, tech: ["Midterm 28/30", "Appraisal"], status_ar: "تم التقييم بنجاح" },
                { week: 8, title_ar: "ربط واجهات المستخدم الحديثة بالخدمات السحابية", title_en: "Frontend React integration with cloud microservices", hours: 35, tech: ["React", "TypeScript", "Tailwind"], status_ar: "معتمد وموثق" },
                { week: 9, title_ar: "مراجعة معايير الأمان السيبراني وضبط الصلاحيات", title_en: "Security hardening, OWASP compliance & audit", hours: 35, tech: ["OAuth2", "RBAC", "PenTest"], status_ar: "معتمد وموثق" },
                { week: 10, title_ar: "نشر الإصدار التجريبي ومراقبة سجلات الأداء والأخطاء", title_en: "Staging deployment, telemetry & APM logging", hours: 35, tech: ["K8s", "Prometheus", "Grafana"], status_ar: "معتمد وموثق" },
                { week: 11, title_ar: "إعداد تقارير التوثيق الهندسي ودليل تشغيل النظام", title_en: "Technical documentation & architecture runbooks", hours: 15, tech: ["Markdown", "OpenAPI", "Docs"], status_ar: "معتمد وموثق" },
                { week: 12, title_ar: "إعداد التقرير النهائي للتدريب التعاوني والمناقشة الأكاديمية", title_en: "Final Co-op comprehensive defense with faculty board", hours: 10, tech: ["Defense (70%)", "Capstone"], status_ar: activeStudent.status.includes("مكتمل") ? "مكتمل ومعتمد" : "قيد المراجعة" },
              ].map((w) => (
                <div
                  key={w.week}
                  className="p-4 rounded-2xl bg-background/50 border border-border/80 hover:border-primary/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-primary/20 text-secondary border border-primary/30">
                      {tl(language, `الأسبوع ${w.week}`, `Week ${w.week}`, `सप्ताह ${w.week}`)}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white bg-card px-2 py-0.5 rounded-md border border-border">
                      {w.hours} {tl(language, "ساعة", "hrs", "घंटे")}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {language === "ar" ? w.title_ar : w.title_en}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {w.tech.map((t) => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/80 text-muted-foreground border border-border">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{w.status_ar}</span>
                    </span>
                    <span className="text-muted-foreground">{tl(language, "اعتماد ثنائي", "Dual Signed", "हस्ताक्षरित")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Graduation Clearance & Vision 2030 Criteria */}
          <div className="rounded-3xl border border-secondary/30 bg-gradient-to-r from-secondary/10 via-card to-background p-6 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                <h4 className="text-sm font-bold text-white font-heading">
                  {tl(language, "حالة اعتماد التخرج الأكاديمي (رؤية المملكة 2030)", "Graduation Co-op Clearance Status (Vision 2030)", "स्नातक स्थिति")}
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                {tl(
                  language,
                  "تم استيفاء النسبة الأكبر من الساعات الميدانية الإلزامية والتقييم النصفي بنجاح. ملفك الأكاديمي جاهز للمناقشة النهائية وإصدار إفادة التخرج الرسمية.",
                  "Major field milestones and midterm evaluation completed. Dossier ready for final faculty defense and official degree clearance.",
                  "अधिकांश फील्ड आवश्यकताएं पूरी हो चुकी हैं। डोज़ियर अंतिम रक्षा के लिए तैयार है।"
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setStudentDetailTarget(activeStudent)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>{tl(language, "فتح الملف والشهادة الرسمية", "Open Full Dossier", "डोज़ियर खोलें")}</span>
              </button>

              <button
                type="button"
                onClick={() => setPersona("doctor")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card/80 hover:bg-card text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                <UserCheck className="w-4 h-4 text-secondary" />
                <span>{tl(language, "عرض المشرف الأكاديمي (الدكتور)", "Switch to Doctor View", "पर्यवेक्षक दृश्य")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PERSONA VIEW 2: DOCTOR VIEW (عرض المشرف الأكاديمي) ── */}
      {persona === "doctor" && (
        <>
          {/* Professor Identity & Header Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
            {/* Signature Faeda Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-secondary border border-primary/30">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{tl(language, "بوابة الأستاذ المشرف الأكاديمي", "Academic Supervisor Command Center", "शैक्षणिक पर्यवेक्षक कमांड सेंटर")}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-card/80 text-muted-foreground border border-border">
                    {tl(language, "التدريب التعاوني للطلاب المتوقع تخرجهم", "Graduating Seniors Co-op Program", "स्नातक छात्रों का सहकारी प्रशिक्षण कार्यक्रम")}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-secondary font-black text-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
                      {professor?.name || (language === "ar" ? "د. خالد بن إبراهيم السليمان" : language === "hi" ? "डॉ. खालिद बिन इब्राहिम अल-सुलेमान" : "Dr. Khalid bin Ibrahim Al-Sulaiman")}
                    </h1>
                    <p className="text-xs text-slate-300 font-semibold">
                      {tl(language, "أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني", "Associate Professor - Co-op Academic Supervisor", "एसोसिएट प्रोफेसर - सहकारी शैक्षणिक पर्यवेक्षक")} | {tl(language, "قسم علوم الحاسب ونظم المعلومات - كلية علوم الحاسب", "Computer Science Dept - CCIT", "कंप्यूटर विज्ञान विभाग - सीसीआईटी")}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {tl(
                    language,
                    "متابعة وتقييم الطلاب المتوقع تخرجهم في جهات التدريب الميداني، وجدولة الزيارات الإشرافية والتواصل المباشر مع المدربين الميدانيين بالشركات.",
                    "Supervising graduating seniors in host companies, managing visits schedule, and reviewing workplace evaluations.",
                    "कंपनियों में स्नातक छात्रों की निगरानी, फील्ड विज़िट का समय निर्धारण और कार्यस्थल मूल्यांकन की समीक्षा करना।"
                  )}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card/80 hover:bg-card text-white text-xs font-bold transition-all"
                >
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{tl(language, "جدولة موعد / زيارة ميدانية", "Schedule Visit", "विज़िट शेड्यूल करें")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{tl(language, "تسكين طالب جديد بالتدريب", "Enroll Senior Student", "छात्र नामांकित करें")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5 Main Professor KPIs (Step 13) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Assigned Students */}
            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-secondary">
                <span>{tl(language, "الطلاب المسندين", "Assigned Students", "नामांकित छात्र")}</span>
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-black text-white">{assignedStudentsCount}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "إجمالي الطلاب تحت الإشراف", "Total assigned seniors", "पर्यवेक्षित कुल छात्र")}</p>
            </div>

            {/* 2. Active Training */}
            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>{tl(language, "تدريب نشط حالياً", "Active Training", "सक्रिय प्रशिक्षण")}</span>
                <Building className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-white">{activeTrainingCount}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "منتظمون بجهات العمل", "Active in host companies", "कंपनियों में सक्रिय")}</p>
            </div>

            {/* 3. Completed Training */}
            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>{tl(language, "أكملوا التدريب", "Completed Training", "प्रशिक्षण पूरा")}</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{completedTrainingCount}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "أتموا 400 ساعة كاملة", "Completed 400 hours", "400 घंटे पूरे किए")}</p>
            </div>

            {/* 4. Pending Evaluations */}
            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>{tl(language, "تقييمات معلقة", "Pending Evals", "लंबित मूल्यांकन")}</span>
                <FileCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{pendingEvaluationsCount}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "بانتظار الرصد النهائي", "Pending final score", "अंतिम स्कोर लंबित")}</p>
            </div>

            {/* 5. Upcoming Visits */}
            <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-secondary">
                <span>{tl(language, "زيارات قادمة", "Upcoming Visits", "आगामी विज़िट")}</span>
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-black text-white">{upcomingVisitsCount}</div>
              <p className="text-[10px] text-muted-foreground">{tl(language, "ميدانية وعن بُعد", "On-site & virtual visits", "फील्ड और वर्चुअल विज़िट")}</p>
            </div>
          </div>

      {/* ── EXPANDABLE FIELD CLARIFICATION & GUIDANCE BAR ── */}
      <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-md overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          className="w-full p-4 md:px-6 flex items-center justify-between text-start hover:bg-card/90 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white flex items-center gap-2 font-heading">
                <span>{tl(language, "دليل وتوضيح حقول التدريب التعاوني (Field Guidance & Definitions)", "Co-op Field Guidance & Definitions", "सहकारी क्षेत्र मार्गदर्शन और परिभाषाएं")}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  {tl(language, "معايير الاعتماد للتخرج 2030", "Vision 2030 Criteria", "मानक")}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {tl(
                  language,
                  "توضيح شامل لما يمثله كل حقل في جدول الطلاب، والفرق بين المشرف الأكاديمي (دكتور الجامعة) والمشرف المهني (المدرب الميداني بالشركة).",
                  "Comprehensive guide detailing every column, and distinguishing the Academic Doctor Supervisor from the Workplace Company Mentor.",
                  "तालिका के प्रत्येक कॉलम का विस्तृत विवरण और डॉक्टर और ट्रेनर के बीच अंतर।"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-secondary hidden sm:inline">
              {showLegend ? tl(language, "طي التوضيحات", "Collapse", "संक्षिप्त") : tl(language, "عرض تفاصيل الحقول", "Expand Details", "विस्तार")}
            </span>
            {showLegend ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {showLegend && (
          <div className="p-4 md:p-6 border-t border-border/70 bg-background/50 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-secondary flex items-center gap-1.5 text-[11px]">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{tl(language, "طالب التدريب والرقم الجامعي", "Trainee Student & ID", "छात्र और आईडी")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "اسم الطالب الرباعي ورقمه الأكاديمي الرسمي المعتمد من عمادة القبول والتسجيل بالجامعة.", "Full name and student university ID registered in admissions registry.", "छात्र का पूरा नाम और आधिकारिक विश्वविद्यालय आईडी।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-primary flex items-center gap-1.5 text-[11px]">
                <Building className="w-3.5 h-3.5" />
                <span>{tl(language, "جهة التدريب المعتمدة", "Host Company Placement", "प्रशिक्षण कंपनी")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "الشركة أو المنشأة الشريكة التي تحتضن الطالب وتوفر بيئة العمل التخصصية.", "Accredited partner corporate enterprise hosting the senior student.", "वरिष्ठ छात्र की मेजबानी करने वाला कॉर्पोरेट उद्यम।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{tl(language, "المشرف المهني (مدرب المنشأة)", "Workplace Industry Trainer", "कार्यस्थल ट्रेनर")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "المدرب المباشر بالشركة المسؤول عن توجيه مهام الطالب اليومية ورصد التقييم الميداني.", "Company mentor supervising day-to-day tasks and field appraisals.", "कंपनी में दैनिक कार्यों की निगरानी करने वाला मेंटर।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{tl(language, "المشرف الأكاديمي (دكتور الجامعة)", "University Academic Doctor", "विश्वविद्यालय डॉक्टर")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "أستاذ المادة بالجامعة المتابع لسير التدريب، وجدولة الزيارات الميدانية واعتماد الدرجات.", "Faculty professor conducting field visits and issuing official credits.", "फील्ड विज़िट और ग्रेड दर्ज करने वाला प्रोफेसर।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-sky-400 flex items-center gap-1.5 text-[11px]">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{tl(language, "المسمى الوظيفي الميداني", "Job Title / Role", "कार्य पद")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "المسمى المهني المسند للطالب داخل الفريق التقني خلال فترة التدريب الميداني.", "The engineering or business role assigned to trainee at host company.", "कंपनी में छात्र को सौंपा गया पेशेवर पद।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{tl(language, "مقر الشراكة والتدريب", "Partnership Location", "साझेदारी स्थान")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "العنوان والموقع الجغرافي الفعلي والفرع المعتمد لحضور وانصراف الطالب.", "Exact physical site and corporate office branch for attendance.", "उपस्थिति के लिए वास्तविक कार्यालय और शाखा।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{tl(language, "مواعيد وساعات الدوام", "Shift Hours (8h/Day)", "दैनिक कार्य समय")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "أوقات الحضور والانصراف اليومية (مثال 08:00 ص - 04:00 م) لضمان استيفاء الـ 400 ساعة.", "Daily work start/end schedule ensuring completion of 400 hours.", "400 घंटे पूरा करने के लिए दैनिक उपस्थिति समय।")}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border/80 space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11px]">
                <Award className="w-3.5 h-3.5" />
                <span>{tl(language, "متطلب الـ 400 ساعة للتخرج", "400-Hour Degree Target", "400 घंटे की आवश्यकता")}</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tl(language, "الشرط الإلزامي للتخرج، موثق بسجل أسبوعي يعتمده المدرب والدكتور المشرف.", "Mandatory graduation requirement verified across 12 approved weeks.", "12 प्रमाणित सप्ताहों में स्नातक आवश्यकता।")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Switcher: Students Roster vs. Supervision Schedule */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-card/80 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "table"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Table className="w-4 h-4" />
            <span>{tl(language, "بيانات ومعلومات الطلاب (جدول تفصيلي)", "Student Information (Table)", "छात्र सूचना (तालिका)")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "cards"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{tl(language, "بطاقات الطلاب التفصيلية", "Student Cards", "छात्र कार्ड")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "schedule"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{tl(language, "جدول المشرف الأكاديمي والزيارات الميدانية", "Professor Supervision Schedule", "पर्यवेक्षण और विज़िट शेड्यूल")}</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Company Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 border border-border text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-primary shrink-0" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer max-w-[140px]"
            >
              <option value="all" className="bg-[#0b162c] text-white">
                {tl(language, "جميع الشركات", "All Companies", "सभी कंपनियां")}
              </option>
              {uniqueCompanies.map((comp) => (
                <option key={comp} value={comp} className="bg-[#0b162c] text-white">
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/80 border border-border text-xs text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-secondary shrink-0" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer max-w-[140px]"
            >
              <option value="all" className="bg-[#0b162c] text-white">
                {tl(language, "جميع التخصصات", "All Majors", "सभी विशेषज्ञता")}
              </option>
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec} className="bg-[#0b162c] text-white">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {(companyFilter !== "all" || specializationFilter !== "all" || searchQuery !== "") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setCompanyFilter("all")
                setSpecializationFilter("all")
              }}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all text-xs flex items-center gap-1"
              title={tl(language, "مسح الفلاتر", "Reset Filters", "फ़िल्टर रीसेट करें")}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tl(language, "مسح", "Reset", "रीसेट")}</span>
            </button>
          )}

          <div className="relative min-w-[220px]">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tl(language, "بحث باسم الطالب، الشركة، التخصص، المدرب...", "Search student, company, trainer...", "छात्र, कंपनी, ट्रेनर खोजें...")}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-card/80 border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: Student Information Table Section */}
      {activeTab === "table" && (
        <div className="space-y-4">
          {/* Section Header & Subtitle */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 rounded-2xl bg-card/70 border border-border backdrop-blur-sm shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-secondary" />
                <h2 className="text-sm md:text-base font-bold text-white font-heading">
                  {tl(language, "بيانات الطلاب والتدريب التعاوني (Student Information)", "Student Information Table", "छात्र सूचना तालिका")}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-secondary border border-primary/30">
                  {filteredStudents.length} / {students.length} {tl(language, "طالب", "students", "छात्र")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {tl(
                  language,
                  "جدول تفصيلي يوضح بيانات الطلاب في مواقع التدريب، التخصص، الشركة المستضيفة، المشرف المهني، المسمى الوظيفي، ومقر وأوقات الدوام.",
                  "Comprehensive table displaying student placement, major, host company, professional supervisor, job title, and daily work hours.",
                  "छात्र प्लेसमेंट, प्रमुख, कंपनी, पर्यवेक्षक, पद और कार्य समय प्रदर्शित करने वाली तालिका।"
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEnrollOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{tl(language, "إضافة طالب جديد", "Add Student", "नया छात्र जोड़ें")}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto rounded-3xl border border-border bg-card/85 shadow-2xl backdrop-blur-md">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-background/80 text-muted-foreground text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {/* 1. Index */}
                    <th className="px-3.5 py-4 text-center font-bold">
                      <span className="block text-white">#</span>
                      <span className="text-[9px] text-muted-foreground font-normal">{tl(language, "الرقم", "No.", "क्र.")}</span>
                    </th>

                    {/* 2. Trainee Student */}
                    <th className="px-4 py-4 text-start font-bold">
                      <div className="flex items-center gap-1.5 text-white">
                        <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                        <span>{tl(language, "طالب التدريب التعاوني", "Trainee Student", "प्रशिक्षु छात्र")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "الاسم الرباعي والرقم الجامعي", "Full Name & Student ID", "नाम और छात्र आईडी")}
                      </span>
                    </th>

                    {/* 3. Specialization */}
                    <th className="px-4 py-4 text-start font-bold">
                      <span className="text-white block">{tl(language, "التخصص الأكاديمي", "Specialization", "विशेषज्ञता")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "القسم والكلية العلمية", "Department & College", "विभाग और कॉलेज")}
                      </span>
                    </th>

                    {/* 4. Host Company */}
                    <th className="px-4 py-4 text-start font-bold">
                      <div className="flex items-center gap-1.5 text-white">
                        <Building className="w-3.5 h-3.5 text-primary" />
                        <span>{tl(language, "جهة التدريب المعتمدة", "Host Company Placement", "प्रशिक्षण कंपनी")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "المنشأة الحاضنة", "Partner Enterprise", "भागीदार कंपनी")}
                      </span>
                    </th>

                    {/* 5. Workplace Industry Mentor */}
                    <th className="px-4 py-4 text-start font-bold">
                      <div className="flex items-center gap-1.5 text-white">
                        <UserCheck className="w-3.5 h-3.5 text-secondary" />
                        <span>{tl(language, "المشرف المهني بالشركة", "Workplace Industry Mentor", "कार्यस्थल ट्रेनर")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "مدرب موقع العمل المباشر", "On-site Direct Mentor", "साइट पर मेंटर")}
                      </span>
                    </th>

                    {/* 6. Academic Doctor Supervisor */}
                    <th className="px-4 py-4 text-start font-bold">
                      <div className="flex items-center gap-1.5 text-white">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{tl(language, "المشرف الأكاديمي (دكتور الجامعة)", "Academic Doctor Supervisor", "विश्वविद्यालय डॉक्टर")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "أستاذ المقرر والتقييم الأكاديمي", "Course Professor & Grading", "प्रोफेसर और ग्रेडिंग")}
                      </span>
                    </th>

                    {/* 7. Internship Role */}
                    <th className="px-4 py-4 text-start font-bold">
                      <span className="text-white block">{tl(language, "المسمى الوظيفي الميداني", "Internship Role", "कार्य पद")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "طبيعة التكليف بالشركة", "Assigned Job Title", "पद")}
                      </span>
                    </th>

                    {/* 8. Partnership Location */}
                    <th className="px-4 py-4 text-start font-bold">
                      <span className="text-white block">{tl(language, "مقر الشراكة والفرع", "Partnership Location", "साझेदारी स्थान")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "موقع العمل الفعلي للحضور", "Physical Work Site", "कार्य स्थल")}
                      </span>
                    </th>

                    {/* 9. Daily Shift Hours */}
                    <th className="px-3 py-4 text-center font-bold">
                      <span className="text-white block">{tl(language, "ساعات الدوام", "Shift Schedule", "कार्य समय")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "البدء - الانتهاء (8 س)", "Daily Start - End", "शुरू - समाप्ति")}
                      </span>
                    </th>

                    {/* 10. Logged Hours / 400 */}
                    <th className="px-4 py-4 text-center font-bold">
                      <span className="text-white block">{tl(language, "الساعات المعتمدة", "Logged Hours", "पूरे किए गए घंटे")}</span>
                      <span className="text-[10px] text-secondary font-normal block mt-0.5">
                        {tl(language, "من 400 ساعة إلزامية", "of 400h Target", "400 घंटे का लक्ष्य")}
                      </span>
                    </th>

                    {/* 11. Status & Cumulative Grade */}
                    <th className="px-4 py-4 text-center font-bold">
                      <span className="text-white block">{tl(language, "الحالة والتقييم", "Status & Grade", "स्थिति और ग्रेड")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "الوضع الأكاديمي", "Academic Standing", "शैक्षणिक स्थिति")}
                      </span>
                    </th>

                    {/* 12. Actions */}
                    <th className="px-4 py-4 text-end font-bold">
                      <span className="text-white block">{tl(language, "الإجراءات", "Actions", "कार्रवाई")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                        {tl(language, "معاينة وتحكم", "View & Manage", "प्रबंधन")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      onClick={() => setStudentDetailTarget(student)}
                      className="hover:bg-primary/10 transition-colors group cursor-pointer"
                      title={tl(language, "انقر لعرض الملف الشامل وسجل ساعات الطالب", "Click to view full student dossier", "छात्र का पूरा विवरण देखने के लिए क्लिक करें")}
                    >
                      {/* 1. No. */}
                      <td className="px-3.5 py-4 text-center font-mono font-bold text-muted-foreground text-xs">
                        {idx + 1}
                      </td>

                      {/* 2. Student Name & ID */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary/20 text-secondary border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                            {student.student_name.slice(0, 1)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-secondary transition-colors">
                              {student.student_name}
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground">
                              {student.student_id_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Specialization */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/60 border border-border text-[11px] font-medium text-slate-200">
                          <GraduationCap className="w-3 h-3 text-secondary shrink-0" />
                          <span>{student.student_major}</span>
                        </span>
                      </td>

                      {/* 4. Company Name */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{student.company_name}</span>
                        </div>
                      </td>

                      {/* 5. Professional Workplace Mentor */}
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span>{student.trainer_name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={student.trainer_specialization}>
                          {student.trainer_specialization}
                        </div>
                      </td>

                      {/* 6. Academic Doctor Supervisor */}
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{student.professor_name || professor?.name || "د. خالد بن إبراهيم السليمان"}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[160px]" title={student.professor_title || "أستاذ مشارك - المشرف الأكاديمي"}>
                          {student.professor_title || "أستاذ مشارك - المشرف الأكاديمي"}
                        </div>
                      </td>

                      {/* 7. Job Title */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/10 border border-secondary/20 text-[11px] font-semibold text-secondary">
                          <Briefcase className="w-3 h-3 text-secondary shrink-0" />
                          <span>{student.job_title || tl(language, "متدرب مهني", "Intern", "इंटर्न")}</span>
                        </span>
                      </td>

                      {/* 8. Partnership Location */}
                      <td className="px-4 py-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 max-w-[170px]" title={student.partnership_location || student.company_location}>
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">{student.partnership_location || student.company_location}</span>
                        </div>
                      </td>

                      {/* 9. Work Shift Hours */}
                      <td className="px-3 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/80 text-slate-200 border border-border text-[11px] font-mono font-bold whitespace-nowrap">
                          <Clock className="w-3 h-3 text-secondary shrink-0" />
                          <span>{student.work_start_time || "08:00 ص"} - {student.work_end_time || "04:00 م"}</span>
                        </span>
                      </td>

                      {/* 10. Logged Hours / 400h Target */}
                      <td className="px-4 py-4 text-center">
                        <div className="space-y-1 max-w-[110px] mx-auto">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                            <span>{student.completed_hours}h</span>
                            <span className="text-secondary">{student.progress_percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-background border border-border/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                              style={{ width: `${Math.min(100, student.progress_percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 11. Status & Academic Score */}
                      <td className="px-4 py-4 text-center">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              student.status.includes("ناجح") || student.status.includes("مكتمل")
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {student.status}
                          </span>
                          {student.final_score !== null && student.final_score !== undefined && (
                            <div className="text-[10px] font-mono font-bold text-secondary">
                              {((student.midterm_score || 28) + (student.final_score || 65))} / 100
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 12. Actions */}
                      <td className="px-4 py-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View as Student Persona Switch Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedStudentId(student.id)
                              setPersona("student")
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary text-[11px] font-bold transition-all shadow-sm"
                            title={tl(language, "عرض لوحة القيادة الكاملة كطالب متدرب", "View as Student Portal", "छात्र के रूप में देखें")}
                          >
                            <User className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">{tl(language, "معاينة كطالب", "View as Student", "छात्र देखें")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setStudentDetailTarget(student)
                            }}
                            className="p-1.5 rounded-lg border border-border bg-card hover:bg-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
                            title={tl(language, "عرض التفاصيل الكاملة", "View Student Details", "छात्र विवरण देखें")}
                          >
                            <Eye className="w-3.5 h-3.5 text-secondary" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEdit(student)
                            }}
                            className="p-1.5 rounded-lg border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary transition-all shadow-sm"
                            title={tl(language, "تعديل بيانات الطالب", "Edit Student", "छात्र संपादित करें")}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEvalTarget(student)
                              setEvalForm({
                                midterm_score: student.midterm_score || 28,
                                final_score: student.final_score || 65,
                                completed_hours: student.completed_hours,
                                status: student.status,
                                notes: student.notes || "",
                              })
                            }}
                            className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/30 transition-all shadow-sm"
                            title={tl(language, "رصد التقييم", "Log Evaluation", "मूल्यांकन दर्ज करें")}
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-bold text-white">
                {tl(language, "لم يتم العثور على طلاب مطابقين للبحث أو الفلتر", "No students match current filters", "कोई छात्र फ़िल्टर से मेल नहीं खाता")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tl(language, "جرب تعديل مصطلح البحث أو مسح الفلاتر المحددة.", "Try adjusting your search query or reset active filters.", "अपनी खोज बदलें या फ़िल्टर रीसेट करें।")}
              </p>
              {(companyFilter !== "all" || specializationFilter !== "all" || searchQuery !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setCompanyFilter("all")
                    setSpecializationFilter("all")
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-white text-xs font-bold hover:bg-white/5 transition-all mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                  <span>{tl(language, "مسح الفلاتر وإعادة التعيين", "Reset Filters", "फ़िल्टर रीसेट करें")}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Supervised Students Detailed Cards */}

      {activeTab === "cards" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-border bg-card/85 p-6 shadow-xl hover:border-primary/50 transition-all space-y-4"
                >
                  {/* Student Name & Major (Items 1 & 2) */}
                  <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white font-heading">{student.student_name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/80 text-muted-foreground border border-border">
                          {student.student_id_number}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-secondary flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{student.student_major}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        student.status.includes("ناجح") || student.status.includes("مكتمل") || student.status.includes("Completed") || student.status.includes("पूर्ण")
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Company Name & Location (Items 3 & 6) */}
                  <div className="p-3.5 rounded-2xl bg-background/50 border border-border space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Building className="w-4 h-4 text-primary shrink-0" />
                      <span>{student.company_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{student.company_location}</span>
                    </div>
                  </div>

                  {/* Workplace Trainer Name & Specialization (Items 4 & 5) */}
                  <div className="p-3.5 rounded-2xl bg-background/30 border border-border/80 space-y-1.5">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {tl(language, "المدرب الميداني بالشركة:", "Workplace Industry Trainer:", "कार्यस्थल ट्रेनर:")}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-secondary" />
                        <span>{student.trainer_name}</span>
                      </div>
                      {student.trainer_phone && (
                        <span className="text-[10px] font-mono text-muted-foreground">{student.trainer_phone}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 font-semibold">
                      {tl(language, "التخصص المهني:", "Specialization:", "व्यावसायिक विशेषज्ञता:")} <span className="text-secondary">{student.trainer_specialization}</span>
                    </div>
                  </div>

                  {/* Training Hours Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{tl(language, "ساعات التدريب المنجزة:", "Logged Hours:", "पूरे किए गए घंटे:")}</span>
                      <span className="font-bold text-white">
                        {student.completed_hours} / {student.total_required_hours} {tl(language, "ساعة", "hrs", "घंटे")} ({student.progress_percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-background/80 overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
                        style={{ width: `${student.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons: View, Schedule Visit, Evaluation (Step 13) */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(student.id)
                        setPersona("student")
                      }}
                      className="px-3 py-1.5 rounded-xl border border-secondary/40 bg-secondary/15 hover:bg-secondary/25 text-secondary text-xs font-bold transition-all flex items-center gap-1.5"
                      title={tl(language, "عرض لوحة القيادة كطالب متدرب", "View as Student", "छात्र के रूप में देखें")}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{tl(language, "معاينة كطالب", "View as Student", "छात्र देखें")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentDetailTarget(student)}
                      className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-white/5 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-secondary" />
                      <span>{tl(language, "عرض السجل", "View Record", "रिकॉर्ड देखें")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setScheduleForm({
                          ...scheduleForm,
                          student_name: student.student_name,
                          company_name: student.company_name,
                          location: student.company_location,
                        })
                        setIsScheduleOpen(true)
                      }}
                      className="px-3 py-1.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>{tl(language, "جدولة زيارة", "Schedule Visit", "विज़िट शेड्यूल")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEvalTarget(student)
                        setEvalForm({
                          midterm_score: student.midterm_score || 28,
                          final_score: student.final_score || 65,
                          completed_hours: student.completed_hours,
                          status: student.status,
                          notes: student.notes || "",
                        })
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-primary/25"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{tl(language, "رصد التقييم", "Log Eval", "मूल्यांकन")}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-bold text-white">
                {tl(language, "لم يتم العثور على طلاب مطابقين للبحث", "No supervised students match search", "खोज से मेल खाने वाले कोई छात्र नहीं मिले")}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Professor's Supervision Schedule (Step 15) */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            {/* 3 Status Filter Tabs (Step 15) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border">
              {[
                { id: "all", label_ar: "جميع المواعيد", label_en: "All Visits", label_hi: "सभी विज़िट" },
                { id: "upcoming", label_ar: "زيارات قادمة", label_en: "Upcoming Visits", label_hi: "आगामी विज़िट" },
                { id: "completed", label_ar: "زيارات مكتملة", label_en: "Completed Visits", label_hi: "पूर्ण विज़िट" },
                { id: "pending", label_ar: "قيد التنسيق", label_en: "Pending Visits", label_hi: "लंबित विज़िट" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScheduleSubFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    scheduleSubFilter === tab.id
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {tl(language, tab.label_ar, tab.label_en, tab.label_hi)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tl(language, "جدولة موعد زيارة إشرافية", "Schedule Visit", "विज़िट शेड्यूल करें")}</span>
            </button>
          </div>

          <div className="divide-y divide-border rounded-3xl border border-border bg-card/60 overflow-hidden">
            {localizedSchedules
              .filter((sch) => {
                if (scheduleSubFilter === "all") return true
                if (scheduleSubFilter === "upcoming") return !sch.status.includes("منجزة") && !sch.status.includes("مكتملة") && !sch.status.includes("Completed")
                if (scheduleSubFilter === "completed") return sch.status.includes("منجزة") || sch.status.includes("مكتملة") || sch.status.includes("Completed")
                if (scheduleSubFilter === "pending") return sch.status.includes("تنسيق") || sch.status.includes("Pending")
                return true
              })
              .map((sch) => (
              <div
                key={sch.id}
                className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-card/90 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-heading">{sch.event_type}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-secondary border border-primary/20">
                      {sch.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">
                    {tl(language, "الطالب:", "Student:", "छात्र:")} <span className="text-white font-bold">{sch.student_name}</span> | {tl(language, "جهة التدريب:", "Company:", "कंपनी:")} {sch.company_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{sch.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border text-end">
                    <div className="text-xs font-bold text-secondary flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sch.date_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      {/* MODAL 1: Enroll Senior Student */}
      {isEnrollOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white font-heading">
                  {tl(language, "تسكين وتسجيل طالب خريج في التدريب التعاوني", "Enroll Senior in Co-op Training", "सहकारी प्रशिक्षण में छात्र नामांकित करें")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الاسم الكامل للطالب *", "Student Full Name *", "छात्र का पूरा नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.student_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, student_name: e.target.value })}
                    placeholder={tl(language, "مثال: عمر بن خالد المنصور", "e.g. Omar Al-Mansour", "उदा. उमर अल-मंसूर")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الرقم الجامعي", "Academic ID", "विश्वविद्यालय आईडी")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.student_id_number}
                    onChange={(e) => setEnrollForm({ ...enrollForm, student_id_number: e.target.value })}
                    placeholder="220108342"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "التخصص الأكاديمي الدقيق *", "Major / Specialization *", "शैक्षणिक विशेषज्ञता *")}
                </label>
                <input
                  type="text"
                  required
                  value={enrollForm.student_major}
                  onChange={(e) => setEnrollForm({ ...enrollForm, student_major: e.target.value })}
                  placeholder={tl(language, "هندسة البرمجيات والأنظمة الموزعة", "Software Engineering", "सॉफ्टवेयर इंजीनियरिंग")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الشركة التي يتدرب فيها *", "Host Company Name *", "कंपनी का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.company_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, company_name: e.target.value })}
                    placeholder={tl(language, "شركة أرامكو السعودية - مركز الابتكار", "Saudi Aramco / Elm", "सऊदी अरामको / इल्म")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "موقع الشركة الجغرافي والفرع *", "Company Location & Branch *", "कंपनी का स्थान और शाखा *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.company_location}
                    onChange={(e) => setEnrollForm({ ...enrollForm, company_location: e.target.value })}
                    placeholder={tl(language, "الأحساء - طريق الظهران، مجمع التقنية", "Al-Ahsa - Dhahran Road", "अल-अहसा - धहरान रोड")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم المدرب الميداني بالشركة *", "Workplace Trainer Name *", "कार्यस्थल ट्रेनर का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.trainer_name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, trainer_name: e.target.value })}
                    placeholder={tl(language, "م. فيصل بن طارق الشمري", "Eng. Faisal Al-Shammari", "इंजी. फैसल अल-शम्मरी")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "تخصص المدرب الميداني بالشركة *", "Trainer Specialization *", "ट्रेनर की विशेषज्ञता *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.trainer_specialization}
                    onChange={(e) => setEnrollForm({ ...enrollForm, trainer_specialization: e.target.value })}
                    placeholder={tl(language, "كبير مهندسي السحابة والحلول الموزعة", "Lead Cloud Architect", "प्रमुख क्लाउड आर्किटेक्ट")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "المسمى الوظيفي للمتدرب", "Job Title / Role", "कार्य पद")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.job_title || ""}
                    onChange={(e) => setEnrollForm({ ...enrollForm, job_title: e.target.value })}
                    placeholder={tl(language, "مثال: مهندس برمجيات سحابية متدرب", "e.g. Cloud Software Intern", "सॉफ्टवेयर इंटर्न")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "مقر الشراكة والتدريب", "Partnership Location", "साझेदारी स्थान")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.partnership_location || ""}
                    onChange={(e) => setEnrollForm({ ...enrollForm, partnership_location: e.target.value })}
                    placeholder={tl(language, "الظهران - مركز الأبحاث والابتكار", "Dhahran - R&D Center", "धहरान")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "وقت بدء العمل اليومي", "Work Start Time", "कार्य शुरू समय")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.work_start_time || "08:00 ص"}
                    onChange={(e) => setEnrollForm({ ...enrollForm, work_start_time: e.target.value })}
                    placeholder="08:00 ص"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "وقت انتهاء العمل اليومي", "Work End Time", "कार्य समाप्ति समय")}
                  </label>
                  <input
                    type="text"
                    value={enrollForm.work_end_time || "04:00 م"}
                    onChange={(e) => setEnrollForm({ ...enrollForm, work_end_time: e.target.value })}
                    placeholder="04:00 م"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>{tl(language, "تسكين الطالب رسمياً", "Enroll Senior", "छात्र नामांकित करें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* MODAL: Edit Student Information */}
      {isEditOpen && editStudentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white font-heading">
                  {tl(language, "تعديل بيانات ومعلومات الطالب في التدريب", "Edit Student Information", "छात्र सूचना संपादित करें")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false)
                  setEditStudentTarget(null)
                }}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الطالب *", "Student Name *", "छात्र का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.student_name || ""}
                    onChange={(e) => setEditForm({ ...editForm, student_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الرقم الجامعي", "Student ID", "छात्र आईडी")}
                  </label>
                  <input
                    type="text"
                    value={editForm.student_id_number || ""}
                    onChange={(e) => setEditForm({ ...editForm, student_id_number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "التخصص *", "Specialization *", "विशेषज्ञता *")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.student_major || ""}
                  onChange={(e) => setEditForm({ ...editForm, student_major: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الشركة *", "Company Name *", "कंपनी का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.company_name || ""}
                    onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "المسمى الوظيفي للمتدرب", "Job Title", "कार्य पद")}
                  </label>
                  <input
                    type="text"
                    value={editForm.job_title || ""}
                    onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                    placeholder={tl(language, "مثال: مهندس برمجيات متدرب", "e.g. Software Engineer Intern", "सॉफ्टवेयर इंजीनियर")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "مقر الشراكة والتدريب *", "Partnership Location *", "साझेदारी स्थान *")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.partnership_location || editForm.company_location || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      partnership_location: e.target.value,
                      company_location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم المشرف المهني بالشركة *", "Professional Supervisor Name *", "व्यावसायिक पर्यवेक्षक का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.trainer_name || ""}
                    onChange={(e) => setEditForm({ ...editForm, trainer_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "تخصص المشرف المهني", "Supervisor Specialization", "पर्यवेक्षक विशेषज्ञता")}
                  </label>
                  <input
                    type="text"
                    value={editForm.trainer_specialization || ""}
                    onChange={(e) => setEditForm({ ...editForm, trainer_specialization: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "وقت بدء العمل اليومي", "Work Start Time", "कार्य शुरू समय")}
                  </label>
                  <input
                    type="text"
                    value={editForm.work_start_time || "08:00 ص"}
                    onChange={(e) => setEditForm({ ...editForm, work_start_time: e.target.value })}
                    placeholder="08:00 ص"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "وقت انتهاء العمل اليومي", "Work End Time", "कार्य समाप्ति समय")}
                  </label>
                  <input
                    type="text"
                    value={editForm.work_end_time || "04:00 م"}
                    onChange={(e) => setEditForm({ ...editForm, work_end_time: e.target.value })}
                    placeholder="04:00 م"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "حالة التدريب", "Training Status", "प्रशिक्षण स्थिति")}
                  </label>
                  <select
                    value={editForm.status || "تدريب نشط"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="تدريب نشط">{tl(language, "تدريب نشط", "Active Training", "सक्रिय प्रशिक्षण")}</option>
                    <option value="مكتمل معتمد">{tl(language, "مكتمل معتمد", "Completed & Certified", "पूर्ण और प्रमाणित")}</option>
                    <option value="تقييم معلق">{tl(language, "تقييم معلق", "Pending Evaluation", "लंबित मूल्यांकन")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الساعات المنجزة", "Completed Hours", "पूरे किए गए घंटे")}
                  </label>
                  <input
                    type="number"
                    value={editForm.completed_hours ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, completed_hours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "ملاحظات المشرف", "Supervisor Notes", "पर्यवेक्षक नोट्स")}
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditStudentTarget(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
                  <span>{tl(language, "حفظ التعديلات", "Save Changes", "परिवर्तन सहेजें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Field Visit Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{tl(language, "جدولة زيارة إشرافية ميدانية", "Schedule Supervision Visit", "पर्यवेक्षण विज़िट शेड्यूल करें")}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "اسم الطالب المستهدف *", "Student Name *", "छात्र का नाम *")}
                </label>
                <input
                  type="text"
                  required
                  value={scheduleForm.student_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, student_name: e.target.value })}
                  placeholder={tl(language, "عمر بن خالد المنصور", "Student Name", "छात्र का नाम")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم المنشأة / الشركة *", "Host Company *", "कंपनी *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.company_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, company_name: e.target.value })}
                    placeholder={tl(language, "أرامكو السعودية", "Company Name", "कंपनी का नाम")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الموقع والمقر *", "Location *", "स्थान *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                    placeholder={tl(language, "مركز الابتكار والتقنية", "Innovation Hub", "स्थान")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "تاريخ وتوقيت الزيارة *", "Date & Time *", "दिनांक और समय *")}
                </label>
                <input
                  type="text"
                  required
                  value={scheduleForm.date_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date_time: e.target.value })}
                  placeholder="2026-10-25 10:00 ص"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  <span>{tl(language, "تأكيد الجدولة والزيارة", "Confirm Schedule", "शेड्यूल पुष्टि करें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Evaluation Scoring Dialog */}
      {evalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>{tl(language, "رصد تقييم التدريب التعاوني", "Log Academic Evaluation", "शैक्षणिक मूल्यांकन दर्ज करें")}</span>
              </span>
              <button
                type="button"
                onClick={() => setEvalTarget(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-background/60 border border-border">
              <div className="text-xs font-bold text-white">{evalTarget.student_name}</div>
              <div className="text-[11px] text-muted-foreground">
                {evalTarget.student_major} | {evalTarget.company_name}
              </div>
              <div className="text-[10px] text-secondary mt-0.5">
                {tl(language, "المدرب الميداني:", "Trainer:", "ट्रेनर:")} {evalTarget.trainer_name} ({evalTarget.trainer_specialization})
              </div>
            </div>

            <form onSubmit={handleEvalSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "التقييم النصفي (من 30)", "Midterm Score (of 30)", "मिडटर्म स्कोर (30 में से)")}
                  </label>
                  <input
                    type="number"
                    max={30}
                    min={0}
                    value={evalForm.midterm_score || 0}
                    onChange={(e) => setEvalForm({ ...evalForm, midterm_score: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "التقييم النهائي (من 70)", "Final Score (of 70)", "फाइनल स्कोर (70 में से)")}
                  </label>
                  <input
                    type="number"
                    max={70}
                    min={0}
                    value={evalForm.final_score || 0}
                    onChange={(e) => setEvalForm({ ...evalForm, final_score: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "إجمالي الساعات المنجزة حتى الآن", "Completed Hours", "पूरे किए गए घंटे")}
                </label>
                <input
                  type="number"
                  value={evalForm.completed_hours || 0}
                  onChange={(e) => setEvalForm({ ...evalForm, completed_hours: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "ملاحظات وتوصيات المشرف الأكاديمي", "Supervisor Notes & Feedback", "पर्यवेक्षक नोट्स और प्रतिक्रिया")}
                </label>
                <textarea
                  rows={3}
                  value={evalForm.notes || ""}
                  onChange={(e) => setEvalForm({ ...evalForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEvalTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>{tl(language, "حفظ ورصد التقييم", "Save Evaluation", "मूल्यांकन सहेजें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <CoopStudentDetailModal
        student={studentDetailTarget}
        isOpen={Boolean(studentDetailTarget)}
        onClose={() => setStudentDetailTarget(null)}
        schedules={schedules}
        professor={professor}
        onScheduleVisit={(st) => {
          setStudentDetailTarget(null)
          setIsScheduleOpen(true)
          setScheduleForm(prev => ({
            ...prev,
            student_name: st.student_name,
            company_name: st.company_name,
          }))
        }}
        onUpdateEvaluation={(st) => {
          setStudentDetailTarget(null)
          setEvalTarget(st)
          setEvalForm({
            midterm_score: st.midterm_score || 28,
            final_score: st.final_score || 65,
            completed_hours: st.completed_hours,
            status: st.status,
            notes: st.notes || "",
          })
        }}
        onRefreshStudent={(updated) => {
          setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))
          if (studentDetailTarget?.id === updated.id) {
            setStudentDetailTarget(updated)
          }
        }}
        onViewAsStudent={(st) => {
          setSelectedStudentId(st.id)
          setPersona("student")
        }}
      />
    </div>
  )
}
