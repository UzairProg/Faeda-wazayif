/**
 * features/market-insights/types/market-insights.types.ts
 *
 * TypeScript types and interfaces for the Talent & Market Insights module.
 * Covers Job Seeker, Company, University, Market Trends, and Admin benchmarking.
 * Strictly adheres to non-worth terminology (Salary Benchmark, Market Position).
 */

export interface SalaryBreakdownItem {
  experience_tier?: string
  location?: string
  salary_range_sar: string
  salary_range_lpa: string
  avg_salary_sar: number
}

export interface SalaryBenchmark {
  role: string
  specialization?: string
  skills?: string[]
  experience_years?: number
  location?: string
  industry?: string
  currency: string
  salary_min: number
  salary_max: number
  average_salary: number
  median_salary: number
  formatted_salary_sar: string
  formatted_salary_lpa: string
  experience_breakdown: SalaryBreakdownItem[]
  location_breakdown: SalaryBreakdownItem[]
  demand_level: "Critical" | "High" | "Medium" | "Low" | string
  talent_availability: "Very Scarce" | "Scarce" | "Moderate" | "High" | string
  hiring_competition: "High" | "Medium" | "Low" | string
  data_source: string
  source_url?: string
  data_date: string
  last_updated: string
  is_demo: boolean
}

export interface SkillInsight {
  skill: string
  demand_level: "Critical" | "High" | "Medium" | "Low" | string
  demand_score: number
  salary_benchmark: string
  salary_benchmark_lpa?: string
  market_trend: "Surging" | "Strong Growth" | "High & Rising" | "Steady" | "Moderate" | string
  growth_percentage: number
  related_job_roles: string[]
  top_locations?: string[]
}

export interface CandidateMarketInsight {
  candidate_id?: string | number
  candidate_name?: string
  job_role: string
  specialization: string
  experience_years: number
  preferred_location: string
  education?: string
  skills: string[]
  estimated_salary_min: number
  estimated_salary_max: number
  average_salary: number
  currency: string
  formatted_salary_sar: string
  formatted_salary_lpa: string
  matching_roles: string[]
  skill_match_percentage: number
  skill_demand: string
  industry_demand: string
  market_position: string
  profile_strength: number
  skills_analysis: SkillInsight[]
  salary_by_experience: SalaryBreakdownItem[]
  salary_by_location: SalaryBreakdownItem[]
  recommended_skills: string[]
  market_trends_summary: {
    salary_growth_yoy: string
    hiring_velocity: string
    top_industry: string
    market_outlook: string
  }
  data_source: string
  data_date: string
  last_updated: string
  is_demo: boolean
}

export interface CompanyHiringRole {
  job_id: number | null
  job_role: string
  specialization: string
  required_skills: string[]
  experience_required: string
  location: string
  openings: number
  salary_min: number
  salary_max: number
  average_salary: number
  currency: string
  talent_availability: string
  skill_demand: string
  hiring_competition: string
  estimated_annual_hiring_cost: number
  formatted_salary_sar: string
  formatted_salary_lpa: string
  data_source: string
  last_updated: string
  is_demo: boolean
}

export interface RequestedSkillItem {
  skill: string
  count: number
  demand: string
  availability: string
}

export interface HardToFindSkillItem {
  skill: string
  count: number
  scarcity: string
  rec_action: string
}

export interface CandidateExperienceItem {
  tier: string
  percentage: number
  candidate_count: number
}

export interface LocationTalentItem {
  location: string
  candidate_count: number
  percentage: number
}

export interface CompanyTalentRequirements {
  most_requested_skills: RequestedSkillItem[]
  hard_to_find_skills: HardToFindSkillItem[]
  candidate_experience_distribution: CandidateExperienceItem[]
  location_wise_talent: LocationTalentItem[]
}

export interface CompanyHiringInsightResponse {
  hiring_roles: CompanyHiringRole[]
  talent_requirements: CompanyTalentRequirements
  total_openings: number
  data_source: string
  data_date: string
  last_updated: string
  is_demo: boolean
}

export interface MatchingCandidate {
  id: number | string
  fullname: string
  user_id: string
  job_role: string
  specialization: string
  experience_years: string | number
  location: string
  is_verified: boolean
  educational_qualification: string
  avatar: string
}

export interface UniversityGraduateInsight {
  university_name: string
  graduate_employment_rate: {
    overall_rate: number
    in_field_employment: number
    out_of_field_employment: number
    benchmark_vision_2030: number
    performance_status: string
  }
  common_job_roles: Array<{
    role: string
    graduates_count: number
    employment_rate: number
    avg_starting_salary: string
  }>
  average_salary_ranges: Array<{
    bracket: string
    percentage: number
    count: number
  }>
  top_hiring_industries: Array<{
    industry: string
    percentage: number
    hires: number
  }>
  top_hiring_companies: Array<{
    company: string
    graduates_hired: number
    sector: string
  }>
  most_demanded_skills: Array<{
    skill: string
    hiring_mentions: number
    demand_level: string
  }>
  placement_trends: {
    avg_time_to_hire_months: number
    internship_to_job_conversion_rate: number
    accredited_partner_companies: number
  }
  location_wise_employment: Array<{
    city: string
    percentage: number
  }>
  data_source: string
  data_date: string
  last_updated: string
  privacy_compliance: string
  is_demo: boolean
}

export interface MarketTrendsData {
  salary_trends_by_role: Array<{
    role: string
    salary_2024: number
    salary_2025: number
    salary_2026: number
    growth_rate: string
  }>
  salary_trends_by_experience: Array<{
    experience: string
    salary_sar: number
    salary_lpa: string
  }>
  salary_trends_by_location: Array<{
    location: string
    index: number
    avg_salary_sar: number
  }>
  skill_demand_trends: Array<{
    skill: string
    demand_index: number
    trend: string
    yoy_change: string
  }>
  emerging_skills: Array<{
    skill: string
    category: string
    surge_multiplier: string
  }>
  industry_demand: Array<{
    industry: string
    hiring_share: number
    growth: string
  }>
  data_source: string
  data_date: string
  last_updated: string
  is_demo: boolean
}

export interface AdminBenchmarkItem {
  id: number
  role: string
  specialization: string
  skills: string[]
  industry: string
  location: string
  experience_min: number
  experience_max: number
  salary_min: number
  salary_max: number
  average_salary: number
  median_salary: number
  currency: string
  demand_level: string
  talent_availability: string
  hiring_competition: string
  source: string
  source_url?: string
  is_demo: boolean
  data_date: string
  last_updated: string
}
