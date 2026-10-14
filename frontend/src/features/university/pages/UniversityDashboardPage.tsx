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
import {
  tl,
  getLocalizedOpportunities,
  getLocalizedCampaigns,
  getLocalizedKPIs,
} from "../utils/universityLocalization"
import type {
  UniversityStudentItem,
  GraduateEmploymentKPIs,
  UniversityOpportunityItem,
  UniversityThesisCampaign,
  AcademicUpdateItem,
  UniversityDashboardData,
} from "../types/university.types"
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
  DollarSign,
  MapPin,
  Building2,
  Award,
  X,
  Target,
  TrendingUp,
} from "lucide-react"

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

const DEFAULT_KPIS: GraduateEmploymentKPIs = {
  success: true,
  institution_name: "جامعة الملك فيصل",
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
      { bracket: "أقل من 8,000 ر.س", percentage: 12, color: "amber", count: 62 },
      { bracket: "8,000 - 11,000 ر.س", percentage: 36, color: "sky", count: 187 },
      { bracket: "11,000 - 15,000 ر.س", percentage: 38, color: "indigo", count: 197 },
      { bracket: "أعلى من 15,000 ر.س", percentage: 14, color: "emerald", count: 73 },
    ],
    by_specialization: [
      { specialization: "الذكاء الاصطناعي وعلم البيانات", avg_salary: 13500, range: "11,000 - 18,000 ر.س", demand_level: "مرتفع جداً" },
      { specialization: "الأمن السيبراني والبنية التحتية", avg_salary: 12800, range: "10,500 - 16,500 ر.س", demand_level: "مرتفع جداً" },
      { specialization: "هندسة البرمجيات والأنظمة السحابية", avg_salary: 11600, range: "9,500 - 15,000 ر.س", demand_level: "مرتفع" },
      { specialization: "التقنيات الزراعية الحديثة (AgTech)", avg_salary: 10200, range: "8,500 - 13,000 ر.س", demand_level: "مرتفع واعد" },
      { specialization: "نظم المعلومات الإدارية والتحول الرقمي", avg_salary: 9400, range: "8,000 - 12,000 ر.س", demand_level: "مستقر" },
    ],
  },
  unemployment_duration: {
    average_months_to_employment: 2.8,
    distribution: [
      { duration: "أقل من 3 أشهر", percentage: 58, description: "توظيف سريع بعد التخرج مباشرة أو أثناء التدريب التعاوني", count: 301 },
      { duration: "3 إلى 6 أشهر", percentage: 26, description: "فترة بحث اعتيادية ومقابلات اختيارية", count: 135 },
      { duration: "6 إلى 12 شهراً", percentage: 12, description: "حصول على شهادات مهنية تخصصية إضافية", count: 62 },
      { duration: "أكثر من 12 شهراً", percentage: 4, description: "إعادة توجيه مهني أو رغبة بالعمل الحر", count: 21 },
    ],
  },
  labor_market_status: {
    employed_in_field_pct: 66,
    employed_adjacent_pct: 14,
    actively_seeking_work_pct: 12,
    continuing_higher_education_pct: 8,
    actively_seeking_count: 71,
    higher_education_count: 48,
  },
  performance_indicators: {
    ncaaa_standard_score: "4.8 / 5.0 (معيار كفاءة التوظيف والاعتماد البرامجي)",
    employer_satisfaction_rate: "92.4%",
    graduate_skills_alignment: "88.7%",
  },
}

