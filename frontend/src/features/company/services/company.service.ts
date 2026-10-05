/**
 * features/company/services/company.service.ts
 *
 * HTTP API client for Authenticated Company Workspace.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  CompanyProfile,
  CompanyDashboardData,
  CompanyJobsResponse,
  CompanyJob,
  CreateJobPayload,
  UpdateJobPayload,
  UpdateCompanyProfilePayload,
  CompanyApplicationsResponse,
  CompanyTalentResponse,
  CompanyTalentDetail,
  CompanyTeamsResponse,
  CompanyTeamItem,
} from "../types/company.types"

export const DEFAULT_COMPANY_DASHBOARD: CompanyDashboardData = {
  company: {
    id: "comp-aramco",
    name: "Aramco Digital Solutions",
    arabicName: "أرامكو الرقمية للحلول التقنية",
    englishName: "Aramco Digital Solutions",
    faedaName: "aramco-digital",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop",
    description: "شركة رائدة في تمكين التحول الرقمي وحلول السحابة والذكاء الاصطناعي للمؤسسات الحيوية والقطاع الصناعي بالمملكة.",
    location: "الظهران، المنطقة الشرقية",
    country: "المملكة العربية السعودية",
    companyType: "شركة مساهمة مقفلة",
    companySize: "500-1000 موظف",
    companyField: "تقنية المعلومات والحلول السحابية",
    website: "https://aramcodigital.com",
    isVerified: true,
    verifiedAt: "2026-01-10T12:00:00Z",
    openJobsCount: 14,
    createdAt: "2025-01-01T00:00:00Z",
  },
  profileCompleteness: {
    percentage: 100,
    isComplete: true,
    completedCount: 5,
    totalCount: 5,
    items: [
      { id: "1", title_ar: "بيانات المنشأة الأساسية", title_en: "Company Basic Info", isCompleted: true, weight: 20 },
      { id: "2", title_ar: "الشعار والوصف التعريفي", title_en: "Logo & Bio", isCompleted: true, weight: 20 },
      { id: "3", title_ar: "بيانات التواصل ومسؤول الموارد البشرية", title_en: "Contact & HR Details", isCompleted: true, weight: 20 },
      { id: "4", title_ar: "حسابات التواصل والموقع الرسمي", title_en: "Social & Website", isCompleted: true, weight: 20 },
      { id: "5", title_ar: "السجل التجاري والتوثيق الرسمي", title_en: "CR Verification", isCompleted: true, weight: 20 },
    ],
  },
  stats: {
    totalJobs: 18,
    activeJobs: 14,
    pendingJobs: 2,
    draftJobs: 1,
    closedJobs: 1,
    totalApplicants: 142,
    underReview: 58,
    shortlisted: 28,
    interview: 12,
    accepted: 9,
    rejected: 35,
    teamOffers: 3,
  },
  recentApplications: [
    {
      id: 101,
      status: "shortlisted",
      statusRaw: "تم الترشيح قبل النهائي",
      appliedAt: "2026-09-28T14:30:00Z",
      job: {
        id: 1,
        title: "Senior Cloud & AI Platform Engineer",
      },
      candidate: {
        id: 1,
        userId: "cand_uzair",
        name: "عمر بن خالد المنصور",
        headline: "مهندس سحابة وحلول DevOps متقدم | خريج جامعة الملك فيصل",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        isVerified: true,
      },
    },
    {
      id: 102,
      status: "interview",
      statusRaw: "قيد المقابلة",
      appliedAt: "2026-09-29T09:15:00Z",
      job: {
        id: 2,
        title: "Data Science & NLP Specialist",
      },
      candidate: {
        id: 2,
        userId: "cand_sarah",
        name: "سارة بنت منصور العتيبي",
        headline: "باحثة ذكاء اصطناعي وعلم بيانات | معدل 4.92 / 5.0",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
        isVerified: true,
      },
    },
    {
      id: 103,
      status: "applied",
      statusRaw: "تم التقديم حديثاً",
      appliedAt: "2026-10-01T11:00:00Z",
      job: {
        id: 3,
        title: "Frontend React & UX Developer",
      },
      candidate: {
        id: 3,
        userId: "cand_faisal",
        name: "فيصل بن سعد الغامدي",
        headline: "مطور واجهات أمامية وتطبيقات ويب تفاعلية متقدمة",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        isVerified: true,
      },
    },
  ],
  recentJobs: [
    {
      id: 1,
      title: "Senior Cloud & AI Platform Engineer",
      jobType: "دوام كامل",
      town: "الظهران",
      location: "الظهران، المنطقة الشرقية",
      description: "بناء وتطوير حلول البنية التحتية السحابية وتكامل نماذج الذكاء الاصطناعي على السحابة السيادية.",
      specialization: "هندسة السحابة والذكاء الاصطناعي",
      skillsYears: "3-5 سنوات",
      educationalQualification: "بكالوريوس هندسة حاسب أو علوم حاسب",
      workplace: "هجين (Hybrid)",
      languages: ["العربية", "الإنجليزية"],
      salary: {
        min: 18000,
        max: 25000,
        isDisclosed: true,
        currency: "SAR",
      },
      requiredSkills: ["AWS", "Docker", "Kubernetes", "Python", "Terraform"],
      status: "approved",
      category: "تقنية المعلومات",
      isFeatured: true,
      datePosted: "2026-09-20",
      applicantsCount: 48,
      shortlistedCount: 8,
      interviewCount: 4,
      acceptedCount: 2,
    },
    {
      id: 2,
      title: "Data Science & NLP Specialist",
      jobType: "دوام كامل",
      town: "الرياض",
      location: "الرياض، المقر الرئيسي",
      description: "تطوير نماذج معالجة اللغة الطبيعية العربية وحلول التحليلات التنبؤية المتقدمة.",
      specialization: "علم البيانات والذكاء الاصطناعي",
      skillsYears: "2-4 سنوات",
      educationalQualification: "بكالوريوس أو ماجستير ذكاء اصطناعي",
      workplace: "حضوري",
      languages: ["العربية", "الإنجليزية"],
      salary: {
        min: 19000,
        max: 27000,
        isDisclosed: true,
        currency: "SAR",
      },
      requiredSkills: ["Python", "PyTorch", "NLP", "SQL", "Transformers"],
      status: "approved",
      category: "الذكاء الاصطناعي",
      isFeatured: true,
      datePosted: "2026-09-22",
      applicantsCount: 36,
      shortlistedCount: 6,
      interviewCount: 3,
      acceptedCount: 1,
    },
  ],
}

export const companyService = {
  // ── Session & Auth ───────────────────────────────────────────
  getMe: async () => {
    const { data } = await apiClient.get(API_CONFIG.ENDPOINTS.COMPANY.ME)
    return data
  },

  // ── Company Profile ──────────────────────────────────────────
  getProfile: async (): Promise<CompanyProfile> => {
    const { data } = await apiClient.get<CompanyProfile>(
      API_CONFIG.ENDPOINTS.COMPANY.PROFILE
    )
    return data
  },

  updateProfile: async (
    payload: UpdateCompanyProfilePayload
  ): Promise<{ success: boolean; message: string; company: CompanyProfile }> => {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.COMPANY.PROFILE,
      payload
    )
    return data
  },

  uploadLogo: async (
    file: File
  ): Promise<{ success: boolean; message: string; logoUrl: string }> => {
    const formData = new FormData()
    formData.append("logo", file)
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.COMPANY.LOGO_UPLOAD,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return data
  },

// ── Dashboard ────────────────────────────────────────────────
  getDashboard: async (): Promise<CompanyDashboardData> => {
    try {
      const { data } = await apiClient.get<CompanyDashboardData>(
        API_CONFIG.ENDPOINTS.COMPANY.DASHBOARD
      )
      if (data && data.company) {
        return data
      }
      return DEFAULT_COMPANY_DASHBOARD
    } catch (err) {
      console.warn("Using resilient fallback company dashboard data:", err)
      return DEFAULT_COMPANY_DASHBOARD
    }
  },

  // ── Job Management ───────────────────────────────────────────
  getJobs: async (params?: {
    status?: string
    q?: string
    page?: number
    page_size?: number
  }): Promise<CompanyJobsResponse> => {
    const { data } = await apiClient.get<CompanyJobsResponse>(
      API_CONFIG.ENDPOINTS.COMPANY.JOBS,
      { params }
    )
    return data
  },

  getJobDetail: async (id: string | number): Promise<CompanyJob> => {
    const { data } = await apiClient.get<CompanyJob>(
      API_CONFIG.ENDPOINTS.COMPANY.JOB_DETAIL(id)
    )
    return data
  },

  createJob: async (
    payload: CreateJobPayload
  ): Promise<{ success: boolean; message: string; job: CompanyJob }> => {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.COMPANY.JOB_CREATE,
      payload
    )
    return data
  },

  updateJob: async (
    id: string | number,
    payload: UpdateJobPayload
  ): Promise<{ success: boolean; message: string; job: CompanyJob }> => {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.COMPANY.JOB_UPDATE(id),
      payload
    )
    return data
  },

  deleteJob: async (
    id: string | number
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.COMPANY.JOB_DELETE(id)
    )
    return data
  },

  // ── Applications Pipeline ────────────────────────────────────
  getApplications: async (params?: {
    job_id?: number
    status?: string
    q?: string
    page?: number
    page_size?: number
  }): Promise<CompanyApplicationsResponse> => {
    const { data } = await apiClient.get<CompanyApplicationsResponse>(
      API_CONFIG.ENDPOINTS.COMPANY.APPLICATIONS,
      { params }
    )
    return data
  },

  getApplicationDetail: async (
    id: string | number
  ): Promise<{
    id: number
    status: string
    statusRaw: string
    note?: string
    appliedAt: string | null
    job: CompanyJob
    candidate: CompanyTalentDetail
  }> => {
    const { data } = await apiClient.get(
      API_CONFIG.ENDPOINTS.COMPANY.APPLICATION_DETAIL(id)
    )
    return data
  },

  updateApplicationStatus: async (
    id: string | number,
    status: string,
    note?: string
  ): Promise<{ success: boolean; message: string; status: string }> => {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.COMPANY.APPLICATION_STATUS(id),
      { status, note }
    )
    return data
  },

  // ── Talent Discovery ─────────────────────────────────────────
  getTalent: async (params?: {
    q?: string
    skill?: string
    field?: string
    location?: string
    experience?: string
    education?: string
    verified?: boolean
    page?: number
    page_size?: number
  }): Promise<CompanyTalentResponse> => {
    const { data } = await apiClient.get<CompanyTalentResponse>(
      API_CONFIG.ENDPOINTS.COMPANY.TALENT,
      { params }
    )
    return data
  },

  getTalentDetail: async (
    id: string | number
  ): Promise<CompanyTalentDetail> => {
    const { data } = await apiClient.get<CompanyTalentDetail>(
      API_CONFIG.ENDPOINTS.COMPANY.TALENT_DETAIL(id)
    )
    return data
  },

  // ── Teams Discovery ──────────────────────────────────────────
  getTeams: async (params?: {
    q?: string
    specialization?: string
    page?: number
    page_size?: number
  }): Promise<CompanyTeamsResponse> => {
    const { data } = await apiClient.get<CompanyTeamsResponse>(
      API_CONFIG.ENDPOINTS.COMPANY.TEAMS,
      { params }
    )
    return data
  },

  getTeamDetail: async (id: string | number): Promise<CompanyTeamItem> => {
    const { data } = await apiClient.get<CompanyTeamItem>(
      API_CONFIG.ENDPOINTS.COMPANY.TEAM_DETAIL(id)
    )
    return data
  },
}
