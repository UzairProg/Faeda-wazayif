/**
 * features/public/pages/AboutPage.tsx
 *
 * Public About Experience page (/about).
 * Assembles the 8 narrative sections detailing Faeda's product philosophy, purpose,
 * ecosystem connectivity, trust principles, AI philosophy, and future direction.
 */
import { AboutHero } from "../components/about/AboutHero"
import { WhyFaedaExists } from "../components/about/WhyFaedaExists"
import { EcosystemMap } from "../components/about/EcosystemMap"
import { AudienceSwitcher } from "../components/about/AudienceSwitcher"
import { ManifestoPrinciples } from "../components/about/ManifestoPrinciples"
import { AiPhilosophyVisualizer } from "../components/about/AiPhilosophyVisualizer"
import { ProductDirection } from "../components/about/ProductDirection"
import { AboutCta } from "../components/about/AboutCta"

export function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden">
      {/* 01 — Hero / What is Faeda? */}
      <AboutHero />

      {/* 02 — Why Faeda Exists (Transformation Flow) */}
      <WhyFaedaExists />

      {/* 03 — One Ecosystem Connected Map */}
      <EcosystemMap />

      {/* 04 — Who We Build For (Role Switcher) */}
      <AudienceSwitcher />

      {/* 05 — Product Principles (Vertical Manifesto) */}
      <ManifestoPrinciples />

      {/* 06 — AI Philosophy ("الذكاء يساعدك، والقرار لك") */}
      <AiPhilosophyVisualizer />

      {/* 07 — Direction / What Comes Next */}
      <ProductDirection />

      {/* 08 — Closing Editorial CTA */}
      <AboutCta />
    </div>
  )
}
