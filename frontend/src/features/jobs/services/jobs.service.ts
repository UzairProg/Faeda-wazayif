/**
 * features/jobs/services/jobs.service.ts
 *
 * Service layer for the Jobs module.
 * All HTTP calls for jobs go through here — never directly from UI components.
 *
 * Backend status (per FAEDA_JOBS_FINAL_ROADMAP.md §3.3):
 *   - Job listing and detail endpoints currently serve Jinja templates.
 *   - These service functions will return `null` / throw until the backend
 *     migrates to JSON at /api/v1/jobs. The hooks handle that gracefully.
 *
 * API dependency documented: backend needs GET /api/v1/jobs → JobListResponse
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"
import type { Job, JobDetail, JobFilter, JobListResponse } from "../types/job.types"

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Session cookie auth (current Flask backend)
})

/**
 * Build a URL query string from JobFilter params.
 */
function buildJobsParams(filter: JobFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.workType?.length) params.work_type = filter.workType.join(",")
  if (filter.experienceLevel?.length) params.experience = filter.experienceLevel.join(",")
  if (filter.hasDisclosedSalary !== undefined) params.salary_disclosed = filter.hasDisclosedSalary
  if (filter.companyId) params.company_id = filter.companyId
  if (filter.isTeamFriendly !== undefined) params.team_friendly = filter.isTeamFriendly
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of published jobs.
 *
 * @throws If the backend is not yet serving JSON at this endpoint.
 */
export async function getJobs(filter: JobFilter = {}): Promise<JobListResponse> {
  const { data } = await api.get<JobListResponse>(
    API_CONFIG.ENDPOINTS.JOBS.LIST,
    { params: buildJobsParams(filter) }
  )
  return data
}

/**
 * Fetch a single job by ID.
 *
 * @throws If the job is not found or backend is not JSON.
 */
export async function getJobById(id: string): Promise<JobDetail> {
  const { data } = await api.get<JobDetail>(API_CONFIG.ENDPOINTS.JOBS.DETAIL(id))
  return data
}

/**
 * Save/unsave a job (requires auth).
 * Returns the new saved state.
 *
 * @api-dependency Requires /api/v1/jobs/:id/save — not yet implemented in backend.
 */
export async function toggleSaveJob(id: string): Promise<{ saved: boolean }> {
  const { data } = await api.post<{ saved: boolean }>(
    API_CONFIG.ENDPOINTS.JOBS.SAVE(id)
  )
  return data
}

export type { Job, JobDetail, JobFilter, JobListResponse }
