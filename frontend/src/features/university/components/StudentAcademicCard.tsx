import React from "react"
import { Link } from "react-router-dom"
import {
  GraduationCap,
  ShieldCheck,
  Clock,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
  FolderGit2,
} from "lucide-react"
import { ROUTES } from "@/config/routes"
import type { UniversityStudentItem } from "../types/university.types"

interface StudentAcademicCardProps {
  student: UniversityStudentItem
  onVerifyDirect?: (student: UniversityStudentItem) => void
  isRtl?: boolean
}

export const StudentAcademicCard: React.FC<StudentAcademicCardProps> = ({
  student,
  onVerifyDirect,
  isRtl = true,
}) => {
  const isVerified = student.verification.status === "verified"
  const isPending = student.verification.status === "pending"

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-[#090e1a]/90 p-5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/80 text-white font-bold text-base shadow-inner">
              {student.img ? (
                <img
                  src={student.img.startsWith("http") ? student.img : `/${student.img}`}
                  alt={student.fullname}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                student.fullname.charAt(0)
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                {student.fullname}
              </h4>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{student.educational_qualification} — {student.department}</span>
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          {isVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? "موثق أكاديمياً" : "Verified"}</span>
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? "بانتظار التوثيق" : "Pending"}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
              <span>{isRtl ? "غير موثق" : "Unverified"}</span>
            </span>
          )}
        </div>

        {/* Academic Details Pill Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-900/40 px-2.5 py-2 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{isRtl ? "سنة التخرج:" : "Grad:"} {student.graduation_date}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800/80 bg-slate-900/40 px-2.5 py-2 text-slate-300">
            <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{isRtl ? "المعدل:" : "GPA:"} {student.gpa}</span>
          </div>
        </div>

        {/* Skills Tags */}
        {student.skills && student.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {student.skills.slice(0, 3).map((s, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {s}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-400">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Career Readiness Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>{isRtl ? "جاهزية سوق العمل" : "Career Readiness"}</span>
            </span>
            <span className="text-[11px] font-bold text-teal-400 font-mono">
              {student.career_readiness}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
              style={{ width: `${student.career_readiness}%` }}
            />
          </div>
        </div>

        {/* Projects indicator */}
        {student.projects_count > 0 && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400">
            <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{student.projects_count} {isRtl ? "مشاريع / أعمال منجزة" : "Projects added"}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 gap-2">
        <Link
          to={ROUTES.UNIVERSITY.STUDENT_DETAIL(student.id)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          <span>{isRtl ? "عرض السجل الأكاديمي" : "View Academic Dossier"}</span>
          {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>

        {!isVerified && onVerifyDirect && (
          <button
            type="button"
            onClick={() => onVerifyDirect(student)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-950/40"
          >
            {isRtl ? "توثيق رسمي" : "Verify Record"}
          </button>
        )}
      </div>
    </div>
  )
}
