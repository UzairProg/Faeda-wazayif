/**
 * CertificationsSection.tsx — Professional Certifications & Credentials Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type {
  CandidateProfile,
  CandidateCertification,
  SaveCertificationDTO,
} from "../types/candidate.types"
import { Award, Plus, ExternalLink, Edit2, Trash2, X, Loader2, Calendar } from "lucide-react"

interface CertificationsSectionProps {
  profile: CandidateProfile
  onSaveCertification: (dto: SaveCertificationDTO) => Promise<any>
  onDeleteCertification: (certId: number) => Promise<any>
}

const MONTHS = [
  "يناير (1)",
  "فبراير (2)",
  "مارس (3)",
  "أبريل (4)",
  "مايو (5)",
  "يونيو (6)",
  "يوليو (7)",
  "أغسطس (8)",
  "سبتمبر (9)",
  "أكتوبر (10)",
  "نوفمبر (11)",
  "ديسمبر (12)",
]

export function CertificationsSection({
  profile,
  onSaveCertification,
  onDeleteCertification,
}: CertificationsSectionProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<CandidateCertification | null>(null)
  const [certName, setCertName] = useState("")
  const [issuingOrg, setIssuingOrg] = useState("")
  const [issueMonth, setIssueMonth] = useState<number | "">("")
  const [issueYear, setIssueYear] = useState<number | "">("")
  const [expiryMonth, setExpiryMonth] = useState<number | "">("")
  const [expiryYear, setExpiryYear] = useState<number | "">("")
  const [noExpiry, setNoExpiry] = useState(false)
  const [credentialId, setCredentialId] = useState("")
  const [credentialUrl, setCredentialUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const certifications = profile.certifications || []

  const handleOpenAdd = () => {
    setEditingCert(null)
    setCertName("")
    setIssuingOrg("")
    setIssueMonth("")
    setIssueYear(new Date().getFullYear())
    setExpiryMonth("")
    setExpiryYear("")
    setNoExpiry(true)
    setCredentialId("")
    setCredentialUrl("")
    setError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cert: CandidateCertification) => {
    setEditingCert(cert)
    setCertName(cert.cert_name)
    setIssuingOrg(cert.issuing_org || "")
    setIssueMonth(cert.issue_month || "")
    setIssueYear(cert.issue_year || "")
    setExpiryMonth(cert.expiry_month || "")
    setExpiryYear(cert.expiry_year || "")
    setNoExpiry(Boolean(cert.no_expiry))
    setCredentialId(cert.credential_id || "")
    setCredentialUrl(cert.credential_url || "")
    setError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certName.trim()) return
    setIsSaving(true)
    setError(null)

    try {
      await onSaveCertification({
        id: editingCert?.id,
        cert_name: certName.trim(),
        issuing_org: issuingOrg.trim(),
        issue_month: issueMonth ? Number(issueMonth) : null,
        issue_year: issueYear ? Number(issueYear) : null,
        expiry_month: !noExpiry && expiryMonth ? Number(expiryMonth) : null,
        expiry_year: !noExpiry && expiryYear ? Number(expiryYear) : null,
        no_expiry: noExpiry,
        credential_id: credentialId.trim(),
        credential_url: credentialUrl.trim(),
      })
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ الشهادة")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (certId: number) => {
    if (!window.confirm(t("candidate.profile.certifications.deleteConfirm"))) return
    setIsDeleting(certId)
    try {
      await onDeleteCertification(certId)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0c1424]/90 backdrop-blur-md p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {t("candidate.profile.certifications.title")}
              </h2>
              {certifications.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  {certifications.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.certifications.desc")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>{t("candidate.profile.certifications.add")}</span>
        </button>
      </div>

      {/* Certifications List */}
      <div className="pt-4">
        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {cert.cert_name}
                      </h3>
                      {cert.issuing_org && (
                        <p className="text-xs font-semibold text-sky-400 mt-0.5">
                          {cert.issuing_org}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cert)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Certification"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id)}
                        disabled={isDeleting === cert.id}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Certification"
                      >
                        {isDeleting === cert.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dates & Credential ID */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2.5">
                    {cert.issue_year && (
                      <div className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {cert.issue_month ? `${cert.issue_month}/` : ""}
                          {cert.issue_year}
                        </span>
                      </div>
                    )}
                    {cert.no_expiry ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t("candidate.profile.certifications.noExpiry")}
                      </span>
                    ) : cert.expiry_year ? (
                      <span className="text-slate-400">
                        (ينتهي: {cert.expiry_month ? `${cert.expiry_month}/` : ""}{cert.expiry_year})
                      </span>
                    ) : null}
                  </div>

                  {cert.credential_id && (
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      ID: {cert.credential_id}
                    </p>
                  )}
                </div>

                {cert.credential_url && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <a
                      href={
                        cert.credential_url.startsWith("http")
                          ? cert.credential_url
                          : `https://${cert.credential_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t("candidate.profile.certifications.urlLabel")}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.certifications.empty")}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.certifications.add")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {editingCert
                    ? t("candidate.profile.actions.edit")
                    : t("candidate.profile.certifications.add")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.certifications.nameLabel")} *
                </label>
                <input
                  type="text"
                  required
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="مثال: AWS Certified Solutions Architect, PMP..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.certifications.orgLabel")}
                </label>
                <input
                  type="text"
                  value={issuingOrg}
                  onChange={(e) => setIssuingOrg(e.target.value)}
                  placeholder="مثال: Amazon Web Services, PMI, Google, Meta..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Issue Month & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    شهر الإصدار
                  </label>
                  <select
                    value={issueMonth}
                    onChange={(e) => setIssueMonth(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">الشهر</option>
                    {MONTHS.map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    سنة الإصدار
                  </label>
                  <input
                    type="number"
                    value={issueYear}
                    onChange={(e) => setIssueYear(e.target.value ? Number(e.target.value) : "")}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* No Expiration Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={noExpiry}
                  onChange={(e) => setNoExpiry(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300 font-medium">
                  {t("candidate.profile.certifications.noExpiry")}
                </span>
              </label>

              {/* Expiry date if applicable */}
              {!noExpiry && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      شهر الانتهاء
                    </label>
                    <select
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">الشهر</option>
                      {MONTHS.map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      سنة الانتهاء
                    </label>
                    <input
                      type="number"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value ? Number(e.target.value) : "")}
                      placeholder="2028"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Credential ID and Verification URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.certifications.credentialIdLabel")}
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="AWS-123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t("candidate.profile.certifications.urlLabel")}
                  </label>
                  <input
                    type="url"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    dir="ltr"
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors text-start"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  {t("candidate.profile.actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !certName.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.certifications.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
