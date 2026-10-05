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
} from "lucide-react"


const DEFAULT_INCUBATOR_INFO: IncubatorInfo = {
  incubator_name: "حاضنة منشآت - جامعة الملك فيصل بالأحساء",
  university_name: "جامعة الملك فيصل",
  active_cohort: "الدفعة الخامسة 2025",
  location: "الأحساء",
  total_graduated_entrepreneurs: 42,
  active_startups_count: 3,
  total_jobs_created: 34,
  total_funding_raised_sar: 4200000,
  criteria_compliance_score: "96.4%",
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
    academic_material_updates: "تم إدراج دراسة حالة حية عن الشركة في مقرر 'ريادة الأعمال التكنولوجية (ENT-302)' لطلاب كليتي الحاسب والزراعة."
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
    academic_material_updates: "تغذية مقرر 'التجارة الإلكترونية والتسويق الرقمي (MKT-410)' بنموذج عمل المنصة وآليات التسعير الديناميكي."
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
    academic_material_updates: "استضافة مؤسس الشركة سنوياً كمتحدث صناعي زائر في مقرر 'مشاريع التخرج والذكاء الاصطناعي'."
  }
]

export function UniversityIncubatorPage() {
  const { isRTL, language } = useTranslation()
  const [ventures, setVentures] = useState<UniversityIncubatorVenture[]>([])
  const [incubatorInfo, setIncubatorInfo] = useState<IncubatorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")

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
      }
      setVentures([newVenture, ...ventures])
      setIsCreateOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const localizedVentures = getLocalizedVentures(ventures, language)

  const filteredVentures = localizedVentures.filter((v) => {
    const matchesSearch =
      searchQuery === "" ||
      v.company_name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.company_name_en && v.company_name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.founder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.business_activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.products_and_services.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSector =
      sectorFilter === "all" ||
      (sectorFilter === "agtech" && (v.business_activity.includes("زراعي") || v.business_activity.toLowerCase().includes("agtech") || v.business_activity.toLowerCase().includes("agriculture") || v.business_activity.includes("कृषि"))) ||
      (sectorFilter === "logistics" && (v.business_activity.includes("لوجستي") || v.business_activity.includes("إمداد") || v.business_activity.toLowerCase().includes("logistics") || v.business_activity.toLowerCase().includes("supply") || v.business_activity.includes("लॉजिस्टिक्स"))) ||
      (sectorFilter === "ai" && (v.business_activity.includes("ذكاء") || v.business_activity.includes("إنترنت") || v.business_activity.toLowerCase().includes("ai") || v.business_activity.toLowerCase().includes("iot") || v.business_activity.includes("एआई")))

    return matchesSearch && matchesSector
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Header with Monsha'at & University Co-branding */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        {/* Signature Faeda Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-secondary border border-primary/30">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{tl(language, "حاضنة منشآت لريادة الأعمال الجامعية", "Monsha'at University Incubator", "मनशाआत विश्वविद्यालय इनक्यूबेटर")}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-card/80 text-emerald-400 border border-border flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{tl(language, "جامعة الملك فيصل - محافظة الأحساء", "King Faisal University - Al-Ahsa", "किंग फैसल विश्वविद्यालय - अल-अहसा")}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight font-heading">
              {tl(language, "منظومة رواد الأعمال والشركات الناشئة المتخرجة من الحاضنة", "Graduated Entrepreneurs & Incubator Ventures Directory", "इनक्यूबेटर से स्नातक उद्यमी और स्टार्टअप निर्देशिका")}
            </h1>

            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {tl(
                language,
                "رصد وتوثيق إنجازات رواد الأعمال المتخرجين من حاضنة منشآت بجامعة الملك فيصل بالأحساء، واستعراض أنشطة شركاتهم ومنتجاتهم وخدماتهم، وربطها بمعايير الاعتماد المؤسسي وتحديث المواد والمناهج الأكاديمية.",
                "Tracking graduated entrepreneurs from Monsha'at Incubator at King Faisal University (Al-Ahsa), showcasing products and services, and embedding venture outcomes into university criteria and academic materials.",
                "किंग फैसल विश्वविद्यालय (अल-अहसा) में मनशाआत इनक्यूबेटर से स्नातक उद्यमियों की उपलब्धियों को ट्रैक करना, उनके उत्पादों और सेवाओं को प्रदर्शित करना और उन्हें विश्वविद्यालय के मानदंडों और पाठ्यक्रम से जोड़ना।"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>{tl(language, "تسجيل شركة ريادية في الحاضنة", "Register Incubator Venture", "स्टार्टअप पंजीकृत करें")}</span>
          </button>
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
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>{tl(language, "رواد الأعمال المتخرجون", "Graduated Founders", "स्नातक उद्यमी")}</span>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {incubatorInfo?.total_graduated_entrepreneurs || 42}+
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {tl(language, "رائد ورائدة أعمال من خريجي الجامعة", "Graduated university founders", "विश्वविद्यालय के स्नातक उद्यमी")}
          </p>
        </div>

        {/* 2. Active Ventures */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>{tl(language, "الشركات الناشطة بالسوق", "Active Companies", "सक्रिय कंपनियाँ")}</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {incubatorInfo?.active_startups_count || ventures.length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {tl(language, "كيانات تجارية مسجلة وفعالة", "Registered active startups", "पंजीकृत सक्रिय स्टार्टअप")}
          </p>
        </div>

        {/* 3. Jobs Created */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>{tl(language, "الوظائف المستحدثة", "Jobs Created", "सृजित नौकरियाँ")}</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {incubatorInfo?.total_jobs_created || 165}+
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {tl(language, "وظيفة مستحدثة في السوق المحلي", "New jobs in local economy", "स्थानीय अर्थव्यवस्था में नई नौकरियाँ")}
          </p>
        </div>

        {/* 4. Funding Raised */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>{tl(language, "التمويل والاستثمارات", "Funding Raised", "जुटाया गया फंड")}</span>
            <DollarSign className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2 text-xl font-black text-white">
            {(incubatorInfo?.total_funding_raised_sar || 4200000).toLocaleString()}{" "}
            <span className="text-xs font-normal">{tl(language, "ر.س", "SAR", "SAR")}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {tl(language, "استثمارات تم استقطابها للشركات", "Total venture capital raised", "कंपनियों के लिए जुटाया गया कुल निवेश")}
          </p>
        </div>

        {/* 5. University Criteria Match */}
        <div className="p-4 rounded-2xl border border-border bg-card/85 space-y-1 relative overflow-hidden backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>{tl(language, "معيار الاعتماد المؤسسي", "Criteria Compliance", "मान्यता अनुपालन")}</span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-xl font-black text-white">
            96.4%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {tl(language, "مطابق لمعايير هيئة تقويم التعليم ومنشآت", "Accreditation alignment", "मान्यता और मनशाआत मानकों के अनुरूप")}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label_ar: "جميع الشركات الناشئة", label_en: "All Ventures", label_hi: "सभी उद्यम" },
            { id: "agtech", label_ar: "التقنية الزراعية وسلاسل الإمداد (AgTech)", label_en: "AgTech & Food Chain", label_hi: "कृषि प्रौद्योगिकी और आपूर्ति श्रृंखला" },
            { id: "ai", label_ar: "الذكاء الاصطناعي والإنترنت الذكي", label_en: "AI & Smart IoT", label_hi: "एआई और स्मार्ट आईओटी" },
            { id: "logistics", label_ar: "الخدمات اللوجستية والتجارة الإلكترونية", label_en: "Logistics & E-Commerce", label_hi: "लॉजिस्टिक्स और ई-कॉमर्स" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSectorFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sectorFilter === pill.id
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-card/80 border border-border text-muted-foreground hover:text-white hover:border-primary/40"
              }`}
            >
              {tl(language, pill.label_ar, pill.label_en, pill.label_hi)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tl(language, "بحث باسم الشركة، المؤسس، المنتجات...", "Search company, founder, products...", "कंपनी, संस्थापक, उत्पाद खोजें...")}
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-card/80 border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Ventures Directory */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredVentures.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredVentures.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-card/85 overflow-hidden shadow-xl hover:border-primary/50 transition-all space-y-4 p-6 relative"
            >
              {/* Header: Company & Cohort */}
              <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={v.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop"}
                    alt={v.company_name_ar}
                    className="w-12 h-12 rounded-2xl object-cover border border-primary/30"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">{v.company_name_ar}</h3>
                    {v.company_name_en && (
                      <p className="text-xs text-muted-foreground font-semibold">{v.company_name_en}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/15 text-secondary border border-primary/25">
                        {v.graduation_cohort}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {v.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <div className="text-xs font-bold text-slate-200">
                    {v.funding_raised_sar.toLocaleString()} {tl(language, "ر.س", "SAR", "SAR")}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{tl(language, "تمويل مستقطب", "Funding Raised", "जुटाया गया फंड")}</div>
                </div>
              </div>

              {/* Founder Spotlight */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-background/60 border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-secondary font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{v.founder_name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {tl(language, "التخصص:", "Major:", "विशेषज्ञता:")} {v.founder_major} ({v.founder_graduation_year})
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-xs font-bold text-emerald-400">
                    {v.jobs_created} {tl(language, "وظائف", "jobs", "नौकरियाँ")}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{tl(language, "فرص عمل مستحدثة", "Created", "सृजित")}</div>
                </div>
              </div>

              {/* Business Activity & Products and Services */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                  {tl(language, "النشاط التجاري والقطاع:", "Sector & Activity:", "क्षेत्र और गतिविधि:")}{" "}
                  <span className="text-white font-normal">{v.business_activity}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-background/40 border border-border/80 space-y-1">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-secondary" />
                    <span>{tl(language, "المنتجات والخدمات التي تقدمها الشركة:", "Products & Services Provided:", "प्रदान किए गए उत्पाद और सेवाएँ:")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {v.products_and_services}
                  </p>
                </div>
              </div>

              {/* University Criteria & Academic Material Updates Link */}
              <div className="pt-2 border-t border-border space-y-2">
                {v.university_criteria_connection && (
                  <div className="flex items-start gap-2 text-xs">
                    <Award className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-secondary">{tl(language, "الارتباط بمعايير الجامعة:", "University Criteria:", "विश्वविद्यालय मानदंड:")} </span>
                      <span className="text-slate-300 text-[11px]">{v.university_criteria_connection}</span>
                    </div>
                  </div>
                )}

                {v.academic_material_updates && (
                  <div className="flex items-start gap-2 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400">{tl(language, "تحديث المناهج والمقررات الأكاديمية:", "Academic Syllabus Update:", "शैक्षणिक पाठ्यक्रम अपडेट:")} </span>
                      <span className="text-slate-300 text-[11px]">{v.academic_material_updates}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button: View Full Academic Connection & Case Study (Step 10) */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {tl(language, "الربط الأكاديمي المباشر بالجامعة", "University Academic Tie-in", "विश्वविद्यालय शैक्षणिक संबंध")}
                </span>
                <button
                  type="button"
                  onClick={() => setAcademicConnectionTarget(v)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary text-secondary hover:text-white border border-primary/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{tl(language, "الارتباط الأكاديمي ودراسة الحالة", "Academic Connection & Case Study", "शैक्षणिक संबंध और केस स्टडी")}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-3">
          <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-bold text-white">
            {tl(language, "لم يتم العثور على شركات تطابق البحث", "No ventures match search criteria", "खोज मानदंड से मेल खाने वाली कोई कंपनी नहीं मिली")}
          </h3>
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
    </div>
  )
}
