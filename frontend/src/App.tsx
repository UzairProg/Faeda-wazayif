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
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom"
import { ROUTES } from "./config/routes"

// Layouts
import { PublicLayout } from "./layouts/MainLayout"
import { CandidateLayout } from "./features/candidate/layouts/CandidateLayout"
import { CandidateDashboardPage } from "./features/candidate/pages/CandidateDashboardPage"
import { CandidateMarketValuePage } from "./features/candidate/pages/CandidateMarketValuePage"
import { CandidateProfilePage } from "./features/candidate/pages/CandidateProfilePage"
import { CandidateJobsPage } from "./features/candidate/pages/CandidateJobsPage"
import { CandidateJobDetailPage } from "./features/candidate/pages/CandidateJobDetailPage"
import { CandidateApplicationsPage } from "./features/candidate/pages/CandidateApplicationsPage"
import { CandidateApplicationDetailPage } from "./features/candidate/pages/CandidateApplicationDetailPage"
import { CandidateSavedJobsPage } from "./features/candidate/pages/CandidateSavedJobsPage"
import { CandidateTeamsPage } from "./features/candidate/pages/CandidateTeamsPage"
import { CandidateTeamDetailPage } from "./features/candidate/pages/CandidateTeamDetailPage"
import { CandidateSettingsPage } from "./features/candidate/pages/CandidateSettingsPage"
import { CandidateCampaignsPage } from "./features/candidate/pages/CandidateCampaignsPage"
import { CompanyLayout } from "./features/company/layouts/CompanyLayout"
import { CompanyDashboardPage } from "./features/company/pages/CompanyDashboardPage"
import { CompanyProfilePage } from "./features/company/pages/CompanyProfilePage"
import { CompanyJobsPage } from "./features/company/pages/CompanyJobsPage"
import { CompanyApplicationsPage } from "./features/company/pages/CompanyApplicationsPage"
import { CompanyTalentPage } from "./features/company/pages/CompanyTalentPage"
import { CompanyTeamsPage } from "./features/company/pages/CompanyTeamsPage"
import { CompanyCampaignsPage } from "./features/company/pages/CompanyCampaignsPage"
import { CompanyCampaignDetailPage } from "./features/company/pages/CompanyCampaignDetailPage"
import { CompanySettingsPage } from "./features/company/pages/CompanySettingsPage"
import { CompanyBillingPage } from "./features/company/pages/CompanyBillingPage"
import { UniversityLayout } from "./features/university/layouts/UniversityLayout"
import { UniversityDashboardPage } from "./features/university/pages/UniversityDashboardPage"
import { UniversityProfilePage } from "./features/university/pages/UniversityProfilePage"
import { UniversityStudentsPage } from "./features/university/pages/UniversityStudentsPage"
import { UniversityStudentDetailPage } from "./features/university/pages/UniversityStudentDetailPage"
import { UniversityVerificationsPage } from "./features/university/pages/UniversityVerificationsPage"
import { UniversityDepartmentsPage } from "./features/university/pages/UniversityDepartmentsPage"
import { UniversityOpportunitiesPage } from "./features/university/pages/UniversityOpportunitiesPage"
import { UniversityCampaignsPage } from "./features/university/pages/UniversityCampaignsPage"
import { UniversityIncubatorPage } from "./features/university/pages/UniversityIncubatorPage"
import { UniversityCoopSupervisionPage } from "./features/university/pages/UniversityCoopSupervisionPage"
import { UniversityAcademicUpdatesPage } from "./features/university/pages/UniversityAcademicUpdatesPage"
import { UniversitySettingsPage } from "./features/university/pages/UniversitySettingsPage"
import { ChatPage } from "./features/chat/pages/ChatPage"
import { AdminLayout } from "./features/admin/layouts/AdminLayout"
import { AdminDashboardPage } from "./features/admin/pages/AdminDashboardPage"
import { AdminUsersPage } from "./features/admin/pages/AdminUsersPage"
import { AdminJobsPage } from "./features/admin/pages/AdminJobsPage"
import { AdminAuditLogsPage } from "./features/admin/pages/AdminAuditLogsPage"
import { AdminReportsPage } from "./features/admin/pages/AdminReportsPage"
import { AdminCategoriesPage } from "./features/admin/pages/AdminCategoriesPage"
import { AdminSettingsPage } from "./features/admin/pages/AdminSettingsPage"
import { MarketTrendsPage } from "./features/market-insights/pages/MarketTrendsPage"
import { AdminMarketDataPage } from "./features/market-insights/pages/AdminMarketDataPage"

// Guards
import { AuthGuard } from "./shared/components/guards/AuthGuard"
import { RoleGuard } from "./shared/components/guards/RoleGuard"
import { AiChatbotWidget } from "./features/ai-chat/components/AiChatbotWidget"

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
import { CandidatePortfolioPage } from "./features/public/pages/CandidatePortfolioPage"
import { PostsPage } from "./features/public/pages/PostsPage"
import { PostDetailPage } from "./features/public/pages/PostDetailPage"

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
          <Route path="portfolio/:username" element={<CandidatePortfolioPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/:id" element={<PostDetailPage />} />
          <Route path="market-trends" element={<MarketTrendsPage />} />
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
              <Route path="market-value" element={<CandidateMarketValuePage />} />
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
              <Route path="settings" element={<CandidateSettingsPage />} />
              <Route path="campaigns" element={<CandidateCampaignsPage />} />
              <Route path="coop-training" element={<UniversityCoopSupervisionPage initialPersona="student" />} />
              <Route path="coop" element={<UniversityCoopSupervisionPage initialPersona="student" />} />
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
              <Route path="campaigns" element={<CompanyCampaignsPage />} />
              <Route path="campaigns/:id" element={<CompanyCampaignDetailPage />} />
              <Route path="talent" element={<CompanyTalentPage />} />
              <Route path="teams" element={<CompanyTeamsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="settings" element={<CompanySettingsPage />} />
              <Route path="billing" element={<CompanyBillingPage />} />
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
              <Route path="academic-updates" element={<UniversityAcademicUpdatesPage />} />
              <Route path="updates" element={<UniversityAcademicUpdatesPage />} />
              <Route path="opportunities" element={<UniversityOpportunitiesPage />} />
              <Route path="campaigns" element={<UniversityCampaignsPage />} />
              <Route path="incubator" element={<UniversityIncubatorPage />} />
              <Route path="coop-supervision" element={<UniversityCoopSupervisionPage />} />
              <Route path="coop" element={<UniversityCoopSupervisionPage />} />
              <Route path="settings" element={<UniversitySettingsPage />} />
              <Route path="*" element={<Navigate to="/university" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ── Admin Routes (/admin/*) ────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="jobs" element={<AdminJobsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="market-data" element={<AdminMarketDataPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
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
              <Link
                to={ROUTES.PUBLIC.HOME}
                className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          }
        />

      </Routes>
      <AiChatbotWidget />
    </Router>
  )
}

export default App
