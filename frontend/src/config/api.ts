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
      ME: "/api/v1/auth/me",
    },
    JOBS: {
      LIST: "/api/v1/jobs",
      DETAIL: (id: string) => `/api/v1/jobs/${id}`,
      APPLY: (id: string) => `/applyjob/${id}`,
      SAVE: (id: string) => `/api/v1/jobs/${id}/save`,
      SEARCH: "/api/v1/jobs",
      SUGGESTIONS: "/api/v1/jobs/suggestions",
    },
    COMPANIES: {
      LIST: "/api/v1/companies",
      DETAIL: (id: string) => `/api/v1/companies/${id}`,
      SUGGESTIONS: "/api/v1/companies/suggestions",
    },
    TEAMS: {
      LIST: "/api/v1/teams",
      DETAIL: (id: string) => `/api/v1/teams/${id}`,
      SUGGESTIONS: "/api/v1/teams/suggestions",
      CREATE: "/create_team",
    },
    CANDIDATES: {
      PROFILE: "/api/v1/candidate/profile",
      IDENTITY: "/api/v1/candidate/profile/identity",
      ABOUT: "/api/v1/candidate/profile/about",
      SKILLS: "/api/v1/candidate/profile/skills",
      EXPERIENCE: "/api/v1/candidate/profile/experience",
      EDUCATION: "/api/v1/candidate/profile/education",
      PROJECTS: "/api/v1/candidate/profile/projects",
      PROJECT_DELETE: (id: number) => `/api/v1/candidate/profile/projects/${id}`,
      CERTIFICATIONS: "/api/v1/candidate/profile/certifications",
      CERTIFICATION_DELETE: (id: number) => `/api/v1/candidate/profile/certifications/${id}`,
      PREFERENCES: "/api/v1/candidate/profile/preferences",
      VISIBILITY: "/api/v1/candidate/profile/visibility",
      CV_UPLOAD: "/api/v1/candidate/cv/upload",
      CV_DOWNLOAD: "/api/v1/candidate/cv/download",
      LEGACY_PROFILE: "/my_profile",
      EDIT_PERSONAL: "/edit-profile/personal_data",
      EDIT_JOB: "/edit-profile/job_data",
      EDIT_EDU: "/edit-profile/educational_data",
      APPLICATIONS: "/my-jobapplications",
      RECOMMENDATIONS: "/recommendations",
    },
    CONTACT: "/api/v1/contact",
  },
}
