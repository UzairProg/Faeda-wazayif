/**
 * features/public/components/about/AboutCta.tsx
 *
 * Closing editorial CTA banner for the About page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function AboutCta() {
  const { t, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="py-20 text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <GlassCard className="p-8 sm:p-14 bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 text-center shadow-2xl relative overflow-hidden space-y-6">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mx-auto">
            <Sparkles className="w-4 h-4" />
            <span>{t("about.cta.title")}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {t("about.cta.subtitle")}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to={ROUTES.JOBS.LIST}>
              <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2 shadow-lg shadow-primary/20">
                <span>{t("about.cta.primaryBtn")}</span>
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>

            <Link to={ROUTES.AUTH.REGISTER}>
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10">
                <span>{t("about.cta.secondaryBtn")}</span>
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
