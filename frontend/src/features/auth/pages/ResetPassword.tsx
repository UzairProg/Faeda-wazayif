/**
 * features/auth/pages/ResetPassword.tsx
 *
 * Password reset submission page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft, ArrowRight, Globe, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, KeyRound } from "lucide-react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { authService } from "../services/auth.service"
import { useTranslation } from "@/i18n"
import type { Language } from "@/store/language.store"

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const { t, language, setLanguage, isRTL } = useTranslation()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const toggleLang = () => {
    const nextLang: Language = language === "ar" ? "en" : "ar"
    setLanguage(nextLang)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage(language === "en" ? "Invalid or missing password reset token." : "رابط استعادة كلمة المرور غير صالح أو مفقود.")
      return
    }

    if (!password || password.length < 8) {
      setErrorMessage(t("auth.errors.shortPassword"))
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("auth.errors.passwordMismatch"))
      return
    }

    try {
      setIsLoading(true)
      await authService.resetPassword({ token, password })
      setIsSuccess(true)
    } catch (err: any) {
      setErrorMessage(err.message || t("auth.errors.generic"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row text-start">
      
      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 min-h-screen">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full mb-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 px-4 text-xs gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </Button>

          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
            <span>{t("auth.login.backToHome")}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
              {language === "en" ? "Set New Password" : "تعيين كلمة المرور الجديدة"}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {language === "en" ? "Enter and confirm your new password." : "أدخل كلمة المرور الجديدة لحسابك وقم بتأكيدها."}
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2.5 text-xs text-destructive-foreground"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="reset-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-5"
                onSubmit={handleResetPassword}
              >
                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">
                    {language === "en" ? "New Password" : "كلمة المرور الجديدة"}
                  </label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-start"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3.5 top-3.5 text-muted-foreground hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">
                    {t("auth.form.confirmPassword")}
                  </label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-start"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.25)] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("auth.register.submitting")}</span>
                    </>
                  ) : (
                    <span>{language === "en" ? "Save New Password" : "حفظ كلمة المرور الجديدة"}</span>
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-xs mt-3">
                  <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:text-white font-bold transition-colors">
                    {t("auth.forgotPassword.backToLogin")}
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading">
                    {language === "en" ? "Password changed successfully 🎉" : "تم تغيير كلمة المرور بنجاح 🎉"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === "en" ? "You can now sign in using your new password." : "يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول إلى حسابك."}
                  </p>
                </div>
                <Button onClick={() => navigate(ROUTES.AUTH.LOGIN)} className="w-full h-10 text-xs font-bold rounded-xl bg-primary text-white mt-2">
                  {t("auth.login.submit")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-[11px] text-muted-foreground/50">&copy; {new Date().getFullYear()} Faeda Jobs. All rights reserved.</p>
        </div>
      </div>

      {/* Brand Hero Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-[#091122] overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-heading text-white tracking-tight">Faeda Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">ف</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-lg mx-auto text-start">
          <h2 className="text-4xl font-extrabold font-heading text-white leading-[1.3] mb-4">
            {language === "en" ? "Secure & seamless access to your account." : "تأمين حسابك بكلمة مرور جديدة وقوية."}
          </h2>
        </div>

        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <span className="text-xs text-white/80">{language === "en" ? "Protected Account Access" : "أمان عالي ووصول محمي"}</span>
        </div>
      </div>

    </div>
  )
}
