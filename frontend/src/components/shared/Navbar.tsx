import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const links = [
    { label: "الرئيسية", href: "/" },
    { label: "عن فائدة", href: "/about" },
    { label: "الوظائف", href: "/jobs" },
    { label: "الشركات", href: "/companies" },
    { label: "الخدمات", href: "/services" },
    { label: "تواصل معنا", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Right side (RTL Start) - Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="font-heading text-2xl font-bold">ف</span>
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white hidden sm:block">
            منصة فائدة
          </span>
        </Link>
        
        {/* Center - Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/5 hover:text-white",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="block h-0.5 w-full bg-primary mt-1 rounded-full absolute bottom-4" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Left side (RTL End) - Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full">
            <User className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-full h-10 px-4 ml-2">
            <span>العربية</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          
          <Link to="/login">
            <Button className="rounded-full h-10 px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              تسجيل دخول
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/5 bg-background">
          <div className="container mx-auto flex flex-col p-4 gap-2">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg text-base font-medium text-muted-foreground hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px w-full bg-white/5 my-2" />
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="outline" className="w-full justify-center bg-white/5 border-white/10 text-white rounded-full">
                English
              </Button>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center rounded-full bg-primary text-primary-foreground">
                  تسجيل دخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
