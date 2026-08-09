/**
 * features/public/components/contact/ContactSuccessState.tsx
 *
 * Success state card displayed after sending a message.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { CheckCircle2, RefreshCw } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"

interface ContactSuccessStateProps {
  onReset: () => void
}

export function ContactSuccessState({ onReset }: ContactSuccessStateProps) {
  const { t } = useTranslation()

  return (
    <GlassCard className="p-8 sm:p-12 bg-card/60 backdrop-blur-md border-emerald-500/30 text-center shadow-2xl space-y-5 relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold mx-auto shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-2xl font-extrabold font-heading text-white">
          {t("contact.success.title")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("contact.success.desc")}
        </p>
      </div>

      <div className="pt-2">
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-xl px-6 border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm gap-2 hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("contact.success.sendAnother")}</span>
        </Button>
      </div>
    </GlassCard>
  )
}
