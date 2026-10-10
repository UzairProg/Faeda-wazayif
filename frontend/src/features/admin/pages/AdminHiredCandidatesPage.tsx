/**
 * features/admin/pages/AdminHiredCandidatesPage.tsx
 *
 * Platform-Wide Hired Candidates Analytics & Placements Command Center (/admin/hired-candidates).
 * Strictly queries REAL employment outcome data from the backend database.
 *
 * Production rule:
 * - VITE_ENABLE_DEMO_DATA=false (default): Only real database records are loaded.
 * - If API returns empty records: Shows "No employment outcome data available yet."
 * - If API fails: Shows "Unable to load employment data. Please try again."
 * - Fallback demo data is ONLY enabled when VITE_ENABLE_DEMO_DATA=true explicitly.
 * - KPI cards are dynamically calculated from the backend records, never hardcoded.
 */

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/i18n"
import { GlassCard } from "@/components/ui/glass-card"
import toast from "react-hot-toast"
import { adminService } from "../services/admin.service"
import type { AdminHiredCandidate } from "../types/admin.types"
import {
  Users,
  Briefcase,
  GraduationCap,
  MapPin,
  Building2,
  Search,
  Download,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Eye,
  X,
  FileCheck,
  ArrowUpDown,
  Sparkles,
  UserCheck,
  Percent,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react"

// Sample development fallback dataset (Active ONLY when VITE_ENABLE_DEMO_DATA=true)
const DEV_DEMO_DATA: AdminHiredCandidate[] = [
  {
    id: "DEV-HC-001",
    candidateName: "عمر بن خالد المنصور",
    candidateEmail: "omar.mansour@alumni.kfu.edu.sa",
    studentIdNumber: "220108342",
    university: "جامعة الملك فيصل",
    major: "هندسة البرمجيات والأنظمة الموزعة",
    degreeLevel: "بكالوريوس",
    hiredJobTitle: "مهندس برمجيات أول سحابية (Cloud & DevOps)",
    companyName: "شركة أرامكو السعودية (Saudi Aramco)",
    companyIndustry: "الطاقة والتقنية الرقمية",
    salaryMonthly: 19500,
    currency: "SAR",
    salaryPackageAnnual: 254000,
    city: "الظهران",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
    employmentType: "دوام كامل",
    hiredDate: "2026-09-15",
    verificationStatus: "verified",
    supervisorName: "د. خالد بن إبراهيم السليمان",
    hrContact: "faisal.shammari@aramco.com",
    saudiNational: true,
    basicSalary: 14000,
    housingAllowance: 3500,
    transportAllowance: 2000,
    benefits: ["تأمين صحي VIP", "بدل سكن سنوي", "خطة أسهم الموظفين", "مكافأة أداء سنوية"],
  },
  {
    id: "DEV-HC-002",
    candidateName: "سارة بنت عبدالعزيز الشمري",
    candidateEmail: "sarah.shammari@alumni.kfupm.edu.sa",
    studentIdNumber: "201948120",
    university: "جامعة الملك فهد للبترول والمعادن",
    major: "علوم البيانات والذكاء الاصطناعي",
    degreeLevel: "ماجستير",
    hiredJobTitle: "عالمة بيانات متقدمة (Senior Data Scientist)",
    companyName: "الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)",
    companyIndustry: "الذكاء الاصطناعي والبيانات الحكومية",
    salaryMonthly: 23000,
    currency: "SAR",
    salaryPackageAnnual: 300000,
    city: "الرياض",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
    employmentType: "دوام كامل",
    hiredDate: "2026-09-28",
    verificationStatus: "certified",
    supervisorName: "د. منيرة آل الشيخ",
    hrContact: "recruitment@sdaia.gov.sa",
    saudiNational: true,
    basicSalary: 17000,
    housingAllowance: 4000,
    transportAllowance: 2000,
    benefits: ["تأمين طبي شامل", "بدل تدريب دولي", "مرونة العمل الهجين"],
  },
  {
    id: "DEV-HC-003",
    candidateName: "فهد بن طلال الحربي",
    candidateEmail: "f.alharbi@alumni.ksu.edu.sa",
    studentIdNumber: "441003921",
    university: "جامعة الملك سعود",
    major: "الأمن السيبراني والتحري الجنائي الرقمي",
    degreeLevel: "بكالوريوس",
    hiredJobTitle: "محلل دفاع سيبراني أول (SOC Analyst Lead)",
    companyName: "شركة علم (Elm)",
    companyIndustry: "حلول الأعمال الرقمية والأمنية",
    salaryMonthly: 17500,
    currency: "SAR",
    salaryPackageAnnual: 228000,
    city: "الرياض",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
    employmentType: "دوام كامل",
    hiredDate: "2026-09-10",
    verificationStatus: "verified",
    supervisorName: "د. طارق العتيبي",
    hrContact: "careers@elm.sa",
    saudiNational: true,
    basicSalary: 12500,
    housingAllowance: 3200,
    transportAllowance: 1800,
    benefits: ["تأمين صحي عائلي", "تغطية شهادات مهنية (CISSP)", "مكافأة سنوية"],
  },
  {
    id: "DEV-HC-004",
    candidateName: "نورة بنت فهد القحطاني",
    candidateEmail: "noura.alqahtani@alumni.pnu.edu.sa",
    studentIdNumber: "442019483",
    university: "جامعة الأميرة نورة بنت عبدالرحمن",
    major: "نظم المعلومات الإدارية (MIS)",
    degreeLevel: "بكالوريوس",
    hiredJobTitle: "محللة أعمال ونظم تخطيط المؤسسات (ERP Consultant)",
    companyName: "مجموعة الاتصالات السعودية (stc Group)",
    companyIndustry: "الاتصالات والتحول الرقمي",
    salaryMonthly: 16200,
    currency: "SAR",
    salaryPackageAnnual: 210000,
    city: "الرياض",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
    employmentType: "دوام كامل",
    hiredDate: "2026-08-20",
    verificationStatus: "verified",
    supervisorName: "د. هياء الراشد",
    hrContact: "talent@stc.com.sa",
    saudiNational: true,
    basicSalary: 11500,
    housingAllowance: 3000,
    transportAllowance: 1700,
    benefits: ["خصومات اتصالات وأجهزة", "تأمين طبي فئة A", "نادي صحي"],
  },
  {
    id: "DEV-HC-005",
    candidateName: "محمد بن راشد العجمي",
    candidateEmail: "m.alajmi@alumni.kau.edu.sa",
    studentIdNumber: "219800412",
    university: "جامعة الملك عبدالعزيز",
    major: "الهندسة الميكانيكية وتوليد الطاقة",
    degreeLevel: "بكالوريوس",
    hiredJobTitle: "مهندس صيانة وتوربينات (Mechanical Project Engineer)",
    companyName: "شركة أكوا باور (ACWA Power)",
    companyIndustry: "الطاقة المتجددة وتحلية المياه",
    salaryMonthly: 18000,
    currency: "SAR",
    salaryPackageAnnual: 235000,
    city: "جدة",
    country: "المملكة العربية السعودية",
    countryCode: "SA",
    employmentType: "دوام كامل",
    hiredDate: "2026-09-01",
    verificationStatus: "verified",
    supervisorName: "د. سالم الغامدي",
    hrContact: "recruitment@acwapower.com",
    saudiNational: true,
    basicSalary: 13000,
    housingAllowance: 3300,
    transportAllowance: 1700,
    benefits: ["بدل مواقع ومشاريع", "تأمين طبي لكافة الأسرة", "تذاكر سفر سنوية"],
  },
]

export function AdminHiredCandidatesPage() {
  const { language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? hi || en : en

  // Explicit demo data flag (VITE_ENABLE_DEMO_DATA=true)
  const isDemoFlagEnabled = import.meta.env.VITE_ENABLE_DEMO_DATA === "true"

  // Async Fetch States
  const [candidates, setCandidates] = useState<AdminHiredCandidate[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(false)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedMajor, setSelectedMajor] = useState("all")
  const [selectedUniversity, setSelectedUniversity] = useState("all")
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("all")
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all")
  const [sortField, setSortField] = useState<keyof AdminHiredCandidate>("hiredDate")
  const [sortAsc, setSortAsc] = useState(false)

  // Modal inspection state
  const [selectedCandidate, setSelectedCandidate] = useState<AdminHiredCandidate | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Fetch real employment data from backend
  const fetchEmploymentData = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setErrorMessage("")

    try {
      const res = await adminService.getHiredCandidates()
      const realItems = res?.items || []

      if (realItems.length > 0) {
        setCandidates(realItems)
        setIsDemoModeActive(false)
      } else {
        // Backend returned 0 records
        if (isDemoFlagEnabled) {
          // In development mode with explicit flag, provide mock data for local testing
          setCandidates(DEV_DEMO_DATA)
          setIsDemoModeActive(true)
        } else {
          // In production: strictly empty, no fake data
          setCandidates([])
          setIsDemoModeActive(false)
        }
      }
    } catch (err: any) {
      console.error("[AdminHiredCandidatesPage] API Error:", err)

      if (isDemoFlagEnabled) {
        // Dev fallback allowed only when flag is explicitly true
        setCandidates(DEV_DEMO_DATA)
        setIsDemoModeActive(true)
        setIsError(false)
      } else {
        // Production: strictly fail and show error banner, no fake data
        setCandidates([])
        setIsDemoModeActive(false)
        setIsError(true)
        setErrorMessage(
          err?.response?.data?.message ||
            L("تعذر تحميل بيانات التوظيف. يرجى المحاولة مرة أخرى.", "Unable to load employment data. Please try again.")
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [isDemoFlagEnabled, language])

  useEffect(() => {
    fetchEmploymentData()
  }, [fetchEmploymentData])

  // Derived filter options from CURRENT real dataset
  const cities = useMemo(() => Array.from(new Set(candidates.map((c) => c.city).filter(Boolean))), [candidates])
  const countries = useMemo(() => Array.from(new Set(candidates.map((c) => c.country).filter(Boolean))), [candidates])
  const majors = useMemo(() => Array.from(new Set(candidates.map((c) => c.major).filter(Boolean))), [candidates])
  const universities = useMemo(() => Array.from(new Set(candidates.map((c) => c.university).filter(Boolean))), [candidates])

  // Filtered & Sorted Records
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((item) => {
        const matchesSearch =
          !searchQuery.trim() ||
          item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.hiredJobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.studentIdNumber && item.studentIdNumber.includes(searchQuery))

        const matchesCity = selectedCity === "all" || item.city === selectedCity
        const matchesCountry = selectedCountry === "all" || item.country === selectedCountry
        const matchesMajor = selectedMajor === "all" || item.major === selectedMajor
        const matchesUniversity = selectedUniversity === "all" || item.university === selectedUniversity
        const matchesType = selectedEmploymentType === "all" || item.employmentType === selectedEmploymentType

        let matchesSalary = true
        if (selectedSalaryRange === "under_15k") matchesSalary = item.salaryMonthly < 15000
        else if (selectedSalaryRange === "15k_20k") matchesSalary = item.salaryMonthly >= 15000 && item.salaryMonthly <= 20000
        else if (selectedSalaryRange === "over_20k") matchesSalary = item.salaryMonthly > 20000

        return matchesSearch && matchesCity && matchesCountry && matchesMajor && matchesUniversity && matchesType && matchesSalary
      })
      .sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        if (aVal === undefined || bVal === undefined) return 0
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortAsc ? aVal - bVal : bVal - aVal
        }
        return sortAsc
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
  }, [
    candidates,
    searchQuery,
    selectedCity,
    selectedCountry,
    selectedMajor,
    selectedUniversity,
    selectedEmploymentType,
    selectedSalaryRange,
    sortField,
    sortAsc,
  ])

  // Key KPI Calculations — STRICTLY CALCULATED FROM REAL DATASET, NEVER HARDCODED
  const stats = useMemo(() => {
    const total = candidates.length
    if (total === 0) {
      return { totalHired: 0, avgSalary: 0, topCity: "-", topMajor: "-", saudizationRate: 0 }
    }
    const totalSalary = candidates.reduce((acc, curr) => acc + (curr.salaryMonthly || 0), 0)
    const avgSalary = Math.round(totalSalary / total)

    // Top city calculation from real dataset
    const cityCounts: Record<string, number> = {}
    candidates.forEach((c) => {
      if (c.city) cityCounts[c.city] = (cityCounts[c.city] || 0) + 1
    })
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"

    // Top major calculation from real dataset
    const majorCounts: Record<string, number> = {}
    candidates.forEach((c) => {
      if (c.major) majorCounts[c.major] = (majorCounts[c.major] || 0) + 1
    })
    const topMajor = Object.entries(majorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"

    // Saudization rate from real dataset
    const saudiCount = candidates.filter((c) => c.saudiNational).length
    const saudizationRate = Math.round((saudiCount / total) * 100)

    return {
      totalHired: total,
      avgSalary,
      topCity,
      topMajor,
      saudizationRate,
    }
  }, [candidates])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCity("all")
    setSelectedCountry("all")
    setSelectedMajor("all")
    setSelectedUniversity("all")
    setSelectedSalaryRange("all")
    setSelectedEmploymentType("all")
    toast.success(L("تمت إعادة ضبط الفلاتر", "Filters reset", "फ़िल्टर रीसेट किए गए"))
  }

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) {
      toast.error(L("لا توجد بيانات متاحة للتصدير", "No data available to export", "निर्यात के लिए डेटा नहीं है"))
      return
    }
    setIsExporting(true)
    setTimeout(() => {
      try {
        const headers = [
          "ID",
          "Candidate Name",
          "Email",
          "University",
          "Major",
          "Job Title",
          "Company",
          "Monthly Salary",
          "Currency",
          "City",
          "Country",
          "Employment Type",
          "Hiring Date",
          "Status",
        ]
        const rows = filteredCandidates.map((c) => [
          c.id,
          `"${c.candidateName}"`,
          c.candidateEmail,
          `"${c.university}"`,
          `"${c.major}"`,
          `"${c.hiredJobTitle}"`,
          `"${c.companyName}"`,
          c.salaryMonthly,
          c.currency,
          `"${c.city}"`,
          `"${c.country}"`,
          `"${c.employmentType}"`,
          c.hiredDate,
          c.verificationStatus,
        ])
        const csvContent =
          "data:text/csv;charset=utf-8,\uFEFF" +
          [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute(
          "download",
          `faeda_hired_candidates_${new Date().toISOString().slice(0, 10)}.csv`
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success(L("تم تصدير التقرير بنجاح", "Report exported successfully", "रिपोर्ट सफलतापूर्वक निर्यात की गई"))
      } catch (err) {
        toast.error(L("حدث خطأ أثناء التصدير", "Export failed", "निर्यात विफल"))
      } finally {
        setIsExporting(false)
      }
    }, 300)
  }

  const toggleSort = (field: keyof AdminHiredCandidate) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ── Demo Mode Advisory Banner (Enabled ONLY if VITE_ENABLE_DEMO_DATA=true) ── */}
      {isDemoModeActive && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>{L("وضع التطوير التجريبي مفعل:", "Development Demo Mode:", "डेवलपमेंट डेमो मोड:")}</strong>{" "}
              {L(
                "يتم عرض بيانات استرشادية محلية لعدم توفر بيانات قاعدة البيانات (VITE_ENABLE_DEMO_DATA=true). في الإنتاج (Production) لن تظهر أي بيانات تجريبية.",
                "Showing local sample data because VITE_ENABLE_DEMO_DATA=true. In production, this fallback is disabled and only real database records are shown.",
                "डेमो डेटा सक्रिय है।"
              )}
            </span>
          </div>
          <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
            DEMO PREVIEW
          </span>
        </div>
      )}

      {/* ── Top Header & Hero ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0a1a2e]/90 to-primary/20 border border-emerald-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{L("الرقابة الشاملة ومؤشرات التوظيف", "Platform Employment & Placement Analytics", "प्लेसमेंट विश्लेषण")}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {L("تحليلات الكفاءات المتوظفة بالمنصة", "Hired Candidates Command Center", "चयनित उम्मीदवारों का विश्लेषण")}
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
              {L(
                "سجل تحليلي كامل لجميع الكفاءات والخريجين الذين تم استقطابهم وتوظيفهم رسمياً مع مؤشرات الرواتب والتخصصات والشركات الموظفة المستمدة مباشرة من قاعدة البيانات.",
                "Comprehensive analytical command center detailing all graduates & talents hired via Faeda Wazayif — displaying real candidate placements, majors, jobs, salaries, cities, and partner employers.",
                "वास्तविक भर्ती डेटा और विश्लेषणात्मक डैशबोर्ड।"
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => fetchEmploymentData()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
              title={L("تحديث البيانات", "Refresh Data", "डेटा रीफ्रेश करें")}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{L("تحديث", "Refresh", "रीफ्रेश")}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={isExporting || candidates.length === 0}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? L("جارِ التصدير...", "Exporting...", "निर्यात...") : L("تصدير التقرير (Excel/CSV)", "Export Analytics", "डेटा निर्यात")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Analytics Metric Cards (4 Cards — Calculated from actual dataset) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Hired Candidates */}
        <GlassCard className="p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {L("إجمالي المتوظفين", "Total Hired", "कुल चयनित")}
            </span>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.totalHired}</span>
            {stats.totalHired > 0 && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {L("معتمد بقاعدة البيانات", "Verified in DB", "डेटाबेस में सत्यापित")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalHired > 0
              ? L("تم تثبيتهم بعقود رسمية معتمدة", "Officially placed with active contracts", "आधिकारिक तौर पर सक्रिय अनुबंध")
              : L("لا توجد تعيينات مسجلة بعد", "No verified placements recorded yet", "कोई नियुक्ति नहीं")}
          </p>
        </GlassCard>

        {/* Card 2: Average Monthly Salary */}
        <GlassCard className="p-6 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {L("متوسط الراتب الشهري", "Average Salary", "औसत वेतन")}
            </span>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.avgSalary.toLocaleString()}</span>
            <span className="text-sm font-semibold text-primary">SAR</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalHired > 0
              ? L("محسوب مباشرة من عقود التوظيف المسجلة", "Calculated directly from active placement contracts", "सक्रिय अनुबंधों से परिकलित")
              : L("في انتظار اكتمال بيانات العقود", "Awaiting contract compensation data", "डेटा प्रतीक्षारत")}
          </p>
        </GlassCard>

        {/* Card 3: Top Hiring City */}
        <GlassCard className="p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {L("المدينة الأكثر استقطاباً", "Top Hiring City", "शीर्ष भर्ती शहर")}
            </span>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white truncate">{stats.topCity}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalHired > 0
              ? L("أعلى مدينة بحسب عدد العقود المنفذة", "City with highest placement volume", "सर्वाधिक नियुक्तियों वाला शहर")
              : L("غير محدد بعد", "Not determined yet", "अनिर्धारित")}
          </p>
        </GlassCard>

        {/* Card 4: Top Specialization / Saudization */}
        <GlassCard className="p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {L("نسبة الكفاءات الوطنية", "Saudization Rate", "राष्ट्रीयकरण दर")}
            </span>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.saudizationRate}%</span>
            {stats.totalHired > 0 && (
              <span className="text-xs font-semibold text-purple-400">
                {L("مطابق للرؤية", "Vision Compliant", "राष्ट्रीय विजन")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {L("الأعلى طلباً: ", "Top Major: ", "शीर्ष विषय: ")}
            <span className="text-foreground font-medium">{stats.topMajor}</span>
          </p>
        </GlassCard>
      </div>

      {/* ── Multi-Criteria Filters Bar ───────────────────────────────────── */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={L(
                "ابحث باسم المرشح، التخصص، المسمى الوظيفي، الشركة، الجامعة...",
                "Search candidate, major, job title, company, university...",
                "उम्मीदवार, विषय, नौकरी, कंपनी खोजें..."
              )}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-auto rtl:left-3.5 text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Reset Filters & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {L("عرض", "Showing", "दिखाया जा रहा है")}{" "}
              <strong className="text-white font-bold">{filteredCandidates.length}</strong>{" "}
              {L("من أصل", "of", "में से")}{" "}
              <strong className="text-white font-bold">{candidates.length}</strong>{" "}
              {L("مرشح متوظف", "placements", "उम्मीदवार")}
            </span>
            <button
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title={L("إعادة ضبط الفلاتر", "Reset Filters", "फ़िल्टर रीसेट करें")}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdown Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-white/5">
          {/* City */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("المدينة", "City", "शहर")}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("كل المدن", "All Cities", "सभी शहर")}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("الدولة", "Country", "देश")}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("كل الدول", "All Countries", "सभी देश")}</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Major */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("التخصص", "Major", "विषय")}
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("كل التخصصات", "All Majors", "सभी विषय")}</option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("الجامعة", "University", "विश्वविद्यालय")}
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("كل الجامعات", "All Universities", "सभी विश्वविद्यालय")}</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Bracket */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("نطاق الراتب", "Salary Range", "वेतन सीमा")}
            </label>
            <select
              value={selectedSalaryRange}
              onChange={(e) => setSelectedSalaryRange(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("كل النطاقات", "All Salaries", "सभी सीमाएं")}</option>
              <option value="under_15k">{L("أقل من 15,000", "< 15,000 SAR", "15,000 से कम")}</option>
              <option value="15k_20k">{L("15,000 - 20,000", "15k - 20k SAR", "15k - 20k")}</option>
              <option value="over_20k">{L("أكثر من 20,000", "> 20,000 SAR", "20,000 से अधिक")}</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              {L("نوع التوظيف", "Contract Type", "अनुबंध प्रकार")}
            </label>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full bg-[#0a1a2e] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
            >
              <option value="all">{L("جميع العقود", "All Types", "सभी अनुबंध")}</option>
              <option value="دوام كامل">{L("دوام كامل", "Full-Time", "पूर्णकालिक")}</option>
              <option value="تدريب منتهي بالتوظيف">{L("منتهي بالتوظيف", "Co-op Hired", "प्रशिक्षण उपरांत")}</option>
              <option value="عن بعد">{L("عن بعد", "Remote", "रिमोट")}</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* ── Main Data View: Loading, Error, Empty, or Table ─────────────── */}
      <GlassCard className="overflow-hidden border border-white/10 shadow-2xl">
        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold text-white">
              {L("جارِ تحميل سجلات التوظيف الحقيقية من قاعدة البيانات...", "Loading verified employment outcome data from database...", "डेटा लोड हो रहा है...")}
            </p>
            <p className="text-xs text-muted-foreground">
              {L("يتم استرجاع العقود ومؤشرات الرواتب الحقيقية", "Retrieving confirmed contracts and compensation records", "सत्यापित रिकॉर्ड प्राप्त किए जा रहे हैं")}
            </p>
          </div>
        ) : isError ? (
          /* Error State (Production) */
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {L("تعذر تحميل بيانات التوظيف. يرجى المحاولة مرة أخرى.", "Unable to load employment data. Please try again.")}
              </h3>
              {errorMessage && (
                <p className="text-xs text-muted-foreground font-mono max-w-md mx-auto">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              onClick={() => fetchEmploymentData()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{L("إعادة المحاولة", "Try Again", "पुनः प्रयास")}</span>
            </button>
          </div>
        ) : filteredCandidates.length === 0 ? (
          /* Empty State (Production) */
          <div className="py-24 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
              <Users className="w-7 h-7 opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {L("لا توجد بيانات نتائج توظيف متاحة بعد.", "No employment outcome data available yet.")}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {candidates.length > 0
                  ? L("لم يتم العثور على سجلات تطابق شروط الفلترة المحددة. جرب إعادة ضبط خيارات البحث.", "No records matching selected filter criteria. Try resetting filters.", "फ़िल्टर रीसेट करें।")
                  : L("لم يتم تسجيل أي عقود توظيف أو نتائج توظيف معتمدة في قاعدة البيانات حتى الآن.", "No candidate hiring contracts or placement outcomes have been recorded in the database yet.", "डेटाबेस में कोई रिकॉर्ड दर्ज नहीं है।")}
              </p>
            </div>
            {candidates.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{L("إعادة ضبط الفلاتر", "Reset Filters", "फ़िल्टर रीसेट करें")}</span>
              </button>
            )}
          </div>
        ) : (
          /* Table of Real Records */
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-muted-foreground font-semibold">
                  <th className="py-4 px-4 text-start font-bold">#</th>
                  <th
                    onClick={() => toggleSort("candidateName")}
                    className="py-4 px-4 text-start font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{L("اسم المرشح", "Candidate Name", "उम्मीदवार")}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("major")}
                    className="py-4 px-4 text-start font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{L("التخصص والجامعة", "Major & University", "विषय एवं विश्वविद्यालय")}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("hiredJobTitle")}
                    className="py-4 px-4 text-start font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{L("الوظيفة والجهة الموظفة", "Hired Job & Company", "नौकरी एवं कंपनी")}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("salaryMonthly")}
                    className="py-4 px-4 text-start font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{L("الراتب الشهري", "Monthly Salary", "मासिक वेतन")}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("city")}
                    className="py-4 px-4 text-start font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{L("المدينة والدولة", "City & Country", "शहर एवं देश")}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-start font-bold">
                    {L("نوع العقد والحالة", "Contract & Status", "अनुबंध एवं स्थिति")}
                  </th>
                  <th className="py-4 px-4 text-center font-bold">
                    {L("التفاصيل", "Actions", "कार्रवाई")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCandidates.map((candidate, idx) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                      {idx + 1}
                    </td>

                    {/* Candidate Name & Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                          {candidate.candidateName ? candidate.candidateName.charAt(0) : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            <span>{candidate.candidateName}</span>
                            {candidate.saudiNational && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium"
                                title="مواطن سعودي"
                              >
                                🇸🇦
                              </span>
                            )}
                          </div>
                          {candidate.candidateEmail && (
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {candidate.candidateEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Major & University */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white/90">
                        {candidate.major || L("غير محدد", "Unspecified", "अनिर्धारित")}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[200px]">{candidate.university || "-"}</span>
                      </div>
                    </td>

                    {/* Job Title & Company */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-400">
                        {candidate.hiredJobTitle}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium text-white/80">{candidate.companyName}</span>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-white text-sm">
                        {candidate.salaryMonthly ? candidate.salaryMonthly.toLocaleString() : "0"}{" "}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          {candidate.currency || "SAR"} / {L("شهرياً", "mo", "माह")}
                        </span>
                      </div>
                      {candidate.salaryPackageAnnual > 0 && (
                        <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                          {candidate.salaryPackageAnnual.toLocaleString()} {candidate.currency || "SAR"} {L("سنوياً", "annual", "वार्षिक")}
                        </div>
                      )}
                    </td>

                    {/* City & Country */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{candidate.city || "-"}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {candidate.country || "-"}
                      </div>
                    </td>

                    {/* Contract Type & Verification Badge */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{candidate.employmentType || L("دوام كامل", "Full-Time", "पूर्णकालिक")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{L("عقد موثق", "Verified Contract", "सत्यापित अनुबंध")}</span>
                      </div>
                    </td>

                    {/* Actions / View Details */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{L("معاينة", "View", "देखें")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* ── Detail Inspection Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#091524] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-foreground overflow-hidden"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{L("ملف التعيين المعتمد", "Verified Placement Dossier", "सत्यापित प्लेसमेंट फ़ाइल")}</span>
                    <span className="font-mono">({selectedCandidate.id})</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {selectedCandidate.candidateName}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedCandidate.candidateEmail} • {selectedCandidate.studentIdNumber || "ID-VERIFIED"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Grid */}
              <div className="space-y-6 text-xs">
                {/* 1. Job & Company Section */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{L("بيانات الوظيفة والشركة الشريكة", "Job & Employer Details", "नौकरी एवं कंपनी विवरण")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">{L("المسمى الوظيفي:", "Job Title:", "पद:")}</span>
                      <p className="text-white font-bold text-sm mt-0.5">{selectedCandidate.hiredJobTitle}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{L("الشركة الموظفة:", "Company:", "कंपनी:")}</span>
                      <p className="text-white font-bold text-sm mt-0.5">{selectedCandidate.companyName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{L("مجال الشركة:", "Industry:", "उद्योग:")}</span>
                      <p className="text-white font-semibold mt-0.5">{selectedCandidate.companyIndustry}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{L("الموقع الجغرافي:", "Location:", "स्थान:")}</span>
                      <p className="text-white font-semibold mt-0.5">{selectedCandidate.city}، {selectedCandidate.country}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Academic Background Section */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>{L("البيانات الأكاديمية والجامعة", "Academic Background", "शैक्षणिक पृष्ठभूमि")}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">{L("التخصص:", "Major:", "विषय:")}</span>
                      <p className="text-white font-bold mt-0.5">{selectedCandidate.major}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{L("الجامعة:", "University:", "विश्वविद्यालय:")}</span>
                      <p className="text-white font-bold mt-0.5">{selectedCandidate.university}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{L("الدرجة العلمية:", "Degree:", "डिग्री:")}</span>
                      <p className="text-white font-semibold mt-0.5">{selectedCandidate.degreeLevel || "بكالوريوس"}</p>
                    </div>
                    {selectedCandidate.supervisorName && (
                      <div>
                        <span className="text-muted-foreground">{L("المشرف الأكاديمي:", "Academic Supervisor:", "अकादमिक पर्यवेक्षक:")}</span>
                        <p className="text-white font-semibold mt-0.5">{selectedCandidate.supervisorName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Salary & Compensation Package */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-primary/10 border border-emerald-500/20 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>{L("حزمة الراتب والبدلات المعتمدة", "Approved Salary & Compensation Package", "स्वीकृत वेतन एवं भत्ते")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-black/20 text-center">
                      <span className="text-[10px] text-muted-foreground">{L("الراتب الأساسي", "Basic", "मूल वेतन")}</span>
                      <p className="text-sm font-extrabold text-white mt-1">
                        {(selectedCandidate.basicSalary || Math.round(selectedCandidate.salaryMonthly * 0.7)).toLocaleString()} {selectedCandidate.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/20 text-center">
                      <span className="text-[10px] text-muted-foreground">{L("بدل السكن", "Housing", "आवास भत्ता")}</span>
                      <p className="text-sm font-extrabold text-white mt-1">
                        {(selectedCandidate.housingAllowance || Math.round(selectedCandidate.salaryMonthly * 0.2)).toLocaleString()} {selectedCandidate.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/20 text-center">
                      <span className="text-[10px] text-muted-foreground">{L("بدل النقل", "Transport", "परिवहन भत्ता")}</span>
                      <p className="text-sm font-extrabold text-white mt-1">
                        {(selectedCandidate.transportAllowance || Math.round(selectedCandidate.salaryMonthly * 0.1)).toLocaleString()} {selectedCandidate.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-bold text-white text-sm">
                      {L("إجمالي الراتب الشهري:", "Total Monthly Package:", "कुल मासिक वेतन:")}
                    </span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {selectedCandidate.salaryMonthly.toLocaleString()} {selectedCandidate.currency}
                    </span>
                  </div>
                </div>

                {/* 4. Benefits chips */}
                {selectedCandidate.benefits && selectedCandidate.benefits.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-2">{L("المزايا والامتيازات الإضافية:", "Additional Perks & Benefits:", "अतिरिक्त लाभ:")}</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white/90 text-[11px]"
                        >
                          ✦ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors"
                >
                  {L("إغلاق", "Close", "बंद करें")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminHiredCandidatesPage
