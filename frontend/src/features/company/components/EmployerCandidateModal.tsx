import React from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import {
  X,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle2,
  Sparkles,
  Award,
  FolderGit2,
  MessageSquare,
} from "lucide-react"
import type { CompanyTalentDetail } from "../types/company.types"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"

interface EmployerCandidateModalProps {
  isOpen: boolean
  onClose: () => void
  candidate: CompanyTalentDetail | null
  isRtl?: boolean
}

export const EmployerCandidateModal: React.FC<EmployerCandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  isRtl = true,
}) => {
  if (!isOpen || !candidate) return null

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
        {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#090e1a] p-6 sm:p-8 shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl border border-slate-700 bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl overflow-hidden shadow-inner">
              {candidate.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                candidate.name.slice(0, 2)
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{candidate.name}</h2>
                {candidate.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{isRtl ? "موثق" : "Verified"}</span>
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-400">{candidate.headline}</p>

              <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {candidate.yearsOfExperience} {isRtl ? "سنوات خبرة" : "years exp"}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  {candidate.workType} ({candidate.workStyle})
                </span>
              </div>
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

        {/* Content sections */}
        <div className="mt-6 space-y-6">
          {/* Market Value Benchmark Banner */}
          {candidate.marketBenchmark && (
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-teal-950/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white">
                      {isRtl ? "مؤشر القيمة السوقية والجاهزية المهنية" : "Market Value Intelligence"}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isRtl
                        ? `الفئة التنافسية: ${candidate.marketBenchmark.tier}`
                        : `Competitive Tier: ${candidate.marketBenchmark.tier}`}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-sm font-black text-emerald-400">
                    {candidate.marketBenchmark.salaryMin.toLocaleString()} -{" "}
                    {candidate.marketBenchmark.salaryMax.toLocaleString()}{" "}
                    <span className="text-[10px] font-normal">{candidate.marketBenchmark.currency} / {isRtl ? "شهرياً" : "mo"}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {isRtl ? "المعدل التقديري المتوقع" : "Estimated benchmark"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* About / Summary */}
          {candidate.about && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRtl ? "الملخص المهني والنبذة" : "Professional Summary"}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
                {candidate.about}
              </p>
            </div>
          )}

          {/* Skills Grid */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRtl ? "المهارات والقدرات التقنية" : "Skills & Capabilities"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((sk: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {candidate.education && candidate.education.qualification && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRtl ? "المؤهل التعليمي والأكاديمي" : "Education & Academics"}
              </h3>
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {candidate.education.qualification}{" "}
                    {candidate.education.department && `— ${candidate.education.department}`}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {candidate.education.university || (isRtl ? "جامعة معتمدة" : "University")}
                  </p>
                  {candidate.education.gpa && (
                    <span className="inline-block mt-1 text-[11px] text-slate-500">
                      {isRtl ? `المعدل: ${candidate.education.gpa}` : `GPA: ${candidate.education.gpa}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verified Projects */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {isRtl ? "المشاريع والإنجازات السابقة" : "Projects & Achievements"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {candidate.projects.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    </div>
                    {p.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
                    )}
                    {p.technologies && p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.technologies.map((t: string, tidx: number) => (
                          <span
                            key={tidx}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {candidate.certifications &&
            (Array.isArray(candidate.certifications)
              ? candidate.certifications.length > 0
              : false) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isRtl ? "الشهادات والاعتمادات الاحترافية" : "Professional Certifications"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.certifications.map((c: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2 text-xs text-slate-300"
                    >
                      <Award className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{typeof c === "string" ? c : c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {isRtl
              ? "بيانات مهنية معتمدة من منصة فائدة للتوظيف"
              : "Verified professional identity on Faeda Jobs"}
          </span>

          <div className="flex items-center gap-2 ms-auto">
            <Link
              to={`${ROUTES.COMPANY.CHAT}?new=true&type=CANDIDATE_COMPANY&targetId=${candidate.id}&contextType=direct&contextId=${candidate.id}&subject=${encodeURIComponent('محادثة مع ' + candidate.name)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isRtl ? "مراسلة المرشح" : "Message Candidate"}</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              {isRtl ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </ModalPortal>
  )
}