export function UniversityDashboardPage() {
  const { isRTL, language } = useTranslation()
  const { data, isLoading } = useUniversityDashboard()
  const { directVerifyStudent, isDirectVerifying } = useUniversityActions()

  const [verifyTarget, setVerifyTarget] = useState<UniversityStudentItem | null>(null)
  const [kpis, setKpis] = useState<GraduateEmploymentKPIs | null>(null)
  const [opportunities, setOpportunities] = useState<UniversityOpportunityItem[]>([])
  const [campaigns, setCampaigns] = useState<UniversityThesisCampaign[]>([])
  const [academicUpdates, setAcademicUpdates] = useState<AcademicUpdateItem[]>([])

  // Filtering states
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>("all")
  const [selectedUpdateFilter, setSelectedUpdateFilter] = useState<string>("all")

  // Interactive View Modals
  const [viewOpportunityModal, setViewOpportunityModal] = useState<UniversityOpportunityItem | null>(null)
  const [viewCampaignModal, setViewCampaignModal] = useState<UniversityThesisCampaign | null>(null)
  const [viewUpdateModal, setViewUpdateModal] = useState<AcademicUpdateItem | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchDashboardContent = async () => {
      try {
        const [kpiRes, oppRes, campRes, updateRes] = await Promise.allSettled([
          universityService.getEmploymentKPIs(),
          universityService.getOpportunities(),
          universityService.getThesisCampaigns(),
          universityService.getAcademicUpdates(),
        ])

        if (!isMounted) return

        if (kpiRes.status === "fulfilled" && kpiRes.value?.success) {
          setKpis(kpiRes.value)
        }
        if (oppRes.status === "fulfilled" && oppRes.value?.opportunities) {
          setOpportunities(oppRes.value.opportunities)
        }
        if (campRes.status === "fulfilled" && campRes.value?.campaigns) {
          setCampaigns(campRes.value.campaigns)
        }
        if (updateRes.status === "fulfilled" && updateRes.value?.updates) {
          setAcademicUpdates(updateRes.value.updates)
        }
      } catch (err) {
        console.error("Dashboard data load error:", err)
      }
    }

    fetchDashboardContent()
    return () => {
      isMounted = false
    }
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
  const { institution, stats, recent_students, recent_verifications } = effectiveData
  const activeKpis = kpis || DEFAULT_KPIS
  const localizedKpis = getLocalizedKPIs(activeKpis, language)
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  // Localized collections
  const localizedOpportunities = getLocalizedOpportunities(opportunities, language)
  const localizedCampaigns = getLocalizedCampaigns(campaigns, language)

  // Filtered collections
  const filteredOpportunities = localizedOpportunities.filter((opp) => {
    if (selectedOppFilter === "all") return true
    return opp.work_type === selectedOppFilter
  })

  const filteredUpdates = academicUpdates.filter((u) => {
    if (selectedUpdateFilter === "all") return true
    return u.category === selectedUpdateFilter
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. Top Header Banner: Logo, Name, Location, Accreditation, Profile Completion */}
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
                  <span>
                    {institution.institution_type ||
                      tl(
                        language,
                        "جامعة حكومية معتمدة",
                        "Accredited Public University",
                        "मान्यता प्राप्त सरकारी विश्वविद्यालय"
                      )}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {tl(
                      language,
                      "اعتماد مؤسسي كامل (NCAAA)",
                      "NCAAA Accredited",
                      "NCAAA मान्यता प्राप्त"
                    )}
                  </span>
                </span>

                {institution.qs_rank && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                    {institution.qs_rank}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
                {language === "ar"
                  ? institution.name_ar || institution.name
                  : institution.name || institution.name_ar}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span>
                    📍{" "}
                    {institution.location ||
                      tl(
                        language,
                        "الهفوف، الأحساء، المنطقة الشرقية",
                        "Al-Ahsa, Eastern Province, KSA",
                        "अल-अहसा, पूर्वी प्रांत"
                      )}
                  </span>
                </span>
                <span>•</span>
                <span>
                  {tl(
                    language,
                    "مركز قيادة الأداء الوظيفي والربط بسوق العمل",
                    "Graduate Performance & Labor Alignment Cockpit",
                    "स्नातक प्रदर्शन और श्रम बाजार संरेखण कॉकपिट"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="p-4 rounded-2xl bg-card/70 border border-border min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">
                {tl(language, "اكتمال الملف المؤسسي", "Profile Completion", "प्रोफ़ाइल पूर्णता")}
              </span>
              <span className="text-secondary font-black">
                {institution.completeness?.percentage || 87}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-background overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${institution.completeness?.percentage || 87}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {tl(language, "7 من 8 معايير مكتملة", "7 of 8 factors complete", "8 में से 7 कारक पूर्ण")}
              </span>
              <Link to={ROUTES.UNIVERSITY.PROFILE} className="text-secondary hover:underline font-semibold">
                {tl(language, "إدارة الملف", "Manage", "प्रबंधित करें")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Performance Indicators (KPIs) Top Cards */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {tl(
                language,
                "مؤشرات الأداء الأكاديمي والتوظيف (KPIs)",
                "Institutional Performance & Employment KPIs",
                "संस्थागत प्रदर्शन और रोजगार KPI"
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {localizedKpis.overall_metrics.performance_status ||
                tl(language, "محققة لمستهدفات رؤية 2030", "Vision 2030 Benchmark Met", "विज़न 2030 बेंचमार्क पूर्ण")}
            </span>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. In-Field Employment Rate */}
          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>
                {tl(language, "التوظيف بنفس التخصص", "In-Field Employment Rate", "संबंधित क्षेत्र में रोजगार")}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.overall_metrics.in_field_employment_rate}%
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {activeKpis.overall_metrics.gap_to_target}{" "}
              {tl(language, "أعلى من مستهدف رؤية 2030 (75%)", "vs 75% Vision 2030 target", "लक्ष्य से अधिक")}
            </div>
          </div>

          {/* 2. Average Starting Salary */}
          <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-950/20 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300">
              <span>
                {tl(language, "متوسط الراتب عند البداية", "Avg Starting Salary", "औसत प्रारंभिक वेतन")}
              </span>
              <span className="text-[11px] font-bold text-sky-400">SAR</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.salary_metrics.overall_average_starting_sar.toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-300">SAR/mo</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {tl(language, "عقود موثقة من التأمينات الاجتماعية", "Verified GOSI labor contracts", "सत्यापित रोजगार अनुबंध")}
            </div>
          </div>

          {/* 3. Median Expected Salary */}
          <div className="p-4 rounded-2xl border border-secondary/20 bg-secondary/10 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-secondary">
              <span>
                {tl(language, "الوسيط التقديري للرواتب", "Median Expected Salary", "मध्यिका अपेक्षित वेतन")}
              </span>
              <span className="text-[11px] font-bold text-secondary">SAR</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.salary_metrics.median_starting_sar.toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-300">SAR/mo</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {tl(language, "الرواتب لقطاع التقنية والهندسة", "Tech & engineering premium", "तकनीकी और इंजीनियरिंग")}
            </div>
          </div>

          {/* 4. Average Time-to-Hire */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>
                {tl(language, "متوسط مدة البحث والتوظيف", "Avg Time-to-Hire", "औसत नौकरी खोज अवधि")}
              </span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.unemployment_duration.average_months_to_employment}{" "}
              <span className="text-xs font-normal text-slate-300">
                {tl(language, "أشهر", "months", "महीने")}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {tl(language, "58% توظفوا في أقل من 3 أشهر", "58% placed in < 3 months", "58% 3 महीने से कम में")}
            </div>
          </div>

          {/* 5. Active Job Seekers */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>
                {tl(language, "الخريجون الباحثون عن عمل", "Active Job Seekers", "सक्रिय नौकरी चाहने वाले")}
              </span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.labor_market_status.actively_seeking_count}{" "}
              <span className="text-xs font-normal text-amber-400">
                ({activeKpis.labor_market_status.actively_seeking_work_pct}%)
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {tl(language, "مدرجون في برامج التأهيل والمقابلات", "In career placement pipeline", "प्लेसमेंट पाइपलाइन में")}
            </div>
          </div>

          {/* 6. Total Surveyed Graduates */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>
                {tl(language, "إجمالي خريجي الدفعة", "Total Cohort Graduates", "कुल स्नातक")}
              </span>
              <GraduationCap className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {activeKpis.overall_metrics.total_graduates_surveyed || stats.graduates_count || 595}{" "}
              <span className="text-xs font-normal text-slate-300">
                {tl(language, "خريج", "grads", "स्नातक")}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {activeKpis.overall_metrics.total_employed}{" "}
              {tl(language, "موظف مسجل حالياً", "registered employed", "पंजीकृत नियोजित")}
            </div>
          </div>

          {/* 7. Active Research & Marketing Campaigns */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-card/70 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span>
                {tl(language, "إعلانات وحملات الأطروحات", "Thesis Campaigns & Ads", "थीसिस और नवाचार अभियान")}
              </span>
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {campaigns.length || stats.thesis_campaigns_count || 4}{" "}
              <span className="text-xs font-normal text-slate-300">
                {tl(language, "حملات", "campaigns", "अभियान")}
              </span>
            </div>
            <div className="text-[11px] text-secondary font-semibold">
              {tl(language, "5,600+ مشاهدة • 27 فرصة شراكة", "5,600+ views • 27 leads", "5,600+ विचार • 27 लीड")}
            </div>
          </div>

          {/* 8. Incubator Startups */}
          <div className="p-4 rounded-2xl border border-secondary/20 bg-card/70 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-secondary">
              <span>
                {tl(language, "شركات حاضنة منشآت", "Incubator Startups", "इनक्यूबेटर स्टार्टअप")}
              </span>
              <Lightbulb className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {stats.incubator_ventures_count || 6}{" "}
              <span className="text-xs font-normal text-slate-300">
                {tl(language, "شركات", "startups", "स्टार्टअप")}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {tl(language, "+165 وظيفة • 4.2M ريال تمويل", "+165 jobs • 4.2M SAR raised", "+165 नौकरियां • 4.2M रियाल")}
            </div>
          </div>
        </div>

        {/* Quality & Accreditation Indicators Banner */}
        <div className="grid gap-3 md:grid-cols-3 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {activeKpis.performance_indicators.ncaaa_standard_score}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {tl(language, "معيار الاعتماد البرامجي الوطني", "NCAAA Standard Compliance", "राष्ट्रीय प्रमाणन मानक")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {activeKpis.performance_indicators.employer_satisfaction_rate}{" "}
                <span className="text-emerald-400 font-semibold">({tl(language, "رضا ممتاز", "High Rating", "उत्कृष्ट")})</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {tl(language, "معدل رضا جهات التوظيف عن الخريجين", "Employer Graduate Satisfaction Rate", "नियोक्ता संतुष्टि दर")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {activeKpis.performance_indicators.graduate_skills_alignment}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {tl(language, "مواءمة المهارات المكتسبة مع متطلبات الوظائف", "Skill Alignment with Job Market", "नौकरी बाजार के साथ कौशल संरेखण")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Graduate Employment KPIs Card */}
      <EmploymentKPIsCard kpis={activeKpis} isRtl={isRTL} />

      {/* 4. Graduate Employment & Labor Market Insights Section */}
      <GraduateEmploymentInsightsSection universityId={institution?.id} />

      {/* 5. PROMINENT SECTION: Active Job Advertisements & Career Opportunities */}
      <div className="rounded-3xl border border-border bg-card/85 p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary via-primary to-accent opacity-90" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>
                  {tl(
                    language,
                    "إعلانات الوظائف والفرص التوظيفية المعتمدة",
                    "Active Verified Job Advertisements & Opportunities",
                    "सक्रिय सत्यापित नौकरी विज्ञापन और अवसर"
                  )}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>
                  {opportunities.length}{" "}
                  {tl(language, "إعلانات نشطة ومباشرة", "Active Live Ads", "सक्रिय लाइव विज्ञापन")}
                </span>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-heading">
              {tl(
                language,
                "إعلانات التوظيف والتدريب المتاحة لطلاب وخريجي الجامعة",
                "Job & Internship Ads for University Students & Alumni",
                "छात्रों और पूर्व छात्रों के लिए नौकरी और इंटर्नशिप विज्ञापन"
              )}
            </h2>
            <p className="text-xs text-muted-foreground">
              {tl(
                language,
                "إعلانات توظيفية وتدريبية معتمدة من كبرى الشركات الوطنية والدولية، متوافقة بدقة مع مخرجات الأقسام والكليات وتخصصات الطلاب.",
                "Verified employment ads from leading national & regional enterprises, closely mapped to university departments and major requirements.",
                "प्रमुख उद्यमों से सत्यापित रोजगार विज्ञापन, जो विश्वविद्यालय के विभागों और प्रमुख आवश्यकताओं से मेल खाते हैं।"
              )}
            </p>
          </div>

          {/* Work Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-background/80 border border-border">
            {[
              { id: "all", label_ar: "جميع الإعلانات", label_en: "All Ads", label_hi: "सभी विज्ञापन" },
              { id: "دوام كامل", label_ar: "دوام كامل", label_en: "Full Time", label_hi: "पूर्णकालिक" },
              { id: "تدريب تعاوني", label_ar: "تدريب تعاوني", label_en: "Co-op Training", label_hi: "सहकारी प्रशिक्षण" },
              { id: "عن بعد", label_ar: "عن بعد", label_en: "Remote", label_hi: "रिमोट" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedOppFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedOppFilter === tab.id
                    ? "bg-secondary text-white shadow-md shadow-secondary/25"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {tl(language, tab.label_ar, tab.label_en, tab.label_hi)}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity / Job Ads Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.slice(0, 6).map((opp) => (
            <div
              key={opp.id}
              className="group p-5 rounded-3xl border border-border/80 bg-background/70 hover:bg-card/90 hover:border-secondary/50 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-border/80 bg-card p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-secondary/40">
                      {opp.company_logo ? (
                        <img
                          src={opp.company_logo}
                          alt={opp.company_name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-secondary transition-colors line-clamp-1">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{opp.company_name}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      opp.work_type === "تدريب تعاوني"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : opp.work_type === "عن بعد"
                        ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {opp.work_type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{opp.salary_range}</span>
                  </span>
                </div>

                {/* Skills tags */}
                {opp.skills && opp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-card border border-border/70 text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                    {opp.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] text-muted-foreground">
                        +{opp.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {tl(language, "إعلان نشط ومتاح للتقديم", "Open Ad", "सक्रिय विज्ञापन")}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setViewOpportunityModal(opp)}
                  className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary hover:text-white text-secondary text-xs font-bold transition-all border border-secondary/20 flex items-center gap-1"
                >
                  <span>{tl(language, "تفاصيل الإعلان", "Ad Details", "विवरण")}</span>
                  <ArrowIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Opportunities Footer Call to Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-background/50 border border-border/80">
          <div className="text-xs text-muted-foreground">
            <span>
              {tl(
                language,
                "يتم تحديث إعلانات الشراكات الوظيفية والتدريب التعاوني يومياً بالتكامل مع منصة العمل.",
                "Corporate job ads and coop opportunities updated daily via industry linkages.",
                "औद्योगिक संबंधों के माध्यम से कॉर्पोरेट नौकरी और को-ऑप विज्ञापन दैनिक रूप से अपडेट किए जाते हैं।"
              )}
            </span>
          </div>

          <Link
            to={ROUTES.UNIVERSITY.OPPORTUNITIES}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20 shrink-0"
          >
            <span>
              {tl(
                language,
                "استعراض كافة الإعلانات والفرص الوظيفية",
                "View All Job Advertisements",
                "सभी नौकरी विज्ञापन देखें"
              )}
            </span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6. Three Core University Ecosystem Features Hub */}
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
            {tl(
              language,
              "تسويق الرسائل العلمية والابتكارات",
              "Thesis & Innovation Campaigns",
              "थीसिस और नवाचार अभियान"
            )}
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
            {tl(
              language,
              "حاضنة منشآت بجامعة الملك فيصل",
              "Monsha'at Incubator Showcase",
              "मनशाआत इनक्यूबेटर शोकेस"
            )}
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
            {tl(
              language,
              "التدريب التعاوني للمشرف الأكاديمي",
              "Coop Training Supervision",
              "सहकारी प्रशिक्षण पर्यवेक्षण"
            )}
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

      {/* 7. Excellence Hub: Thesis Ads/Campaigns, Academic Updates & Incubator */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="text-base font-bold text-white font-heading">
              {tl(
                language,
                "نوافذ التميز: الحملات البحثية، التحديثات الأكاديمية وحاضنة الأعمال",
                "Excellence Hub: Research, Academic Updates & Incubator",
                "अनुसंधान, शैक्षणिक अपडेट और इनक्यूबेटर"
              )}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Column 1: Research & Thesis Marketing Campaigns / Ads */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-white">
                    {tl(
                      language,
                      "إعلانات الأطروحات والابتكارات",
                      "Thesis Campaigns & Ads",
                      "थीसिस और नवाचार अभियान"
                    )}
                  </h3>
                </div>
                <Link
                  to={ROUTES.UNIVERSITY.CAMPAIGNS}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {tl(language, "عرض الكل", "View All", "सभी देखें")} →
                </Link>
              </div>

              <div className="space-y-3">
                {localizedCampaigns.slice(0, 2).map((camp) => (
                  <div
                    key={camp.id}
                    onClick={() => setViewCampaignModal(camp)}
                    className="cursor-pointer p-3.5 rounded-2xl bg-background/60 border border-border/70 hover:border-primary/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-secondary group-hover:text-primary transition-colors truncate">
                        {camp.researcher_name} ({camp.thesis_type})
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-primary/20 text-primary border border-primary/30 shrink-0">
                        {camp.commercial_readiness_level.split(" - ")[0]}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {camp.thesis_title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="truncate">{camp.department.split(" - ")[0]}</span>
                      <span className="text-emerald-400 font-semibold shrink-0">
                        {camp.views_count.toLocaleString()} {tl(language, "مشاهدة", "views", "दृश्य")} • {camp.inquiries_count} {tl(language, "طلب", "leads", "लीड")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (localizedCampaigns[0]) setViewCampaignModal(localizedCampaigns[0])
              }}
              className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all text-center border border-primary/20"
            >
              {tl(language, "استعراض تفاصيل الأطروحات والشركاء", "View Research Details", "थीसिस विवरण देखें")}
            </button>
          </div>

          {/* Column 2: Academic Updates (Multi-Category Filters) */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-bold text-white">
                    {tl(
                      language,
                      "التحديثات الأكاديمية والبرامج",
                      "Academic Updates",
                      "शैक्षणिक अपडेट"
                    )}
                  </h3>
                </div>
                <Link
                  to={ROUTES.UNIVERSITY.UPDATES}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  {tl(language, "عرض الكل", "View All", "सभी देखें")} →
                </Link>
              </div>

              {/* Category selector pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: tl(language, "الكل", "All", "सभी") },
                  { id: "curriculum", label: tl(language, "مناهج", "Curriculum", "पाठ्यक्रम") },
                  { id: "new_programs", label: tl(language, "برامج", "Programs", "कार्यक्रम") },
                  { id: "research_achievement", label: tl(language, "أبحاث", "Research", "शोध") },
                  { id: "student_achievement", label: tl(language, "طلاب", "Students", "छात्र") },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedUpdateFilter(cat.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      selectedUpdateFilter === cat.id
                        ? "bg-secondary text-white"
                        : "bg-background/60 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredUpdates.slice(0, 2).map((upd) => (
                  <div
                    key={upd.id}
                    onClick={() => setViewUpdateModal(upd)}
                    className="cursor-pointer p-3.5 rounded-2xl bg-background/60 border border-border/70 hover:border-secondary/40 transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/30">
                        {upd.category === "curriculum"
                          ? tl(language, "تحديث مناهج", "Curriculum", "पाठ्यक्रम")
                          : upd.category === "new_programs"
                          ? tl(language, "برنامج جديد", "New Program", "नया कार्यक्रम")
                          : upd.category === "research_achievement"
                          ? tl(language, "براءة اختراع / بحث", "Research Patent", "शोध पेटेंट")
                          : upd.category === "student_achievement"
                          ? tl(language, "إنجاز طلابي", "Student Award", "छात्र उपलब्धि")
                          : tl(language, "إعلان رسمي", "Announcement", "घोषणा")}
                      </span>
                      <span className="text-muted-foreground">{upd.date}</span>
                    </div>
                    <div className="text-xs font-bold text-white leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {language === "ar"
                        ? upd.title_ar
                        : language === "hi"
                        ? upd.title_hi || upd.title_en
                        : upd.title_en}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2">
                      {language === "ar"
                        ? upd.description_ar
                        : language === "hi"
                        ? upd.description_hi || upd.description_en
                        : upd.description_en}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (filteredUpdates[0]) setViewUpdateModal(filteredUpdates[0])
              }}
              className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-secondary bg-secondary/10 hover:bg-secondary hover:text-white transition-all text-center border border-secondary/20"
            >
              {tl(language, "قراءة أحدث التحديثات الأكاديمية", "Read Latest Updates", "नवीनतम अपडेट पढ़ें")}
            </button>
          </div>

          {/* Column 3: Monsha'at Incubator @ KFU */}
          <div className="p-5 rounded-3xl border border-border bg-card/75 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-white">
                    {tl(
                      language,
                      "حاضنة منشآت بالأحساء",
                      "Monsha'at Startups",
                      "मनशाआत स्टार्टअप्स"
                    )}
                  </h3>
                </div>
                <Link
                  to={ROUTES.UNIVERSITY.INCUBATOR}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  {tl(language, "عرض الشركات", "View Ventures", "स्टार्टअप्स देखें")} →
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">شركة نخلة تك (NakhlahTech)</span>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      شركة نشطة
                    </span>
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
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      شركة نشطة
                    </span>
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

            <Link
              to={ROUTES.UNIVERSITY.INCUBATOR}
              className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-accent bg-accent/10 hover:bg-accent hover:text-white transition-all text-center border border-accent/20 block"
            >
              {tl(language, "استعراض حاضنة الأعمال والرواد", "Explore Monsha'at Incubator", "इनक्यूबेटर देखें")}
            </Link>
          </div>
        </div>
      </div>

      {/* 8. Two Column Section: Recent Verifications Queue & Recent Students */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Verification Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold text-white">
                {tl(
                  language,
                  "أحدث طلبات التوثيق الأكاديمي",
                  "Recent Verification Requests",
                  "हाल के सत्यापन अनुरोध"
                )}
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
                  {tl(
                    language,
                    "لا توجد طلبات توثيق معلقة حالياً.",
                    "No pending verification requests.",
                    "वर्तमान में कोई लंबित सत्यापन अनुरोध नहीं है।"
                  )}
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
                {tl(
                  language,
                  "أحدث الطلاب والخريجين المتصلين",
                  "Recently Connected Students",
                  "हाल ही में जुड़े छात्र और पूर्व छात्र"
                )}
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
                  {tl(
                    language,
                    "لم يسجل طلاب بعد في هذا الصرح الأكاديمي.",
                    "No connected students yet.",
                    "इस विश्वविद्यालय में अभी कोई छात्र पंजीकृत नहीं हैं।"
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 9. Bottom Hub Cards: Departments & Opportunities */}
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
                  {tl(
                    language,
                    "الأقسام والتخصصات الأكاديمية",
                    "Academic Departments & Programs",
                    "शैक्षणिक विभाग और कार्यक्रम"
                  )}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tl(
                    language,
                    "إدارة الكليات، الدرجات العلمية، وربط المخرجات",
                    "Manage faculties and degree levels",
                    "संकायों और डिग्री स्तरों का प्रबंधन करें"
                  )}
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
                  {tl(
                    language,
                    "فرص التوظيف والشراكات",
                    "Career Opportunities & Partnerships",
                    "करियर के अवसर और साझेदारियाँ"
                  )}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tl(
                    language,
                    "استعراض الوظائف النشطة المتوافقة مع تخصصات الطلاب",
                    "Active job listings aligned with majors",
                    "छात्रों की विशेषज्ञता के अनुरूप सक्रिय नौकरी लिस्टिंग"
                  )}
                </p>
              </div>
            </div>
            <ArrowIcon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </Link>
      </div>

      {/* 10. MODAL: Verification Modal */}
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

      {/* 11. MODAL: Opportunity / Job Ad Details Modal */}
      {viewOpportunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setViewOpportunityModal(null)}
              className="absolute top-5 end-5 p-2 rounded-full bg-background/80 hover:bg-muted text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-secondary/40 bg-background p-2 flex items-center justify-center shrink-0">
                {viewOpportunityModal.company_logo ? (
                  <img
                    src={viewOpportunityModal.company_logo}
                    alt={viewOpportunityModal.company_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-secondary" />
                )}
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  {viewOpportunityModal.work_type}
                </span>
                <h3 className="text-lg font-black text-white">{viewOpportunityModal.title}</h3>
                <p className="text-xs text-muted-foreground">{viewOpportunityModal.company_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-background/60 border border-border/80 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {tl(language, "الموقع الجغرافي:", "Location:", "स्थान:")}
                </span>
                <span className="font-bold text-white">{viewOpportunityModal.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {tl(language, "نطاق الراتب المتوقع:", "Salary Range:", "वेतन सीमा:")}
                </span>
                <span className="font-bold text-emerald-400">{viewOpportunityModal.salary_range}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {tl(language, "مستوى الخبرة المطلوب:", "Experience Level:", "अनुभव स्तर:")}
                </span>
                <span className="font-bold text-white">{viewOpportunityModal.experience_level}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  {tl(language, "حالة الإعلان:", "Status:", "स्थिति:")}
                </span>
                <span className="font-bold text-emerald-400">
                  {tl(language, "معتمد ونشط للتقديم", "Verified & Active", "सत्यापित और सक्रिय")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white">
                {tl(language, "المهارات والتخصصات المطلوبة:", "Required Skills & Majors:", "आवश्यक कौशल:")}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {viewOpportunityModal.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setViewOpportunityModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-white"
              >
                {tl(language, "إغلاق", "Close", "बंद करें")}
              </button>
              <Link
                to={ROUTES.UNIVERSITY.OPPORTUNITIES}
                onClick={() => setViewOpportunityModal(null)}
                className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-all shadow-lg shadow-secondary/25"
              >
                {tl(language, "التقديم ومتابعة الترشيح", "Apply / Recommend Student", "आवेदन करें")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 12. MODAL: Thesis Campaign / Innovation Details Modal */}
      {viewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setViewCampaignModal(null)}
              className="absolute top-5 end-5 p-2 rounded-full bg-background/80 hover:bg-muted text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
                {viewCampaignModal.thesis_type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {viewCampaignModal.commercial_readiness_level}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-white leading-snug">
              {viewCampaignModal.thesis_title}
            </h3>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-background/70 border border-border/80">
              <img
                src={viewCampaignModal.researcher_img}
                alt={viewCampaignModal.researcher_name}
                className="w-12 h-12 rounded-xl object-cover border border-primary/40 shrink-0"
              />
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {viewCampaignModal.researcher_name}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {viewCampaignModal.researcher_title}
                </div>
                <div className="text-[10px] text-secondary">
                  {viewCampaignModal.department}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-white">
                {tl(language, "الملخص التنفيذي والقيمة التجارية:", "Executive Summary & Commercial Value:", "कार्यकारी सारांश:")}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed p-3.5 rounded-2xl bg-background/40 border border-border/60">
                {viewCampaignModal.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {viewCampaignModal.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-card border border-border text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{viewCampaignModal.endorsement_text}</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setViewCampaignModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-white"
              >
                {tl(language, "إغلاق", "Close", "बंद करें")}
              </button>
              <Link
                to={ROUTES.UNIVERSITY.CAMPAIGNS}
                onClick={() => setViewCampaignModal(null)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-lg shadow-primary/25"
              >
                {tl(language, "فتح صفحة الحملة وطلب الشراكة", "Open Campaign Hub", "अभियान हब खोलें")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 13. MODAL: Academic Update Announcement Modal */}
      {viewUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setViewUpdateModal(null)}
              className="absolute top-5 end-5 p-2 rounded-full bg-background/80 hover:bg-muted text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
                {viewUpdateModal.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{viewUpdateModal.date}</span>
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              {language === "ar"
                ? viewUpdateModal.title_ar
                : language === "hi"
                ? viewUpdateModal.title_hi || viewUpdateModal.title_en
                : viewUpdateModal.title_en}
            </h3>

            <div className="text-xs text-secondary font-semibold">
              🏛️ {viewUpdateModal.department}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-2xl bg-background/60 border border-border/80">
              {language === "ar"
                ? viewUpdateModal.description_ar
                : language === "hi"
                ? viewUpdateModal.description_hi || viewUpdateModal.description_en
                : viewUpdateModal.description_en}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setViewUpdateModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-white"
              >
                {tl(language, "إغلاق", "Close", "बंद करें")}
              </button>
              <Link
                to={ROUTES.UNIVERSITY.UPDATES}
                onClick={() => setViewUpdateModal(null)}
                className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold transition-all shadow-lg shadow-secondary/25"
              >
                {tl(language, "استعراض مركز التحديثات الأكاديمية", "Academic Updates Center", "शैक्षणिक अपडेट केंद्र")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
