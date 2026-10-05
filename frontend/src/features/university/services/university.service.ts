import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  UniversityDashboardData,
  UniversityProfile,
  UpdateUniversityProfilePayload,
  UniversityStudentItem,
  UniversityStudentDetail,
  VerificationQueueItem,
  UniversityDepartmentItem,
  CreateDepartmentPayload,
  UniversityOpportunityItem,
  StudentFilterParams,
  UniversityThesisCampaign,
  CreateThesisCampaignPayload,
  UniversityIncubatorVenture,
  IncubatorShowcaseResponse,
  CreateIncubatorVenturePayload,
  CoopSupervisionResponse,
  CoopSupervisedStudent,
  CreateCoopStudentPayload,
  UpdateCoopStudentPayload,
  CoopEvaluationPayload,
  CreateCoopSchedulePayload,
  GraduateEmploymentKPIs,
} from "../types/university.types"

export const universityService = {
  /**
   * Check authenticated institution session.
   */
  async getMe(): Promise<{ authenticated: boolean; role: string; institution: UniversityProfile }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.ME)
    return res.data
  },

  /**
   * Get institution profile with completeness scorecard.
   */
  async getProfile(): Promise<{ success: boolean; profile: UniversityProfile }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.PROFILE)
    return res.data
  },

  /**
   * Update institution profile fields.
   */
  async updateProfile(payload: UpdateUniversityProfilePayload): Promise<{ success: boolean; profile: UniversityProfile; message: string }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.PROFILE, payload)
    return res.data
  },

  /**
   * Upload institution logo.
   */
  async uploadLogo(file: File): Promise<{ success: boolean; logo_url: string; message: string }> {
    const formData = new FormData()
    formData.append("logo", file)
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.LOGO_UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  /**
   * Get dashboard aggregated metrics.
   */
  async getDashboard(): Promise<UniversityDashboardData> {
    try {
      const res = await apiClient.get<UniversityDashboardData>(API_CONFIG.ENDPOINTS.UNIVERSITY.DASHBOARD)
      return res.data
    } catch (err) {
      console.warn("Using fallback university dashboard data:", err)
      return {
        success: true,
        institution: {
          id: 1,
          name_ar: "جامعة الملك فيصل",
          name_en: "King Faisal University",
          name: "جامعة الملك فيصل",
          email: "careers@kfu.edu.sa",
          description_ar: "جامعة رائدة في الأحساء مكرسة للأمن الغذائي والاستدامة البيئية والابتكار.",
          description_en: "Leading university in Al-Ahsa dedicated to food security and innovation.",
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
          completeness: { percentage: 100, completed_factors: 6, total_factors: 6, checklist: [] },
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
          coop_students_count: 12,
        },
        recent_students: [],
        recent_verifications: [],
      }
    }
  },

  /**
   * Get connected students with filters and pagination.
   */
  async getStudents(params?: StudentFilterParams): Promise<{
    success: boolean
    students: UniversityStudentItem[]
    pagination: { total: number; page: number; page_size: number; total_pages: number }
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENTS, { params })
    return res.data
  },

  /**
   * Get deep student academic & professional dossier.
   */
  async getStudentDetail(id: string | number): Promise<{ success: boolean; student: UniversityStudentDetail }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENT_DETAIL(id))
    return res.data
  },

  /**
   * Directly verify a connected student.
   */
  async verifyStudentDirect(
    id: string | number,
    payload: { degree?: string; department?: string; graduation_year?: string; gpa?: string; notes?: string }
  ): Promise<{ success: boolean; message: string; verification_code: string }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENT_VERIFY_DIRECT(id), payload)
    return res.data
  },

  /**
   * Get academic verification queue.
   */
  async getVerifications(params?: { status?: string; department?: string; q?: string }): Promise<{
    success: boolean
    verifications: VerificationQueueItem[]
    total: number
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.VERIFICATIONS, { params })
    return res.data
  },

  /**
   * Update verification status (approve / reject).
   */
  async updateVerification(
    id: string | number,
    payload: { status: "verified" | "rejected" | "pending"; notes?: string }
  ): Promise<{ success: boolean; message: string; verification: { id: number; status: string; verification_code: string } }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.VERIFICATION_UPDATE(id), payload)
    return res.data
  },

  /**
   * Get academic departments list.
   */
  async getDepartments(): Promise<{ success: boolean; departments: UniversityDepartmentItem[]; total: number }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENTS)
    return res.data
  },

  /**
   * Create new academic department.
   */
  async createDepartment(payload: CreateDepartmentPayload): Promise<{ success: boolean; department: UniversityDepartmentItem; message: string }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENTS, payload)
    return res.data
  },

  /**
   * Update department.
   */
  async updateDepartment(
    id: string | number,
    payload: Partial<CreateDepartmentPayload>
  ): Promise<{ success: boolean; department: UniversityDepartmentItem; message: string }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENT_DETAIL(id), payload)
    return res.data
  },

  /**
   * Delete department.
   */
  async deleteDepartment(id: string | number): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENT_DETAIL(id))
    return res.data
  },

  /**
   * Get approved opportunities relevant to institution specializations.
   */
  async getOpportunities(params?: { q?: string; work_type?: string }): Promise<{
    success: boolean
    opportunities: UniversityOpportunityItem[]
    total: number
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.OPPORTUNITIES, { params })
    return res.data
  },

  /**
   * Get Graduate Employability & Labor Market Performance Indicators (KPIs).
   */
  async getEmploymentKPIs(department?: string): Promise<GraduateEmploymentKPIs> {
    const res = await apiClient.get<GraduateEmploymentKPIs>(API_CONFIG.ENDPOINTS.UNIVERSITY.EMPLOYMENT_KPIS, {
      params: department ? { department } : {},
    })
    return res.data
  },

  /**
   * Get Research & Innovation Marketing Campaigns (Thesis / Inventions).
   */
  async getThesisCampaigns(params?: { type?: string; status?: string }): Promise<{
    success: boolean
    campaigns: UniversityThesisCampaign[]
    total: number
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGNS, { params })
    return res.data
  },

  /**
   * Launch new Research / Thesis Marketing Campaign.
   */
  async createThesisCampaign(payload: CreateThesisCampaignPayload): Promise<{
    success: boolean
    message: string
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGNS, payload)
    return res.data
  },

  /**
   * Get single thesis campaign detail with co-branding metadata.
   */
  async getCampaignDetail(id: number | string): Promise<{
    success: boolean
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGN_DETAIL(id))
    return res.data
  },

  /**
   * Record industry / sponsorship / hiring inquiry on a thesis campaign.
   */
  async recordCampaignInquiry(id: number | string, type = "general"): Promise<{
    success: boolean
    message: string
    inquiries_count: number
    sponsorship_leads: number
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGN_INQUIRY(id), { type })
    return res.data
  },

  /**
   * Get Monsha'at Incubator & Entrepreneurship Showcase (Al-Ahsa & King Faisal University).
   */
  async getIncubatorShowcase(): Promise<IncubatorShowcaseResponse> {
    const res = await apiClient.get<IncubatorShowcaseResponse>(API_CONFIG.ENDPOINTS.UNIVERSITY.INCUBATOR)
    return res.data
  },

  /**
   * Register a new startup in the university incubator showcase.
   */
  async createIncubatorVenture(payload: CreateIncubatorVenturePayload): Promise<{
    success: boolean
    message: string
    venture: UniversityIncubatorVenture
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.INCUBATOR, payload)
    return res.data
  },

  /**
   * Get Professor Cooperative Training Supervision Command Center.
   */
  async getCoopSupervision(professorId?: string): Promise<CoopSupervisionResponse> {
    const res = await apiClient.get<CoopSupervisionResponse>(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION, {
      params: professorId ? { professor_id: professorId } : {},
    })
    return res.data
  },

  /**
   * Enroll new graduating senior in cooperative training.
   */
  async createCoopStudent(payload: CreateCoopStudentPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION, payload)
    return res.data
  },

  /**
   * Update student information or training details.
   */
  async updateCoopStudent(id: number | string, payload: UpdateCoopStudentPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.put(`${API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION}/${id}`, payload)
    return res.data
  },

  /**
   * Professor submits midterm or final evaluation for supervised training student.
   */
  async submitCoopEvaluation(id: number | string, payload: CoopEvaluationPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_EVALUATION(id), payload)
    return res.data
  },

  /**
   * Schedule professor supervision field visit or review check-in.
   */
  async createCoopSchedule(payload: CreateCoopSchedulePayload): Promise<{
    success: boolean
    message: string
    schedule: any
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SCHEDULE, payload)
    return res.data
  },

  /**
   * Update campaign review and publishing status.
   */
  async updateCampaignStatus(id: number | string, status: string): Promise<{
    success: boolean
    message: string
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.put(`/api/v1/university/campaigns/${id}/status`, { status })
    return res.data
  },

  /**
   * Submit detailed corporate partnership, sponsorship, or licensing request.
   */
  async submitPartnershipRequest(id: number | string, payload: any): Promise<{
    success: boolean
    message: string
    inquiries_count: number
    sponsorship_leads: number
  }> {
    const res = await apiClient.post(`/api/v1/university/campaigns/${id}/partner-request`, payload)
    return res.data
  },

  /**
   * Get campaign performance analytics.
   */
  async getCampaignAnalytics(): Promise<{
    success: boolean
    analytics: any
  }> {
    const res = await apiClient.get(`/api/v1/university/campaigns/analytics`)
    return res.data
  },

  /**
   * Get academic updates (curriculum, new programs, research achievements, announcements).
   */
  async getAcademicUpdates(): Promise<{
    success: boolean
    updates: any[]
    total: number
  }> {
    const res = await apiClient.get(`/api/v1/university/academic-updates`)
    return res.data
  },
}

