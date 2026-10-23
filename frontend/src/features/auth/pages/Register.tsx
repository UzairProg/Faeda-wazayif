/**
 * features/auth/pages/Register.tsx
 *
 * Authentication registration page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { UserPlus, Mail, Lock, User, Building2, Eye, EyeOff, Globe, ArrowLeft, ArrowRight, AlertCircle, Loader2, ChevronRight, ChevronLeft, GraduationCap, MapPin, Phone, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { RoleSelector } from "../components/RoleSelector"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { RegisterRole } from "../types/auth.types"
import type { Language } from "@/store/language.store"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loginStore = useAuthStore((state) => state.login)
  const { t, language, setLanguage, isRTL } = useTranslation()

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null)

  // Candidate fields
  const [fullName, setFullName] = useState("")

  // Company fields
  const [companyName, setCompanyName] = useState("")

  // University Official fields
  const [universityNameAr, setUniversityNameAr] = useState("")
  const [universityNameEn, setUniversityNameEn] = useState("")
  const [officialName, setOfficialName] = useState("")
  const [institutionType, setInstitutionType] = useState("جامعة حكومية")
  const [city, setCity] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")

  // Common fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const StepBackIcon = isRTL ? ChevronRight : ChevronLeft

  // Pre-select role if specified in query string (?role=university, etc.)
  useEffect(() => {
    const roleParam = searchParams.get("role")?.toLowerCase()
    if (roleParam === "university") {
      setSelectedRole("university")
    } else if (roleParam === "company") {
      setSelectedRole("company")
    } else if (roleParam === "candidate") {
      setSelectedRole("candidate")
    }
  }, [searchParams])

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

    if (selectedRole === "university") {
      if (!universityNameAr.trim()) {
        setErrorMessage(t("auth.errors.requiredUniName"))
        return
      }
      if (!officialName.trim()) {
        setErrorMessage(t("auth.errors.requiredOfficialName"))
        return
      }
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
      if (selectedRole === "university") {
        const res = await authService.register({
          role: "university",
          name: universityNameAr.trim(),
          email: email.trim(),
          password,
          universityNameAr: universityNameAr.trim(),
          universityNameEn: universityNameEn.trim(),
          deanName: officialName.trim(),
          institutionType,
          location: city.trim(),
          phone: phone.trim(),
          website: website.trim(),
        })
        loginStore(res.user, res.token)
        navigate(ROUTES.UNIVERSITY.DASHBOARD, { replace: true })
        return
      }

      const nameToSubmit = selectedRole === "candidate" ? fullName.trim() : companyName.trim()
      const roleToSubmit = selectedRole === "company" ? "company" : "candidate"
      const res = await authService.register({
        name: nameToSubmit,
        email: email.trim(),
        password,
        role: roleToSubmit,
        organizationName: selectedRole === "company" ? companyName.trim() : undefined,
      })
      loginStore(res.user, res.token)
      navigate(selectedRole === "company" ? ROUTES.COMPANY.DASHBOARD : ROUTES.CANDIDATE.PROFILE, { replace: true })
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
          <div className="flex justify-center mb-6 lg:hidden">
            <Link to="/" className="group">
              <img
                src={faedaWhiteLogo}
                alt="Faeda Jobs Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
          
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

              {selectedRole === "candidate" && (
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
              )}

              {selectedRole === "company" && (
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

              {selectedRole === "university" && (
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-primary-foreground/90 leading-relaxed font-medium">
                      {language === "en"
                        ? "Official Institutional Registration for University Representatives, Deanships, and Coop Coordinators."
                        : language === "hi"
                        ? "विश्वविद्यालय प्रतिनिधियों, डीनशिप और सह-ऑप समन्वयकों के लिए आधिकारिक संस्थागत पंजीकरण।"
                        : "تسجيل مؤسسي معتمد لممثلي الجامعات، عمادات القبول والتسجيل، ومشرفي التدريب التعاوني."}
                    </p>
                  </div>

                  {/* University Name Arabic */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-uni-ar" className="text-xs font-bold text-white block">
                      {t("auth.form.universityNameAr")} <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-uni-ar"
                        type="text"
                        required
                        value={universityNameAr}
                        onChange={(e) => setUniversityNameAr(e.target.value)}
                        placeholder={t("auth.form.universityNameArPlaceholder")}
                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                      />
                      <GraduationCap className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* University Name English */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-uni-en" className="text-xs font-bold text-white block">
                      {t("auth.form.universityNameEn")}
                    </label>
                    <div className="relative">
                      <input
                        id="reg-uni-en"
                        type="text"
                        dir="ltr"
                        value={universityNameEn}
                        onChange={(e) => setUniversityNameEn(e.target.value)}
                        placeholder={t("auth.form.universityNameEnPlaceholder")}
                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 text-start"
                      />
                      <Building2 className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Official / Dean Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-official-name" className="text-xs font-bold text-white block">
                      {t("auth.form.officialName")} <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-official-name"
                        type="text"
                        required
                        value={officialName}
                        onChange={(e) => setOfficialName(e.target.value)}
                        placeholder={t("auth.form.officialNamePlaceholder")}
                        className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                      />
                      <User className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Institution Type & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="reg-inst-type" className="text-xs font-bold text-white block">
                        {t("auth.form.institutionType")}
                      </label>
                      <select
                        id="reg-inst-type"
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="جامعة حكومية">{t("auth.form.institutionTypeGovernment")}</option>
                        <option value="جامعة أهلية">{t("auth.form.institutionTypePrivate")}</option>
                        <option value="كلية تطبيقية">{t("auth.form.institutionTypeApplied")}</option>
                        <option value="معهد تقني">{t("auth.form.institutionTypeInstitute")}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="reg-city" className="text-xs font-bold text-white block">
                        {t("auth.form.city")}
                      </label>
                      <div className="relative">
                        <input
                          id="reg-city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={t("auth.form.cityPlaceholder")}
                          className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                        />
                        <MapPin className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Website Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="reg-phone" className="text-xs font-bold text-white block">
                        {t("auth.form.phone")}
                      </label>
                      <div className="relative">
                        <input
                          id="reg-phone"
                          type="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t("auth.form.phonePlaceholder")}
                          className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 text-start"
                        />
                        <Phone className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="reg-website" className="text-xs font-bold text-white block">
                        {t("auth.form.website")}
                      </label>
                      <div className="relative">
                        <input
                          id="reg-website"
                          type="url"
                          dir="ltr"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder={t("auth.form.websitePlaceholder")}
                          className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 text-start"
                        />
                        <Globe2 className="w-4 h-4 text-muted-foreground absolute end-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>
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
                ? "Join thousands of professionals, top employers, and leading academic institutions on Faeda Jobs."
                : language === "hi"
                ? "फ़ायदा जॉब्स पर हज़ारों पेशेवरों, शीर्ष नियोक्ताओं और अग्रणी शैक्षणिक संस्थानों से जुड़ें।"
                : "انضم لآلاف المحترفين والشركات الرائدة والمؤسسات الأكاديمية والجامعات على منظومة فائدة."}
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
