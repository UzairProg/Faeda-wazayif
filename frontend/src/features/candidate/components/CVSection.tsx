/**
 * CVSection.tsx — CV Management & ATS Readiness Analysis Module.
 */
import { useState, useRef } from "react"
import { useTranslation } from "@/i18n"
import { candidateService } from "../services/candidate.service"
import type { CandidateProfile } from "../types/candidate.types"
import {
  FileText,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react"

interface CVSectionProps {
  profile: CandidateProfile
  onUploadCV: (file: File) => Promise<any>
}

export function CVSection({ profile, onUploadCV }: CVSectionProps) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const validExts = [".pdf", ".docx", ".doc", ".txt"]
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext))
    if (!hasValidExt) {
      setError("يرجى اختيار ملف بصيغة PDF أو DOCX")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("حجم الملف يجب ألا يتجاوز 10 ميغابايت")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await onUploadCV(file)
      setSuccessMessage(t("candidate.profile.cv.successUploaded"))
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل رفع السيرة الذاتية")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const downloadUrl = candidateService.getCVDownloadUrl()

  const getATSColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    if (score >= 60) return "text-sky-400 border-sky-500/30 bg-sky-500/10"
    return "text-amber-400 border-amber-500/30 bg-amber-500/10"
  }

  return (
    <div id="cv-section" className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-white">
              {t("candidate.profile.cv.title")}
            </h2>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.cv.desc")}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="pt-4 flex flex-col gap-5">
        {/* Active CV Card if exists */}
        {profile.cv ? (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {t("candidate.profile.cv.currentCv")}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    جاهز للتقديم
                  </span>
                </div>
                <span className="text-sm font-bold text-white truncate max-w-sm" title={profile.cv}>
                  {profile.cv}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {/* Download link */}
              <a
                href={downloadUrl}
                download
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>{t("candidate.profile.cv.download")}</span>
              </a>

              {/* Replace trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-sm"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{t("candidate.profile.cv.replace")}</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* ATS Score Card if score exists */}
        {profile.ats_score != null && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0d172a] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    {t("candidate.profile.cv.atsScoreTitle")}
                  </h3>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getATSColor(profile.ats_score)}`}>
                    {profile.ats_score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl mt-0.5">
                  {t("candidate.profile.cv.atsScoreNote")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drag-and-Drop Upload Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              {isUploading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-white">
                {isUploading
                  ? t("candidate.profile.cv.parsingState")
                  : t("candidate.profile.cv.dragDrop")}
              </span>
              <span className="text-xs text-slate-400">
                {t("candidate.profile.cv.supportedFormats")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
