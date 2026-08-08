export type AuthRole = "candidate" | "company" | "admin"
export type RegisterRole = "candidate" | "company"

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterDTO {
  role: RegisterRole
  name: string
  email: string
  password: string
  organizationName?: string
}

export interface AuthUser {
  id: string
  email: string
  role: AuthRole
  name: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  message?: string
}

export interface ForgotPasswordDTO {
  email: string
}

export interface ResetPasswordDTO {
  token: string
  password: string
}
