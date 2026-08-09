/**
 * features/public/pages/ContactPage.tsx
 *
 * Public Contact Us page (/contact).
 * Concise, trustworthy, and clear contact experience connecting visitors directly to Flask backend /api/v1/contact.
 */
import { useState } from "react"
import { ContactHero } from "../components/contact/ContactHero"
import { ContactReasonSelector } from "../components/contact/ContactReasonSelector"
import { ContactForm } from "../components/contact/ContactForm"
import { ContactSuccessState } from "../components/contact/ContactSuccessState"
import { DirectContactCard } from "../components/contact/DirectContactCard"

export function ContactPage() {
  const [selectedReason, setSelectedReason] = useState("استفسار عام")
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <div className="flex flex-col w-full bg-background min-h-screen relative overflow-x-hidden pt-28 pb-20">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl space-y-10">
        
        {/* 01. Compact Hero */}
        <ContactHero />

        {/* 02. Reason Selector Cards */}
        <ContactReasonSelector
          selectedReason={selectedReason}
          onSelectReason={(r) => setSelectedReason(r)}
        />

        {/* 03. Form Grid: Left Form / Success State (7 cols) + Right Direct Info (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <ContactSuccessState onReset={() => setIsSubmitted(false)} />
            ) : (
              <ContactForm
                selectedReason={selectedReason}
                onReasonChange={(r) => setSelectedReason(r)}
                onSuccess={() => setIsSubmitted(true)}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <DirectContactCard />
          </div>

        </div>

      </div>
    </div>
  )
}
