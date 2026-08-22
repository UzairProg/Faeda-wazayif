/**
 * useCandidateSavedJobs.ts — React Query hook for listing candidate's saved / bookmarked jobs.
 */
import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_SAVED_JOBS_QUERY_KEY = ["candidate", "saved-jobs"] as const

interface UseCandidateSavedJobsParams {
  page?: number
  page_size?: number
}

export function useCandidateSavedJobs(params: UseCandidateSavedJobsParams = {}) {
  const query = useQuery({
    queryKey: [...CANDIDATE_SAVED_JOBS_QUERY_KEY, params],
    queryFn: () => candidateService.getSavedJobs(params),
    staleTime: 1000 * 60 * 2,
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
