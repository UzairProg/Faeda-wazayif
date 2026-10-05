/**
 * features/campaigns/types/campaign.types.ts
 *
 * Types for the LinkedIn-style Hiring & Recruitment Campaign System.
 */

export type CampaignStage =
  | "discovered"
  | "contacted"
  | "replied"
  | "interviewing"
  | "offered"
  | "hired"
  | "rejected"

export interface CampaignCandidateInfo {
  id: number
  user_id?: string
  fullname: string
  email?: string
  mobile?: string
  img?: string | null
  title?: string
  location?: string
  years_of_experience?: string
  skills?: string[]
  expected_salary?: number | null
  is_verified?: boolean
}

export interface CampaignCandidate {
  id: number
  campaign_id: number
  customer_id: number
  match_score: number // 0 - 100%
  stage: CampaignStage
  notes?: string | null
  outreach_sent_at?: string | null
  last_activity_at?: string | null
  candidate: CampaignCandidateInfo
}

export interface CampaignStats {
  total_talent: number
  contacted: number
  replied: number
  interviewing: number
  hired: number
  response_rate: number // %
}

export interface Campaign {
  id: number
  company_id: number
  company_name: string
  company_arabic_name?: string
  company_logo?: string | null
  title: string
  tagline?: string
  description?: string
  banner_url?: string
  target_roles: string[]
  target_skills: string[]
  target_location?: string
  experience_level?: string
  work_type?: string
  min_salary?: number | null
  max_salary?: number | null
  status: "active" | "paused" | "completed"
  outreach_template?: string
  start_date?: string
  end_date?: string
  created_at?: string
  stats?: CampaignStats
}

export interface CampaignJob {
  id: number
  job_id: number
  title: string
  location?: string
  work_type?: string
  salary?: string | null
}

export interface CreateCampaignPayload {
  title: string
  tagline?: string
  description?: string
  banner_url?: string
  target_roles: string[] | string
  target_skills: string[] | string
  target_location?: string
  experience_level?: string
  work_type?: string
  min_salary?: number
  max_salary?: number
  outreach_template?: string
}

export interface CandidateInvite {
  id: number
  campaign_id: number
  campaign_title: string
  company_name: string
  company_logo?: string | null
  match_score: number
  stage: CampaignStage
  tagline?: string
  location?: string
  salary_range?: string | null
  outreach_sent_at?: string | null
}
