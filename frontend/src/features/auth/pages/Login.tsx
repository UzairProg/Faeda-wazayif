/**
 * features/auth/pages/Login.tsx
 *
 * Authentication login page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, Loader2, Sparkles, GraduationCap, UserCheck, Building2, Database, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginStore = useAuthStore((state) => state.login)
  const { t, language, isRTL } = useTranslation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage(t("auth.errors.invalidEmail"))
      return
    }

    if (!password) {
      setErrorMessage(t("auth.errors.shortPassword"))
      return
    }

    setIsLoading(true)

    try {
      const res = await authService.login({ email: email.trim(), password })
      loginStore(res.user, res.token)

      // Determine proper role-based redirect target
      const rawFrom = (location.state as { from?: string })?.from
      let targetPath: string = ROUTES.CANDIDATE.PROFILE

      if (res.user.role === "company") {
        targetPath = ROUTES.COMPANY.DASHBOARD
      } else if (res.user.role === "university") {
        targetPath = ROUTES.UNIVERSITY.DASHBOARD
      } else if (res.user.role === "admin") {
        targetPath = ROUTES.ADMIN.ROOT
      } else {
        targetPath = ROUTES.CANDIDATE.PROFILE
      }

      // If user came from a specific valid role-protected route, preserve it
      if (rawFrom && rawFrom !== "/" && !rawFrom.startsWith("/auth") && rawFrom !== "/login" && rawFrom !== "/register") {
        if (res.user.role === "candidate" && (rawFrom.startsWith("/candidate") || rawFrom.startsWith("/jobs") || rawFrom.startsWith("/applyjob"))) {
          targetPath = rawFrom
        } else if (res.user.role === "company" && rawFrom.startsWith("/company")) {
          targetPath = rawFrom
        } else if (res.user.role === "university" && rawFrom.startsWith("/university")) {
          targetPath = rawFrom
        } else if (res.user.role === "admin" && rawFrom.startsWith("/admin")) {
          targetPath = rawFrom
        }
      }

      navigate(targetPath, { replace: true })
    } catch (err: any) {
      setErrorMessage(err.message || t("auth.errors.generic"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickDemoLogin = (role: "candidate" | "company" | "university" | "professor" | "admin") => {
    if (role === "university") {
      const demoUser = {
        id: "univ-demo-kfu",
        email: "careers@kfu.edu.sa",
        name: "جامعة الملك فيصل - الأحساء",
        role: "university" as const,
      }
      loginStore(demoUser, "demo-university-token")
      navigate(ROUTES.UNIVERSITY.DASHBOARD, { replace: true })
      return
    }

    if (role === "professor") {
      const demoUser = {
        id: "prof-demo-1",
        email: "k.sulaiman@kfu.edu.sa",
        name: "د. خالد السليمان (مشرف التدريب التعاوني)",
        role: "university" as const,
      }
      loginStore(demoUser, "demo-professor-token")
      navigate(ROUTES.UNIVERSITY.COOP, { replace: true })
      return
    }

    if (role === "company") {
      const demoUser = {
        id: "company-demo-1",
        email: "hr@aramco-digital.sa",
        name: "Aramco Digital Solutions",
        role: "company" as const,
      }
      loginStore(demoUser, "demo-company-token")
      navigate(ROUTES.COMPANY.DASHBOARD, { replace: true })
      return
    }

    if (role === "admin") {
      const demoUser = {
        id: "admin-demo-1",
        email: "admin@faeda.jobs",
        name: "مدير النظام (Admin)",
        role: "admin" as const,
      }
      loginStore(demoUser, "demo-admin-token")
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
      return
    }

    const demoUser = {
      id: "candidate-demo-1",
      email: "ahmed.alfarsi@faeda.sa",
      name: "Ahmed Al-Farsi",
      role: "candidate" as const,
    }
    loginStore(demoUser, "demo-candidate-token")
    navigate(ROUTES.CANDIDATE.DASHBOARD, { replace: true })
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row text-start">
      
      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 min-h-screen">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full mb-6">
          <LanguageSelector variant="pill" dropdownAlign="start" />

          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
            <span>{t("auth.login.backToHome")}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="group">
              <img
                src={faedaWhiteLogo}
                alt="Faeda Jobs Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">{t("auth.login.title")}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{t("auth.login.subtitle")}</p>
          </motion.div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-white block">
                {t("auth.login.email")}
              </label>
              <div className="relative">
                <input
                  id="login-email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold text-white block">
                  {t("auth.login.password")}
                </label>
                <Link
                  to={ROUTES.AUTH.FORGOT_PASSWORD}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.form.passwordPlaceholder")}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3.5 top-3.5 text-muted-foreground hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="login-remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
              />
              <label htmlFor="login-remember" className="text-xs text-muted-foreground cursor-pointer">
                {t("auth.login.rememberMe")}
              </label>
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
                  <span>{t("auth.login.submitting")}</span>
                </>
              ) : (
                <span>{t("auth.login.submit")}</span>
              )}
            </Button>
          </form>

          {/* Register Callout */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <span>{t("auth.login.noAccount")} </span>
            <Link to={ROUTES.AUTH.REGISTER} className="text-primary hover:underline font-bold">
              {t("auth.login.createAccount")}
            </Link>
          </div>

          {/* Quick Demo Access Options */}
          <div className="pt-5 border-t border-white/10 mt-6 space-y-2">
            <span className="text-[11px] text-muted-foreground block text-center">
              {language === "ar" ? "دخول سريع وتجربة فورية للمنظومة:" : language === "hi" ? "त्वरित डेमो अनुभव:" : "Instant Quick Access Demo:"}
            </span>

            {/* University Portal (KFU Al-Ahsa) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemoLogin("university")}
              className="w-full rounded-xl border-primary/40 bg-primary/10 hover:bg-primary/20 text-white font-bold text-xs h-10 gap-2"
            >
              <GraduationCap className="w-4 h-4 text-secondary" />
              <span>
                {language === "ar"
                  ? "🎓 جامعة الملك فيصل - مؤشرات التوظيف وحملات الرسائل"
                  : language === "hi"
                  ? "🎓 किंग फैसल विश्वविद्यालय - रोजगार डैशबोर्ड और थीसिस"
                  : "🎓 King Faisal University - Employment KPIs & Theses"}
              </span>
            </Button>

            {/* Academic Professor Coop Supervision Portal */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemoLogin("professor")}
              className="w-full rounded-xl border-border bg-card/80 hover:bg-card text-white font-bold text-xs h-10 gap-2"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>
                {language === "ar"
                  ? "👨‍🏫 دخول المشرف الأكاديمي للتدريب التعاوني (د. خالد السليمان)"
                  : language === "hi"
                  ? "👨‍🏫 सहकारी प्रशिक्षण पर्यवेक्षक (डॉ. खालिद अल-सुलेमान)"
                  : "👨‍🏫 Academic Coop Supervisor Portal (Dr. Khalid Sulaiman)"}
              </span>
            </Button>

            {/* 1. Job Seeker (Candidate) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemoLogin("candidate")}
              className="w-full rounded-xl border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-300 hover:text-white font-bold text-xs h-10 gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {language === "ar"
                  ? "👤 باحث عن عمل: رؤى السوق والرواتب (Job Seeker)"
                  : "👤 Job Seeker: Talent & Market Insights Dashboard"}
              </span>
            </Button>

            {/* 2. Company (Employer) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemoLogin("company")}
              className="w-full rounded-xl border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 hover:text-white font-bold text-xs h-10 gap-2"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {language === "ar"
                  ? "🏢 المنشأة: تحليلات سوق التوظيف وتكلفة الاستقطاب (Company)"
                  : "🏢 Company: Hiring Market Insights & Talent Costs"}
              </span>
            </Button>

            {/* 3. Market Trends */}
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/market-trends")}
              className="w-full rounded-xl border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-900/40 text-indigo-300 hover:text-white font-bold text-xs h-10 gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {language === "ar"
                  ? "📈 مؤشرات واتجاهات السوق الإقليمية (Market Trends)"
                  : "📈 Regional Market Trends & Multi-Filter Analytics"}
              </span>
            </Button>

            {/* 4. Admin Portal */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickDemoLogin("admin")}
              className="w-full rounded-xl border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/40 text-amber-300 hover:text-white font-bold text-xs h-10 gap-2"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === "ar"
                  ? "⚙️ لوحة إدارة المنصة والنظام (Admin Console)"
                  : language === "hi"
                  ? "⚙️ व्यवस्थापक कंसोल (Admin Console)"
                  : "⚙️ Admin Console: Platform & User Governance"}
              </span>
            </Button>
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
          <Link to="/" className="group">
            <img
              src={faedaWhiteLogo}
              alt="Faeda Jobs Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="space-y-4 max-w-md relative z-10">
          <GlassCard className="p-6 bg-card/40 border-white/10 space-y-3">
            <p className="text-sm font-semibold text-white leading-relaxed">
              {language === "en"
                ? "Faeda unites professional identity, explainable AI, opportunities, companies, and teams."
                : language === "hi"
                ? "फ़ायदा पेशेवर पहचान, अवसरों, कंपनियों और टीमों को एक स्थान पर जोड़ता है।"
                : "توحد فائدة الهوية المهنية، والفرص والفرق في منصة عمل احترافية واحدة."}
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
