/**
 * CandidateProfilePage.tsx — Master Candidate Professional Identity & Onboarding Page.
 */
import { useState } from "react"
import { useCandidateProfile } from "../hooks/useCandidateProfile"
import { CandidateProfileHeader } from "../components/CandidateProfileHeader"
import { ProfileCompletionCard } from "../components/ProfileCompletionCard"
import { AboutSection } from "../components/AboutSection"
import { SkillsSection } from "../components/SkillsSection"
import { ExperienceSection } from "../components/ExperienceSection"
import { EducationSection } from "../components/EducationSection"
import { ProjectsSection } from "../components/ProjectsSection"
import { CertificationsSection } from "../components/CertificationsSection"
import { CVSection } from "../components/CVSection"
import { WorkPreferencesSection } from "../components/WorkPreferencesSection"
import { VisibilitySection } from "../components/VisibilitySection"
import { OnboardingWizardModal } from "../components/OnboardingWizardModal"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { ErrorState } from "@/shared/components/states/ErrorState"

export function CandidateProfilePage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    updateIdentity,
    updateAbout,
    updateSkills,
    updateExperience,
    updateEducation,
    saveProject,
    deleteProject,
    saveCertification,
    deleteCertification,
    updatePreferences,
    updateVisibility,
    uploadCV,
  } = useCandidateProfile()

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState variant="page" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="py-12">
        <ErrorState
          title="تعذر تحميل الملف المهني"
          description={
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء جلب بياناتك المهنية. تأكد من اتصالك بالإنترنت."
          }
          onRetry={() => {
            refetch()
          }}
        />
      </div>
    )
  }

  const handleCompletenessAction = (key: string) => {
    switch (key) {
      case "basic_info":
      case "headline_about":
        window.scrollTo({ top: 0, behavior: "smooth" })
        break
      case "cv": {
        const cvElem = document.getElementById("cv-section")
        if (cvElem) cvElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      default:
        setIsOnboardingOpen(true)
        break
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-16">
      {/* 1. Master Identity Header */}
      <CandidateProfileHeader
        profile={profile}
        onUpdate={updateIdentity.mutateAsync}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 2. Transparent Profile Completeness / Strength Card */}
      <ProfileCompletionCard
        profile={profile}
        onActionClick={handleCompletenessAction}
      />

      {/* 3. About / Summary */}
      <AboutSection
        profile={profile}
        onUpdate={updateAbout.mutateAsync}
      />

      {/* 4. Skills Tag Cloud */}
      <SkillsSection
        profile={profile}
        onUpdate={updateSkills.mutateAsync}
      />

      {/* 5. Experience & Education in a 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExperienceSection
          profile={profile}
          onUpdate={updateExperience.mutateAsync}
        />
        <EducationSection
          profile={profile}
          onUpdate={updateEducation.mutateAsync}
        />
      </div>

      {/* 6. CV & ATS Readiness */}
      <CVSection
        profile={profile}
        onUploadCV={uploadCV.mutateAsync}
      />

      {/* 7. Featured Projects */}
      <ProjectsSection
        profile={profile}
        onSaveProject={saveProject.mutateAsync}
        onDeleteProject={deleteProject.mutateAsync}
      />

      {/* 8. Certifications & Credentials */}
      <CertificationsSection
        profile={profile}
        onSaveCertification={saveCertification.mutateAsync}
        onDeleteCertification={deleteCertification.mutateAsync}
      />

      {/* 9. Work Preferences */}
      <WorkPreferencesSection
        profile={profile}
        onUpdate={updatePreferences.mutateAsync}
      />

      {/* 10. Privacy & Visibility Controls */}
      <VisibilitySection
        profile={profile}
        onUpdateVisibility={updateVisibility.mutateAsync}
      />

      {/* Progressive Multi-Step Onboarding Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        profile={profile}
        onUpdateIdentity={updateIdentity.mutateAsync}
        onUpdateSkills={updateSkills.mutateAsync}
        onUpdateEducation={updateEducation.mutateAsync}
        onUpdateExperience={updateExperience.mutateAsync}
        onUploadCV={uploadCV.mutateAsync}
        onUpdatePreferences={updatePreferences.mutateAsync}
        onUpdateVisibility={updateVisibility.mutateAsync}
      />
    </div>
  )
}
export default CandidateProfilePage
