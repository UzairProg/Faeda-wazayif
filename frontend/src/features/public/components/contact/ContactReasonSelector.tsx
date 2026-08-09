/**
 * features/public/components/contact/ContactReasonSelector.tsx
 *
 * Interactive selector cards for choosing the contact inquiry reason.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { HelpCircle, Headphones, Handshake, MessageCircleHeart } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"

interface ContactReasonSelectorProps {
  selectedReason: string
  onSelectReason: (reasonLabel: string) => void
}

export function ContactReasonSelector({
  selectedReason,
  onSelectReason,
}: ContactReasonSelectorProps) {
  const { t } = useTranslation()

  const reasons = [
    {
      id: "general",
      title: t("contact.reasons.general.title"),
      desc: t("contact.reasons.general.desc"),
      icon: HelpCircle,
    },
    {
      id: "support",
      title: t("contact.reasons.support.title"),
      desc: t("contact.reasons.support.desc"),
      icon: Headphones,
    },
    {
      id: "partnership",
      title: t("contact.reasons.partnership.title"),
      desc: t("contact.reasons.partnership.desc"),
      icon: Handshake,
    },
    {
      id: "suggestion",
      title: t("contact.reasons.suggestion.title"),
      desc: t("contact.reasons.suggestion.desc"),
      icon: MessageCircleHeart,
    },
  ]

  return (
    <div className="space-y-3 text-start">
      <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
        {t("contact.reasons.title")}
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reasons.map((r) => {
          const isSelected = selectedReason === r.title || selectedReason === r.id
          const IconComp = r.icon

          return (
            <GlassCard
              key={r.id}
              onClick={() => onSelectReason(r.title)}
              className={cn(
                "p-4 bg-card/60 backdrop-blur-md border-white/10 cursor-pointer transition-all text-start space-y-2 relative overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary/40"
                  : "hover:border-white/20 hover:bg-card/80"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors",
                  isSelected ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-muted-foreground"
                )}>
                  <IconComp className="w-5 h-5" />
                </div>
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  isSelected ? "bg-primary scale-100" : "bg-white/10 scale-75"
                )} />
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{r.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mt-0.5">{r.desc}</p>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
