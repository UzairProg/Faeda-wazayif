/**
 * features/admin/pages/AdminCategoriesPage.tsx
 *
 * Platform Taxonomy & Filters Governance.
 * Manage Job Categories, Supported Cities, and Employment Job Types.
 * Matches original manage_filters.html and categories.html functionality.
 */
import { useState, useEffect } from "react"
import { useTranslation } from "@/i18n"
import { adminService } from "../services/admin.service"
import type { AdminCategoryItem, AdminFilterItem } from "../types/admin.types"
import {
  FolderTree,
  MapPin,
  Briefcase,
  Plus,
  Trash2,
  Power,
  Search,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

type ActiveTab = "categories" | "cities" | "job_types"

export function AdminCategoriesPage() {
  const { isRTL, language } = useTranslation()
  const [activeTab, setActiveTab] = useState<ActiveTab>("categories")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<AdminCategoryItem[]>([])
  const [cities, setCities] = useState<AdminFilterItem[]>([])
  const [jobTypes, setJobTypes] = useState<AdminFilterItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newArabicName, setNewArabicName] = useState("")
  const [newEnglishName, setNewEnglishName] = useState("")
  const [newIcon, setNewIcon] = useState("fas fa-briefcase")
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminService.getCategories()
      if (res.success) {
        setCategories(res.categories || [])
        setCities(res.cities || [])
        setJobTypes(res.job_types || [])
      }
    } catch {
      setMessage({
        text: language === "ar" ? "تعذر جلب بيانات التصنيفات" : "Failed to load taxonomy data",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggle = async (type: "category" | "city" | "job_type", id: number) => {
    try {
      const res = await adminService.toggleCategory(type, id)
      if (res.success) {
        setMessage({ text: res.message, type: "success" })
        if (type === "category") {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, is_active: res.is_active } : c))
          )
        } else if (type === "city") {
          setCities((prev) =>
            prev.map((c) => (c.id === id ? { ...c, is_active: res.is_active } : c))
          )
        } else {
          setJobTypes((prev) =>
            prev.map((jt) => (jt.id === id ? { ...jt, is_active: res.is_active } : jt))
          )
        }
      }
    } catch {
      setMessage({
        text: language === "ar" ? "فشل تحديث الحالة" : "Failed to toggle status",
        type: "error",
      })
    }
  }

  const handleDelete = async (type: "category" | "city" | "job_type", id: number) => {
    if (!window.confirm(language === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure to delete?")) {
      return
    }
    try {
      const res = await adminService.deleteCategory(type, id)
      if (res.success) {
        setMessage({ text: res.message, type: "success" })
        if (type === "category") {
          setCategories((prev) => prev.filter((c) => c.id !== id))
        } else if (type === "city") {
          setCities((prev) => prev.filter((c) => c.id !== id))
        } else {
          setJobTypes((prev) => prev.filter((jt) => jt.id !== id))
        }
      }
    } catch {
      setMessage({
        text: language === "ar" ? "فشل حذف العنصر" : "Failed to delete item",
        type: "error",
      })
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newArabicName.trim()) return

    setSubmitting(true)
    try {
      const singularType = activeTab === "categories" ? "category" : activeTab === "cities" ? "city" : "job_type"
      const res = await adminService.createCategory({
        type: singularType,
        name_ar: newArabicName.trim(),
        name_en: newEnglishName.trim() || undefined,
        icon: activeTab === "categories" ? newIcon.trim() : undefined,
      })
      if (res.success) {
        setMessage({ text: res.message, type: "success" })
        setIsAddModalOpen(false)
        setNewArabicName("")
        setNewEnglishName("")
        fetchData()
      }
    } catch {
      setMessage({
        text: language === "ar" ? "فشل إنشاء العنصر" : "Failed to create item",
        type: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Filter items by search
  const filteredCategories = categories.filter(
    (c) =>
      c.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredCities = cities.filter(
    (c) =>
      c.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.name_en && c.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const filteredJobTypes = jobTypes.filter(
    (jt) =>
      jt.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (jt.name_en && jt.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-primary" />
            <span>{language === "ar" ? "الفلاتر والتصنيفات" : "Taxonomy & Platform Filters"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {language === "ar"
              ? "إدارة تصنيفات الوظائف، المدن المتاحة، وأنواع عقود العمل في منصة فائدة"
              : "Manage job industry categories, supported geographic cities, and contract employment types"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-white/10 bg-card hover:bg-card/80 text-muted-foreground hover:text-white transition-colors"
            title={language === "ar" ? "تحديث" : "Refresh"}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === "categories"
                ? language === "ar" ? "إضافة تصنيف" : "Add Category"
                : activeTab === "cities"
                ? language === "ar" ? "إضافة مدينة" : "Add City"
                : language === "ar" ? "إضافة نوع عمل" : "Add Job Type"}
            </span>
          </button>
        </div>
      </div>

      {/* Message alert */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-success/15 border border-success/30 text-success"
              : "bg-destructive/15 border border-destructive/30 text-destructive"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            &times;
          </button>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/70 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "categories"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>{language === "ar" ? "تصنيفات الوظائف" : "Job Categories"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("cities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "cities"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === "ar" ? "المدن والمناطق" : "Cities"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {cities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("job_types")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "job_types"
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{language === "ar" ? "أنواع العقود" : "Job Types"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {jobTypes.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "ar" ? "بحث في القائمة..." : "Filter items..."}
            className={`w-full py-2 text-xs rounded-xl bg-background/60 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm ${
              isRTL ? "pr-8 pl-3" : "pl-8 pr-3"
            }`}
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/85 via-card/55 to-card/35 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
            <span>{language === "ar" ? "جارٍ التحميل..." : "Loading taxonomy..."}</span>
          </div>
        ) : activeTab === "categories" ? (
          filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              {language === "ar" ? "لا توجد تصنيفات حالياً" : "No categories configured"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{language === "ar" ? "الاسم بالعربية" : "Arabic Name"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الاسم بالإنجليزية" : "English Name"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الأيقونة" : "Icon"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الحالة" : "Status"}</th>
                    <th className="py-3 px-4 text-center">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCategories.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{c.name_ar}</td>
                      <td className="py-3 px-4 text-muted-foreground">{c.name_en || "—"}</td>
                      <td className="py-3 px-4 font-mono text-xs text-primary">{c.icon || "fas fa-briefcase"}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle("category", c.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            c.is_active
                              ? "bg-success/15 text-success hover:bg-success/25"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{c.is_active ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "معطل" : "Disabled")}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete("category", c.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === "cities" ? (
          filteredCities.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              {language === "ar" ? "لا توجد مدن مسجلة" : "No cities configured"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{language === "ar" ? "اسم المدينة (عربي)" : "City Name (Arabic)"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الاسم بالإنجليزية" : "English Name"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الحالة" : "Status"}</th>
                    <th className="py-3 px-4 text-center">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCities.map((ci, idx) => (
                    <tr key={ci.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                        <span>{ci.name_ar}</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{ci.name_en || "—"}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle("city", ci.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            ci.is_active
                              ? "bg-success/15 text-success hover:bg-success/25"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{ci.is_active ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "معطل" : "Disabled")}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete("city", ci.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredJobTypes.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              {language === "ar" ? "لا توجد أنواع عمل مسجلة" : "No job types configured"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{language === "ar" ? "نوع العمل (عربي)" : "Job Type (Arabic)"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الاسم بالإنجليزية" : "English Name"}</th>
                    <th className="py-3 px-4">{language === "ar" ? "الحالة" : "Status"}</th>
                    <th className="py-3 px-4 text-center">{language === "ar" ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredJobTypes.map((jt, idx) => (
                    <tr key={jt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-accent" />
                        <span>{jt.name_ar}</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{jt.name_en || "—"}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle("job_type", jt.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            jt.is_active
                              ? "bg-success/15 text-success hover:bg-success/25"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{jt.is_active ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "معطل" : "Disabled")}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete("job_type", jt.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/95 via-card/85 to-card/75 p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>
                {activeTab === "categories"
                  ? language === "ar" ? "إضافة تصنيف جديد" : "Add New Category"
                  : activeTab === "cities"
                  ? language === "ar" ? "إضافة مدينة جديدة" : "Add New City"
                  : language === "ar" ? "إضافة نوع عمل جديد" : "Add New Job Type"}
              </span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1.5">
                  {language === "ar" ? "الاسم بالعربية *" : "Arabic Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={newArabicName}
                  onChange={(e) => setNewArabicName(e.target.value)}
                  placeholder={
                    activeTab === "categories"
                      ? "مثال: تقنية المعلومات"
                      : activeTab === "cities"
                      ? "مثال: الرياض"
                      : "مثال: دوام كامل"
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background/60 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1.5">
                  {language === "ar" ? "الاسم بالإنجليزية (اختياري)" : "English Name (Optional)"}
                </label>
                <input
                  type="text"
                  value={newEnglishName}
                  onChange={(e) => setNewEnglishName(e.target.value)}
                  placeholder={
                    activeTab === "categories"
                      ? "e.g. Information Technology"
                      : activeTab === "cities"
                      ? "e.g. Riyadh"
                      : "e.g. Full Time"
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background/60 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              {activeTab === "categories" && (
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    {language === "ar" ? "رمز الأيقونة (FontAwesome class)" : "Icon Class"}
                  </label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    placeholder="fas fa-code"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background/60 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/30 active:scale-[0.98]"
                >
                  {submitting
                    ? language === "ar" ? "جارٍ الحفظ..." : "Saving..."
                    : language === "ar" ? "حفظ وإضافة" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
