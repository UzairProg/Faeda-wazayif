/**
 * CandidateProfilePage.tsx — Master Candidate Professional Identity & Onboarding Page.
 */
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
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
  const [searchParams] = useSearchParams()

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

  useEffect(() => {
    const sectionParam = searchParams.get("section")
    if (sectionParam) {
      if (sectionParam === "onboarding") {
        setIsOnboardingOpen(true)
      } else {
        const elem = document.getElementById(`${sectionParam}-section`)
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 200)
        }
      }
    }
  }, [searchParams])

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
      case "skills": {
        const skillsElem = document.getElementById("skills-section")
        if (skillsElem) skillsElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      case "education": {
        const eduElem = document.getElementById("education-section")
        if (eduElem) eduElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      case "experience": {
        const expElem = document.getElementById("experience-section")
        if (expElem) expElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      case "projects": {
        const projElem = document.getElementById("projects-section")
        if (projElem) projElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      case "certifications": {
        const certElem = document.getElementById("certifications-section")
        if (certElem) certElem.scrollIntoView({ behavior: "smooth" })
        break
      }
      case "preferences": {
        const prefElem = document.getElementById("preferences-section")
        if (prefElem) prefElem.scrollIntoView({ behavior: "smooth" })
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
      <div id="about-section">
        <AboutSection
          profile={profile}
          onUpdate={updateAbout.mutateAsync}
        />
      </div>

      {/* 4. Skills Tag Cloud */}
      <div id="skills-section">
        <SkillsSection
          profile={profile}
          onUpdate={updateSkills.mutateAsync}
        />
      </div>

      {/* 5. Experience & Education in a 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="experience-section">
          <ExperienceSection
            profile={profile}
            onUpdate={updateExperience.mutateAsync}
          />
        </div>
        <div id="education-section">
          <EducationSection
            profile={profile}
            onUpdate={updateEducation.mutateAsync}
          />
        </div>
      </div>

      {/* 6. CV & ATS Readiness */}
      <div id="cv-section">
        <CVSection
          profile={profile}
          onUploadCV={uploadCV.mutateAsync}
        />
      </div>

      {/* 7. Featured Projects */}
      <div id="projects-section">
        <ProjectsSection
          profile={profile}
          onSaveProject={saveProject.mutateAsync}
          onDeleteProject={deleteProject.mutateAsync}
        />
      </div>

      {/* 8. Certifications & Credentials */}
      <div id="certifications-section">
        <CertificationsSection
          profile={profile}
          onSaveCertification={saveCertification.mutateAsync}
          onDeleteCertification={deleteCertification.mutateAsync}
        />
      </div>

      {/* 9. Work Preferences */}
      <div id="preferences-section">
        <WorkPreferencesSection
          profile={profile}
          onUpdate={updatePreferences.mutateAsync}
        />
      </div>

      {/* 10. Privacy & Visibility Controls */}
      <div id="visibility-section">
        <VisibilitySection
          profile={profile}
          onUpdateVisibility={updateVisibility.mutateAsync}
        />
      </div>

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
