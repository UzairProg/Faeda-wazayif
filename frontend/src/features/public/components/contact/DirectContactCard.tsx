/**
 * features/public/components/contact/DirectContactCard.tsx
 *
 * Card displaying verified direct contact information.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { Mail, MapPin, Sparkles } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function DirectContactCard() {
  const { t } = useTranslation()

  return (
    <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 text-start shadow-2xl space-y-6 h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>{t("contact.direct.title")}</span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block mb-0.5">{t("contact.direct.emailLabel")}</span>
              <a
                href="mailto:contact@faedajobs.com"
                className="text-sm font-bold text-white font-mono hover:text-primary transition-colors block"
              >
                {t("contact.direct.emailValue")}
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block mb-0.5">{t("contact.direct.locationLabel")}</span>
              <span className="text-sm font-bold text-white block">{t("contact.direct.locationValue")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 text-xs text-muted-foreground/80 leading-relaxed">
        {t("contact.hero.subheading")}
      </div>
    </GlassCard>
  )
}
