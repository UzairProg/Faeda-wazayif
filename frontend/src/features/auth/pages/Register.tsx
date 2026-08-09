/**
 * features/auth/pages/Register.tsx
 *
 * Authentication registration page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { UserPlus, Mail, Lock, User, Building2, Eye, EyeOff, Globe, ArrowLeft, ArrowRight, AlertCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { RoleSelector } from "../components/RoleSelector"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { RegisterRole } from "../types/auth.types"
import type { Language } from "@/store/language.store"

export function Register() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const { t, language, setLanguage, isRTL } = useTranslation()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null)

  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const StepBackIcon = isRTL ? ChevronRight : ChevronLeft

  const toggleLang = () => {
    const nextLang: Language = language === "ar" ? "en" : language === "en" ? "hi" : "ar"
    setLanguage(nextLang)
  }

  const handleStep1Next = () => {
    if (!selectedRole) {
      setErrorMessage(t("auth.errors.requiredRole"))
      return
    }
    setErrorMessage(null)
    setStep(2)
  }

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (selectedRole === "candidate" && !fullName.trim()) {
      setErrorMessage(t("auth.errors.requiredName"))
      return
    }

    if (selectedRole === "company" && !companyName.trim()) {
      setErrorMessage(t("auth.errors.requiredOrgName"))
      return
    }

    if (!email.trim()) {
      setErrorMessage(t("auth.errors.invalidEmail"))
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

    setIsLoading(true)

    try {
      const nameToSubmit = selectedRole === "candidate" ? fullName.trim() : companyName.trim()
      const roleToSubmit = selectedRole === "company" ? "company" : "candidate"
      const res = await authService.register({
        name: nameToSubmit,
        email: email.trim(),
        password,
        role: roleToSubmit,
      })
      loginStore(res.user, res.token)
      navigate(ROUTES.PUBLIC.HOME, { replace: true })
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
            <span>{language === "ar" ? "English" : language === "en" ? "हिन्दी" : "العربية"}</span>
          </Button>

          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
            <span>{t("auth.login.backToHome")}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px] mx-auto my-auto py-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">{t("auth.register.title")}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{t("auth.register.subtitle")}</p>
          </motion.div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Select Role */
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white font-heading">{t("auth.register.step1Title")}</h2>
                <p className="text-xs text-muted-foreground">{t("auth.register.step1Subtitle")}</p>
              </div>

              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={(r) => {
                  setSelectedRole(r)
                  setErrorMessage(null)
                }}
              />

              <Button
                type="button"
                onClick={handleStep1Next}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 gap-2 mt-4"
              >
                <span>{t("auth.register.next")}</span>
              </Button>
            </div>
          ) : (
            /* STEP 2: Input Details */
            <form onSubmit={handleSubmitStep2} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white">{t("auth.register.step2Title")}</h2>
                  <p className="text-[11px] text-muted-foreground">{t("auth.register.step2Subtitle")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <StepBackIcon className="w-3.5 h-3.5" />
                  <span>{t("auth.register.backToRoles")}</span>
                </button>
              </div>

              {selectedRole === "candidate" ? (
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-xs font-bold text-white block">
                    {t("auth.form.fullName")} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("auth.form.fullNamePlaceholder")}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                    />
                    <User className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="reg-company" className="text-xs font-bold text-white block">
                    {t("auth.form.companyName")} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t("auth.form.companyNamePlaceholder")}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                    />
                    <Building2 className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="text-xs font-bold text-white block">
                  {t("auth.form.email")} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-email"
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.form.emailPlaceholder")}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 text-start"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="text-xs font-bold text-white block">
                  {t("auth.form.password")} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.form.passwordPlaceholder")}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-confirm" className="text-xs font-bold text-white block">
                  {t("auth.form.confirmPassword")} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("auth.form.confirmPasswordPlaceholder")}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                  />
                  <Lock className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("auth.register.submitting")}</span>
                  </>
                ) : (
                  <span>{t("auth.register.submit")}</span>
                )}
              </Button>
            </form>
          )}

          {/* Login Callout */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <span>{t("auth.register.hasAccount")} </span>
            <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:underline font-bold">
              {t("auth.register.login")}
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground/60 py-4">
          &copy; {new Date().getFullYear()} Faeda Jobs. All rights reserved.
        </div>

      </div>

      {/* Visual Backdrop Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#081628] via-[#0A2D8F]/20 to-background border-s border-white/5 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-xl font-heading">
            ف
          </div>
          <span className="font-heading font-extrabold text-2xl text-white">Faeda Jobs</span>
        </div>

        <div className="space-y-4 max-w-md relative z-10">
          <GlassCard className="p-6 bg-card/40 border-white/10 space-y-3">
            <p className="text-sm font-semibold text-white leading-relaxed">
              {language === "en"
                ? "Join thousands of professionals and top employers on Faeda Jobs."
                : language === "hi"
                ? "फ़ायदा जॉब्स पर हज़ारों पेशेवरों और शीर्ष नियोक्ताओं से जुड़ें।"
                : "انضم لآلاف المحترفين كمرشح أو شركة واكتشف الفرص الموثوقة."}
            </p>
          </GlassCard>
        </div>

        <div className="text-xs text-muted-foreground/60 relative z-10">
          {language === "en" ? "Production-grade Recruitment Platform" : language === "hi" ? "उन्नत पेशेवर भर्ती मंच" : "منظومة التوظيف والهوية المهنية المتقدمة"}
        </div>
      </div>

    </div>
  )
}
