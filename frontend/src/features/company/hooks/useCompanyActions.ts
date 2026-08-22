import { useMutation, useQueryClient } from "@tanstack/react-query"
import { companyService } from "../services/company.service"
import type {
  CreateJobPayload,
  UpdateJobPayload,
  UpdateCompanyProfilePayload,
} from "../types/company.types"

export function useCompanyActions() {
  const queryClient = useQueryClient()

  // 1. Profile Update
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateCompanyProfilePayload) =>
      companyService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
    },
  })

  // 2. Logo Upload
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  // 3. Create Job
  const createJobMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => companyService.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "jobs"] })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
    },
  })

  // 4. Update Job
  const updateJobMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number
      payload: UpdateJobPayload
    }) => companyService.updateJob(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["company", "jobs"] })
      queryClient.invalidateQueries({ queryKey: ["company", "job", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
    },
  })

  // 5. Delete Job
  const deleteJobMutation = useMutation({
    mutationFn: (id: string | number) => companyService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "jobs"] })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
    },
  })

  // 6. Application Status Update
  const updateApplicationStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string | number
      status: string
      note?: string
    }) => companyService.updateApplicationStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["company", "applications"] })
      queryClient.invalidateQueries({
        queryKey: ["company", "application", variables.id],
      })
      queryClient.invalidateQueries({ queryKey: ["company", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["company", "jobs"] })
    },
  })

  return {
    updateProfileMutation,
    uploadLogoMutation,
    createJobMutation,
    updateJobMutation,
    deleteJobMutation,
    updateApplicationStatusMutation,
  }
}
