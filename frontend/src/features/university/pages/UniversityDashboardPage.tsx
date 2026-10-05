import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "@/i18n"
import { useUniversityDashboard } from "../hooks/useUniversityDashboard"
import { useUniversityActions } from "../hooks/useUniversityActions"
import { universityService } from "../services/university.service"
import { StudentAcademicCard } from "../components/StudentAcademicCard"
import { VerificationModal } from "../components/VerificationModal"
import { EmploymentKPIsCard } from "../components/EmploymentKPIsCard"
import { GraduateEmploymentInsightsSection } from "../../market-insights/components/GraduateEmploymentInsightsSection"
import { ROUTES } from "@/config/routes"
import { tl } from "../utils/universityLocalization"
import type { UniversityStudentItem, GraduateEmploymentKPIs } from "../types/university.types"
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  Rocket,
  Lightbulb,
  UserCheck,
  Sparkles,
  BookOpen,
} from "lucide-react"


import type { UniversityDashboardData } from "../types/university.types"

const DEFAULT_DASHBOARD_DATA: UniversityDashboardData = {
  success: true,
  institution: {
    id: 1,
    name_ar: "جامعة الملك فيصل",
    name_en: "King Faisal University",
    name: "جامعة الملك فيصل",
    email: "kfu@faeda.demo",
    description_ar: "جامعة رائدة في الأحساء مكرسة للأمن الغذائي والاستدامة البيئية والابتكار وريادة الأعمال.",
    description_en: "Leading university in Al-Ahsa dedicated to food security, environmental sustainability, and entrepreneurship innovation.",
    location: "الأحساء، المنطقة الشرقية",
    country: "المملكة العربية السعودية",
    website: "https://kfu.edu.sa",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
    institution_type: "جامعة حكومية",
    qs_rank: "#18 في المنطقة العربية",
    phone: "+966135800000",
    dean_name: "أ.د. محمد بن عبد العزيز العوهلي",
    career_center_email: "careers@kfu.edu.sa",
    is_verified: true,
    verified_at: "2026-01-15T10:00:00Z",
    status: "active",
    completeness: {
      percentage: 100,
      completed_factors: 6,
      total_factors: 6,
      checklist: []
    }
  },
  stats: {
    total_students: 1250,
    graduates_count: 595,
    verified_count: 512,
    pending_verifications: 14,
    departments_count: 8,
    academic_projects_count: 48,
    career_opportunities_count: 32,
    thesis_campaigns_count: 4,
    incubator_ventures_count: 3,
    coop_students_count: 12
  },
  recent_students: [
    {
      id: 1,
      user_id: "cand_uzair",
      fullname: "عمر بن خالد المنصور",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      educational_qualification: "بكالوريوس",
      department: "هندسة البرمجيات",
      university: "جامعة الملك فيصل",
      graduation_date: "2026",
      education_statue: "خريج متوقع",
      gpa: "4.85 / 5.0",
      preferred_field: "هندسة السحابة وحلول DevOps",
      work_type: "دوام كامل",
      skills: ["React", "TypeScript", "Python", "Docker", "AWS"],
      projects_count: 4,
      has_cv: true,
      career_readiness: 94,
      verification: {
        id: 101,
        status: "verified",
        verification_code: "KFU-VER-2026-8841",
        verified_at: "2026-09-15"
      }
    },
    {
      id: 2,
      user_id: "cand_sarah",
      fullname: "سارة بنت منصور العتيبي",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      educational_qualification: "بكالوريوس",
      department: "الذكاء الاصطناعي وعلم البيانات",
      university: "جامعة الملك فيصل",
      graduation_date: "2026",
      education_statue: "خريجة متوقعة",
      gpa: "4.92 / 5.0",
      preferred_field: "أبحاث تعلم الآلة ومعالجة اللغة",
      work_type: "دوام كامل",
      skills: ["PyTorch", "NLP", "Python", "Data Science"],
      projects_count: 5,
      has_cv: true,
      career_readiness: 98,
      verification: {
        id: 102,
        status: "verified",
        verification_code: "KFU-VER-2026-9122",
        verified_at: "2026-09-18"
      }
    },
    {
      id: 3,
      user_id: "cand_ali",
      fullname: "أحمد بن عبد الرحمن الملحم",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      educational_qualification: "بكالوريوس",
      department: "نظم المعلومات الإدارية",
      university: "جامعة الملك فيصل",
      graduation_date: "2026",
      education_statue: "خريج متوقع",
      gpa: "4.65 / 5.0",
      preferred_field: "إدارة المنتجات والتحول الرقمي",
      work_type: "تدريب تعاوني",
      skills: ["ERP", "Agile", "SQL", "PowerBI"],
      projects_count: 3,
      has_cv: true,
      career_readiness: 88,
      verification: {
        id: 103,
        status: "pending",
        verification_code: null,
        verified_at: null
      }
    }
  ],
  recent_verifications: [
    {
      id: 201,
      customer_id: 1,
      student_user_id: "cand_uzair",
      student_name: "عمر بن خالد المنصور",
      student_img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      degree: "بكالوريوس هندسة الحاسب",
      department: "هندسة البرمجيات",
      graduation_year: "2026",
      gpa: "4.85",
      status: "pending",
      verification_code: null,
      notes: "طلب توثيق الأهلية الأكاديمية للانضمام لبرنامج التدريب التعاوني بأرامكو.",
      requested_at: "2026-09-28T08:30:00Z",
      verified_at: null,
      verified_by: ""
    },
    {
      id: 202,
      customer_id: 2,
      student_user_id: "cand_sarah",
      student_name: "سارة بنت منصور العتيبي",
      student_img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      degree: "بكالوريوس علوم الحاسب",
      department: "الذكاء الاصطناعي",
      graduation_year: "2026",
      gpa: "4.92",
      status: "pending",
      verification_code: null,
      notes: "توثيق رسمي لمعدل التخرج للتقديم على مسرعة الذكاء الاصطناعي بشركة علم.",
      requested_at: "2026-09-29T11:15:00Z",
      verified_at: null,
      verified_by: ""
    }
  ]
}

