import { HeroSection } from "../components/HeroSection"
import { EcosystemOverviewSection } from "../components/EcosystemOverviewSection"
import { InteractiveRoleExperienceSection } from "../components/InteractiveRoleExperienceSection"
import { ProfessionalJourneySection } from "../components/ProfessionalJourneySection"
import { MarketValueShowcaseSection } from "../components/MarketValueShowcaseSection"
import { FeaturedJobsSection } from "../components/FeaturedJobsSection"
import { ApplicationJourneySection } from "../components/ApplicationJourneySection"
import { TeamMarketplaceSection } from "../components/TeamMarketplaceSection"
import { AIExperienceSection } from "../components/AIExperienceSection"
import { WhyFaedaSection } from "../components/WhyFaedaSection"
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

      {/* 01. Hero Section (Presenter WebM video preserved) */}
      <HeroSection />

      {/* 02. What is Faeda? (Disconnected Tools vs. Faeda Ecosystem Diagram) */}
      <EcosystemOverviewSection />

      {/* 03. Who is it for? (Interactive Perspective Role Selector & Product UI Transformation) */}
      <InteractiveRoleExperienceSection />

      {/* 04. How does it work? (Professional Journey Step Timeline with Controlled 4s Auto-Advance) */}
      <ProfessionalJourneySection />

      {/* 05. Market Value Showcase & Interactive Factor Breakdown */}
      <MarketValueShowcaseSection />

      {/* 06. Opportunity Discovery (Single Primary Job Preview Card 1/3) */}
      <FeaturedJobsSection />

      {/* 07. Transparent Application Journey (Horizontal Visual Pipeline Bar) */}
      <ApplicationJourneySection />

      {/* 08. Specialized Teams Capability Visualization */}
      <TeamMarketplaceSection />

      {/* 09. Integrated Assistive AI ("الذكاء يساعدك، والقرار لك" — AI Workspace Demo) */}
      <AIExperienceSection />

      {/* 10. Why Choose Faeda? (4 Core Differentiators around Faeda Hub) */}
      <WhyFaedaSection />

      {/* 11. Compact Professional Knowledge Strip */}
      <CommunitySection />

      {/* 12. Simple Start / Join Ecosystem CTA */}
      <EcosystemCtaSection />
    </div>
  )
}
