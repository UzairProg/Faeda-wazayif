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
    JOBS: "/candidate/jobs",
    APPLICATIONS: "/candidate/applications",
    TEAMS: "/candidate/teams",
    SETTINGS: "/candidate/settings",
  },
  COMPANY: {
    ROOT: "/company",
    DASHBOARD: "/company/dashboard",
    PROFILE: "/company/profile",
    JOBS: "/company/jobs",
    PIPELINE: "/company/pipeline",
    TEAMS: "/company/teams",
    SETTINGS: "/company/settings",
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
