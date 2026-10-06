import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Layers,
  Loader2,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ModalPortal } from "@/shared/components/ui/ModalPortal"
import { useTranslation } from "@/i18n"
import { campaignsService } from "../services/campaigns.service"
import type { CampaignContent } from "../types/campaign.types"

interface CampaignContentsManagerProps {
  campaignId: number
}

const CONTENT_TYPES = [
  { key: "text", label_ar: "نص / مقال توضيحي", label_en: "Text / Article", icon: FileText, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { key: "image", label_ar: "صورة / إنفوجرافيك", label_en: "Image / Infographic", icon: ImageIcon, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { key: "video", label_ar: "فيديو ترويجي / عرض", label_en: "Video / Demo", icon: Video, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { key: "document", label_ar: "مستند / ملف PDF", label_en: "Document / PDF", icon: FileCode, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { key: "link", label_ar: "رابط خارجي / مرجع", label_en: "External Link", icon: LinkIcon, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
]

export function CampaignContentsManager({ campaignId }: CampaignContentsManagerProps) {
  const { language, isRTL } = useTranslation()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CampaignContent | null>(null)

  // Form states
  const [contentType, setContentType] = useState("text")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [textContent, setTextContent] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [mediaType, setMediaType] = useState("")
  const [displayOrder, setDisplayOrder] = useState<number>(0)

  // Fetch campaign contents
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["campaign", campaignId, "contents"],
    queryFn: () => campaignsService.getCampaignContents(campaignId),
  })

  // Open modal for new item
  const handleOpenCreate = () => {
    setEditingItem(null)
    setContentType("text")
    setTitle("")
    setDescription("")
    setTextContent("")
    setFileUrl("")
    setMediaType("text/plain")
    setDisplayOrder(contents.length)
    setIsModalOpen(true)
  }

  // Open modal for editing
  const handleOpenEdit = (item: CampaignContent) => {
    setEditingItem(item)
    setContentType(item.content_type || "text")
    setTitle(item.title || "")
    setDescription(item.description || "")
    setTextContent(item.text_content || "")
    setFileUrl(item.file_url || "")
    setMediaType(item.media_type || "")
    setDisplayOrder(item.display_order ?? 0)
    setIsModalOpen(true)
  }

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Partial<CampaignContent> = {
        content_type: contentType,
        title,
        description,
        text_content: textContent,
        file_url: fileUrl,
        media_type: mediaType || (contentType === "image" ? "image/jpeg" : contentType === "video" ? "video/mp4" : "text/plain"),
        display_order: displayOrder,
      }
      if (editingItem) {
        return campaignsService.updateCampaignContent(campaignId, editingItem.id, payload)
      } else {
        return campaignsService.addCampaignContent(campaignId, payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId, "contents"] })
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId] })
      setIsModalOpen(false)
      setEditingItem(null)
    },
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (contentId: number) => campaignsService.deleteCampaignContent(campaignId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId, "contents"] })
      queryClient.invalidateQueries({ queryKey: ["company", "campaign", campaignId] })
    },
  })

  // Move / Reorder Mutation
  const moveItem = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= contents.length) return

    const newItems = [...contents]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    const reorderPayload = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }))

    await campaignsService.reorderCampaignContents(campaignId, reorderPayload)
    queryClient.invalidateQueries({ queryKey: ["campaign", campaignId, "contents"] })
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/60 border border-white/10 backdrop-blur-md">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{language === "ar" ? "محتويات ووسائط الحملة (campaign_contents)" : "Campaign Rich Contents & Media"}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {language === "ar"
              ? "إدارة النشرات، ملفات الـ PDF، الصور والفيديوهات التعريفية المرتبطة بهذه الحملة."
              : "Manage multi-format attachments, articles, videos, and documentation for this campaign."}
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="rounded-xl px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{language === "ar" ? "إضافة محتوى جديد" : "Add Content Item"}</span>
        </Button>
      </div>

      {/* Contents List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span>{language === "ar" ? "جاري تحميل محتويات الحملة..." : "Loading contents..."}</span>
        </div>
      ) : contents.length === 0 ? (
        <GlassCard className="p-10 text-center rounded-2xl border-white/5 space-y-3">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
          <h4 className="text-base font-bold text-white">
            {language === "ar" ? "لا توجد محتويات مرفقة بالحملة حتى الآن" : "No campaign contents attached yet"}
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {language === "ar"
              ? "يمكنك إضافة مقالات توضيحية، بروشورات توظيف بصيغة PDF، فيديوهات تعريفية أو روابط خاصة."
              : "Attach articles, PDF job brochures, demo videos, or portfolio links to make your campaign stand out."}
          </p>
          <Button
            onClick={handleOpenCreate}
            variant="outline"
            className="rounded-xl border-white/10 text-white hover:bg-white/5 gap-2 text-xs mt-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === "ar" ? "إضافة المحتوى الأول" : "Add First Content"}</span>
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {contents.map((item, index) => {
            const typeConfig = CONTENT_TYPES.find((t) => t.key === item.content_type) || CONTENT_TYPES[0]
            const Icon = typeConfig.icon

            return (
              <GlassCard
                key={item.id}
                className="p-5 rounded-2xl border-white/10 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left/Start: Type badge + Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${typeConfig.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">#{index + 1}</span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeConfig.color}`}>
                        {language === "ar" ? typeConfig.label_ar : typeConfig.label_en}
                      </span>
                      {item.media_type && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-muted-foreground font-mono">
                          {item.media_type}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">
                      {item.title || (language === "ar" ? "محتوى بدون عنوان" : "Untitled Content")}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}

                    {/* Previews */}
                    {item.content_type === "image" && item.file_url && (
                      <div className="mt-2">
                        <img
                          src={item.file_url}
                          alt={item.title || "Campaign media"}
                          className="max-h-36 rounded-xl object-cover border border-white/10"
                        />
                      </div>
                    )}

                    {item.content_type === "video" && item.file_url && (
                      <div className="mt-2 max-w-sm">
                        <video
                          src={item.file_url}
                          controls
                          className="w-full max-h-40 rounded-xl border border-white/10"
                        />
                      </div>
                    )}

                    {item.text_content && (
                      <div className="mt-2 p-3 rounded-xl bg-black/20 border border-white/5 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {item.text_content}
                      </div>
                    )}

                    {item.file_url && item.content_type !== "image" && item.content_type !== "video" && (
                      <div className="mt-2">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="truncate max-w-xs">{item.file_url}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right/End: Actions & Reorder */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-white"
                      title={language === "ar" ? "تحريك لأعلى" : "Move Up"}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === contents.length - 1}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-white"
                      title={language === "ar" ? "تحريك لأسفل" : "Move Down"}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleOpenEdit(item)}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl border-white/10 text-white hover:bg-white/5 gap-1.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{language === "ar" ? "تعديل" : "Edit"}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      if (confirm(language === "ar" ? "هل أنت متأكد من حذف هذا المحتوى؟" : "Delete this content item?")) {
                        deleteMutation.mutate(item.id)
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl border-red-500/20 text-red-400 hover:bg-red-500/10 gap-1.5 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === "ar" ? "حذف" : "Delete"}</span>
                  </Button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal via ModalPortal */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <GlassCard
              className="w-full max-w-xl p-6 rounded-3xl border-white/15 bg-card/95 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {editingItem
                      ? language === "ar"
                        ? "تعديل محتوى الحملة"
                        : "Edit Campaign Content"
                      : language === "ar"
                      ? "إضافة محتوى جديد للحملة"
                      : "Add New Campaign Content"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Type Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {language === "ar" ? "نوع المحتوى (content_type)" : "Content Type"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONTENT_TYPES.map((t) => {
                    const isSelected = contentType === t.key
                    const Icon = t.icon
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => {
                          setContentType(t.key)
                          if (!mediaType) {
                            if (t.key === "image") setMediaType("image/jpeg")
                            else if (t.key === "video") setMediaType("video/mp4")
                            else if (t.key === "document") setMediaType("application/pdf")
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/20"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{language === "ar" ? t.label_ar : t.label_en}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === "ar" ? "العنوان الرئيسي (title)" : "Title"}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === "ar" ? "مثال: الكتيب التعريفي لبرنامج التوظيف الوطني" : "e.g. Talent Acquisition Program Brochure"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === "ar" ? "الوصف المختصر (description)" : "Short Description"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder={language === "ar" ? "نبذة توضيحية حول هذا الملف أو المرفق..." : "Brief overview about this content block..."}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Text Content (for text/articles) */}
              {(contentType === "text" || !fileUrl) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {language === "ar" ? "النص التفصيلي (text_content)" : "Detailed Text Content"}
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                    placeholder={language === "ar" ? "اكتب المحتوى النصي أو الملاحظات أو المتطلبات هنا..." : "Write detailed content, requirements, or notes..."}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}

              {/* File URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {language === "ar" ? "رابط الملف أو الوسائط (file_url)" : "File / Media URL"}
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/asset.jpg or /static/uploads/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Media Type & Display Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {language === "ar" ? "نوع الوسائط (media_type)" : "Media Type (MIME)"}
                  </label>
                  <input
                    type="text"
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    placeholder="image/jpeg, video/mp4, application/pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {language === "ar" ? "ترتيب العرض (display_order)" : "Display Order"}
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="rounded-xl border-white/10 text-muted-foreground hover:text-white text-xs"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || (!title && !textContent && !fileUrl)}
                  className="rounded-xl px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2 text-xs shadow-lg shadow-emerald-500/20"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {editingItem
                      ? language === "ar"
                        ? "حفظ التعديلات"
                        : "Save Changes"
                      : language === "ar"
                      ? "إضافة المحتوى"
                      : "Add Content"}
                  </span>
                </Button>
              </div>
            </GlassCard>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
