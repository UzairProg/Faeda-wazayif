/**
 * useCandidateJobDetail.ts — React Query hook for fetching single job detail for candidate.
 */
import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_JOB_DETAIL_QUERY_KEY = (id: string | number) =>
  ["candidate", "job", String(id)] as const

export function useCandidateJobDetail(jobId: string | number | undefined) {
  const enabled = Boolean(jobId)

  const query = useQuery({
    queryKey: CANDIDATE_JOB_DETAIL_QUERY_KEY(jobId || ""),
    queryFn: () => candidateService.getCandidateJobDetail(jobId!),
    enabled,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })

  return {
    job: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