export function UniversityDashboardPage() {
  const { isRTL, language } = useTranslation()
  const { data, isLoading } = useUniversityDashboard()
  const { directVerifyStudent, isDirectVerifying } = useUniversityActions()

  const [verifyTarget, setVerifyTarget] = useState<UniversityStudentItem | null>(null)
  const [kpis, setKpis] = useState<GraduateEmploymentKPIs | null>(null)

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await universityService.getEmploymentKPIs()
        if (res.success) {
          setKpis(res)
        }
      } catch {
        // Fallback default KPIs handled gracefully
      }
    }
    fetchKPIs()
  }, [])

  const handleConfirmDirectVerify = async (status: "verified" | "rejected", notes?: string) => {
    if (!verifyTarget) return
    if (status === "verified") {
      await directVerifyStudent({
        id: verifyTarget.id,
        payload: {
          degree: verifyTarget.educational_qualification,
          department: verifyTarget.department,
          graduation_year: verifyTarget.graduation_date,
          gpa: verifyTarget.gpa,
          notes,
        },
      })
    }
    setVerifyTarget(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

    const effectiveData = data || DEFAULT_DASHBOARD_DATA
  const { institution, recent_students, recent_verifications } = effectiveData
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const defaultKpis: GraduateEmploymentKPIs = {
    success: true,
    institution_name: institution.name_ar,
    overall_metrics: {
      in_field_employment_rate: 84.6,
      out_of_field_employment_rate: 15.4,
      total_graduates_surveyed: 595,
      total_employed: 519,
      national_rank_employability: "#3 في المنطقة الشرقية",
      vision_2030_target: 75.0,
      gap_to_target: "+9.6%",
      performance_status: "متفوق على المستهدف الوطني لرؤية 2030",
    },
    department_rates: [
      { department: "علوم الحاسب وتقنية المعلومات", rate: 89.2, graduates_count: 142, employed_count: 127, avg_salary: 12400 },
      { department: "هندسة البرمجيات", rate: 91.5, graduates_count: 98, employed_count: 90, avg_salary: 11800 },
      { department: "العلوم الزراعية والأغذية (AgTech)", rate: 83.0, graduates_count: 115, employed_count: 95, avg_salary: 10200 },
      { department: "إدارة الأعمال ونظم المعلومات", rate: 82.4, graduates_count: 160, employed_count: 132, avg_salary: 9400 },
      { department: "الأمن السيبراني والتحري الرقمي", rate: 93.8, graduates_count: 80, employed_count: 75, avg_salary: 13200 },
    ],
    salary_metrics: {
      overall_average_starting_sar: 11400,
      median_starting_sar: 11000,
      salary_brackets: [
        {"bracket": "أقل من 8,000 ر.س", "percentage": 12, "color": "amber", "count": 62},
        {"bracket": "8,000 - 11,000 ر.س", "percentage": 36, "color": "sky", "count": 187},
        {"bracket": "11,000 - 15,000 ر.س", "percentage": 38, "color": "indigo", "count": 197},
        {"bracket": "أعلى من 15,000 ر.س", "percentage": 14, "color": "emerald", "count": 73}
      ],
      by_specialization: [
        {"specialization": "الذكاء الاصطناعي وعلم البيانات", "avg_salary": 13500, "range": "11,000 - 18,000 ر.س", "demand_level": "مرتفع جداً"},
        {"specialization": "الأمن السيبراني والبنية التحتية", "avg_salary": 12800, "range": "10,500 - 16,500 ر.س", "demand_level": "مرتفع جداً"},
        {"specialization": "هندسة البرمجيات والأنظمة السحابية", "avg_salary": 11600, "range": "9,500 - 15,000 ر.س", "demand_level": "مرتفع"},
        {"specialization": "التقنيات الزراعية الحديثة (AgTech)", "avg_salary": 10200, "range": "8,500 - 13,000 ر.س", "demand_level": "مرتفع واعد"},
        {"specialization": "نظم المعلومات الإدارية والتحول الرقمي", "avg_salary": 9400, "range": "8,000 - 12,000 ر.س", "demand_level": "مستقر"}
      ]
    },
    unemployment_duration: {
      average_months_to_employment: 2.8,
      distribution: [
        {"duration": "أقل من 3 أشهر", "percentage": 58, "description": "توظيف سريع بعد التخرج مباشرة أو أثناء التدريب التعاوني", "count": 301},
        {"duration": "3 إلى 6 أشهر", "percentage": 26, "description": "فترة بحث اعتيادية ومقابلات اختيارية", "count": 135},
        {"duration": "6 إلى 12 شهراً", "percentage": 12, "description": "حصول على شهادات مهنية تخصصية إضافية", "count": 62},
        {"duration": "أكثر من 12 شهراً", "percentage": 4, "description": "إعادة توجيه مهني أو رغبة بالعمل الحر", "count": 21}
      ]
    },
    labor_market_status: {
      employed_in_field_pct: 66,
      employed_adjacent_pct: 14,
      actively_seeking_work_pct: 12,
      continuing_higher_education_pct: 8,
      actively_seeking_count: 71,
      higher_education_count: 48
    },
    performance_indicators: {
      ncaaa_standard_score: "4.8 / 5.0 (معيار كفاءة التوظيف والاعتماد البرامجي)",
      employer_satisfaction_rate: "92.4%",
      graduate_skills_alignment: "88.7%"
    }
  }

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Header Banner per Step 2: Logo, Name, Location, Accreditation, Profile Completion */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-[#0F2247]/95 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card border-2 border-primary/40 p-2 flex items-center justify-center shrink-0 shadow-lg shadow-black/30">
              <GraduationCap className="w-10 h-10 text-secondary" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
                  <span>{institution.institution_type || tl(language, "جامعة حكومية معتمدة", "Accredited Public University", "मान्यता प्राप्त सरकारी विश्वविद्यालय")}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tl(language, "اعتماد مؤسسي كامل (NCAAA)", "NCAAA Accredited", "NCAAA मान्यता प्राप्त")}</span>
                </span>

                {institution.qs_rank && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                    {institution.qs_rank}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
                {language === "ar" ? (institution.name_ar || institution.name) : (institution.name || institution.name_ar)}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span>📍 {institution.location || tl(language, "الهفوف، الأحساء، المنطقة الشرقية", "Al-Ahsa, Eastern Province, KSA", "अल-अहसा, पूर्वी प्रांत")}</span>
                </span>
                <span>•</span>
                <span>{tl(language, "مركز قيادة الأداء الوظيفي والربط بسوق العمل", "Graduate Performance & Labor Alignment Cockpit", "स्नातक प्रदर्शन और श्रम बाजार संरेखण कॉकपिट")}</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="p-4 rounded-2xl bg-card/70 border border-border min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">{tl(language, "اكتمال الملف المؤسسي", "Profile Completion", "प्रोफ़ाइल पूर्णता")}</span>
              <span className="text-secondary font-black">{institution.completeness?.percentage || 87}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-background overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${institution.completeness?.percentage || 87}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{tl(language, "7 من 8 معايير مكتملة", "7 of 8 factors complete", "8 में से 7 कारक पूर्ण")}</span>
              <Link to={ROUTES.UNIVERSITY.PROFILE} className="text-secondary hover:underline font-semibold">
                {tl(language, "إدارة الملف", "Manage", "प्रबंधित करें")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Main Performance KPI Cards per Step 2 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span>{tl(language, "مؤشرات الأداء الأكاديمي والتوظيف (KPIs)", "Institutional Performance & Employment KPIs", "संस्थागत प्रदर्शन और रोजगार KPI")}</span>
          </h2>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {tl(language, "محققة لمستهدفات رؤية 2030", "Vision 2030 Benchmark Met", "विज़न 2030 बेंचमार्क पूर्ण")}
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. In-Field Employment Rate */}
          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>{tl(language, "التوظيف بنفس التخصص", "In-Field Employment Rate", "संबंधित क्षेत्र में रोजगार")}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">84.6%</div>
            <div className="text-[11px] text-emerald-400 font-semibold">{tl(language, "+9.6% أعلى من مستهدف رؤية 2030 (75%)", "+9.6% vs 75% Vision 2030 target", "+9.6% लक्ष्य से अधिक")}</div>
          </div>

          {/* 2. Average Starting Salary */}
          <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-950/20 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300">
              <span>{tl(language, "متوسط الراتب عند البداية", "Avg Starting Salary", "औसत प्रारंभिक वेतन")}</span>
              <span className="text-[11px] font-bold text-sky-400">SAR</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">11,400 <span className="text-xs font-normal text-slate-300">SAR/mo</span></div>
            <div className="text-[11px] text-muted-foreground">{tl(language, "عقود موثقة من التأمينات الاجتماعية", "Verified GOSI labor contracts", "सत्यापित रोजगार अनुबंध")}</div>
          </div>

          {/* 3. Median Expected Salary */}
          <div className="p-4 rounded-2xl border border-secondary/20 bg-secondary/10 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-secondary">
              <span>{tl(language, "الوسيط التقديري للرواتب", "Median Expected Salary", "मध्यिका अपेक्षित वेतन")}</span>
              <span className="text-[11px] font-bold text-secondary">SAR</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">12,500 <span className="text-xs font-normal text-slate-300">SAR/mo</span></div>
            <div className="text-[11px] text-muted-foreground">{tl(language, "الرواتب لقطاع التقنية والهندسة", "Tech & engineering premium", "तकनीकी और इंजीनियरिंग")}</div>
          </div>

          {/* 4. Average Time-to-Hire */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>{tl(language, "متوسط مدة البحث والتوظيف", "Avg Time-to-Hire", "औसत नौकरी खोज अवधि")}</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">2.8 <span className="text-xs font-normal text-slate-300">{tl(language, "أشهر", "months", "महीने")}</span></div>
            <div className="text-[11px] text-muted-foreground">{tl(language, "58% توظفوا في أقل من 3 أشهر", "58% placed in < 3 months", "58% 3 महीने से कम में")}</div>
          </div>

          {/* 5. Active Job Seekers */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>{tl(language, "الخريجون الباحثون عن عمل", "Active Job Seekers", "सक्रिय नौकरी चाहने वाले")}</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">71 <span className="text-xs font-normal text-amber-400">(12%)</span></div>
            <div className="text-[11px] text-muted-foreground">{tl(language, "مدرجون في برامج التأهيل والمقابلات", "In career placement pipeline", "प्लेसमेंट पाइपलाइन में")}</div>
          </div>

          {/* 6. Total Graduates */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>{tl(language, "إجمالي خريجي الدفعة", "Total Graduates", "कुल स्नातक")}</span>
              <GraduationCap className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">595 <span className="text-xs font-normal text-slate-300">{tl(language, "خريج", "grads", "स्नातक")}</span></div>
            <div className="text-[11px] text-muted-foreground">{tl(language, "519 موظف مسجل حالياً", "519 registered employed", "519 पंजीकृत नियोजित")}</div>
          </div>

          {/* 7. Active Research Campaigns */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-card/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>{tl(language, "حملات الأطروحات النشطة", "Active Research Campaigns", "सक्रिय अनुसंधान अभियान")}</span>
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">6 <span className="text-xs font-normal text-slate-300">{tl(language, "حملات", "campaigns", "अभियान")}</span></div>
            <div className="text-[11px] text-secondary font-semibold">{tl(language, "5,600+ مشاهدة • 27 فرصة شراكة", "5,600+ views • 27 leads", "5,600+ विचार • 27 लीड")}</div>
          </div>

          {/* 8. Incubator Startups */}
          <div className="p-4 rounded-2xl border border-secondary/20 bg-card/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-secondary">
              <span>{tl(language, "شركات حاضنة منشآت", "Incubator Startups", "इनक्यूबेटर स्टार्टअप")}</span>
              <Lightbulb className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">6 <span className="text-xs font-normal text-slate-300">{tl(language, "شركات", "startups", "स्टार्टअप")}</span></div>
            <div className="text-[11px] text-emerald-400 font-semibold">{tl(language, "+165 وظيفة • 4.2M ريال تمويل", "+165 jobs • 4.2M SAR raised", "+165 नौकरियां • 4.2M रियाल")}</div>
          </div>
        </div>
      </div>

      {/* Graduate Employment & Employability Performance Indicators (KPIs) Dashboard */}
      <EmploymentKPIsCard kpis={kpis || defaultKpis} isRtl={isRTL} />

      {/* Graduate Employment & Market Insights (Aggregated & Anonymized) */}
      <GraduateEmploymentInsightsSection universityId={institution?.id} />

      {/* 3 Core University Ecosystem Features Hub */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Thesis & Innovation Campaigns */}
        <Link
          to={ROUTES.UNIVERSITY.CAMPAIGNS}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 hover:bg-card/95 hover:border-primary/50 p-6 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/20"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent opacity-80" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              {tl(language, "تسويق وهوية الجامعة", "Co-Branded", "सह-ब्रांडेड")}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors font-heading">
            {tl(language, "تسويق الرسائل العلمية والابتكارات", "Thesis & Innovation Campaigns", "थीसिस और नवाचार अभियान")}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {tl(
              language,
              "إطلاق حملات تسويقية لأصحاب رسائل الماجستير والابتكارات المعملية بشعار وهوية الجامعة الرسمية لجذب المستثمرين والشركات.",
              "Promote Master's theses and campus inventions with official university co-branding to attract investors and industry partners.",
              "निवेशकों और औद्योगिक भागीदारों को आकर्षित करने के लिए आधिकारिक विश्वविद्यालय ब्रांडिंग के साथ मास्टर थीसिस और आविष्कारों को बढ़ावा दें।"
            )}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-accent">
            <span>{tl(language, "استعراض الحملات والبطاقات", "Explore Campaigns", "अभियान देखें")}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Monsha'at Incubator @ KFU */}
        <Link
          to={ROUTES.UNIVERSITY.INCUBATOR}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 hover:bg-card/95 hover:border-secondary/50 p-6 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/20"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary to-primary opacity-80" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
              {tl(language, "حاضنة منشآت بالأحساء", "Monsha'at KFU", "मनशाआत इनक्यूबेटर")}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-secondary transition-colors font-heading">
            {tl(language, "حاضنة منشآت بجامعة الملك فيصل", "Monsha'at Incubator Showcase", "मनशाआत इनक्यूबेटर शोकेस")}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {tl(
              language,
              "استعراض رواد الأعمال والشركات المتخرجة، منتجاتها وخدماتها، وربطها بالمعايير الأكاديمية وتحديثات المناهج الدراسية.",
              "Showcase graduated entrepreneurs, their venture products/services, and link their learnings to academic criteria and curricula.",
              "स्नातक उद्यमियों, उनके उत्पादों/सेवाओं को प्रदर्शित करें और उन्हें शैक्षणिक मानदंडों और पाठ्यक्रम से जोड़ें।"
            )}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-secondary group-hover:text-sky-300">
            <span>{tl(language, "استعراض الشركات المتخرجة", "View Ventures", "स्टार्टअप्स देखें")}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Cooperative Training & Supervision */}
        <Link
          to={ROUTES.UNIVERSITY.COOP}
          className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 hover:bg-card/95 hover:border-accent/50 p-6 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/20"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-secondary to-primary opacity-80" />
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-accent/10 text-accent border border-accent/20 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              {tl(language, "بوابة المشرف الأكاديمي", "Supervision Portal", "पर्यवेक्षक पोर्टल")}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors font-heading">
            {tl(language, "التدريب التعاوني للمشرف الأكاديمي", "Coop Training Supervision", "सहकारी प्रशिक्षण पर्यवेक्षण")}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {tl(
              language,
              "متابعة الطلاب الخريجين المتدربين: أسمائهم، تخصصاتهم، جهة التدريب، موقعها، والمدرب الميداني وتخصصه مع جدول الزيارات.",
              "Track graduating students, host company details, location, mentor name & specialization, and professor supervision schedule.",
              "स्नातक छात्रों, कंपनी विवरण, स्थान, फील्ड मेंटर और पर्यवेक्षण कार्यक्रम को ट्रैक करें।"
            )}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:text-primary">
            <span>{tl(language, "الدخول لبوابة التدريب", "Open Supervision Portal", "प्रशिक्षण पोर्टल खोलें")}</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Showcase Sections per Step 2: Research Campaigns, Academic Updates, Incubator Summary */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="text-base font-bold text-white font-heading">
              {tl(language, "نوافذ التميز: الحملات البحثية، التحديثات الأكاديمية وحاضنة الأعمال", "Excellence Hub: Research, Academic Updates & Incubator", "अनुसंधान, शैक्षणिक अपडेट और इनक्यूबेटर")}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 1. Recent Research Campaigns */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-white">
                  {tl(language, "أحدث حملات الابتكار والرسائل", "Recent Research Campaigns", "हाल के शोध अभियान")}
                </h3>
              </div>
              <Link to={ROUTES.UNIVERSITY.CAMPAIGNS} className="text-xs font-bold text-primary hover:underline">
                {tl(language, "عرض الكل", "View All", "सभी देखें")} →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-secondary">سارة طارق الغامدي (ماجستير)</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-primary/20 text-primary border border-primary/30">TRL 7</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  طائرات بدون طيار ذاتية القيادة لتلقيح نخيل التمر
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>كلية العلوم الزراعية</span>
                  <span className="text-emerald-400 font-semibold">2,140 مشاهدة • 12 طلب شراكة</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-secondary">عبد العزيز سعد العتيبي (دكتوراه)</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-primary/20 text-primary border border-primary/30">TRL 8</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  منظومة الكشف التلقائي عن الثغرات الصفرية بنماذج الذكاء الاصطناعي
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>كلية علوم الحاسب</span>
                  <span className="text-emerald-400 font-semibold">1,890 مشاهدة • 8 طلبات</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Recent Academic Updates */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-white">
                  {tl(language, "أحدث التحديثات الأكاديمية", "Recent Academic Updates", "हाल के शैक्षणिक अपडेट")}
                </h3>
              </div>
              <Link to={ROUTES.UNIVERSITY.UPDATES} className="text-xs font-bold text-secondary hover:underline">
                {tl(language, "عرض الكل", "View All", "सभी देखें")} →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30">
                    {tl(language, "تحديث مناهج", "Curriculum", "पाठ्यक्रम")}
                  </span>
                  <span className="text-muted-foreground">2026-09-24</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  تحديث الخطة الدراسية لبكالوريوس الأمن السيبراني والذكاء الاصطناعي
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2">
                  دمج 4 مقررات معملية في هندسة النماذج اللغوية الكبيرة (LLMs) والدفاع السيبراني المتقدم.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-secondary/15 text-secondary border border-secondary/30">
                    {tl(language, "برنامج جديد", "New Program", "नया कार्यक्रम")}
                  </span>
                  <span className="text-muted-foreground">2026-09-18</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  تدشين ماجستير التقنيات الزراعية الذكية (AgTech)
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2">
                  برنامج نوعي مشترك مع مركز النخيل والتمور لدعم استدامة الواحة.
                </div>
              </div>
            </div>
          </div>

          {/* 3. Incubator / Startup Summary */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-white">
                  {tl(language, "حاضنة منشآت بالأحساء", "Monsha'at Startups", "मनशाआत स्टार्टअप्स")}
                </h3>
              </div>
              <Link to={ROUTES.UNIVERSITY.INCUBATOR} className="text-xs font-bold text-accent hover:underline">
                {tl(language, "عرض الشركات", "View Ventures", "स्टार्टअप्स देखें")} →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">شركة نخلة تك (NakhlahTech)</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">شركة نشطة</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  أجهزة استشعار وإنترنت الأشياء (IoT) لقياس رطوبة التربة ومكافحة سوسة النخيل الحمراء.
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/40 font-semibold">
                  <span className="text-secondary">م. محمد بن سلمان الجبر</span>
                  <span className="text-emerald-400">+48 وظيفة • 1.8M ريال تمويل</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">تمور الأحساء دايركت (AhsaDates)</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">شركة نشطة</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  منصة رقمية وسلسلة إمداد مبردة لتصدير التمور الفاخرة للأسواق الدولية.
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/40 font-semibold">
                  <span className="text-secondary">فهد عبد الله الخطيب</span>
                  <span className="text-emerald-400">+62 وظيفة • 1.4M ريال تمويل</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Verifications Queue & Recent Students */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Verification Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold text-white">
                {tl(language, "أحدث طلبات التوثيق الأكاديمي", "Recent Verification Requests", "हाल के सत्यापन अनुरोध")}
              </h3>
            </div>

            <Link
              to={ROUTES.UNIVERSITY.VERIFICATIONS}
              className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary/80"
            >
              <span>{tl(language, "عرض الكل", "View All", "सभी देखें")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recent_verifications && recent_verifications.length > 0 ? (
              recent_verifications.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card/80 backdrop-blur-md"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {v.student_name}
                      </span>
                      {v.status === "verified" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {v.degree} — {v.department} ({v.graduation_year})
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      v.status === "verified"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : v.status === "rejected"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {v.status === "verified"
                      ? tl(language, "معتمد", "Verified", "सत्यापित")
                      : v.status === "rejected"
                      ? tl(language, "مرفوض", "Rejected", "अस्वीकृत")
                      : tl(language, "معلق", "Pending", "लंबित")}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  {tl(language, "لا توجد طلبات توثيق معلقة حالياً.", "No pending verification requests.", "वर्तमान में कोई लंबित सत्यापन अनुरोध नहीं है।")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Connected Students (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-white">
                {tl(language, "أحدث الطلاب والخريجين المتصلين", "Recently Connected Students", "हाल ही में जुड़े छात्र और पूर्व छात्र")}
              </h3>
            </div>

            <Link
              to={ROUTES.UNIVERSITY.STUDENTS}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
            >
              <span>{tl(language, "استكشاف الدليل", "Explore Directory", "निर्देशिका देखें")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {recent_students && recent_students.length > 0 ? (
              recent_students.slice(0, 4).map((s) => (
                <StudentAcademicCard
                  key={s.id}
                  student={s}
                  onVerifyDirect={(target) => setVerifyTarget(target)}
                  isRtl={isRTL}
                />
              ))
            ) : (
              <div className="col-span-2 rounded-2xl border border-border bg-card/40 p-8 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  {tl(language, "لم يسجل طلاب بعد في هذا الصرح الأكاديمي.", "No connected students yet.", "इस विश्वविद्यालय में अभी कोई छात्र पंजीकृत नहीं हैं।")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Hub Cards: Departments & Opportunities */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.UNIVERSITY.DEPARTMENTS}
          className="group p-5 rounded-3xl border border-border bg-card/80 backdrop-blur-md hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {tl(language, "الأقسام والتخصصات الأكاديمية", "Academic Departments & Programs", "शैक्षणिक विभाग और कार्यक्रम")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tl(language, "إدارة الكليات، الدرجات العلمية، وربط المخرجات", "Manage faculties and degree levels", "संकायों और डिग्री स्तरों का प्रबंधन करें")}
                </p>
              </div>
            </div>
            <ArrowIcon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </Link>

        <Link
          to={ROUTES.UNIVERSITY.OPPORTUNITIES}
          className="group p-5 rounded-3xl border border-border bg-card/80 backdrop-blur-md hover:border-secondary/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
                  {tl(language, "فرص التوظيف والشراكات", "Career Opportunities & Partnerships", "करियर के अवसर और साझेदारियाँ")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tl(language, "استعراض الوظائف النشطة المتوافقة مع تخصصات الطلاب", "Active job listings aligned with majors", "छात्रों की विशेषज्ञता के अनुरूप सक्रिय नौकरी लिस्टिंग")}
                </p>
              </div>
            </div>
            <ArrowIcon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* Verification Modal */}
      {verifyTarget && (
        <VerificationModal
          isOpen={Boolean(verifyTarget)}
          onClose={() => setVerifyTarget(null)}
          studentName={verifyTarget.fullname}
          degree={verifyTarget.educational_qualification}
          department={verifyTarget.department}
          graduationYear={verifyTarget.graduation_date}
          gpa={verifyTarget.gpa}
          onSubmit={handleConfirmDirectVerify}
          isLoading={isDirectVerifying}
          isRtl={isRTL}
        />
      )}
    </div>
  )
}
