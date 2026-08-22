import { API_CONFIG } from "@/config/api"
import type { LoginCredentials, RegisterDTO, AuthResponse, ForgotPasswordDTO, ResetPasswordDTO, AuthUser } from "../types/auth.types"

class AuthService {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
        credentials: "include",
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        const msg =
          responseData?.message ||
          "بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور."
        throw new Error(msg)
      }

      // Verify and restore full canonical session
      const restoredUser = await this.checkSession()
      const finalUser: AuthUser = restoredUser || (responseData?.user
        ? {
            id: String(responseData.user.id || responseData.user.user_id),
            email: responseData.user.email,
            role: responseData.role || responseData.user.role || "candidate",
            name: responseData.user.name || responseData.user.fullname || "",
          }
        : {
            id: credentials.email,
            email: credentials.email,
            role: "candidate",
            name: credentials.email.split("@")[0],
          })

      return {
        user: finalUser,
        token: "cookie-session-active",
        message: "تم تسجيل الدخول بنجاح",
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والاتصال بالشبكة.")
      }
      throw err
    }
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      const names = data.name.trim().split(" ")
      const fName = names[0] || data.name
      const lName = names.slice(1).join(" ") || " "
      const mobile = "0500000000" // Default mobile fallback required by Flask model

      const userrole = data.role === "company" ? "company" : "customers"

      const formData = new URLSearchParams()
      formData.append("fName", fName)
      formData.append("lName", lName)
      formData.append("email", data.email.trim())
      formData.append("phoneNumber", mobile)
      formData.append("password", data.password)
      formData.append("userrole", userrole)

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "text/html,application/xhtml+xml,application/xml,application/json",
        },
        body: formData.toString(),
        credentials: "include",
      })

      const responseText = await response.text()

      if (responseText.includes("موجود بالفعل") || responseText.includes("already registered") || responseText.includes("check_customer")) {
        throw new Error("يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.")
      }

      if (responseText.includes("رمز خاص") || responseText.includes("8 أحرف")) {
        throw new Error("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على رمز خاص (!@#$&*).")
      }

      const role = userrole === "company" ? "company" : "candidate"
      return {
        user: {
          id: data.email,
          email: data.email,
          role,
          name: data.name,
        },
        token: "cookie-session-active",
        message: "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.",
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والاتصال بالشبكة.")
      }
      throw err
    }
  }

  async requestPasswordReset(data: ForgotPasswordDTO): Promise<{ message: string }> {
    try {
      const formData = new URLSearchParams()
      formData.append("email", data.email.trim())

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "text/html,application/xhtml+xml,application/xml,application/json",
        },
        body: formData.toString(),
        credentials: "include",
      })

      const responseText = await response.text()

      if (responseText.includes("Email not found") || responseText.includes("غير موجود")) {
        throw new Error("البريد الإلكتروني غير مسجل في المنظومة.")
      }

      return {
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.",
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والاتصال بالشبكة.")
      }
      throw err
    }
  }

  async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    try {
      const formData = new URLSearchParams()
      formData.append("password1", data.password)
      formData.append("password2", data.password)

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD}?token=${data.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "text/html,application/xhtml+xml,application/xml,application/json",
        },
        body: formData.toString(),
        credentials: "include",
      })

      const responseText = await response.text()

      if (responseText.includes("Invalid token") || responseText.includes("غير صالح")) {
        throw new Error("رابط التعيين غير صالح أو انتهت صلاحيته.")
      }

      return {
        message: "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم والاتصال بالشبكة.")
      }
      throw err
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
        method: "GET",
        credentials: "include",
      })
    } catch {
      // Ignore logout errors silently
    }
  }

  async checkSession(): Promise<AuthUser | null> {
    try {
      // First try the clean REST API endpoint
      const meResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (meResponse.ok) {
        const meData = await meResponse.json()
        if (meData.authenticated && meData.user) {
          return {
            id: String(meData.user.id || meData.user.user_id),
            email: meData.user.email || "",
            role: meData.role,
            name: meData.user.name || meData.user.fullname || "",
          }
        }
      }

      // Fallback check via redirects route
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REDIRECTS}`, {
        method: "GET",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml,application/json",
        },
        credentials: "include",
      })

      const htmlText = await response.text()

      if (htmlText.includes("customer_panel") || htmlText.includes("المرشح")) {
        return {
          id: "current-customer",
          email: "customer@faeda.jobs",
          role: "candidate",
          name: "مرشح فائدة",
        }
      }

      if (htmlText.includes("company_panel") || htmlText.includes("شركة")) {
        return {
          id: "current-company",
          email: "company@faeda.jobs",
          role: "company",
          name: "شركة مسجلة",
        }
      }

      return null
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()
