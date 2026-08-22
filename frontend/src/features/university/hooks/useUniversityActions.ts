/**
 * features/university/hooks/useUniversityActions.ts
 *
 * Mutations for profile update, logo upload, verifications, and department operations.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { universityService } from "../services/university.service"
import type {
  UpdateUniversityProfilePayload,
  CreateDepartmentPayload,
} from "../types/university.types"

export function useUniversityActions() {
  const queryClient = useQueryClient()

  // 1. Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateUniversityProfilePayload) =>
      universityService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "profile"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  // 2. Upload Logo
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => universityService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "profile"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  // 3. Update Verification
  const updateVerificationMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number
      payload: { status: "verified" | "rejected" | "pending"; notes?: string }
    }) => universityService.updateVerification(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "verifications"] })
      queryClient.invalidateQueries({ queryKey: ["university", "students"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
    },
  })

  // 4. Direct Verify Student
  const directVerifyStudentMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number
      payload: { degree?: string; department?: string; graduation_year?: string; gpa?: string; notes?: string }
    }) => universityService.verifyStudentDirect(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "verifications"] })
      queryClient.invalidateQueries({ queryKey: ["university", "students"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
    },
  })

  // 5. Create Department
  const createDepartmentMutation = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      universityService.createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "departments"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
    },
  })

  // 6. Update Department
  const updateDepartmentMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number
      payload: Partial<CreateDepartmentPayload>
    }) => universityService.updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "departments"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
    },
  })

  // 7. Delete Department
  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string | number) => universityService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["university", "departments"] })
      queryClient.invalidateQueries({ queryKey: ["university", "dashboard"] })
    },
  })

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    uploadLogo: uploadLogoMutation.mutateAsync,
    isUploadingLogo: uploadLogoMutation.isPending,

    updateVerification: updateVerificationMutation.mutateAsync,
    isUpdatingVerification: updateVerificationMutation.isPending,

    directVerifyStudent: directVerifyStudentMutation.mutateAsync,
    isDirectVerifying: directVerifyStudentMutation.isPending,

    createDepartment: createDepartmentMutation.mutateAsync,
    isCreatingDepartment: createDepartmentMutation.isPending,

    updateDepartment: updateDepartmentMutation.mutateAsync,
    isUpdatingDepartment: updateDepartmentMutation.isPending,

    deleteDepartment: deleteDepartmentMutation.mutateAsync,
    isDeletingDepartment: deleteDepartmentMutation.isPending,
  }
}
