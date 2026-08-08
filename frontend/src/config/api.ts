import { env } from "./env"

/**
 * API_CONFIG — Central API configuration for Faeda Jobs.
 * Endpoints map directly to the Flask backend blueprints and services.
 * Do NOT scatter fetch/axios calls in UI components — use service modules instead.
 */
export const API_CONFIG = {
  BASE_URL: env.VITE_API_URL,
  TIMEOUT: 10000,
  HEADERS: {
    Accept: "application/json",
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/login",
      REGISTER: "/register",
      LOGOUT: "/logout",
      FORGOT_PASSWORD: "/forgot_password",
      RESET_PASSWORD: "/reset_password",
      REDIRECTS: "/redirects",
      MY_PROFILE: "/my_profile",
    },
    JOBS: {
      LIST: "/job-list",
      DETAIL: (id: string) => `/read_job/${id}`,
      APPLY: (id: string) => `/applyjob/${id}`,
      SEARCH: "/searchjobb",
    },
    COMPANIES: {
      LIST: "/companies",
      DETAIL: (id: string) => `/company/${id}`,
    },
    TEAMS: {
      LIST: "/controlled_teams",
      CREATE: "/create_team",
      DETAIL: (id: string) => `/profile_team/${id}`,
    },
    CANDIDATES: {
      PROFILE: "/my_profile",
      EDIT_PERSONAL: "/edit-profile/personal_data",
      EDIT_JOB: "/edit-profile/job_data",
      EDIT_EDU: "/edit-profile/educational_data",
      APPLICATIONS: "/my-jobapplications",
      RECOMMENDATIONS: "/recommendations",
    },
  },
}
