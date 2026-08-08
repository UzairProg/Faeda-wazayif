/**
 * features/jobs/hooks/useJobs.ts
 *
 * TanStack Query hook for the jobs list.
 * Handles loading, error, empty, and unavailable states cleanly —
 * no fake data is ever shown.
 */
import { useQuery } from "@tanstack/react-query"
import { getJobs } from "../services/jobs.service"
import type { JobFilter, JobListResponse } from "../types/job.types"

export const JOBS_QUERY_KEY = "jobs"

export interface UseJobsResult {
  jobs: JobListResponse | undefined
  isLoading: boolean
  isError: boolean
  /** True when the backend isn't returning JSON yet — distinct from a real error */
  isUnavailable: boolean
  error: Error | null
  refetch: () => void
}

export function useJobs(filter: JobFilter = {}): UseJobsResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [JOBS_QUERY_KEY, filter],
    queryFn: () => getJobs(filter),
    // Don't retry on 404 — backend endpoint may not exist as JSON yet
    retry: (failureCount, err) => {
      if (axios404(err)) return false
      return failureCount < 2
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  const isUnavailable =
    isError && error != null && isBackendNotJson(error)

  return {
    jobs: data,
    isLoading,
    isError: isError && !isUnavailable,
    isUnavailable,
    error: isError ? (error as Error) : null,
    refetch,
  }
}

/** Detect when the backend is returning HTML instead of JSON */
function isBackendNotJson(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    return (
      msg.includes("unexpected token") ||      // JSON parse error on HTML
      msg.includes("<!doctype") ||
      msg.includes("network error")
    )
  }
  // Axios 404
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = (err as any)?.response?.status
  return status === 404 || status === 0
}

function axios404(err: unknown): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (err as any)?.response?.status === 404
}
