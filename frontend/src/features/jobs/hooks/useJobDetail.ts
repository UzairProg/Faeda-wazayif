/**
 * features/jobs/hooks/useJobDetail.ts
 *
 * TanStack Query hook for a single job detail.
 */
import { useQuery } from "@tanstack/react-query"
import { getJobById } from "../services/jobs.service"
import type { JobDetail } from "../types/job.types"

export const JOB_DETAIL_QUERY_KEY = "job-detail"

export interface UseJobDetailResult {
  job: JobDetail | undefined
  isLoading: boolean
  isError: boolean
  isNotFound: boolean
  error: Error | null
}

export function useJobDetail(id: string): UseJobDetailResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [JOB_DETAIL_QUERY_KEY, id],
    queryFn: () => getJobById(id),
    enabled: Boolean(id),
    retry: (failureCount, err) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any)?.response?.status === 404) return false
      return failureCount < 1
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isNotFound = isError && (error as any)?.response?.status === 404

  return {
    job: data,
    isLoading,
    isError: isError && !isNotFound,
    isNotFound,
    error: isError ? (error as Error) : null,
  }
}
