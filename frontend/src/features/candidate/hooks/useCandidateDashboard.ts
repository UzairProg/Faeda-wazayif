/**
 * useCandidateDashboard.ts — React hook for Candidate Career Command Center dashboard.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"
import type { CandidateDashboardData } from "../types/candidate.types"

export const CANDIDATE_DASHBOARD_QUERY_KEY = ["candidate", "dashboard"]

export function useCandidateDashboard() {
  const queryClient = useQueryClient()

  const dashboardQuery = useQuery<CandidateDashboardData>({
    queryKey: CANDIDATE_DASHBOARD_QUERY_KEY,
    queryFn: () => candidateService.getDashboard(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: CANDIDATE_DASHBOARD_QUERY_KEY })
  }

  return {
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    invalidate,
  }
}
