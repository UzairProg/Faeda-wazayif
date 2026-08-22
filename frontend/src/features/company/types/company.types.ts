/**
 * features/company/types/company.types.ts
 *
 * Core TypeScript definitions for the Authenticated Company Workspace.
 */

export interface CompanyCompletenessItem {
  id: string
  title_ar: string
  title_en: string
  isCompleted: boolean
  weight: number
}

export interface CompanyCompleteness {
  percentage: number
  isComplete: boolean
  items: CompanyCompletenessItem[]
  completedCount: number
  totalCount: number
}

export interface CompanyMetrics {
  projectSize: number
  numberOfProjects: number
  successRate: number
  profitPercentage: number
  intellectualProperty: number
  reputation: string
  servicesProvided: string
  socialImpact: string
}

export interface CompanyProfile {
  id: number
  name: string
  arabicName: string
  englishName: string
  faedaName: string
  email: string
  mobile: string
  descriptionAr: string
  descriptionEn: string
  country: string
  state: string
  location: string
  englishAddress: string
  companyType: string
  companySize: string
  companyField: string
  hrName: string
  hrMobile: string
  hrEmail: string
  website: string
  twitter: string
  instagram: string
  logoUrl: string | null
  isVerified: boolean
  verifiedAt: string | null
  status: string
  createdAt: string | null
  completeness: CompanyCompleteness
  metrics: CompanyMetrics
}

export interface CompanySummary {
  id: string
  name: string
  arabicName?: string
  englishName?: string
  faedaName?: string
  logoUrl: string | null
  description?: string
  location: string
  country: string
  companyType?: string
  companySize?: string
  companyField?: string
  website?: string
  twitter?: string
  instagram?: string
  isVerified: boolean
  verifiedAt?: string | null
  openJobsCount: number
  createdAt?: string | null
}

export interface CompanyStats {
  totalJobs: number
  activeJobs: number
  pendingJobs: number
  draftJobs: number
  closedJobs: number
  totalApplicants: number
  underReview: number
  shortlisted: number
  interview: number
  accepted: number
  rejected: number
  teamOffers: number
}

export interface RecentApplicationItem {
  id: number
  status: "applied" | "under_review" | "shortlisted" | "interview" | "accepted" | "rejected"
  statusRaw: string
  appliedAt: string | null
  job: {
    id: number
    title: string
  }
  candidate: {
    id: number
    userId: string
    name: string
    headline: string
    avatarUrl: string | null
    isVerified: boolean
  }
}

export interface CompanyJob {
  id: number
  title: string
  jobType: string
  town: string
  location: string
  companyAbout?: string
  description: string
  specialization: string
  skillsYears: string
  educationalQualification: string
  workplace: string
  workdays?: string
  restDays?: string
  workHours?: string
  languages: string[]
  salary: {
    min: number | null
    max: number | null
    isDisclosed: boolean
    currency: string
  }
  requiredSkills: string[]
  preferredWorkStyle?: string
  status: "approved" | "pending" | "draft" | "closed" | "archived"
  category: string
  isFeatured: boolean
  datePosted: string | null
  applicantsCount: number
  shortlistedCount: number
  interviewCount: number
  acceptedCount: number
}

export interface CompanyDashboardData {
  company: CompanySummary
  profileCompleteness: CompanyCompleteness
  stats: CompanyStats
  recentApplications: RecentApplicationItem[]
  recentJobs: CompanyJob[]
}

export interface CompanyJobsResponse {
  jobs: CompanyJob[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateJobPayload {
  title: string
  description: string
  specialization: string
  jobType: string
  town: string
  companyAbout?: string
  skillsYears?: string
  educationalQualification?: string
  workplace?: string
  workdays?: string
  restDays?: string
  workHours?: string
  languages?: string[] | string
  requiredSkills?: string[] | string
  salaryMin?: number | null
  salaryMax?: number | null
  category?: string
  status?: string
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {}

export interface UpdateCompanyProfilePayload {
  arabicName?: string
  englishName?: string
  faedaName?: string
  descriptionAr?: string
  descriptionEn?: string
  country?: string
  state?: string
  englishAddress?: string
  companyType?: string
  companySize?: string
  companyField?: string
  hrName?: string
  hrMobile?: string
  hrEmail?: string
  website?: string
  twitter?: string
  instagram?: string
  metrics?: Partial<CompanyMetrics>
}

export interface CompanyApplicationItem {
  id: number
  status: "applied" | "under_review" | "shortlisted" | "interview" | "accepted" | "rejected"
  statusRaw: string
  note?: string
  appliedAt: string | null
  job: {
    id: number
    title: string
    specialization: string
    town: string
    workplace: string
  }
  candidate: CompanyTalentItem
}

export interface CompanyApplicationsResponse {
  applications: CompanyApplicationItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CompanyTalentItem {
  id: number
  userId: string
  name: string
  headline: string
  about: string
  avatarUrl: string | null
  location: string
  country: string
  city: string
  yearsOfExperience: string
  education: {
    qualification: string
    status: string
    university: string
    department: string
    graduationDate: string | null
    gpa: string
  }
  workType: string
  workStyle: string
  skills: string[]
  isVerified: boolean
  visibility: string
  marketBenchmark: {
    score: number
    tier: string
    salaryMin: number
    salaryMax: number
    averageSalary: number
    currency: string
  } | null
  projectsCount: number
  certificationsCount: number
}

export interface CompanyTalentDetail extends CompanyTalentItem {
  projects?: Array<{
    id?: string | number
    title: string
    description?: string
    role?: string
    url?: string
    technologies?: string[]
  }>
  certifications?: Array<{
    id?: string | number
    name: string
    issuer?: string
    year?: string
  }> | string[]
  cvUrl?: string | null
}

export interface CompanyTalentResponse {
  talent: CompanyTalentItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CompanyTeamItem {
  id: number
  name: string
  about: string
  achievements: string
  specialization: string
  generalProgram?: string
  specialProgram?: string
  logoUrl: string | null
  memberCount: number
  capabilities: string[]
  memberDerivedCapabilities: string[]
  members: Array<{
    id: number
    name: string
    headline: string
    avatarUrl: string | null
    yearsOfExperience: string
    education?: string
    isVerified: boolean
  }>
  creationDate: string | null
}

export interface CompanyTeamsResponse {
  teams: CompanyTeamItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
