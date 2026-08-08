import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, Building2, Globe, ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import { RoleSelector } from "../components/RoleSelector"
import { auth } from "@/i18n/namespaces/auth"
import type { RegisterRole } from "../types/auth.types"

export function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, isAuthenticated, user } = useAuthStore()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null)

  // Form Fields
  const [name, setName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

  // Initialize role from URL query param if present e.g. ?role=company
  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "company") {
      setSelectedRole("company")
    } else if (roleParam === "candidate" || roleParam === "seeker") {
      setSelectedRole("candidate")
    }
  }, [searchParams])

  const handleNextStep = () => {
    if (!selectedRole) {
      setErrorMessage(auth.errors.requiredRole)
      return
    }
    setErrorMessage(null)
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedRole) {
      setErrorMessage(auth.errors.requiredRole)
      return
    }

    if (!name.trim()) {
      setErrorMessage(auth.errors.requiredName)
      return
    }

    if (selectedRole === "company" && !orgName.trim()) {
      setErrorMessage(auth.errors.requiredOrgName)
      return
    }

    if (!email || !email.includes("@")) {
      setErrorMessage(auth.errors.invalidEmail)
      return
    }

    if (!password || password.length < 8) {
      setErrorMessage(auth.errors.shortPassword)
      return
    }

    // Flask backend requires at least one special character (!@#$&*)
    if (!/[!@#$&*]/.test(password)) {
      setErrorMessage("يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل (!@#$&*).")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(auth.errors.passwordMismatch)
      return
    }

    try {
      setIsLoading(true)

      const registerPayload = {
        role: selectedRole,
        name: name.trim(),
        email: email.trim(),
        password,
        ...(selectedRole === "company" ? { organizationName: orgName.trim() } : {}),
      }

      const res = await authService.register(registerPayload)
      login(res.user, res.token)

      // Role-aware route redirection
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
            <span>العودة للرئيسية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px] mx-auto my-auto py-6">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">{auth.register.title}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {step === 1 ? auth.register.step1Subtitle : auth.register.step2Subtitle}
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

          {/* Progressive 2-Step View */}
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <RoleSelector
                  selectedRole={selectedRole}
                  onSelectRole={(role) => {
                    setSelectedRole(role)
                    setErrorMessage(null)
                  }}
                />

                <Button
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.25)] flex items-center justify-center gap-2"
                >
                  <span>{auth.register.next}</span>
                </Button>

                <p className="text-center text-muted-foreground text-xs">
                  {auth.register.hasAccount}{" "}
                  <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:text-white font-bold transition-colors">
                    {auth.register.login}
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
                onSubmit={handleRegister}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                  <span className="text-xs text-primary font-bold">
                    الحساب المحدد: {selectedRole && auth.roles[selectedRole]?.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{auth.register.backToRoles}</span>
                  </button>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white">{auth.form.fullName}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={auth.form.fullNamePlaceholder}
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-2.5 ps-11 pe-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Organization Name if Company */}
                {selectedRole === "company" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-white">{auth.form.companyName}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder={auth.form.companyNamePlaceholder}
                        className="w-full bg-card/50 border border-white/10 rounded-xl py-2.5 ps-11 pe-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white">{auth.form.email}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={auth.form.emailPlaceholder}
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-2.5 ps-11 pe-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white">{auth.form.password}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={auth.form.passwordPlaceholder}
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-2.5 ps-11 pe-10 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground">تنبيه: يجب أن تحتوي كلمة المرور على 8 أحرف ورمز مثل (!@#$&*)</span>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-white">{auth.form.confirmPassword}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={auth.form.confirmPasswordPlaceholder}
                      className="w-full bg-card/50 border border-white/10 rounded-xl py-2.5 ps-11 pe-4 text-xs text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dir-ltr"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.25)] flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{auth.register.submitting}</span>
                    </>
                  ) : (
                    <span>{auth.register.submit}</span>
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-xs mt-2">
                  {auth.register.hasAccount}{" "}
                  <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:text-white font-bold transition-colors">
                    {auth.register.login}
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
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
            التسجيل حسب الدور
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-extrabold font-heading text-white leading-[1.3] mb-4"
          >
            منظومة توحّد الكفاءات والشركات في مكان واحد.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            انضم الآن وابدأ بناء هويتك المهنية أو استقطاب الكفاءات والفرق بأسلوب حديث وشفاف.
          </motion.p>
        </div>

        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <span className="text-xs text-white/80">خطوات بسيطة ومستقبل مهني أوضح</span>
        </div>
      </div>

    </div>
  )
}
