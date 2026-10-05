/**
 * features/admin/pages/AdminUsersPage.tsx
 *
 * User Governance Console: Manage Candidates, Employers, Universities, and Admins.
 */
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import type { AdminUser } from "../types/admin.types"
import {
  Users,
  Search,
  ShieldCheck,
  Trash2,
  Building2,
  GraduationCap,
  User,
  Loader2,
  Check,
  Ban,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
} from "lucide-react"

export function AdminUsersPage() {
  const { language } = useTranslation()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  // Fetch users query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "users", activeTab, statusFilter, searchQuery, page],
    queryFn: () =>
      adminService.getUsers({
        type: activeTab,
        status: statusFilter,
        q: searchQuery || undefined,
        page,
        per_page: 25,
      }),
  })

  // Toggle user status mutation (Active vs Suspended)
  const statusMutation = useMutation({
    mutationFn: ({
      type,
      id,
      status,
    }: {
      type: string
      id: number
      status: "active" | "suspended"
    }) => adminService.updateUserStatus(type, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })

  // Toggle verification badge mutation
  const verifyMutation = useMutation({
    mutationFn: ({
      type,
      id,
      is_verified,
    }: {
      type: string
      id: number
      is_verified: boolean
    }) => adminService.toggleUserVerification(type, id, is_verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: string; id: number }) =>
      adminService.deleteUser(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })

  const handleToggleStatus = (user: AdminUser) => {
    const nextStatus = user.status === "active" ? "suspended" : "active"
    const confirmMsg =
      language === "ar"
        ? `هل أنت متأكد من ${nextStatus === "suspended" ? "إيقاف" : "تفعيل"} حساب "${user.name}"؟`
        : `Are you sure you want to ${nextStatus === "suspended" ? "suspend" : "activate"} user "${user.name}"?`

    if (window.confirm(confirmMsg)) {
      statusMutation.mutate({ type: user.type, id: user.id, status: nextStatus })
    }
  }

  const handleToggleVerification = (user: AdminUser) => {
    verifyMutation.mutate({
      type: user.type,
      id: user.id,
      is_verified: !user.is_verified,
    })
  }

  const handleDeleteUser = (user: AdminUser) => {
    const confirmMsg =
      language === "ar"
        ? `تحذير: هل أنت متأكد من حذف حساب "${user.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
        : `Warning: Are you sure you want to delete "${user.name}"? This action cannot be undone.`

    if (window.confirm(confirmMsg)) {
      deleteMutation.mutate({ type: user.type, id: user.id })
    }
  }

  const roleTabs = [
    { id: "all", label_ar: "الكل", label_en: "All Users", icon: Users },
    { id: "candidate", label_ar: "الكفاءات", label_en: "Candidates", icon: User },
    { id: "company", label_ar: "الشركات", label_en: "Companies", icon: Building2 },
    { id: "university", label_ar: "الجامعات", label_en: "Universities", icon: GraduationCap },
    { id: "admin", label_ar: "المديرون", label_en: "Admins", icon: ShieldCheck },
  ]

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "candidate":
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium">{language === "ar" ? "كفاءة" : "Candidate"}</span>
      case "company":
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-medium">{language === "ar" ? "شركة" : "Company"}</span>
      case "university":
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-medium">{language === "ar" ? "جامعة" : "University"}</span>
      case "admin":
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">{language === "ar" ? "مسؤول" : "Admin"}</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {language === "ar" ? "إدارة المستخدمين والحسابات" : "User Governance"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "ar"
              ? "متابعة جميع الكفاءات، الشركات، والجامعات، وإدارة الصلاحيات والتوثيق وحالات الإيقاف."
              : "Manage candidate identities, employer verifications, educational partners, and account statuses."}
          </p>
        </div>
      </div>

      {/* ── Tabs & Search Bar ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-card/70 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg overflow-x-auto">
          {roleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setPage(1)
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === "ar" ? tab.label_ar : tab.label_en}</span>
              </button>
            )
          })}
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-3.5 py-2 bg-background/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="all">{language === "ar" ? "جميع الحالات" : "All Statuses"}</option>
            <option value="active">{language === "ar" ? "النشط فقط" : "Active only"}</option>
            <option value="suspended">{language === "ar" ? "الموقوف فقط" : "Suspended only"}</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === "ar" ? "بحث بالاسم أو البريد..." : "Search by name, email..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-background/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Users Table ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">
              {language === "ar" ? "جاري جلب قائمة المستخدمين..." : "Fetching user directory..."}
            </p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400 text-xs">
            {error instanceof Error ? error.message : "حدث خطأ أثناء تحميل المستخدمين."}
          </div>
        ) : !data?.users || data.users.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm space-y-2">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p>{language === "ar" ? "لم يتم العثور على أي مستخدمين يطابقون البحث." : "No users found matching your filters."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-muted-foreground uppercase font-mono text-[11px]">
                  <th className="py-4 px-6 text-start">{language === "ar" ? "المستخدم" : "User"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "النوع" : "Role"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "البريد / الهاتف" : "Contact"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "التوثيق" : "Verification"}</th>
                  <th className="py-4 px-4 text-start">{language === "ar" ? "الحالة" : "Status"}</th>
                  <th className="py-4 px-6 text-end">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.users.map((u) => (
                  <tr key={`${u.type}-${u.id}`} className="hover:bg-white/[0.02] transition-colors">
                    {/* User Profile Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white hover:text-primary transition-colors">
                            {u.name}
                          </p>
                          {u.location && (
                            <p className="text-[11px] text-muted-foreground">{u.location}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-4">
                      {getUserTypeBadge(u.type)}
                    </td>

                    {/* Email / Mobile */}
                    <td className="py-4 px-4 text-muted-foreground font-mono">
                      <div>{u.email}</div>
                      {u.mobile && <div className="text-[10px] text-muted-foreground/60">{u.mobile}</div>}
                    </td>

                    {/* Verification checkmark */}
                    <td className="py-4 px-4">
                      {u.type !== "admin" ? (
                        <button
                          onClick={() => handleToggleVerification(u)}
                          disabled={verifyMutation.isPending}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            u.is_verified
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                          }`}
                          title={language === "ar" ? "انقر لتغيير حالة التوثيق" : "Click to toggle verification"}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{u.is_verified ? (language === "ar" ? "موثق" : "Verified") : (language === "ar" ? "غير موثق" : "Unverified")}</span>
                        </button>
                      ) : (
                        <span className="text-muted-foreground/40 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span>{u.status === "active" ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "موقوف" : "Suspended")}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-end">
                      <div className="inline-flex items-center gap-2">
                        {/* View Details button */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          title={language === "ar" ? "معاينة الحساب" : "View Profile"}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Suspend / Activate button */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={statusMutation.isPending}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.status === "active"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                          }`}
                          title={u.status === "active" ? (language === "ar" ? "إيقاف الحساب" : "Suspend") : (language === "ar" ? "تفعيل الحساب" : "Activate")}
                        >
                          {u.status === "active" ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          title={language === "ar" ? "حذف الحساب" : "Delete User"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {language === "ar"
                ? `عرض الصفحة ${data.page} من ${data.total_pages} (إجمالي ${data.total} مستخدم)`
                : `Page ${data.page} of ${data.total_pages} (${data.total} total)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
              >
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User Details Modal ──────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                  {selectedUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    {selectedUser.is_verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getUserTypeBadge(selectedUser.type)}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedUser.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === "active" ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span>{selectedUser.status === "active" ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "موقوف" : "Suspended")}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-3 text-xs">
              <div className="bg-background/50 p-3.5 rounded-2xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{language === "ar" ? "البريد الإلكتروني" : "Email"}</span>
                  </span>
                  <span className="text-white font-mono select-all">{selectedUser.email}</span>
                </div>

                {selectedUser.mobile && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === "ar" ? "رقم الهاتف" : "Phone"}</span>
                    </span>
                    <span className="text-white font-mono select-all">{selectedUser.mobile}</span>
                  </div>
                )}

                {selectedUser.location && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>{language === "ar" ? "الموقع / العنوان" : "Location"}</span>
                    </span>
                    <span className="text-white font-medium">{selectedUser.location}</span>
                  </div>
                )}

                {selectedUser.created_at && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === "ar" ? "تاريخ التسجيل" : "Registered"}</span>
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-5 mt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {selectedUser.type !== "admin" && (
                  <button
                    onClick={() => {
                      handleToggleVerification(selectedUser)
                      setSelectedUser((prev) =>
                        prev ? { ...prev, is_verified: !prev.is_verified } : null
                      )
                    }}
                    disabled={verifyMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {selectedUser.is_verified
                        ? language === "ar" ? "إلغاء التوثيق" : "Revoke Verification"
                        : language === "ar" ? "توثيق الحساب" : "Verify Account"}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleToggleStatus(selectedUser)
                    setSelectedUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: prev.status === "active" ? "suspended" : "active",
                          }
                        : null
                    )
                  }}
                  disabled={statusMutation.isPending}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    selectedUser.status === "active"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {selectedUser.status === "active" ? (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "إيقاف الحساب" : "Suspend"}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === "ar" ? "تنشيط الحساب" : "Activate"}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDeleteUser(selectedUser)
                    setSelectedUser(null)
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  title={language === "ar" ? "حذف الحساب" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
