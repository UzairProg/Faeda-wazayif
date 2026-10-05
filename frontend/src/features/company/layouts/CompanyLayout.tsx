/**
 * features/company/layouts/CompanyLayout.tsx
 *
 * Authenticated Employer / Company Command Center Layout Shell.
 * Matches the University layout design — dark navy, grouped sidebar, sign-out in footer.
 */
import { useState } from "react"
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Search,
  Layers,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Target,
  CreditCard,
} from "lucide-react"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"
import { useUnreadCount } from "@/features/chat/hooks/useChat"
import { UnreadBadge } from "@/features/chat/components/UnreadBadge"

export function CompanyLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language } = useTranslation()
  const { data: unreadCount = 0 } = useUnreadCount()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const navSections = [
    {
      title: L("الرئيسية", "OVERVIEW", "मुख्य"),
      items: [
        { to: ROUTES.COMPANY.DASHBOARD, icon: LayoutDashboard, label: L("لوحة التحكم والأداء", "Performance Dashboard", "प्रदर्शन डैशबोर्ड"), end: true },
      ],
    },
    {
      title: L("المنشأة", "EMPLOYER", "नियोक्ता"),
      items: [
        { to: ROUTES.COMPANY.PROFILE, icon: Building2, label: L("ملف المنشأة", "Company Profile", "कंपनी प्रोफ़ाइल"), end: false },
        { to: ROUTES.COMPANY.JOBS, icon: Briefcase, label: L("إدارة الوظائف", "Jobs & Opportunities", "नौकरियां"), end: false },
        { to: ROUTES.COMPANY.APPLICATIONS, icon: Users, label: L("المتقدمون والفرز", "Applications Pipeline", "आवेदन"), end: false },
      ],
    },
    {
      title: L("التوظيف والاستقطاب", "TALENT", "प्रतिभा"),
      items: [
        { to: ROUTES.COMPANY.CAMPAIGNS, icon: Target, label: L("الحملات الوظيفية", "Talent Campaigns", "भर्ती अभियान"), end: false },
        { to: ROUTES.COMPANY.TALENT, icon: Search, label: L("استكشاف الكفاءات", "Talent Discovery", "प्रतिभा खोज"), end: false },
        { to: ROUTES.COMPANY.TEAMS, icon: Layers, label: L("الفرق المهنية", "Professional Teams", "टीमें"), end: false },
      ],
    },
    {
      title: L("التواصل", "COMMUNICATION", "संवाद"),
      items: [
        { to: ROUTES.COMPANY.CHAT, icon: MessageSquare, label: L("الرسائل والمحادثات", "Messages & Chat", "संदेश"), end: false, badgeCount: unreadCount },
      ],
    },
    {
      title: L("الإدارة", "MANAGEMENT", "प्रबंधन"),
      items: [
        { to: ROUTES.COMPANY.SETTINGS, icon: Settings, label: L("الإعدادات", "Settings", "सेटिंग"), end: false },
        { to: ROUTES.COMPANY.BILLING, icon: CreditCard, label: L("الاشتراك والفوترة", "Billing & Plans", "बिलिंग"), end: false },
      ],
    },
  ]

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-[#081628]/95 px-4 md:px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-3 group">
            <img
              src={faedaWhiteLogo}
              alt="Faeda Jobs Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-secondary">
              {L("منشأة", "Employer", "नियोक्ता")}
            </span>
          </Link>
        </div>

        {/* Right Topbar Controls */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="compact" dropdownAlign="end" />

          <div className="hidden sm:flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-secondary font-bold text-xs overflow-hidden">
              {(user as any)?.logo ? (
                <img src={(user as any).logo} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}
            </div>
            <div className="text-start">
              <div className="text-xs font-bold text-white max-w-[140px] truncate">
                {user?.name || L("منشأة معتمدة", "Verified Employer", "सत्यापित नियोक्ता")}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {L("شريك توظيف موثق", "Verified Hiring Partner", "सत्यापित भर्ती भागीदार")}
              </div>
            </div>

            {/* Sign Out button — same as Candidate */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title={L("تسجيل الخروج", "Sign Out", "साइन आउट")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Workspace Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col justify-between border-e border-border bg-[#081628]/90 p-4 shrink-0">
          <div className="space-y-6">
            {/* Company Brand Badge */}
            <div className="p-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25 font-bold overflow-hidden">
                  {(user as any)?.logo ? (
                    <img src={(user as any).logo} alt={user?.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || L("شركة فائدة للتوظيف", "Faeda Employer", "फाएदा नियोक्ता")}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {user?.email || "employer@faeda.jobs"}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Post Job Action */}
            <Link
              to={ROUTES.COMPANY.JOBS}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-secondary font-bold text-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{L("نشر فرصة جديدة", "Post Opportunity", "अवसर पोस्ट करें")}</span>
            </Link>

            {/* Navigation Menu — grouped sections */}
            <nav className="space-y-4">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-primary/20 text-secondary border border-primary/30 shadow-sm"
                              : "text-muted-foreground hover:text-white hover:bg-card/50"
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Boolean((item as any).badgeCount && (item as any).badgeCount > 0) && (
                            <UnreadBadge count={(item as any).badgeCount} size="sm" />
                          )}
                          <ChevronIcon className="w-3 h-3 opacity-40" />
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer — Sign Out */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{L("تسجيل الخروج", "Sign Out", "साइन आउट")}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div
              className={`fixed top-0 bottom-0 ${
                isRTL ? "right-0" : "left-0"
              } w-72 bg-[#081628] border-border p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="font-heading font-black text-white">
                    FAEDA <span className="text-secondary">EMPLOYER</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-card"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {section.title}
                      </div>
                      {section.items.map((item) => {
                        const Icon = item.icon
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                  ? "bg-primary/20 text-secondary border border-primary/30"
                                  : "text-muted-foreground hover:text-white hover:bg-card/50"
                              }`
                            }
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            {Boolean((item as any).badgeCount && (item as any).badgeCount > 0) && (
                              <UnreadBadge count={(item as any).badgeCount} size="sm" />
                            )}
                          </NavLink>
                        )
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{L("تسجيل الخروج", "Sign Out", "साइन आउट")}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
