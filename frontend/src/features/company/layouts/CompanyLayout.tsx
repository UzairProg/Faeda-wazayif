/**
 * features/company/layouts/CompanyLayout.tsx
 *
 * Authenticated Employer / Company Command Center Layout Shell.
 * Provides responsive sidebar navigation, top header, language toggle, and outlet container.
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
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react"
import { useUnreadCount } from "@/features/chat/hooks/useChat"
import { UnreadBadge } from "@/features/chat/components/UnreadBadge"

export function CompanyLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language, toggleLanguage } = useTranslation()
  const { data: unreadCount = 0 } = useUnreadCount()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const navItems = [
    {
      to: ROUTES.COMPANY.DASHBOARD,
      icon: LayoutDashboard,
      label_ar: "لوحة التحكم",
      label_en: "Dashboard",
      isPrimary: true,
      end: true,
    },
    {
      to: ROUTES.COMPANY.PROFILE,
      icon: Building2,
      label_ar: "ملف المنشأة",
      label_en: "Company Profile",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.JOBS,
      icon: Briefcase,
      label_ar: "إدارة الوظائف",
      label_en: "Jobs & Opportunities",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.APPLICATIONS,
      icon: Users,
      label_ar: "المتقدمين والفرز",
      label_en: "Applications Pipeline",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.TALENT,
      icon: Search,
      label_ar: "استكشاف الكفاءات",
      label_en: "Talent Discovery",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.TEAMS,
      icon: Layers,
      label_ar: "الفرق المهنية",
      label_en: "Professional Teams",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.CHAT,
      icon: MessageSquare,
      label_ar: "الرسائل والمحادثات",
      label_en: "Messages & Chat",
      badgeCount: unreadCount,
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.COMPANY.SETTINGS,
      icon: Settings,
      label_ar: "الإعدادات",
      label_en: "Settings",
      isPrimary: false,
      end: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Topbar / Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-800/80 bg-[#0a101d]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo brand */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white leading-tight tracking-tight flex items-center gap-2">
                <span>فائدة</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {isRTL ? "منشأة" : "Employer"}
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                {isRTL ? "بوابة استقطاب الكفاءات والفرق المهنية" : "Talent Acquisition & Team Hiring Hub"}
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Public Website Link */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
          >
            <span>{isRTL ? "الرئيسية العامة" : "Public Website"}</span>
            {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-all"
            title="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === "ar" ? "EN" : "العربية"}</span>
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase shadow-inner overflow-hidden">
              {(user as any)?.logo ? (
                <img src={(user as any).logo} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name ? user.name.slice(0, 2) : "EM")
              )}
            </div>
            <div className="hidden lg:flex flex-col text-start">
              <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                {user?.name || (isRTL ? "منشأة مسجلة" : "Company")}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <span className="text-[10px] text-slate-400">
                {user?.email || "employer@faeda.jobs"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout (Sidebar + Outlet) ────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Desktop Sidebar ────────────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r rtl:border-r-0 rtl:border-l border-slate-800/80 bg-[#090e1a]/80 p-4 shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isRTL ? "لوحة الإدارة والتنفيذ" : "Employer Workspace"}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const label = isRTL ? item.label_ar : item.label_en

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-lg shadow-emerald-950/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </div>
                  {Boolean(item.badgeCount && item.badgeCount > 0) && (
                    <UnreadBadge count={item.badgeCount} size="sm" />
                  )}
                </NavLink>
              )
            })}
          </div>

          {/* Quick Post Job Action */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
            <Link
              to={ROUTES.COMPANY.JOBS}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? "نشر فرصة جديدة" : "Post Opportunity"}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ───────────────────────────────────── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />

            {/* Content Drawer */}
            <div className="relative flex flex-col justify-between w-72 max-w-[80vw] bg-[#090e1a] border-r rtl:border-r-0 rtl:border-l border-slate-800 p-5 shadow-2xl z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-white">
                    {isRTL ? "قائمة المنشأة" : "Employer Menu"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const label = isRTL ? item.label_ar : item.label_en

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white shadow-md"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{label}</span>
                        </div>
                        {Boolean(item.badgeCount && item.badgeCount > 0) && (
                          <UnreadBadge count={item.badgeCount} size="sm" />
                        )}
                      </NavLink>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Outlet Content Container ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#070b14]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
