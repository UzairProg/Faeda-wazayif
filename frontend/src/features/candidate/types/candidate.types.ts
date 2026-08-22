/**
 * candidate.types.ts — Canonical TypeScript domain types for Candidate Workspace.
 *
 * Section 1: Professional Identity & Onboarding.
 */

export type VisibilityLevel = "public" | "employers_only" | "private"

export interface CandidateProject {
  id: number
  project_name: string
  description: string
  project_url: string
  created_at: string | null
}

export interface CandidateCertification {
  id: number
  cert_name: string
  issuing_org: string
  issue_month: number | null
  issue_year: number | null
  expiry_month: number | null
  expiry_year: number | null
  no_expiry: boolean
  credential_id: string
  credential_url: string
  created_at: string | null
}

export interface ProfileChecklistItem {
  key: string
  label: string
  completed: boolean
  weight: number
}

export interface ProfileCompleteness {
  percentage: number
  checklist: ProfileChecklistItem[]
}

export interface CandidateProfile {
  id: number
  user_id: string
  fullname: string
  about: string
  email: string
  mobile: string
  img: string
  sex: string
  country: string
  government: string
  education_statue: string
  educational_qualification: string
  university: string
  department_university: string
  graduation_date: string | null
  gpa: string
  years_of_skills: string
  preferred_field_of_work: string
  work_type: string
  work_style: string
  expected_salary: number | null
  visibility: VisibilityLevel
  status: string
  is_verified: boolean
  verified_at: string | null
  cv: string
  skills: string[]
  languages: string[]
  projects: CandidateProject[]
  certifications: CandidateCertification[]
  ats_score: number | null
  completion: ProfileCompleteness
  extracted_ats_data?: {
    university?: string
    qualification?: string
    experience_years?: string
    skills_found?: string
  }
}

export interface UpdateIdentityDTO {
  fullname?: string
  about?: string
  mobile?: string
  country?: string
  government?: string
  sex?: string
  avatar?: File
}

export interface UpdateAboutDTO {
  about: string
}

export interface UpdateSkillsDTO {
  skills: string[]
}

export interface UpdateExperienceDTO {
  years_of_skills?: string
  preferred_field_of_work?: string
  resume_text?: string
}

export interface UpdateEducationDTO {
  educational_qualification?: string
  university?: string
  department_university?: string
  graduation_date?: string
  gpa?: string
  education_statue?: string
}

export interface SaveProjectDTO {
  id?: number
  project_name: string
  description?: string
  project_url?: string
}

export interface SaveCertificationDTO {
  id?: number
  cert_name: string
  issuing_org: string
  issue_month?: number | null
  issue_year?: number | null
  expiry_month?: number | null
  expiry_year?: number | null
  no_expiry?: boolean
  credential_id?: string
  credential_url?: string
}

export interface UpdatePreferencesDTO {
  preferred_field_of_work?: string
  work_type?: string
  work_style?: string
  expected_salary?: number | null
  country?: string
  government?: string
}

export interface UpdateVisibilityDTO {
  visibility: VisibilityLevel
}

// ── Dashboard Types (Section 2) ──────────────────────────────────

export interface MarketValueFactor {
  key: string
  label_ar: string
  label_en: string
  status: "available" | "missing"
  value?: string | null
}

export interface MarketValueMissingFactor {
  key: string
  label_ar: string
  label_en: string
  section: string
}

export interface MarketValueRange {
  min_salary: number
  avg_salary: number
  max_salary: number
}

export interface MarketValueData {
  available: boolean
  value: number | null
  currency: string
  period: string
  score: number
  percentile_label: string | null
  experience_tier: string | null
  specialization: string | null
  range: MarketValueRange | null
  qs_rank_string: string | null
  factors: MarketValueFactor[]
  missing_factors: MarketValueMissingFactor[]
}

export interface ProfileHealthData {
  percentage: number
  checklist: ProfileChecklistItem[]
  ats_score: number | null
  skills_count: number
  projects_count: number
  certifications_count: number
  cv_uploaded: boolean
  education_status: string
}

export interface CandidateSummaryData {
  id: number
  user_id: string
  name: string
  headline: string
  about: string
  email: string
  mobile: string
  avatar: string
  location: string
  country: string
  government: string
  verification: {
    is_verified: boolean
    verified_at: string | null
  }
  visibility: VisibilityLevel
  specialization: string
  experience: string
}

export interface DashboardNextAction {
  id: string
  title_ar: string
  title_en: string
  desc_ar: string
  desc_en: string
  action_label_ar: string
  action_label_en: string
  action_url: string
  section?: string
  priority: "urgent" | "high" | "medium" | "low"
  type: "cv" | "skills" | "projects" | "education" | "experience" | "preferences" | "jobs"
}

export interface DashboardActivityItem {
  id: string
  type: "profile_update" | "job_application" | "system"
  title_ar: string
  title_en: string
  desc_ar: string
  desc_en: string
  timestamp: string
}

export interface DashboardQuickStats {
  applications_count: number
  skills_count: number
  projects_count: number
  certifications_count: number
  profile_views: number | null
}

export interface RecommendedJobItem {
  id: string
  title: string
  company: {
    id: string
    name: string
    logoUrl: string | null
    location: string
    isVerified: boolean
  }
  location: string
  isRemote: boolean
  workType: string
  experienceLevel: string
  skills: string[]
  salary: {
    min: number
    max: number
    currency: string
    period: string
    isDisclosed: boolean
  } | null
  postedAt: string
  matchScore?: number
  excerpt?: string
}

