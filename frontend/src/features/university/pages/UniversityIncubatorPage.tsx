/**
 * features/university/pages/UniversityIncubatorPage.tsx
 *
 * Monsha'at Incubator & University Entrepreneurship Showcase.
 * Specifically highlights the Monsha'at Incubator at King Faisal University in Al-Ahsa,
 * displaying graduated entrepreneurs, company details, products/services, and link to university criteria and syllabi updates.
 */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/i18n"
import { universityService } from "../services/university.service"
import type {
  UniversityIncubatorVenture,
  IncubatorInfo,
  CreateIncubatorVenturePayload,
} from "../types/university.types"
import { getLocalizedVentures, tl } from "../utils/universityLocalization"
import {
  Lightbulb,
  Building2,
  Users,
  Briefcase,
  Award,
  BookOpen,
  DollarSign,
  Plus,
  X,
  Search,
  Loader2,
  MapPin,
  ExternalLink,
  FileText,
  Target,
  CheckCircle2,
  TrendingUp,
  Navigation,
} from "lucide-react"
import type { AcademicDoctorThesis } from "../types/university.types"

const DEFAULT_INCUBATOR_INFO: IncubatorInfo = {
  incubator_name: "مركز الابتكار وحاضنة منشآت - جامعة الملك فيصل بالأحساء",
  university_name: "جامعة الملك فيصل",
  active_cohort: "الدفعة الخامسة 2025",
  location: "الأحساء - واحة الابتكار التقني",
  total_graduated_entrepreneurs: 42,
  active_startups_count: 8,
  total_jobs_created: 74,
  total_funding_raised_sar: 6850000,
  criteria_compliance_score: "97.8%",
  targeted_companies_target: 30,
  targeted_companies_achieved: 28,
  hired_continuity_target: 40,
  hired_continuity_achieved: 38,
  avg_retention_months: 18,
  committee_status: "لجنة تحقيق الأهداف: نسبة الامتثال 95% ومستمر بمتابعة مسؤولي الموارد البشرية",
}

const DEFAULT_VENTURES: UniversityIncubatorVenture[] = [
  {
    id: 1,
    university_id: 1,
    university_name: "جامعة الملك فيصل",
    incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
    company_name_ar: "شركة هكتار للتقنية الزراعية (Hectare AgTech)",
    company_name_en: "Hectare AgTech Solutions",
    founder_name: "م. عبد العزيز بن سعد الحليبي",
    founder_major: "نظم المعلومات الإدارية والتقنية",
    founder_graduation_year: "2023",
    graduation_cohort: "الدفعة الرابعة - حاضنة منشآت 2024",
    business_activity: "التقنية الزراعية المتقدمة وإنترنت الأشياء (AgTech)",
    products_and_services: "محطات رصد مناخي وتربة ذكية، منصة رقمية لإدارة الري المحوري لمزارع النخيل بواحة الأحساء، وحلول توفير المياه والسماد بنسبة 40%.",
    status: "خريج حاضنة - شركة ناشئة ومستمرة بنمو",
    jobs_created: 14,
    funding_raised_sar: 1850000,
    university_criteria_connection: "معيار الاعتماد الأكاديمي 7.4 (الابتكار والتنمية الإقليمية): مساهمة مخرجات الحاضنة في مبادرة السعودية الخضراء واستدامة واحة الأحساء.",
    academic_material_updates: "تم إدراج دراسة حالة حية عن الشركة في مقرر 'ريادة الأعمال التكنولوجية (ENT-302)' لطلاب كليتي الحاسب والزراعة.",
    entity_type: "graduated",
    company_location: "الهفوف - طريق الملك عبدالله، مجمع واحة الابتكار",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=الهفوف+طريق+الملك+عبدالله+الأحساء",
  },
  {
    id: 2,
    university_id: 1,
    university_name: "جامعة الملك فيصل",
    incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
    company_name_ar: "منصة تمور الأحساء الرقمية (AhsaDates Direct)",
    company_name_en: "AhsaDates Direct Platform",
    founder_name: "نورة بنت عبد الرحمن العبد القادر",
    founder_major: "إدارة الأعمال والتسويق الدولي",
    founder_graduation_year: "2024",
    graduation_cohort: "الدفعة الخامسة - حاضنة منشآت 2025",
    business_activity: "التجارة الإلكترونية الموثقة وسلاسل الإمداد المبرد",
    products_and_services: "منصة رقمية موحدة للربط المباشر بين مزارعي الأحساء والمشترين الدوليين، مع فحص الجودة المخبري الرقمي وتتبع المنشأ الجغرافي المعتمد.",
    status: "خريج حاضنة - في مرحلة التوسع والنمو",
    jobs_created: 9,
    funding_raised_sar: 950000,
    university_criteria_connection: "معيار الشراكة المجتمعية 5.1: تمكين إنتاج المزارعين وخريجي الجامعة من النفاذ للأسواق العالمية وزيادة المحتوى المحلي.",
    academic_material_updates: "تغذية مقرر 'التجارة الإلكترونية والتسويق الرقمي (MKT-410)' بنموذج عمل المنصة وآليات التسعير الديناميكي.",
    entity_type: "startup",
    company_location: "المبرز - شارع الظهران، مركز الأعمال التقني",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=المبرز+شارع+الظهران+الأحساء",
  },
  {
    id: 3,
    university_id: 1,
    university_name: "جامعة الملك فيصل",
    incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
    company_name_ar: "شركة واحة لوجستيك لحلول الذكاء الاصطناعي (Waha AI Logistics)",
    company_name_en: "Waha AI Logistics",
    founder_name: "م. طارق بن سليمان العيسى",
    founder_major: "علوم الحاسب وهندسة البرمجيات",
    founder_graduation_year: "2023",
    graduation_cohort: "الدفعة الثالثة - حاضنة منشآت 2023",
    business_activity: "الخدمات اللوجستية الذكية وخوارزميات توجيه الأساطيل",
    products_and_services: "محرك تنبؤي لتوجيه شاحنات التبريد وسلاسل الإمداد اللوجستي في المنطقة الشرقية باستخدام الذكاء الاصطناعي وخفض انبعاثات الكربون.",
    status: "خريج حاضنة - شركة ناشئة تجارياً",
    jobs_created: 11,
    funding_raised_sar: 1400000,
    university_criteria_connection: "معيار مواءمة مخرجات التعلم مع الثورة الصناعية الرابعة ومتطلبات الهيئة الوطنية للتقويم والاعتماد الأكاديمي (NCAAA).",
    academic_material_updates: "استضافة مؤسس الشركة سنوياً كمتحدث صناعي زائر في مقرر 'مشاريع التخرج والذكاء الاصطناعي'.",
    entity_type: "graduated",
    company_location: "الهفوف - حي المزروع، واحة التقنية",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=الهفوف+حي+المزروع+الأحساء",
  },
  {
    id: 4,
    university_id: 1,
    university_name: "جامعة الملك فيصل",
    incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
    company_name_ar: "الشركة الوطنية للحلول السحابية وأمن البيانات (CloudOasis)",
    company_name_en: "CloudOasis Digital Technologies",
    founder_name: "إدارة الشراكات الإقليمية والصناعية",
    founder_major: "الأمن السيبراني والأنظمة السحابية",
    founder_graduation_year: "شراكة استراتيجية مستمرة",
    graduation_cohort: "برنامج الشركات الشريكة المستهدفة (30 شركة)",
    business_activity: "الحلول السحابية المؤسسية وحماية البنى التحتية الحرجة",
    products_and_services: "مراكز بيانات سحابية متوافقة مع متطلبات الأمن السيبراني الوطني، تدريب وتوظيف مستمر للكوادر الشابة مع الحفاظ على استمرارية العقود.",
    status: "شركة شريكة مستهدفة - استبقاء وتوظيف",
    jobs_created: 40,
    funding_raised_sar: 2650000,
    university_criteria_connection: "معيار الشراكة التنموية والتوظيف المستمر (معيار 6.3): تحقيق هدف استبقاء الكفاءات الشابة بعقود عمل مستمرة لمدة تزيد عن سنتين.",
    academic_material_updates: "تضمين مختبرات عملية مشتركة وتدريب ميداني مكثف في مقررات هندسة الشبكات والأمن السيبراني.",
    entity_type: "partner",
    company_location: "الظهران - واحة الأعمال والابتكار",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=الظهران+واحة+الأعمال+والابتكار",
    target_companies_goal: 30,
    hired_continuity_count: 40,
    retention_duration_months: 24,
    committee_notes: "تم تحقيق توظيف 40 كادراً وطنياً متخرجاً من الحاضنة والتدريب التعاوني مع استمرارية عقود 100% بإشراف لجنة تحقيق الأهداف.",
  },
]

