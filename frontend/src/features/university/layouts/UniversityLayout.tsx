/**
 * features/university/layouts/UniversityLayout.tsx
 *
 * Authenticated Academic Institution / University Command Center Layout Shell.
 * Provides responsive sidebar navigation, top header, language toggle, and outlet container.
 */
import { useState } from "react"
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useAuthStore } from "@/store/auth.store"
import { useTranslation } from "@/i18n"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ShieldCheck,
  Layers,
  Briefcase,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export function UniversityLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language, toggleLanguage } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const navItems = [
    {
      to: ROUTES.UNIVERSITY.DASHBOARD,
      icon: LayoutDashboard,
      label_ar: "لوحة التحكم الأكاديمية",
      label_en: "Academic Dashboard",
      end: true,
    },
    {
      to: ROUTES.UNIVERSITY.PROFILE,
      icon: GraduationCap,
      label_ar: "الملف المؤسسي",
      label_en: "Institution Profile",
      end: false,
    },
    {
      to: ROUTES.UNIVERSITY.STUDENTS,
      icon: Users,
      label_ar: "دليل الطلاب والخريجين",
      label_en: "Students & Graduates",
      end: false,
    },
    {
      to: ROUTES.UNIVERSITY.VERIFICATIONS,
      icon: ShieldCheck,
      label_ar: "التوثيق الأكاديمي",
      label_en: "Academic Verification",
      end: false,
    },
    {
      to: ROUTES.UNIVERSITY.DEPARTMENTS,
      icon: Layers,
      label_ar: "الأقسام والتخصصات",
      label_en: "Departments & Faculties",
      end: false,
    },
    {
      to: ROUTES.UNIVERSITY.OPPORTUNITIES,
      icon: Briefcase,
      label_ar: "الفرص الوظيفية المرتبطة",
      label_en: "Career Opportunities",
      end: false,
    },
  ]

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Bar for Desktop and Mobile */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#060a16]/90 px-4 md:px-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white font-black text-lg shadow-md shadow-indigo-950/50">
              ف
            </div>
            <span className="font-heading font-black text-lg tracking-tight text-white hidden sm:inline-block">
              FAEDA <span className="text-xs font-semibold text-indigo-400">ACADEMIC</span>
            </span>
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isRTL ? "بوابة الجامعات والمؤسسات التعليمية" : "University Portal"}</span>
          </span>
        </div>

        {/* Right Topbar Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === "ar" ? "English" : "العربية"}</span>
          </button>

          {/* Institution Badge */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-xs font-bold text-white max-w-[140px] truncate">
                {user?.name || (isRTL ? "جامعة معتمدة" : "University")}
              </div>
              <div className="text-[10px] text-slate-400">
                {isRTL ? "شريك أكاديمي موثق" : "Verified Institution"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col justify-between border-e border-slate-800/80 bg-[#060a16]/60 p-4 shrink-0">
          <div className="space-y-6">
            {/* Institution Brand Badge */}
            <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || (isRTL ? "جامعة الملك سعود" : "University")}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user?.email || "academic@faeda.net"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isRTL ? "منظومة التعليم والتوثيق" : "Academic Ecosystem"}
              </div>

              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{isRTL ? item.label_ar : item.label_en}</span>
                    </div>
                    <ChevronIcon className="w-3.5 h-3.5 opacity-40" />
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
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
              } w-72 bg-[#060a16] border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-10`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-heading font-black text-white">
                    FAEDA <span className="text-indigo-400">ACADEMIC</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{isRTL ? item.label_ar : item.label_en}</span>
                        </div>
                      </NavLink>
                    )
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#040711] p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