export interface CandidateDashboardData {
  candidate: CandidateSummaryData
  profile_health: ProfileHealthData
  market_value: MarketValueData
  next_actions: DashboardNextAction[]
  recommended_jobs: RecommendedJobItem[]
  activity: DashboardActivityItem[]
  quick_stats: DashboardQuickStats
}

// ── Section 3: Candidate Jobs & Applications Types ────────────────────────

export interface CandidateJobItem extends RecommendedJobItem {
  hasApplied?: boolean
  applicationId?: number | null
  applicationStatus?: string | null
  appliedAt?: string | null
  isSaved?: boolean
}

export interface CandidateReadiness {
  isReady: boolean
  profilePercentage: number
  hasCv: boolean
  cvName?: string | null
  skillsCount: number
  fullName: string
  email: string
  phone: string
  education: string
}

export interface CandidateJobDetail extends CandidateJobItem {
  description: string
  responsibilities: string[]
  requirements: string[]
  applicationDeadline?: string | null
  applicationCount?: number | null
  company: {
    id: string
    name: string
    logoUrl: string | null
    location: string
    isVerified: boolean
    about?: string | null
    industry?: string | null
    openJobsCount?: number
  }
  candidateReadiness?: CandidateReadiness
}

export interface CandidateJobsFilterParams {
  q?: string
  location?: string
  category?: string
  work_type?: string
  experience?: string
  salary_disclosed?: boolean
  saved_only?: boolean
  page?: number
  page_size?: number
}

export interface CandidateJobsResponse {
  jobs: CandidateJobItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApplicationTimelineStep {
  step: string
  title_ar: string
  title_en: string
  date: string | null
  isCompleted: boolean
  isCurrent: boolean
}

export interface CandidateApplicationItem {
  id: number
  jobId: number
  job: {
    id: number
    title: string
    location?: string | null
    workType?: string | null
    workplace?: string | null
    isRemote?: boolean
    specialization?: string | null
    salary?: {
      min: number
      max: number
      currency: string
      isDisclosed: boolean
    } | null
    status?: string
  } | null
  company: {
    id: string
    name: string
    logoUrl?: string | null
    location?: string | null
    isVerified?: boolean
    industry?: string | null
  }
  status: string
  statusKey: "applied" | "under_review" | "shortlisted" | "interview" | "accepted" | "rejected"
  statusLabelAr: string
  statusLabelEn: string
  badgeColor: "sky" | "amber" | "indigo" | "purple" | "emerald" | "rose" | "slate"
  stepIndex: number
  appliedAt: string | null
  type: string
  note?: string | null
}

export interface CandidateApplicationDetail extends CandidateApplicationItem {
  timeline: ApplicationTimelineStep[]
  candidateSnapshot: {
    name: string
    email: string
    mobile: string
    education?: string | null
    skills: string[]
    cvFile?: string | null
  }
}

export interface CandidateApplicationsResponse {
  applications: CandidateApplicationItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Section 4: Candidate Teams Types ────────────────────────────────────────

export interface TeamMember {
  id: string
  userId: string
  name: string
  headline: string
  avatarUrl: string | null
  role: string
  isOwner: boolean
  skills: string[]
  experience: string
  joinedAt: string | null
}

export interface TeamCapabilityGap {
  track: string
  trackAr: string
  suggestedSkills: string[]
  reasonAr: string
}

export interface CandidateTeamSummary {
  id: string
  name: string
  about: string
  achievements: string
  specialization: string
  generalProgram: string | null
  semiSpecialProgram: string | null
  specialProgram: string | null
  logoUrl: string | null
  memberCount: number
  role: "owner" | "member"
  isOwner: boolean
  capabilities: string[]
  memberDerivedCapabilities: string[]
  openOpportunitiesCount: number
  creationDate: string | null
}

export interface CandidateTeamDetail extends CandidateTeamSummary {
  currentMemberRole: "owner" | "member" | "invited" | "viewer"
  members: TeamMember[]
  potentialGaps: TeamCapabilityGap[]
  opportunities: any[]
  pendingInvitations: PendingInvitationItem[]
}

export interface PendingInvitationItem {
  id: number
  candidateId: number
  candidateUserId: string
  candidateName: string
  candidateHeadline: string
  avatarUrl: string | null
  role: string
  message: string | null
  createdAt: string | null
}

export interface ReceivedInvitationItem {
  id: number
  teamId: number
  teamName: string
  teamSpecialization: string
  teamAbout: string
  teamLogoUrl: string | null
  inviterName: string
  role: string
  message: string | null
  createdAt: string | null
}

export interface CandidateTeamsListResponse {
  ownedTeams: CandidateTeamSummary[]
  joinedTeams: CandidateTeamSummary[]
  pendingInvitationsCount: number
  totalTeams: number
}

export interface CandidateSearchItem {
  id: number
  userId: string
  name: string
  headline: string
  location: string
  experience: string
  skills: string[]
  avatarUrl: string | null
  specialization?: string | null
}

export interface CandidateSearchResponse {
  candidates: CandidateSearchItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateTeamPayload {
  name: string
  description?: string
  specialization?: string
  generalProgram?: string
  semiSpecialProgram?: string
  achievements?: string
}

export interface UpdateTeamPayload {
  name?: string
  description?: string
  specialization?: string
  generalProgram?: string
  semiSpecialProgram?: string
  achievements?: string
}

export interface InviteMemberPayload {
  candidateId?: number
  candidateUserId?: string
  role?: string
  message?: string
}



