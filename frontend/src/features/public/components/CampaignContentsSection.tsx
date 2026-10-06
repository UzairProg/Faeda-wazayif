import {
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Link as LinkIcon,
  ExternalLink,
  Download,
  Layers,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"
import type { CampaignContent } from "@/features/campaigns/types/campaign.types"

interface CampaignContentsSectionProps {
  contents?: CampaignContent[]
}

export function CampaignContentsSection({ contents = [] }: CampaignContentsSectionProps) {
  const { language } = useTranslation()

  if (!contents || contents.length === 0) return null

  // Sort by display order
  const sortedContents = [...contents].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  )

  return (
    <div className="space-y-6 pt-6 border-t border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>
            {language === "ar"
              ? "المحتويات والملفات المرفقة بالحملة"
              : language === "hi"
              ? "अभियान से जुड़ी सामग्री और मीडिया"
              : "Campaign Contents & Attachments"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
            {sortedContents.length}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedContents.map((item, idx) => {
          const type = item.content_type || "text"

          return (
            <GlassCard
              key={item.id || idx}
              className="p-5 rounded-2xl border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 bg-card/60 backdrop-blur-md"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                      type === "image"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : type === "video"
                        ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        : type === "document"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : type === "link"
                        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {type === "image" && <ImageIcon className="w-3.5 h-3.5" />}
                    {type === "video" && <Video className="w-3.5 h-3.5" />}
                    {type === "document" && <FileCode className="w-3.5 h-3.5" />}
                    {type === "link" && <LinkIcon className="w-3.5 h-3.5" />}
                    {type === "text" && <FileText className="w-3.5 h-3.5" />}
                    <span>
                      {type === "image"
                        ? language === "ar"
                          ? "صورة مرفقة"
                          : "Image"
                        : type === "video"
                        ? language === "ar"
                          ? "فيديو توضيحي"
                          : "Video"
                        : type === "document"
                        ? language === "ar"
                          ? "كتيب / مستند"
                          : "Document"
                        : type === "link"
                        ? language === "ar"
                          ? "رابط خارجي"
                          : "Resource"
                        : language === "ar"
                        ? "مقال / تفصيل"
                        : "Article"}
                    </span>
                  </span>

                  <span className="text-[11px] font-mono text-muted-foreground">#{idx + 1}</span>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {item.title || (language === "ar" ? "محتوى إضافي" : "Additional Content")}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Media Preview: Image */}
                {type === "image" && item.file_url && (
                  <div className="rounded-xl overflow-hidden border border-white/10 relative group">
                    <img
                      src={item.file_url}
                      alt={item.title || "Campaign attachment"}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => item.file_url && window.open(item.file_url, '_blank')}
                    />
                  </div>
                )}

                {/* Media Preview: Video */}
                {type === "video" && item.file_url && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <video
                      src={item.file_url}
                      controls
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Detailed Text Content */}
                {item.text_content && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {item.text_content}
                  </div>
                )}
              </div>

                {/* Actions: Download / Open Link */}
              {item.file_url && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {type === "document" ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === "ar" ? "تحميل أو فتح الملف (PDF)" : "Download / View PDF"}</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === "ar" ? "عرض المرفق كاملاً" : "View Attachment"}</span>
                      </>
                    )}
                  </a>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
