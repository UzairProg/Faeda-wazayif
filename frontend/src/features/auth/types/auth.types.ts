export type AuthRole = "candidate" | "company" | "university" | "admin"
export type RegisterRole = "candidate" | "company" | "university"

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
  // University Official fields
  universityNameAr?: string
  universityNameEn?: string
  deanName?: string
  institutionType?: string
  location?: string
  phone?: string
  website?: string
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
