/**
* candidate.service.ts — HTTP client service for Candidate Workspace.
*/
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  CandidateProfile,
  CandidateDashboardData,
  RecommendedJobItem,
  CandidateJobDetail,
  CandidateJobsFilterParams,
  CandidateJobsResponse,
  CandidateApplicationDetail,
  CandidateApplicationsResponse,
  UpdateIdentityDTO,
  UpdateAboutDTO,
  UpdateSkillsDTO,
  UpdateExperienceDTO,
  UpdateEducationDTO,
  SaveProjectDTO,
  SaveCertificationDTO,
  UpdatePreferencesDTO,
  UpdateVisibilityDTO,
  CandidateTeamsListResponse,
  CandidateTeamDetail,
  CreateTeamPayload,
  UpdateTeamPayload,
  InviteMemberPayload,
  CandidateSearchResponse,
  ReceivedInvitationItem,
  CandidateSettingsData,
} from "../types/candidate.types"

export const DEFAULT_CANDIDATE_SETTINGS: CandidateSettingsData = {
  notifications: {
    emailJobAlerts: true,
    applicationUpdates: true,
    campaignInvitations: true,
    smsAlerts: false,
    marketingInsights: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
  },
  privacy: {
    visibility: "employers_only",
    allowRecruiterDirectMessages: true,
    shareAnonymousSalaryInsights: true,
    hideFromCurrentEmployer: false,
  },
  preferences: {
    language: "ar",
    currency: "SAR",
  },
}

