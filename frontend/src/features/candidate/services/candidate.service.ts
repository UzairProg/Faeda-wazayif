/**
 * candidate.service.ts — HTTP client service for Candidate Workspace.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  CandidateProfile,
  CandidateDashboardData,
  RecommendedJobItem,
  CandidateJobDetail,
  CandidateJobsFilterParams,
  CandidateJobsResponse,
  CandidateApplicationDetail,
  CandidateApplicationsResponse,
  UpdateIdentityDTO,
  UpdateAboutDTO,
  UpdateSkillsDTO,
  UpdateExperienceDTO,
  UpdateEducationDTO,
  SaveProjectDTO,
  SaveCertificationDTO,
  UpdatePreferencesDTO,
  UpdateVisibilityDTO,
  CandidateTeamsListResponse,
  CandidateTeamDetail,
  CreateTeamPayload,
  UpdateTeamPayload,
  InviteMemberPayload,
  CandidateSearchResponse,
  ReceivedInvitationItem,
} from "../types/candidate.types"

class CandidateService {
  async getDashboard(): Promise<CandidateDashboardData> {
    const { data } = await apiClient.get<CandidateDashboardData>(
      API_CONFIG.ENDPOINTS.CANDIDATES.DASHBOARD
    )
    return data
  }

  async getRecommendations(): Promise<RecommendedJobItem[]> {
    const { data } = await apiClient.get<{ jobs: RecommendedJobItem[] }>(
      API_CONFIG.ENDPOINTS.CANDIDATES.RECOMMENDATIONS
    )
    return data.jobs || []
  }

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

  // ── Section 3: Opportunities, Detail, Apply, Applications & Saved Jobs ──

  async getCandidateJobs(params?: CandidateJobsFilterParams): Promise<CandidateJobsResponse> {
    const { data } = await apiClient.get<CandidateJobsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOBS,
      { params }
    )
    return data
  }

  async getCandidateJobDetail(id: string | number): Promise<CandidateJobDetail> {
    const { data } = await apiClient.get<CandidateJobDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_DETAIL(id)
    )
    return data
  }

  async applyToJob(id: string | number): Promise<{ success: boolean; message: string; application: any }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_APPLY(id)
    )
    return data
  }

  async saveJob(id: string | number): Promise<{ success: boolean; isSaved: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_SAVE(id)
    )
    return data
  }

  async unsaveJob(id: string | number): Promise<{ success: boolean; isSaved: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.JOB_SAVE(id)
    )
    return data
  }

  async getApplications(params?: { status?: string; page?: number; page_size?: number }): Promise<CandidateApplicationsResponse> {
    const { data } = await apiClient.get<CandidateApplicationsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.APPLICATIONS_LIST,
      { params }
    )
    return data
  }

  async getApplicationDetail(id: string | number): Promise<CandidateApplicationDetail> {
    const { data } = await apiClient.get<CandidateApplicationDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.APPLICATION_DETAIL(id)
    )
    return data
  }

  async getSavedJobs(params?: { page?: number; page_size?: number }): Promise<CandidateJobsResponse> {
    const { data } = await apiClient.get<CandidateJobsResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.SAVED_JOBS,
      { params }
    )
    return data
  }

  // ── Section 4: Candidate Teams, Capabilities, Invitations & Search ──────

  async getTeams(): Promise<CandidateTeamsListResponse> {
    const { data } = await apiClient.get<CandidateTeamsListResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAMS
    )
    return data
  }

  async getTeamDetail(id: string | number): Promise<CandidateTeamDetail> {
    const { data } = await apiClient.get<CandidateTeamDetail>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_DETAIL(id)
    )
    return data
  }

  async createTeam(payload: CreateTeamPayload): Promise<{ success: boolean; teamId: number; message: string; team: CandidateTeamDetail }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAMS,
      payload
    )
    return data
  }

  async updateTeam(id: string | number, payload: UpdateTeamPayload): Promise<{ success: boolean; message: string; team: CandidateTeamDetail }> {
    const { data } = await apiClient.put(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_UPDATE(id),
      payload
    )
    return data
  }

  async deleteTeam(id: string | number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_DELETE(id)
    )
    return data
  }

  async leaveTeam(id: string | number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_LEAVE(id)
    )
    return data
  }

  async removeTeamMember(teamId: string | number, memberUserId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_MEMBER_REMOVE(teamId, memberUserId)
    )
    return data
  }

  async searchCandidatesForTeams(params?: {
    q?: string
    skill?: string
    field?: string
    location?: string
    team_id?: number
    page?: number
    page_size?: number
  }): Promise<CandidateSearchResponse> {
    const { data } = await apiClient.get<CandidateSearchResponse>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_CANDIDATES_SEARCH,
      { params }
    )
    return data
  }

  async inviteCandidateToTeam(teamId: string | number, payload: InviteMemberPayload): Promise<{ success: boolean; invitationId: number; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITE(teamId),
      payload
    )
    return data
  }

  async getReceivedInvitations(): Promise<{ invitations: ReceivedInvitationItem[] }> {
    const { data } = await apiClient.get<{ invitations: ReceivedInvitationItem[] }>(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATIONS
    )
    return data
  }

  async respondToInvitation(invId: number, action: "accept" | "reject"): Promise<{ success: boolean; action: string; message: string }> {
    const { data } = await apiClient.post(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATION_RESPOND(invId),
      { action }
    )
    return data
  }

  async cancelInvitation(invId: number): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete(
      API_CONFIG.ENDPOINTS.CANDIDATES.TEAM_INVITATION_CANCEL(invId)
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
