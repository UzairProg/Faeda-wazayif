/**
 * candidate.service.ts — HTTP client service for Candidate Workspace.
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"
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

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
})

class CandidateService {
  async getProfile(): Promise<CandidateProfile> {
    const { data } = await apiClient.get<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PROFILE
    )
    return data
  }

  async updateIdentity(dto: UpdateIdentityDTO): Promise<CandidateProfile> {
    if (dto.avatar) {
      const formData = new FormData()
      if (dto.fullname) formData.append("fullname", dto.fullname)
      if (dto.about) formData.append("about", dto.about)
      if (dto.mobile) formData.append("mobile", dto.mobile)
      if (dto.country) formData.append("country", dto.country)
      if (dto.government) formData.append("government", dto.government)
      if (dto.sex) formData.append("sex", dto.sex)
      formData.append("avatar", dto.avatar)

      const { data } = await apiClient.put<CandidateProfile>(
        API_CONFIG.ENDPOINTS.CANDIDATES.IDENTITY,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return data
    }

    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.IDENTITY,
      dto
    )
    return data
  }

  async updateAbout(dto: UpdateAboutDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.ABOUT,
      dto
    )
    return data
  }

  async updateSkills(dto: UpdateSkillsDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.SKILLS,
      dto
    )
    return data
  }

  async updateExperience(dto: UpdateExperienceDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.EXPERIENCE,
      dto
    )
    return data
  }

  async updateEducation(dto: UpdateEducationDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.EDUCATION,
      dto
    )
    return data
  }

  async saveProject(dto: SaveProjectDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PROJECTS,
      dto
    )
    return data
  }

  async deleteProject(projectId: number): Promise<CandidateProfile> {
    const { data } = await apiClient.delete<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PROJECT_DELETE(projectId)
    )
    return data
  }

  async saveCertification(dto: SaveCertificationDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CERTIFICATIONS,
      dto
    )
    return data
  }

  async deleteCertification(certId: number): Promise<CandidateProfile> {
    const { data } = await apiClient.delete<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CERTIFICATION_DELETE(certId)
    )
    return data
  }

  async updatePreferences(dto: UpdatePreferencesDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.PREFERENCES,
      dto
    )
    return data
  }

  async updateVisibility(dto: UpdateVisibilityDTO): Promise<CandidateProfile> {
    const { data } = await apiClient.put<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.VISIBILITY,
      dto
    )
    return data
  }

  async uploadCV(file: File): Promise<CandidateProfile> {
    const formData = new FormData()
    formData.append("cv", file)

    const { data } = await apiClient.post<CandidateProfile>(
      API_CONFIG.ENDPOINTS.CANDIDATES.CV_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return data
  }

  getCVDownloadUrl(): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CANDIDATES.CV_DOWNLOAD}`
  }

  getImageUrl(filename?: string): string | null {
    if (!filename) return null
    if (filename.startsWith("http://") || filename.startsWith("https://")) return filename
    return `${API_CONFIG.BASE_URL}/download_image/${filename}`
  }
}

export const candidateService = new CandidateService()
