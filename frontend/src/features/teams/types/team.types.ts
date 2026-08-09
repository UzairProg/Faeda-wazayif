/**
 * features/teams/types/team.types.ts
 *
 * Types for the public Team Marketplace module.
 * Maps directly to backend API responses from /api/v1/teams.
 */
import type { Job } from "@/features/jobs/types/job.types"

export interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl?: string | null
  skills: string[]
}

export interface Team {
  id: string
  name: string
  about?: string
  achievements?: string
  generalProgram?: string | null
  semiSpecialProgram?: string | null
  specialProgram?: string | null
  logoUrl?: string | null
  memberCount: number
  capabilities: string[]
  location: string
  isRemote: boolean
  creationDate?: string | null
}

export interface TeamDetail extends Team {
  members: TeamMember[]
  jobs: Job[]
}

export interface TeamFilter {
  query?: string
  location?: string
  page?: number
  pageSize?: number
}

export interface TeamListResponse {
  teams: Team[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TeamSuggestion {
  id: string
  label: string
  subLabel?: string
  category: string
  value: string
  location?: string
}
