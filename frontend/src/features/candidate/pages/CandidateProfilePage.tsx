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
import { UserPublishedCampaignsSection } from "@/features/public/components/UserPublishedCampaignsSection"
import { OnboardingWizardModal } from "../components/OnboardingWizardModal"
import { FaedaProfileOptimizerModal } from "../components/FaedaProfileOptimizerModal"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react"
import { LoadingState } from "@/shared/components/states/LoadingState"
import { ErrorState } from "@/shared/components/states/ErrorState"
import { useTranslation } from "@/i18n"

export function CandidateProfilePage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const { language } = useTranslation()
  const L = (ar: string, en: string, hi?: string) =>
    language === "ar" ? ar : language === "hi" ? (hi || en) : en

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
          title={L("تعذر تحميل الملف المهني", "Unable to load candidate profile", "प्रोफ़ाइल लोड करने में असमर्थ")}
          description={
            error instanceof Error
              ? error.message
              : L(
                  "حدث خطأ أثناء جلب بياناتك المهنية. تأكد من اتصالك بالإنترنت.",
                  "An error occurred while fetching your profile. Please check your connection.",
                  "आपकी प्रोफ़ाइल प्राप्त करते समय एक त्रुटि हुई। कृपया अपना कनेक्शन जांचें।"
                )
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

      {/* 2.5 Faeda Profile AI Audit & Optimization Banner */}
      <GlassCard className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-500/30 shadow-xl rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {L("مطور ومحلل ملف فائدة الذكي", "Faeda Profile Optimizer & Saudi Tech Benchmark", "फायदा प्रोफाइल ऑप्टिमाइज़र")}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  All-Star Audit
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {L(
                  "تحسين ملفك المهني على منصة فائدة لمطابقة متطلبات السوق السعودي والخليجي 2026 وزيادة فرص التوظيف والمقابلات.",
                  "Optimize your Faeda profile for Saudi and GCC career opportunities. Audit headline, summary, and skills against 2026 tech benchmarks.",
                  "सऊदी और जीसीसी नौकरी बाजार के लिए अपनी फायदा प्रोफाइल को अनुकूलित करें।"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <Button
              onClick={() => setIsOptimizerModalOpen(true)}
              className="text-xs font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white shadow-lg shadow-cyan-600/30 gap-2 rounded-xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{L("تحسين ملف فائدة الآن", "Optimize Faeda Profile", "फायदा प्रोफाइल सुधारें")}</span>
              {language === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </GlassCard>

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

      {/* 11. Published Campaigns & Community Posts */}
      <div id="campaigns-section">
        <UserPublishedCampaignsSection
          userType="candidate"
          userId={profile?.id}
          title={L("منشوراتي ومشاريعي المنشورة", "My Published Campaigns & Projects", "मेरे प्रकाशित अभियान और परियोजनाएं")}
          description={L(
            "عرض التفاعل والإحصائيات الخاصة بالمشاريع والمنشورات المهنية التي شاركتها في مجتمع فائدة.",
            "Track real-time engagement and insights for your campaigns and projects shared in Faeda.",
            "फायदा समुदाय में साझा किए गए अपने अभियानों और परियोजनाओं के लिए रीयल-टाइम जुड़ाव और अंतर्दृष्टि ट्रैक करें।"
          )}
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

      {/* AI Faeda Profile Optimizer Modal */}
      <FaedaProfileOptimizerModal
        isOpen={isOptimizerModalOpen}
        onClose={() => setIsOptimizerModalOpen(false)}
        initialData={{
          candidate_name: profile.fullname,
          role: profile.preferred_field_of_work || "Full Stack Developer",
          headline: profile.about ? profile.about.slice(0, 100) : "",
          about: profile.about || "",
          skills: profile.skills || [],
          experienceYears: profile.years_of_skills ? parseInt(profile.years_of_skills, 10) || 3 : 3,
          location: [profile.government, profile.country].filter(Boolean).join("، ") || "الرياض، المملكة العربية السعودية",
          education: profile.educational_qualification || profile.university,
          projects_count: profile.projects?.length || 0,
          certifications_count: profile.certifications?.length || 0,
          has_cv: Boolean(profile.cv),
        }}
        onApplyHeadline={async (newHeadline) => {
          await updateAbout.mutateAsync({ about: newHeadline })
          refetch()
        }}
        onApplyAbout={async (newAbout) => {
          await updateAbout.mutateAsync({ about: newAbout })
          refetch()
        }}
        onAddSkill={async (newSkill) => {
          const currentSkills = profile.skills || []
          if (!currentSkills.includes(newSkill)) {
            await updateSkills.mutateAsync({ skills: [...currentSkills, newSkill] })
            refetch()
          }
        }}
      />
    </div>
  )
}
export default CandidateProfilePage
