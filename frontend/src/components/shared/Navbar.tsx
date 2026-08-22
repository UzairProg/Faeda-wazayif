/**
 * components/shared/Navbar.tsx
 *
 * Sticky top navigation bar for Faeda Jobs.
 * Features an interactive trilingual language dropdown switcher (العربية ↔ English ↔ हिन्दी),
 * RTL/LTR mirroring, accessible ARIA semantics, keyboard controls,
 * official white Faeda logo, and localized navigation links.
 */
import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Bell, User, Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import type { Language } from "@/store/language.store"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()

  const langContainerRef = useRef<HTMLDivElement>(null)

  const links = [
    { label: t("common.nav.home"), href: "/" },
    { label: t("common.nav.jobs"), href: "/jobs" },
    { label: t("common.nav.companies"), href: "/companies" },
    { label: t("common.nav.teams"), href: "/teams" },
    { label: t("common.nav.about"), href: "/about" },
    { label: t("common.nav.contact"), href: "/contact" },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langContainerRef.current && !langContainerRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang)
    setLangMenuOpen(false)
  }

  const getLangLabel = (lang: Language) => {
    if (lang === "ar") return "العربية"
    if (lang === "hi") return "हिन्दी"
    return "English"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-gradient-to-r from-background/95 via-[#0A2D8F]/15 to-background/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Official Faeda White Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={faedaWhiteLogo}
            alt="Faeda Jobs Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href !== "/" && location.pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors hover:text-white group",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 start-0 end-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(18,75,201,0.5)]"
                  />
                )}
                {!isActive && (
                  <span className="absolute -bottom-2 start-0 end-0 h-0.5 bg-primary/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Actions & Trilingual Selector */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Trilingual Language Selector Dropdown */}
          <div className="relative" ref={langContainerRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span>{getLangLabel(language)}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", langMenuOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 mt-2 w-40 rounded-2xl bg-card/95 border border-white/10 p-1.5 shadow-2xl backdrop-blur-xl z-50 text-start"
                >
                  <button
                    onClick={() => handleSelectLanguage("ar")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors",
                      language === "ar" ? "bg-primary/20 text-primary font-bold" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>العربية</span>
                    {language === "ar" && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>

                  <button
                    onClick={() => handleSelectLanguage("en")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors mt-0.5",
                      language === "en" ? "bg-primary/20 text-primary font-bold" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>English</span>
                    {language === "en" && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>

                  <button
                    onClick={() => handleSelectLanguage("hi")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors mt-0.5",
                      language === "hi" ? "bg-primary/20 text-primary font-bold" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>हिन्दी</span>
                    {language === "hi" && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/20">
                <Link
                  to={
                    user.role === "company"
                      ? ROUTES.COMPANY.DASHBOARD
                      : user.role === "admin"
                      ? ROUTES.ADMIN.ROOT
                      : ROUTES.CANDIDATE.PROFILE
                  }
                >
                  <User className="h-3.5 w-3.5 me-1.5" />
                  <span>
                    {user.role === "company"
                      ? "لوحة الشركة"
                      : user.role === "admin"
                      ? "لوحة الإدارة"
                      : "مساحة المرشح"}
                  </span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="rounded-xl border-white/10 bg-white/5 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10"
              >
                {t("common.nav.logout")}
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-xs text-white hover:bg-white/10">
                <Link to={ROUTES.AUTH.LOGIN}>{t("common.nav.login")}</Link>
              </Button>

              <Button asChild size="sm" className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                <Link to={ROUTES.AUTH.REGISTER}>{t("common.nav.register")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-white rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Language Switcher (AR / EN / HI) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs text-muted-foreground px-1 font-semibold">{t("common.nav.language")}:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectLanguage("ar")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center",
                    language === "ar" ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  العربية
                </button>
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center",
                    language === "en" ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  English
                </button>
                <button
                  onClick={() => handleSelectLanguage("hi")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center",
                    language === "hi" ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Button asChild className="w-full justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                    <Link
                      to={
                        user.role === "company"
                          ? ROUTES.COMPANY.DASHBOARD
                          : user.role === "admin"
                          ? ROUTES.ADMIN.ROOT
                          : ROUTES.CANDIDATE.PROFILE
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 me-2" />
                      {user.role === "company"
                        ? "لوحة الشركة"
                        : user.role === "admin"
                        ? "لوحة الإدارة"
                        : "مساحة المرشح"}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full justify-center rounded-xl border-white/10 bg-white/5 text-rose-300 hover:text-rose-200"
                  >
                    {t("common.nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full justify-center rounded-xl border-white/10 bg-white/5 text-white">
                    <Link to={ROUTES.AUTH.LOGIN} onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 me-2" />
                      {t("common.nav.login")}
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
                    <Link to={ROUTES.AUTH.REGISTER} onClick={() => setIsOpen(false)}>
                      {t("common.nav.register")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
