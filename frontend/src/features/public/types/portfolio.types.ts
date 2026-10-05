/**
 * portfolio.types.ts — Public Candidate Portfolio domain types.
 */

export interface PortfolioEducation {
  qualification: string
  university: string
  department: string
  graduationDate: string | null
  gpa: string
  status: string
}

export interface PortfolioProject {
  id: number
  project_name: string
  description: string
  project_url: string
  technologies?: string[]
  created_at: string | null
}

export interface PortfolioCertification {
  id: number
  cert_name: string
  issuing_org: string
  issue_month?: number | null
  issue_year?: number | null
  expiry_month?: number | null
  expiry_year?: number | null
  no_expiry?: boolean
  credential_id?: string
  credential_url?: string
  created_at?: string | null
}

export interface PortfolioStats {
  projectsCount: number
  certificationsCount: number
  skillsCount: number
  completionRate: number
}

export interface CandidatePublicPortfolio {
  id: number
  userId: string
  fullName: string
  headline: string
  title?: string
  about: string
  bio?: string
  email?: string | null
  mobile?: string | null
  country: string
  government: string
  location?: string
  avatarUrl?: string | null
  isVerified: boolean
  verifiedAt?: string | null
  education: PortfolioEducation
  experienceYears: string
  preferredField: string
  workType: string
  workStyle: string
  expectedSalary?: number | null
  cvUrl?: string | null
  skills: string[]
  languages: string[]
  projects: PortfolioProject[]
  certifications: PortfolioCertification[]
  atsScore: number
  stats: PortfolioStats
  visibility: "public" | "employers_only" | "private"
  isOwner?: boolean
  isPrivate?: boolean
  message?: string
}

export interface CandidateContactPayload {
  candidateId: number | string
  senderName: string
  senderEmail: string
  companyName?: string
  subject: string
  message: string
  opportunityType?: "full_time" | "part_time" | "contract" | "team_invite" | "inquiry"
}
