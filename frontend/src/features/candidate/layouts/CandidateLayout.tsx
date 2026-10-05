/**
 * features/candidate/layouts/CandidateLayout.tsx
 *
 * Authenticated Candidate Command Center Layout Shell.
 * Upgraded with futuristic telemetry header, live career readiness indicator,
 * glowing active navigation indicators, and full trilingual (Arabic, English, Hindi) support.
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
  Sparkles,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Rocket,
  GraduationCap,
} from "lucide-react"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"
import { useUnreadCount } from "@/features/chat/hooks/useChat"
import { UnreadBadge } from "@/features/chat/components/UnreadBadge"

export function CandidateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language } = useTranslation()
  const { data: unreadCount = 0 } = useUnreadCount()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const localize = (ar: string, en: string, hi?: string) => {
    if (language === "ar") return ar
    if (language === "hi") return hi || en
    return en
  }

  interface CandidateNavItem {
    to: string
    icon: any
    label: string
    isPrimary?: boolean
    end?: boolean
    badgeCount?: number
    isUpcoming?: boolean
  }

  const navItems: CandidateNavItem[] = [
    {
      to: ROUTES.CANDIDATE.ROOT,
      icon: LayoutDashboard,
      label: localize("لوحة التحكم", "Dashboard", "डैशबोर्ड"),
      isPrimary: true,
      end: true,
    },
    {
      to: ROUTES.CANDIDATE.MARKET_VALUE,
      icon: TrendingUp,
      label: localize("حاسبة القيمة السوقية", "Market Value Calculator", "बाजार मूल्य कैलकुलेटर"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.PROFILE,
      icon: User,
      label: localize("الملف المهني", "My Profile", "मेरी प्रोफ़ाइल"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.JOBS,
      icon: Compass,
      label: localize("استكشاف الفرص", "Explore Jobs", "नौकरियां खोजें"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.APPLICATIONS,
      icon: Briefcase,
      label: localize("طلبات التقديم", "My Applications", "मेरे आवेदन"),
      isPrimary: true,
      end: false,
    },
    {
      to: "/candidate/coop-training",
      icon: GraduationCap,
      label: localize("التدريب التعاوني والإشراف", "Co-op Training & Supervision", "सहकारी प्रशिक्षण और पर्यवेक्षण"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.SAVED_JOBS,
      icon: Bookmark,
      label: localize("الوظائف المحفوظة", "Saved Jobs", "सहेजी गई नौकरियां"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.TEAMS,
      icon: Users,
      label: localize("فرقي المهنية", "My Teams", "मेरी टीमें"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.CAMPAIGNS,
      icon: Rocket,
      label: localize("حملاتي التسويقية", "My Campaigns", "मेरे अभियान"),
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.CHAT,
      icon: MessageSquare,
      label: localize("الرسائل والمحادثات", "Messages", "संदेश एवं चैट"),
      badgeCount: unreadCount,
      isPrimary: true,
      end: false,
    },
    {
      to: ROUTES.CANDIDATE.SETTINGS,
      icon: Settings,
      label: localize("الإعدادات", "Settings", "सेटिंग्स"),
      isPrimary: true,
      end: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* ── Topbar / Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#081628]/95 px-4 sm:px-6 md:px-8 backdrop-blur-xl shadow-lg shadow-black/20">
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

          {/* Official Faeda Brand Logo */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img
              src={faedaWhiteLogo}
              alt="Faeda Jobs Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-secondary">
              <Sparkles className="w-3 h-3" />
              {localize("مرشح", "Candidate", "उम्मीदवार")}
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Public Website Link */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-card/50 transition-all"
          >
            <span>{localize("الرئيسية", "Home", "होम")}</span>
            {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>

          {/* Language Selector */}
          <LanguageSelector variant="compact" dropdownAlign="end" />

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-white/10">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/30 flex items-center justify-center text-secondary font-bold text-xs uppercase shadow-md">
              {user?.name ? user.name.slice(0, 2) : "FA"}
            </div>
            <div className="hidden lg:flex flex-col text-start">
              <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                {user?.name || localize("مرشح فائدة", "Faeda Talent", "फ़ायदा उम्मीदवार")}
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                {user?.email || "candidate@faeda.jobs"}
              </span>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title={localize("تسجيل الخروج", "Sign Out", "साइन आउट")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main App Shell ─────────────────────────────────────────────── */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 py-4 sm:py-6 gap-6">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-5">
          {/* Live Candidate Status Banner in Sidebar */}
          <div className="p-3.5 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md shadow-inner">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/30 to-secondary/30 text-secondary border border-secondary/30 font-bold shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || localize("كفاءة فائدة", "Talent Profile", "प्रतिभा प्रोफ़ाइल")}
                </div>
                <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="text-emerald-400 font-semibold">{localize("متاح للتوظيف والفرص", "Open to Work", "अवसरों हेतु उपलब्ध")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Links Card */}
          <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md p-3 shadow-xl">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {localize("مساحة المرشح", "Candidate Workspace", "उम्मीदवार कार्यक्षेत्र")}
            </div>

            <nav className="flex flex-col gap-1 mt-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={Boolean(item.end)}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-primary/25 to-secondary/15 text-white border border-primary/40 shadow-md shadow-primary/10"
                          : "text-muted-foreground hover:text-white hover:bg-card/50 hover:border hover:border-white/5"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
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
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-secondary/10 p-4 text-center shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3 text-secondary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white font-heading mb-1">
              {localize("الذكاء المهني الموثوق", "Trusted Career Intelligence", "विश्वसनीय करियर बुद्धिमत्ता")}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              {localize(
                "بياناتك المهنية محمية ومشفّرة. تحكم في خصوصيتك وسيرتك الذاتية بكل شفافية.",
                "Your career data is encrypted & protected. Control your privacy and CV transparently.",
                "आपका व्यावसायिक डेटा सुरक्षित और एन्क्रिप्टेड है। अपनी गोपनीयता और सीवी पर पूर्ण नियंत्रण रखें।"
              )}
            </p>
            <div className="text-[10px] text-secondary font-bold px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30 inline-block shadow-sm">
              {localize("نظام معتمد للسوق السعودي 🇸🇦", "Certified for Saudi Market 🇸🇦", "सऊदी मार्केट हेतु प्रमाणित 🇸🇦")}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="w-72 max-w-[85%] bg-[#081628] border-r border-white/10 h-full p-5 flex flex-col gap-4 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src={faedaWhiteLogo}
                    alt="Faeda Jobs Logo"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-secondary">
                    {localize("مرشح", "Candidate", "उम्मीदवार")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-muted-foreground hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={Boolean(item.end)}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-primary/20 text-secondary border border-primary/30"
                            : "text-muted-foreground hover:text-white hover:bg-card/50"
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

              <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
                <div className="px-1 py-1">
                  <LanguageSelector variant="default" dropdownAlign="start" className="w-full" />
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{localize("تسجيل الخروج", "Sign Out", "साइन आउट")}</span>
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
