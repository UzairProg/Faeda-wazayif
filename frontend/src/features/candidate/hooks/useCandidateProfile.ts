/**
 * useCandidateProfile.ts — React hook for candidate profile query & mutations.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { candidateService } from "../services/candidate.service"
import type {
  CandidateProfile,
  UpdateIdentityDTO,
  UpdateAboutDTO,
  UpdateSkillsDTO,
  UpdateExperienceDTO,
  UpdateEducationDTO,
  SaveProjectDTO,
  SaveCertificationDTO,
  UpdatePreferencesDTO,
  UpdateVisibilityDTO,
} from "../types/candidate.types"

import { CANDIDATE_DASHBOARD_QUERY_KEY } from "./useCandidateDashboard"

export const CANDIDATE_PROFILE_QUERY_KEY = ["candidate", "profile"]

export function useCandidateProfile() {
  const queryClient = useQueryClient()

  const profileQuery = useQuery<CandidateProfile>({
    queryKey: CANDIDATE_PROFILE_QUERY_KEY,
    queryFn: () => candidateService.getProfile(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })

  const syncCache = (updated: CandidateProfile) => {
    queryClient.setQueryData(CANDIDATE_PROFILE_QUERY_KEY, updated)
    queryClient.invalidateQueries({ queryKey: CANDIDATE_DASHBOARD_QUERY_KEY })
  }

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: CANDIDATE_PROFILE_QUERY_KEY })
    queryClient.invalidateQueries({ queryKey: CANDIDATE_DASHBOARD_QUERY_KEY })
  }

  const updateIdentity = useMutation({
    mutationFn: (dto: UpdateIdentityDTO) => candidateService.updateIdentity(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updateAbout = useMutation({
    mutationFn: (dto: UpdateAboutDTO) => candidateService.updateAbout(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updateSkills = useMutation({
    mutationFn: (dto: UpdateSkillsDTO) => candidateService.updateSkills(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updateExperience = useMutation({
    mutationFn: (dto: UpdateExperienceDTO) => candidateService.updateExperience(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updateEducation = useMutation({
    mutationFn: (dto: UpdateEducationDTO) => candidateService.updateEducation(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const saveProject = useMutation({
    mutationFn: (dto: SaveProjectDTO) => candidateService.saveProject(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const deleteProject = useMutation({
    mutationFn: (projectId: number) => candidateService.deleteProject(projectId),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const saveCertification = useMutation({
    mutationFn: (dto: SaveCertificationDTO) => candidateService.saveCertification(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const deleteCertification = useMutation({
    mutationFn: (certId: number) => candidateService.deleteCertification(certId),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updatePreferences = useMutation({
    mutationFn: (dto: UpdatePreferencesDTO) => candidateService.updatePreferences(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const updateVisibility = useMutation({
    mutationFn: (dto: UpdateVisibilityDTO) => candidateService.updateVisibility(dto),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  const uploadCV = useMutation({
    mutationFn: (file: File) => candidateService.uploadCV(file),
    onSuccess: (updated) => {
      syncCache(updated)
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    invalidate,
    updateIdentity,
    updateAbout,
    updateSkills,
    updateExperience,
    updateEducation,
    saveProject,
    deleteProject,
    saveCertification,
    deleteCertification,
    updatePreferences,
    updateVisibility,
    uploadCV,
  }
}
