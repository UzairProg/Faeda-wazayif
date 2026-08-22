/**
 * ProjectsSection.tsx — Candidate Featured Projects Showcase Module.
 */
import { useState } from "react"
import { useTranslation } from "@/i18n"
import type {
  CandidateProfile,
  CandidateProject,
  SaveProjectDTO,
} from "../types/candidate.types"
import { FolderGit2, Plus, ExternalLink, Edit2, Trash2, X, Loader2 } from "lucide-react"

interface ProjectsSectionProps {
  profile: CandidateProfile
  onSaveProject: (dto: SaveProjectDTO) => Promise<any>
  onDeleteProject: (projectId: number) => Promise<any>
}

export function ProjectsSection({
  profile,
  onSaveProject,
  onDeleteProject,
}: ProjectsSectionProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CandidateProject | null>(null)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const projects = profile.projects || []

  const handleOpenAdd = () => {
    setEditingProject(null)
    setProjectName("")
    setDescription("")
    setProjectUrl("")
    setError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (proj: CandidateProject) => {
    setEditingProject(proj)
    setProjectName(proj.project_name)
    setDescription(proj.description || "")
    setProjectUrl(proj.project_url || "")
    setError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return
    setIsSaving(true)
    setError(null)

    try {
      await onSaveProject({
        id: editingProject?.id,
        project_name: projectName.trim(),
        description: description.trim(),
        project_url: projectUrl.trim(),
      })
      setIsModalOpen(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "فشل حفظ المشروع")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (projectId: number) => {
    if (!window.confirm(t("candidate.profile.projects.deleteConfirm"))) return
    setIsDeleting(projectId)
    try {
      await onDeleteProject(projectId)
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
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {t("candidate.profile.projects.title")}
              </h2>
              {projects.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  {projects.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {t("candidate.profile.projects.desc")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>{t("candidate.profile.projects.add")}</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="pt-4">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {proj.project_name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        disabled={isDeleting === proj.id}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        {isDeleting === proj.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {proj.description && (
                    <p className="text-xs text-slate-300 font-normal leading-relaxed mt-2 line-clamp-3">
                      {proj.description}
                    </p>
                  )}
                </div>

                {proj.project_url && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <a
                      href={
                        proj.project_url.startsWith("http")
                          ? proj.project_url
                          : `https://${proj.project_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors truncate max-w-full"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{proj.project_url}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-xs text-slate-400 mb-3">
              {t("candidate.profile.projects.empty")}
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("candidate.profile.projects.add")}</span>
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
            className="w-full max-w-lg bg-[#0d1527] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {editingProject
                    ? t("candidate.profile.actions.edit")
                    : t("candidate.profile.projects.add")}
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
                  {t("candidate.profile.projects.nameLabel")} *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="مثال: تطبيق تجارة إلكترونية، لوحة تحكم ذكية..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.projects.descLabel")}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اشرح الهدف والتقنيات المستخدمة والأثر الذي حققه المشروع..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t("candidate.profile.projects.urlLabel")}
                </label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  dir="ltr"
                  placeholder="https://github.com/... أو https://myproject.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary transition-colors text-start"
                />
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
                  disabled={isSaving || !projectName.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? t("candidate.profile.actions.saving") : t("candidate.profile.projects.save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
