/**
 * features/public/components/contact/ContactForm.tsx
 *
 * Clean accessible Contact form with validation, submission state, error handling.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { useState } from "react"
import { Send, Loader2, AlertCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { submitContactForm } from "../../services/contact.service"
import { useTranslation } from "@/i18n"

interface ContactFormProps {
  selectedReason: string
  onReasonChange?: (reason: string) => void
  onSuccess: () => void
}

export function ContactForm({
  selectedReason,
  onSuccess,
}: ContactFormProps) {
  const { t } = useTranslation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage(t("contact.form.errors.nameRequired"))
      return
    }

    if (!email.trim()) {
      setErrorMessage(t("contact.form.errors.emailRequired"))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage(t("contact.form.errors.emailInvalid"))
      return
    }

    if (!message.trim()) {
      setErrorMessage(t("contact.form.errors.messageRequired"))
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        reason: selectedReason,
        message: message.trim(),
      })

      if (res.success) {
        onSuccess()
      } else {
        setErrorMessage(res.message || t("contact.form.errors.genericFail"))
      }
    } catch {
      setErrorMessage(t("contact.form.errors.genericFail"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-xs font-bold text-white block">
            {t("contact.form.nameLabel")} <span className="text-rose-400">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact.form.namePlaceholder")}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-xs font-bold text-white block">
            {t("contact.form.emailLabel")} <span className="text-rose-400">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("contact.form.emailPlaceholder")}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 text-start"
          />
        </div>

        {/* Selected Reason (read-only indicator) */}
        <div className="space-y-1.5">
          <label htmlFor="contact-reason" className="text-xs font-bold text-white block">
            {t("contact.form.reasonLabel")}
          </label>
          <input
            id="contact-reason"
            type="text"
            readOnly
            value={selectedReason}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/5 text-primary text-sm font-semibold cursor-not-allowed opacity-90"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="text-xs font-bold text-white block">
            {t("contact.form.messageLabel")} <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("contact.form.messagePlaceholder")}
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60 resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("contact.form.submittingBtn")}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t("contact.form.submitBtn")}</span>
            </>
          )}
        </Button>

      </form>
    </GlassCard>
  )
}