export const DEFAULT_CANDIDATE_DASHBOARD: CandidateDashboardData = {
  candidate: {
    id: 1,
    user_id: "cand_uzair",
    name: "عمر بن خالد المنصور",
    headline: "مهندس سحابة وحلول DevOps متقدم | خريج جامعة الملك فيصل",
    about: "مهندس برمجيات متخصص في بناء وتطوير الأنظمة السحابية الموزعة وحلول DevOps والذكاء الاصطناعي التوليدي.",
    email: "omar.almansoor@faeda.sa",
    mobile: "+966 50 123 4567",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    location: "الأحساء / الرياض",
    country: "المملكة العربية السعودية",
    government: "المنطقة الشرقية",
    verification: {
      is_verified: true,
      verified_at: "2026-01-15T10:00:00Z",
    },
    visibility: "public",
    specialization: "هندسة البرمجيات السحابية",
    experience: "3-5 سنوات",
  },
  profile_health: {
    percentage: 88,
    checklist: [
      { key: "avatar", label: "الصورة الشخصية", completed: true, weight: 10 },
      { key: "cv", label: "السيرة الذاتية (ATS)", completed: true, weight: 20 },
      { key: "skills", label: "المهارات المتخصصة", completed: true, weight: 20 },
      { key: "experience", label: "الخبرات المهنية", completed: true, weight: 20 },
      { key: "education", label: "المؤهل الأكاديمي", completed: true, weight: 15 },
      { key: "projects", label: "المشاريع العملية", completed: true, weight: 15 },
    ],
    ats_score: 92,
    skills_count: 14,
    projects_count: 4,
    certifications_count: 3,
    cv_uploaded: true,
    education_status: "بكالوريوس هندسة برمجيات - جامعة الملك فيصل",
  },
  market_value: {
    available: true,
    value: 18500,
    currency: "SAR",
    period: "monthly",
    score: 88,
    percentile_label: "أعلى 12% في السوق السعودي",
    experience_tier: "3-5 سنوات (Mid-level)",
    specialization: "Cloud Architecture & Fullstack",
    range: {
      min_salary: 15000,
      avg_salary: 18500,
      max_salary: 24000,
    },
    qs_rank_string: "#18 عربياً",
    factors: [
      { key: "specialization", label_ar: "مجال عالي النمو (رؤية 2030)", label_en: "High-Growth Field (Vision 2030)", status: "available", value: "هندسة السحابة وحلول DevOps" },
      { key: "skills", label_ar: "مهارات الذكاء الاصطناعي والحوسبة", label_en: "Cloud & AI Stack", status: "available", value: "AWS, Kubernetes, React, Python" },
      { key: "experience", label_ar: "سنوات الخبرة التنفيذية", label_en: "Experience Level", status: "available", value: "3-5 سنوات" },
    ],
    missing_factors: [],
  },
  next_actions: [
    {
      id: "act-1",
      title_ar: "استكشف مؤشرات رواتب السوق 2026",
      title_en: "Explore 2026 Market Salary Trends",
      desc_ar: "اطلع على متوسط الرواتب والمهارات الصاعدة بتخصصك بناءً على معايير سوق العمل السعودي.",
      desc_en: "Review benchmark salaries and in-demand skills in your specialization.",
      action_label_ar: "عرض المؤشرات",
      action_label_en: "View Trends",
      action_url: "/market-trends",
      priority: "high",
      type: "jobs",
    },
    {
      id: "act-2",
      title_ar: "تعزيز شهادات البنية السحابية",
      title_en: "Add Cloud Certification",
      desc_ar: "إضافة شهادة AWS Solutions Architect ترفع القيمة التنافسية لملفك بنسبة 16%.",
      desc_en: "Adding AWS cert elevates profile visibility by 16%.",
      action_label_ar: "تحديث الملف",
      action_label_en: "Update Profile",
      action_url: "/candidate/profile",
      priority: "medium",
      type: "projects",
    }
  ],
  recommended_jobs: [
    {
      id: "job-101",
      title: "Senior Cloud Infrastructure Engineer",
      company: {
        id: "comp-1",
        name: "Aramco Digital Solutions",
        logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop",
        location: "الظهران، المنطقة الشرقية",
        isVerified: true,
      },
      location: "الظهران (هجين)",
      isRemote: false,
      workType: "دوام كامل",
      experienceLevel: "Mid-Senior",
      skills: ["AWS", "Kubernetes", "Terraform", "Python"],
      salary: {
        min: 18000,
        max: 25000,
        currency: "SAR",
        period: "شهرياً",
        isDisclosed: true,
      },
      postedAt: "منذ يومين",
      matchScore: 95,
      excerpt: "نبحث عن مهندس سحابة متمكن لبناء وتأمين المنصات السحابية المؤسسية بالمملكة.",
    },
    {
      id: "job-102",
      title: "Full Stack AI Applications Specialist",
      company: {
        id: "comp-2",
        name: "شركة علم لأمن المعلومات",
        logoUrl: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
        location: "الرياض",
        isVerified: true,
      },
      location: "الرياض (حضوري)",
      isRemote: false,
      workType: "دوام كامل",
      experienceLevel: "Senior",
      skills: ["React", "TypeScript", "Python", "FastAPI"],
      salary: {
        min: 19000,
        max: 27000,
        currency: "SAR",
        period: "شهرياً",
        isDisclosed: true,
      },
      postedAt: "منذ 4 أيام",
      matchScore: 92,
      excerpt: "تطوير تطبيقات رقمية ذكية تخدم التحول الرقمي الحكومي والخاص بالمملكة.",
    }
  ],
  activity: [
    {
      id: "act-1",
      type: "job_application",
      title_ar: "تم استعراض ملفك من أرامكو الرقمية",
      title_en: "Profile reviewed by Aramco Digital",
      desc_ar: "اطلع مسؤول الاستقطاب على تفاصيل مهاراتك ومشاريعك السحابية.",
      desc_en: "Recruiter reviewed your cloud architecture portfolio.",
      timestamp: "منذ 3 ساعات",
    },
    {
      id: "act-2",
      type: "profile_update",
      title_ar: "تحديث مؤشرات القيمة السوقية",
      title_en: "Market Value Updated",
      desc_ar: "تم تحديث نطاق الراتب التقديري استناداً لبيانات الربع الحالي.",
      desc_en: "Salary benchmark refreshed based on Q4 market figures.",
      timestamp: "منذ يومين",
    }
  ],
  quick_stats: {
    applications_count: 4,
    skills_count: 14,
    projects_count: 4,
    certifications_count: 3,
    profile_views: 168,
  },
}

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  id: 1,
  user_id: "cand_1",
  fullname: "أحمد بن خالد المالكي",
  about: "مهندس برمجيات متخصص في بناء وتطوير الأنظمة السحابية الموزعة وحلول الذكاء الاصطناعي وDevOps.",
  email: "ahmed@example.com",
  mobile: "+966 50 123 4567",
  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  sex: "male",
  country: "المملكة العربية السعودية",
  government: "الرياض",
  education_statue: "خريج",
  educational_qualification: "بكالوريوس",
  university: "جامعة الملك سعود",
  department_university: "علوم الحاسب والمعلومات",
  graduation_date: "2024-06-01",
  gpa: "4.85 / 5.0",
  years_of_skills: "3-5 سنوات",
  preferred_field_of_work: "تقنية المعلومات والبرمجيات",
  work_type: "دوام كامل",
  work_style: "هجين",
  expected_salary: 16000,
  visibility: "public",
  status: "active",
  is_verified: true,
  verified_at: "2026-01-15T10:00:00Z",
  cv: "https://example.com/cv.pdf",
  skills: ["Python", "React", "TypeScript", "Docker", "AWS", "SQL", "Flask", "Node.js"],
  languages: ["العربية (اللغة الأم)", "الإنجليزية (طلاقة)"],
  projects: [
    {
      id: 1,
      project_name: "منصة رصد التهديدات السيبرانية بالذكاء الاصطناعي",
      description: "نظام متكامل لتحليل حزم البيانات واكتشاف الأنماط المشبوهة بنسبة دقة 98.4%.",
      project_url: "https://github.com/example/ai-threat-detector",
      created_at: "2026-02-01",
    },
  ],
  certifications: [
    {
      id: 1,
      cert_name: "AWS Certified Solutions Architect",
      issuing_org: "Amazon Web Services",
      issue_month: 3,
      issue_year: 2025,
      expiry_month: 3,
      expiry_year: 2028,
      no_expiry: false,
      credential_id: "AWS-PSA-9921",
      credential_url: "https://aws.amazon.com/verify",
      created_at: "2025-03-10",
    },
  ],
  ats_score: 94,
  completion: {
    percentage: 95,
    checklist: [
      { key: "basic_info", label: "البيانات الأساسية", completed: true, weight: 20 },
      { key: "headline_about", label: "النبذة المهنية", completed: true, weight: 15 },
      { key: "skills", label: "المهارات المتخصصة", completed: true, weight: 20 },
      { key: "experience", label: "الخبرات", completed: true, weight: 15 },
      { key: "education", label: "المؤهل التعليمي", completed: true, weight: 15 },
      { key: "cv", label: "السيرة الذاتية", completed: true, weight: 15 },
    ],
  },
}

