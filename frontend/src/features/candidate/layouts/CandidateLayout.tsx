/**
 * features/candidate/layouts/CandidateLayout.tsx
 *
 * Authenticated Candidate Command Center Layout Shell.
 * Provides sidebar navigation, responsive topbar, language toggle, and outlet container.
 */
import { useState } from "react"
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import {
  User,
  LayoutDashboard,
  Briefcase,
  Bookmark,
  Compass,
  Users,
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
} from "lucide-react"
import { useUnreadCount } from "@/features/chat/hooks/useChat"
import { UnreadBadge } from "@/features/chat/components/UnreadBadge"

export function CandidateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { t, isRTL, language, toggleLanguage } = useTranslation()
  const { data: unreadCount = 0 } = useUnreadCount()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const navItems = [
    {
      to: ROUTES.CANDIDATE.ROOT,
      icon: LayoutDashboard,
      label: t("candidate.shell.nav.overview"),
      isPrimary: true,
      end: true,
    },
    {
      to: ROUTES.CANDIDATE.PROFILE,
      icon: User,
      label: t("candidate.shell.nav.profile"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.JOBS,
      icon: Compass,
      label: isRTL ? "استكشاف الفرص" : "Explore Jobs",
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.APPLICATIONS,
      icon: Briefcase,
      label: t("candidate.shell.nav.applications"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.SAVED_JOBS,
      icon: Bookmark,
      label: t("candidate.shell.nav.savedJobs"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.TEAMS,
      icon: Users,
      label: t("candidate.shell.nav.teams"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.CHAT,
      icon: MessageSquare,
      label: isRTL ? "الرسائل والمحادثات" : "Messages",
      badgeCount: unreadCount,
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.SETTINGS,
      icon: Settings,
      label: t("candidate.shell.nav.settings"),
      isUpcoming: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-primary/30">
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-sky-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white leading-tight tracking-tight">
                فائدة <span className="text-primary text-xs font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">مرشح</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                {t("candidate.shell.tagline")}
              </span>
            </div>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Public Website Link */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
          >
            <span>{t("common.nav.home")}</span>
            {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-all"
            title="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{language === "ar" ? "EN" : "العربية"}</span>
          </button>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-800">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
              {user?.name ? user.name.slice(0, 2) : "FA"}
            </div>
            <div className="hidden lg:flex flex-col text-start">
              <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                {user?.name || "مرشح فائدة"}
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              </span>
              <span className="text-[10px] text-slate-400">
                {user?.email || "candidate@faeda.jobs"}
              </span>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title={t("candidate.shell.nav.logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main App Shell ─────────────────────────────────────────────── */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-4 sm:py-6 gap-6">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          {/* Nav Links Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0b1220]/80 backdrop-blur-md p-3 shadow-xl">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("candidate.shell.brand")}
            </div>

            <nav className="flex flex-col gap-1 mt-1">
              {navItems.map((item) => {
                const Icon = item.icon
                if (item.isUpcoming) {
                  return (
                    <div
                      key={item.to}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 transition-all cursor-default select-none opacity-80"
                      title={t("candidate.shell.upcomingNotice")}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                        {t("common.states.comingSoon")}
                      </span>
                    </div>
                  )
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={Boolean(item.end)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/25 font-bold"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {Boolean(item.badgeCount && item.badgeCount > 0) && (
                      <UnreadBadge count={item.badgeCount} size="sm" />
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Quick Help / Confidence Card */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-slate-900/60 to-sky-900/20 p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-xs font-bold text-white font-heading mb-1">
              الذكاء المهني الموثوق
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              بياناتك المهنية محمية ومشفّرة. تحكم في خصوصيتك وسيرتك الذاتية بكل شفافية.
            </p>
            <div className="text-[10px] text-sky-400 font-semibold px-2 py-1 rounded-full bg-sky-400/10 border border-sky-400/20 inline-block">
              نظام معتمد للسوق السعودي 🇸🇦
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-72 max-w-[85%] bg-[#0a101d] border-e border-slate-800 h-full p-4 flex flex-col gap-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm">مساحة المرشح</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  if (item.isUpcoming) {
                    return (
                      <div
                        key={item.to}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed opacity-75"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span>{item.label}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t("common.states.comingSoon")}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={Boolean(item.end)}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {Boolean(item.badgeCount && item.badgeCount > 0) && (
                        <UnreadBadge count={item.badgeCount} size="sm" />
                      )}
                    </NavLink>
                  )
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800/60"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    اللغة / Language
                  </span>
                  <span className="font-bold text-primary">{language === "ar" ? "English" : "العربية"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("candidate.shell.nav.logout")}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-3 sm:px-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
