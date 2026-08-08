/**
 * features/jobs/types/job.types.ts
 *
 * TypeScript types for the Jobs module.
 * These types reflect what the Faeda Jobs Flask backend
 * currently stores (per FAEDA_JOBS_FINAL_ROADMAP.md §3.2).
 *
 * Backend note: The current backend uses Arabic-text status values
 * and a single-user company model. These types target the roadmap's
 * intended API contract, not the current Jinja-only routes.
 */

/**
 * Work arrangement type — aligns with roadmap filter dimensions.
 */
export type WorkType = "full_time" | "part_time" | "contract" | "remote" | "hybrid"

/**
 * Experience level — roadmap filter dimension.
 */
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive"

/**
 * Job status in the employer lifecycle.
 * Roadmap: draft → published → paused → closed → archived
 * Note: Current backend only has pending/approved. This is the target model.
 */
export type JobStatus = "draft" | "published" | "paused" | "closed" | "archived"

/**
 * Salary disclosure object.
 * The roadmap requires salary transparency to be optional — never fabricated.
 */
export interface SalaryRange {
  min: number
  max: number
  currency: "SAR" | "USD"
  period: "monthly" | "yearly"
  isDisclosed: boolean
}

/**
 * Company summary embedded in a job card/detail.
 * Full company data lives in the companies module.
 */
export interface JobCompany {
  id: string
  name: string
  logoUrl: string | null
  location: string | null
  /** Whether company has passed platform verification — never fabricated */
  isVerified: boolean
}

/**
 * Core Job entity as returned by the API list endpoint.
 */
export interface Job {
  id: string
  title: string
  company: JobCompany
  location: string
  isRemote: boolean
  workType: WorkType
  experienceLevel: ExperienceLevel
  skills: string[]
  salary: SalaryRange | null
  postedAt: string        // ISO 8601
  updatedAt: string       // ISO 8601
  status: JobStatus
  isTeamFriendly: boolean
  /** Short description shown on cards */
  excerpt: string | null
}

/**
 * Full job detail with description, responsibilities, requirements.
 */
export interface JobDetail extends Job {
  description: string
  responsibilities: string[]
  requirements: string[]
  applicationDeadline: string | null
  applicationCount: number | null  // May be null if company opts out
}

/**
 * Filter parameters for job search.
 * Designed to be extensible — adding new filters doesn't break existing ones.
 */
export interface JobFilter {
  query?: string
  location?: string
  workType?: WorkType[]
  experienceLevel?: ExperienceLevel[]
  hasDisclosedSalary?: boolean
  companyId?: string
  isTeamFriendly?: boolean
  page?: number
  pageSize?: number
}

/**
 * Paginated jobs list response from the API.
 */
export interface JobListResponse {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * API state for jobs — used with TanStack Query.
 */
export type JobsQueryState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "unavailable" }  // Backend not yet returning JSON
  | { status: "success"; data: JobListResponse }
