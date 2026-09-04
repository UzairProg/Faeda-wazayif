/**
 * features/teams/services/teams.service.ts
 *
 * Service layer for the public Teams module.
 * All HTTP calls for public team discovery go through here.
 */
import { apiClient as api } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  TeamDetail,
  TeamFilter,
  TeamListResponse,
  TeamSuggestion,
} from "../types/team.types"

function buildTeamParams(filter: TeamFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of public teams.
 */
export async function getTeams(filter: TeamFilter = {}): Promise<TeamListResponse> {
  const { data } = await api.get<TeamListResponse>(API_CONFIG.ENDPOINTS.TEAMS.LIST, {
    params: buildTeamParams(filter),
  })
  return data
}

/**
 * Fetch a single team by ID including its members and linked opportunities.
 */
export async function getTeamById(id: string): Promise<TeamDetail> {
  const { data } = await api.get<TeamDetail>(API_CONFIG.ENDPOINTS.TEAMS.DETAIL(id))
  return data
}

/**
 * Fetch debounced autocomplete suggestions for team search.
 */
export async function getTeamSuggestions(query: string): Promise<TeamSuggestion[]> {
  if (!query || query.trim().length < 2) return []
  try {
    const { data } = await api.get<{ suggestions: TeamSuggestion[] }>(
      API_CONFIG.ENDPOINTS.TEAMS.SUGGESTIONS,
      { params: { q: query.trim() } }
    )
    return data.suggestions || []
  } catch {
    return []
  }
}

export type { TeamDetail, TeamFilter, TeamListResponse, TeamSuggestion }
