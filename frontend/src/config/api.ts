import { env } from "./env"

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
    },
    JOBS: {
      LIST: "/api/v1/jobs",
      DETAIL: (id: string) => `/api/v1/jobs/${id}`,
    },
    // Add other module endpoints here
  },
}
