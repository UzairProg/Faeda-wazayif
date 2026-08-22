/**
 * useCandidateJobs.ts — React Query hook for fetching approved candidate opportunities.
 */
import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"
import type { CandidateJobsFilterParams } from "../types/candidate.types"

export const CANDIDATE_JOBS_QUERY_KEY = ["candidate", "jobs"] as const

export function useCandidateJobs(params: CandidateJobsFilterParams = {}) {
  const query = useQuery({
    queryKey: [...CANDIDATE_JOBS_QUERY_KEY, params],
    queryFn: () => candidateService.getCandidateJobs(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  })

  return {
    jobs: query.data?.jobs ?? [],
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
