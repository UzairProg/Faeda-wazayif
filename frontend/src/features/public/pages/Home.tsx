import { HeroSection } from "../components/HeroSection"
import { TrustedBySection } from "../components/TrustedBySection"
import { PlatformStatsSection } from "../components/PlatformStatsSection"
import { FeaturesSection } from "../components/FeaturesSection"
import { HowItWorksSection } from "../components/HowItWorksSection"
import { FeaturedJobsSection } from "../components/FeaturedJobsSection"
import { FeaturedCompaniesSection } from "../components/FeaturedCompaniesSection"
import { AIExperienceSection } from "../components/AIExperienceSection"
import { CommunitySection } from "../components/CommunitySection"

export function Home() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative">
      
      {/* Global Ambient Gradients */}
      <div className="absolute top-[15%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[55%] right-[-5%] w-[700px] h-[700px] bg-[#0A2D8F]/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[75%] left-[-15%] w-[900px] h-[900px] bg-cyan-600/5 rounded-full blur-[200px] pointer-events-none -z-10" />

      <HeroSection />
      <TrustedBySection />
      <PlatformStatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedJobsSection />
      <FeaturedCompaniesSection />
      <AIExperienceSection />
      <CommunitySection />
    </div>
  )
}