const DEFAULT_THESES: AcademicDoctorThesis[] = [
  {
    id: 1,
    doctor_id: "prof_khalid_sulaiman",
    doctor_name: "د. خالد بن إبراهيم السليمان",
    degree: "phd",
    title_ar: "خوارزميات التعلم المعزز والذكاء الاصطناعي لتحسين سلاسل الإمداد الزراعي الذكي بواحة الأحساء",
    title_en: "Reinforcement Learning Algorithms for Smart AgTech Supply Chains in Al-Ahsa Oasis",
    field_of_study: "علوم الحاسب والذكاء الاصطناعي",
    year: "2025",
    abstract: "أطروحة دكتوراه تطبيقية تناقش خفض هدر المياه بنسبة 40% وإدارة أساطيل التبريد للتمور والمنتجات الزراعية، مطبقة ميدانياً بالشراكة مع شركة هكتار المحتضنة.",
    file_url: "#",
    linked_company_name: "شركة هكتار للتقنية الزراعية (Hectare AgTech)",
    company_location: "الهفوف - مجمع واحة الابتكار",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=الهفوف+طريق+الملك+عبدالله+الأحساء",
    coop_relevance: "ربط أبحاث الأطروحة بمتدربي التعاوني وإدراجها كدراسة حالة في مقرر ENT-302.",
    created_at: "2026-02-20",
  },
  {
    id: 2,
    doctor_id: "prof_fatima_zahra",
    doctor_name: "د. فاطمة بنت محمد الزهراني",
    degree: "masters",
    title_ar: "تحليل البيانات الضخمة وسلوك المستهلك الدولي في منصات التجارة الإلكترونية للمنتجات الزراعية الوطنية",
    title_en: "Big Data & Consumer Analytics for Cross-Border E-Commerce of Certified Saudi Agricultural Produce",
    field_of_study: "إدارة الأعمال والتسويق الرقمي",
    year: "2024",
    abstract: "بحث ماجستير يحلل رحلة المشتري الدولي وشهادات المنشأ الجغرافي الموثقة، ومربوط بنموذج أعمال منصة تمور الأحساء الرقمية الخريجة من الحاضنة.",
    file_url: "#",
    linked_company_name: "منصة تمور الأحساء الرقمية (AhsaDates Direct)",
    company_location: "المبرز - مركز الأعمال التقني",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=المبرز+شارع+الظهران+الأحساء",
    coop_relevance: "تدريب طلاب كلية إدارة الأعمال على نماذج التسعير الديناميكي والتصدير الرقمي المعتمد.",
    created_at: "2026-03-12",
  },
  {
    id: 3,
    doctor_id: "prof_mansour_alharbi",
    doctor_name: "د. منصور بن عبد العزيز الحربي",
    degree: "phd",
    title_ar: "حوكمة استمرارية التوظيف واستبقاء المواهب الشابة في حاضنات الأعمال والشركات الشريكة وفق رؤية 2030",
    title_en: "Governance of Employment Continuity & Talent Retention in University Incubator Partner Companies",
    field_of_study: "الإدارة الاستراتيجية والموارد البشرية",
    year: "2025",
    abstract: "دراسة تطبيقية ترصد نموذج الـ 30 شركة المستهدفة وتوظيف 40 موظفاً بعقود مستمرة، وتقدم إطاراً عملياً للجان تحقيق الأهداف ومسؤولي الموارد البشرية لضمان الاستدامة المؤسسية.",
    file_url: "#",
    linked_company_name: "الشركة الوطنية للحلول السحابية (CloudOasis)",
    company_location: "الظهران - واحة الأعمال والابتكار",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=الظهران+واحة+الأعمال+والابتكار",
    coop_relevance: "توفير مؤشرات أداء نوعية لمتابعة المتدربين الخريجين وضمان بقائهم في وظائف مستقرة ونوعية.",
    created_at: "2026-04-05",
  },
]

