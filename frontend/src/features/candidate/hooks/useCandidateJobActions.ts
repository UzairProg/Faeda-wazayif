/**
 * useCandidateJobActions.ts — React Query mutations for applying to jobs, saving, and unsaving.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"
import { CANDIDATE_JOBS_QUERY_KEY } from "./useCandidateJobs"
import { CANDIDATE_APPLICATIONS_QUERY_KEY } from "./useCandidateApplications"
import { CANDIDATE_SAVED_JOBS_QUERY_KEY } from "./useCandidateSavedJobs"
import { CANDIDATE_DASHBOARD_QUERY_KEY } from "./useCandidateDashboard"

export function useCandidateJobActions() {
  const queryClient = useQueryClient()

  const applyMutation = useMutation({
    mutationFn: (jobId: string | number) => candidateService.applyToJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "job", String(jobId)] })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_JOBS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_APPLICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_DASHBOARD_QUERY_KEY })
    },
  })

  const saveMutation = useMutation({
    mutationFn: (jobId: string | number) => candidateService.saveJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "job", String(jobId)] })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_JOBS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_SAVED_JOBS_QUERY_KEY })
    },
  })

  const unsaveMutation = useMutation({
    mutationFn: (jobId: string | number) => candidateService.unsaveJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", "job", String(jobId)] })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_JOBS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CANDIDATE_SAVED_JOBS_QUERY_KEY })
    },
  })

  return {
    applyToJob: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    applyError: applyMutation.error,

    saveJob: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,

    unsaveJob: unsaveMutation.mutateAsync,
    isUnsaving: unsaveMutation.isPending,
  }
}
