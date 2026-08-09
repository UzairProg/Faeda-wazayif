/**
 * features/companies/types/company.types.ts
 *
 * Types for the public Companies module.
 * Maps directly to backend API responses from /api/v1/companies.
 */
import type { Job } from "@/features/jobs/types/job.types"

export interface Company {
  id: string
  name: string
  arabicName?: string | null
  englishName?: string | null
  faedaName?: string | null
  logoUrl?: string | null
  description?: string
  location?: string
  country?: string
  companyType?: string | null
  companySize?: string | null
  companyField?: string | null
  website?: string | null
  twitter?: string | null
  instagram?: string | null
  isVerified: boolean
  verifiedAt?: string | null
  openJobsCount: number
  createdAt?: string | null
}

export interface CompanyDetail extends Company {
  jobs: Job[]
}

export interface CompanyFilter {
  query?: string
  location?: string
  verified?: boolean
  hasJobs?: boolean
  page?: number
  pageSize?: number
}

export interface CompanyListResponse {
  companies: Company[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CompanySuggestion {
  id: string
  label: string
  subLabel?: string
  category: string
  value: string
  location?: string
}
