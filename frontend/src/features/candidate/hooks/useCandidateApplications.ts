/**
 * useCandidateApplications.ts — React Query hook for listing candidate's own submitted job applications.
 */
import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_APPLICATIONS_QUERY_KEY = ["candidate", "applications"] as const

interface UseCandidateApplicationsParams {
  status?: string
  page?: number
  page_size?: number
}

export function useCandidateApplications(params: UseCandidateApplicationsParams = {}) {
  const query = useQuery({
    queryKey: [...CANDIDATE_APPLICATIONS_QUERY_KEY, params],
    queryFn: () => candidateService.getApplications(params),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
  })

  return {
    applications: query.data?.applications ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 1,
    pageSize: query.data?.pageSize ?? 10,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
