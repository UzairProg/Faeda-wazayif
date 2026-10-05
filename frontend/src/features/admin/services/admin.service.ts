/**
 * features/admin/services/admin.service.ts
 *
 * REST API client for Faeda Admin Governance Console.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  AdminDashboardData,
  AdminUsersResponse,
  AdminJobsResponse,
  AdminAuditLogsResponse,
  AdminReportsResponse,
  AdminSettingsResponse,
  AdminTicketsResponse,
  AdminCategoriesResponse,
} from "../types/admin.types"

class AdminService {
  /** Fetch dashboard KPIs, pending queues, and recent activity */
  async getDashboard(): Promise<AdminDashboardData> {
    const { data } = await apiClient.get<AdminDashboardData>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD
    )
    return data
  }

  /** Fetch unified list of users (candidates, companies, universities, admins) */
  async getUsers(params?: {
    type?: string
    status?: string
    q?: string
    page?: number
    per_page?: number
  }): Promise<AdminUsersResponse> {
    const { data } = await apiClient.get<AdminUsersResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.USERS,
      { params }
    )
    return data
  }

  /** Update user active / suspended / banned status */
  async updateUserStatus(
    type: string,
    id: number | string,
    status: 'active' | 'suspended' | 'banned',
    reason?: string
  ): Promise<{ success: boolean; message: string; status: string }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.USER_STATUS(type, id),
      { status, reason }
    )
    return data
  }

  /** Toggle verification checkmark badge */
  async toggleUserVerification(
    type: string,
    id: number | string,
    is_verified: boolean
  ): Promise<{ success: boolean; message: string; is_verified: boolean }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.USER_VERIFY(type, id),
      { is_verified }
    )
    return data
  }

  /** Delete a user account */
  async deleteUser(
    type: string,
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.ADMIN.USER_DELETE(type, id)
    )
    return data
  }

  /** Fetch job postings with status filter and search */
  async getJobs(params?: {
    status?: string
    q?: string
    page?: number
    per_page?: number
  }): Promise<AdminJobsResponse> {
    const { data } = await apiClient.get<AdminJobsResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.JOBS,
      { params }
    )
    return data
  }

  /** Approve, reject, or archive a job posting */
  async updateJobStatus(
    id: number | string,
    status: 'approved' | 'rejected' | 'pending' | 'archived',
    note?: string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.JOB_STATUS(id),
      { status, note }
    )
    return data
  }

  /** Delete a job posting */
  async deleteJob(
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.ADMIN.JOB_DELETE(id)
    )
    return data
  }

  /** Fetch system audit logs */
  async getAuditLogs(params?: {
    action?: string
    q?: string
    page?: number
    per_page?: number
  }): Promise<AdminAuditLogsResponse> {
    const { data } = await apiClient.get<AdminAuditLogsResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.AUDIT_LOGS,
      { params }
    )
    return data
  }

  /** Fetch abuse/moderation reports */
  async getReports(params?: {
    status?: string
    page?: number
    per_page?: number
  }): Promise<AdminReportsResponse> {
    const { data } = await apiClient.get<AdminReportsResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.REPORTS,
      { params }
    )
    return data
  }

  /** Resolve or dismiss an abuse report */
  async updateReportStatus(
    id: number | string,
    status: 'resolved' | 'dismissed' | 'reviewing',
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.REPORT_STATUS(id),
      { status, notes }
    )
    return data
  }

  /** Retrieve platform system settings */
  async getSettings(): Promise<AdminSettingsResponse> {
    const { data } = await apiClient.get<AdminSettingsResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.SETTINGS
    )
    return data
  }

  /** Save dynamic platform settings */
  async updateSettings(
    settings: Record<string, any>
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.ADMIN.SETTINGS,
      { settings }
    )
    return data
  }

  /** Fetch support tickets */
  async getTickets(params?: {
    status?: string
    page?: number
    per_page?: number
  }): Promise<AdminTicketsResponse> {
    const { data } = await apiClient.get<AdminTicketsResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.TICKETS,
      { params }
    )
    return data
  }

  /** Reply or update status on support ticket */
  async updateTicket(
    id: number | string,
    payload: { status?: 'open' | 'closed'; admin_reply?: string }
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.TICKET_UPDATE(id),
      payload
    )
    return data
  }

  /** Fetch taxonomy categories, cities, and job types */
  async getCategories(): Promise<AdminCategoriesResponse> {
    const { data } = await apiClient.get<AdminCategoriesResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES
    )
    return data
  }

  /** Create a new category, city, or job type */
  async createCategory(payload: {
    type: 'category' | 'city' | 'job_type'
    name_ar: string
    name_en?: string
    icon?: string
  }): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES,
      payload
    )
    return data
  }

  /** Delete a category, city, or job type */
  async deleteCategory(
    type: 'category' | 'city' | 'job_type',
    id: number | string
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.ADMIN.CATEGORY_DELETE(type, id)
    )
    return data
  }

  /** Toggle active status on category, city, or job type */
  async toggleCategory(
    type: 'category' | 'city' | 'job_type',
    id: number | string
  ): Promise<{ success: boolean; message: string; is_active: boolean }> {
    const { data } = await apiClient.patch(
      API_CONFIG.ENDPOINTS.ADMIN.CATEGORY_TOGGLE(type, id)
    )
    return data
  }
}

export const adminService = new AdminService()
