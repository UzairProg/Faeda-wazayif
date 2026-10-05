/**
 * components/shared/Navbar.tsx
 *
 * Sticky top navigation bar for Faeda Jobs.
 * Features an interactive trilingual language dropdown switcher (العربية ↔ English ↔ हिन्दी),
 * RTL/LTR mirroring, accessible ARIA semantics, keyboard controls,
 * official white Faeda logo, and localized navigation links.
 */
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import { useAuthStore } from "@/store/auth.store"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import { NotificationsPopover } from "@/components/shared/NotificationsPopover"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()
  const { user, isAuthenticated, logout } = useAuthStore()

  const links = [
    { label: t("common.nav.home"), href: "/" },
    { label: t("common.nav.jobs"), href: "/jobs" },
    { label: t("common.nav.companies"), href: "/companies" },
    { label: t("common.nav.teams"), href: "/teams" },
    { label: language === "ar" ? "المقالات" : language === "hi" ? "लेख" : "Articles", href: "/posts" },
    { label: t("common.nav.about"), href: "/about" },
    { label: t("common.nav.contact"), href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-gradient-to-r from-background/95 via-[#0A2D8F]/15 to-background/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Official Faeda White Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 py-1">
          <img
            src={faedaWhiteLogo}
            alt="Faeda Jobs Logo"
            className="h-12 sm:h-14 lg:h-16 w-auto max-h-[64px] object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
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
          {/* Trilingual Language Selector */}
          <LanguageSelector variant="default" dropdownAlign="end" />

          {/* Social Notifications Popover */}
          <NotificationsPopover />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-white shadow-md shadow-primary/20">
                <Link
                  to={
                    user.role === "company"
                      ? ROUTES.COMPANY.DASHBOARD
                      : user.role === "university"
                      ? ROUTES.UNIVERSITY.DASHBOARD
                      : user.role === "admin"
                      ? ROUTES.ADMIN.ROOT
                      : ROUTES.CANDIDATE.DASHBOARD
                  }
                >
                  <User className="h-3.5 w-3.5 me-1.5" />
                  <span>
                    {user.role === "company"
                      ? language === "en" ? "Company Dashboard" : "لوحة الشركة"
                      : user.role === "university"
                      ? language === "en" ? "University Portal" : "بوابة الجامعة"
                      : user.role === "admin"
                      ? language === "en" ? "Admin Console" : "لوحة الإدارة"
                      : language === "en" ? "Candidate Dashboard" : "مساحة المرشح"}
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
                  onClick={() => setLanguage("ar")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5",
                    language === "ar" ? "bg-primary text-white border-primary shadow-sm" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  <span>🇸🇦 العربية</span>
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5",
                    language === "en" ? "bg-primary text-white border-primary shadow-sm" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  <span>🇺🇸 English</span>
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5",
                    language === "hi" ? "bg-primary text-white border-primary shadow-sm" : "bg-white/5 border-white/10 text-muted-foreground"
                  )}
                >
                  <span>🇮🇳 हिन्दी</span>
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
                          : user.role === "university"
                          ? ROUTES.UNIVERSITY.DASHBOARD
                          : user.role === "admin"
                          ? ROUTES.ADMIN.ROOT
                          : ROUTES.CANDIDATE.DASHBOARD
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 me-2" />
                      {user.role === "company"
                        ? language === "en" ? "Company Dashboard" : "لوحة الشركة"
                        : user.role === "university"
                        ? language === "en" ? "University Portal" : "بوابة الجامعة"
                        : user.role === "admin"
                        ? language === "en" ? "Admin Console" : "لوحة الإدارة"
                        : language === "en" ? "Candidate Dashboard" : "مساحة المرشح"}
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
