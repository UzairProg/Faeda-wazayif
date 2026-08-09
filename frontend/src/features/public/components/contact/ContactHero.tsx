/**
 * features/public/components/contact/ContactHero.tsx
 *
 * Compact editorial hero for the Contact Us page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { MessageSquare } from "lucide-react"
import { useTranslation } from "@/i18n"

export function ContactHero() {
  const { t } = useTranslation()

  return (
    <div className="text-center max-w-2xl mx-auto space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        <MessageSquare className="w-4 h-4" />
        <span>{t("contact.hero.eyebrow")}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
        {t("contact.hero.heading")}
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {t("contact.hero.subheading")}
      </p>
    </div>
  )
}
