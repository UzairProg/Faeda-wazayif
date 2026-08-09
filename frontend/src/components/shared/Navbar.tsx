/**
 * components/shared/Navbar.tsx
 *
 * Sticky top navigation bar for Faeda Jobs.
 * Features an interactive language dropdown switcher (العربية ↔ English),
 * RTL/LTR mirroring, accessible ARIA semantics, keyboard controls,
 * and localized navigation links.
 */
import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Bell, User, Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import type { Language } from "@/store/language.store"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-gradient-to-r from-background/95 via-[#0A2D8F]/15 to-background/95 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-heading text-2xl font-bold">ف</span>
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white hidden sm:block">
            {language === "ar" ? "منصة فائدة" : "Faeda Jobs"}
          </span>
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

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full" aria-label="User profile">
            <User className="h-5 w-5" />
          </Button>

          {/* Interactive Language Dropdown */}
          <div ref={langContainerRef} className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
              className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full h-10 px-4"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="font-semibold text-xs">{language === "ar" ? "العربية" : "English"}</span>
              <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", langMenuOpen && "rotate-180")} />
            </Button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute end-0 top-full mt-2 w-36 py-1 z-50 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/5"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === "ar"}
                    onClick={() => handleSelectLanguage("ar")}
                    className={cn(
                      "w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors text-start",
                      language === "ar" ? "bg-primary/20 text-primary font-bold" : "text-white/90 hover:bg-white/5"
                    )}
                  >
                    <span>العربية</span>
                    {language === "ar" && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={language === "en"}
                    onClick={() => handleSelectLanguage("en")}
                    className={cn(
                      "w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors text-start",
                      language === "en" ? "bg-primary/20 text-primary font-bold" : "text-white/90 hover:bg-white/5"
                    )}
                  >
                    <span>English</span>
                    {language === "en" && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Button */}
          <Link to={ROUTES.AUTH.LOGIN}>
            <Button className="rounded-full h-10 px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 text-xs sm:text-sm">
              {t("common.nav.login")}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/5 bg-background">
          <div className="container mx-auto flex flex-col p-4 gap-2 text-start">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg text-base font-medium text-muted-foreground hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px w-full bg-white/5 my-2" />

            <div className="flex flex-col gap-3 pt-2">
              {/* Mobile Language Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectLanguage("ar")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    language === "ar" ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-white"
                  )}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage("en")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    language === "en" ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-white"
                  )}
                >
                  English
                </button>
              </div>

              <Link to={ROUTES.AUTH.LOGIN} onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {t("common.nav.login")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
