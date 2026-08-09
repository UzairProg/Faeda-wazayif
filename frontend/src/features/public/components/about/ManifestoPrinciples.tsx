/**
 * features/public/components/about/ManifestoPrinciples.tsx
 *
 * Product Manifesto detailing Faeda's 4 core trust and product principles.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { ShieldCheck, Eye, Sparkles, Layers } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function ManifestoPrinciples() {
  const { t } = useTranslation()

  const principles = [
    {
      num: "01",
      title: t("about.manifesto.p1Title"),
      desc: t("about.manifesto.p1Desc"),
      icon: Eye,
    },
    {
      num: "02",
      title: t("about.manifesto.p2Title"),
      desc: t("about.manifesto.p2Desc"),
      icon: ShieldCheck,
    },
    {
      num: "03",
      title: t("about.manifesto.p3Title"),
      desc: t("about.manifesto.p3Desc"),
      icon: Sparkles,
    },
    {
      num: "04",
      title: t("about.manifesto.p4Title"),
      desc: t("about.manifesto.p4Desc"),
      icon: Layers,
    },
  ]

  return (
    <section className="py-16 text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("about.manifesto.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight">
            {t("about.manifesto.title")}
          </h2>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((item) => {
            const IconComp = item.icon
            return (
              <GlassCard
                key={item.num}
                className="p-6 sm:p-8 bg-card/50 backdrop-blur-md border-white/10 text-start space-y-4 shadow-xl hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold font-mono text-white/20">{item.num}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold font-heading text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </GlassCard>
            )
          })}
        </div>

      </div>
    </section>
  )
}
