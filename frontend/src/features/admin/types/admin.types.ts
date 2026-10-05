/**
 * features/admin/types/admin.types.ts
 *
 * TypeScript types for the Faeda Admin Governance Console.
 */

export interface AdminUserIdentity {
  id: number
  username: string
  email: string
  role: string
  role_label?: string
}

export interface AdminDashboardStats {
  total_users: number
  total_candidates: number
  suspended_candidates: number
  total_companies: number
  verified_companies: number
  pending_companies: number
  total_universities: number
  total_teams: number
  total_jobs: number
  active_jobs: number
  pending_jobs: number
  total_reports: number
  pending_reports: number
  total_subscriptions: number
}

export interface AdminPendingJob {
  id: number
  title: string
  company_id: number
  company_name: string
  company_logo: string | null
  town: string
  job_type: string
  created_at: string | null
}

export interface AdminAuditLog {
  id: number
  admin_name: string
  admin_role?: string | null
  action: string
  action_label: string
  target_type: string | null
  target_type_label: string
  target_id: number | null
  details: Record<string, any>
  ip_address: string | null
  created_at: string | null
}

export interface AdminReport {
  id: number
  reporter_type: string
  reporter_id: number
  reporter_name: string
  target_type: string
  target_id: number
  target_name: string
  reason: string
  reason_label?: string
  description: string | null
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  status_label?: string
  admin_notes?: string | null
  created_at: string | null
}

export interface AdminDashboardData {
  success: boolean
  admin: AdminUserIdentity
  stats: AdminDashboardStats
  pending_jobs: AdminPendingJob[]
  recent_logs: AdminAuditLog[]
  recent_reports: AdminReport[]
}

export interface AdminUser {
  id: number
  type: 'candidate' | 'company' | 'university' | 'admin'
  name: string
  email: string
  mobile?: string | null
  location?: string
  status: 'active' | 'suspended' | 'banned'
  is_verified: boolean
  created_at?: string | null
  avatar?: string | null
  admin_role?: string
  admin_role_label?: string
}

export interface AdminUsersResponse {
  success: boolean
  users: AdminUser[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AdminJob {
  id: number
  title: string
  company_id: number
  company_name: string
  company_logo?: string | null
  job_type: string
  town: string
  specialization: string
  educational_qualification: string
  skills_years: string
  status: 'approved' | 'pending' | 'rejected' | 'archived' | 'closed'
  is_featured: boolean
  salary_min?: number | null
  salary_max?: number | null
  applicants_count: number
  created_at?: string | null
}

export interface AdminJobsResponse {
  success: boolean
  jobs: AdminJob[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AdminAuditLogsResponse {
  success: boolean
  logs: AdminAuditLog[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AdminReportsResponse {
  success: boolean
  reports: AdminReport[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AdminSettingItem {
  key: string
  label: string
  type: string
  value: string
}

export interface AdminSettingsResponse {
  success: boolean
  settings: Record<string, AdminSettingItem>
}

export interface AdminTicket {
  id: number
  email: string
  subject: string
  description: string
  status: 'open' | 'closed'
  admin_reply?: string | null
  created_at: string | null
}

export interface AdminTicketsResponse {
  success: boolean
  tickets: AdminTicket[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AdminCategoryItem {
  id: number
  name_ar: string
  name_en: string
  icon?: string | null
  is_active: boolean
  sort_order?: number
}

export interface AdminFilterItem {
  id: number
  name_ar: string
  name_en?: string | null
  is_active: boolean
}

export interface AdminCategoriesResponse {
  success: boolean
  categories: AdminCategoryItem[]
  cities: AdminFilterItem[]
  job_types: AdminFilterItem[]
}