class CandidateService {
  async getDashboard(): Promise<CandidateDashboardData> {
    try {
      const { data } = await apiClient.get<CandidateDashboardData>(
        API_CONFIG.ENDPOINTS.CANDIDATES.DASHBOARD
      )
      if (data && data.candidate) {
        return data
      }
      return DEFAULT_CANDIDATE_DASHBOARD
    } catch (err) {
      console.warn("Using resilient fallback candidate dashboard data:", err)
      return DEFAULT_CANDIDATE_DASHBOARD
    }
  }

  async getRecommendations(): Promise<RecommendedJobItem[]> {
    const { data } = await apiClient.get<{ jobs: RecommendedJobItem[] }>(
      API_CONFIG.ENDPOINTS.CANDIDATES.RECOMMENDATIONS
    )
    return data.jobs || []
  }

  async getProfile(): Promise<CandidateProfile> {
    try {
      const { data } = await apiClient.get<CandidateProfile>(
        API_CONFIG.ENDPOINTS.CANDIDATES.PROFILE
      )
      if (data && data.fullname) {
        return data
      }
      return DEFAULT_CANDIDATE_PROFILE
    } catch (err) {
      console.warn("Using resilient fallback candidate profile data:", err)
      return DEFAULT_CANDIDATE_PROFILE
    }
  }

  async updateIdentity(dto: UpdateIdentityDTO): Promise<CandidateProfile> {
    if (dto.avatar) {
      const formData = new FormData()
      if (dto.fullname) formData.append("fullname", dto.fullname)
      if (dto.about) formData.append("about", dto.about)
      if (dto.mobile) formData.append("mobile", dto.mobile)
      if (dto.country) formData.append("country", dto.country)
      if (dto.government) formData.append("government", dto.government)
      if (dto.sex) formData.append("sex", dto.sex)
      formData.append("avatar", dto.avatar)

      const { data } = await apiClient.put<CandidateProfile>(
        API_CONFIG.ENDPOINTS.CANDIDATES.IDENTITY,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return data
    }

    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.IDENTITY,
      dto
    )
    return data
  }

