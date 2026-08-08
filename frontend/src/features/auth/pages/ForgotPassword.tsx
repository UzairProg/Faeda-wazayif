import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Globe, AlertCircle, Loader2, CheckCircle2, KeyRound } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { authService } from "../services/auth.service"
import { auth } from "@/i18n/namespaces/auth"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !email.includes("@")) {
      setErrorMessage(auth.errors.invalidEmail)
      return
    }

    try {
      setIsLoading(true)
      await authService.requestPasswordReset({ email })
      setIsSubmitted(true)
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

        {/* Main Content */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">{auth.forgotPassword.title}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{auth.forgotPassword.subtitle}</p>
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
            {!isSubmitted ? (
              <motion.form
                key="request-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white">{auth.forgotPassword.email}</label>
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

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.25)] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{auth.forgotPassword.submitting}</span>
                    </>
                  ) : (
                    <span>{auth.forgotPassword.submit}</span>
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-xs mt-3">
                  <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:text-white font-bold transition-colors">
                    {auth.forgotPassword.backToLogin}
                  </Link>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading">{auth.forgotPassword.successTitle}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{auth.forgotPassword.successSubtitle}</p>
                </div>
                <Link to={ROUTES.AUTH.LOGIN} className="w-full mt-2">
                  <Button className="w-full h-10 text-xs font-bold rounded-xl bg-primary text-white">
                    {auth.forgotPassword.backToLogin}
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground/50">منظومة فائدة المهنية © 2026</p>
        </div>
      </div>

      {/* Brand Hero Panel */}
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
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-extrabold font-heading text-white leading-[1.3] mb-4"
          >
            استعادة الأمان وسهولة الوصول لحسابك.
          </motion.h2>
        </div>

        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <span className="text-xs text-white/80">أمان عالي ووصول محمي</span>
        </div>
      </div>

    </div>
  )
}
