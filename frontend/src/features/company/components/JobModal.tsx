import React, { useState, useEffect } from "react"
import { X, Loader2, Briefcase } from "lucide-react"
import type { CompanyJob, CreateJobPayload } from "../types/company.types"

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateJobPayload) => Promise<void>
  initialJob?: CompanyJob | null
  isLoading?: boolean
  isRtl?: boolean
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialJob,
  isLoading = false,
  isRtl = true,
}) => {
  const [formData, setFormData] = useState<CreateJobPayload>({
    title: "",
    specialization: "تطوير البرمجيات والتقنية",
    jobType: "دوام كامل",
    town: "الرياض",
    workplace: "هجين",
    skillsYears: "2-4 سنوات",
    educationalQualification: "بكالوريوس",
    description: "",
    requiredSkills: "",
    languages: "العربية, الإنجليزية",
    salaryMin: undefined,
    salaryMax: undefined,
    status: "approved",
  })

  useEffect(() => {
    if (initialJob) {
      setFormData({
        title: initialJob.title || "",
        specialization: initialJob.specialization || "تطوير البرمجيات والتقنية",
        jobType: initialJob.jobType || "دوام كامل",
        town: initialJob.town || "الرياض",
        workplace: initialJob.workplace || "هجين",
        skillsYears: initialJob.skillsYears || "2-4 سنوات",
        educationalQualification: initialJob.educationalQualification || "بكالوريوس",
        description: initialJob.description || "",
        requiredSkills: initialJob.requiredSkills ? initialJob.requiredSkills.join(", ") : "",
        languages: initialJob.languages ? initialJob.languages.join(", ") : "العربية, الإنجليزية",
        salaryMin: initialJob.salary.min || undefined,
        salaryMax: initialJob.salary.max || undefined,
        status: initialJob.status || "approved",
      })
    } else {
      setFormData({
        title: "",
        specialization: "تطوير البرمجيات والتقنية",
        jobType: "دوام كامل",
        town: "الرياض",
        workplace: "هجين",
        skillsYears: "2-4 سنوات",
        educationalQualification: "بكالوريوس",
        description: "",
        requiredSkills: "",
        languages: "العربية, الإنجليزية",
        salaryMin: undefined,
        salaryMax: undefined,
        status: "approved",
      })
    }
  }, [initialJob, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#090e1a] p-6 shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialJob
                  ? isRtl
                    ? "تعديل الفرصة الوظيفية"
                    : "Edit Opportunity"
                  : isRtl
                  ? "نشر فرصة وظيفية جديدة"
                  : "Post New Opportunity"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl
                  ? "قم بتحديد المتطلبات بدقة لاستقطاب أفضل الكفاءات والفرق المتخصصة"
                  : "Specify requirements accurately to attract top talent and squads"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "مسمى الوظيفة / الفرصة *" : "Job Title *"}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={isRtl ? "مثال: مهندس سحابي أول (Senior DevOps Engineer)" : "e.g. Senior Cloud DevOps Engineer"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Grid: Specialization & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "التخصص المهني" : "Specialization"}
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="تطوير البرمجيات والتقنية">تطوير البرمجيات والتقنية</option>
                <option value="الذكاء الاصطناعي وعلم البيانات">الذكاء الاصطناعي وعلم البيانات</option>
                <option value="الأمن السيبراني والشبكات">الأمن السيبراني والشبكات</option>
                <option value="إدارة المشاريع والمنتجات">إدارة المشاريع والمنتجات</option>
                <option value="تصميم واجهات وتجربة المستخدم">تصميم واجهات وتجربة المستخدم</option>
                <option value="التسويق الرقمي والمبيعات">التسويق الرقمي والمبيعات</option>
                <option value="المالية والمحاسبة">المالية والمحاسبة</option>
                <option value="الموارد البشرية والإدارة">الموارد البشرية والإدارة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "نوع العمل" : "Employment Type"}
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="دوام كامل">دوام كامل (Full-time)</option>
                <option value="دوام جزئي">دوام جزئي (Part-time)</option>
                <option value="عقد محدد المدة">عقد محدد المدة (Contract)</option>
                <option value="عمل حر / مشروع">عمل حر / مشروع (Freelance)</option>
                <option value="تدريب تعاوني">تدريب تعاوني (Internship)</option>
              </select>
            </div>
          </div>

          {/* Grid: Workplace & Town */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "نمط بيئة العمل" : "Workplace Style"}
              </label>
              <select
                value={formData.workplace}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="هجين">هجين (Hybrid)</option>
                <option value="عن بعد">عن بعد (Remote)</option>
                <option value="حضوري">حضوري بالكامل (On-site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "المدينة / المنطقة" : "City / Location"}
              </label>
              <input
                type="text"
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                placeholder={isRtl ? "الرياض، جدة، الدمام..." : "Riyadh, Jeddah..."}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grid: Experience & Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "سنوات الخبرة المطلوبة" : "Years of Experience"}
              </label>
              <select
                value={formData.skillsYears}
                onChange={(e) => setFormData({ ...formData, skillsYears: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="حديث تخرج">حديث تخرج (Fresh Graduate)</option>
                <option value="1-3 سنوات">1-3 سنوات (Junior)</option>
                <option value="3-5 سنوات">3-5 سنوات (Mid-Level)</option>
                <option value="5-8 سنوات">5-8 سنوات (Senior)</option>
                <option value="أكثر من 8 سنوات">أكثر من 8 سنوات (Expert / Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "المؤهل التعليمي" : "Educational Qualification"}
              </label>
              <select
                value={formData.educationalQualification}
                onChange={(e) =>
                  setFormData({ ...formData, educationalQualification: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="بكالوريوس">بكالوريوس (Bachelor's)</option>
                <option value="ماجستير">ماجستير (Master's)</option>
                <option value="دكتوراه">دكتوراه (PhD)</option>
                <option value="دبلوم">دبلوم (Diploma)</option>
                <option value="غير محدد">المهارة هي المعيار الأساسي (Skill-based)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "الوصف الوظيفي والمسؤوليات *" : "Job Description & Responsibilities *"}
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={
                isRtl
                  ? "اكتب تفاصيل الفرصة، المهام الرئيسية، بيئة العمل، وأي اشتراطات خاصة..."
                  : "Describe key responsibilities, requirements, and benefits..."
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Required Skills (Comma-separated) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "المهارات والتقنيات المطلوبة (مفصولة بفاصلة)" : "Required Skills (comma separated)"}
            </label>
            <input
              type="text"
              value={formData.requiredSkills as string}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              placeholder={isRtl ? "مثال: Kubernetes, AWS, Terraform, Docker, Python" : "e.g. React, Node.js, TypeScript"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Grid: Salary Min & Max */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "الحد الأدنى للراتب (ريال شهرياً - اختياري)" : "Min Monthly Salary (SAR - Optional)"}
              </label>
              <input
                type="number"
                min={0}
                value={formData.salaryMin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="15000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? "الحد الأعلى للراتب (ريال شهرياً - اختياري)" : "Max Monthly Salary (SAR - Optional)"}
              </label>
              <input
                type="number"
                min={0}
                value={formData.salaryMax || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMax: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="25000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRtl ? "حالة النشر" : "Publishing Status"}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-white text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="approved">{isRtl ? "منشورة ومتاحة للتقديم فوراً" : "Published & Active"}</option>
              <option value="draft">{isRtl ? "حفظ كمسودة غير منشورة" : "Draft (Unpublished)"}</option>
              <option value="closed">{isRtl ? "إغلاق التقديم" : "Closed"}</option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {initialJob
                  ? isRtl
                    ? "حفظ التعديلات"
                    : "Save Changes"
                  : isRtl
                  ? "نشر الوظيفة الآن"
                  : "Publish Job"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
