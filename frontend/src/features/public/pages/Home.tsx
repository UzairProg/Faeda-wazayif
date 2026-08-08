import { HeroSection } from "../components/HeroSection"
import { EcosystemOverviewSection } from "../components/EcosystemOverviewSection"
import { InteractiveRoleExperienceSection } from "../components/InteractiveRoleExperienceSection"
import { ProfessionalJourneySection } from "../components/ProfessionalJourneySection"
import { MarketValueShowcaseSection } from "../components/MarketValueShowcaseSection"
import { FeaturedJobsSection } from "../components/FeaturedJobsSection"
import { ApplicationJourneySection } from "../components/ApplicationJourneySection"
import { TeamMarketplaceSection } from "../components/TeamMarketplaceSection"
import { AIExperienceSection } from "../components/AIExperienceSection"
import { CommunitySection } from "../components/CommunitySection"
import { EcosystemCtaSection } from "../components/EcosystemCtaSection"

export function Home() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden">
      
      {/* Global Ambient Radial Washes */}
      <div className="absolute top-[8%] right-[-10%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-[28%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[55%] right-[-5%] w-[600px] h-[600px] bg-[#0A2D8F]/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[80%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* 1. Hero Section (Presenter WebM video preserved) */}
      <HeroSection />

      {/* 2. Visual Ecosystem Diagram (Candidate ↔ Company ↔ Team ↔ Education) */}
      <EcosystemOverviewSection />

      {/* 3. Major Interactive Role Experience ([ الكفاءات ] [ الشركات ] [ الفرق ] [ الجامعات ]) */}
      <InteractiveRoleExperienceSection />

      {/* 4. Interactive Professional Journey Step Timeline & Single UI Preview */}
      <ProfessionalJourneySection />

      {/* 5. Dedicated Market Value Showcase & Interactive Factor Breakdown */}
      <MarketValueShowcaseSection />

      {/* 6. Single Primary Interactive Job Preview (1 / 3) */}
      <FeaturedJobsSection />

      {/* 7. Application Journey Visual Pipeline Bar */}
      <ApplicationJourneySection />

      {/* 8. Specialized Teams Capability Visualization */}
      <TeamMarketplaceSection />

      {/* 9. Assistive AI Interactive Workspace Demo */}
      <AIExperienceSection />

      {/* 10. Compact Professional Knowledge Strip */}
      <CommunitySection />

      {/* 11. Simple Closing Ecosystem CTA */}
      <EcosystemCtaSection />
    </div>
  )
}
