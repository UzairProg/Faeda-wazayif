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
    const res = await apiClient.get<UniversityDashboardData>(API_CONFIG.ENDPOINTS.UNIVERSITY.DASHBOARD)
    return res.data
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
}
