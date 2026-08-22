/**
 * features/company/services/company.service.ts
 *
 * HTTP API client for Authenticated Company Workspace.
 */
import axios from "axios"
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

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
})

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
    const { data } = await apiClient.get<CompanyDashboardData>(
      API_CONFIG.ENDPOINTS.COMPANY.DASHBOARD
    )
    return data
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
