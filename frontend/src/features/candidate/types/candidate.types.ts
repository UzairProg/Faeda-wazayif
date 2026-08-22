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
