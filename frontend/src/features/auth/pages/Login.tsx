import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowLeft, Globe, CheckCircle2, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import { auth } from "@/i18n/namespaces/auth"

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect already authenticated users to their workspace
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "candidate":
          navigate("/candidate", { replace: true })
          break
        case "company":
          navigate("/company", { replace: true })
          break
        case "admin":
          navigate("/admin", { replace: true })
          break
        default:
          navigate("/", { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !email.includes("@")) {
      setErrorMessage(auth.errors.invalidEmail)
      return
    }

    if (!password) {
      setErrorMessage("يرجى إدخال كلمة المرور.")
      return
    }

    try {
      setIsLoading(true)
      const res = await authService.login({ email, password, rememberMe })

      login(res.user, res.token)

      // Role-aware destination validation
      const fromPath = (location.state as { from?: string })?.from
      const isFromAuthorized =
        fromPath &&
        ((res.user.role === "candidate" && (fromPath.startsWith("/candidate") || fromPath.startsWith("/jobs"))) ||
          (res.user.role === "company" && fromPath.startsWith("/company")) ||
          (res.user.role === "admin" && fromPath.startsWith("/admin")))

      if (isFromAuthorized && fromPath) {
        navigate(fromPath, { replace: true })
        return
      }

      // Default Role-aware route redirection
      switch (res.user.role) {
        case "candidate":
          navigate("/candidate", { replace: true })
          break
        case "company":
          navigate("/company", { replace: true })
          break
        case "admin":
          navigate("/admin", { replace: true })
          break
        default:
          navigate("/", { replace: true })
      }
    } catch (err: any) {
      setErrorMessage(err.message || auth.errors.generic)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row text-start" dir="rtl">

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 min-h-screen">

        {/* Top Header */}
        <div className="flex justify-between items-center w-full mb-6">
          <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 px-4 text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>العربية</span>
          </Button>
          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
            <span>{auth.login.backToHome}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">{auth.login.title}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{auth.login.subtitle}</p>
          </motion.div>

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

          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white">{auth.login.email}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={auth.form.emailPlaceholder}
                  className="w-full bg-card/50 border border-white/10 rounded-xl py-3 ps-11 pe-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white">{auth.login.password}</label>
                <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold">
                  {auth.login.forgotPassword}
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={auth.form.passwordPlaceholder}
                  className="w-full bg-card/50 border border-white/10 rounded-xl py-3 ps-11 pe-10 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground hover:text-white transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-card/50 text-primary focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="text-xs text-muted-foreground cursor-pointer select-none">
                {auth.login.rememberMe}
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.25)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{auth.login.submitting}</span>
                </>
              ) : (
                <span>{auth.login.submit}</span>
              )}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-3 text-muted-foreground text-[11px]">{auth.login.orContinueWith}</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-xs font-bold rounded-xl bg-transparent border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>{auth.login.googleLogin}</span>
            </Button>

            <p className="text-center text-muted-foreground text-xs mt-3">
              {auth.login.noAccount}{" "}
              <Link to={ROUTES.AUTH.REGISTER} className="text-primary hover:text-white font-bold transition-colors">
                {auth.login.createAccount}
              </Link>
            </p>
          </motion.form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground/50">منظومة فائدة المهنية © 2026</p>
        </div>
      </div>

      {/* Brand Hero Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#091122] overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-heading text-white tracking-tight">منظومة <span className="text-primary">فائدة</span></span>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-lg mx-auto text-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6"
          >
            المنظومة المهنية الموحدة
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-extrabold font-heading text-white leading-[1.3] mb-4"
          >
            دخول مباشر لمساحتك المهنية وأدوات التطور.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            استكمل متابعة سيرتك الذاتية، جاهزية ATS، وقيمتك السوقية الحية داخل بيئة موحدة.
          </motion.p>
        </div>

        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            هوية موثقة
          </div>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            ذكاء مفسر
          </div>
        </div>
      </div>

    </div>
  )
}
