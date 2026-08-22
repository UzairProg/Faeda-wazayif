/**
 * useCandidateApplicationDetail.ts — React Query hook for single application detail with timeline and snapshot.
 */
import { useQuery } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"

export const CANDIDATE_APPLICATION_DETAIL_QUERY_KEY = (id: string | number) =>
  ["candidate", "application", String(id)] as const

export function useCandidateApplicationDetail(applicationId: string | number | undefined) {
  const enabled = Boolean(applicationId)

  const query = useQuery({
    queryKey: CANDIDATE_APPLICATION_DETAIL_QUERY_KEY(applicationId || ""),
    queryFn: () => candidateService.getApplicationDetail(applicationId!),
    enabled,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })

  return {
    application: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
