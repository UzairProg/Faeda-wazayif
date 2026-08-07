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
    <div className="flex flex-col w-full bg-background min-h-screen">
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
