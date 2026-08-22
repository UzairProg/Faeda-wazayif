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
import { CandidateDashboardPage } from "./features/candidate/pages/CandidateDashboardPage"
import { CandidateProfilePage } from "./features/candidate/pages/CandidateProfilePage"
import { CandidateJobsPage } from "./features/candidate/pages/CandidateJobsPage"
import { CandidateJobDetailPage } from "./features/candidate/pages/CandidateJobDetailPage"
import { CandidateApplicationsPage } from "./features/candidate/pages/CandidateApplicationsPage"
import { CandidateApplicationDetailPage } from "./features/candidate/pages/CandidateApplicationDetailPage"
import { CandidateSavedJobsPage } from "./features/candidate/pages/CandidateSavedJobsPage"
import { CandidateTeamsPage } from "./features/candidate/pages/CandidateTeamsPage"
import { CandidateTeamDetailPage } from "./features/candidate/pages/CandidateTeamDetailPage"
import { CompanyLayout } from "./features/company/layouts/CompanyLayout"
import { CompanyDashboardPage } from "./features/company/pages/CompanyDashboardPage"
import { CompanyProfilePage } from "./features/company/pages/CompanyProfilePage"
import { CompanyJobsPage } from "./features/company/pages/CompanyJobsPage"
import { CompanyApplicationsPage } from "./features/company/pages/CompanyApplicationsPage"
import { CompanyTalentPage } from "./features/company/pages/CompanyTalentPage"
import { CompanyTeamsPage } from "./features/company/pages/CompanyTeamsPage"
import { UniversityLayout } from "./features/university/layouts/UniversityLayout"
import { UniversityDashboardPage } from "./features/university/pages/UniversityDashboardPage"
import { UniversityProfilePage } from "./features/university/pages/UniversityProfilePage"
import { UniversityStudentsPage } from "./features/university/pages/UniversityStudentsPage"
import { UniversityStudentDetailPage } from "./features/university/pages/UniversityStudentDetailPage"
import { UniversityVerificationsPage } from "./features/university/pages/UniversityVerificationsPage"
import { UniversityDepartmentsPage } from "./features/university/pages/UniversityDepartmentsPage"
import { UniversityOpportunitiesPage } from "./features/university/pages/UniversityOpportunitiesPage"
import { ChatPage } from "./features/chat/pages/ChatPage"
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
            <Route path="/candidate" element={<CandidateLayout />}>
              <Route index element={<CandidateDashboardPage />} />
              <Route path="dashboard" element={<CandidateDashboardPage />} />
              <Route path="profile" element={<CandidateProfilePage />} />
              <Route path="cv" element={<CandidateProfilePage />} />
              <Route path="opportunities" element={<CandidateJobsPage />} />
              <Route path="jobs" element={<CandidateJobsPage />} />
              <Route path="jobs/:id" element={<CandidateJobDetailPage />} />
              <Route path="applications" element={<CandidateApplicationsPage />} />
              <Route path="applications/:id" element={<CandidateApplicationDetailPage />} />
              <Route path="saved-jobs" element={<CandidateSavedJobsPage />} />
              <Route path="teams" element={<CandidateTeamsPage />} />
              <Route path="teams/:id" element={<CandidateTeamDetailPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="*" element={<Navigate to="/candidate" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ── Company Routes (/company/*) ────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["company"]} />}>
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboardPage />} />
              <Route path="dashboard" element={<CompanyDashboardPage />} />
              <Route path="profile" element={<CompanyProfilePage />} />
              <Route path="jobs" element={<CompanyJobsPage />} />
              <Route path="applications" element={<CompanyApplicationsPage />} />
              <Route path="talent" element={<CompanyTalentPage />} />
              <Route path="teams" element={<CompanyTeamsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="settings" element={<CompanyProfilePage />} />
              <Route path="*" element={<Navigate to="/company" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ── University Routes (/university/*) ────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["university"]} />}>
            <Route path="/university" element={<UniversityLayout />}>
              <Route index element={<UniversityDashboardPage />} />
              <Route path="dashboard" element={<UniversityDashboardPage />} />
              <Route path="profile" element={<UniversityProfilePage />} />
              <Route path="students" element={<UniversityStudentsPage />} />
              <Route path="students/:id" element={<UniversityStudentDetailPage />} />
              <Route path="verifications" element={<UniversityVerificationsPage />} />
              <Route path="departments" element={<UniversityDepartmentsPage />} />
              <Route path="opportunities" element={<UniversityOpportunitiesPage />} />
              <Route path="settings" element={<UniversityProfilePage />} />
              <Route path="*" element={<Navigate to="/university" replace />} />
            </Route>
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