  async updateAbout(dto: UpdateAboutDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.ABOUT,
      dto
    )
    return data
  }

  async updateSkills(dto: UpdateSkillsDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.SKILLS,
      dto
    )
    return data
  }

  async updateExperience(dto: UpdateExperienceDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.EXPERIENCE,
      dto
    )
    return data
  }

  async updateEducation(dto: UpdateEducationDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.EDUCATION,
      dto
    )
    return data
  }

  async saveProject(dto: SaveProjectDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PROJECTS,
      dto
    )
    return data
  }

  async deleteProject(projectId: number): Promise<CandidateProfile> {
    const { data } = await apiClient.delete<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PROJECT_DELETE(projectId)
    )
    return data
  }

  async saveCertification(dto: SaveCertificationDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CERTIFICATIONS,
      dto
    )
    return data
  }

  async deleteCertification(certId: number): Promise<CandidateProfile> {
    const { data } = await apiClient.delete<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CERTIFICATION_DELETE(certId)
    )
    return data
  }

  async updatePreferences(dto: UpdatePreferencesDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PREFERENCES,
      dto
    )
    return data
  }

  async updateVisibility(dto: UpdateVisibilityDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.VISIBILITY,
      dto
    )
    return data
  }

  async uploadCV(file: File): Promise<CandidateProfile> {
    const formData = new FormData()
    formData.append("cv", file)

    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CV_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return data
  }

  // ── Section 3: Opportunities, Detail, Apply, Applications & Saved Jobs ──

  async getCandidateJobs(params?: CandidateJobsFilterParams): Promise<CandidateJobsResponse> {
    const { data } = await apiClient.get<CandidateJobsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOBS,
      { params }
    )
    return data
  }

  async getCandidateJobDetail(id: string | number): Promise<CandidateJobDetail> {
    const { data } = await apiClient.get<CandidateJobDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_DETAIL(id)
    )
    return data
  }

  async applyToJob(id: string | number): Promise<{ success: boolean; message: string; application: any }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_APPLY(id)
    )
    return data
  }

  async saveJob(id: string | number): Promise<{ success: boolean; isSaved: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_SAVE(id)
    )
    return data
  }

  async unsaveJob(id: string | number): Promise<{ success: boolean; isSaved: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_SAVE(id)
    )
    return data
  }

  async getApplications(params?: { status?: string; page?: number; page_size?: number }): Promise<CandidateApplicationsResponse> {
    const { data } = await apiClient.get<CandidateApplicationsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.APPLICATIONS_LIST,
      { params }
    )
    return data
  }

  async getApplicationDetail(id: string | number): Promise<CandidateApplicationDetail> {
    const { data } = await apiClient.get<CandidateApplicationDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.APPLICATION_DETAIL(id)
    )
    return data
  }

  async getSavedJobs(params?: { page?: number; page_size?: number }): Promise<CandidateJobsResponse> {
    const { data } = await apiClient.get<CandidateJobsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.SAVED_JOBS,
      { params }
    )
    return data
  }

  // ── Section 4: Candidate Teams, Capabilities, Invitations & Search ──────

  async getTeams(): Promise<CandidateTeamsListResponse> {
    const { data } = await apiClient.get<CandidateTeamsListResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAMS
    )
    return data
  }

  async getTeamDetail(id: string | number): Promise<CandidateTeamDetail> {
    const { data } = await apiClient.get<CandidateTeamDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_DETAIL(id)
    )
    return data
  }

  async createTeam(payload: CreateTeamPayload): Promise<{ success: boolean; teamId: number; message: string; team: CandidateTeamDetail }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAMS,
      payload
    )
    return data
  }

  async updateTeam(id: string | number, payload: UpdateTeamPayload): Promise<{ success: boolean; message: string; team: CandidateTeamDetail }> {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_UPDATE(id),
      payload
    )
    return data
  }

  async deleteTeam(id: string | number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_DELETE(id)
    )
    return data
  }

  async leaveTeam(id: string | number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_LEAVE(id)
    )
    return data
  }

  async removeTeamMember(teamId: string | number, memberUserId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_MEMBER_REMOVE(teamId, memberUserId)
    )
    return data
  }

  async searchCandidatesForTeams(params?: {
    q?: string
    skill?: string
    field?: string
    location?: string
    team_id?: number
    page?: number
    page_size?: number
  }): Promise<CandidateSearchResponse> {
    const { data } = await apiClient.get<CandidateSearchResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_CANDIDATES_SEARCH,
      { params }
    )
    return data
  }

  async inviteCandidateToTeam(teamId: string | number, payload: InviteMemberPayload): Promise<{ success: boolean; invitationId: number; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITE(teamId),
      payload
    )
    return data
  }

  async getReceivedInvitations(): Promise<{ invitations: ReceivedInvitationItem[] }> {
    const { data } = await apiClient.get<{ invitations: ReceivedInvitationItem[] }>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATIONS
    )
    return data
  }

  async respondToInvitation(invId: number, action: "accept" | "reject"): Promise<{ success: boolean; action: string; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATION_RESPOND(invId),
      { action }
    )
    return data
  }

  async cancelInvitation(invId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATION_CANCEL(invId)
    )
    return data
  }

  async getSettings(): Promise<CandidateSettingsData> {
    try {
      const { data } = await apiClient.get<{ settings: CandidateSettingsData }>(
        API_CONFIG.ENDPOINTS.CANDIDATES.SETTINGS
      )
      return data.settings
    } catch {
      return DEFAULT_CANDIDATE_SETTINGS
    }
  }

  async updateSettings(settings: Partial<CandidateSettingsData>): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.CANDIDATES.SETTINGS,
      settings
    )
    return data
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.CHANGE_PASSWORD,
      { current_password: currentPassword, new_password: newPassword }
    )
    return data
  }

  getCVDownloadUrl(): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CANDIDATES.CV_DOWNLOAD}`
  }

  getImageUrl(filename?: string): string | null {
    if (!filename) return null
    if (filename.startsWith("http://") || filename.startsWith("https://")) return filename
    return `${API_CONFIG.BASE_URL}/download_image/${filename}`
  }
}

export const candidateService = new CandidateService()
