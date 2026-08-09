/**
 * features/public/components/about/EcosystemMap.tsx
 *
 * Interactive breakdown of Faeda's 4 core ecosystem pillars.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { UserCheck, Building2, Users, GraduationCap } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { useTranslation } from "@/i18n"

export function EcosystemMap() {
  const { t } = useTranslation()

  const pillars = [
    {
      title: t("about.ecosystem.candidates.title"),
      desc: t("about.ecosystem.candidates.desc"),
      icon: UserCheck,
      color: "from-blue-500/20 to-primary/20 border-primary/30 text-primary",
    },
    {
      title: t("about.ecosystem.employers.title"),
      desc: t("about.ecosystem.employers.desc"),
      icon: Building2,
      color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400",
    },
    {
      title: t("about.ecosystem.teams.title"),
      desc: t("about.ecosystem.teams.desc"),
      icon: Users,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
    },
    {
      title: t("about.ecosystem.education.title"),
      badge: t("about.ecosystem.education.badge"),
      desc: t("about.ecosystem.education.desc"),
      icon: GraduationCap,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    },
  ]

  return (
    <section className="py-16 text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <span>{t("about.ecosystem.badge")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight sm:text-4xl leading-tight">
            {t("about.ecosystem.title")}
          </h2>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const IconComp = pillar.icon
            return (
              <GlassCard
                key={pillar.title}
                className={`p-6 bg-gradient-to-br ${pillar.color} border text-start space-y-4 relative overflow-hidden transition-all hover:scale-[1.02] shadow-xl`}
              >
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center font-bold shadow-md">
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold font-heading text-white text-lg">{pillar.title}</h3>
                    {pillar.badge && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {pillar.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </GlassCard>
            )
          })}
        </div>

      </div>
    </section>
  )
}
