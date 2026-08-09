/**
 * App.tsx — Root router for Faeda Jobs
 *
 * Route structure:
 *   PUBLIC  (/*)          → PublicLayout (Navbar + Footer)
 *   AUTH    (/auth/*)     → Standalone pages (no layout)
 *   CANDIDATE (/candidate/*) → AuthGuard → RoleGuard → CandidateLayout
 *   COMPANY  (/company/*)    → AuthGuard → RoleGuard → CompanyLayout
 *   ADMIN    (/admin/*)      → AuthGuard → RoleGuard → AdminLayout
 *
 * Old /login and /register paths redirect to /auth/login and /auth/register
 * for backward compatibility during the transition period.
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from "./config/routes"

// Layouts
import { PublicLayout } from "./layouts/MainLayout"
import { CandidateLayout } from "./features/candidate/layouts/CandidateLayout"
import { CompanyLayout } from "./features/company/layouts/CompanyLayout"
import { AdminLayout } from "./features/admin/layouts/AdminLayout"

// Guards
import { AuthGuard } from "./shared/components/guards/AuthGuard"
import { RoleGuard } from "./shared/components/guards/RoleGuard"

// Public pages
import { Home } from "./features/public/pages/Home"
import { JobsPage } from "./features/public/pages/JobsPage"
import { JobDetailPage } from "./features/public/pages/JobDetailPage"
import { CompaniesPage } from "./features/public/pages/CompaniesPage"
import { CompanyDetailPage } from "./features/public/pages/CompanyDetailPage"
import { TeamsPage } from "./features/public/pages/TeamsPage"
import { TeamDetailPage } from "./features/public/pages/TeamDetailPage"
import { AboutPage } from "./features/public/pages/AboutPage"
import { ContactPage } from "./features/public/pages/ContactPage"

// Auth pages
import { Login } from "./features/auth/pages/Login"
import { Register } from "./features/auth/pages/Register"
import { ForgotPassword } from "./features/auth/pages/ForgotPassword"
import { ResetPassword } from "./features/auth/pages/ResetPassword"

import { useEffect } from "react"
import { useAuthStore } from "./store/auth.store"
import { useLanguageStore } from "./store/language.store"

function App() {
  const checkSession = useAuthStore((state) => state.checkSession)
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  return (
    <Router>
      <Routes>

        {/* ── Public Routes (with Navbar + Footer) ──────────── */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="companies/:id" element={<CompanyDetailPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="portfolio/:username"
            element={
              <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-2xl font-bold font-heading text-white mb-3">المعرض المهني</p>
                <p className="text-muted-foreground">قريباً</p>
              </div>
            }
          />
          <Route
            path="posts"
            element={
              <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-2xl font-bold font-heading text-white mb-3">المقالات والرؤى</p>
                <p className="text-muted-foreground">قريباً</p>
              </div>
            }
          />
        </Route>

        {/* ── Auth Routes (standalone — no Navbar/Footer) ───── */}
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />

        {/* Redirect old paths to new /auth/* paths */}
        <Route path="/login" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
        <Route path="/register" element={<Navigate to={ROUTES.AUTH.REGISTER} replace />} />

        {/* ── Candidate Routes (/candidate/*) ───────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["candidate"]} />}>
            <Route path="/candidate/*" element={<CandidateLayout />} />
          </Route>
        </Route>

        {/* ── Company Routes (/company/*) ────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["company"]} />}>
            <Route path="/company/*" element={<CompanyLayout />} />
          </Route>
        </Route>

        {/* ── Admin Routes (/admin/*) ────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminLayout />} />
          </Route>
        </Route>

        {/* ── 404 Fallback ──────────────────────────────────── */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
              <p className="text-6xl font-extrabold font-heading text-primary mb-4">404</p>
              <p className="text-xl font-bold text-white mb-2">الصفحة غير موجودة</p>
              <p className="text-muted-foreground text-sm mb-8">
                لم يتم العثور على الصفحة التي تبحث عنها.
              </p>
              <a
                href={ROUTES.PUBLIC.HOME}
                className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                العودة للرئيسية
              </a>
            </div>
          }
        />

      </Routes>
    </Router>
  )
}

export default App
