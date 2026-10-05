/**
 * features/admin/layouts/AdminLayout.tsx
 *
 * Master layout for the Faeda Admin Governance Console.
 * Matches the University layout design — dark navy, grouped sidebar, sign-out in footer.
 * Enhanced with real-time pending moderation badges, glassmorphic telemetry header, and active glows.
 */
import { useState } from "react"
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { adminService } from "../services/admin.service"
import {
  LayoutDashboard,
  Database,
  Users,
  Briefcase,
  ScrollText,
  ShieldAlert,
  Settings,
  FolderTree,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language } = useTranslation()
  const navigate = useNavigate()

  // Optional background fetch for live sidebar badges (cached, 60s stale)
  const { data: dashboardData } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
    staleTime: 60000,
  })

  const pendingJobsCount = dashboardData?.stats?.pending_jobs || 0
  const pendingReportsCount = dashboardData?.stats?.pending_reports || 0

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

  const navSections = [
    {
      title: L("النظرة العامة", "OVERVIEW", "अवलोकन"),
      items: [
        {
          to: ROUTES.ADMIN.DASHBOARD,
          icon: LayoutDashboard,
          label: L("لوحة التحليلات", "Analytics Dashboard", "एनालिटिक्स डैशबोर्ड"),
          end: true,
          badge: null,
        },
      ],
    },
    {
      title: L("إدارة المستخدمين والمحتوى", "USERS & CONTENT", "उपयोगकर्ता एवं सामग्री"),
      items: [
        {
          to: ROUTES.ADMIN.USERS,
          icon: Users,
          label: L("إدارة المستخدمين", "User Management", "उपयोगकर्ता प्रबंधन"),
          end: false,
          badge: null,
        },
        {
          to: ROUTES.ADMIN.JOBS,
          icon: Briefcase,
          label: L("مراجعة الوظائف", "Job Moderation", "नौकरी समीक्षा"),
          end: false,
          badge: pendingJobsCount > 0 ? { count: pendingJobsCount, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" } : null,
        },
        {
          to: ROUTES.ADMIN.CATEGORIES,
          icon: FolderTree,
          label: L("الفلاتر والتصنيفات", "Taxonomy & Filters", "वर्गीकरण एवं फ़िल्टर"),
          end: false,
          badge: null,
        },
      ],
    },
    {
      title: L("المراقبة والامتثال", "MONITORING", "निगरानी एवं अनुपालन"),
      items: [
        {
          to: ROUTES.ADMIN.REPORTS,
          icon: ShieldAlert,
          label: L("البلاغات وتذاكر الدعم", "Reports & Tickets", "रिपोर्ट एवं टिकट"),
          end: false,
          badge: pendingReportsCount > 0 ? { count: pendingReportsCount, color: "bg-rose-500/20 text-rose-300 border-rose-500/30" } : null,
        },
        {
          to: ROUTES.ADMIN.AUDIT_LOGS,
          icon: ScrollText,
          label: L("سجل التدقيق الأمني", "Audit Trail", "ऑडिट ट्रेल"),
          end: false,
          badge: null,
        },
      ],
    },
    {
      title: L("البيانات والإعدادات", "DATA & SETTINGS", "डेटा एवं सेटिंग्स"),
      items: [
        {
          to: "/admin/market-data",
          icon: Database,
          label: L("بيانات السوق والرواتب", "Market & Salary Data", "बाज़ार एवं वेतन डेटा"),
          end: false,
          badge: null,
        },
        {
          to: ROUTES.ADMIN.SETTINGS,
          icon: Settings,
          label: L("إعدادات المنصة", "Platform Settings", "प्लेटफ़ॉर्म सेटिंग्स"),
          end: false,
          badge: null,
        },
      ],
    },
  ]

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#081628]/95 px-4 md:px-8 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-card/80 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-3 group">
            <img
              src={faedaWhiteLogo}
              alt="Faeda Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-secondary">
              <Sparkles className="w-3 h-3" />
              {L("لوحة الإدارة والحوكمة", "Admin Console")}
            </span>
          </Link>
        </div>

        {/* Right Topbar Controls */}
        <div className="flex items-center gap-3">
          {/* View Live Site */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-card/50 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            <span>{L("معاينة المنصة", "View Live Site")}</span>
          </Link>

          <LanguageSelector variant="compact" dropdownAlign="end" />

          {/* Admin User Capsule */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/30 text-secondary font-bold text-xs shadow-md">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="text-start">
              <div className="text-xs font-bold text-white max-w-[140px] truncate flex items-center gap-1">
                {user?.name || L("مدير النظام", "System Admin")}
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              </div>
              <div className="text-[10px] text-muted-foreground">
                {user?.email || "admin@faeda.jobs"}
              </div>
            </div>

            {/* Sign Out button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title={L("تسجيل الخروج", "Sign Out")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Workspace Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col justify-between border-e border-white/10 bg-[#081628]/95 p-4 shrink-0 shadow-xl">
          <div className="space-y-6">
            {/* Admin Brand Telemetry Badge */}
            <div className="p-3.5 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-secondary border border-primary/30 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || L("مدير النظام", "System Admin")}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    <span>{L("النظام: تشغيل طبيعي", "Core Engine: Online")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu — grouped sections */}
            <nav className="space-y-4">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
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
                          `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-primary/25 to-secondary/15 text-white border border-primary/40 shadow-md shadow-primary/10"
                              : "text-muted-foreground hover:text-white hover:bg-card/50 hover:border hover:border-white/5"
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badge.color}`}>
                              {item.badge.count}
                            </span>
                          )}
                          <ChevronIcon className="w-3 h-3 opacity-30 group-hover:opacity-80 transition-opacity" />
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer — Sign Out */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{L("تسجيل الخروج", "Sign Out")}</span>
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
              } w-72 bg-[#081628] border-r border-white/10 p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="font-heading font-black text-white text-base">
                    FAEDA <span className="text-secondary">ADMIN</span>
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
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
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
                              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
                            {item.badge && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badge.color}`}>
                                {item.badge.count}
                              </span>
                            )}
                          </NavLink>
                        )
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{L("تسجيل الخروج", "Sign Out")}</span>
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
