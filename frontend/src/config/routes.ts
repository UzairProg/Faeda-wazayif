export const ROUTES = {
  PUBLIC: {
    HOME: "/",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  JOBS: {
    LIST: "/jobs",
    DETAIL: (id: string) => `/jobs/${id}`,
  },
  COMPANIES: {
    LIST: "/companies",
  },
  TEAMS: {
    LIST: "/teams",
  },
  // Add other module routes here
} as const
