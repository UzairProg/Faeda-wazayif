import { env } from "./env"

/**
 * API_CONFIG — Central API configuration for Faeda Jobs.
 * All endpoint paths follow the versioned /api/v1/* convention.
 * Do NOT scatter fetch/axios calls in UI components — use service modules instead.
 */
export const API_CONFIG = {
  BASE_URL: env.VITE_API_URL,
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      REGISTER: "/api/v1/auth/register",
      LOGOUT: "/api/v1/auth/logout",
      REFRESH: "/api/v1/auth/refresh",
      FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
      RESET_PASSWORD: "/api/v1/auth/reset-password",
      VERIFY: "/api/v1/auth/verify",
    },
    JOBS: {
      LIST: "/api/v1/jobs",
      DETAIL: (id: string) => `/api/v1/jobs/${id}`,
      APPLY: (id: string) => `/api/v1/jobs/${id}/apply`,
      SAVE: (id: string) => `/api/v1/jobs/${id}/save`,
    },
    COMPANIES: {
      LIST: "/api/v1/companies",
      DETAIL: (id: string) => `/api/v1/companies/${id}`,
      JOBS: (id: string) => `/api/v1/companies/${id}/jobs`,
    },
    TEAMS: {
      LIST: "/api/v1/teams",
      DETAIL: (id: string) => `/api/v1/teams/${id}`,
    },
    CANDIDATES: {
      PROFILE: "/api/v1/candidate/profile",
      CV: "/api/v1/candidate/cv",
      MARKET_VALUE: "/api/v1/candidate/market-value",
      APPLICATIONS: "/api/v1/candidate/applications",
    },
    // NOTE: These endpoints exist in the Flask backend but currently serve
    // Jinja templates, not JSON. They need to be migrated to JSON responses.
    // Reference: FAEDA_JOBS_FINAL_ROADMAP.md §3.3
  },
}
