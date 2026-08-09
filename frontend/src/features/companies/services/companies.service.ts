/**
 * features/companies/services/companies.service.ts
 *
 * Service layer for the public Companies module.
 * All HTTP calls for public company discovery go through here.
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"
import type {
  CompanyDetail,
  CompanyFilter,
  CompanyListResponse,
  CompanySuggestion,
} from "../types/company.types"

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
})

function buildCompanyParams(filter: CompanyFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.verified !== undefined) params.verified = filter.verified
  if (filter.hasJobs !== undefined) params.has_jobs = filter.hasJobs
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of public companies.
 */
export async function getCompanies(filter: CompanyFilter = {}): Promise<CompanyListResponse> {
  const { data } = await api.get<CompanyListResponse>(API_CONFIG.ENDPOINTS.COMPANIES.LIST, {
    params: buildCompanyParams(filter),
  })
  return data
}

/**
 * Fetch a single company by ID including its available jobs.
 */
export async function getCompanyById(id: string): Promise<CompanyDetail> {
  const { data } = await api.get<CompanyDetail>(API_CONFIG.ENDPOINTS.COMPANIES.DETAIL(id))
  return data
}

/**
 * Fetch debounced autocomplete suggestions for company search.
 */
export async function getCompanySuggestions(query: string): Promise<CompanySuggestion[]> {
  if (!query || query.trim().length < 2) return []
  try {
    const { data } = await api.get<{ suggestions: CompanySuggestion[] }>(
      API_CONFIG.ENDPOINTS.COMPANIES.SUGGESTIONS,
      { params: { q: query.trim() } }
    )
    return data.suggestions || []
  } catch {
    return []
  }
}

export type { CompanyDetail, CompanyFilter, CompanyListResponse, CompanySuggestion }
