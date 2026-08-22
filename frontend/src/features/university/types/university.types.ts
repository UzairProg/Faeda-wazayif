/**
 * features/university/types/university.types.ts
 *
 * Core domain types and interfaces for the University / Educational Institution Workspace.
 */

export interface UniversityCompletenessChecklist {
  key: string
  label_ar: string
  is_completed: boolean
}

export interface UniversityCompleteness {
  percentage: number
  completed_factors: number
  total_factors: number
  checklist: UniversityCompletenessChecklist[]
}

export interface UniversityProfile {
  id: number
  name_ar: string
  name_en: string
  name: string
  email: string
  description_ar: string
  description_en: string
  location: string
  country: string
  website: string
  logo: string
  institution_type: string
  qs_rank: string
  phone: string
  dean_name: string
  career_center_email: string
  is_verified: boolean
  verified_at: string | null
  status: string
  completeness: UniversityCompleteness
}

export interface UpdateUniversityProfilePayload {
  name_ar?: string
  name_en?: string
  description_ar?: string
  description_en?: string
  location?: string
  country?: string
  website?: string
  institution_type?: string
  qs_rank?: string
  phone?: string
  dean_name?: string
  career_center_email?: string
}

export interface UniversityStats {
  total_students: number
  graduates_count: number
  verified_count: number
  pending_verifications: number
  departments_count: number
  academic_projects_count: number
  career_opportunities_count: number
}

export interface StudentAcademicVerification {
  id: number | null
  status: "verified" | "pending" | "rejected" | "unrequested"
  verification_code: string | null
  verified_at: string | null
  verified_by?: string | null
  notes: string | null
}

export interface UniversityStudentItem {
  id: number
  user_id: string
  fullname: string
  img: string
  educational_qualification: string
  department: string
  university: string
  graduation_date: string
  education_statue: string
  gpa: string
  preferred_field: string
  work_type: string
  skills: string[]
  projects_count: number
  has_cv: boolean
  career_readiness: number
  verification: StudentAcademicVerification
}

export interface UniversityStudentDetail {
  id: number
  user_id: string
  fullname: string
  img: string
  about: string
  location: string
  preferred_field: string
  work_type: string
  years_of_skills: string
  academic_profile: {
    degree: string
    university: string
    department: string
    graduation_date: string
    status: string
    gpa: string
  }
  skills: string[]
  projects: {
    id: number
    project_name: string
    project_size: string
    description: string
    project_url: string
    created_at: string | null
  }[]
  certifications: {
    id: number
    cert_name: string
    issuing_org: string
    issue_year: number | null
    credential_url: string
  }[]
  has_cv: boolean
  career_readiness: number
  market_benchmark: {
    score: number
    tier: string
    salary_range: {
      min?: number
      max?: number
      avg?: number
    }
    specialization: string
  } | null
  verification: StudentAcademicVerification
}

export interface VerificationQueueItem {
  id: number
  customer_id: number
  student_user_id: string
  student_name: string
  student_img: string
  degree: string
  department: string
  graduation_year: string
  gpa: string
  status: "pending" | "verified" | "rejected"
  verification_code: string | null
  notes: string
  requested_at: string | null
  verified_at: string | null
  verified_by: string
}

export interface UniversityDepartmentItem {
  id: number
  name_ar: string
  name_en: string
  faculty: string
  degree_levels: string
  description: string
  candidates_count: number
  verified_count: number
  created_at: string | null
}

export interface CreateDepartmentPayload {
  name_ar: string
  name_en?: string
  faculty?: string
  degree_levels?: string
  description?: string
}

export interface UniversityOpportunityItem {
  id: number
  title: string
  company_name: string
  company_logo: string | null
  location: string
  work_type: string
  experience_level: string
  salary_range: string
  skills: string[]
  date_posted: string | null
}

export interface UniversityDashboardData {
  success: boolean
  institution: UniversityProfile
  stats: UniversityStats
  recent_students: UniversityStudentItem[]
  recent_verifications: VerificationQueueItem[]
}

export interface StudentFilterParams {
  q?: string
  department?: string
  qualification?: string
  graduation_year?: string
  status?: string
  verification_status?: string
  page?: number
  page_size?: number
}
