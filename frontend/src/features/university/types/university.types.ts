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
  thesis_campaigns_count?: number
  incubator_ventures_count?: number
  coop_students_count?: number
}

export interface StudentAcademicVerification {
  id: number | null
  status: "verified" | "pending" | "rejected" | "unrequested"
  verification_code: string | null
  verified_at: string | null
  verified_by?: string | null
  notes?: string | null
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

// ==============================================================================
// RESEARCH & INNOVATION MARKETING CAMPAIGNS TYPES
// ==============================================================================

export interface UniversityThesisCampaign {
  id: number
  university_id: number
  university_name_ar: string
  university_name_en?: string
  university_logo?: string | null
  university_location?: string
  researcher_name: string
  researcher_title: string
  researcher_email?: string
  researcher_img?: string
  customer_id?: number | null
  thesis_title: string
  thesis_type: string
  department: string
  supervisor_name?: string
  summary: string
  commercial_readiness_level: string
  target_audience: string
  tags: string[]
  banner_url?: string
  university_logo_endorsed: boolean
  endorsement_text: string
  views_count: number
  inquiries_count: number
  sponsorship_leads: number
  status: "active" | "draft" | "completed" | "published" | "approved" | "pending_review" | "rejected" | string
  created_at?: string
}

export interface CreateThesisCampaignPayload {
  thesis_title: string
  researcher_name: string
  researcher_title?: string
  researcher_email?: string
  researcher_img?: string
  thesis_type?: string
  department?: string
  supervisor_name?: string
  summary: string
  commercial_readiness_level?: string
  target_audience?: string
  tags?: string[] | string
  banner_url?: string
  endorsement_text?: string
}

// ==============================================================================
// MONSHA'AT INCUBATOR & ENTREPRENEURSHIP SHOWCASE TYPES
// ==============================================================================

export interface UniversityIncubatorVenture {
  id: number
  university_id: number
  university_name: string
  incubator_name: string
  company_name_ar: string
  company_name_en?: string
  logo?: string
  founder_name: string
  founder_major: string
  founder_graduation_year?: string
  graduation_cohort: string
  business_activity: string
  products_and_services: string
  status: string
  jobs_created: number
  funding_raised_sar: number
  university_criteria_connection: string
  academic_material_updates: string
  created_at?: string
}

export interface IncubatorInfo {
  incubator_name: string
  university_name?: string
  active_cohort?: string
  location: string
  total_graduated_entrepreneurs: number
  active_startups_count: number
  total_jobs_created: number
  total_funding_raised_sar: number
  criteria_compliance_score: string
}

export interface IncubatorShowcaseResponse {
  success: boolean
  incubator_info: IncubatorInfo
  ventures: UniversityIncubatorVenture[]
}

export interface CreateIncubatorVenturePayload {
  company_name_ar: string
  company_name_en?: string
  founder_name: string
  founder_major?: string
  founder_graduation_year?: string
  graduation_cohort?: string
  business_activity: string
  products_and_services: string
  status?: string
  jobs_created?: number
  funding_raised_sar?: number
  university_criteria_connection?: string
  academic_material_updates?: string
  logo?: string
}

// ==============================================================================
// COOPERATIVE TRAINING & PROFESSOR SUPERVISION TYPES
// ==============================================================================

export interface CoopSupervisedStudent {
  id: number
  university_id: number
  professor_id: string
  professor_name: string
  professor_title: string
  professor_email: string
  professor_department: string
  student_name: string // الاسم الكامل للطالب
  student_id_number: string // الرقم الجامعي
  student_major: string // التخصص
  company_name: string // اسم الشركة التي يتدرب فيها
  company_location: string // موقع الشركة الجغرافي
  partnership_location?: string // مقر الشراكة والتدريب
  trainer_name: string // اسم المدرب الميداني بالشركة / المشرف المهني
  trainer_specialization: string // تخصص المدرب الميداني
  job_title?: string // المسمى الوظيفي للمتدرب
  work_start_time?: string // وقت بدء العمل
  work_end_time?: string // وقت انتهاء العمل
  trainer_phone?: string
  trainer_email?: string
  training_start_date?: string
  training_end_date?: string
  total_required_hours: number
  completed_hours: number
  progress_percentage: number
  midterm_score?: number | null
  final_score?: number | null
  status: string
  notes?: string
  created_at?: string
}

export interface ProfessorSupervisionScheduleItem {
  id: number
  university_id: number
  supervision_id?: number
  professor_id: string
  date_time: string
  event_type: string
  student_name: string
  company_name: string
  location: string
  status: string
  notes?: string
}

export interface ProfessorInfo {
  professor_id: string
  name: string
  title: string
  email: string
  department: string
  university_name: string
  supervised_students_count: number
  active_companies_count: number
  pending_evaluations_count: number
  scheduled_visits_count: number
}

export interface CoopSupervisionResponse {
  success: boolean
  professor: ProfessorInfo
  students: CoopSupervisedStudent[]
  schedules: ProfessorSupervisionScheduleItem[]
}

export interface CreateCoopStudentPayload {
  student_name: string
  student_id_number?: string
  student_major: string
  company_name: string
  company_location: string
  partnership_location?: string
  trainer_name: string
  trainer_specialization: string
  job_title?: string
  work_start_time?: string
  work_end_time?: string
  trainer_phone?: string
  trainer_email?: string
  total_required_hours?: number
  completed_hours?: number
  notes?: string
}

export interface UpdateCoopStudentPayload extends Partial<CreateCoopStudentPayload> {
  status?: string
}

export interface CoopEvaluationPayload {
  midterm_score?: number
  final_score?: number
  completed_hours?: number
  status?: string
  notes?: string
}

export interface CreateCoopSchedulePayload {
  supervision_id?: number
  date_time: string
  event_type: string
  student_name: string
  company_name: string
  location: string
  status?: string
  notes?: string
}

// ==============================================================================
// GRADUATE EMPLOYMENT & LABOR MARKET PERFORMANCE INDICATORS TYPES
// ==============================================================================

export interface DepartmentEmploymentRate {
  department: string
  rate: number
  graduates_count: number
  employed_count: number
  avg_salary: number
}

export interface SalaryBracketItem {
  bracket: string
  percentage: number
  color: "amber" | "sky" | "indigo" | "emerald"
  count: number
}

export interface SpecializationSalaryItem {
  specialization: string
  avg_salary: number
  range: string
  demand_level: string
}

export interface UnemploymentDurationItem {
  duration: string
  percentage: number
  description: string
  count: number
}

export interface GraduateEmploymentKPIs {
  success: boolean
  institution_name: string
  overall_metrics: {
    in_field_employment_rate: number
    out_of_field_employment_rate: number
    total_graduates_surveyed: number
    total_employed: number
    national_rank_employability: string
    vision_2030_target: number
    gap_to_target: string
    performance_status: string
  }
  department_rates: DepartmentEmploymentRate[]
  salary_metrics: {
    overall_average_starting_sar: number
    median_starting_sar: number
    salary_brackets: SalaryBracketItem[]
    by_specialization: SpecializationSalaryItem[]
  }
  unemployment_duration: {
    average_months_to_employment: number
    distribution: UnemploymentDurationItem[]
  }
  labor_market_status: {
    employed_in_field_pct: number
    employed_adjacent_pct: number
    actively_seeking_work_pct: number
    continuing_higher_education_pct: number
    actively_seeking_count: number
    higher_education_count: number
  }
  performance_indicators: {
    ncaaa_standard_score: string
    employer_satisfaction_rate: string
    graduate_skills_alignment: string
  }
}

export interface AcademicUpdateItem {
  id: number
  title_ar: string
  title_en: string
  title_hi?: string
  category: "curriculum" | "new_programs" | "research_achievement" | "faculty_achievement" | "student_achievement" | "university_announcement"
  department: string
  date: string
  description_ar: string
  description_en: string
  description_hi?: string
  image?: string
}

export interface CampaignAnalyticsData {
  total_campaigns: number
  published_campaigns: number
  corporate_views: number
  partnership_leads: number
  sponsorship_requests: number
  licensing_requests: number
  pilot_trial_requests: number
  conversion_rate: number
  by_department: { department: string; leads: number; views: number }[]
  by_trl: { level: string; count: number; percentage: number }[]
}

export interface CorporatePartnerRequestPayload {
  campaign_id: number
  request_type: "partnership" | "sponsorship" | "licensing" | "pilot_trial"
  organization_name: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  proposed_budget_sar?: number
  message?: string
}
