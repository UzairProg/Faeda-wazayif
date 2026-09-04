/**
 * lib/api-client.ts
 * ==============================================================================
 * Centralized Axios client for Faeda Jobs React Frontend.
 * Automatically injects Bearer Authentication tokens and manages cross-origin credentials.
 * ==============================================================================
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
})

// Request Interceptor: Automatically attach Bearer token to all outgoing API calls
apiClient.interceptors.request.use((config) => {
  try {
    const rawStorage = localStorage.getItem("auth-storage")
    if (rawStorage) {
      const parsed = JSON.parse(rawStorage)
      const token = parsed?.state?.token
      if (token && token !== "cookie-session-active" && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {
    // Non-blocking fallback
  }
  return config
})

// Response Interceptor: Gracefully handle unauthorized or connection issues
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401 on an authenticated page, callers can handle or redirect
    return Promise.reject(error)
  }
)
