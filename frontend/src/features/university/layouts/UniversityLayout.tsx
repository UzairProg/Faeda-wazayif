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
  ChevronRight,
  ChevronLeft,
  Rocket,
  Lightbulb,
  UserCheck,
  BookOpen,
  Settings,
} from "lucide-react"
import { LanguageSelector } from "@/components/shared/LanguageSelector"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

export function UniversityLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isRTL, language } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const navSections = [
    {
      title_ar: "الجامعة",
      title_en: "UNIVERSITY",
      title_hi: "विश्वविद्यालय",
      items: [
        {
          to: ROUTES.UNIVERSITY.DASHBOARD,
          icon: LayoutDashboard,
          label_ar: "لوحة التحكم والأداء",
          label_en: "Performance Dashboard",
          label_hi: "प्रदर्शन डैशबोर्ड",
          end: true,
        },
      ],
    },
    {
      title_ar: "القطاع الأكاديمي",
      title_en: "ACADEMIC",
      title_hi: "अकादमिक",
      items: [
        {
          to: ROUTES.UNIVERSITY.DEPARTMENTS,
          icon: Layers,
          label_ar: "الأقسام والبرامج الأكاديمية",
          label_en: "Departments & Programs",
          label_hi: "विभाग और कार्यक्रम",
          end: false,
        },
        {
          to: ROUTES.UNIVERSITY.UPDATES,
          icon: BookOpen,
          label_ar: "التحديثات والمناهج",
          label_en: "Academic Updates",
          label_hi: "शैक्षणिक अपडेट",
          end: false,
        },
      ],
    },
    {
      title_ar: "البحث والابتكار",
      title_en: "RESEARCH & INNOVATION",
      title_hi: "अनुसंधान और नवाचार",
      items: [
        {
          to: ROUTES.UNIVERSITY.CAMPAIGNS,
          icon: Rocket,
          label_ar: "حملات الأطروحات والابتكار",
          label_en: "Theses & Innovations",
          label_hi: "थीसिस और नवाचार अभियान",
          end: false,
        },
      ],
    },
    {
      title_ar: "التوظيف والمخرجات",
      title_en: "EMPLOYMENT",
      title_hi: "रोजगार और पूर्व छात्र",
      items: [
        {
          to: ROUTES.UNIVERSITY.STUDENTS,
          icon: Users,
          label_ar: "دليل الطلاب والخريجين",
          label_en: "Students & Graduates",
          label_hi: "छात्र और पूर्व छात्र",
          end: false,
        },
        {
          to: ROUTES.UNIVERSITY.OPPORTUNITIES,
          icon: Briefcase,
          label_ar: "فرص العمل والشراكات",
          label_en: "Career Opportunities",
          label_hi: "करियर के अवसर",
          end: false,
        },
      ],
    },
    {
      title_ar: "الريادة وحاضنات الأعمال",
      title_en: "ENTREPRENEURSHIP",
      title_hi: "उद्यमिता और इनक्यूबेटर",
      items: [
        {
          to: ROUTES.UNIVERSITY.INCUBATOR,
          icon: Lightbulb,
          label_ar: "حاضنة منشآت والشركات",
          label_en: "Monsha'at Incubator",
          label_hi: "मनशाआत इनक्यूबेटर",
          end: false,
        },
      ],
    },
    {
      title_ar: "التدريب التعاوني",
      title_en: "COOPERATIVE TRAINING",
      title_hi: "सहकारी प्रशिक्षण",
      items: [
        {
          to: ROUTES.UNIVERSITY.COOP,
          icon: UserCheck,
          label_ar: "إشراف الأساتذة والطلاب",
          label_en: "Professor Supervision & Co-op",
          label_hi: "पर्यवेक्षण और छात्र",
          end: false,
        },
      ],
    },
    {
      title_ar: "التوثيق والاعتماد",
      title_en: "VERIFICATION",
      title_hi: "सत्यापन",
      items: [
        {
          to: ROUTES.UNIVERSITY.VERIFICATIONS,
          icon: ShieldCheck,
          label_ar: "التوثيق الأكاديمي الرقمي",
          label_en: "Degree Verification",
          label_hi: "डिग्री सत्यापन",
          end: false,
        },
      ],
    },
    {
      title_ar: "المؤسسة الأكاديمية",
      title_en: "INSTITUTION",
      title_hi: "संस्थान",
      items: [
        {
          to: ROUTES.UNIVERSITY.PROFILE,
          icon: GraduationCap,
          label_ar: "الملف المؤسسي والاعتماد",
          label_en: "University Profile",
          label_hi: "विश्वविद्यालय प्रोफ़ाइल",
          end: false,
        },
        {
          to: ROUTES.UNIVERSITY.SETTINGS,
          icon: Settings,
          label_ar: "إعدادات المؤسسة",
          label_en: "Institution Settings",
          label_hi: "संस्थान सेटिंग",
          end: false,
        },
      ],
    },
  ]

  const getSectionTitle = (sec: (typeof navSections)[0]) => {
    if (language === "ar") return sec.title_ar
    if (language === "hi") return sec.title_hi
    return sec.title_en
  }

  const getNavLabel = (item: (typeof navSections)[0]["items"][0]) => {
    if (language === "ar") return item.label_ar
    if (language === "hi") return item.label_hi
    return item.label_en
  }

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Bar for Desktop and Mobile */}
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
              {isRTL ? "جامعة" : language === "hi" ? "विश्वविद्यालय" : "University"}
            </span>
          </Link>
        </div>

        {/* Right Topbar Controls */}
        <div className="flex items-center gap-3">
          {/* Crystal-Clear Interactive Language Selector */}
          <LanguageSelector variant="compact" dropdownAlign="end" />

          {/* Institution Badge */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 rtl:pl-0 rtl:pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-secondary font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-xs font-bold text-white max-w-[140px] truncate">
                {user?.name || (language === "ar" ? "جامعة معتمدة" : language === "hi" ? "मान्यता प्राप्त विश्वविद्यालय" : "University")}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {language === "ar" ? "شريك أكاديمي موثق" : language === "hi" ? "सत्यापित शैक्षणिक भागीदार" : "Verified Institution"}
              </div>
            </div>

            {/* Sign Out button — same as Candidate & Company */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title={language === "ar" ? "تسجيل الخروج" : language === "hi" ? "साइन आउट" : "Sign Out"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col justify-between border-e border-border bg-[#081628]/90 p-4 shrink-0">
          <div className="space-y-6">
            {/* Institution Brand Badge */}
            <div className="p-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25 font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || (language === "ar" ? "جامعة الملك سعود" : language === "hi" ? "किंग सऊद विश्वविद्यालय" : "King Saud University")}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {user?.email || "academic@faeda.net"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu (Grouped per Step 19) */}
            <nav className="space-y-4">
              {navSections.map((section) => (
                <div key={section.title_en} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {getSectionTitle(section)}
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
                          <span>{getNavLabel(item)}</span>
                        </div>
                        <ChevronIcon className="w-3 h-3 opacity-40" />
                      </NavLink>
                    )
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{language === "ar" ? "تسجيل الخروج" : language === "hi" ? "साइन आउट" : "Sign Out"}</span>
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
                    FAEDA <span className="text-secondary">ACADEMIC</span>
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
                    <div key={section.title_en} className="space-y-1">
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {getSectionTitle(section)}
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
                              <span>{getNavLabel(item)}</span>
                            </div>
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
                  <span>{language === "ar" ? "تسجيل الخروج" : language === "hi" ? "साइन आउट" : "Sign Out"}</span>
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