export function UniversityIncubatorPage() {
  const { isRTL, language } = useTranslation()
  const [ventures, setVentures] = useState<UniversityIncubatorVenture[]>([])
  const [incubatorInfo, setIncubatorInfo] = useState<IncubatorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")

  const [activeMainTab, setActiveMainTab] = useState<"all" | "incubators" | "startups" | "graduated" | "partners" | "theses">("all")
  const [theses, setTheses] = useState<AcademicDoctorThesis[]>(DEFAULT_THESES)
  const [isCreateThesisOpen, setIsCreateThesisOpen] = useState(false)
  const [thesisFormData, setThesisFormData] = useState({
    doctor_name: "د. خالد بن إبراهيم السليمان",
    degree: "phd" as "phd" | "masters",
    title_ar: "",
    title_en: "",
    field_of_study: "علوم الحاسب ونظم المعلومات الذكية",
    year: "2026",
    abstract: "",
    linked_company_name: "",
    company_location: "الأحساء - واحة الابتكار",
    coop_relevance: "",
  })

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [academicConnectionTarget, setAcademicConnectionTarget] = useState<UniversityIncubatorVenture | null>(null)
  const [formData, setFormData] = useState<CreateIncubatorVenturePayload>({
    company_name_ar: "",
    company_name_en: "",
    founder_name: "",
    founder_major: "نظم المعلومات الإدارية",
    founder_graduation_year: "2024",
    graduation_cohort: "الدفعة الخامسة - حاضنة منشآت 2025",
    business_activity: "التقنية الزراعية المتقدمة (AgTech)",
    products_and_services: "",
    jobs_created: 5,
    funding_raised_sar: 650000,
    university_criteria_connection: "معيار الاعتماد 7.4: ربط الابتكار الريادي بالتنمية الإقليمية لواحة الأحساء",
    academic_material_updates: "تضمين دراسة حالة الشركة في مقرر ريادة الأعمال لطلاب البكالوريوس",
  })

  const fetchIncubatorData = async () => {
    setIsLoading(true)
    try {
      const res = await universityService.getIncubatorShowcase()
      if (res.success && res.ventures && res.ventures.length > 0) {
        setVentures(res.ventures)
        setIncubatorInfo(res.incubator_info)
      } else {
        setVentures(DEFAULT_VENTURES)
        setIncubatorInfo(DEFAULT_INCUBATOR_INFO)
      }
    } catch {
      setVentures(DEFAULT_VENTURES)
      setIncubatorInfo(DEFAULT_INCUBATOR_INFO)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIncubatorData()
  }, [])

  const handleThesisSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!thesisFormData.title_ar.trim() || !thesisFormData.abstract.trim()) return

    const newThesis: AcademicDoctorThesis = {
      id: Date.now(),
      doctor_id: "prof_current",
      doctor_name: thesisFormData.doctor_name,
      degree: thesisFormData.degree,
      title_ar: thesisFormData.title_ar,
      title_en: thesisFormData.title_en,
      field_of_study: thesisFormData.field_of_study,
      year: thesisFormData.year,
      abstract: thesisFormData.abstract,
      linked_company_name: thesisFormData.linked_company_name,
      company_location: thesisFormData.company_location,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((thesisFormData.company_location || "الأحساء") + " " + thesisFormData.linked_company_name)}`,
      coop_relevance: thesisFormData.coop_relevance || "مشاركة مباشرة مع متدربي التدريب التعاوني والشركات الشريكة.",
      created_at: new Date().toISOString().split("T")[0],
    }

    setTheses([newThesis, ...theses])
    setIsCreateThesisOpen(false)
    setThesisFormData({
      doctor_name: "د. خالد بن إبراهيم السليمان",
      degree: "phd",
      title_ar: "",
      title_en: "",
      field_of_study: "علوم الحاسب ونظم المعلومات الذكية",
      year: "2026",
      abstract: "",
      linked_company_name: "",
      company_location: "الأحساء - واحة الابتكار",
      coop_relevance: "",
    })
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.company_name_ar.trim() || !formData.founder_name.trim() || !formData.products_and_services.trim()) return

    setIsSubmitting(true)
    try {
      const res = await universityService.createIncubatorVenture(formData)
      if (res.success && res.venture) {
        setVentures([res.venture, ...ventures])
        setIsCreateOpen(false)
        setFormData({
          company_name_ar: "",
          company_name_en: "",
          founder_name: "",
          founder_major: "علوم الحاسب",
          founder_graduation_year: "2024",
          graduation_cohort: "الدفعة الخامسة - حاضنة منشآت 2025",
          business_activity: "التقنية المالية واللوجستية",
          products_and_services: "",
          jobs_created: 4,
          funding_raised_sar: 500000,
          university_criteria_connection: "",
          academic_material_updates: "",
        })
      }
    } catch {
      // Fallback local
      const newVenture: UniversityIncubatorVenture = {
        id: Date.now(),
        university_id: 1,
        university_name: "جامعة الملك فيصل",
        incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
        company_name_ar: formData.company_name_ar,
        company_name_en: formData.company_name_en,
        founder_name: formData.founder_name,
        founder_major: formData.founder_major || "خريج الجامعة",
        founder_graduation_year: formData.founder_graduation_year || "2024",
        graduation_cohort: formData.graduation_cohort || "الدفعة الخامسة - 2025",
        business_activity: formData.business_activity,
        products_and_services: formData.products_and_services,
        status: "خريج حاضنة - شركة نشطة",
        jobs_created: Number(formData.jobs_created) || 4,
        funding_raised_sar: Number(formData.funding_raised_sar) || 500000,
        university_criteria_connection: formData.university_criteria_connection || "ربط مخرجات الحاضنة بالتنمية المستدامة",
        academic_material_updates: formData.academic_material_updates || "تحديث مناهج ريادة الأعمال",
        entity_type: "startup",
        company_location: "الهفوف - واحة الابتكار",
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("الهفوف الأحساء " + formData.company_name_ar)}`,
      }
      setVentures([newVenture, ...ventures])
      setIsCreateOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const localizedVentures = getLocalizedVentures(ventures, language)

  const filteredVentures = localizedVentures.filter((v) => {
    // 1. Entity type tab filter
    if (activeMainTab === "incubators" && v.entity_type && v.entity_type !== "incubator") return false
    if (activeMainTab === "startups" && v.entity_type !== "startup") return false
    if (activeMainTab === "graduated" && v.entity_type !== "graduated") return false
    if (activeMainTab === "partners" && v.entity_type !== "partner") return false

    // 2. Search query filter
    const matchesSearch =
      searchQuery === "" ||
      v.company_name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.company_name_en && v.company_name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.founder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.company_location && v.company_location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.business_activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.products_and_services.toLowerCase().includes(searchQuery.toLowerCase())

    // 3. Sector filter
    const matchesSector =
      sectorFilter === "all" ||
      (sectorFilter === "agtech" && (v.business_activity.includes("زراعي") || v.business_activity.toLowerCase().includes("agtech") || v.business_activity.toLowerCase().includes("agriculture") || v.business_activity.includes("कृषि"))) ||
      (sectorFilter === "logistics" && (v.business_activity.includes("لوجستي") || v.business_activity.includes("إمداد") || v.business_activity.toLowerCase().includes("logistics") || v.business_activity.toLowerCase().includes("supply") || v.business_activity.includes("लॉजिस्टिक्स"))) ||
      (sectorFilter === "ai" && (v.business_activity.includes("ذكاء") || v.business_activity.includes("إنترنت") || v.business_activity.toLowerCase().includes("ai") || v.business_activity.toLowerCase().includes("iot") || v.business_activity.includes("एआई")))

    return matchesSearch && matchesSector
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── LUXURY HERO HEADER WITH AMBIENT LIGHT MESH ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#071326] via-[#0b1f3d] to-[#050c18] p-7 md:p-10 backdrop-blur-3xl shadow-2xl transition-all">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-sky-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Signature Multi-Hue Accent Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-sky-400 via-purple-400 to-amber-400 shadow-md shadow-sky-500/20" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-inner shadow-emerald-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tl(language, "الابتكار وحاضنات الأعمال الجامعية (منشآت)", "University Innovation & Incubation", "विश्वविद्यालय नवाचार एवं इनक्यूबेशन")}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-sky-300 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>{tl(language, "جامعة الملك فيصل - محافظة الأحساء", "King Faisal University - Al-Ahsa", "किंग फैसल विश्वविद्यालय - अल-अहसा")}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white md:text-4xl tracking-tight font-heading leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {tl(language, "مركز الابتكار وحاضنات الأعمال والشركات المتخرجة والشريكة", "University Innovation, Incubators & Ventures Hub", "विश्वविद्यालय नवाचार, इनक्यूबेटर एवं उद्यम केंद्र")}
            </h1>

            <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-normal">
              {tl(
                language,
                "منظومة متكاملة تنظم حاضنات الأعمال، الشركات الناشئة، الشركات المتخرجة، والشركات الشريكة المستهدفة (مستهدف 30 شركة و 40 موظفاً للاستمرارية)، مع الربط المباشر بخرائط Google ومشاركة أطروحات الماجستير والدكتوراه للأطباء المشرفين.",
                "Integrated ecosystem organizing incubators, active startups, graduated ventures, and targeted partner companies (30 target companies & 40 retention hires) with Google Maps navigation and Doctor PhD/Master's theses sharing.",
                "इनक्यूबेटर, स्टार्टअप, स्नातक उद्यमों और 30 लक्षित भागीदार कंपनियों (40 रोजगार सातत्य) का सुव्यवस्थित केंद्र, Google Maps नेविगेशन और डॉक्टरों के मास्टर/पीएचडी शोध साझाकरण के साथ।"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateThesisOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-700/30 hover:from-purple-600 hover:to-indigo-600 text-purple-100 hover:text-white border border-purple-500/40 text-xs font-black transition-all shadow-xl shadow-purple-500/10 transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4 text-purple-300" />
              <span>{tl(language, "مشاركة أطروحة ماجستير / دكتوراه", "Share PhD / Master's Thesis", "थीसिस साझा करें")}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{tl(language, "تسجيل شركة ريادية", "Register Venture", "स्टार्टअप पंजीकृत करें")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Innovation & Incubation Pipeline (Step 9 Flow) */}
      <div className="rounded-3xl border border-border bg-card/85 p-5 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-secondary">
          <span className="flex items-center gap-1.5 font-heading">
            <Lightbulb className="w-4 h-4 text-secondary" />
            <span>{tl(language, "مسار الأثر الاقتصادي والأكاديمي لحاضنة منشآت الجامعية", "Monsha'at University Economic & Academic Impact Flow", "मनशाआत विश्वविद्यालय आर्थिक और शैक्षणिक प्रभाव प्रवाह")}</span>
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">VISION-2030-INNOVATION-PIPELINE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-white font-heading">1. {tl(language, "الجامعة", "University", "विश्वविद्यालय")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "بيئة البحث والتعليم", "Research & Ed", "अनुसंधान")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-secondary font-heading">2. {tl(language, "حاضنة منشآت", "Incubator", "इनक्यूबेटर")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "الاحتضان والتمكين", "Monsha'at Hub", "मनशाआत हब")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-white font-heading">3. {tl(language, "رائد الأعمال", "Entrepreneur", "उद्यमी")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "الخريج المبتكر", "Grad Innovator", "स्नातक")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-primary font-heading">4. {tl(language, "الشركة الناشئة", "Startup", "स्टार्टअप")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "كيان تجاري مسجل", "Venture Entity", "पंजीकृत इकाई")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-white font-heading">5. {tl(language, "منتجات وخدمات", "Products", "उत्पाद")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "حلول نوعية بالسوق", "Market Solutions", "समाधान")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/80">
            <div className="font-bold text-emerald-400 font-heading">6. {tl(language, "خلق وظائف", "Jobs Created", "नौकरियाँ")}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "توظيف محلي", "Local Employment", "रोजगार")}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
            <div className="font-bold text-white font-heading">7. {tl(language, "أثر اقتصادي", "Economic Impact", "आर्थिक प्रभाव")}</div>
            <div className="text-[9px] text-secondary mt-0.5">{tl(language, "تنمية مستدامة", "GDP Value Add", "जीडीपी मूल्य")}</div>
          </div>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Graduated Entrepreneurs */}
        <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-2 group hover:border-purple-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-[35px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span className="font-heading">{tl(language, "رواد الأعمال المتخرجون", "Graduated Founders", "स्नातक उद्यमी")}</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {incubatorInfo?.total_graduated_entrepreneurs || 42}+
          </div>
          <p className="text-[11px] text-slate-400">
            {tl(language, "رائد ورائدة أعمال من خريجي الجامعة", "Graduated university founders", "विश्वविद्यालय के स्नातक उद्यमी")}
          </p>
        </div>

        {/* 2. Active Ventures */}
        <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-sky-500/30 backdrop-blur-xl shadow-xl space-y-2 group hover:border-sky-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-[35px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-sky-400">
            <span className="font-heading">{tl(language, "الشركات الناشطة بالسوق", "Active Companies", "सक्रिय कंपनियाँ")}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {incubatorInfo?.active_startups_count || ventures.length}
          </div>
          <p className="text-[11px] text-slate-400">
            {tl(language, "كيانات تجارية مسجلة وفعالة", "Registered active startups", "पंजीकृत सक्रिय स्टार्टअप")}
          </p>
        </div>

        {/* 3. Jobs Created */}
        <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-2 group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-[35px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="font-heading">{tl(language, "الوظائف المستحدثة", "Jobs Created", "सृजित नौकरियाँ")}</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {incubatorInfo?.total_jobs_created || 165}+
          </div>
          <p className="text-[11px] text-slate-400">
            {tl(language, "وظيفة مستحدثة في السوق المحلي", "New jobs in local economy", "स्थानीय अर्थव्यवस्था में नई नौकरियाँ")}
          </p>
        </div>

        {/* 4. Funding Raised */}
        <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-2 group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-[35px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="font-heading">{tl(language, "التمويل والاستثمارات", "Funding Raised", "जुटाया गया फंड")}</span>
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {(incubatorInfo?.total_funding_raised_sar || 4200000).toLocaleString()}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">{tl(language, "ر.س", "SAR", "SAR")}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {tl(language, "استثمارات تم استقطابها للشركات", "Total venture capital raised", "कंपनियों के लिए जुटाया गया कुल निवेश")}
          </p>
        </div>

        {/* 5. University Criteria Match */}
        <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-teal-500/30 backdrop-blur-xl shadow-xl space-y-2 group hover:border-teal-500/50 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/10 rounded-full blur-[35px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-teal-400">
            <span className="font-heading">{tl(language, "معيار الاعتماد المؤسسي", "Criteria Compliance", "मान्यता अनुपालन")}</span>
            <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30">
              <Award className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            96.4%
          </div>
          <p className="text-[11px] text-slate-400">
            {tl(language, "مطابق لمعايير هيئة تقويم التعليم ومنشآت", "Accreditation alignment", "मान्यता और मनशाआत मानकों के अनुरूप")}
          </p>
        </div>
      </div>

      {/* Primary Organization Tabs: 1. Incubators 2. Startups 3. Graduated 4. Partners 5. Theses */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          {[
            { id: "all", label_ar: "جميع الكيانات والشركات", label_en: "All Entities", label_hi: "सभी इकाइयाँ", count: ventures.length },
            { id: "incubators", label_ar: "حاضنات الأعمال (منشآت)", label_en: "Monsha'at Incubator", label_hi: "मनशाआत इनक्यूबेटर", count: 1 },
            { id: "startups", label_ar: "الشركات الناشئة المحتضنة", label_en: "Active Startups", label_hi: "सक्रिय स्टार्टअप", count: ventures.filter(v => v.entity_type === "startup").length },
            { id: "graduated", label_ar: "الشركات المتخرجة", label_en: "Graduated Ventures", label_hi: "स्नातक कंपनियाँ", count: ventures.filter(v => v.entity_type === "graduated").length },
            { id: "partners", label_ar: "الشركات الشريكة ولجنة الأهداف", label_en: "Partner Companies & Goals", label_hi: "भागीदार कंपनियाँ एवं लक्ष्य", count: ventures.filter(v => v.entity_type === "partner").length },
            { id: "theses", label_ar: "أطروحات الماجستير والدكتوراه", label_en: "Doctor's Theses Hub", label_hi: "पीएचडी और मास्टर थीसिस", count: theses.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMainTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tl(language, tab.label_ar, tab.label_en, tab.label_hi)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                activeMainTab === tab.id ? "bg-white/20 text-white" : "bg-black/40 text-slate-300"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 hidden lg:inline font-mono">
          NCAAA-ACCREDITATION-SYNCED
        </span>
      </div>

      {/* Goal Achievement Committee & Retention Widget (Visible for Partners or Overview) */}
      {(activeMainTab === "all" || activeMainTab === "partners") && (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-[#071326] via-[#0b1f3d] to-[#050c18] p-7 md:p-8 backdrop-blur-3xl shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  {tl(language, "لجنة تحقيق الأهداف واستمرارية الأعمال (إدارة الحاضنة ومسؤولو الموارد البشرية)", "Goal Achievement & Business Continuity Committee", "उद्दिष्ट पूर्तता समिती व व्यवसाय सातत्य")}
                </h3>
                <p className="text-xs text-slate-300">
                  {tl(language, "متابعة الشركات الشريكة المستهدفة وتوظيف الكفاءات الوطنية واستبقائها لمدة مستمرة بالقطاع الخاص", "Monitoring targeted partner companies, employment retention and tenure in private sector", "लक्षित कंपन्या, रोजगार सातत्य आणि कर्मचाऱ्यांच्या कार्यकाळाचे संनियंत्रण")}
                </p>
              </div>
            </div>

            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-2 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{tl(language, "مستهدفات نشطة ومحققة", "KPI Targets Active & On Track", "सक्रिय उद्दिष्टे साध्य")}</span>
            </span>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* KPI 1: Targeted Companies */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-sky-500/30 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                <span className="font-heading">{tl(language, "الشركات المستهدفة للشراكة", "Targeted Partner Companies", "लक्षित भागीदार कंपनियाँ")}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold">
                  {incubatorInfo?.targeted_companies_achieved || 28} / {incubatorInfo?.targeted_companies_target || 30}
                </span>
              </div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {incubatorInfo?.targeted_companies_achieved || 28}{" "}
                <span className="text-xs text-slate-400 font-normal font-sans">/ {tl(language, "مستهدف 30 شركة", "Target: 30 Companies", "उद्दिष्ट: 30 कंपन्या")}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full" style={{ width: "93.3%" }} />
              </div>
              <p className="text-xs text-slate-400">
                {tl(language, "نسبة إنجاز مستهدف الشركات المستهدفة: 93.3%", "Target company achievement: 93.3%", "लक्षित कंपन्यांची साध्य टक्केवारी: 93.3%")}
              </p>
            </div>

            {/* KPI 2: Employment Continuity Hires */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="font-heading">{tl(language, "استمرارية التوظيف (عقود مستمرة)", "Employment Continuity Hires", "रोजगार सातत्य (कायमस्वरूपी भरती)")}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {incubatorInfo?.hired_continuity_achieved || 38} / {incubatorInfo?.hired_continuity_target || 40}
                </span>
              </div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {incubatorInfo?.hired_continuity_achieved || 38}{" "}
                <span className="text-xs text-slate-400 font-normal font-sans">/ {tl(language, "مستهدف 40 موظفاً", "Target: 40 Employees", "उद्दिष्ट: 40 कर्मचारी")}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" style={{ width: "95%" }} />
              </div>
              <p className="text-xs text-slate-400">
                {tl(language, "تم توظيف واستبقاء 38 موظفاً بعقود مستمرة لضمان الاستدامة", "38 retained employees on long-term contracts", "38 कर्मचाऱ्यांना दीर्घकालीन करारावर टिकवून ठेवले")}
              </p>
            </div>

            {/* KPI 3: Average Retention Duration */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-3 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="font-heading">{tl(language, "متوسط مدة الاستبقاء والاستمرارية", "Average Retention Duration", "सरासरी टिकून राहण्याचा कालावधी")}</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {incubatorInfo?.avg_retention_months || 18}+{" "}
                <span className="text-xs text-slate-400 font-normal font-sans">{tl(language, "شهراً متواصلاً", "Months retention", "महिने सातत्य")}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full" style={{ width: "88%" }} />
              </div>
              <p className="text-xs text-slate-400">
                {tl(language, "توجيهات لجنة الأهداف: استمرار التنسيق الأسبوعي مع مسؤولي الموارد البشرية", "Committee directive: Weekly follow-ups with corporate HR officers", "कमिटी निर्देश: एचआर अधिकाऱ्यांशी साप्ताहिक पाठपुरावा")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Only for venture tabs) */}
      {activeMainTab !== "theses" && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label_ar: "جميع القطاعات", label_en: "All Sectors", label_hi: "सभी क्षेत्र" },
              { id: "agtech", label_ar: "التقنية الزراعية وسلاسل الإمداد (AgTech)", label_en: "AgTech & Food Chain", label_hi: "कृषि प्रौद्योगिकी" },
              { id: "ai", label_ar: "الذكاء الاصطناعي والحوسبة السحابية", label_en: "AI & Cloud Tech", label_hi: "एआई और क्लाउड" },
              { id: "logistics", label_ar: "الخدمات اللوجستية والتجارة الإلكترونية", label_en: "Logistics & E-Commerce", label_hi: "लॉजिस्टिक्स" },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSectorFilter(pill.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  sectorFilter === pill.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tl(language, pill.label_ar, pill.label_en, pill.label_hi)}
              </button>
            ))}
          </div>

          {/* Search Input with Location support */}
          <div className="relative min-w-[280px]">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tl(language, "بحث بالشركة، المؤسس، الموقع الجغرافي...", "Search company, founder, location...", "कंपनी, संस्थापक किंवा पत्ता शोधा...")}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Ventures Directory */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : filteredVentures.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredVentures.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/95 overflow-hidden shadow-2xl hover:border-emerald-500/40 transition-all duration-300 space-y-5 p-7 backdrop-blur-2xl relative"
            >
              {/* Header: Company & Cohort */}
              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={v.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop"}
                    alt={v.company_name_ar}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-emerald-500/40 transition-all shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">{v.company_name_ar}</h3>
                    {v.company_name_en && (
                      <p className="text-xs text-slate-400 font-semibold">{v.company_name_en}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        {v.graduation_cohort}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        {v.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {v.funding_raised_sar.toLocaleString()} {tl(language, "ر.س", "SAR", "SAR")}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{tl(language, "تمويل مستقطب", "Funding Raised", "जुटाया गया फंड")}</div>
                </div>
              </div>

              {/* Founder Spotlight */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 font-bold text-xs border border-emerald-500/25">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{v.founder_name}</div>
                    <div className="text-[11px] text-slate-400">
                      {tl(language, "التخصص:", "Major:", "विशेषज्ञता:")} <span className="text-slate-300">{v.founder_major}</span> ({v.founder_graduation_year})
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-sm font-black text-white font-mono">
                    {v.jobs_created} <span className="text-xs text-emerald-400 font-normal">{tl(language, "وظائف", "jobs", "नौकरियाँ")}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{tl(language, "فرص عمل مستحدثة", "Created", "सृजित")}</div>
                </div>
              </div>

              {/* Business Activity & Products and Services */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>{tl(language, "النشاط التجاري والقطاع:", "Sector & Activity:", "क्षेत्र और गतिविधि:")}</span>
                  <span className="text-white font-semibold font-sans">{v.business_activity}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tl(language, "المنتجات والخدمات التي تقدمها الشركة:", "Products & Services Provided:", "प्रदान किए गए उत्पाद और सेवाएँ:")}</span>
                  </div>
                  <p className="text-xs text-slate-300/95 leading-relaxed">
                    {v.products_and_services}
                  </p>
                </div>
              </div>

              {/* University Criteria & Academic Material Updates Link */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                {v.university_criteria_connection && (
                  <div className="flex items-start gap-2 text-xs">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400">{tl(language, "الارتباط بمعايير الجامعة:", "University Criteria:", "विश्वविद्यालय मानदंड:")} </span>
                      <span className="text-slate-300 text-xs">{v.university_criteria_connection}</span>
                    </div>
                  </div>
                )}

                {v.academic_material_updates && (
                  <div className="flex items-start gap-2 text-xs">
                    <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sky-400">{tl(language, "تحديث المناهج والمقررات الأكاديمية:", "Academic Syllabus Update:", "शैक्षणिक पाठ्यक्रम अपडेट:")} </span>
                      <span className="text-slate-300 text-xs">{v.academic_material_updates}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Geographical Location & Google Maps 1-Click Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/25">
                <div className="flex items-center gap-2 text-xs text-sky-200">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-semibold">{v.company_location || "الأحساء - واحة الابتكار التقني"}</span>
                </div>
                <a
                  href={v.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((v.company_location || "الأحساء") + " " + v.company_name_ar)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition-all shadow-lg shadow-sky-500/25 transform hover:-translate-y-0.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{tl(language, "عرض الموقع على خرائط Google", "View on Google Maps", "Google Maps वर पहा")}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Partner Company Continuity & Committee Target Notes */}
              {v.committee_notes && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tl(language, "تقرير لجنة تحقيق الأهداف واستمرارية العقود:", "Goal Committee Retention Report:", "उद्दिष्ट पूर्तता समिती अहवाल:")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {v.committee_notes}
                  </p>
                </div>
              )}

              {/* Action Button: View Full Academic Connection & Case Study (Step 10) */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {tl(language, "الربط الأكاديمي المباشر بالجامعة", "University Academic Tie-in", "विश्वविद्यालय शैक्षणिक संबंध")}
                </span>
                <button
                  type="button"
                  onClick={() => setAcademicConnectionTarget(v)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tl(language, "الارتباط الأكاديمي ودراسة الحالة", "Academic Connection & Case Study", "शैक्षणिक संबंध और केस स्टडी")}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : activeMainTab !== "theses" ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center space-y-3">
          <Lightbulb className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">
            {tl(language, "لم يتم العثور على شركات تطابق البحث", "No ventures match search criteria", "खोज मानदंड से मेल खाने वाली कोई कंपनी नहीं मिली")}
          </h3>
        </div>
      ) : null}

      {/* DOCTOR'S PHD & MASTER'S THESES SHARING HUB */}
      {activeMainTab === "theses" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-[2rem] bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-slate-900 border border-purple-500/25 backdrop-blur-xl">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>{tl(language, "أطروحات الماجستير والدكتوراه والأبحاث المشتركة", "Doctor's Master's & PhD Theses Hub", "पीएचडी आणि मास्टर प्रबंध केंद्र")}</span>
              </h3>
              <p className="text-xs text-slate-300">
                {tl(
                  language,
                  "مستودع الأبحاث الأكاديمية للدكاترة المشرفين، وربطها المباشر بالشركات الشريكة المحتضنة ومشاريع التدريب التعاوني لطلبة البكالوريوس والدراسات العليا.",
                  "Academic repository for supervising doctors, directly linked to incubator partner companies and cooperative training projects.",
                  "पर्यवेक्षक डॉक्टरांचे शैक्षणिक प्रबंध, जे इनक्यूबेटरच्या कंपन्यांशी आणि विद्यार्थ्यांच्या इंटर्नशिपशी जोडलेले आहेत."
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateThesisOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>{tl(language, "مشاركة أطروحة جديدة", "Share New Thesis", "नवीन थीसिस जोडा")}</span>
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {theses.map((thesis) => (
              <motion.div
                key={thesis.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-7 space-y-4 shadow-2xl hover:border-purple-500/40 transition-all relative overflow-hidden backdrop-blur-2xl"
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono ${
                        thesis.degree === "phd" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      }`}>
                        {thesis.degree === "phd" ? tl(language, "أطروحة دكتوراه (PhD)", "PhD Dissertation", "पीएचडी प्रबंध") : tl(language, "رسالة ماجستير (Master's)", "Master's Thesis", "मास्टर प्रबंध")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">{thesis.year}</span>
                    </div>
                    <h4 className="text-base font-black text-white leading-snug">{thesis.title_ar}</h4>
                    {thesis.title_en && <p className="text-xs text-slate-400 font-semibold">{thesis.title_en}</p>}
                  </div>
                </div>

                {/* Doctor / Author */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center justify-center font-bold text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{thesis.doctor_name}</div>
                      <div className="text-[11px] text-slate-400">{thesis.field_of_study}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                    {tl(language, "معتمد أكاديمياً", "Verified Research", "प्रमाणित संशोधन")}
                  </span>
                </div>

                {/* Abstract */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-purple-300">{tl(language, "ملخص الأطروحة والأثر الصناعي:", "Abstract & Impact:", "संशोधन सारांश:")}</div>
                  <p className="text-xs text-slate-300/95 leading-relaxed">{thesis.abstract}</p>
                </div>

                {/* Linked Partner Company & Location with Google Maps */}
                {thesis.linked_company_name && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/25">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-sky-400 uppercase font-mono">
                        {tl(language, "الشركة الشريكة المستفيدة من البحث:", "Beneficiary Partner Company:", "संबंधित भागीदार कंपनी:")}
                      </div>
                      <div className="text-xs font-bold text-white">{thesis.linked_company_name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{thesis.company_location || "الأحساء - واحة التقنية"}</span>
                      </div>
                    </div>
                    <a
                      href={thesis.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((thesis.company_location || "الأحساء") + " " + thesis.linked_company_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition-all shadow-lg shadow-sky-500/25"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{tl(language, "خرائط Google", "Google Maps", "Google Maps")}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                )}

                {/* Cooperative Training Relevance */}
                <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400">{tl(language, "الربط بالتدريب التعاوني:", "Co-op Relevance:", "इंटर्नशिप संबंध:")} </span>
                    <span className="text-slate-300 text-xs">{thesis.coop_relevance}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE VENTURE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-bold text-white font-heading">
                  {tl(language, "تسجيل شركة ريادية في حاضنة الجامعة (منشآت)", "Register Startup in Monsha'at Incubator", "मनशाआत इनक्यूबेटर में स्टार्टअप पंजीकृत करें")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الشركة بالعربية *", "Company Name (Arabic) *", "कंपनी का नाम (अरबी) *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name_ar}
                    onChange={(e) => setFormData({ ...formData, company_name_ar: e.target.value })}
                    placeholder={tl(language, "مثال: شركة نخيل وهكتار للتقنية الزراعية", "Hectare AgTech", "हेक्टेयर एगटेक")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الشركة بالإنجليزية", "Company Name (English)", "कंपनी का नाम (अंग्रेजी)")}
                  </label>
                  <input
                    type="text"
                    value={formData.company_name_en}
                    onChange={(e) => setFormData({ ...formData, company_name_en: e.target.value })}
                    placeholder="Hectare AgTech Solutions"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم رائد الأعمال المؤسس *", "Founder Name *", "संस्थापक का नाम *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.founder_name}
                    onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                    placeholder={tl(language, "م. عبد العزيز بن سعد الحليبي", "Eng. Abdulaziz Al-Hulaibi", "इंजी. अब्दुलअज़ीज़ अल-हुलैबी")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "التخصص الأكاديمي", "Academic Major", "शैक्षणिक विशेषज्ञता")}
                  </label>
                  <input
                    type="text"
                    value={formData.founder_major}
                    onChange={(e) => setFormData({ ...formData, founder_major: e.target.value })}
                    placeholder={tl(language, "نظم المعلومات الإدارية", "Management Information Systems", "प्रबंधन सूचना प्रणाली")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "دفعة الحاضنة", "Incubator Cohort", "इनक्यूबेटर बैच")}
                  </label>
                  <input
                    type="text"
                    value={formData.graduation_cohort}
                    onChange={(e) => setFormData({ ...formData, graduation_cohort: e.target.value })}
                    placeholder={tl(language, "الدفعة الرابعة - حاضنة منشآت 2024", "Cohort 4 - Monsha'at 2024", "बैच 4 - मनशाआत 2024")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "النشاط التجاري والقطاع *", "Business Activity & Sector *", "व्यावसायिक गतिविधि और क्षेत्र *")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.business_activity}
                  onChange={(e) => setFormData({ ...formData, business_activity: e.target.value })}
                  placeholder={tl(language, "مثال: التقنية الزراعية المتقدمة وإنترنت الأشياء (AgTech)", "AgTech, Smart IoT, AI", "कृषि तकनीक, स्मार्ट आईओटी")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "المنتجات والخدمات التي تقدمها الشركة *", "Products & Services Provided *", "प्रदान किए गए उत्पाद और सेवाएँ *")}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.products_and_services}
                  onChange={(e) => setFormData({ ...formData, products_and_services: e.target.value })}
                  placeholder={tl(language, "اذكر تفاصيل المنتجات الرقمية، الأجهزة، والحلول التي تبيعها الشركة...", "Describe core products, hardware and services...", "उत्पादों, हार्डवेयर और सेवाओं का विवरण दें...")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الوظائف المستحدثة محلياً", "Jobs Created", "सृजित नौकरियाँ")}
                  </label>
                  <input
                    type="number"
                    value={formData.jobs_created}
                    onChange={(e) => setFormData({ ...formData, jobs_created: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "إجمالي التمويل المستقطب (ر.س)", "Funding Raised (SAR)", "जुटाया गया कुल फंड (SAR)")}
                  </label>
                  <input
                    type="number"
                    value={formData.funding_raised_sar}
                    onChange={(e) => setFormData({ ...formData, funding_raised_sar: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "الربط بمعايير الجامعة والاعتماد الأكاديمي", "University Criteria Connection", "विश्वविद्यालय मानदंड और मान्यता संबंध")}
                </label>
                <input
                  type="text"
                  value={formData.university_criteria_connection}
                  onChange={(e) => setFormData({ ...formData, university_criteria_connection: e.target.value })}
                  placeholder={tl(language, "معيار الاعتماد 7.4: مساهمة الابتكار في استدامة واحة الأحساء", "Accreditation criterion 7.4", "मान्यता मानदंड 7.4")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "تحديث المقررات والمناهج الأكاديمية بالجامعة", "Academic Syllabus Updates", "शैक्षणिक पाठ्यक्रम अपडेट")}
                </label>
                <input
                  type="text"
                  value={formData.academic_material_updates}
                  onChange={(e) => setFormData({ ...formData, academic_material_updates: e.target.value })}
                  placeholder={tl(language, "إدراج دراسة حالة عن الشركة في مقرر ريادة الأعمال ENT-302", "Case study in ENT-302", "उद्यमिता पाठ्यक्रम ईएनटी-302 में केस स्टडी")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  <span>{tl(language, "تسجيل الشركة بالحاضنة", "Register Startup", "स्टार्टअप पंजीकृत करें")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACADEMIC CONNECTION & CASE STUDY MODAL (Step 10) */}
      {academicConnectionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-[#0b162c] p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={academicConnectionTarget.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop"}
                  alt={academicConnectionTarget.company_name_ar}
                  className="w-12 h-12 rounded-2xl object-cover border border-primary/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white font-heading">
                      {academicConnectionTarget.company_name_ar}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/30">
                      {academicConnectionTarget.graduation_cohort}
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-semibold mt-0.5">
                    {tl(language, "المؤسس الخريج:", "Founder:", "संस्थापक:")} {academicConnectionTarget.founder_name} ({academicConnectionTarget.founder_major} - {academicConnectionTarget.founder_graduation_year})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAcademicConnectionTarget(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic Link Flow (Step 10) */}
            <div className="p-4 rounded-2xl bg-[#081628] border border-border space-y-2">
              <div className="text-xs font-bold text-secondary font-heading">
                {tl(language, "مسار الارتباط الأكاديمي وانتقال المعرفة من الحاضنة للمقررات:", "Academic Feedback & Knowledge Transfer Pipeline:", "अकादमिक फीडबैक और ज्ञान हस्तांतरण पाइपलाइन:")}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-card border border-border">
                  <div className="font-bold text-emerald-400">1. {tl(language, "نجاح تجاري", "Startup Success", "स्टार्टअप सफलता")}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "توليد إيرادات ووظائف", "Market Impact", "बाजार प्रभाव")}</div>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border">
                  <div className="font-bold text-secondary">2. {tl(language, "دراسة حالة", "Case Study", "केस स्टडी")}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "صياغة تجربة واقعية", "Documenting Model", "मॉडल दस्तावेज़ीकरण")}</div>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border">
                  <div className="font-bold text-primary">3. {tl(language, "مقرر جامعي", "University Course", "विश्वविद्यालय पाठ्यक्रम")}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{tl(language, "تدريسها للطلاب", "Lecture Curriculum", "व्याख्यान पाठ्यक्रम")}</div>
                </div>
                <div className="p-2 rounded-xl bg-primary/20 border border-primary/40">
                  <div className="font-bold text-white">4. {tl(language, "تحديث المناهج", "Academic Material", "पाठ्य सामग्री")}</div>
                  <div className="text-[9px] text-secondary mt-0.5">{tl(language, "اعتماد خطة المقرر", "Syllabus Standard", "पाठ्यक्रम मानक")}</div>
                </div>
              </div>
            </div>

            {/* Academic Connection Details (Step 10) */}
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    {tl(language, "الكلية التابعة:", "College / Faculty:", "संकाय:")}
                  </div>
                  <div className="text-xs font-bold text-white">كلية إدارة الأعمال / كلية علوم الحاسب</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    {tl(language, "القسم الأكاديمي:", "Department:", "विभाग:")}
                  </div>
                  <div className="text-xs font-bold text-white">{academicConnectionTarget.founder_major}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                <div className="text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-secondary" />
                  <span>{tl(language, "المقرر الجامعي المرتبط بدراسة الحالة:", "Connected University Course:", "संबंधित विश्वविद्यालय पाठ्यक्रम:")}</span>
                </div>
                <div className="text-xs font-bold text-white">
                  BUS-302: {tl(language, "ريادة الأعمال وإدارة المشاريع الناشئة وتطوير نماذج الأعمال", "Entrepreneurship & Startup Management (BUS-302)", "उद्यमिता और स्टार्टअप प्रबंधन (BUS-302)")}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tl(language, "دراسة الحالة التطبيقية المعتمدة:", "Official Academic Case Study:", "आधिकारिक शैक्षणिक केस स्टडी:")}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {tl(
                    language,
                    `دراسة حالة تطبيقية: رحلة نمو شركة "${academicConnectionTarget.company_name_ar}" في قطاع ${academicConnectionTarget.business_activity} من فكرة ريادية إلى كيان مستدام يحقق إيرادات ويستحدث ${academicConnectionTarget.jobs_created} وظائف محلية.`,
                    `Applied Case Study: The growth journey of "${academicConnectionTarget.company_name_ar}" in ${academicConnectionTarget.business_activity}, scaling into a venture creating ${academicConnectionTarget.jobs_created} jobs.`,
                    `एप्लाइड केस स्टडी: "${academicConnectionTarget.company_name_ar}" की व्यावसायिक वृद्धि यात्रा और ${academicConnectionTarget.jobs_created} नौकरियों का सृजन।`
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1.5">
                <div className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  {tl(language, "تحديث المناهج والمواد العلمية (Syllabus Update):", "Syllabus & Material Update:", "पाठ्यक्रम और सामग्री अद्यतन:")}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {academicConnectionTarget.academic_material_updates || (
                    tl(
                      language,
                      "تم إدراج دراسة الحالة ضمن مراجع الفصل الخامس لمقرر ريادة الأعمال، وتوزيعها على أكثر من 350 طالبًا بالفصل الدراسي الحالي كنموذج تدريبي معتمد.",
                      "The case study has been incorporated into chapter 5 of the entrepreneurship syllabus for over 350 students.",
                      "केस स्टडी को 350 से अधिक छात्रों के लिए उद्यमिता पाठ्यक्रम के अध्याय 5 में शामिल किया गया है।"
                    )
                  )}
                </p>
                {academicConnectionTarget.university_criteria_connection && (
                  <div className="pt-2 border-t border-primary/20 text-[11px] text-secondary font-semibold">
                    {tl(language, "مطابقة معايير الاعتماد المؤسسي:", "Accreditation Alignment:", "मान्यता संरेखण:")} {academicConnectionTarget.university_criteria_connection}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-border">
              <button
                type="button"
                onClick={() => setAcademicConnectionTarget(null)}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/25"
              >
                {tl(language, "إغلاق", "Close", "बंद करें")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE THESIS MODAL */}
      {isCreateThesisOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-secondary/40 bg-card p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {tl(language, "مشاركة أطروحة ماجستير أو دكتوراه مع قطاع الأعمال", "Share Master's / PhD Thesis with Industry", "उद्योग के साथ मास्टर/पीएचडी थीसिस साझा करें")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tl(language, "ربط أبحاث الدكتور المشرف بشركات الحاضنة ومتدربي التدريب التعاوني", "Linking academic research to incubator companies and interns", "शोध को इनक्यूबेटर कंपनियों और छात्रों से जोड़ना")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateThesisOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-background hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleThesisSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الدرجة العلمية للأطروحة", "Academic Degree", "शैक्षणिक डिग्री")} *
                  </label>
                  <select
                    value={thesisFormData.degree}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, degree: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-secondary"
                  >
                    <option value="phd">{tl(language, "أطروحة دكتوراه (PhD)", "PhD Dissertation", "पीएचडी प्रबंध")}</option>
                    <option value="masters">{tl(language, "رسالة ماجستير (Master's)", "Master's Thesis", "मास्टर प्रबंध")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "اسم الدكتور / الباحث المشرف", "Doctor / Supervisor Name", "पर्यवेक्षक डॉक्टरचे नाव")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={thesisFormData.doctor_name}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, doctor_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "عنوان الأطروحة أو البحث الأكاديمي (بالعربية)", "Thesis Title (Arabic)", "थीसिस शीर्षक (अरबी)")} *
                </label>
                <input
                  type="text"
                  required
                  value={thesisFormData.title_ar}
                  onChange={(e) => setThesisFormData({ ...thesisFormData, title_ar: e.target.value })}
                  placeholder={tl(language, "مثال: تطبيقات الذكاء الاصطناعي في إدارة سلاسل التبريد والتوزيع", "e.g. AI Applications in Cold Chain Logistics", "उदा. कोल्ड चेन लॉजिस्टिक्समधील एआई")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "عنوان الأطروحة (بالإنجليزية - اختياري)", "Thesis Title (English - Optional)", "थीसिस शीर्षक (इंग्रजी)")}
                </label>
                <input
                  type="text"
                  value={thesisFormData.title_en}
                  onChange={(e) => setThesisFormData({ ...thesisFormData, title_en: e.target.value })}
                  placeholder="AI Applications in Smart Supply Chain Management"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "مجال التخصص الأكاديمي", "Field of Study", "अध्ययन क्षेत्र")}
                  </label>
                  <input
                    type="text"
                    value={thesisFormData.field_of_study}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, field_of_study: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "سنة الاعتماد الأكاديمي", "Year", "वर्ष")}
                  </label>
                  <input
                    type="text"
                    value={thesisFormData.year}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "ملخص الأطروحة والأثر الاقتصادي", "Thesis Abstract & Industry Impact", "संशोधन सारांश आणि प्रभाव")} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={thesisFormData.abstract}
                  onChange={(e) => setThesisFormData({ ...thesisFormData, abstract: e.target.value })}
                  placeholder={tl(language, "اكتب ملخصاً موجزاً يوضح القيمة التطبيقية للبحث والحلول التي يقدمها لسوق العمل...", "Briefly describe practical solutions for industry...", "उद्योगासाठी व्यावहारिक उपायांचा सारांश...")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "الشركة الشريكة المرتبطة بالبحث", "Linked Partner Company", "संबंधित भागीदार कंपनी")}
                  </label>
                  <input
                    type="text"
                    value={thesisFormData.linked_company_name}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, linked_company_name: e.target.value })}
                    placeholder={tl(language, "اسم الشركة المستفيدة من نتائج البحث", "Partner Company Name", "कंपनीचे नाव")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {tl(language, "مقر البحث / موقع الشركة الجغرافي", "Location (for Google Maps)", "पत्ता (Google Maps साठी)")}
                  </label>
                  <input
                    type="text"
                    value={thesisFormData.company_location}
                    onChange={(e) => setThesisFormData({ ...thesisFormData, company_location: e.target.value })}
                    placeholder={tl(language, "مثال: الأحساء - الهفوف طريق الملك عبدالله", "e.g. Al-Ahsa - King Abdullah Road", "उदा. अल-अहसा, किंग अब्दुल्ला रोड")}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {tl(language, "الارتباط ببرامج التدريب التعاوني وتأهيل الطلاب", "Co-op Training Linkage", "इंटर्नशिप व विद्यार्थी प्रशिक्षण संबंध")}
                </label>
                <input
                  type="text"
                  value={thesisFormData.coop_relevance}
                  onChange={(e) => setThesisFormData({ ...thesisFormData, coop_relevance: e.target.value })}
                  placeholder={tl(language, "كيف يستفيد طلاب التدريب التعاوني من مخرجات هذه الأطروحة...", "How co-op students benefit from this thesis...", "इंटर्न विद्यार्थ्यांना या प्रबंधाचा कसा फायदा होईल...")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateThesisOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करा")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-secondary/25"
                >
                  <FileText className="w-4 h-4" />
                  <span>{tl(language, "نشر ومشاركة الأطروحة", "Publish & Share Thesis", "थीसिस प्रकाशित करा")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
