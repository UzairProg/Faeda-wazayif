/**
 * ROUTES — Canonical route constants for Faeda Jobs.
 *
 * Structure:
 *   PUBLIC    — Marketing, discovery, jobs browsing (unauthenticated)
 *   AUTH      — Login, register, password reset (unauthenticated)
 *   JOBS      — Public job search and detail
 *   COMPANIES — Public company directory and detail
 *   TEAMS     — Public team directory and detail
 *   CANDIDATE — Authenticated candidate command center (/candidate/*)
 *   COMPANY   — Authenticated employer command center (/company/*)
 *   ADMIN     — Authenticated admin console (/admin/*)
 */
export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    HOW_IT_WORKS: "/how-it-works",
    ABOUT: "/about",
    CONTACT: "/contact",
    RESOURCES: "/resources",
    PRIVACY: "/privacy",
    TERMS: "/terms",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY: "/auth/verify",
    ROLE_SELECT: "/auth/role",
  },
  JOBS: {
    LIST: "/jobs",
    DETAIL: (id: string) => `/jobs/${id}`,
  },
  COMPANIES: {
    LIST: "/companies",
    DETAIL: (id: string) => `/companies/${id}`,
  },
  TEAMS: {
    LIST: "/teams",
    DETAIL: (id: string) => `/teams/${id}`,
  },
  PORTFOLIO: {
    PUBLIC: (username: string) => `/portfolio/${username}`,
  },
  POSTS: {
    LIST: "/posts",
    DETAIL: (id: string) => `/posts/${id}`,
  },
  CANDIDATE: {
    ROOT: "/candidate",
    DASHBOARD: "/candidate/dashboard",
    PROFILE: "/candidate/profile",
    CV: "/candidate/cv",
    MARKET_VALUE: "/candidate/market-value",
    JOBS: "/candidate/opportunities",
    OPPORTUNITIES: "/candidate/opportunities",
    JOB_DETAIL: (id: string | number) => `/candidate/jobs/${id}`,
    APPLICATIONS: "/candidate/applications",
    APPLICATION_DETAIL: (id: string | number) => `/candidate/applications/${id}`,
    SAVED_JOBS: "/candidate/saved-jobs",
    TEAMS: "/candidate/teams",
    TEAM_DETAIL: (id: string | number) => `/candidate/teams/${id}`,
    SETTINGS: "/candidate/settings",
  },
  COMPANY: {
    ROOT: "/company",
    DASHBOARD: "/company/dashboard",
    PROFILE: "/company/profile",
    JOBS: "/company/jobs",
    CREATE_JOB: "/company/jobs/create",
    EDIT_JOB: (id: string | number) => `/company/jobs/${id}/edit`,
    JOB_DETAIL: (id: string | number) => `/company/jobs/${id}`,
    APPLICATIONS: "/company/applications",
    APPLICATION_DETAIL: (id: string | number) => `/company/applications/${id}`,
    TALENT: "/company/talent",
    TALENT_DETAIL: (id: string | number) => `/company/talent/${id}`,
    TEAMS: "/company/teams",
    TEAM_DETAIL: (id: string | number) => `/company/teams/${id}`,
    SETTINGS: "/company/settings",
  },
  UNIVERSITY: {
    ROOT: "/university",
    DASHBOARD: "/university/dashboard",
    PROFILE: "/university/profile",
    STUDENTS: "/university/students",
    STUDENT_DETAIL: (id: string | number) => `/university/students/${id}`,
    VERIFICATIONS: "/university/verifications",
    DEPARTMENTS: "/university/departments",
    OPPORTUNITIES: "/university/opportunities",
    SETTINGS: "/university/settings",
  },
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    COMPANIES: "/admin/companies",
    JOBS: "/admin/jobs",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
  },
} as const
